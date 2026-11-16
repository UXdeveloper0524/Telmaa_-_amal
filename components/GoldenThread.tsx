"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * The golden thread: one hairline SVG path that is drawn down the page as the guest scrolls.
 *
 * HOW THE PATH IS BUILT
 * Any element inside <main> that carries `data-thread="left|center|right"` becomes a waypoint.
 *   center → the thread passes through the element's centre
 *   left   → it passes just outside the element's left edge
 *   right  → it passes just outside the element's right edge
 * Waypoints are joined with S-curves (vertical tangents), so the thread meanders around content.
 * It is re-measured whenever the layout changes. Keep waypoint elements un-transformed
 * (put the attribute on a wrapper, not on something that slides in).
 *
 * HOW IT DRAWS
 * The path is normalised to length 1 (pathLength) and GSAP ScrollTrigger scrubs
 * stroke-dashoffset from START_DRAWN → 0 across the whole page scroll.
 */
type ScrollTriggerApi = typeof import("gsap/ScrollTrigger").ScrollTrigger;

const GUTTER = 20; // px between content edge and a left/right waypoint
const EDGE = 14; // keep the thread inside the viewport
const START_DRAWN = 0.04; // portion visible before any scrolling

type Point = { x: number; y: number };
type Layout = { d: string; width: number; height: number };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Joins points with vertical-tangent cubic curves. */
function toPath(points: Point[]): string {
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const midY = ((a.y + b.y) / 2).toFixed(1);
    d += ` C ${a.x.toFixed(1)} ${midY}, ${b.x.toFixed(1)} ${midY}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }
  return d;
}

function measure(root: HTMLElement): Layout | null {
  const box = root.getBoundingClientRect();
  const points = Array.from(root.querySelectorAll<HTMLElement>("[data-thread]"))
    .map((el) => {
      const r = el.getBoundingClientRect();
      const side = el.dataset.thread;
      const raw =
        side === "left"
          ? r.left - box.left - GUTTER
          : side === "right"
            ? r.right - box.left + GUTTER
            : r.left - box.left + r.width / 2;
      return { x: clamp(raw, EDGE, box.width - EDGE), y: r.top - box.top + r.height / 2 };
    })
    .sort((a, b) => a.y - b.y);

  if (points.length === 0) return null;
  // The thread enters from the very top of the page, straight above the first waypoint.
  return {
    d: toPath([{ x: points[0].x, y: 0 }, ...points]),
    width: box.width,
    height: box.height,
  };
}

export function GoldenThread() {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);

  // 1. Measure waypoints now and whenever the page layout changes.
  useEffect(() => {
    const root = svgRef.current?.parentElement;
    if (!root) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = measure(root);
        if (next) setLayout(next);
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    document.fonts.ready.then(update);
    window.addEventListener("load", update);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("load", update);
    };
  }, []);

  // 2. Scroll-link the stroke once the path exists. Reduced motion: thread stays fully drawn.
  //    GSAP is loaded on demand so it never competes with first paint.
  const trigger = useRef<ScrollTriggerApi | null>(null);
  const ready = layout !== null;
  useEffect(() => {
    const path = pathRef.current;
    const root = svgRef.current?.parentElement;
    if (!ready || !path || !root || reduce) return;

    let cancelled = false;
    let revert = () => {};
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      trigger.current = ScrollTrigger;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          path,
          { strokeDashoffset: 1 - START_DRAWN },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.6 },
          },
        );
      });
      revert = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      revert();
    };
  }, [ready, reduce]);

  // Waypoints moved (resize, fonts, images): let ScrollTrigger recalculate its range.
  useEffect(() => {
    if (layout) trigger.current?.refresh();
  }, [layout]);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      focusable="false"
      className="pointer-events-none absolute left-0 top-0 z-[1]"
      width={layout?.width ?? 0}
      height={layout?.height ?? 0}
      viewBox={`0 0 ${layout?.width ?? 0} ${layout?.height ?? 0}`}
      fill="none"
    >
      {layout && (
        <path
          ref={pathRef}
          d={layout.d}
          stroke="var(--gold)"
          strokeWidth={1}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={reduce ? 0 : 1 - START_DRAWN}
        />
      )}
    </svg>
  );
}
