"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type Lenis from "lenis";
import { useLoaderDone } from "@/lib/loaderState";
import { useDesktopMotion } from "@/lib/pointer";

/**
 * Lenis smooth scroll, driven by GSAP's ticker so the thread scrub stays in sync.
 * Loaded on demand (after first paint), off entirely for prefers-reduced-motion,
 * and held still until the loader has finished.
 * Touch devices use native scrolling so Safari's dynamic browser chrome cannot fight the ticker.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();
  const desktop = useDesktopMotion();
  const loaderDone = useLoaderDone();
  const lenisRef = useRef<Lenis | null>(null);
  const doneRef = useRef(loaderDone);
  doneRef.current = loaderDone;

  useEffect(() => {
    if (reduce || !desktop) return;
    let cancelled = false;
    let teardown = () => {};

    Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: LenisCtor }, { gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new LenisCtor({ lerp: 0.1 });
        lenisRef.current = lenis;
        if (!doneRef.current) lenis.stop();
        lenis.on("scroll", ScrollTrigger.update);

        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        teardown = () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
          lenisRef.current = null;
        };
      },
    ).catch(() => {
      // Native scrolling remains usable if an optional motion chunk cannot load.
    });

    return () => {
      cancelled = true;
      teardown();
    };
  }, [reduce, desktop]);

  useEffect(() => {
    if (loaderDone) lenisRef.current?.start();
    else lenisRef.current?.stop();
  }, [loaderDone, reduce, desktop]);

  return null;
}
