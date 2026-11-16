"use client";

import { useSyncExternalStore } from "react";

const EVENT = "loader:change";

/** The inline script in layout.tsx starts the loader before first paint. */
const read = () => ["done", "fallback"].includes(document.documentElement.dataset.loader ?? "");

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

/** True once the intro loader has finished or the safety fallback has released the page. */
export function useLoaderDone(): boolean {
  return useSyncExternalStore(subscribe, read, () => false);
}

/** Called after the curtains part: unlocks scroll and starts the hero reveal. */
export function markLoaderDone() {
  document.documentElement.dataset.loader = "done";
  window.dispatchEvent(new Event(EVENT));
}
