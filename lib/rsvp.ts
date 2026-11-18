import { z } from "zod";
import { wedding } from "@/config/wedding";

/** Per-step validation, shared with the complete RSVP payload. */
export const rsvpStepSchema = {
  name: z.string().trim().min(2, "Please tell us your name").max(80, "That name is a little long"),
  attendance: z.enum(["accept", "decline"], { errorMap: () => ({ message: "Please choose one" }) }),
  persons: z.coerce.number().int("Enter a whole number of persons").min(1, "Enter at least 1 person"),
};

/** Declining guests have zero attendees; accepting guests must provide a count. */
export const rsvpSchema = z.object({
  name: rsvpStepSchema.name,
  attendance: rsvpStepSchema.attendance,
  persons: z.coerce.number({ invalid_type_error: "Enter number of persons" }).int().min(0),
}).superRefine((reply, context) => {
  if (reply.attendance === "accept" && reply.persons < 1) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["persons"], message: "Enter at least 1 person" });
  }
  if (reply.attendance === "decline" && reply.persons !== 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["persons"], message: "A declined reply has zero attendees" });
  }
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

/** wa.me link with the reply pre-written, addressed to the family number in config. */
export function buildWhatsAppUrl(r: RsvpInput): string {
  const { names, event, rsvp } = wedding;
  const reply = r.attendance === "accept"
    ? `I will joyfully attend. Number of persons (including me): ${r.persons}.`
    : "I regretfully will not be able to attend.";
  const text = `Hello! This is ${r.name}. ${reply} The wedding of ${names.first} & ${names.second} is on ${event.dateLong}.`;
  return `https://wa.me/${rsvp.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
