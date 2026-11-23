export interface EscortVideo {
  title: string;
  youtubeId: string;
}

export interface Companion {
  name: string;
  title: string;
  specialty: string;
  availability: "available" | "in-session";
  image: string;
  description: string;
  /** Optional stable URL key. Falls back to a slug of `name` when absent. */
  slug?: string;
  /** Optional per-escort photo URLs. When empty, a curated spa set is used. */
  gallery?: string[];
  /** Optional per-escort videos. When empty, curated spa reels are used. */
  videos?: EscortVideo[];
}

/* No seeded companions — R2-backed admin records are the only source. */

/** Stable, human-readable URL key for an escort. */
export function escortSlug(name: string): string {
  return (name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "profile";
}

/** Resolve a detail-page slug against either an explicit slug or the escort's name. */
export function findCompanion(
  list: Companion[],
  slug: string
): Companion | undefined {
  const wanted = (slug || "").toLowerCase();
  return list.find(
    (c) =>
      (typeof c.slug === "string" && c.slug.toLowerCase() === wanted) ||
      escortSlug(c.name) === wanted
  );
}

/** Curated fallback reels used only when an escort has no own `videos` field. */
export const SHARED_ESCORT_VIDEOS: EscortVideo[] = [
  { title: "Deep Tissue & Muscular Release Flow", youtubeId: "5j3x5qliPEw" },
  { title: "Authentic Turkish Hammam & Foam Cloud", youtubeId: "uClVl1keyBk" },
  { title: "Royal 4-Hands Synchronized Tantra Flow", youtubeId: "rLOFIo4c1E0" },
  { title: "Japanese Scalp Elixir & Head Spa", youtubeId: "Ver7IMBBOO8" },
  { title: "Holistic Swedish De-Stress & Essential Oils", youtubeId: "-qp89eeXMB0" },
  { title: "Sensual Nuru & Hot Oil Gliding Ritual", youtubeId: "oJ8VDciScco" },
];

/** Own photos if supplied, otherwise a distinct curated slice of the spa gallery. */
export function companionGallery(
  companion: Companion,
  allPhotos: string[],
  index = 0
): string[] {
  if (Array.isArray(companion.gallery) && companion.gallery.length) {
    return companion.gallery.filter((u) => typeof u === "string" && u.trim() !== "");
  }
  const pool = allPhotos.filter((u) => typeof u === "string" && u.trim() !== "");
  if (!pool.length) return companion.image ? [companion.image] : [];
  const start = (Math.max(index, 0) * 4) % pool.length;
  const picked = Array.from({ length: Math.min(6, pool.length) }, (_, k) => pool[(start + k) % pool.length]);
  if (companion.image && !picked.includes(companion.image)) picked[0] = companion.image;
  return picked;
}

/** Own videos if supplied, otherwise a distinct curated slice of the shared reels. */
export function companionVideos(companion: Companion, index = 0): EscortVideo[] {
  if (Array.isArray(companion.videos) && companion.videos.length) return companion.videos;
  const start = (Math.max(index, 0) * 2) % SHARED_ESCORT_VIDEOS.length;
  return Array.from({ length: 3 }, (_, k) => SHARED_ESCORT_VIDEOS[(start + k) % SHARED_ESCORT_VIDEOS.length]);
}
