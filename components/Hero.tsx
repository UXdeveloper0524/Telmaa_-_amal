"use client";

import { Suspense, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { wedding } from "@/config/wedding";
import { Countdown } from "./Countdown";
import { FadeUp, MaskLine } from "./Reveal";
import { Specks } from "./Specks";

/** "Dear {Name}," when the link carries ?guest=Name. React escapes the value; length is capped. */
function GuestGreeting() {
  const guest = useSearchParams().get("guest")?.trim().slice(0, 40);
  if (!guest) return null;
  return (
    <FadeUp delay={0.35}>
      <p className="mt-2 font-display text-2xl italic text-ink">
        {wedding.hero.guestPrefix} {guest},
      </p>
    </FadeUp>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const archRef = useRef<HTMLDivElement>(null);
  const img = wedding.images.hero;

  // Slow parallax on the photo inside the arch (transform only).
  const { scrollYProgress } = useScroll({ target: archRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section id="top" className="relative isolate overflow-hidden px-6 pb-16 pt-20 md:px-12 lg:px-20 lg:pt-24">
      <Specks />

      <div className="mx-auto grid max-w-[1400px] gap-14 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-12 lg:items-center lg:gap-10">
        {/* ── Text ───────────────────────────────────────────── */}
        <div className="lg:col-span-7">
          <FadeUp delay={0.2}>
            <p className="font-script text-4xl text-gold md:text-5xl">{wedding.hero.script}</p>
          </FadeUp>

          <Suspense fallback={null}>
            <GuestGreeting />
          </Suspense>

          <FadeUp delay={0.3}>
            <p className="label mt-6 text-ink/70">{wedding.hero.label}</p>
          </FadeUp>

          <h1 className="mt-8 font-display text-[clamp(3.75rem,17vw,9.5rem)] font-light uppercase leading-[0.9] tracking-[0.06em]">
            <span className="sr-only">
              {wedding.names.first} and {wedding.names.second}
            </span>
            <span aria-hidden>
              <MaskLine delay={0.1}>{wedding.names.first.toUpperCase()}</MaskLine>
              {/* The thread passes through the ampersand. */}
              <span className="flex items-baseline gap-[0.1em] pl-[6%] lg:pl-[10%]">
                <MaskLine thread="center" delay={0.25} className="px-[0.06em] py-[0.08em]">
                  <span className="text-[1.3em] font-light normal-case italic leading-[0.7] text-gold">&amp;</span>
                </MaskLine>
                <MaskLine delay={0.35}>{wedding.names.second.toUpperCase()}</MaskLine>
              </span>
            </span>
          </h1>

          <FadeUp delay={0.9}>
            <p className="mt-10 font-display text-2xl font-light md:text-3xl">{wedding.event.dateLine}</p>
            <span aria-hidden className="mt-6 block h-px w-24 bg-gold" />
            <p className="mt-6 max-w-md font-display text-lg italic leading-snug text-ink/80 md:text-xl">
              {wedding.hero.tagline}
            </p>
          </FadeUp>
        </div>

        {/* ── Arched portrait ────────────────────────────────── */}
        <FadeUp delay={0.5} className="lg:col-span-5 lg:mt-20">
          <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
            {/* Offset hairline arch behind the photo. */}
            <span
              aria-hidden
              className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-t-[999px] border border-gold"
            />
            <div
              ref={archRef}
              className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] bg-stone/20"
            >
              <m.div className="h-full w-full" style={{ y: reduce ? 0 : y, scale: 1.1 }}>
                <Image
                  src={img.src}
                  width={img.width}
                  height={img.height}
                  alt={img.alt}
                  priority
                  placeholder="blur"
                  blurDataURL={wedding.images.blur}
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 26rem, 90vw"
                  className="h-full w-full object-cover object-[50%_24%]"
                />
              </m.div>
            </div>
          </div>
        </FadeUp>
      </div>

      {/* ── Countdown + scroll cue ─────────────────────────── */}
      <FadeUp delay={1.1} className="mx-auto mt-20 max-w-[1400px]">
        <div className="border-y border-gold/60 py-8">
          <Countdown />
        </div>
        <div className="mt-12 flex flex-col items-center gap-3">
          <span className="label text-ink/70">{wedding.hero.scrollCue}</span>
          <span aria-hidden className="relative block h-12 w-px overflow-hidden bg-gold/30">
            <span className="scroll-cue absolute inset-0 bg-gold" />
          </span>
        </div>
      </FadeUp>
    </section>
  );
}
