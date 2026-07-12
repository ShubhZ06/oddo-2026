import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TransitOps — Smart Transport Operations Platform",
  description:
    "Digitize your fleet operations with TransitOps. Manage vehicles, drivers, trips, maintenance, and expenses — all in one powerful platform.",
  keywords: [
    "fleet management",
    "transport operations",
    "vehicle tracking",
    "driver management",
    "logistics",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
