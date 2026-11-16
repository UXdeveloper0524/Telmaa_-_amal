import { wedding } from "@/config/wedding";
import { Button } from "./Button";
import { ClipIn, ScrollLine } from "./ScrollReveal";
import { SectionHeading } from "./SectionHeading";

/** An illustrated route, intentionally not a navigational map. */
function RouteIllustration() {
  const { venue } = wedding;
  return (
    <figure>
      <div className="relative aspect-square w-full overflow-hidden border border-gold/50 bg-forest text-paper sm:aspect-[4/3]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 450" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <path d="M-35 72 C98 120 142 35 282 82 S490 160 640 75 M-40 207 C120 135 167 208 308 185 S498 105 638 173 M-40 335 C86 283 178 358 315 300 S509 259 638 316 M-20 440 C114 393 208 469 355 405 S538 374 638 424" fill="none" stroke="currentColor" strokeOpacity=".16" strokeWidth="18" />
          <path d="M70 -30 C90 91 122 145 98 241 S86 367 144 485 M313 -30 C257 85 350 137 319 230 S260 379 316 486 M515 -30 C463 62 535 182 476 276 S461 395 505 486" fill="none" stroke="currentColor" strokeOpacity=".14" strokeWidth="10" />
          <path d="M-35 72 C98 120 142 35 282 82 S490 160 640 75 M-40 207 C120 135 167 208 308 185 S498 105 638 173 M-40 335 C86 283 178 358 315 300 S509 259 638 316 M-20 440 C114 393 208 469 355 405 S538 374 638 424" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="1" />
          <path d="M70 -30 C90 91 122 145 98 241 S86 367 144 485 M313 -30 C257 85 350 137 319 230 S260 379 316 486 M515 -30 C463 62 535 182 476 276 S461 395 505 486" fill="none" stroke="currentColor" strokeOpacity=".22" strokeWidth="1" />
          <path d="M103 328 C153 308 196 321 224 283 S269 226 327 218 S387 190 423 132" fill="none" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="103" cy="328" r="5" fill="var(--gold)" />
          <circle cx="103" cy="328" r="12" fill="none" stroke="var(--gold)" strokeOpacity=".7" />
          <circle cx="423" cy="132" r="20" fill="var(--forest)" stroke="var(--gold)" strokeWidth="2" />
          <circle cx="423" cy="132" r="5" fill="var(--gold)" />
        </svg>
        <div className="absolute left-6 top-6 border-l border-gold pl-3 sm:left-8 sm:top-8">
          <p className="label text-paper/70">The way to our day</p>
          <p className="mt-1 font-display text-2xl italic sm:text-3xl">{venue.locality.split(",")[0]}</p>
        </div>
        <div className="absolute bottom-6 right-6 max-w-[11rem] bg-forest/90 px-3 py-2 text-right sm:bottom-8 sm:right-8">
          <p className="label text-gold">Destination</p>
          <p className="mt-1 font-display text-xl leading-none sm:text-2xl">{venue.name}</p>
        </div>
      </div>
      <figcaption className="label mt-3 text-[0.55rem] text-ink/60">Illustrated route · not to scale</figcaption>
    </figure>
  );
}

export function VenueBlock() {
  const { venue } = wedding;
  return (
    <section id="venue" className="px-6 py-24 md:px-12 md:py-36" aria-labelledby="venue-h">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="venue-h" number={venue.number} label={venue.label} heading={venue.heading} />
        <div className="mt-12 grid items-center gap-10 md:mt-16 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-12 lg:gap-20">
          <ClipIn>
            <RouteIllustration />
          </ClipIn>
          <div className="md:py-8">
            <p className="font-script text-3xl text-gold md:text-4xl">Find your way to us</p>
            <span aria-hidden className="mt-5 block h-px w-20 bg-gold" />
            <address data-thread="right" className="mt-8 not-italic">
              <p className="font-display text-4xl font-light leading-tight md:text-5xl">
                <ScrollLine>{venue.name}</ScrollLine>
              </p>
              <p className="mt-5 font-display text-xl leading-snug text-ink/80 md:text-2xl">
                <ScrollLine delay={0.1}>{venue.locality}</ScrollLine>
                <ScrollLine delay={0.2}>{venue.region}</ScrollLine>
              </p>
            </address>
            <div className="mt-8">
              <Button href={venue.mapUrl}>{venue.button}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
