import type { Metadata } from "next";
import "./globals.css";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "The Serenity Spa || Luxury Massage & Wellness Center",
  description:
    "The Serenity Spa is a premier luxury wellness center offering hydrotherapy, relaxing massages, and holistic treatments.",
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
