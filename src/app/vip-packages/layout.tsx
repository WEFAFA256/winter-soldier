import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VIP Packages | The Serenity Spa",
  description: "Premium VIP spa packages and private sessions in Kampala.",
  alternates: { canonical: "/vip-packages" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
