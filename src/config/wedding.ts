/**
 * Central wedding configuration.
 * Edit the values here — every section of the site reads from this file.
 */
export const wedding = {
  groom: "Ameen",
  bride: "Aysha",
  displayName: "Ameen & Aysha",
  monogram: "A&A",

  /** Calendar date of the wedding (no ceremony time has been confirmed). */
  date: {
    iso: "2026-11-14",
    weekday: "Saturday",
    day: "14",
    month: "November",
    year: "2026",
    long: "Saturday, 14 November 2026",
    short: "14 November 2026",
    /** Start of the wedding day in Asia/Kolkata (UTC+05:30). */
    startOfDay: "2026-11-14T00:00:00+05:30",
    timezone: "Asia/Kolkata",
  },

  venue: {
    name: "Hi Mall Auditorium",
    locality: "Pullara",
    region: "Kerala",
    country: "India",
    /**
     * Opens Google Maps on the venue. The query uses the address shown on the
     * Google listing that the invitation card's own link resolves to
     * ("Hi mall Auditorium — Moochikkal, Valluvambram, Pullara, Keralam 673642").
     */
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Hi+mall+Auditorium%2C+Moochikkal%2C+Valluvambram%2C+Pullara%2C+Kerala+673642",
    /** Keyless Google Maps embed used for the map preview. */
    mapsEmbedUrl:
      "https://www.google.com/maps?q=Hi+mall+Auditorium%2C+Moochikkal%2C+Valluvambram%2C+Pullara%2C+Kerala+673642&output=embed",
    /**
     * Link printed (as a QR code) on the original invitation card. Checked: it
     * opens Google's listing for "Hi mall Auditorium", Pullara. It lands on a
     * Google Search place card rather than in Maps, so the buttons use
     * `mapsUrl`; swap this in there if you prefer the card's exact link.
     */
    cardLink: "https://share.google/bGTWxcaPKurlTsROq",
  },

  share: {
    message:
      "You're warmly invited to celebrate the wedding of Ameen & Aysha on Saturday, 14 November 2026, at Hi Mall Auditorium, Pullara. We would love to celebrate with you!",
    title: "Ameen & Aysha | Wedding Invitation",
  },

  credit: "lostin__404",
} as const;

export const palette = {
  ivory: "#F8F7F3",
  grey: "#F1F1F1",
  white: "#FFFFFF",
  sage: "#557F65",
  forest: "#365C45",
  softSage: "#A8B9A8",
  champagne: "#C4B58A",
  ink: "#25242A",
} as const;

export const EASE = [0.22, 1, 0.36, 1] as const;
