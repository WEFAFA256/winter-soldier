import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'njzctr4m',
  api_key: process.env.CLOUDINARY_API_KEY || '143573632263644',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'bRjjHhCZmsSnqvoJHhKg5D9SMOA',
});

const contentFilePath = path.join(process.cwd(), 'public', 'site-content.json');

const readLocalContent = () => {
  try {
    if (!fs.existsSync(contentFilePath)) {
      return {};
    }
    const data = fs.readFileSync(contentFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading local site-content data:', error);
    return {};
  }
};

export async function GET() {
  try {
    // Read from Cloudinary raw upload using a cache buster
    const cloudUrl = `https://res.cloudinary.com/njzctr4m/raw/upload/site-content.json?cb=${Date.now()}`;
    const res = await fetch(cloudUrl, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.services || data.spaContent || data.homepage)) {
        return NextResponse.json(data);
      }
    }
    return NextResponse.json(readLocalContent());
  } catch (error: any) {
    console.error('Error fetching content from Cloudinary, falling back to local JSON:', error.message);
    return NextResponse.json(readLocalContent());
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')?.trim();
    if (authHeader !== 'Bearer Serenityspa256.') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newContent = await req.json();
    const jsonStr = JSON.stringify(newContent, null, 2);

    // Upload to Cloudinary as raw json asset
    await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        'data:text/plain;base64,' + Buffer.from(jsonStr).toString('base64'),
        {
          public_id: 'site-content.json',
          resource_type: 'raw',
          invalidate: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // Also update local copy in public/ if writable
    try {
      fs.writeFileSync(contentFilePath, jsonStr, 'utf8');
    } catch (e) {
      // Ignored in read-only serverless environments
    }

    return NextResponse.json(
      { message: 'Content updated successfully in Cloudinary', content: newContent },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in POST content:', error.message);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
