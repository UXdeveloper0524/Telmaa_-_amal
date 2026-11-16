import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { wedding } from "@/config/wedding";
import { MotionProvider } from "@/components/MotionProvider";

// next/font self-hosts and preloads these. "block" on the display face means the
// loader's serif counter never flashes in a fallback font.
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "block",
});
const script = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});
const label = Jost({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-label",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: wedding.seo.title,
  description: wedding.seo.description,
  applicationName: `${wedding.names.first} & ${wedding.names.second}`,
  alternates: { canonical: "/" },
  // The Open Graph image comes from app/opengraph-image.tsx (file convention).
  openGraph: {
    title: wedding.seo.title,
    description: wedding.seo.description,
    url: "/",
    siteName: `${wedding.names.first} & ${wedding.names.second}`,
    locale: "en_IN",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: wedding.seo.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: wedding.seo.title,
    description: wedding.seo.description,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: wedding.colors.paper,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Start the intro on every load; release the page even if hydration or animation stalls. */
const loaderGate = `document.documentElement.dataset.loader="pending";setTimeout(function(){if(document.documentElement.dataset.loader==="pending"){document.documentElement.dataset.loader="fallback";window.dispatchEvent(new Event("loader:change"))}},8000)`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${script.variable} ${label.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: loaderGate }} />
        {/* Without JS the loader and masked reveals would hide the page: switch them off. */}
        <noscript>
          <style>{`html{overflow:auto!important}.loader-root{display:none!important}.mask-inner{transform:none!important}.fade-up{opacity:1!important;transform:none!important}.clip-in{clip-path:none!important}.sprig path{stroke-dasharray:none!important}`}</style>
        </noscript>
      </head>
      <body className="bg-paper text-ink antialiased">
        <a
          href="#main"
          className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:bg-paper focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
