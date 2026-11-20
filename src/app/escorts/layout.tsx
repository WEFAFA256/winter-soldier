import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Escort & Companion Services in Kampala | The Serenity Spa",
  description: "Discreet, curated escort and companion services in Kampala. Enquire privately via WhatsApp or book online with The Serenity Spa.",
  alternates: { canonical: "/escorts" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
