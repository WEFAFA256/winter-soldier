import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile Massage in Kampala | The Serenity Spa",
  description: "Professional mobile massage delivered to your hotel or home in Kampala.",
  alternates: { canonical: "/mobile-massage" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
