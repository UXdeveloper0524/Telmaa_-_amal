"use client";

import { m, useReducedMotion } from "framer-motion";
import { CUBIC_IN_OUT } from "@/lib/motion";

/**
 * Where the thread ends: a trefoil knot (two families, tied together).
 * The invisible 1px div is the thread's final waypoint: the scroll-drawn thread
 * arrives here, then the knot draws itself as it enters the viewport.
 * Also reused as the RSVP success mark (pass `replayKey` to redraw).
 */
const KNOT_PATH = (() => {
  // Trefoil: x = sin t + 2 sin 2t, y = cos t − 2 cos 2t, centred in a 120 × 120 box.
  const scale = 15;
  const steps = 180;
  const parts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x = 60 + (Math.sin(t) + 2 * Math.sin(2 * t)) * scale;
    const y = 60 + (Math.cos(t) - 2 * Math.cos(2 * t) + 0.47) * scale;
    parts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return parts.join(" ");
})();

export function ThreadKnot({
  className,
  replayKey,
  waypoint = true,
}: {
  className?: string;
  replayKey?: string | number;
  /** false when used outside the page's scroll thread (e.g. the RSVP success mark). */
  waypoint?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <div className={className}>
      <div data-thread={waypoint ? "center" : undefined} aria-hidden className="mx-auto h-px w-px" />
      <svg viewBox="0 0 120 120" className="mx-auto block h-28 w-28" fill="none" aria-hidden>
        {/* Short tail connecting the thread to the top of the knot. */}
        <path d="M60 0 V22" stroke="var(--gold)" strokeWidth={1} strokeLinecap="round" />
        <m.path
          key={replayKey}
          d={KNOT_PATH}
          stroke="var(--gold)"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 2.2, ease: CUBIC_IN_OUT }}
        />
      </svg>
    </div>
  );
}
