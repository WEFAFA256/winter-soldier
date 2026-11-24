import { NextResponse } from "next/server";
import { workerBase } from "@/lib/r2-media";

const MAX_CHUNK_BYTES = 2 * 1024 * 1024; // 2MB per 206 chunk (well under Vercel's 4.5MB limit)

function resolveAllowedVideoUrl(rawUrl: string | null): string | null {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  const allowedOrigin = new URL(workerBase()).origin;
  try {
    const parsed = new URL(trimmed);
    if (parsed.origin !== allowedOrigin) return null;
    if (!parsed.pathname.startsWith("/media/")) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function parseRange(rangeHeader: string | null, totalLength: number): { start: number; end: number } | null {
  if (!rangeHeader || !rangeHeader.startsWith("bytes=")) return null;
  const [rawStart, rawEnd] = rangeHeader.replace(/^bytes=/, "").split(",")[0].split("-");
  let start = rawStart ? parseInt(rawStart, 10) : 0;
  let end = rawEnd ? parseInt(rawEnd, 10) : totalLength - 1;

  if (Number.isNaN(start) && !Number.isNaN(end)) {
    // suffix-byte-range-spec: bytes=-500
    start = Math.max(0, totalLength - end);
    end = totalLength - 1;
  }
  if (Number.isNaN(start) || start < 0 || start >= totalLength) return null;
  if (Number.isNaN(end) || end >= totalLength) end = totalLength - 1;
  if (end < start) return null;

  // Cap chunk size so responses never exceed serverless payload limits
  if (end - start + 1 > MAX_CHUNK_BYTES) {
    end = start + MAX_CHUNK_BYTES - 1;
  }
  return { start, end };
}

export async function HEAD(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = resolveAllowedVideoUrl(searchParams.get("url"));
  if (!target) {
    return NextResponse.json({ error: "Invalid video URL" }, { status: 400 });
  }

  const upstream = await fetch(target, { method: "HEAD", cache: "force-cache" }).catch(() => null);
  if (!upstream || !upstream.ok) {
    return NextResponse.json({ error: "Video unavailable" }, { status: 502 });
  }

  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("content-type") || "video/mp4");
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new NextResponse(null, { status: 200, headers });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = resolveAllowedVideoUrl(searchParams.get("url"));
  if (!target) {
    return NextResponse.json({ error: "Invalid video URL" }, { status: 400 });
  }

  const rangeHeader = req.headers.get("range");
  const upstreamHeaders: Record<string, string> = {};
  if (rangeHeader) upstreamHeaders["Range"] = rangeHeader;

  const upstream = await fetch(target, {
    headers: upstreamHeaders,
    cache: "force-cache",
  }).catch(() => null);

  if (!upstream || (!upstream.ok && upstream.status !== 206)) {
    return NextResponse.json({ error: "Video unavailable" }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") || "video/mp4";

  // If upstream itself honored Range (206), pass it right through
  if (upstream.status === 206) {
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Accept-Ranges", "bytes");
    const contentRange = upstream.headers.get("content-range");
    const contentLength = upstream.headers.get("content-length");
    if (contentRange) headers.set("Content-Range", contentRange);
    if (contentLength) headers.set("Content-Length", contentLength);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return new NextResponse(upstream.body, { status: 206, headers });
  }

  // Upstream returned 200 OK (worker ignores Range). If the browser requested a
  // byte range (e.g. iOS Safari probing bytes=0-1), slice and return 206.
  if (rangeHeader) {
    const buffer = await upstream.arrayBuffer();
    const totalLength = buffer.byteLength;
    const range = parseRange(rangeHeader, totalLength);
    if (!range) {
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${totalLength}` },
      });
    }
    const slice = buffer.slice(range.start, range.end + 1);
    return new NextResponse(slice, {
      status: 206,
      headers: {
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
        "Content-Range": `bytes ${range.start}-${range.end}/${totalLength}`,
        "Content-Length": String(slice.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // No Range requested: stream 200 OK with Accept-Ranges advertised
  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set("Accept-Ranges", "bytes");
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new NextResponse(upstream.body, { status: 200, headers });
}
