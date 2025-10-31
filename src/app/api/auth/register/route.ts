// src/app/api/auth/register/route.ts
import { supabaseServer } from "@/lib/supabaseServer";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const bad = (msg: string, code = 400) =>
  NextResponse.json({ error: msg }, { status: code });
const ok = () => NextResponse.json({ ok: true });

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();

    const mail = String(email ?? "")
      .trim()
      .toLowerCase();
    const uname = String(username ?? "")
      .trim()
      .toLowerCase();
    const pass = String(password ?? "").trim();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
    if (!emailOk || uname.length < 3 || pass.length < 6) {
      return bad("Invalid input");
    }

    // unique check (email OR username)
    const { data: exists, error: selErr } = await supabaseServer
      .from("auth_users")
      .select("id")
      .or(`email.eq.${mail},username.eq.${uname}`)
      .maybeSingle();

    if (selErr) throw selErr;
    if (exists) return bad("Email or username already in use", 409);

    // insert
    const password_hash = await bcrypt.hash(pass, 12);
    const { error: insErr } = await supabaseServer
      .from("auth_users")
      .insert({ email: mail, username: uname, password_hash });

    if (insErr) throw insErr;

    return ok();
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
