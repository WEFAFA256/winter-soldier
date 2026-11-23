import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { isAdmin } from '@/lib/admin-auth';
import { workerApi } from '@/lib/r2-media';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const dataFilePath = path.join(process.cwd(), 'public', 'gallery.json');

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

async function seedR2Gallery(images: any[]): Promise<void> {
  try {
    const { response } = await workerApi('/api/gallery', {
      method: 'POST',
      body: JSON.stringify({ images }),
    });
    if (!response.ok) console.error('Could not seed R2 gallery:', response.status);
  } catch (error: any) {
    console.error('Could not seed R2 gallery:', error?.message || error);
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
      return NextResponse.json(data.images, { headers: { 'cache-control': 'no-store' } });
    }
  } catch (error: any) {
    console.error('R2 gallery read failed:', error?.message || error);
  }

  // One-time migration read. Cloudinary is no longer trusted for writes.
  const cloudImages = await readCloudinaryGallery();
  if (cloudImages && cloudImages.length) {
    await seedR2Gallery(cloudImages);
    return NextResponse.json(cloudImages, { headers: { 'cache-control': 'no-store' } });
  }

  return NextResponse.json(
    readLocalData().map((item) => ({ ...item, availability: item.availability || 'available' })),
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
