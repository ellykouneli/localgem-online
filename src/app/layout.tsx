export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

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
    "Discover authentic Athens: hidden gems, classics, transportation, tips, and an interactive map.",
  openGraph: {
    type: "website",
    url: "https://www.localgem.online",
    siteName: "LocalGem",
    title: "LocalGem — Athens Travel Guide",
    description:
      "Discover authentic Athens: hidden gems, classics, transportation, tips, and an interactive map.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@localgem",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
