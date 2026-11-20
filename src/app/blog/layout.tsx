import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wellness Blog | The Serenity Spa",
  description: "Massage guides, wellness tips and spa news from The Serenity Spa.",
  alternates: { canonical: "/blog" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
