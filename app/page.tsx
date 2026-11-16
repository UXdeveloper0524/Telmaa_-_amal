import { wedding } from "@/config/wedding";
import { AudioToggle } from "@/components/AudioToggle";
import { BlessingsBlock } from "@/components/BlessingsBlock";
import { CeremonyBlock } from "@/components/CeremonyBlock";
import { CoupleCards } from "@/components/CoupleCards";
import { CustomCursor } from "@/components/CustomCursor";
import { DarkBand, GalleryStrip } from "@/components/Gallery";
import { GoldenThread } from "@/components/GoldenThread";
import { Hero } from "@/components/Hero";
import { InvitationText } from "@/components/InvitationText";
import { Loader } from "@/components/Loader";
import { RsvpFlow } from "@/components/RsvpFlow";
import { Divider } from "@/components/SectionHeading";
import { ShareSection } from "@/components/ShareButton";
import { SmoothScroll } from "@/components/SmoothScroll";
import { VenueBlock } from "@/components/VenueBlock";

/** schema.org Event so search engines and link previews understand the date and place. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `Wedding of ${wedding.names.first} & ${wedding.names.second}`,
  description: wedding.seo.description,
  startDate: "2027-01-15T12:11+05:30",
  endDate: "2027-01-15T12:57+05:30",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: wedding.venue.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: wedding.venue.name,
      addressLocality: "Thiruvankulam",
      addressRegion: "Kerala",
      postalCode: "682305",
      addressCountry: "IN",
    },
  },
};

export default function Page() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <CustomCursor />
      <AudioToggle />

      {/* overflow-x-clip: the thread may touch the viewport edge without causing a horizontal scrollbar. */}
      <main id="main" className="relative overflow-x-clip">
        <GoldenThread />
        <Hero />
        <Divider />
        <CoupleCards />
        <Divider />
        <InvitationText />
        <GalleryStrip />
        <DarkBand />
        <CeremonyBlock />
        <Divider />
        <VenueBlock />
        <Divider />
        <BlessingsBlock />
        <Divider />
        <RsvpFlow />
        <ShareSection />
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
