import { ScrollLine } from "./ScrollReveal";

/** Numbered label ("03 — The day") above a large display heading. */
export function SectionHeading({
  id,
  number,
  label,
  heading,
  align = "left",
  sub,
}: {
  id: string;
  number?: string;
  label: string;
  heading: string;
  align?: "left" | "center";
  sub?: string;
}) {
  return (
    <header className={align === "center" ? "text-center" : ""}>
      <p className="label text-ink/70">
        {number && (
          <>
            <span className="tabular">{number}</span> <span aria-hidden>—</span>{" "}
          </>
        )}
        {label}
      </p>
      <h2 id={id} className="mt-5 font-display text-[clamp(3rem,10vw,6.5rem)] font-light leading-[0.95] tracking-[0.02em]">
        <ScrollLine>{heading}</ScrollLine>
      </h2>
      {sub && <p className="mt-5 font-display text-xl italic text-ink/80 md:text-2xl">{sub}</p>}
    </header>
  );
}

/** "✦" section divider between two hairlines. Decorative. */
export function Divider() {
  return (
    <div aria-hidden className="mx-auto flex max-w-5xl items-center gap-6 px-6 md:px-12">
      <span className="h-px flex-1 bg-gold/50" />
      <span className="text-sm text-gold">✦</span>
      <span className="h-px flex-1 bg-gold/50" />
    </div>
  );
}
