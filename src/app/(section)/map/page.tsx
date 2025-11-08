import { Suspense } from "react";
import MapClientWrapper from "./MapClientWrapper";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function MapPage() {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <MapClientWrapper />
    </Suspense>
  );
}
