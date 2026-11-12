import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'njzctr4m',
  api_key: process.env.CLOUDINARY_API_KEY || '143573632263644',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'bRjjHhCZmsSnqvoJHhKg5D9SMOA',
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

    const cloudinaryImages = (cloudinaryRes.resources || []).map((resource: any) => ({
      id: resource.public_id,
      src: resource.secure_url,
      alt: resource.context?.custom?.alt || 'Serenity Spa Gallery',
      delay: 'delay-100',
    }));

    const localImages = readLocalData();
    const combined = [...cloudinaryImages, ...localImages];

    // Deduplicate by src / id
    const seen = new Set();
    const unique = combined.filter((item: any) => {
      const key = item.id || item.src;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json(unique);
  } catch (error) {
    console.error('Error fetching from Cloudinary, falling back to local JSON:', error);
    return NextResponse.json(readLocalData());
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')?.trim();
    if (authHeader !== 'Bearer Serenityspa256.') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;
    const alt = (formData.get('alt') as string) || 'Serenity Spa Gallery';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'serenity_gallery',
          resource_type: 'image',
          context: `alt=${alt}`,
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

export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')?.trim();
    if (authHeader !== 'Bearer Serenityspa256.') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
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
