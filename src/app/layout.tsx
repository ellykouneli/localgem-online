// src/app/layout.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import AskMeAnything from "@/components/AskMeAnything";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.localgem.online"),
  title: {
    default: "LocalGem — Athens Travel Guide",
    template: "%s · LocalGem",
  },
  description:
    "Discover authentic Athens: hidden gems, food, routes, and local life — curated for real travelers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-gray-800 bg-[#f7f8f4]">
        <Navbar />
        <main id="main" className="min-h-screen">
          {children}
        </main>
        <Footer />
        <AskMeAnything />
      </body>
    </html>
  );
}
