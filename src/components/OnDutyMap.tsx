"use client";

import {
  Circle,
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type OnDutyType = "pharmacy" | "hospital";

type OnDutyPlace = {
  id: string;
  name: string;
  address: string;
  phone?: string | null;
  coords: { lat: number; lng: number };
  sourceUrl?: string | null;
};

interface OnDutyMapProps {
  type: OnDutyType;
}

const DEFAULT_CENTER = { lat: 37.9838, lng: 23.7275 }; // Athens
const PHARMACY_RADIUS_METERS = 3000; // 2 km – pharmacies only

export default function OnDutyMap({ type }: OnDutyMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [places, setPlaces] = useState<OnDutyPlace[]>([]);
  const [selected, setSelected] = useState<OnDutyPlace | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ask for user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setError(null);
      },
      () => {
        setError("We couldn't access your location. Please enable GPS.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Fetch on-duty places from your backend API
  useEffect(() => {
    if (!userLocation) return;

    const fetchPlaces = async () => {
      try {
        setError(null);

        // Build API URL
        let url = `/api/on-duty?type=${type}&lat=${userLocation.lat}&lng=${userLocation.lng}`;

        // Only pharmacies care about radius; hospitals = whole Attica
        if (type === "pharmacy") {
          url += `&radius=${PHARMACY_RADIUS_METERS}`;
        }

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error("Failed to load on-duty data.");
        }

        const data = (await res.json()) as OnDutyPlace[];
        setPlaces(data);
      } catch (err) {
        console.error(err);
        setError("Could not load on-duty data right now.");
      }
    };

    fetchPlaces();
  }, [type, userLocation]);

  const center = userLocation ?? DEFAULT_CENTER;

  const mapContainerStyle = useMemo(
    () => ({
      width: "100%",
      height: "75vh",
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
          <p className="text-center text-sm text-red-600 mt-2 px-4 py-2">
            {error}
          </p>
        )}

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={userLocation ? (type === "pharmacy" ? 14 : 11) : 11}
          options={mapOptions}
        >
          {/* User location marker (always) + 2km circle (pharmacies only) */}
          {userLocation && (
            <>
              <Marker
                position={userLocation}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                }}
              />
              {type === "pharmacy" && (
                <Circle
                  center={userLocation}
                  radius={PHARMACY_RADIUS_METERS}
                  options={{
                    strokeOpacity: 0.5,
                    strokeWeight: 1,
                    fillOpacity: 0.05,
                  }}
                />
              )}
            </>
          )}

          {/* On-duty places */}
          {places.map((p) => (
            <Marker
              key={p.id}
              position={p.coords}
              onClick={() => setSelected(p)}
            >
              {selected && selected.id === p.id && (
                <InfoWindow onCloseClick={() => setSelected(null)}>
                  <div className="p-1 text-sm space-y-1 max-w-[220px]">
                    <h4 className="font-display font-semibold text-brand-dark">
                      {p.name}
                    </h4>
                    <p className="text-xs text-neutral-700">{p.address}</p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          p.address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded-md text-xs font-medium bg-brand-light text-white hover:opacity-90 transition"
                      >
                        Show in Google Maps
                      </a>

                      {p.phone && (
                        <a
                          href={`tel:${p.phone}`}
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
