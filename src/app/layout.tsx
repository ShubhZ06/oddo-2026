import { Architects_Daughter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import ToastContainer from "@/components/ui/Toast";

const architectsDaughter = Architects_Daughter({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-architects",
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
    <html lang="en" className={`${architectsDaughter.className} ${architectsDaughter.variable}`}>
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
