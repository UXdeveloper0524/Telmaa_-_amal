import type { Config } from "tailwindcss";
// Relative import on purpose: the Tailwind config is not processed by the "@/" alias.
import { wedding } from "./config/wedding";

// The palette lives in config/wedding.ts so the whole site is re-skinned from one file.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ...wedding.colors },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        script: ["var(--font-script)", "cursive"],
        label: ["var(--font-label)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
