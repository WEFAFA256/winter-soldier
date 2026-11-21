import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const BLOG_PUBLIC_ID = "serenity_data/blog-posts";
const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

cloudinary.config({
  cloud_name: cloudName,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function readLocal(): any[] {
  try {
    const p = path.join(process.cwd(), "public", "blog.json");
    if (!fs.existsSync(p)) return [];
    const data = JSON.parse(fs.readFileSync(p, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Server-side reader shared by the sitemap and article metadata. Cloudinary is
// the durable store; the local JSON is a development fallback only.
export async function readBlogPosts(): Promise<any[]> {
  try {
    if (!cloudName) return readLocal();
    const result = await cloudinary.api.resource(BLOG_PUBLIC_ID, {
      resource_type: "raw",
    });
    const res = await fetch(result.secure_url, { cache: "no-store" });
    if (!res.ok) return readLocal();
    const data = await res.json();
    return Array.isArray(data) ? data : readLocal();
  } catch {
    return readLocal();
  }
}
