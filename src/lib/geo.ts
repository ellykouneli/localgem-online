export function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180,
    la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
export function metersToMinutes(
  meters: number,
  mode: "walk" | "taxi" = "walk"
) {
  const mps = mode === "walk" ? 1.33 : 8.33; // ~4.8km/h walk, ~30km/h taxi avg city
  return Math.round(meters / mps / 60);
}
