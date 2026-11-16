import { wedding } from "@/config/wedding";
import { ScrollLine } from "./ScrollReveal";
import { SectionHeading } from "./SectionHeading";

export function BlessingsBlock() {
  const { blessings } = wedding;
  return (
    <section id="blessings" className="px-6 py-24 md:px-12 md:py-36" aria-labelledby="blessings-h">
      <div className="mx-auto max-w-5xl">
        <SectionHeading id="blessings-h" number={blessings.number} label={blessings.label} heading={blessings.heading} />
        <div data-thread="left" className="mt-14 max-w-2xl">
          <p className="font-display text-2xl leading-relaxed md:text-3xl">{blessings.body}</p>
          <p className="mt-12 font-display text-xl italic text-ink/80">{blessings.regards}</p>
          <ul className="mt-4 space-y-3 font-display text-2xl md:text-3xl">
            {blessings.families.map((family, i) => (
              <li key={family}>
                <ScrollLine delay={i * 0.15}>{family}</ScrollLine>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
