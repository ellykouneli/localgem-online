import PageHeader from "@/components/PageHeader";

export default function ClassicsPage() {
  return (
    <>
      <PageHeader
        title="Our Classics"
        subtitle="Acropolis, Ancient Agora, and a few timeless routes"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* cards go here; reuse your HiddenGemCard with different data */}
        <div className="rounded-xl border p-4">Acropolis (placeholder)</div>
        <div className="rounded-xl border p-4">Ancient Agora (placeholder)</div>
      </div>
    </>
  );
}
