"use client";

import { wedding } from "@/config/wedding";
import { downloadIcs } from "@/lib/ics";
import { Button } from "./Button";
import { ScrollLine } from "./ScrollReveal";
import { SectionHeading } from "./SectionHeading";
import { Sprig } from "./Sprig";

export function CeremonyBlock() {
  const { ceremony, event } = wedding;
  return (
    <section id="ceremony" className="px-6 py-24 md:px-12 md:py-36" aria-labelledby="ceremony-h">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-12">
        <div className="md:col-span-8">
          <SectionHeading id="ceremony-h" number={ceremony.number} label={ceremony.label} heading={ceremony.heading} />
          <div data-thread="left" className="mt-14">
            <p className="font-display text-3xl font-light md:text-5xl">
              <ScrollLine>{event.dateLong}</ScrollLine>
            </p>
            <p className="mt-4 font-display text-xl italic text-ink/80 md:text-2xl">
              <ScrollLine delay={0.12}>{event.muhurtham}</ScrollLine>
            </p>
            <div className="mt-10">
              <Button onClick={downloadIcs}>{ceremony.button}</Button>
            </div>
          </div>
        </div>
        <Sprig className="hidden h-56 justify-self-end md:col-span-4 md:block" />
      </div>
    </section>
  );
}
