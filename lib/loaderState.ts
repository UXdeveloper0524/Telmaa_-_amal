"use client";

import { useSyncExternalStore } from "react";
import { wedding } from "@/config/wedding";

const EVENT = "loader:change";

/** The inline script in layout.tsx sets html[data-loader] to "pending" or "done" before first paint. */
const read = () => document.documentElement.dataset.loader === "done";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

/** True once the intro loader has finished (or was skipped / already seen this session). */
export function useLoaderDone(): boolean {
  return useSyncExternalStore(subscribe, read, () => false);
}

/** Called when the curtains start to part: unlocks scroll and lets the hero reveal begin. */
export function markLoaderDone() {
  document.documentElement.dataset.loader = "done";
  try {
    sessionStorage.setItem(wedding.loader.sessionKey, "1");
  } catch {
    /* storage unavailable (private mode): the loader simply replays next visit */
  }
  window.dispatchEvent(new Event(EVENT));
}
