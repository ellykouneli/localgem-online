import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET() {
  try {
    const r = await resend.emails.send({
      from: process.env.FROM_EMAIL!, // e.g. onboarding@resend.dev for dev
      to: "your@email.com", // replace with your email to test
      subject: "LocalGem test email ✅",
      html: `<p>Hello from LocalGem! ${new Date().toLocaleString()}</p>`,
    });

    // ✅ fix: correct response shape
    return NextResponse.json({
      ok: true,
      id: r.data?.id || "no-id-returned",
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Send failed" },
      { status: 500 }
    );
  }
}
