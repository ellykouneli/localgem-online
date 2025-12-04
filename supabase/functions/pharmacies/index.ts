import cheerio from "cheerio";
import { createClient } from "supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_KEY")!;
const GEOCODE_KEY = Deno.env.get("GOOGLE_MAPS_GEOCODING_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

Deno.serve(async () => {
  try {
    // 1. Fetch HTML from FSA
    const res = await fetch("https://fsa-efimeries.gr/efimeries");
    const html = await res.text();
    const $ = cheerio.load(html);

    const pharmacies = [];

    $(".efimeries-item").each((_, el) => {
      const name = $(el).find(".title").text().trim();
      const address = $(el).find(".address").text().trim();
      const phone = $(el).find(".phone").text().trim();

      pharmacies.push({
        name,
        address,
        phone,
      });
    });

    // 2. Geocode all addresses
    const geocoded = [];
    for (const p of pharmacies) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        p.address
      )}&key=${GEOCODE_KEY}`;

      const geo = await fetch(url).then((r) => r.json());
      const loc = geo?.results?.[0]?.geometry?.location;

      geocoded.push({
        ...p,
        lat: loc?.lat ?? null,
        lng: loc?.lng ?? null,
        fetched_at: new Date().toISOString(),
        source_url: "https://fsa-efimeries.gr/efimeries",
      });
    }

    // 3. Replace table with new data
    await supabase.from("on_duty_pharmacies").delete().neq("id", "0");
    await supabase.from("on_duty_pharmacies").insert(geocoded);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});
