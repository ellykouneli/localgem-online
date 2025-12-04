type Place = {
  place_id: string;
  name: string;
  geometry: { location: { lat: number; lng: number } };
  opening_hours?: { open_now?: boolean };
  price_level?: number;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  vicinity?: string;
};

export async function nearbyPlaces({
  lat,
  lng,
  query,
  type,
  radius = 1200,
}: {
  lat: number;
  lng: number;
  query?: string;
  type?: string;
  radius?: number;
}): Promise<Place[]> {
  const key = process.env.GOOGLE_MAPS_API_KEY!;
  const base = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
  const params = new URLSearchParams({
    key,
    location: `${lat},${lng}`,
    radius: String(radius),
  });
  if (query) params.set("keyword", query);
  if (type) params.set("type", type);
  const r = await fetch(`${base}?${params.toString()}`);
  if (!r.ok) return [];
  const j = await r.json();
  return (j.results ?? []) as Place[];
}

export async function placeDetails(placeId: string) {
  const key = process.env.GOOGLE_MAPS_API_KEY!;
  const fields = [
    "opening_hours",
    "international_phone_number",
    "website",
    "price_level",
    "rating",
    "user_ratings_total",
  ].join(",");
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${key}`;
  const r = await fetch(url);
  if (!r.ok) return null;
  const j = await r.json();
  return j.result ?? null;
}
