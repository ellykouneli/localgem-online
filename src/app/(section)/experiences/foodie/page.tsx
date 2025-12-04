"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import FoodieCarousel, { Tavern } from "@/components/FoodieCarousel";
import Reveal from "@/components/Reveal";
import { supabase } from "@/lib/supabaseClient";

// Shape of a row from public.taverns
type DbTavern = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  google_place_id: string | null;
  category: string | null;
  image_url: string | null;
  website_url: string | null;
  phone: string | null;
  is_featured: boolean | null;
  created_at: string | null;
};

export default function FoodiePage() {
  const router = useRouter();

  const [showCarousel, setShowCarousel] = useState(false);
  const [taverns, setTaverns] = useState<DbTavern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCraving, setSelectedCraving] = useState<string | null>(null);

  // Fetch taverns from Supabase
  useEffect(() => {
    const fetchTaverns = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("taverns")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error loading taverns:", error.message);
        setError("Could not load taverns right now. Please try again later.");
        setTaverns([]);
      } else {
        setTaverns(data ?? []);
      }

      setLoading(false);
    };

    fetchTaverns();
  }, []);

  // Map Supabase rows -> carousel Tavern type
  const carouselTaverns: Tavern[] = useMemo(() => {
    const featured = taverns.filter((t) => t.is_featured);

    return featured.map((t) => ({
      id: t.id,
      name: t.name,
      image: t.image_url || "/images/tavern-placeholder.jpg",
      shortDescription: t.description || "",
    }));
  }, [taverns]);

  // Filter taverns by craving category
  const cravingResults = useMemo(() => {
    if (!selectedCraving) return [];

    const key = selectedCraving.toLowerCase();

    return taverns.filter((t) => {
      if (!t.category) return false;
      return t.category.toLowerCase().includes(key);
    });
  }, [taverns, selectedCraving]);

  // Navigation actions
  const viewTavern = (id: string) => {
    router.push(`/map?tavern=${id}`);
  };

  const openQuickFindMap = () => {
    // OLD:
    // router.push("/map");

    // NEW: tell the map we want "around me" mode (all markers)
    router.push("/map?mode=all");
  };

  return (
    <main className="container mx-auto px-6 py-10">
      {/* Header */}
      <Reveal>
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-primary text-center mb-3">
          🍴 Foodie
        </h1>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="text-center text-gray-700 mb-8 max-w-xl mx-auto">
          Discover the taverns, markets, and cozy corners that make Athens taste
          unforgettable.
        </p>
      </Reveal>

      {error && (
        <p className="text-center text-sm text-red-600 mb-4">{error}</p>
      )}

      {/* === 3-column layout === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT — Taste Cards Carousel */}
        <Reveal>
          <section className="border rounded-xl p-4 h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Taste cards carousel</h2>

            {!showCarousel ? (
              <div className="flex flex-col items-center justify-center flex-1">
                <p className="text-gray-600 text-sm mb-4 text-center">
                  Open the taste cards to preview selected featured taverns.
                </p>
                <button
                  onClick={() => setShowCarousel(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  Taste cards carousel
                </button>
              </div>
            ) : loading ? (
              <p className="text-gray-500 text-sm">Loading taverns…</p>
            ) : carouselTaverns.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No featured taverns yet. Add some with{" "}
                <code>is_featured = true</code>.
              </p>
            ) : (
              <FoodieCarousel
                taverns={carouselTaverns}
                onViewTavern={viewTavern}
              />
            )}
          </section>
        </Reveal>

        {/* MIDDLE — What are you craving? */}
        <Reveal delay={0.05}>
          <section className="border rounded-xl p-4 h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-center">
              What are you craving?
            </h2>

            {/* Craving buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={() => setSelectedCraving("seafood")}
                className={`px-4 py-2 rounded-lg text-sm transition border ${
                  selectedCraving === "seafood"
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-800"
                }`}
              >
                🐟 Seafood
              </button>
              <button
                onClick={() => setSelectedCraving("grill")}
                className={`px-4 py-2 rounded-lg text-sm transition border ${
                  selectedCraving === "grill"
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-800"
                }`}
              >
                🍖 Grill
              </button>
              <button
                onClick={() => setSelectedCraving("neighborhood vibes")}
                className={`px-4 py-2 rounded-lg text-sm transition border ${
                  selectedCraving === "neighborhood vibes"
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-800"
                }`}
              >
                🍷 Neighborhood vibes
              </button>
            </div>

            <p className="text-center text-gray-500 text-sm mb-2">↓</p>

            {/* Results list */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {loading ? (
                <p className="text-center text-gray-500 text-sm">
                  Loading taverns…
                </p>
              ) : !selectedCraving ? (
                <p className="text-center text-gray-500 text-sm">
                  Choose what you&apos;re craving to see matching taverns.
                </p>
              ) : cravingResults.length === 0 ? (
                <p className="text-center text-gray-500 text-sm">
                  No taverns found for this craving yet.
                </p>
              ) : (
                cravingResults.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => viewTavern(t.id)}
                    className="w-full text-left border rounded-lg px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <div className="font-semibold text-primary">{t.name}</div>
                    {t.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {t.description}
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          </section>
        </Reveal>

        {/* RIGHT — Quick Find / Map */}
        <Reveal delay={0.1}>
          <section className="border rounded-xl p-4 h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Quick find
            </h2>

            <p className="text-center text-gray-500 text-sm mb-2">↓</p>

            <div className="flex-1 flex flex-col items-center justify-center border rounded-lg text-center px-4 py-6">
              <p className="text-gray-700 mb-3">
                Open the interactive map to see taverns around you.
              </p>
              <button
                onClick={openQuickFindMap}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition"
              >
                Around me (map)
              </button>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
