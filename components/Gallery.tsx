"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { wedding } from "@/config/wedding";
import { ClipIn } from "./ScrollReveal";

const { images } = wedding;

function Still({
  photo,
  className = "",
}: {
  photo: { src: string; width: number; height: number; alt: string };
  className?: string;
}) {
  return (
    <ClipIn className={className}>
      <Image
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        placeholder="blur"
        blurDataURL={images.blur}
        sizes="(min-width: 1024px) 30rem, 46vw"
        className="aspect-[3/4] w-full object-cover"
      />
    </ClipIn>
  );
}

/** Two-up gallery strip (3:4), offset so the pair reads as a loose, hand-laid spread. */
export function GalleryStrip() {
  return (
    <div data-thread="left" className="mx-auto grid max-w-4xl grid-cols-2 gap-3 px-6 pb-24 md:gap-8 md:px-12 md:pb-36">
      <Still photo={images.story1} />
      <Still photo={images.story2} className="mt-12 md:mt-24" />
    </div>
  );
}

/** Full-bleed dark band between sections, with a gentle parallax on the photo. */
export function DarkBand() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const photo = images.story3;

  return (
    <div ref={ref} data-band className="relative h-[85svh] min-h-[28rem] overflow-hidden bg-forest xl:[@media(pointer:fine)]:h-[100svh]">
      <m.div className="absolute inset-0" style={{ y: reduce ? 0 : y, scale: 1.14 }}>
        <Image
          src={photo.src}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          placeholder="blur"
          blurDataURL={images.blur}
          sizes="100vw"
          className="h-full w-full object-cover object-[50%_35%] xl:[@media(pointer:fine)]:object-[50%_14%]"
        />
      </m.div>
      {/* Flat forest tint (no gradient) so the thread and any caption stay legible. */}
      <div aria-hidden className="absolute inset-0 bg-forest/40" />
      {/* The thread crosses the band through its centre. */}
      <div data-thread="center" aria-hidden className="absolute inset-x-0 top-1/2 h-px" />
    </div>
  );
}
