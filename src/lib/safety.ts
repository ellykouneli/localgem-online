import { createClient } from "@supabase/supabase-js";
import { haversineMeters } from "./geo";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function nearestSafety({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const { data } = await supabase.from("safety_zones").select("*").limit(1000);
  if (!data?.length)
    return {
      risk: undefined as number | undefined,
      note: undefined as string | undefined,
    };
  let best = data[0],
    dmin = Infinity;
  for (const row of data) {
    const d = haversineMeters({ lat, lng }, { lat: row.lat, lng: row.lng });
    if (d < dmin) {
      dmin = d;
      best = row;
    }
  }
  return {
    risk: best.risk_score as number,
    note: best.notes as string | undefined,
    name: best.name as string | undefined,
  };
}
