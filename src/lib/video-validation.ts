const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-matroska",
  "video/matroska",
  "video/ogg",
  "video/x-msvideo",
]);

export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

function ascii(bytes: Buffer, offset: number, length: number): string {
  return bytes.subarray(offset, offset + length).toString("latin1");
}

function hasRecognisedSignature(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;

  const ftyp = ascii(buffer, 4, 4) === "ftyp";
  if (ftyp || ascii(buffer, 4, 4) === "moov") return true; // MP4 / MOV

  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) return true; // WebM / MKV
  if (ascii(buffer, 0, 4) === "OggS") return true;
  if (ascii(buffer, 0, 4) === "RIFF" && ascii(buffer, 8, 4) === "AVI ") return true;

  return false;
}

/**
 * Validate BEFORE sending a file to Cloudinary. The browser's declared MIME
 * type is advisory, so a recognised file signature is required; an empty MIME
 * type is accepted because some phone browsers omit it for recorded video.
 */
export function validateVideo(
  file: { type?: string; size: number },
  buffer: Buffer
): string | null {
  if (!file.size) return "The video file is empty.";
  if (file.size > MAX_VIDEO_BYTES) return "Video is too large (max 100 MB).";

  const declaredType = (file.type || "").trim().toLowerCase();
  if (declaredType && !ALLOWED_VIDEO_TYPES.has(declaredType)) {
    return "Unsupported video format. Upload an MP4, WebM, MOV, MKV, OGV or AVI file.";
  }
  if (!hasRecognisedSignature(buffer)) {
    return "That file does not look like a video. Upload an MP4, WebM, MOV, MKV, OGV or AVI file.";
  }

  return null;
}
