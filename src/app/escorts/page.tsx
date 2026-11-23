import { workerApi } from "@/lib/r2-media";
import EscortsClient from "./EscortsClient";

export const dynamic = "force-dynamic";

async function getInitialHeroSrc(): Promise<string | undefined> {
  try {
    const { response, data } = await workerApi<{ ok?: boolean; content?: any }>(
      "/api/content",
      {},
      { admin: false }
    );
    if (response.ok && Array.isArray(data?.content?.escorts)) {
      const companions = data.content.escorts;
      const src = companions[1]?.image || companions[0]?.image;
      return typeof src === "string" && src ? src : undefined;
    }
  } catch {
    // Client will load the authoritative hero after hydration.
  }
  return undefined;
}

export default async function EscortsPage() {
  const initialHeroSrc = await getInitialHeroSrc();
  return <EscortsClient initialHeroSrc={initialHeroSrc} />;
}
