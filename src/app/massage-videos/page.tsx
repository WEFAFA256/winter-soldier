import { workerApi } from "@/lib/r2-media";
import { normalizeSiteVideos, type SiteVideo } from "@/lib/site-videos";
import MassageVideosClient from "./MassageVideosClient";

export const revalidate = 30;

async function getInitialMassageVideos(): Promise<SiteVideo[] | undefined> {
  try {
    const contentRes = await workerApi<{ ok?: boolean; content?: any }>(
      "/api/content",
      {},
      { admin: false }
    );
    if (contentRes.response.ok && contentRes.data?.content) {
      return normalizeSiteVideos(contentRes.data.content.massageVideos);
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export default async function MassageVideosPage() {
  const initialVideos = await getInitialMassageVideos();
  return <MassageVideosClient initialVideos={initialVideos} />;
}
