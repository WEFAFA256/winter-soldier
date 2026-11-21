import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { isAdmin } from '@/lib/admin-auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// Bulk-delete selected gallery/profile images from the durable Cloudinary store.
// The admin UI only preselects "available" profiles, but authorization is checked
// here too so a direct POST cannot bypass the dashboard login.
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

    const invalid = ids.filter((id: string) => !id.startsWith(GALLERY_PREFIX));
    if (invalid.length) {
      return NextResponse.json(
        { error: 'Every ID must be a serenity_gallery image' },
        { status: 400 }
      );
    }

    const uniqueIds = [...new Set(ids)];
    const result: any = await cloudinary.api.delete_resources(uniqueIds, {
      resource_type: 'image',
      type: 'upload',
    });

    const statuses = result?.deleted || {};
    const deleted = uniqueIds.filter(
      (id) => statuses[id] === 'deleted' || statuses[id] === 'not_found'
    );
    const failed = uniqueIds.filter((id) => !deleted.includes(id));
    const deletedSet = new Set(deleted);

    // Best-effort local mirror for development; Cloudinary is the source of truth.
    try {
      const local = readLocalData().filter((img: any) => !deletedSet.has(img.id));
      fs.writeFileSync(dataFilePath, JSON.stringify(local, null, 2), 'utf8');
    } catch (e) {
      console.error('Error updating local gallery mirror after purge:', e);
    }

    return NextResponse.json({
      message: `Purged ${deleted.length} image(s)`,
      deleted,
      failed,
    }, { status: failed.length ? 207 : 200 });
  } catch (error: any) {
    console.error('Error in gallery purge:', error);
    return NextResponse.json(
      { error: 'Could not purge images from the durable store. Please retry.' },
      { status: 502 }
    );
  }
}
