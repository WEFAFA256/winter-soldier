import React from "react";

export const metadata = {
  title: "The Serenity Spa - Admin Portal",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        color: "#e6edf3",
      }}
    >
      {children}
    </div>
  );
}
