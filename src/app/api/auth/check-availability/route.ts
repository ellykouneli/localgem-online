// src/app/api/auth/check-availability/route.ts
import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email")?.trim().toLowerCase();
    const username = url.searchParams.get("username")?.trim().toLowerCase();

    if (!email && !username) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    // Build OR filter only from provided params
    const orConditions = [
      email ? `email.eq.${email}` : null,
      username ? `username.eq.${username}` : null,
    ]
      .filter(Boolean)
      .join(",");

    const { data, error } = await supabaseServer
      .from("auth_users")
      .select("id")
      .or(orConditions)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ taken: Boolean(data) });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
