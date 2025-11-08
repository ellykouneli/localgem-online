"use client";

import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";

interface InteractiveMapProps {
  tavernId?: string | null;
}

const taverns = [
  {
    id: 1,
    name: "Taverna Nikos",
    coords: { lat: 37.973, lng: 23.726 },
    desc: "By the port, fresh catch daily",
  },
  {
    id: 2,
    name: "Grill House Kostas",
    coords: { lat: 37.975, lng: 23.728 },
    desc: "Authentic souvlaki and live music",
  },
  {
    id: 3,
    name: "Maria's Corner",
    coords: { lat: 37.972, lng: 23.723 },
    desc: "Cozy neighborhood taverna",
  },
];

export default function InteractiveMap({ tavernId }: InteractiveMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const [selectedTavern, setSelectedTavern] = useState<
    (typeof taverns)[0] | null
  >(null);
  const [center, setCenter] = useState({ lat: 37.9838, lng: 23.7275 });
  const [zoom, setZoom] = useState(13);

  // Focus on tavern if ?tavern=id exists
  useEffect(() => {
    if (tavernId) {
      const t = taverns.find((t) => t.id === Number(tavernId));
      if (t) {
        setSelectedTavern(t);
        setCenter(t.coords);
        setZoom(16);
      }
    }
  }, [tavernId]);

  // Confirm when Maps API loads
  useEffect(() => {
    if (isLoaded) console.log("✅ Google Maps API script loaded successfully.");
    if (loadError) console.error("❌ Google Maps failed to load:", loadError);
  }, [isLoaded, loadError]);

  const mapContainerStyle = {
    width: "100%",
    height: "80vh",
    borderRadius: "12px",
  };

  const handleMarkerClick = useCallback((tavern: (typeof taverns)[0]) => {
    setSelectedTavern(tavern);
    setCenter(tavern.coords);
    setZoom(16);
  }, []);

  if (loadError) return <p>❌ Map failed to load.</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
    >
      {/* --- Render all taverns --- */}
      {taverns.map((t) => (
        <Marker
          key={t.id}
          position={t.coords}
          label={t.name}
          onClick={() => handleMarkerClick(t)}
          icon={
            t.id === Number(tavernId)
              ? { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }
              : undefined
          }
        />
      ))}

      {/* --- Info Window --- */}
      {selectedTavern && (
        <InfoWindow
          position={selectedTavern.coords}
          onCloseClick={() => setSelectedTavern(null)}
        >
          <div>
            <h4 style={{ marginBottom: 4 }}>{selectedTavern.name}</h4>
            <p style={{ margin: 0 }}>{selectedTavern.desc}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
