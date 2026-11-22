import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = (slug || "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  const title = name && name !== " " ? `${name} - Escort Profile` : "Escort Profile";
  return {
    title: `${title} | The Serenity Spa`,
    description: `View ${name}'s profile, photos, videos and availability at The Serenity Spa, Kampala. Enquire privately via WhatsApp.`,
    alternates: { canonical: `/escorts/${slug}` },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
