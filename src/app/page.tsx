import Section from "../components/Section";
import HiddenGemCard, { HiddenGem } from "../components/HiddenGemCard";

export default function Home() {
  // Sample gems (later will come from Supabase)
  const sampleGems: HiddenGem[] = [
    {
      name: "Anafiotika",
      description: "A hidden neighborhood under the Acropolis with whitewashed houses.",
      district: "Plaka",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/Anafiotika_Athens.jpg",
      rating: 4.8,
    },
    {
      name: "Strefi Hill",
      description: "A peaceful hill with panoramic views of Athens.",
      district: "Exarchia",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/61/Strefi_Hill_view.jpg",
      rating: 4.5,
    },
  ];

  return (
    <main className="p-6 space-y-12">
      <h1 className="text-2xl font-bold text-brand-blue">
        Welcome to LocalGem.online 🌍
      </h1>

      {/* On duty hospitals & pharmacies */}
      <Section title="On Duty Hospitals & Pharmacies">
        <p className="text-gray-600">
          Up-to-date information about hospitals and pharmacies on duty. (Updates every 3 days from official sources)
        </p>
      </Section>

      {/* Our Classics */}
      <Section title="Our Classics" subtitle="Must-see landmarks">
        <ul className="list-disc pl-5 text-gray-700">
          <li>Acropolis</li>
          <li>Ancient Agora</li>
        </ul>
      </Section>

      {/* Hidden Gems */}
      <Section title="Hidden Gems" subtitle="Discover Athens like a local">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sampleGems.map((gem, i) => (
            <HiddenGemCard key={i} gem={gem} />
          ))}
        </div>
      </Section>

      {/* Local Experiences */}
      <Section title="Local Experiences">
        <p className="text-gray-600">
          Cozy taverns, coffee spots, and authentic eateries — coming soon!
        </p>
      </Section>

      {/* Transportation */}
      <Section title="Transportation">
        <p className="text-gray-600">
          Learn how to get around Athens using buses, metro, trams, and ferries. 
          We’ll also recommend the Hop-on Hop-off buses for sightseeing.
        </p>
      </Section>
    </main>
  );
}
