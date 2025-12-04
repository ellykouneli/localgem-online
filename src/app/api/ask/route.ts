// src/app/api/ask/route.ts
export const runtime = "nodejs";

import { haversineMeters, metersToMinutes } from "@/lib/geo";
import { nearbyPlaces, placeDetails } from "@/lib/google";
import { nearestSafety } from "@/lib/safety";
import { getWeather } from "@/lib/weather";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Chat message type must include "system"
type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

// Request body shape
type AskBody = {
  message: string;
  coords?: { lat: number; lng: number };
  area?: string;
  timeMinutes?: number;
  noWalk?: boolean;
  maxWalkMinutes?: number;
  history?: ChatMsg[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AskBody;

    const message = body.message ?? "";
    const coords = body.coords;
    const area = body.area;
    const timeMinutes = body.timeMinutes;
    const noWalk = !!body.noWalk;
    const maxWalkMinutes =
      typeof body.maxWalkMinutes === "number"
        ? body.maxWalkMinutes
        : noWalk
          ? 0
          : undefined;
    const history = Array.isArray(body.history) ? body.history : [];

    if (!coords) {
      return NextResponse.json(
        { error: "Missing coords (lat/lng)." },
        { status: 400 }
      );
    }

    // Weather & Safety in parallel
    const [wx, safety] = await Promise.all([
      getWeather(coords),
      nearestSafety(coords),
    ]);

    // Supabase data
    let tipsQ = supabase.from("tips_texts").select("*").limit(30);
    if (area) tipsQ = tipsQ.eq("area", area);
    const { data: tips } = await tipsQ;

    const { data: gems } = await supabase
      .from("hidden_gems")
      .select("*")
      .limit(40);

    // Google places nearby
    const [cafes, sights, museums] = await Promise.all([
      nearbyPlaces({ ...coords, type: "cafe", radius: 1200 }),
      nearbyPlaces({
        ...coords,
        query: "viewpoint OR square OR park",
        radius: 1500,
      }),
      nearbyPlaces({ ...coords, type: "museum", radius: 1800 }),
    ]);

    // Build candidates
    type Candidate = {
      source: "tip" | "gem" | "gplace";
      title: string;
      lat: number;
      lng: number;
      category?: string;
      price_level?: number;
      rating?: number;
      open_now?: boolean;
      place_id?: string;
      // computed
      distM?: number;
      walkMin?: number;
      taxiMin?: number;
      score?: number;
      website?: string;
      phone?: string;
    };

    const candidates: Candidate[] = [];

    for (const t of tips ?? []) {
      if (t.lat && t.lng) {
        candidates.push({
          source: "tip",
          title: t.title ?? "Tip",
          lat: t.lat,
          lng: t.lng,
          category: t.category ?? undefined,
        });
      }
    }

    for (const g of gems ?? []) {
      if (g.lat && g.lng) {
        candidates.push({
          source: "gem",
          title: g.title ?? g.name ?? "Hidden Gem",
          lat: g.lat,
          lng: g.lng,
          category: g.category ?? undefined,
        });
      }
    }

    for (const p of [...cafes, ...sights, ...museums]) {
      candidates.push({
        source: "gplace",
        title: p.name,
        lat: p.geometry.location.lat,
        lng: p.geometry.location.lng,
        price_level: p.price_level,
        rating: p.rating,
        open_now: p.opening_hours?.open_now,
        place_id: p.place_id,
        category: (p.types ?? [])[0],
      });
    }

    // Filter/score candidates by constraints
    const walkCap = typeof maxWalkMinutes === "number" ? maxWalkMinutes : 999;
    const walkAllowed = noWalk ? 0 : walkCap;
    const withinTime = (walkMin: number) =>
      timeMinutes
        ? walkMin <= Math.max(5, Math.floor(timeMinutes * 0.4))
        : true;

    const scored: Candidate[] = [];
    for (const c of candidates) {
      const distM = haversineMeters(coords, { lat: c.lat, lng: c.lng });
      const walkMin = metersToMinutes(distM, "walk");
      const taxiMin = metersToMinutes(distM, "taxi");

      // constraints
      if (noWalk && walkMin > 2) continue; // allow 0–2 min "no walk"
      if (walkMin > walkAllowed) continue;
      if (!withinTime(walkMin)) continue;

      // score
      let score = 0;
      if (c.source === "gem") score += 6;
      if (c.source === "tip") score += 4;
      if (c.rating) score += Math.min(3, c.rating / 1.5);
      if (c.open_now) score += 1.5;
      if (walkMin <= 5) score += 2;
      if (walkMin <= 2) score += 2;

      scored.push({ ...c, distM, walkMin, taxiMin, score });
    }

    scored.sort((a, b) => b.score! - a.score!);

    const top = scored.slice(0, 6);
    const backups = scored.slice(6, 12);

    // Enrich top Google places with details
    await Promise.all(
      top
        .filter((t) => t.place_id)
        .slice(0, 3)
        .map(async (t) => {
          const d = await placeDetails(t.place_id!);
          if (d) {
            t.price_level = d.price_level ?? t.price_level;
            t.website = d.website ?? t.website;
            t.phone = d.international_phone_number ?? t.phone;
            t.open_now = d.opening_hours?.open_now ?? t.open_now;
          }
        })
    );

    const fmt = (x: Candidate) =>
      `- ${x.title} · ${x.category ?? x.source} · ~${x.walkMin} min walk (~${x.taxiMin} min taxi) · rating ${
        x.rating ?? "n/a"
      }${x.open_now === false ? " · possibly closed now" : ""}`;

    const system = `
You are LocalGem's honest on-island assistant.
STRICTLY respect constraints:
- noWalk=true → do not propose walking beyond ~0–2 minutes; prefer sit-down nearby or short taxi/metro.
- Do not exceed maxWalkMinutes.
- Fit within timeMinutes (walking portion ≤ ~40% of available time).
- Weather-aware: if temp ≥ 33°C, minimize outdoor walking; if ≤ 5°C, prefer warm indoors.

Safety:
- If risk >= 4 near the user, add a brief, polite caution like “Keep to the main streets around here.”

Answer style:
- Give 1–2 strong suggestions first (prefer gems/tips), each with access hint (“2 min walk” or “~3 min taxi”).
- If options are limited: be honest, then give 1–2 okay backups that still meet constraints.
- Be concise, specific, friendly. Avoid repeats if user asked “another suggestion”.

Context:
- coords: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}
- area: ${area ?? "unknown"}
- timeMinutes: ${timeMinutes ?? "unknown"}
- noWalk: ${noWalk}
- maxWalkMinutes: ${walkAllowed}
- weather: ${wx?.tempC ?? "?"}°C, ${wx?.desc ?? "unknown"}
- safety: risk=${safety.risk ?? "?"} ${safety.name ? "(" + safety.name + ")" : ""} ${safety.note ?? ""}

Top candidates:
${top.map(fmt).join("\n")}
Backups:
${backups.slice(0, 6).map(fmt).join("\n")}
`.trim();

    const messages: ChatMsg[] = [
      { role: "system", content: system },
      ...history,
      { role: "user", content: message },
    ];

    // Use chat.completions for simpler parsing
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.6,
    });

    const reply =
      completion.choices?.[0]?.message?.content ??
      "I couldn't find a great fit with those constraints. Try loosening the walk time or switching area.";

    return NextResponse.json({
      reply,
      meta: {
        weather: wx,
        safety,
        usedCandidates: top.map((t) => ({
          title: t.title,
          walkMin: t.walkMin,
          taxiMin: t.taxiMin,
          rating: t.rating,
          source: t.source,
        })),
      },
    });
  } catch (err) {
    console.error("ASK API error:", err);
    return NextResponse.json({ error: "Ask API failed." }, { status: 500 });
  }
}
