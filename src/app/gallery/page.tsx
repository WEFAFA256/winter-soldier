import { workerApi } from "@/lib/r2-media";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

async function getInitialHeroSrc(): Promise<string | undefined> {
  try {
    const { response, data } = await workerApi<{ ok?: boolean; images?: any[] }>(
      "/api/gallery",
      {},
      { admin: false }
    );
    if (response.ok && Array.isArray(data?.images) && data.images.length > 0) {
      const src = data.images[0]?.src;
      return typeof src === "string" && src ? src : undefined;
    }
  } catch {
    // Client will load the authoritative hero after hydration.
  }
  return undefined;
}

export default async function GalleryPage() {
  const initialHeroSrc = await getInitialHeroSrc();
  return <GalleryClient initialHeroSrc={initialHeroSrc} />;
}
