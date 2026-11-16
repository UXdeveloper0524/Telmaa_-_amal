"use client";

import { useEffect, useRef, useState } from "react";
import { wedding } from "@/config/wedding";

/**
 * Optional ambient audio. Off by default, never autoplays: the file is not even requested
 * until the guest taps the toggle. Renders nothing unless config.audio.src is set.
 */
export function AudioToggle() {
  const { src, on: labelOn, off: labelOff } = wedding.audio;
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => audio.current?.pause(), []);

  if (!src) return null;

  const toggle = async () => {
    if (!audio.current) {
      audio.current = new Audio(src);
      audio.current.loop = true;
      audio.current.volume = 0.4;
    }
    if (playing) {
      audio.current.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false); // blocked or failed to load: stay muted
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? labelOn : labelOff}
      className="fixed bottom-4 right-4 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-gold bg-paper"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="var(--ink)" strokeWidth={1.2} strokeLinecap="round">
        <path d="M6 10v4M10 7v10M14 9v6M18 11v2" />
        {!playing && <path d="M4 20 20 4" stroke="var(--gold)" />}
      </svg>
    </button>
  );
}
