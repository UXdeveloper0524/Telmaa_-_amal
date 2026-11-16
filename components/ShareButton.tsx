"use client";

import { wedding } from "@/config/wedding";
import { Button } from "./Button";
import { SectionHeading } from "./SectionHeading";
import { ThreadKnot } from "./ThreadKnot";

/** Web Share API where available (opens the native sheet, WhatsApp included); wa.me otherwise. */
async function share() {
  // Share the clean link: the personal ?guest= greeting is not passed along.
  const url = `${window.location.origin}${window.location.pathname}`;
  const text = wedding.share.message;

  if (navigator.share) {
    try {
      await navigator.share({ title: wedding.seo.title, text, url });
      return;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return; // guest closed the sheet
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank", "noopener");
}

/** Last section: share button, then the thread ties into a knot between the two names. */
export function ShareSection() {
  const { share: copy, names } = wedding;
  return (
    <section id="share" className="px-6 pb-16 pt-24 text-center md:px-12 md:pt-36" aria-labelledby="share-h">
      <div className="mx-auto max-w-5xl">
        <SectionHeading id="share-h" label={copy.label} heading={copy.heading} align="center" />
        <div className="mt-12">
          <Button onClick={share}>{copy.button}</Button>
        </div>

        <div className="mx-auto mt-28 grid max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-8" aria-hidden>
          <span className="text-right font-display text-2xl font-light uppercase tracking-[0.08em] sm:text-4xl md:text-6xl">
            {names.first}
          </span>
          <ThreadKnot />
          <span className="text-left font-display text-2xl font-light uppercase tracking-[0.08em] sm:text-4xl md:text-6xl">
            {names.second}
          </span>
        </div>

        <footer className="mt-16 border-t border-gold/50 pt-8">
          <p className="label tabular text-ink/70">{copy.footer}</p>
        </footer>
      </div>
    </section>
  );
}
