"use client";

import { useState } from "react";
import Image from "next/image";
import { wedding } from "@/config/wedding";
import { ClipIn } from "./ScrollReveal";
import { SectionHeading } from "./SectionHeading";

type Person = { name: string; line: string };
type Photo = { src: string; width: number; height: number; alt: string };

/** Greyscale portrait that turns to colour on hover, focus or tap (the button toggles it on touch). */
function Card({ person, photo, delay, className = "" }: { person: Person; photo: Photo; delay: number; className?: string }) {
  const [color, setColor] = useState(false);

  return (
    <figure className={className}>
      <ClipIn delay={delay}>
        <button
          type="button"
          aria-pressed={color}
          onClick={() => setColor((v) => !v)}
          className="group block w-full"
          data-cursor
        >
          <Image
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            placeholder="blur"
            blurDataURL={wedding.images.blur}
            sizes="(min-width: 1024px) 28rem, (min-width: 640px) 45vw, 88vw"
            className="aspect-[4/5] w-full object-cover object-[50%_30%] grayscale transition-[filter] duration-700 group-hover:grayscale-0 group-aria-pressed:grayscale-0"
          />
        </button>
      </ClipIn>
      <figcaption className="mt-6">
        <p className="font-display text-4xl font-light tracking-[0.06em] md:text-5xl">{person.name}</p>
        <span aria-hidden className="mt-4 block h-px w-12 bg-gold" />
        <p className="mt-4 max-w-xs font-display text-lg italic leading-snug text-ink/80">{person.line}</p>
      </figcaption>
    </figure>
  );
}

export function CoupleCards() {
  const { couple, images } = wedding;
  return (
    <section id="couple" className="px-6 py-24 md:px-12 md:py-36" aria-labelledby="couple-h">
      <div className="mx-auto max-w-5xl">
        <SectionHeading id="couple-h" number={couple.number} label={couple.label} heading={couple.heading} />
        <div data-thread="right" className="mt-16 grid gap-14 sm:grid-cols-2 sm:gap-8 lg:gap-16">
          <Card person={couple.amal} photo={images.amal} delay={0} />
          {/* Slight vertical offset between the two portraits. */}
          <Card person={couple.telma} photo={images.telma} delay={0.15} className="sm:mt-24" />
        </div>
      </div>
    </section>
  );
}
