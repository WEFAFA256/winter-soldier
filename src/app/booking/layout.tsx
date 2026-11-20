import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book an Appointment | The Serenity Spa",
  description: "Book a massage or spa treatment in Kampala and pay securely with MTN MoMo or Airtel Money.",
  alternates: { canonical: "/booking" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
