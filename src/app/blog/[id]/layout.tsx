import type { Metadata } from "next";
import { readBlogPosts } from "@/lib/blog-store";

// Article pages are client components (they fetch the post by id), so they
// cannot export generateMetadata themselves. A server layout supplies the
// title, description, canonical and OG tags for crawlers and link previews.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const posts = await readBlogPosts();
  const post = posts.find((p: any) => String(p?.id) === String(id));

  if (!post) {
    return {
      title: "Article not found | The Serenity Spa",
      robots: { index: false, follow: true },
    };
  }

  const title = String(post.title || "Wellness Article");
  const description = String(post.excerpt || post.description || post.content || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  return {
    title: `${title} | The Serenity Spa`,
    description,
    alternates: { canonical: `/blog/${encodeURIComponent(String(post.id))}` },
    openGraph: {
      type: "article",
      title,
      description,
      images: post.coverImage || post.image ? [{ url: String(post.coverImage || post.image) }] : undefined,
    },
  };
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  return children;
}
