"use client";

import { useEffect, useState } from "react";

/** Deterministic pseudo-random in [0,1): keeps server and client markup identical. */
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 97.13 + salt * 31.7) * 10000;
  return x - Math.floor(x);
};

const SPECKS = Array.from({ length: 16 }, (_, i) => ({
  left: `${(rand(i, 1) * 100).toFixed(1)}%`,
  top: `${(rand(i, 2) * 100).toFixed(1)}%`,
  size: Math.round((2 + rand(i, 3) * 3) * 10) / 10,
  delay: `${(-rand(i, 4) * 14).toFixed(1)}s`,
  duration: `${(14 + rand(i, 5) * 12).toFixed(1)}s`,
}));

type NetworkNavigator = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

/** Floating gold specks. Skipped on reduced motion and on low-power / data-saver devices. */
export function Specks() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const nav = navigator as NetworkNavigator;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower =
      (nav.hardwareConcurrency ?? 8) <= 4 ||
      (nav.deviceMemory ?? 8) <= 2 ||
      nav.connection?.saveData === true;
    setEnabled(!reduced && !lowPower);
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {SPECKS.map((s, i) => (
        <span
          key={i}
          className="speck"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  );
}
