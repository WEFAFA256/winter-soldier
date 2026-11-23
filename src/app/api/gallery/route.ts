import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createHash } from 'node:crypto';
import { v2 as cloudinary } from 'cloudinary';
import { isAdmin } from '@/lib/admin-auth';
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES, looksLikeImage } from '@/lib/image-validation';
import { workerApi, workerBase } from '@/lib/r2-media';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const dataFilePath = path.join(process.cwd(), 'public', 'gallery.json');

const CLOUDINARY_URL = /^https?:\/\/res\.cloudinary\.com\//i;
const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};
const TYPE_BY_EXT: Record<string, string> = Object.fromEntries(
  Object.entries(EXT_BY_TYPE).map(([type, ext]) => [ext, type])
);

const isCloudinaryUrl = (value: unknown) => typeof value === 'string' && CLOUDINARY_URL.test(value);

function imageType(src: unknown, fallback = 'image/jpeg'): string {
  const match = typeof src === 'string' ? src.match(/\.([a-z0-9]{2,5})(?:[?#].*)?$/i) : null;
  return (match && TYPE_BY_EXT[match[1].toLowerCase()]) || fallback;
}

function signedCloudinaryImageUrl(image: any): string | null {
  const publicId = String(image?.id || '').trim();
  if (!cloudName || !publicId) return null;
  const format = EXT_BY_TYPE[imageType(image?.src)] || 'jpg';
  return cloudinary.utils.private_download_url(publicId, format, {
    resource_type: 'image',
    type: 'upload',
    attachment: false,
  });
}

function migrationKey(image: any, contentType: string): string {
  const basis = `${image?.id || ''}|${image?.src || ''}`;
  const hash = createHash('sha256').update(basis).digest('hex');
  return `media/image/migrated/${hash}.${EXT_BY_TYPE[contentType] || 'jpg'}`;
}

async function migrateOneGalleryImage(image: any): Promise<any | null> {
  try {
    const signedUrl = signedCloudinaryImageUrl(image);
    if (!signedUrl) {
      console.error('Gallery migration needs signed Cloudinary credentials');
      return null;
    }

    const source = await fetch(signedUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(20_000),
    });
    if (!source.ok) {
      console.error('Signed Cloudinary image read failed:', source.status);
      return null;
    }

    const contentType = String(source.headers.get('content-type') || imageType(image?.src))
      .split(';')[0]
      .trim()
      .toLowerCase();
    if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
      console.error('Unsupported migrated image type:', contentType);
      return null;
    }

    const bytes = new Uint8Array(await source.arrayBuffer());
    if (!bytes.byteLength || bytes.byteLength > MAX_UPLOAD_BYTES) {
      console.error('Migrated image has invalid size:', bytes.byteLength);
      return null;
    }
    if (!looksLikeImage(bytes, contentType)) {
      console.error('Migrated image bytes do not match:', contentType);
      return null;
    }

    const key = migrationKey(image, contentType);
    const ticketResult = await workerApi('/api/media/ticket', {
      method: 'POST',
      body: JSON.stringify({ kind: 'image', contentType, size: bytes.byteLength, key }),
    });
    const ticket = ticketResult.data?.ticket;
    if (!ticketResult.response.ok || !ticket) {
      console.error('Migration upload ticket failed:', ticketResult.response.status);
      return null;
    }

    const uploaded = await workerApi(
      '/media/upload',
      {
        method: 'POST',
        body: bytes,
        headers: { 'content-type': contentType, 'x-upload-ticket': String(ticket) },
      },
      { admin: false }
    );
    if (!uploaded.response.ok) {
      console.error('Migration upload failed:', uploaded.response.status);
      return null;
    }

    const record: any = { ...image };
    record.src = uploaded.data?.url || uploaded.data?.secure_url || `${workerBase()}/${key}`;
    record.key = uploaded.data?.key || key;
    return record;
  } catch (error: any) {
    console.error('Gallery migration error:', error?.message || error);
    return null;
  }
}

async function migrateCloudinaryGallery(images: any[]): Promise<any[] | null> {
  if (!Array.isArray(images) || !images.some((image) => isCloudinaryUrl(image?.src))) return images;

  const migratedImages = [...images];
  let changed = false;
  for (let index = 0; index < images.length; index += 1) {
    if (!isCloudinaryUrl(images[index]?.src)) continue;
    const migrated = await migrateOneGalleryImage(images[index]);
    if (migrated) {
      migratedImages[index] = migrated;
      changed = true;
    }
  }
  if (!changed) return null;

  const saved = await workerApi('/api/gallery', {
    method: 'POST',
    body: JSON.stringify({ images: migratedImages }),
  });
  if (!saved.response.ok) {
    console.error('Could not persist migrated gallery:', saved.response.status);
    return null;
  }
  return Array.isArray(saved.data?.images) ? saved.data.images : migratedImages;
}

function safeContextValue(value: unknown, fallback = 'Serenity Spa Gallery'): string {
  return String(value || '')
    .replace(/[|=]/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200) || fallback;
}

function readContextValues(resource: any): Record<string, unknown> {
  const context = resource?.context;
  if (!context || typeof context !== 'object') return {};
  const custom = (context as any).custom;
  if (custom && typeof custom === 'object') {
    return { ...(context as Record<string, unknown>), ...(custom as Record<string, unknown>) };
  }
  return context as Record<string, unknown>;
}

const readLocalData = (): any[] => {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
    const parsed = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading local gallery data:', error);
    return [];
  }
};

