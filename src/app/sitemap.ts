import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-url";
import { readBlogPosts } from "@/lib/blog-store";

export const dynamic = "force-dynamic";

const PAGES = [
  "/",
  "/services",
  "/vip-packages",
  "/mobile-massage",
  "/gallery",
  "/blog",
  "/escorts",
  "/booking",
];

// A stable date for static pages: using `new Date()` made lastmod change on
// every crawl, which dilutes the signal. Bump this only when pages materially
// change.
const STATIC_LASTMOD = new Date("2026-11-21T00:00:00.000Z");

function postDate(post: any): Date {
  const raw = post?.date ?? post?.createdAt ?? post?.publishedAt ?? post?.id;
  if (raw === undefined || raw === null || raw === "") return STATIC_LASTMOD;
  const d = raw instanceof Date ? raw : new Date(raw);
  return Number.isNaN(d.getTime()) ? STATIC_LASTMOD : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await siteOrigin();
  const posts = await readBlogPosts();

  const pages: MetadataRoute.Sitemap = PAGES.map((path) => ({
    url: `${origin}${path}`,
    lastModified: STATIC_LASTMOD,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const articles: MetadataRoute.Sitemap = posts
    .filter((p: any) => p && p.id !== undefined && p.id !== null && p.id !== "")
    .map((p: any) => ({
      url: `${origin}/blog/${encodeURIComponent(String(p.id))}`,
      lastModified: postDate(p),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...pages, ...articles];
}
