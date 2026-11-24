import fs from "fs";
import path from "path";
import { workerApi } from "@/lib/r2-media";

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

// Server-side reader shared by the sitemap and article metadata.
// R2-backed content is the durable store; local blog.json is the development fallback.
export async function readBlogPosts(): Promise<any[]> {
  try {
    const { response, data } = await workerApi<{ ok?: boolean; content?: any }>(
      "/api/content",
      {},
      { admin: false }
    );
    if (response.ok && Array.isArray(data?.content?.blogs)) {
      return data.content.blogs;
    }
  } catch {
    // fallback to local mirror
  }

  return readLocal();
}
