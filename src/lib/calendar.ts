import { wedding } from "@/config/wedding";

const compact = (iso: string) => iso.replace(/-/g, "");

function nextDay(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

const title = `Wedding of ${wedding.displayName}`;
const location = `${wedding.venue.name}, ${wedding.venue.locality}, ${wedding.venue.region}, ${wedding.venue.country}`;
const details = `You're warmly invited to celebrate the wedding of ${wedding.displayName} on ${wedding.date.long}, at ${wedding.venue.name}, ${wedding.venue.locality}.`;

/** All-day Google Calendar event (end date is exclusive). */
export function googleCalendarUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${compact(wedding.date.iso)}/${compact(nextDay(wedding.date.iso))}`,
    ctz: wedding.date.timezone,
    details,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const esc = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/([,;])/g, "\\$1")
    .replace(/\n/g, "\\n");

/** All-day ICS event — no time is set because none has been confirmed. */
export function buildIcs() {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ameen & Aysha//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:ameen-aysha-wedding-${compact(wedding.date.iso)}@invitation`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(wedding.date.iso)}`,
    `DTEND;VALUE=DATE:${compact(nextDay(wedding.date.iso))}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(details)}`,
    `LOCATION:${esc(location)}`,
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs() {
  const blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ameen-aysha-wedding.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
