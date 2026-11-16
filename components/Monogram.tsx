"use client";

import { m, useTransform, type MotionValue } from "framer-motion";

/**
 * A&T monogram, drawn as ONE continuous stroke:
 * right foot of A → apex → left foot → up to the crossbar → across it → the crossbar swells into
 * the ampersand loop → sweeps up into the T's bar → along the bar → down the stem.
 * (Two short segments are retraced; on a hairline they are invisible.)
 *
 * To restyle, edit MONOGRAM_PATH and keep VIEW_BOX tight around it. Both are plain SVG.
 */
const MONOGRAM_PATH =
  "M118 150 L78 20 L38 150 L51 108 L108 108 C148 108 168 128 158 144 C148 158 124 152 134 130 C146 106 172 80 172 40 C172 29 166 24 156 24 L256 24 L206 24 L206 150";
const VIEW_BOX = "25 7 244 164";

type Props = {
  /** 0 → 1: how much of the stroke is drawn. */
  progress: MotionValue<number>;
  /** 0 → 1: the "soft fill": the hairline swells to a fuller stroke. */
  fill: MotionValue<number>;
  className?: string;
};

export function Monogram({ progress, fill, className }: Props) {
  const width = useTransform(fill, [0, 1], [1.1, 2.4]);

  return (
    <svg viewBox={VIEW_BOX} className={className} fill="none" role="img" aria-label="A and T monogram">
      <m.path
        d={MONOGRAM_PATH}
        stroke="var(--gold)"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: progress, strokeWidth: width }}
      />
    </svg>
  );
}
