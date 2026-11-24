import { workerApi } from "@/lib/r2-media";
import { normalizeSiteVideos, type SiteVideo } from "@/lib/site-videos";
import GalleryClient from "./GalleryClient";

export const revalidate = 30;

async function getInitialGalleryData(): Promise<{
  initialHeroSrc?: string;
  initialImages?: any[];
  initialVideos?: SiteVideo[];
}> {
  try {
    const [galleryRes, contentRes] = await Promise.all([
      workerApi<{ ok?: boolean; images?: any[] }>("/api/gallery", {}, { admin: false }),
      workerApi<{ ok?: boolean; content?: any }>("/api/content", {}, { admin: false }),
    ]);

    const initialImages =
      galleryRes.response.ok && Array.isArray(galleryRes.data?.images)
        ? galleryRes.data.images
        : undefined;
    const initialHeroSrc =
      initialImages && initialImages.length > 0 && typeof initialImages[0]?.src === "string"
        ? initialImages[0].src
        : undefined;
    const initialVideos =
      contentRes.response.ok && contentRes.data?.content
        ? normalizeSiteVideos(contentRes.data.content.videos)
        : undefined;

    return { initialHeroSrc, initialImages, initialVideos };
  } catch {
    return {};
  }
}

export default async function GalleryPage() {
  const { initialHeroSrc, initialImages, initialVideos } = await getInitialGalleryData();
  return (
    <GalleryClient
      initialHeroSrc={initialHeroSrc}
      initialImages={initialImages}
      initialVideos={initialVideos}
    />
  );
}
