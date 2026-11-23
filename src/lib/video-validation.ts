export const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-matroska",
  "video/matroska",
  "video/ogg",
  "video/x-msvideo",
]);

// Must match MAX_VIDEO_BYTES in webhook-worker/worker.js (R2 upload limit).
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

function ascii(bytes: Uint8Array, offset: number, length: number): string {
  let text = "";
  const end = Math.min(offset + length, bytes.length);
  for (let i = offset; i < end; i += 1) text += String.fromCharCode(bytes[i]);
  return text;
}

function hasRecognisedSignature(buffer: Uint8Array): boolean {
  if (buffer.length < 12) return false;

  const at4 = ascii(buffer, 4, 4);
  if (at4 === "ftyp" || at4 === "moov") return true; // MP4 / MOV

  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) return true; // WebM / MKV
  if (ascii(buffer, 0, 4) === "OggS") return true;
  if (ascii(buffer, 0, 4) === "RIFF" && ascii(buffer, 8, 4) === "AVI ") return true;

  return false;
}

/**
 * Validate BEFORE uploading. This runs in both the browser (direct upload)
 * and the API route, so it accepts Uint8Array — Buffer is a subclass.
 * Some phone browsers omit the MIME type, so an empty type is allowed while a
 * recognised file signature is always required.
 */
export function validateVideo(
  file: { type?: string; size: number },
  buffer: Uint8Array
): string | null {
  if (!file.size) return "The video file is empty.";
  if (file.size > MAX_VIDEO_BYTES) return "Video is too large (max 50 MB).";

  const declaredType = (file.type || "").trim().toLowerCase();
  if (declaredType && !ALLOWED_VIDEO_TYPES.has(declaredType)) {
    return "Unsupported video format. Upload an MP4, WebM, MOV, MKV, OGV or AVI file.";
  }
  if (!hasRecognisedSignature(buffer)) {
    return "That file does not look like a video. Upload an MP4, WebM, MOV, MKV, OGV or AVI file.";
  }

  return null;
}
