import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAdmin } from '@/lib/admin-auth';
import { workerApi } from '@/lib/r2-media';

const dataFilePath = path.join(process.cwd(), 'public', 'gallery.json');

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

export async function GET() {
  try {
    const { response, data } = await workerApi<{ ok?: boolean; images?: any[] }>(
      '/api/gallery',
      {},
      { admin: false }
    );
    if (response.ok && Array.isArray(data?.images) && data.images.length) {
      return NextResponse.json(data.images, {
        headers: { 'cache-control': 'no-store' },
      });
    }
  } catch (error: any) {
    console.error('R2 gallery read failed:', error?.message || error);
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
    if (
      !image ||
      typeof image.id !== 'string' ||
      !image.id.startsWith('serenity_gallery/') ||
      typeof image.src !== 'string' ||
      !image.src
    ) {
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

    return NextResponse.json(
      { message: 'Image added to R2 gallery', image: data?.image || image },
      { status: 201 }
    );
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
    if (
      !id ||
      typeof id !== 'string' ||
      !id.startsWith('serenity_gallery/') ||
      !['available', 'in-session'].includes(availability)
    ) {
      return NextResponse.json(
        { error: 'A valid gallery id and availability are required' },
        { status: 400 }
      );
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
