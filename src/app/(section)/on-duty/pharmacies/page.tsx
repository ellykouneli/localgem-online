"use client";

import OnDutyMap from "@/components/OnDutyMap";
import PageHeader from "@/components/PageHeader";

export default function OnDutyPharmaciesPage() {
  return (
    <main className="relative w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Pharmacies on duty"
        subtitle="We'll use your location to show open pharmacies within 2 km."
      />

      <div className="mt-6">
        <OnDutyMap type="pharmacy" />
      </div>
    </main>
  );
}
