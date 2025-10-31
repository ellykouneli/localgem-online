export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Suspense } from "react";
import MapClientWrapper from "./MapClientWrapper";

export default function MapPage() {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <MapClientWrapper />
    </Suspense>
  );
}
