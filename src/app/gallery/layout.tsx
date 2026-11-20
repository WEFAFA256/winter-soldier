import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spa Gallery | The Serenity Spa",
  description: "A look inside The Serenity Spa — treatment rooms, therapists and experiences.",
  alternates: { canonical: "/gallery" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
