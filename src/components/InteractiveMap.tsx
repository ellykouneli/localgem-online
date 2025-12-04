"use client";

import { supabase } from "@/lib/supabaseClient";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

interface InteractiveMapProps {
  // If this is set (?tavern=<id>), we want “single tavern mode”
  tavernId?: string | null;
  // If this is true (?mode=all), we want “show everything”
  showAllMarkers?: boolean;
}

type MapTavern = {
  id: string;
  name: string;
  desc: string;
  coords: { lat: number; lng: number };
  phone?: string | null;
  googlePlaceId?: string | null;
};

const DEFAULT_CENTER = { lat: 37.9838, lng: 23.7275 };

export default function InteractiveMap({
  tavernId,
  showAllMarkers = false,
}: InteractiveMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const [taverns, setTaverns] = useState<MapTavern[]>([]);
  const [selectedTavern, setSelectedTavern] = useState<MapTavern | null>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(13);
  const [error, setError] = useState<string | null>(null);

  // 1. Load all taverns from Supabase
  useEffect(() => {
    const fetchTaverns = async () => {
      setError(null);

      const { data, error } = await supabase
        .from("taverns")
        .select(
          "id, name, description, latitude, longitude, phone, google_place_id"
        );

      if (error) {
        console.error("Error fetching taverns for map:", error.message);
        setError("Could not load taverns on the map.");
        return;
      }

      const mapped: MapTavern[] =
        (data ?? [])
          .filter((t) => t.latitude !== null && t.longitude !== null)
          .map((t) => ({
            id: t.id as string,
            name: t.name as string,
            desc: (t.description as string | null) ?? "",
            coords: {
              lat: t.latitude as number,
              lng: t.longitude as number,
            },
            phone: (t as any).phone ?? null,
            googlePlaceId: (t as any).google_place_id ?? null,
          })) || [];

      setTaverns(mapped);
    };

    fetchTaverns();
  }, []);

  // 2. If a specific tavern is in the URL, focus the map on it
  useEffect(() => {
    if (!tavernId || taverns.length === 0) return;

    const found = taverns.find((t) => t.id === tavernId);
    if (found) {
      setSelectedTavern(found);
      setCenter(found.coords);
      setZoom(16);
    } else {
      // If id not found, just reset to default center
      setSelectedTavern(null);
      setCenter(DEFAULT_CENTER);
      setZoom(13);
    }
  }, [tavernId, taverns]);

  // 3. Decide which markers to draw on the map
  const markersToShow = useMemo(() => {
    // “Around me” / Quick Find → show everything
    if (showAllMarkers) {
      return taverns;
    }

    // Single tavern mode → show only that tavern
    if (tavernId) {
      const found = taverns.find((t) => t.id === tavernId);
      return found ? [found] : [];
    }

    // No mode specified → default to all taverns
    return taverns;
  }, [showAllMarkers, tavernId, taverns]);

  // 4. Marker click → open info window and re-center
  const handleMarkerClick = useCallback((t: MapTavern) => {
    setSelectedTavern(t);
    setCenter(t.coords);
    setZoom(16);
  }, []);

  // Map styling & options (unchanged)
  const mapContainerStyle = useMemo(
    () => ({
      width: "100%",
      height: "80vh",
      borderRadius: "16px",
    }),
    []
  );

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      zoomControl: true,
      gestureHandling: "greedy" as const,
      mapTypeControl: false,
      styles: [
        {
          featureType: "all",
          elementType: "geometry",
          stylers: [{ color: "#e9ecef" }],
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "geometry.fill",
          stylers: [{ color: "#cceff4" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }],
        },
      ],
    }),
    []
  );

  if (loadError) {
    return <p className="text-red-500">❌ Map failed to load.</p>;
  }

  if (!isLoaded) {
    return (
      <div className="relative w-full h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-light/10 to-brand/10 animate-pulse rounded-xl shadow-inner" />
        <p className="relative z-10 text-brand-dark font-medium">
          Loading map...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full flex justify-center"
    >
      <div className="w-full max-w-6xl bg-white/70 backdrop-blur-md border border-brand-light/30 shadow-card rounded-2xl overflow-hidden">
        {error && (
          <p className="text-center text-sm text-red-600 mt-2">{error}</p>
        )}

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={mapOptions}
        >
          {markersToShow.map((t) => (
            <Marker
              key={t.id}
              position={t.coords}
              onClick={() => handleMarkerClick(t)}
              icon={{
                url:
                  t.id === tavernId
                    ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              }}
            >
              {/* Attach the info window to THIS marker */}
              {selectedTavern && selectedTavern.id === t.id && (
                <InfoWindow onCloseClick={() => setSelectedTavern(null)}>
                  <div className="p-1 text-sm space-y-2">
                    <h4 className="font-display font-semibold text-brand-dark">
                      {selectedTavern.name}
                    </h4>

                    {selectedTavern.desc && (
                      <p className="text-neutral-700 line-clamp-3">
                        {selectedTavern.desc}
                      </p>
                    )}

                    <div className="flex gap-2 pt-1">
                      {/* Open in Google Maps */}
                      <a
                        href={
                          selectedTavern.googlePlaceId
                            ? `https://www.google.com/maps/place/?q=place_id:${selectedTavern.googlePlaceId}`
                            : `https://www.google.com/maps/search/?api=1&query=${selectedTavern.coords.lat},${selectedTavern.coords.lng}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded-md text-xs font-medium bg-brand-light text-white hover:opacity-90 transition"
                      >
                        Open in Google Maps
                      </a>

                      {/* Call button – only if phone exists */}
                      {selectedTavern.phone && (
                        <a
                          href={`tel:${selectedTavern.phone}`}
                          className="px-2 py-1 rounded-md text-xs font-medium bg-white text-brand-dark border border-brand-light/60 hover:bg-brand-light/10 transition"
                        >
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </div>
    </motion.div>
  );
}
