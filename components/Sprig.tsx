"use client";

import { m } from "framer-motion";

/**
 * Fine line-art jasmine sprig: a stem, four leaves and one five-petal flower, all strokes.
 * Each stroke draws itself once when the sprig scrolls into view (CSS neutralises this for reduced motion).
 */
const LEAVES = [
  "M40 150 C22 148 12 134 10 120 C28 122 38 134 40 150",
  "M40 124 C58 122 68 108 70 94 C52 96 42 108 40 124",
  "M40 98 C24 96 16 84 14 72 C30 74 38 84 40 98",
  "M40 72 C54 70 62 60 64 48 C50 50 42 60 40 72",
];

const draw = {
  hidden: { pathLength: 0 },
  show: { pathLength: 1, transition: { duration: 1.6, ease: [0.65, 0, 0.35, 1] as const } },
};

export function Sprig({ className = "" }: { className?: string }) {
  return (
    <m.svg
      aria-hidden
      focusable="false"
      viewBox="0 0 80 200"
      fill="none"
      stroke="var(--gold)"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`sprig ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: 0.18 }}
    >
      <m.path d="M40 198 C38 150 44 100 40 40" variants={draw} />
      {LEAVES.map((d) => (
        <m.path key={d} d={d} variants={draw} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <m.path
          key={i}
          d="M40 28 C34 18 36 8 40 2 C44 8 46 18 40 28"
          transform={`rotate(${i * 72} 40 28)`}
          variants={draw}
        />
      ))}
    </m.svg>
  );
}
