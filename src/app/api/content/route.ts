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

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const contentFilePath = path.join(process.cwd(), 'public', 'site-content.json');
const CLOUD_CONTENT_ID = 'site-content.json';

const readLocalContent = () => {
  try {
    if (!fs.existsSync(contentFilePath)) return {};
    return JSON.parse(fs.readFileSync(contentFilePath, 'utf8'));
  } catch (error) {
    console.error('Error reading local site-content data:', error);
    return {};
  }
};

const looksLikeContent = (data: any) =>
  Boolean(data && (data.services || data.spaContent || data.homepage));

/**
 * Temporary migration fallback only. R2 is authoritative; if it is empty, a
 * signed Cloudinary raw read can seed it once. Only the signed server-side URL
 * is used — no unsigned public asset URL is relied upon.
 */
async function readCloudContent(): Promise<any | null> {
  if (!cloudName) return null;

  try {
    const signedUrl = cloudinary.utils.private_download_url(CLOUD_CONTENT_ID, 'json', {
      resource_type: 'raw',
    });
    const res = await fetch(signedUrl, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (looksLikeContent(data)) return data;
    }
  } catch (error: any) {
    console.error('Signed Cloudinary content read failed:', error?.message || error);
  }

  return null;
}

async function seedR2Content(content: any): Promise<void> {
  try {
    const { response } = await workerApi('/api/content', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      console.error('Could not seed R2 content:', response.status);
    }
  } catch (error: any) {
    console.error('Could not seed R2 content:', error?.message || error);
  }
}

export async function GET() {
  let r2ReachableButEmpty = false;
  try {
    const { response, data } = await workerApi<{ ok?: boolean; content?: any }>(
      '/api/content',
      {},
      { admin: false }
    );
    if (response.ok && looksLikeContent(data?.content)) {
      return NextResponse.json(data?.content, { headers: { 'cache-control': 'no-store' } });
    }
    // Only seed from local when R2 is reachable and definitively empty.
    // A failed/unreachable read must NOT overwrite R2 with a stale local snapshot.
    r2ReachableButEmpty = response.ok && !looksLikeContent(data?.content);
  } catch (error: any) {
    console.error('R2 content read failed:', error?.message || error);
  }

  const localContent = readLocalContent();
  if (r2ReachableButEmpty && looksLikeContent(localContent)) {
    await seedR2Content(localContent);
    return NextResponse.json(localContent, { headers: { 'cache-control': 'no-store' } });
  }

  if (r2ReachableButEmpty) {
    const cloudContent = await readCloudContent();
    if (cloudContent) {
      await seedR2Content(cloudContent);
      return NextResponse.json(cloudContent, { headers: { 'cache-control': 'no-store' } });
    }
  }

  // R2 unavailable or seed sources unavailable: return the best local fallback
  // without seeding, so a transient R2 failure cannot overwrite admin-set data.
  return NextResponse.json(localContent, { headers: { 'cache-control': 'no-store' } });
}

export async function POST(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newContent = await req.json();
    if (!newContent || typeof newContent !== 'object' || Array.isArray(newContent)) {
      return NextResponse.json({ error: 'A content object is required' }, { status: 400 });
    }

    const { response, data } = await workerApi('/api/content', {
      method: 'POST',
      body: JSON.stringify({ content: newContent }),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Could not save content to the media store' },
        { status: 502 }
      );
    }

    // Best-effort development mirror only; Vercel's filesystem is read-only.
    try {
      fs.writeFileSync(contentFilePath, JSON.stringify(newContent, null, 2), 'utf8');
    } catch {
      // ignored
    }

    return NextResponse.json({
      message: 'Content updated successfully in R2',
      content: newContent,
    });
  } catch (error: any) {
    console.error('Error in POST content:', error?.message || error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
