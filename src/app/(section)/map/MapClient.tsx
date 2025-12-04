"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

export interface MapClientProps {
  tavernId?: string | null;
  showAllMarkers?: boolean;
}

// Lazy-load the InteractiveMap (no SSR)
const InteractiveMap = dynamic<MapClientProps>(
  () => import("@/components/InteractiveMap"),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-light/10 to-brand/10 animate-pulse rounded-xl shadow-inner" />
        <p className="relative z-10 text-brand-dark font-medium">
          Loading map...
        </p>
      </div>
    ),
  }
);

export default function MapClient({
  tavernId,
  showAllMarkers,
}: MapClientProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full h-full flex justify-center items-center p-4"
    >
      <div className="w-full max-w-6xl rounded-2xl bg-white/70 backdrop-blur-md shadow-card border border-brand-light/30 overflow-hidden">
        <InteractiveMap tavernId={tavernId} showAllMarkers={showAllMarkers} />
      </div>
    </motion.section>
  );
}
