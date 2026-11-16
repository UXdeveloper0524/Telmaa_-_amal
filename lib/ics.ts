import { wedding } from "@/config/wedding";

/** "2027-01-15T12:11:00+05:30" → "20270115T121100" (floating local time, paired with TZID). */
const local = (iso: string) => iso.slice(0, 19).replace(/[-:]/g, "");

/** RFC 5545 text escaping. */
const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

/** Builds the .ics body: 12:11–12:57 IST at Sobha Auditorium, with an Asia/Kolkata VTIMEZONE. */
export function buildIcs(): string {
  const { event, names, venue } = wedding;
  const location = `${venue.name}, ${venue.locality}, ${venue.region}`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Amal & Telma//Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VTIMEZONE",
    `TZID:${event.timeZone}`,
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0530",
    "TZOFFSETTO:+0530",
    "TZNAME:IST",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${local(event.start)}@amal-telma-wedding`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]|\.\d{3}/g, "")}`,
    `DTSTART;TZID=${event.timeZone}:${local(event.start)}`,
    `DTEND;TZID=${event.timeZone}:${local(event.end)}`,
    `SUMMARY:${esc(`Wedding of ${names.first} & ${names.second}`)}`,
    `DESCRIPTION:${esc(`${event.muhurtham}. ${wedding.hero.tagline}.`)}`,
    `LOCATION:${esc(location)}`,
    `URL:${venue.mapUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Triggers a download of the calendar file in the browser. */
export function downloadIcs() {
  const url = URL.createObjectURL(new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "amal-and-telma-wedding.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
