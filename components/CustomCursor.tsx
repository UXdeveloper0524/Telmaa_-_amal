"use client";

import { useEffect, useState } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";
import { useDesktopMotion } from "@/lib/pointer";

const INTERACTIVE = "a, button, input, textarea, label, [role='button'], [data-cursor]";

/** Desktop only: a small gold dot that opens into a ring over anything interactive. */
export function CustomCursor() {
  const enabled = useDesktopMotion();
  const [over, setOver] = useState(false);
  const x = useSpring(useMotionValue(-100), { stiffness: 700, damping: 45, mass: 0.3 });
  const y = useSpring(useMotionValue(-100), { stiffness: 700, damping: 45, mass: 0.3 });

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setOver(Boolean((e.target as Element | null)?.closest?.(INTERACTIVE)));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      root.classList.remove("has-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <m.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[120]" style={{ x, y }}>
      <span
        className={`absolute -left-[3px] -top-[3px] block h-1.5 w-1.5 rounded-full bg-gold transition-transform duration-300 ${over ? "scale-0" : "scale-100"}`}
      />
      <span
        className={`absolute -left-5 -top-5 block h-10 w-10 rounded-full border border-gold transition-transform duration-300 ${over ? "scale-100" : "scale-0"}`}
      />
    </m.div>
  );
}
