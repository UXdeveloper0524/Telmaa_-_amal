/**
 * Single source of truth for the invitation.
 * Edit this file to reuse the site for another wedding: copy, names, dates,
 * venue, map link, palette, image alt text and the RSVP WhatsApp number.
 *
 * Keep this file free of imports so tailwind.config.ts can read it.
 */
export const wedding = {
  // ── Palette (strict) ────────────────────────────────────────────────
  colors: {
    paper: "#F7F3EC", // ivory background
    ink: "#1C1B18", // body text
    gold: "#B08D57", // thread, hairlines, large accents only
    stone: "#8C877D", // decorative / large secondary text only
    forest: "#1F2A24", // loader + one dark band
  },

  // ── Names & dates ───────────────────────────────────────────────────
  names: { first: "Amal", second: "Telma", short: "AMAL & TELMA" },
  event: {
    start: "2027-01-15T12:11:00+05:30",
    end: "2027-01-15T12:57:00+05:30",
    timeZone: "Asia/Kolkata",
    dateLine: "Friday · 15 January 2027",
    dateLong: "Friday, 15th January 2027",
    dateCompact: "15 · 01 · 2027", // loader + footer
    muhurtham: "Muhurtham: 12:11 PM – 12:57 PM",
  },

  // ── SEO / sharing ───────────────────────────────────────────────────
  seo: {
    title: "Join Amal & Telma | 15 January 2027",
    description:
      "With the blessings of our families, Amal and Telma invite you to celebrate their wedding on Friday, 15 January 2027 at Sobha Auditorium, Thiruvankulam.",
  },

  // ── Loader ──────────────────────────────────────────────────────────
  loader: {
    label: "Preparing your invitation",
    skip: "Skip",
  },

  // ── Hero ────────────────────────────────────────────────────────────
  hero: {
    script: "You are invited",
    guestPrefix: "Dear",
    label: "With the blessings of our families",
    tagline: "A celebration of love, togetherness & new beginnings",
    scrollCue: "Scroll",
    countdownLabels: ["Days", "Hours", "Minutes", "Seconds"],
  },

  // ── 01 The couple ───────────────────────────────────────────────────
  couple: {
    number: "01",
    label: "The couple",
    heading: "Together",
    amal: {
      name: "Amal",
      line: "Son of Late Mr. Purushothaman & Mrs. Sindhu Kanghat",
    },
    telma: {
      name: "Telma",
      line: "Daughter of Mr. P. C. Joseph & Mrs. Lizy Joseph, Pakkathukunnel House",
    },
  },

  // ── 02 Invitation ───────────────────────────────────────────────────
  invitation: {
    number: "02",
    label: "A joyful beginning",
    heading: "Wedding Invitation",
    intro:
      "With the love, blessings and good wishes of our families, we cordially invite you to celebrate the joyous occasion of the wedding of",
    groom: {
      name: "AMAL",
      sonOf: "Son of",
      parents: "Late Mr. Purushothaman & Mrs. Sindhu Kanghat",
      siblings: "Beloved brother of Amrutha, brother-in-law of Joseph and uncle of Daivik.",
    },
    bride: {
      name: "TELMA",
      daughterOf: "Daughter of",
      parents: "Mr. P. C. Joseph & Mrs. Lizy Joseph",
      house: "Pakkathukunnel House",
      siblings: "Beloved sister of Teena and Tinu.",
    },
    outro:
      "As Amal and Telma come together to begin a beautiful journey of love, companionship and togetherness, we would be delighted to have you join us and share in the happiness of this special occasion.",
  },

  // ── 03 The day ──────────────────────────────────────────────────────
  ceremony: {
    number: "03",
    label: "The day",
    heading: "Wedding Ceremony",
    button: "Add to Calendar",
  },

  // ── 04 Venue ────────────────────────────────────────────────────────
  venue: {
    number: "04",
    label: "Join us",
    heading: "Venue",
    name: "Sobha Auditorium",
    locality: "Thiruvankulam, Ernakulam",
    region: "Kerala – 682305, India",
    button: "Get Directions",
    mapUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Sobha+Auditorium+Thiruvankulam+Ernakulam+Kerala+682305",
  },

  // ── 05 Family & blessings ───────────────────────────────────────────
  blessings: {
    number: "05",
    label: "With love",
    heading: "Family & Blessings",
    body: "Your presence and good wishes will make this celebration even more memorable as two families come together for this special occasion.",
    regards: "With warm regards,",
    families: ["Mrs. Sindhu Kanghat & Family", "Mr. P. C. Joseph, Mrs. Lizy Joseph & Family"],
  },

  // ── 06 RSVP ─────────────────────────────────────────────────────────
  rsvp: {
    number: "06",
    label: "We hope to see you",
    heading: "RSVP",
    sub: "Kindly confirm your attendance",
    /** Family WhatsApp number, digits only with country code. REPLACE BEFORE LAUNCH. */
    whatsappNumber: "916238262977",
    submit: "Share Reply",
    /** One question per screen. `kind` drives the input type in RsvpFlow. */
    questions: {
      name: { prompt: "Your name", placeholder: "Full name", required: true },
      phone: { prompt: "Mobile number", placeholder: "+91 98765 43210", hint: "With country code", required: true },
      attendance: {
        prompt: "Will you join us?",
        accept: "Joyfully Accept",
        decline: "Regretfully Decline",
        required: true,
      },
      message: { prompt: "A message for us", placeholder: "Optional", hint: "Optional", required: false },
    },
    next: "Continue",
    back: "Back",
    thanks: { accept: "We can't wait to celebrate with you.", decline: "You will be missed. Thank you for letting us know." },
    /** Set false to skip the POST to /api/rsvp and only open WhatsApp. */
    postToApi: true,
  },

  // ── Share ───────────────────────────────────────────────────────────
  share: {
    label: "Pass it along",
    heading: "Share",
    button: "Share on WhatsApp",
    /** Text sent with the link when a guest shares the invitation. */
    message: "You are invited to the wedding of Amal & Telma, Friday 15 January 2027.",
    footer: "Amal & Telma · 15 · 01 · 2027",
  },

  // ── Ambient audio (optional) ────────────────────────────────────────
  audio: {
    /** Put an mp3 in /public/audio and set e.g. "/audio/ambient.mp3". Empty string hides the toggle. */
    src: "",
    on: "Mute ambient music",
    off: "Play ambient music",
  },

  // ── Images (files live in /public/images) ───────────────────────────
  images: {
    hero: {
      src: "/images/hero-couple.webp",
      width: 1600,
      height: 2133,
      alt: "Amal and Telma together on the temple steps",
    },
    amal: { src: "/images/couple-amal.webp", width: 900, height: 1125, alt: "Portrait of Amal" },
    telma: { src: "/images/couple-telma.webp", width: 900, height: 1125, alt: "Portrait of Telma" },
    story1: {
      src: "/images/story-01.webp",
      width: 1400,
      height: 1867,
      alt: "Amal and Telma sharing a quiet moment",
    },
    story2: {
      src: "/images/story-02.webp",
      width: 1400,
      height: 1867,
      alt: "Amal and Telma laughing together outdoors",
    },
    story3: {
      src: "/images/story-03.webp",
      width: 1400,
      height: 2489,
      alt: "Amal and Telma walking side by side at dusk",
    },
    /** Neutral 1×1 paper-tone placeholder used as blurDataURL until per-image blurs are generated. */
    blur: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNkOWQyYzQiLz48L3N2Zz4=",
  },
} as const;

export type Wedding = typeof wedding;
