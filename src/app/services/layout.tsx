import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Massage & Wellness Services in Kampala | The Serenity Spa",
  description: "Explore massage, body care and spa packages at The Serenity Spa in Kampala.",
  alternates: { canonical: "/services" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
