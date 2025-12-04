import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

type OnDutyType = "pharmacy" | "hospital";

type PharmacyRow = {
  id: string;
  name: string | null;
  area: string | null;
  address: string | null;
  phone: string | null;
  lat: number | null;
  lng: number | null;
};

type HospitalRow = {
  id: string;
  hospital_name: string | null;
  address: string | null;
  phone: string | null;
  lat: number | null;
  lng: number | null;
  shift_date?: string | null;
};

// Haversine distance in meters between two lat/lng points
function distanceInMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // radius of Earth in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lng2 - lng1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const typeParam = searchParams.get("type");
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    const radiusParam = searchParams.get("radius");

    const type = typeParam === "hospital" ? "hospital" : "pharmacy";

    if (!latParam || !lngParam) {
      return NextResponse.json(
        { error: "lat and lng query params are required" },
        { status: 400 }
      );
    }

    const userLat = parseFloat(latParam);
    const userLng = parseFloat(lngParam);

    if (Number.isNaN(userLat) || Number.isNaN(userLng)) {
      return NextResponse.json(
        { error: "lat and lng must be valid numbers" },
        { status: 400 }
      );
    }

    // For pharmacies: we use radius (meters) if given, otherwise default 2000m (2km)
    let radius =
      type === "pharmacy" && radiusParam
        ? parseFloat(radiusParam)
        : type === "pharmacy"
          ? 3000
          : Infinity; // hospitals ignore radius (all Attica)

    if (Number.isNaN(radius)) {
      radius = type === "pharmacy" ? 2000 : Infinity;
    }

    if (type === "pharmacy") {
      // Fetch all pharmacies on duty with coords
      const { data, error } = await supabase
        .from("on_duty_pharmacies")
        .select("id, name, area, address, phone, lat, lng");

      if (error) {
        console.error("Supabase pharmacies error:", error);
        return NextResponse.json(
          { error: "Failed to load pharmacies" },
          { status: 500 }
        );
      }

      const rows = (data ?? []) as PharmacyRow[];

      // Filter out rows without coords, compute distance, filter & sort
      const withDistances = rows
        .filter((p) => typeof p.lat === "number" && typeof p.lng === "number")
        .map((p) => {
          const distance = distanceInMeters(
            userLat,
            userLng,
            p.lat as number,
            p.lng as number
          );
          return { ...p, distance };
        })
        .filter((p) => p.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

      // Shape for OnDutyMap
      const result = withDistances.map((p) => ({
        id: p.id,
        name: p.name ?? "Pharmacy",
        address:
          p.address || (p.area ? `${p.area}, Αττική` : "Address unavailable"),
        phone: p.phone,
        coords: {
          lat: p.lat as number,
          lng: p.lng as number,
        },
      }));

      return NextResponse.json(result);
    } else {
      // Hospitals
      const { data, error } = await supabase
        .from("on_duty_hospitals")
        .select("id, hospital_name, address, phone, lat, lng, shift_date");

      if (error) {
        console.error("Supabase hospitals error:", error);
        return NextResponse.json(
          { error: "Failed to load hospitals" },
          { status: 500 }
        );
      }

      const rows = (data ?? []) as HospitalRow[];

      // No radius filter for hospitals — show all, sorted by distance if coords exist
      const withDistances = rows
        .filter((h) => typeof h.lat === "number" && typeof h.lng === "number")
        .map((h) => {
          const distance = distanceInMeters(
            userLat,
            userLng,
            h.lat as number,
            h.lng as number
          );
          return { ...h, distance };
        })
        .sort((a, b) => a.distance - b.distance);

      const result = withDistances.map((h) => ({
        id: h.id,
        name: h.hospital_name ?? "Hospital",
        address: h.address ?? "Address unavailable",
        phone: h.phone,
        coords: {
          lat: h.lat as number,
          lng: h.lng as number,
        },
      }));

      return NextResponse.json(result);
    }
  } catch (err: any) {
    console.error("Unexpected /api/on-duty error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
