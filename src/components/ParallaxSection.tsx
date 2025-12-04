"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface ParallaxSectionProps {
  image: string; // background image URL
  height?: string; // optional height (default: "70vh")
  overlay?: boolean; // optional gradient veil
  children?: React.ReactNode; // foreground content
}

/**
 * Elegant parallax section for hero areas and banners.
 * Keeps background subtle, semi-transparent, and smooth.
 */
export default function ParallaxSection({
  image,
  height = "70vh",
  overlay = true,
  children,
}: ParallaxSectionProps) {
  const { scrollY } = useScroll();
  const [isClient, setIsClient] = useState(false);

  // Parallax motion: move image slower than scroll
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ height }}
    >
      {/* Background image with parallax motion */}
      {isClient && (
        <motion.div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage: `url(${image})`,
            y,
          }}
        />
      )}

      {/* Soft overlay for readability */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/80 pointer-events-none" />
      )}

      {/* Foreground content */}
      <div className="relative z-10 text-center px-4">{children}</div>
    </section>
  );
}
