import { wedding } from "@/config/wedding";
import { ScrollLine } from "./ScrollReveal";
import { SectionHeading } from "./SectionHeading";

/** Splits after each comma so a paragraph reveals phrase by phrase (text itself is unchanged). */
const phrases = (text: string) => text.split(/(?<=,)\s+/);

function Lines({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p className={`mx-auto max-w-2xl font-display text-balance ${className}`}>
      {phrases(text).map((line, i) => (
        <ScrollLine key={line} delay={i * 0.12}>
          {line}
        </ScrollLine>
      ))}
    </p>
  );
}

function Name({ name }: { name: string }) {
  return (
    <h3 className="font-display text-[clamp(3.5rem,15vw,8.5rem)] font-light leading-[0.95] tracking-[0.1em]">
      <ScrollLine>{name}</ScrollLine>
    </h3>
  );
}

export function InvitationText() {
  const { invitation: inv } = wedding;
  return (
    <section id="invitation" className="px-6 py-24 text-center md:px-12 md:py-36" aria-labelledby="invitation-h">
      <div className="mx-auto max-w-5xl">
        <SectionHeading id="invitation-h" number={inv.number} label={inv.label} heading={inv.heading} align="center" />

        <div className="mt-20 space-y-16">
          <Lines text={inv.intro} className="text-xl italic leading-relaxed md:text-2xl" />

          <div>
            <Name name={inv.groom.name} />
            <p className="label mt-6 text-ink/70">{inv.groom.sonOf}</p>
            <p className="mt-3 font-display text-xl md:text-2xl">{inv.groom.parents}</p>
            <p className="mx-auto mt-4 max-w-md font-display text-lg italic text-ink/80">{inv.groom.siblings}</p>
          </div>

          {/* The thread passes through this ampersand, echoing the hero. */}
          <div data-thread="center" className="font-display text-[clamp(5rem,22vw,11rem)] font-light italic leading-[0.6]">
            <ScrollLine className="py-[0.25em]">&amp;</ScrollLine>
          </div>

          <div>
            <Name name={inv.bride.name} />
            <p className="label mt-6 text-ink/70">{inv.bride.daughterOf}</p>
            <p className="mt-3 font-display text-xl md:text-2xl">{inv.bride.parents}</p>
            <p className="mt-1 font-display text-xl md:text-2xl">{inv.bride.house}</p>
            <p className="mx-auto mt-4 max-w-md font-display text-lg italic text-ink/80">{inv.bride.siblings}</p>
          </div>

          <Lines text={inv.outro} className="text-xl leading-relaxed md:text-2xl" />
        </div>
      </div>
    </section>
  );
}
