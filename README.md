# Amal & Telma: "The Golden Thread"

Paperless wedding invitation. Next.js 15 (App Router) · TypeScript · Tailwind · Framer Motion · GSAP ScrollTrigger (thread only) · Lenis.

## File tree

```
app/
  layout.tsx            fonts (next/font), metadata, loader gate script, noscript fallbacks
  page.tsx              composes the sections, JSON-LD Event schema
  globals.css           paper grain, label style, reduced-motion overrides, cursor rules
  opengraph-image.tsx   dynamic OG card (next/og): names + date on darkened og-cover.jpg
  api/rsvp/route.ts     Zod-validated RSVP endpoint → adapter
assets/fonts/           Cormorant woff files, used only by the OG image (satori needs woff/ttf)
components/
  Loader · Monogram     signature intro: dot → drawn A&T + 00→100 → fill + date → curtains
  GoldenThread          scroll-drawn SVG thread (measures [data-thread] waypoints)
  ThreadKnot            the knot at the end, also the RSVP success mark
  Hero · Countdown · Specks
  CoupleCards · InvitationText · Gallery (GalleryStrip + DarkBand)
  CeremonyBlock · VenueBlock · BlessingsBlock · RsvpFlow · ShareButton (ShareSection)
  AudioToggle · CustomCursor · SmoothScroll · MotionProvider
  Button (magnetic) · Sprig · SectionHeading (+ Divider) · Reveal · ScrollReveal
config/wedding.ts       ALL copy, names, dates, venue, map link, palette, RSVP number, image metadata
lib/                    rsvp.ts (Zod + wa.me), rsvp-adapters.ts, ics.ts, pointer.ts, loaderState.ts, motion.ts
public/images/          the six images + og-cover.jpg  ← currently neutral PLACEHOLDERS
```

## Setup

```bash
npm ci
cp .env.example .env.local
npm run dev            # http://localhost:3000 (or the next available port; add ?guest=Priya)
npm run build && npm start
```

**Before launch**

1. Replace the placeholder files in `public/images/` with the real photos, same names and sizes
   (hero 1600×2133, couple 900×1125, story 1400×1867 / 1400×2489, og-cover 1200×630). Update the `alt` text in `config/wedding.ts`.
2. Confirm `rsvp.whatsappNumber` in `config/wedding.ts` (digits only, with country code) before sharing the invitation.
3. Optional: generate a tiny blur per photo and swap `images.blur` (one shared paper-tone blur is used now).
4. Optional audio: put an mp3 in `public/audio/` and set `audio.src`. The toggle stays hidden while `src` is empty.

## RSVP backend

The site always opens WhatsApp with the reply pre-written. If `rsvp.postToApi` is true it also POSTs to `/api/rsvp`, which validates with Zod
and stores via the adapter named in `RSVP_ADAPTER` (unset = nothing stored, WhatsApp only).

**Google Sheets** (`RSVP_ADAPTER=sheets`)
1. New Sheet → Extensions → Apps Script, paste:
   ```js
   function doPost(e) {
     const d = JSON.parse(e.postData.contents);
     SpreadsheetApp.getActiveSheet().appendRow([d.submittedAt, d.name, d.phone, d.attendance, d.message]);
     return ContentService.createTextOutput('ok');
   }
   ```
2. Deploy → New deployment → Web app → Execute as *me*, access *Anyone*. Copy the URL into `GOOGLE_SHEETS_WEBHOOK_URL`.

**Supabase** (`RSVP_ADAPTER=supabase`)
```sql
create table rsvps (
  id bigint generated always as identity primary key,
  name text not null, phone text not null,
  attendance text not null check (attendance in ('accept','decline')),
  message text not null default '', submitted_at timestamptz not null
);
alter table rsvps enable row level security;  -- no policies: only the service-role key can write
```
Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (server only).

**Another backend:** implement `RsvpAdapter` in `lib/rsvp-adapters.ts` and add it to `adapters`.

## Deploy to Vercel

1. Push the repo to GitHub → Vercel → *Add New Project* → import. Framework preset: Next.js (no settings needed).
2. Vercel supplies the production URL for metadata automatically. Set `NEXT_PUBLIC_SITE_URL` only when using a different canonical URL.
3. Deploy. Check the preview with WhatsApp's link debugger (send the link to yourself): the card comes from `app/opengraph-image.tsx`.
   WhatsApp can drop previews whose image is large. If yours is, export `og-cover.jpg` smaller or point `metadata.openGraph.images` at the static JPG.
4. Personal links: `https://your-domain.com/?guest=Priya%20Nair`.

## Customizing

**Thread path.** `GoldenThread.tsx` has no hand-drawn path. Any element with `data-thread="left|center|right"` is a waypoint
(centre of the element, or just outside its left/right edge). Waypoints are joined top-to-bottom with S-curves.
To re-route: move or add the attribute (see `CoupleCards`, `VenueBlock`…). To change feel: `GUTTER`, `EDGE`, `START_DRAWN`, the stroke width, and the
`scrub` value (higher = softer follow). The thread sits at `z-index: 1`, content at `2` (rule in `globals.css`), so it passes *behind* text and photos.
To make it pass over a block (like the dark band), mark that block `data-band`.

**Monogram.** `Monogram.tsx`: edit `MONOGRAM_PATH` (one continuous open path) and keep `VIEW_BOX` tight around it. Draw progress and the soft
"fill" (stroke swelling) are driven from `Loader.tsx`. Timings: `DRAW_SECONDS`, `DOT_SECONDS`, `HOLD_AFTER_FILL_MS`. The knot is `ThreadKnot.tsx` (a parametric trefoil).

**Palette.** `config/wedding.ts → colors`. Tailwind reads it, so `bg-paper`, `text-ink`, `border-gold`, `bg-forest` follow automatically.
Contrast: gold (≈2.8:1) and stone (≈3.2:1) are decoration or large type only; small text uses `ink` at 70–80% opacity (≥ 6:1).

**Fonts.** `app/layout.tsx` (`Cormorant_Garamond`, `Pinyon_Script`, `Jost` via next/font, exposed as `--font-display / --font-script / --font-label`).
Swap the import and keep the variable names. For the OG image, drop matching `.woff` files in `assets/fonts/` and update `opengraph-image.tsx`.

**Copy / reuse for another couple.** Everything lives in `config/wedding.ts`. The monogram letters and the ICS/JSON-LD dates
are the only other places to touch (`Monogram.tsx`, `app/page.tsx` JSON-LD start/end).

## Notes

- Loader plays on every page load. A timeout releases the page if hydration or animation stalls.
  With reduced motion: static monogram + fade, no Lenis, thread fully drawn, reveals disabled, no specks/cursor/magnetic. Touch devices use native scrolling.
- Specks are skipped on reduced motion, ≤4 CPU cores, ≤2 GB memory or Save-Data.
- Measured locally (production build, mobile preset): Lighthouse Performance 95, Accessibility 100, Best Practices 96, SEO 100; CLS 0; first-load JS 149 kB.
  Run it again on your deployed URL with real fonts and images.
