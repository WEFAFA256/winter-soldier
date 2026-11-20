import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { isAdmin } from '@/lib/admin-auth';
import { validateImage } from '@/lib/image-validation';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const dataFilePath = path.join(process.cwd(), 'public', 'gallery.json');

const readLocalData = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading local gallery data:', error);
    return [];
  }
};

export async function GET() {
  try {
    const cloudinaryRes = await cloudinary.search
      .expression('folder:serenity_gallery')
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();

    const localImages = readLocalData();
    const localMap = new Map();
    localImages.forEach((img: any) => {
      if (img.id) localMap.set(img.id, img);
      if (img.src) localMap.set(img.src, img);
    });

    const cloudinaryImages = (cloudinaryRes.resources || []).map((resource: any) => {
      const id = resource.public_id;
      const src = resource.secure_url;
      const matched = localMap.get(id) || localMap.get(src);
      return {
        id,
        src,
        alt: matched?.alt || resource.context?.custom?.alt || 'Serenity Spa Gallery',
        delay: 'delay-100',
        // Cloudinary context is the source of truth — Vercel's filesystem is
        // read-only, so a local JSON write can never persist availability.
        availability: resource.context?.custom?.availability === 'in-session'
          ? 'in-session'
          : resource.context?.custom?.availability === 'available'
            ? 'available'
            : matched?.availability || 'available',
      };
    });

    // Only keep genuinely local images; stale local copies of Cloudinary images
    // would otherwise resurrect deleted photos on every read.
    const localOnly = localImages.filter((img: any) =>
      !String(img.id || '').startsWith('serenity_gallery/') &&
      !String(img.src || '').includes('res.cloudinary.com')
    );
    const combined = [...cloudinaryImages, ...localOnly];

    // Deduplicate by src / id
    const seen = new Set();
    const unique = combined
      .filter((item: any) => {
        const key = item.id || item.src;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((item: any) => ({
        ...item,
        availability: item.availability || 'available',
      }));

    return NextResponse.json(unique);
  } catch (error) {
    console.error('Error fetching from Cloudinary, falling back to local JSON:', error);
    const local = readLocalData().map((item: any) => ({
      ...item,
      availability: item.availability || 'available',
    }));
    return NextResponse.json(local);
  }
}

export async function POST(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;
    const alt = (formData.get('alt') as string) || 'Serenity Spa Gallery';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image is too large (max 10 MB)' }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const invalid = validateImage({ type: file.type, size: file.size }, buffer);
    if (invalid) {
      return NextResponse.json({ error: invalid }, { status: 415 });
    }

    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'serenity_gallery',
          resource_type: 'image',
          context: `alt=${alt}|availability=available`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    const newImage = {
      id: uploadResult.public_id,
      src: uploadResult.secure_url,
      alt,
      delay: 'delay-100',
      availability: 'available',
    };

    try {
      const local = readLocalData();
      local.unshift(newImage);
      fs.writeFileSync(dataFilePath, JSON.stringify(local, null, 2), 'utf8');
    } catch (e) {}

    return NextResponse.json(
      { message: 'Image uploaded successfully to Cloudinary', image: newImage },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in POST to Cloudinary:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, availability } = await req.json();
    if (!id || typeof id !== 'string' || !id.startsWith('serenity_gallery/') ||
        !['available', 'in-session'].includes(availability)) {
      return NextResponse.json({ error: 'A valid gallery id and availability are required' }, { status: 400 });
    }

    // Cloudinary context is the durable store — Vercel's filesystem is
    // read-only, so writing gallery.json alone never survives a redeploy.
    let alt = 'Serenity Spa Gallery';
    try {
      const resource: any = await cloudinary.api.resource(id);
      alt = resource?.context?.custom?.alt || alt;
    } catch (e) {
      console.error('Could not read Cloudinary context for', id, e);
    }
    await cloudinary.api.update(id, {
      context: `alt=${alt}|availability=${availability}`,
    });

    // Best-effort mirror for local development.
    try {
      const local = readLocalData();
      let updated = false;
      const newLocal = local.map((img: any) => {
        if (img.id === id) {
          updated = true;
          return { ...img, availability };
        }
        return img;
      });
      if (!updated) newLocal.push({ id, availability });
      fs.writeFileSync(dataFilePath, JSON.stringify(newLocal, null, 2), 'utf8');
    } catch (e) {
      console.error('Error writing gallery.json (non-fatal):', e);
    }

    return NextResponse.json({ message: 'Availability updated', id, availability });
  } catch (error: any) {
    console.error('Error in PATCH:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || !id.startsWith('serenity_gallery/')) {
      return NextResponse.json({ error: 'A valid gallery image ID is required' }, { status: 400 });
    }

    try {
      await cloudinary.uploader.destroy(id);
    } catch (cErr) {
      console.error('Cloudinary destroy error:', cErr);
    }

    try {
      let local = readLocalData();
      local = local.filter((img: any) => img.id !== id);
      fs.writeFileSync(dataFilePath, JSON.stringify(local, null, 2), 'utf8');
    } catch (e) {}

    return NextResponse.json({ message: 'Image removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
