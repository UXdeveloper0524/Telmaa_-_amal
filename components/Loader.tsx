"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  m,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "framer-motion";
import { wedding } from "@/config/wedding";
import { CUBIC_IN_OUT, EXPO_IN_OUT, EXPO_OUT } from "@/lib/motion";
import { markLoaderDone } from "@/lib/loaderState";
import { Monogram } from "./Monogram";

/**
 * Intro loader (skippable, on every page load).
 * dot → monogram draws + counter 00→100 (one shared motion value) → soft fill + date →
 * curtains part. Only transform/opacity animate.
 */
type Phase = "draw" | "fill" | "exit" | "gone";

const DRAW_SECONDS = 2.1;
const DOT_SECONDS = 0.45;
const HOLD_AFTER_FILL_MS = 1000;

export function Loader() {
  const reduce = useReducedMotion();
  const [touch, setTouch] = useState(false);
  const [phase, setPhase] = useState<Phase>("draw");
  const progress = useMotionValue(0);
  const fill = useMotionValue(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const controls = useRef<AnimationPlaybackControls | null>(null);

  // Counter text is written straight to the DOM: no re-render per frame.
  useMotionValueEvent(progress, "change", (v) => {
    if (counterRef.current) {
      counterRef.current.textContent = String(Math.round(v * 100)).padStart(2, "0");
    }
  });

  const finish = useCallback(() => {
    if (document.documentElement.dataset.loader !== "fallback") markLoaderDone();
    setPhase("gone");
  }, []);

  const exit = useCallback(() => {
    controls.current?.stop();
    setPhase((current) => (current === "gone" ? current : "exit"));
  }, []);

  useEffect(() => {
    if (document.documentElement.dataset.loader !== "pending") {
      setPhase("gone");
      return;
    }

    const timers: number[] = [];
    let cancelled = false;
    const touchDevice = window.matchMedia("(pointer: coarse)").matches;
    setTouch(touchDevice);
    const onFallback = () => {
      if (document.documentElement.dataset.loader === "fallback") {
        controls.current?.stop();
        setPhase("gone");
      }
    };
    window.addEventListener("loader:change", onFallback);
    // Safari can suspend animation frames in low power mode or a background tab.
    timers.push(window.setTimeout(exit, 6200));
    timers.push(window.setTimeout(finish, 7500));
    const cleanup = () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      window.removeEventListener("loader:change", onFallback);
      controls.current?.stop();
    };

    // Reduced motion: static monogram, simple fade in/out.
    if (reduce) {
      progress.set(1);
      fill.set(1);
      setPhase("fill");
      timers.push(window.setTimeout(exit, 600));
      return cleanup;
    }

    // Wait for fonts (max 1.5s) so the counter never renders unstyled.
    const fontsReady = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((resolve) => window.setTimeout(resolve, 1500)),
    ]);

    const start = () => {
      if (cancelled) return;
      try {
        controls.current = animate(progress, 1, {
          duration: touchDevice ? 1.4 : DRAW_SECONDS,
          delay: touchDevice ? 0.3 : DOT_SECONDS,
          ease: CUBIC_IN_OUT,
          onComplete: () => {
            setPhase("fill");
            animate(fill, 1, { duration: touchDevice ? 0.55 : 0.8, ease: EXPO_OUT });
            timers.push(window.setTimeout(exit, touchDevice ? 650 : HOLD_AFTER_FILL_MS));
          },
        });
      } catch {
        exit();
      }
    };
    fontsReady.then(start, start);

    return cleanup;
  }, [reduce, progress, fill, exit, finish]);

  if (phase === "gone") return null;

  const exiting = phase === "exit";
  const showDate = phase === "fill" || exiting;
  const dateChars = Array.from(wedding.event.dateCompact);

  return (
    <div
      className="loader-root fixed inset-0 z-[100] text-paper"
      role="status"
      aria-live="polite"
      aria-label={wedding.loader.label}
    >
      {/* Two curtain halves: translateX only. The seam is invisible (same colour). */}
      <m.div
        className="absolute inset-y-0 left-0 w-1/2 bg-forest will-change-transform"
        initial={false}
        animate={{ x: exiting ? "-100%" : "0%" }}
        transition={{ duration: reduce ? 0.4 : touch ? 0.75 : 1.1, ease: EXPO_IN_OUT }}
        onAnimationComplete={() => exiting && finish()}
      />
      <m.div
        className="absolute inset-y-0 right-0 w-1/2 bg-forest will-change-transform"
        initial={false}
        animate={{ x: exiting ? "100%" : "0%" }}
        transition={{ duration: reduce ? 0.4 : touch ? 0.75 : 1.1, ease: EXPO_IN_OUT }}
      />

      {/* Centre stage: fades quickly as the curtains begin to part. */}
      <m.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        initial={{ opacity: reduce ? 0 : 1 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: exiting ? 0.35 : 0.8 }}
      >
        <div className="relative w-[min(72vw,22rem)]">
          <Monogram progress={progress} fill={fill} className="block h-auto w-full" />
          {/* The tiny gold dot that precedes the line. */}
          <m.span
            aria-hidden
            className="absolute left-1/2 top-1/2 block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 1, 1], opacity: [1, 1, 0] }}
            transition={{ duration: DOT_SECONDS + 0.35, times: [0, 0.5, 1], ease: EXPO_OUT }}
          />
        </div>

        {/* Fixed-height stage so counter → date causes zero layout shift. */}
        <div className="relative mt-10 h-20 w-full max-w-xs text-center" aria-hidden>
          <m.div
            className="absolute inset-0 flex flex-col items-center gap-3"
            animate={{ opacity: showDate ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="tabular font-display text-4xl font-light italic leading-none">
              <span ref={counterRef}>00</span>
            </span>
            <span className="label text-paper/70">{wedding.loader.label}</span>
          </m.div>

          <div className="absolute inset-0 flex items-start justify-center">
            <span className="tabular font-display text-3xl font-light tracking-[0.18em] text-gold">
              {dateChars.map((char, i) => (
                <span key={i} className="inline-block overflow-hidden align-top">
                  <m.span
                    className="inline-block"
                    initial={{ y: "110%" }}
                    animate={{ y: showDate ? "0%" : "110%" }}
                    transition={{ duration: 0.7, delay: showDate ? i * 0.04 : 0, ease: EXPO_OUT }}
                  >
                    {char === " " ? " " : char}
                  </m.span>
                </span>
              ))}
            </span>
          </div>
        </div>
      </m.div>

      {!exiting && (
        <button
          type="button"
          onClick={exit}
          className="label absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 text-paper/70 underline decoration-gold underline-offset-8 transition-colors hover:text-paper focus-visible:outline-paper"
        >
          {wedding.loader.skip}
        </button>
      )}
    </div>
  );
}
