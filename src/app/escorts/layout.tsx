import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Therapists | The Serenity Spa",
  description: "Meet the professional therapy team at The Serenity Spa in Kampala.",
  alternates: { canonical: "/escorts" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
