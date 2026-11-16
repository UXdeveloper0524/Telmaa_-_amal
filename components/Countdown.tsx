"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { wedding } from "@/config/wedding";
import { EXPO_OUT } from "@/lib/motion";

const TARGET = new Date(wedding.event.start).getTime();

function split(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return [
    Math.floor(total / 86400),
    Math.floor((total % 86400) / 3600),
    Math.floor((total % 3600) / 60),
    total % 60,
  ];
}

/** One number that rolls up out of a clipped box whenever its value changes. */
function Roll({ value }: { value: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="relative block h-[1.05em] min-w-[2ch] overflow-hidden text-center leading-[1.05]">
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={value}
          className="block"
          initial={{ y: reduce ? 0 : "100%", opacity: reduce ? 1 : 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduce ? 0 : "-100%", opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.5, ease: EXPO_OUT }}
        >
          {value}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

export function Countdown() {
  // null until mounted: server and first client render agree, no hydration mismatch.
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(TARGET - Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const values = split(remaining ?? 0);
  const [days, hours] = values;

  return (
    <div role="timer" className="mx-auto max-w-3xl">
      {/* Screen readers get one calm sentence instead of a ticking number. */}
      <p className="sr-only">
        {remaining === null ? "" : `${days} days and ${hours} hours until the ceremony.`}
      </p>
      <dl className="tabular grid grid-cols-4 divide-x divide-gold/40 text-center" aria-hidden>
        {wedding.hero.countdownLabels.map((labelText, i) => (
          <div key={labelText} className="flex flex-col px-2 md:px-6">
            <dt className="label order-2 mt-3 text-ink/70">{labelText}</dt>
            <dd className="order-1 font-display text-[clamp(2rem,9vw,4.25rem)] font-light">
              <Roll value={String(values[i]).padStart(2, "0")} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
