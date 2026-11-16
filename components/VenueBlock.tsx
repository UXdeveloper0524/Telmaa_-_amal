import { wedding } from "@/config/wedding";
import { Button } from "./Button";
import { ScrollLine } from "./ScrollReveal";
import { SectionHeading } from "./SectionHeading";

export function VenueBlock() {
  const { venue } = wedding;
  return (
    <section id="venue" className="px-6 py-24 md:px-12 md:py-36" aria-labelledby="venue-h">
      <div className="mx-auto max-w-5xl md:text-right">
        <SectionHeading id="venue-h" number={venue.number} label={venue.label} heading={venue.heading} />
        <address data-thread="right" className="mt-14 not-italic">
          <p className="font-display text-3xl font-light md:text-5xl">
            <ScrollLine>{venue.name}</ScrollLine>
          </p>
          <p className="mt-5 font-display text-xl text-ink/80 md:text-2xl">
            <ScrollLine delay={0.1}>{venue.locality}</ScrollLine>
            <ScrollLine delay={0.2}>{venue.region}</ScrollLine>
          </p>
        </address>
        <div className="mt-10">
          <Button href={venue.mapUrl}>{venue.button}</Button>
        </div>
      </div>
    </section>
  );
}
