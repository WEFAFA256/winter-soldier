import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAdmin } from '@/lib/admin-auth';
import { workerApi } from '@/lib/r2-media';

const dataFilePath = path.join(process.cwd(), 'public', 'gallery.json');
const GALLERY_PREFIX = 'serenity_gallery/';
const MAX_IDS = 200;

const readLocalData = (): any[] => {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
    const parsed = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** Bulk-delete selected gallery images from the R2-backed durable store. */
export async function POST(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: any = await req.json().catch(() => ({}));
    const ids: string[] = Array.isArray(body?.ids)
      ? (body.ids as unknown[]).filter((id): id is string => typeof id === 'string')
      : [];

    if (!ids.length || ids.length > MAX_IDS) {
      return NextResponse.json(
        { error: `Provide between 1 and ${MAX_IDS} gallery image IDs` },
        { status: 400 }
      );
    }

    const invalid = ids.filter((id) => !id.startsWith(GALLERY_PREFIX));
    if (invalid.length) {
      return NextResponse.json(
        { error: 'Every ID must be a serenity_gallery image' },
        { status: 400 }
      );
    }

    const uniqueIds = [...new Set(ids)];
    const { response, data } = await workerApi('/api/gallery/purge', {
      method: 'POST',
      body: JSON.stringify({ ids: uniqueIds }),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Could not purge images from the media store.' },
        { status: 502 }
      );
    }

    const deleted: string[] = Array.isArray(data?.deleted) ? data.deleted : uniqueIds;
    const failed: string[] = Array.isArray(data?.failed) ? data.failed : [];
    const deletedSet = new Set(deleted);

    try {
      fs.writeFileSync(
        dataFilePath,
        JSON.stringify(readLocalData().filter((img: any) => !deletedSet.has(img.id)), null, 2),
        'utf8'
      );
    } catch (error) {
      console.error('Error updating local gallery mirror after purge:', error);
    }

    return NextResponse.json({
      message: `Purged ${deleted.length} image(s)`,
      deleted,
      failed,
    }, { status: failed.length ? 207 : 200 });
  } catch (error: any) {
    console.error('Error in gallery purge:', error?.message || error);
    return NextResponse.json(
      { error: 'Could not purge images from the durable store. Please retry.' },
      { status: 502 }
    );
  }
}
