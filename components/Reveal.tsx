"use client";

import { m, useReducedMotion } from "framer-motion";
import { useLoaderDone } from "@/lib/loaderState";
import { EXPO_OUT } from "@/lib/motion";

type MaskLineProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Marks this line as a golden-thread waypoint. The wrapper never moves, so measuring is stable. */
  thread?: "left" | "center" | "right";
};

/** Masked slide-up: the text rises from behind an overflow-hidden line. Starts when the loader ends. */
export function MaskLine({ children, delay = 0, className = "", thread }: MaskLineProps) {
  const reduce = useReducedMotion();
  const loaderDone = useLoaderDone();
  const shown = loaderDone || reduce;

  return (
    <span className={`block overflow-hidden ${className}`} data-thread={thread}>
      <m.span
        className="mask-inner block"
        initial={{ y: "110%" }}
        animate={{ y: shown ? "0%" : "110%" }}
        transition={{ duration: reduce ? 0 : 1.1, delay, ease: EXPO_OUT }}
      >
        {children}
      </m.span>
    </span>
  );
}

/** Small rise-and-fade for supporting copy in the hero. */
export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const loaderDone = useLoaderDone();
  const shown = loaderDone || reduce;

  return (
    <m.div
      className={`fade-up ${className}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 14 }}
      transition={{ duration: reduce ? 0 : 0.9, delay, ease: EXPO_OUT }}
    >
      {children}
    </m.div>
  );
}
