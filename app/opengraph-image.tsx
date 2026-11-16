import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { wedding } from "@/config/wedding";

/**
 * Dynamic Open Graph card (1200×630): names + date over a darkened og-cover.jpg.
 * Rendered once at build time. The JPG in /public/images stays as the static fallback.
 */
export const alt = wedding.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [cover, light, lightItalic] = await Promise.all([
    readFile(path.join(process.cwd(), "public/images/og-cover.jpg")),
    readFile(path.join(process.cwd(), "assets/fonts/cormorant-300.woff")),
    readFile(path.join(process.cwd(), "assets/fonts/cormorant-300-italic.woff")),
  ]);
  const { forest, gold, paper } = wedding.colors;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: forest }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/jpeg;base64,${cover.toString("base64")}`}
          width={1200}
          height={630}
          alt=""
          style={{ position: "absolute", inset: 0, objectFit: "cover" }}
        />
        {/* Flat forest wash so the type always reads. */}
        <div style={{ position: "absolute", inset: 0, background: forest, opacity: 0.72 }} />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            color: paper,
            fontFamily: "Cormorant",
          }}
        >
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, textTransform: "uppercase", color: gold }}>
            With the blessings of our families
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 28, fontSize: 150, letterSpacing: 14 }}>
            AMAL
            <span style={{ margin: "0 36px", fontStyle: "italic", color: gold, fontSize: 170 }}>&amp;</span>
            TELMA
          </div>
          <div style={{ display: "flex", width: 120, height: 1, background: gold, marginTop: 30 }} />
          <div style={{ display: "flex", marginTop: 30, fontSize: 40, letterSpacing: 6 }}>{wedding.event.dateCompact}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: light, weight: 300, style: "normal" },
        { name: "Cormorant", data: lightItalic, weight: 300, style: "italic" },
      ],
    },
  );
}
