"use client";

import { useRef } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";
import { useDesktopMotion } from "@/lib/pointer";

/** Pulls its child a few pixels toward the pointer. Desktop only; inert on touch / reduced motion. */
function Magnetic({ children }: { children: React.ReactNode }) {
  const enabled = useDesktopMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    x.set((e.clientX - (box.left + box.width / 2)) * 0.18);
    y.set((e.clientY - (box.top + box.height / 2)) * 0.18);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.span
      ref={ref}
      className="inline-block"
      style={enabled ? { x, y } : undefined}
      onPointerMove={enabled ? onMove : undefined}
      onPointerLeave={enabled ? reset : undefined}
    >
      {children}
    </m.span>
  );
}

type Props = {
  children: React.ReactNode;
  /** With href → renders a link (opens in a new tab when external). Without → a button. */
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

const STYLE =
  "label inline-flex items-center gap-3 border border-gold bg-paper px-8 py-4 text-ink transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-paper disabled:opacity-50";

export function Button({ children, href, onClick, type = "button", disabled }: Props) {
  return (
    <Magnetic>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={STYLE}>
          {children}
        </a>
      ) : (
        <button type={type} onClick={onClick} disabled={disabled} className={STYLE}>
          {children}
        </button>
      )}
    </Magnetic>
  );
}
