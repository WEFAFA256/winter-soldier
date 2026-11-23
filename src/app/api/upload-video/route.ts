import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { ALLOWED_VIDEO_TYPES, MAX_VIDEO_BYTES } from '@/lib/video-validation';
import { workerApi } from '@/lib/r2-media';

/**
 * Issue a short-lived R2 upload ticket for a reel. The actual MP4/WebM bytes go
 * straight from the browser to the Worker, bypassing Vercel's 4.5 MB body cap.
 */
export async function POST(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ctype = (req.headers.get('content-type') || '').toLowerCase();
    if (!ctype.includes('application/json')) {
      return NextResponse.json({ error: 'Expected application/json' }, { status: 415 });
    }

    const body = await req.json().catch(() => null);
    const contentType = String(body?.contentType || '').toLowerCase();
    const size = Number(body?.size);

    if (!ALLOWED_VIDEO_TYPES.has(contentType)) {
      return NextResponse.json(
        { error: 'Unsupported video format. Upload an MP4, WebM, MOV, MKV, OGV or AVI file.' },
        { status: 415 }
      );
    }
    if (!Number.isFinite(size) || size <= 0 || size > MAX_VIDEO_BYTES) {
      return NextResponse.json({ error: 'Video is too large (max 50 MB)' }, { status: 413 });
    }

    const { response, data } = await workerApi('/api/media/ticket', {
      method: 'POST',
      body: JSON.stringify({ kind: 'video', contentType, size }),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Could not create a video upload ticket' },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Video ticket error:', error?.message || error);
    return NextResponse.json({ error: 'Could not start the video upload' }, { status: 500 });
  }
}
