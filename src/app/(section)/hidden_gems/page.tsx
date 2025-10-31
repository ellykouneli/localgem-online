// src/app/(section)/hidden_gems/page.tsx
import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hidden Gems | LocalGem.online",
  description: "Discover Athens' lesser-known treasures, curated by locals.",
};

interface HiddenGem {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url?: string | null;
}

export default async function HiddenGemsPage() {
  const { data: gems, error } = await supabase
    .from("hidden_gems")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Supabase error:", error.message);
    return (
      <main className="p-6">
        <p>Couldn’t load Hidden Gems.</p>
        <pre className="mt-2 text-sm opacity-70">{error.message}</pre>
      </main>
    );
  }

  if (!gems || gems.length === 0) {
    return (
      <main className="p-6">
        <p>No Hidden Gems found. Check your Supabase table or RLS settings.</p>
      </main>
    );
  }

  // Fallback image (in case Supabase image_url is missing)
  const fallbackImage = "/fallback.jpg"; // 👈 place a fallback image in /public folder

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Hidden Gems</h1>

      {/* ✅ Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT SIDE — Tips from Travelers */}
        <aside className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl shadow-sm p-4">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Tips from Travelers
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li>Go early in the morning for soft light and fewer crowds.</li>
              <li>Bring water — some areas have limited shade.</li>
              <li>Many hidden spots are close to metro stations.</li>
              <li>Support local cafés and small shops nearby!</li>
            </ul>
          </div>
        </aside>

        {/* RIGHT SIDE — Hidden Gems grid */}
        <section className="lg:col-span-3">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gems.map((gem: HiddenGem) => (
              <Link
                key={gem.slug}
                href={`/hidden_gems/${gem.slug}`}
                className="group block rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition bg-white border border-gray-100"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={gem.image_url || fallbackImage}
                    alt={gem.name}
                    fill
                    unoptimized // 👈 temporary; remove after next.config.ts works
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-700 transition">
                    {gem.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {gem.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
