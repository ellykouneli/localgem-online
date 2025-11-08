"use client";

import dynamic from "next/dynamic";

export interface MapClientProps {
  tavernId?: string | null;
}

// Lazy-load InteractiveMap and disable SSR so it only runs in the browser
const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => <div>Loading map...</div>,
});

export default function MapClient({ tavernId }: MapClientProps) {
  return <InteractiveMap tavernId={tavernId} />;
}
