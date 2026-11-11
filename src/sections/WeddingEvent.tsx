import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarPlus, Download, MapPin, Navigation } from "lucide-react";
import { Branch, Sprig } from "@/components/Botanical";
import { Reveal } from "@/components/Reveal";
import { EASE, wedding } from "@/config/wedding";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";

function CalendarMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemClass =
    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-sans text-[0.82rem] font-medium text-forest transition-colors hover:bg-softsage/25";

  return (
    <div ref={ref} className="relative w-full sm:w-auto">
      <button
        type="button"
        className="btn btn-primary w-full sm:w-auto"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        <CalendarPlus size={16} strokeWidth={1.6} aria-hidden="true" />
        Add to Calendar
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute bottom-full left-1/2 z-20 mb-3 w-[min(19rem,84vw)] -translate-x-1/2 rounded-2xl border border-softsage/60 bg-white p-2 shadow-[0_24px_60px_-24px_rgb(54_92_69/.5)]"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <a
              className={itemClass}
              href={googleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              <CalendarPlus size={17} strokeWidth={1.5} className="text-sage" aria-hidden="true" />
              Google Calendar
            </a>
            <button
              type="button"
              className={itemClass}
              onClick={() => {
                downloadIcs();
                setOpen(false);
              }}
            >
              <Download size={17} strokeWidth={1.5} className="text-sage" aria-hidden="true" />
              Apple / Outlook (.ics file)
            </button>
            <p className="px-4 pb-2 pt-1 font-sans text-[0.68rem] leading-relaxed text-ink/70">
              Saved as an all-day event on {wedding.date.short}.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function WeddingEvent() {
  return (
    <section id="celebration" className="section-pad relative overflow-hidden bg-grey">
      <Branch
        tone="soft"
        className="absolute -right-24 -top-24 w-[190px] lg:-right-14 lg:top-6 lg:w-[340px]"
        style={{ transform: "rotate(200deg)" }}
        still
      />
      <div className="wrap relative flex flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow">The Celebration</p>
        </Reveal>
        <Reveal variant="heading" delay={0.08}>
          <h2 className="heading mt-5">Our Wedding Celebration</h2>
        </Reveal>

        <Reveal variant="card" delay={0.18} className="mt-12 w-full max-w-[980px]">
          <article className="paper paper-shadow relative grid rounded-md text-left md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <span className="pointer-events-none absolute inset-3 rounded-sm border border-champagne/50" aria-hidden="true" />

            {/* date panel */}
            <div className="relative flex flex-col items-center justify-center overflow-hidden px-8 pb-6 pt-14 text-center md:py-16">
              <p className="eyebrow">{wedding.date.weekday}</p>
              <p className="numeral mt-4 text-forest" style={{ fontSize: "clamp(6rem, 22vw, 10.5rem)" }}>
                {wedding.date.day}
              </p>
              <p className="-mt-1 font-script text-sage" style={{ fontSize: "clamp(2.6rem, 9vw, 3.8rem)", lineHeight: 1 }}>
                {wedding.date.month}
              </p>
              <p className="eyebrow mt-3 !tracking-[0.5em]">{wedding.date.year}</p>
            </div>

            {/* details panel */}
            <div className="relative flex flex-col justify-center px-8 pb-14 pt-6 text-center md:border-l md:border-champagne/40 md:px-14 md:py-16 md:text-left">
              <Sprig className="mx-auto mb-6 w-24 md:mx-0" />
              <p className="eyebrow">{wedding.date.long}</p>
              <h3 className="mt-4 font-serif text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.05] text-forest">
                {wedding.venue.name}
              </h3>
              <p className="mt-3 flex items-center justify-center gap-2 font-sans text-[0.95rem] text-ink md:justify-start">
                <MapPin size={16} strokeWidth={1.5} className="text-sage" aria-hidden="true" />
                {wedding.venue.locality}, {wedding.venue.region}
              </p>

              <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center md:justify-start">
                <CalendarMenu />
                <a
                  className="btn btn-ghost"
                  href={wedding.venue.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation size={15} strokeWidth={1.6} aria-hidden="true" />
                  Get Directions
                </a>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
