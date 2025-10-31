"use client";

import dynamic from "next/dynamic";

// 1️⃣ Define prop types
export interface MapClientProps {
  tavernId?: string | null;
}

// 2️⃣ Use a type assertion on dynamic import
const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
}) as React.ComponentType<{ tavernId?: string | null }>;

// 3️⃣ Functional component
export default function MapClient({ tavernId }: MapClientProps) {
  return <InteractiveMap tavernId={tavernId} />;
}
