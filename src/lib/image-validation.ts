export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

// File.type comes from the browser and can be omitted or forged. Check the
// actual bytes before handing anything to Cloudinary.
export function looksLikeImage(bytes: Uint8Array, declaredType: string): boolean {
  if (bytes.length < 12) return false;
  const b = bytes;
  const has = (offset: number, signature: number[]) =>
    signature.every((byte, i) => b[offset + i] === byte);

  if (declaredType === "image/jpeg") return has(0, [0xff, 0xd8, 0xff]);
  if (declaredType === "image/png") return has(0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (declaredType === "image/gif") return has(0, [0x47, 0x49, 0x46, 0x38]);
  if (declaredType === "image/webp") return has(0, [0x52, 0x49, 0x46, 0x46]) && has(8, [0x57, 0x45, 0x42, 0x50]);
  if (declaredType === "image/avif") return has(4, [0x66, 0x74, 0x79, 0x70]) && has(8, [0x61, 0x76, 0x69, 0x66]);
  return false;
}

export function validateImage(file: { type: string; size: number }, bytes: Uint8Array): string | null {
  if (file.size > MAX_UPLOAD_BYTES) return "Image is too large (max 10 MB)";
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Only JPG, PNG, WebP, GIF or AVIF images are allowed";
  }
  if (!looksLikeImage(bytes, file.type)) {
    return "The file contents do not match the selected image type";
  }
  return null;
}
