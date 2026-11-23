export type SiteVideoCategory = "all" | "tantra" | "hammam" | "deep";

export interface SiteVideo {
  id: string;
  title: string;
  specialist: string;
  role: string;
  category: SiteVideoCategory;
  categoryLabel: string;
  duration: string;
  youtubeId: string;
  videoUrl: string;
  poster: string;
  description: string;
  bookingService: string;
}

export const VIDEO_CATEGORY_OPTIONS: { value: SiteVideoCategory; label: string }[] = [
  { value: "all", label: "All Demonstrations" },
  { value: "tantra", label: "VIP 4-Hands & Tantra" },
  { value: "hammam", label: "Turkish Hammam" },
  { value: "deep", label: "Deep Tissue & Relaxation" },
];

const VIDEO_CATEGORY_VALUES = new Set<string>(VIDEO_CATEGORY_OPTIONS.map((option) => option.value));

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function safeMediaUrl(value: unknown): string {
  const text = asText(value);
  if (!text) return "";
  if (/^https?:\/\//i.test(text) || text.startsWith("/")) return text;
  return "";
}

function safeYouTubeId(value: unknown): string {
  const text = asText(value);
  // Accept bare IDs and the common shared URL forms, but never pass arbitrary
  // text into the embed src.
  const match = text.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)?([A-Za-z0-9_-]{6,})/i);
  return match ? match[1] : "";
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32);
}

export function blankSiteVideo(): SiteVideo {
  return {
    id: "",
    title: "",
    specialist: "",
    role: "",
    category: "all",
    categoryLabel: "",
    duration: "",
    youtubeId: "",
    videoUrl: "",
    poster: "",
    description: "",
    bookingService: "",
  };
}

/**
 * The admin store is the ONLY source of public video cards. A malformed or
 * legacy record is either repaired into a playable record or dropped — there
 * is deliberately no seeded fallback catalogue here.
 */
export function normalizeSiteVideos(value: unknown): SiteVideo[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const videos: SiteVideo[] = [];

  value.forEach((raw, index) => {
    if (!raw || typeof raw !== "object") return;
    const record = raw as Record<string, unknown>;
    const title = asText(record.title);
    const youtubeId = safeYouTubeId(record.youtubeId);
    const videoUrl = safeMediaUrl(record.videoUrl ?? record.src ?? record.url);
    // A record with no valid playable source is not a video — dropping it keeps
    // unsafe URLs (for example javascript:) and half-finished admin entries off
    // the public gallery. Titles alone are never enough to create a card.
    if (!youtubeId && !videoUrl) return;

    const rawCategory = asText(record.category).toLowerCase();
    const category: SiteVideoCategory = VIDEO_CATEGORY_VALUES.has(rawCategory)
      ? (rawCategory as SiteVideoCategory)
      : "all";

    let id = asText(record.id) || `video-${index + 1}-${slug(title) || "reel"}`;
    if (seen.has(id)) id = `${id}-${index + 1}`;
    seen.add(id);

    const categoryLabel =
      asText(record.categoryLabel) ||
      VIDEO_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ||
      "Spa Film";

    videos.push({
      id,
      title: title || "Spa Film",
      specialist: asText(record.specialist) || "Spa Specialist",
      role: asText(record.role),
      category,
      categoryLabel,
      duration: asText(record.duration),
      youtubeId,
      videoUrl,
      poster: safeMediaUrl(record.poster),
      description: asText(record.description),
      bookingService: asText(record.bookingService),
    });
  });

  return videos;
}

export function formatVideoDuration(seconds: unknown): string {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  if (!total) return "";
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")} HD`;
}
