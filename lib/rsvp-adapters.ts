import type { RsvpInput } from "./rsvp";

/**
 * Server-side RSVP storage. Pick one with RSVP_ADAPTER=sheets | supabase (unset = don't store).
 * To add another backend, implement `RsvpAdapter` and register it in `adapters`.
 */
export type RsvpRecord = RsvpInput & { submittedAt: string };
export interface RsvpAdapter {
  save(record: RsvpRecord): Promise<void>;
}

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

/** Google Sheets through an Apps Script web app (see README for the 10-line script). */
const sheets: RsvpAdapter = {
  async save(record) {
    const res = await fetch(env("GOOGLE_SHEETS_WEBHOOK_URL"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      redirect: "follow", // Apps Script answers with a 302 to the result
    });
    if (!res.ok) throw new Error(`Sheets webhook responded ${res.status}`);
  },
};

/** Supabase REST insert into a table named `rsvps` (SQL in README). Uses the service-role key: server only. */
const supabase: RsvpAdapter = {
  async save({ name, persons, attendance, submittedAt }) {
    const key = env("SUPABASE_SERVICE_ROLE_KEY");
    const res = await fetch(`${env("SUPABASE_URL")}/rest/v1/rsvps`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ name, persons, attendance, submitted_at: submittedAt }),
    });
    if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
  },
};

const adapters: Record<string, RsvpAdapter> = { sheets, supabase };

export function getRsvpAdapter(): RsvpAdapter | null {
  return adapters[process.env.RSVP_ADAPTER ?? ""] ?? null;
}
