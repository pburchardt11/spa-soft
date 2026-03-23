import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpaSoft — Spa Management Software",
  description:
    "Booking, CRM, payments, and analytics — finally in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}
