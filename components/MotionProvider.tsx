"use client";

import { LazyMotion, domAnimation } from "framer-motion";

/** Loads Framer Motion's lean feature set once; components use `m.*` instead of `motion.*`. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
