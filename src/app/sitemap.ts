import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-url";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await siteOrigin();
  const now = new Date();
  return PAGES.map((path) => ({
    url: `${origin}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