async function readCloudinaryGallery(): Promise<any[] | null> {
  try {
    const result: any = await cloudinary.search
      .expression('folder:serenity_gallery')
      .with_field('context')
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();

    const localMap = new Map<string, any>();
    readLocalData().forEach((img: any) => {
      if (img.id) localMap.set(img.id, img);
      if (img.src) localMap.set(img.src, img);
    });

    return (result.resources || []).map((resource: any) => {
      const id = String(resource.public_id);
      const src = String(resource.secure_url);
      const matched = localMap.get(id) || localMap.get(src);
      const custom = readContextValues(resource);
      return {
        id,
        src,
        alt: safeContextValue(custom.alt, matched?.alt || 'Serenity Spa Gallery'),
        delay: 'delay-100',
        availability: custom.availability === 'in-session'
          ? 'in-session'
          : custom.availability === 'available'
            ? 'available'
            : matched?.availability || 'available',
      };
    });
  } catch (error: any) {
    console.error('Cloudinary gallery fallback failed:', error?.message || error);
    return null;
  }
}

export async function GET() {
  try {
    const { response, data } = await workerApi<{ ok?: boolean; images?: any[] }>(
      '/api/gallery',
      {},
      { admin: false }
    );
    if (response.ok && Array.isArray(data?.images) && data.images.length) {
      const migrated = await migrateCloudinaryGallery(data.images);
      return NextResponse.json(migrated || data.images, { headers: { 'cache-control': 'no-store' } });
    }
  } catch (error: any) {
    console.error('R2 gallery read failed:', error?.message || error);
  }

  // One-time migration only. The Cloudinary listing is read with signed
  // credentials, each image is copied into R2, and Cloudinary URLs are never
  // written back into the durable gallery index.
  const cloudImages = await readCloudinaryGallery();
  if (cloudImages?.length) {
    const migrated = await migrateCloudinaryGallery(cloudImages);
    if (migrated?.length) {
      return NextResponse.json(migrated, { headers: { 'cache-control': 'no-store' } });
    }
  }

  return NextResponse.json(
    readLocalData()
      .filter((item: any) => !isCloudinaryUrl(item?.src))
      .map((item) => ({ ...item, availability: item.availability || 'available' })),
    { headers: { 'cache-control': 'no-store' } }
  );
}

export async function POST(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const image = body?.image || body;
    if (!image || typeof image.id !== 'string' || !image.id.startsWith('serenity_gallery/') ||
        typeof image.src !== 'string' || !image.src) {
      return NextResponse.json({ error: 'A valid gallery image is required' }, { status: 400 });
    }
    if (isCloudinaryUrl(image.src)) {
      return NextResponse.json(
        { error: 'Cloudinary URLs are no longer accepted; upload the image to R2 first' },
        { status: 400 }
      );
    }

    const { response, data } = await workerApi('/api/gallery', {
      method: 'POST',
      body: JSON.stringify({ image }),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Could not save the image to the media store' },
        { status: 502 }
      );
    }

    try {
      const local = readLocalData().filter((item: any) => item?.id !== image.id);
      fs.writeFileSync(dataFilePath, JSON.stringify([image, ...local], null, 2), 'utf8');
    } catch {
      // best-effort local mirror only
    }

    return NextResponse.json({ message: 'Image added to R2 gallery', image: data?.image || image }, { status: 201 });
  } catch (error: any) {
    console.error('Gallery add error:', error?.message || error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const { id, availability, alt } = body || {};
    if (!id || typeof id !== 'string' || !id.startsWith('serenity_gallery/') ||
        !['available', 'in-session'].includes(availability)) {
      return NextResponse.json({ error: 'A valid gallery id and availability are required' }, { status: 400 });
    }

    const { response, data } = await workerApi('/api/gallery', {
      method: 'PATCH',
      body: JSON.stringify({ id, availability, alt }),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Could not update availability in the media store' },
        { status: 502 }
      );
    }

    try {
      const local = readLocalData().map((img: any) =>
        img.id === id ? { ...img, availability } : img
      );
      fs.writeFileSync(dataFilePath, JSON.stringify(local, null, 2), 'utf8');
    } catch {
      // best-effort
    }

    return NextResponse.json({ message: 'Availability updated', id, availability });
  } catch (error: any) {
    console.error('Gallery PATCH error:', error?.message || error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = new URL(req.url).searchParams.get('id');
    if (!id || !id.startsWith('serenity_gallery/')) {
      return NextResponse.json({ error: 'A valid gallery image ID is required' }, { status: 400 });
    }

    const { response, data } = await workerApi(`/api/gallery?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Could not delete the image from the media store' },
        { status: 502 }
      );
    }

    try {
      fs.writeFileSync(
        dataFilePath,
        JSON.stringify(readLocalData().filter((img: any) => img.id !== id), null, 2),
        'utf8'
      );
    } catch {
      // best-effort
    }

    return NextResponse.json({ message: 'Image removed successfully' });
  } catch (error: any) {
    console.error('Gallery DELETE error:', error?.message || error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
