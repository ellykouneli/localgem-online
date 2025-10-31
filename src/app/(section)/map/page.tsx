"use client";
export const dynamic = "force-dynamic";

import PageHeader from "@/components/PageHeader";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import MapClient from "./MapClient";

export default function MapPage() {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <MapClientWithParams />
    </Suspense>
  );
}

function MapClientWithParams() {
  const searchParams = useSearchParams();
  const tavernId = searchParams.get("tavern");

  return (
    <>
      <PageHeader
        title="Interactive Map"
        subtitle={
          tavernId ? "Showing selected tavern" : "See what's around you"
        }
      />
      <div className="mt-4">
        <MapClient tavernId={tavernId} />
      </div>
    </>
  );
}
