import { NextResponse } from "next/server";
import { rsvpSchema } from "@/lib/rsvp";
import { getRsvpAdapter } from "@/lib/rsvp-adapters";

export const runtime = "nodejs";

/** POST /api/rsvp: validates with Zod, then hands the reply to the adapter chosen by RSVP_ADAPTER. */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: real guests never fill this hidden field, bots often do. Pretend success.
  if ("website" in body && (body as { website?: unknown }).website) {
    return NextResponse.json({ ok: true });
  }

  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0].message }, { status: 422 });
  }

  const adapter = getRsvpAdapter();
  if (!adapter) return NextResponse.json({ ok: true, stored: false }); // no backend configured: WhatsApp-only mode

  try {
    await adapter.save({ ...parsed.data, submittedAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error("RSVP storage failed:", err);
    return NextResponse.json({ ok: false, error: "Could not save reply" }, { status: 502 });
  }
}
