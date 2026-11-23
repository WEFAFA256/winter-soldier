import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from '@/lib/image-validation';
import { workerApi } from '@/lib/r2-media';

/**
 * Issue a short-lived R2 upload ticket. The browser sends the image bytes
 * directly to the Worker (/media/upload); Vercel never handles the file body
 * and the browser never sees ADMIN_API_TOKEN.
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

    if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
      return NextResponse.json(
        { error: 'Only JPG, PNG, WebP, GIF or AVIF images are allowed' },
        { status: 415 }
      );
    }
    if (!Number.isFinite(size) || size <= 0 || size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'Image is too large (max 10 MB)' }, { status: 413 });
    }

    const { response, data } = await workerApi('/api/media/ticket', {
      method: 'POST',
      body: JSON.stringify({ kind: 'image', contentType, size }),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Could not create an upload ticket' },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Image ticket error:', error?.message || error);
    return NextResponse.json({ error: 'Could not start the upload' }, { status: 500 });
  }
}
