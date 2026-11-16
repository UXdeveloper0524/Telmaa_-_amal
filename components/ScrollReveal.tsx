"use client";

import { m, useReducedMotion } from "framer-motion";
import { EXPO_OUT } from "@/lib/motion";

const VIEW = { once: true, margin: "0px 0px -12% 0px" } as const;

/** Masked slide-up when scrolled into view: one line rises from behind an overflow-hidden box. */
export function ScrollLine({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  // The wrapper (never moved, never clipped) is what IntersectionObserver watches; the inner line
  // follows via variants. Observing the translated line itself would never fire: it starts fully
  // hidden by the wrapper's overflow.
  return (
    // Padding/negative margin keeps descenders from being clipped without changing layout.
    <m.span
      className={`block overflow-hidden pb-[0.14em] -mb-[0.14em] ${className}`}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={VIEW}
    >
      <m.span
        className="mask-inner block"
        variants={{
          hidden: { y: "110%" },
          show: { y: "0%", transition: { duration: 1, delay, ease: EXPO_OUT } },
        }}
      >
        {children}
      </m.span>
    </m.span>
  );
}

/** Section transition: content is uncovered with a clip-path wipe (top → bottom), not a plain fade. */
export function ClipIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={`clip-in ${className}`}
      initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={VIEW}
      transition={{ duration: 1.3, delay, ease: EXPO_OUT }}
    >
      {children}
    </m.div>
  );
}
