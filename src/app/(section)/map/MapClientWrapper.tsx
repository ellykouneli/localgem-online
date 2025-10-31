"use client";

import PageHeader from "@/components/PageHeader";
import { useSearchParams } from "next/navigation";
import MapClient from "./MapClient";

export default function MapClientWrapper() {
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
