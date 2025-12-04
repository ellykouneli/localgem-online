"use client";

import OnDutyMap from "@/components/OnDutyMap";
import PageHeader from "@/components/PageHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function OnDutyHospitalsPage() {
  return (
    <main className="relative w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Hospitals on duty"
        subtitle="We’ll use your location to show hospitals on duty within 2 km."
      />

      <div className="mt-6">
        <OnDutyMap type="hospital" />
      </div>
    </main>
  );
}
