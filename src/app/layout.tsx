import type { Metadata } from "next";
import "./globals.css";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "The Serenity Spa || Luxury Massage & Wellness Center",
  description:
    "The Serenity Spa is a premier luxury wellness center offering hydrotherapy, relaxing massages, and holistic treatments.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_UG",
    siteName: "The Serenity Spa",
    title: "The Serenity Spa || Luxury Massage & Wellness Center",
    description: "Luxury massage and wellness treatments in Kampala, Uganda.",
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/assets/images/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/images/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: { url: "/assets/images/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  manifest: "/assets/images/favicons/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="custom-cursor">
        <AppShell>
          {children}
        </AppShell>
        <FloatingContactButtons />
      </body>
    </html>
  );
}
