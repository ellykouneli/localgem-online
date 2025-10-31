"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./style.css";

type Tavern = {
  id: number;
  name: string;
  image: string;
  category: string;
  shortDescription: string;
  distance: number;
};

// --- Mock data (you can replace with API data later) ---
const taverns: Tavern[] = [
  {
    id: 1,
    name: "Taverna Nikos",
    image: "https://picsum.photos/300/200?1",
    category: "seafood",
    shortDescription: "By the port, fresh catch daily",
    distance: 0.3,
  },
  {
    id: 2,
    name: "Grill House Kostas",
    image: "https://picsum.photos/300/200?2",
    category: "grill",
    shortDescription: "Authentic souvlaki and live music",
    distance: 1.2,
  },
  {
    id: 3,
    name: "Maria's Corner",
    image: "https://picsum.photos/300/200?3",
    category: "vibes",
    shortDescription: "Cozy neighborhood taverna",
    distance: 0.7,
  },
];

export default function FoodiePage() {
  const router = useRouter();

  // State management
  const [view, setView] = useState<"quick" | "craving">("quick");
  const [nearby, setNearby] = useState<Tavern[]>([]);
  const [craving, setCraving] = useState<Tavern[]>([]);

  // --- Quick Find: Detect nearby taverns ---
  useEffect(() => {
    if (view === "quick" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Filter by distance threshold (mock)
          const filtered = taverns.filter((t) => t.distance <= 1.0);
          setNearby(filtered);
        },
        () => console.log("Location access denied or unavailable")
      );
    }
  }, [view]);

  // --- Load taverns by craving type ---
  const loadCraving = (type: string) => {
    const filtered = taverns.filter((t) => t.category === type);
    setCraving(filtered);
  };

  // --- Navigate to map with tavern ID ---
  const showOnMap = (id: number) => {
    router.push(`/map?tavern=${id}`);
  };

  // --- Navigate to individual tavern page (future feature) ---
  const viewTavern = (id: number) => {
    alert(`This will open tavern page for ID ${id}`);
  };

  return (
    <section id="foodie-section">
      <h2>🍴 Foodie</h2>

      {/* === Taste Cards Carousel === */}
      <div id="taste-cards-carousel" className="carousel">
        {taverns.map((t) => (
          <div className="taste-card" key={t.id}>
            <img src={t.image} alt={t.name} />
            <h3>{t.name}</h3>
            <p>{t.shortDescription}</p>
            <button onClick={() => viewTavern(t.id)}>View Tavern</button>
          </div>
        ))}
      </div>

      {/* === Toggle Buttons === */}
      <div id="foodie-toggle">
        <button
          className={view === "quick" ? "active" : ""}
          onClick={() => setView("quick")}
        >
          Quick Find
        </button>
        <button
          className={view === "craving" ? "active" : ""}
          onClick={() => setView("craving")}
        >
          What Are You Craving?
        </button>
      </div>

      {/* === Dynamic Panel === */}
      <div id="foodie-panel">
        {/* QUICK FIND VIEW */}
        {view === "quick" && (
          <div>
            {nearby.length > 0 ? (
              nearby.map((t) => (
                <div className="tavern-card" key={t.id}>
                  <img src={t.image} alt={t.name} />
                  <h4>{t.name}</h4>
                  <p>{t.shortDescription}</p>
                  <button onClick={() => showOnMap(t.id)}>Show on Map</button>
                </div>
              ))
            ) : (
              <p>Detecting your location...</p>
            )}
          </div>
        )}

        {/* CRAVING VIEW */}
        {view === "craving" && (
          <div>
            <div className="craving-buttons">
              <button onClick={() => loadCraving("seafood")}>🐟 Seafood</button>
              <button onClick={() => loadCraving("grill")}>🍖 Grill</button>
              <button onClick={() => loadCraving("vibes")}>
                🍷 Neighborhood Vibes
              </button>
            </div>

            <div id="craving-results">
              {craving.length > 0 ? (
                craving.map((t) => (
                  <div className="tavern-card" key={t.id}>
                    <img src={t.image} alt={t.name} />
                    <h4>{t.name}</h4>
                    <p>{t.shortDescription}</p>
                    <button onClick={() => showOnMap(t.id)}>Show on Map</button>
                  </div>
                ))
              ) : (
                <p>Select a craving category above.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
