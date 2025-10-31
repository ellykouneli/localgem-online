import PageHeader from "@/components/PageHeader";

export default function HospitalsPage() {
  return (
    <>
      <PageHeader
        title="Hospitals & Pharmacies on Duty"
        subtitle="Updated from official sources. Interactive map coming next."
      />
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Filters / info */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border p-4">
            <h3 className="font-medium mb-2">Filters</h3>
            <p className="text-sm text-gray-600">District, open now, 24h…</p>
          </div>
          <div className="rounded-xl border p-4">
            <h3 className="font-medium mb-2">Next steps</h3>
            <p className="text-sm text-gray-600">
              We’ll fetch duty data every 5 days + on the 1st from fsa-efimeries.gr.
            </p>
          </div>
        </aside>

        {/* Results list / map placeholder */}
        <section className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border p-6 text-sm text-gray-600">
            Map placeholder – we’ll replace with the interactive map & live duty markers.
          </div>
          <div className="rounded-xl border p-4">Pharmacy result (placeholder)</div>
          <div className="rounded-xl border p-4">Hospital result (placeholder)</div>
        </section>
      </div>
    </>
  );
}
