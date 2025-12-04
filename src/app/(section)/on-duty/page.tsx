// app/on-duty/page.tsx
"use client";

import PageHeader from "@/components/PageHeader";
import { useRouter } from "next/navigation";

export default function OnDutyPage() {
  const router = useRouter();

  return (
    <main className="relative w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="On Duty"
        subtitle="Find pharmacies and hospitals on duty around you"
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {/* Pharmacies */}
        <button
          onClick={() => router.push("/on-duty/pharmacies")}
          className="group relative flex items-center justify-center rounded-2xl border border-emerald-200 bg-white/80 backdrop-blur-md shadow-card px-8 py-10 hover:border-emerald-400 hover:shadow-lg transition-all"
        >
          <div className="text-center space-y-3">
            <div className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
              On duty
            </div>
            <div className="text-2xl font-display font-semibold text-brand-dark">
              Pharmacies
            </div>
            <p className="text-sm text-neutral-600">
              See open pharmacies within 2 km of your location.
            </p>
          </div>
        </button>

        {/* Hospitals */}
        <button
          onClick={() => router.push("/on-duty/hospitals")}
          className="group relative flex items-center justify-center rounded-2xl border border-sky-200 bg-white/80 backdrop-blur-md shadow-card px-8 py-10 hover:border-sky-400 hover:shadow-lg transition-all"
        >
          <div className="text-center space-y-3">
            <div className="text-sm font-semibold uppercase tracking-wide text-sky-500">
              On duty
            </div>
            <div className="text-2xl font-display font-semibold text-brand-dark">
              Hospitals
            </div>
            <p className="text-sm text-neutral-600">
              See hospitals on duty within 2 km of your location.
            </p>
          </div>
        </button>
      </div>
    </main>
  );
}
