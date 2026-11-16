import { z } from "zod";
import { wedding } from "@/config/wedding";

/** Shared by the RsvpFlow form (per-step) and the /api/rsvp route (whole payload). */
export const rsvpSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(80, "That name is a little long"),
  // Stored in E.164-ish form: "+919876543210".
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s()-]/g, ""))
    .pipe(z.string().regex(/^\+\d{8,15}$/, "Please include your country code, e.g. +91 98765 43210")),
  attendance: z.enum(["accept", "decline"], { errorMap: () => ({ message: "Please choose one" }) }),
  message: z.string().trim().max(500, "Please keep it under 500 characters").default(""),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

/** wa.me link with the reply pre-written, addressed to the family number in config. */
export function buildWhatsAppUrl(r: RsvpInput): string {
  const { names, event, rsvp } = wedding;
  const verdict =
    r.attendance === "accept"
      ? "I will joyfully attend"
      : "I regretfully will not be able to attend";
  const text = [
    `Hello! This is ${r.name} (${r.phone}).`,
    `${verdict} the wedding of ${names.first} & ${names.second} on ${event.dateLong}.`,
    r.message && `\n${r.message}`,
  ]
    .filter(Boolean)
    .join(" ");
  return `https://wa.me/${rsvp.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
