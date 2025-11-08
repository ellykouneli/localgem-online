export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const dynamicParams = true; // ✅ ensures all subpages (like /map) are dynamic

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function SectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
