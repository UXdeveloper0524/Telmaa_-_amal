"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { wedding } from "@/config/wedding";
import { EXPO_OUT } from "@/lib/motion";
import { buildWhatsAppUrl, rsvpSchema, rsvpStepSchema, type RsvpInput } from "@/lib/rsvp";
import { Button } from "./Button";
import { SectionHeading } from "./SectionHeading";
import { ThreadKnot } from "./ThreadKnot";

/**
 * Conversational RSVP: one question per screen, Enter to continue, Back to revisit.
 * A small gold thread fills as the guest progresses. On submit WhatsApp opens with the reply
 * pre-written, the reply is optionally POSTed to /api/rsvp, and the thread ties into a knot.
 */
const FIELDS = ["name", "attendance", "persons"] as const;
type Field = (typeof FIELDS)[number];
type Draft = { name: string; attendance: "accept" | "decline" | ""; persons: string };

const EMPTY: Draft = { name: "", attendance: "", persons: "" };
const INPUT =
  "block w-full border-0 border-b border-gold bg-transparent py-3 font-display text-3xl font-light text-ink placeholder:text-ink/40 focus:border-ink md:text-5xl";

export function RsvpFlow() {
  const { rsvp } = wedding;
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [error, setError] = useState("");
  const [sent, setSent] = useState<{ data: RsvpInput; url: string } | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const started = useRef(false); // never steal focus (and scroll) before the guest has interacted

  const field: Field = FIELDS[step];
  // Widened on purpose: the config literal differs per field, the form treats them uniformly.
  const q: { prompt: string; placeholder?: string; hint?: string; required: boolean; accept?: string; decline?: string } =
    rsvp.questions[field];
  const last = field === "persons" || (field === "attendance" && draft.attendance === "decline");
  const total = draft.attendance === "decline" ? 2 : FIELDS.length;

  useEffect(() => {
    if (started.current) panel.current?.querySelector<HTMLElement>("input")?.focus({ preventScroll: true });
  }, [step]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setError("");
  };

  function submit() {
    const parsed = rsvpSchema.safeParse({ ...draft, persons: draft.attendance === "decline" ? 0 : draft.persons });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    const url = buildWhatsAppUrl(parsed.data);
    // Open WhatsApp synchronously inside the tap so mobile browsers don't block it.
    if (!window.open(url, "_blank", "noopener")) window.location.href = url;
    if (rsvp.postToApi) {
      fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        keepalive: true,
      }).catch(() => undefined); // WhatsApp is the primary channel; storage is best-effort
    }
    setSent({ data: parsed.data, url });
  }

  function next(e: React.FormEvent) {
    e.preventDefault();
    const result = rsvpStepSchema[field].safeParse(draft[field]);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    started.current = true;
    if (last) submit();
    else setStep(step + 1);
  }

  const back = () => {
    started.current = true;
    setError("");
    setStep(step - 1);
  };

  const progress = sent ? 1 : step / total;

  return (
    <section id="rsvp" className="px-6 py-24 md:px-12 md:py-36" aria-labelledby="rsvp-h">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          id="rsvp-h"
          number={rsvp.number}
          label={rsvp.label}
          heading={rsvp.heading}
          sub={rsvp.sub}
        />

        <div data-thread="right" className="mt-14 min-h-[24rem] max-w-3xl">
          {sent ? (
            <div className="py-6" role="status">
              <ThreadKnot waypoint={false} replayKey="sent" className="-ml-2 w-28" />
              <p className="mt-6 font-display text-3xl font-light md:text-5xl">
                {sent.data.attendance === "accept" ? rsvp.thanks.accept : rsvp.thanks.decline}
              </p>
              <p className="mt-6 font-display text-lg italic text-ink/80">
                Didn’t see WhatsApp open?{" "}
                <a href={sent.url} target="_blank" rel="noopener noreferrer" className="underline decoration-gold underline-offset-4">
                  Open it again
                </a>
              </p>
            </div>
          ) : (
            <form onSubmit={next} noValidate>
              {/* The thread fills as the guest moves through the questions (transform-free: pathLength). */}
              <div className="flex items-center gap-4">
                <span className="label tabular text-ink/70">
                  {step + 1} / {total}
                </span>
                <svg viewBox="0 0 360 12" preserveAspectRatio="none" className="h-3 flex-1" aria-hidden fill="none">
                  <path
                    d="M0 6 C40 -2 80 14 120 6 S200 -2 240 6 S320 14 360 6"
                    stroke="var(--gold)"
                    strokeOpacity={0.3}
                    vectorEffect="non-scaling-stroke"
                  />
                  <m.path
                    d="M0 6 C40 -2 80 14 120 6 S200 -2 240 6 S320 14 360 6"
                    stroke="var(--gold)"
                    vectorEffect="non-scaling-stroke"
                    initial={false}
                    animate={{ pathLength: progress }}
                    transition={{ duration: reduce ? 0 : 0.8, ease: EXPO_OUT }}
                  />
                </svg>
              </div>

              {/* Screen-reader announcements for step changes and validation. */}
              <p className="sr-only" role="status" aria-live="polite">
                Question {step + 1} of {total}: {q.prompt}
              </p>

              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={field}
                  ref={panel}
                  initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -16 }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: EXPO_OUT }}
                  className="mt-10 min-h-[13rem]"
                >
                  {field === "attendance" ? (
                    <fieldset aria-describedby={error ? "rsvp-error" : undefined}>
                      <legend className="font-display text-2xl italic text-ink/80 md:text-3xl">
                        {q.prompt} <span aria-hidden>*</span>
                      </legend>
                      <div className="mt-8 flex flex-col gap-4 sm:flex-row" role="radiogroup">
                        {(["accept", "decline"] as const).map((value) => (
                          <label key={value} className="relative cursor-pointer">
                            <input
                              type="radio"
                              name="attendance"
                              value={value}
                              checked={draft.attendance === value}
                              onChange={() => set("attendance", value)}
                              className="peer sr-only"
                            />
                            <span className="block rounded-full border border-gold px-9 py-5 text-center font-display text-2xl italic transition-colors duration-300 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-ink md:text-3xl">
                              {value === "accept" ? q.accept : q.decline}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ) : (
                    <>
                      <label htmlFor={`rsvp-${field}`} className="font-display text-2xl italic text-ink/80 md:text-3xl">
                        {q.prompt}
                        {q.required && <span aria-hidden> *</span>}
                        {q.hint && <span className="label ml-3 text-ink/70">{q.hint}</span>}
                      </label>
                      <input
                        id={`rsvp-${field}`}
                        type={field === "persons" ? "number" : "text"}
                        inputMode={field === "persons" ? "numeric" : "text"}
                        min={field === "persons" ? 1 : undefined}
                        step={field === "persons" ? 1 : undefined}
                        autoComplete={field === "name" ? "name" : "off"}
                        value={draft[field]}
                        placeholder={q.placeholder}
                        onChange={(e) => set(field, e.target.value)}
                        aria-required="true"
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? "rsvp-error" : undefined}
                        className={`${INPUT} mt-4`}
                      />
                    </>
                  )}

                  <p id="rsvp-error" role="alert" className="mt-4 min-h-[1.75rem] font-display text-lg italic text-ink">
                    {error}
                  </p>
                </m.div>
              </AnimatePresence>

              <div className="mt-6 flex items-center gap-8">
                <Button type="submit">{last ? rsvp.submit : rsvp.next}</Button>
                {step > 0 && (
                  <button type="button" onClick={back} className="label text-ink/70 underline decoration-gold underline-offset-8">
                    {rsvp.back}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
