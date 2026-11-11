import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Signature } from "@/components/ui/signature";
import { Monogram, Sprig } from "@/components/Botanical";
import { Reveal } from "@/components/Reveal";
import { EASE, wedding } from "@/config/wedding";
import { useIsDesktop, useReducedMotion } from "@/hooks/useMedia";

export const SIGNATURE_FONT = `${import.meta.env.BASE_URL}fonts/Allura-Regular.ttf`;

export function InvitationLetter() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setOpen((v) => {
      if (v) requestAnimationFrame(() => toggleRef.current?.focus({ preventScroll: true }));
      return !v;
    });
  };

  return (
    <section id="letter" className="section-pad relative overflow-hidden bg-ivory">
      <div className="wrap grid items-start gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="text-center lg:sticky lg:top-32 lg:col-span-5 lg:text-left">
          <Reveal>
            <p className="eyebrow">The Letter</p>
          </Reveal>
          <Reveal variant="heading" delay={0.08}>
            <h2 className="heading mt-5">A Note for You</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="body-copy mx-auto mt-5 max-w-[30ch] text-forest lg:mx-0">
              A few words from {wedding.groom} and {wedding.bride}, folded and sealed for you.
            </p>
          </Reveal>
          <Reveal delay={0.24} className="mt-8">
            <button
              ref={toggleRef}
              type="button"
              className="btn btn-primary"
              aria-expanded={open}
              aria-controls="invitation-letter"
              onClick={toggle}
            >
              {open ? "Close Letter" : "Tap to Read"}
            </button>
          </Reveal>
        </div>

        <Reveal variant="card" delay={0.15} className="lg:col-span-7">
          <div className="mx-auto w-full max-w-[620px]" style={{ perspective: 1600 }}>
            {/* folded cover — the letter's outer panel */}
            <motion.button
              type="button"
              onClick={toggle}
              aria-label={open ? "Close the letter" : "Open the letter"}
              aria-expanded={open}
              aria-controls="invitation-letter"
              className="paper paper-shadow relative z-10 flex w-full cursor-pointer flex-col items-center justify-center rounded-sm px-6 text-center"
              style={{ transformOrigin: "50% 100%", minHeight: open ? 132 : 240 }}
              animate={{ rotateX: open ? [0, -14, 0] : 0, minHeight: open ? 132 : 240 }}
              transition={{ duration: reduced ? 0 : 0.7, ease: EASE }}
            >
              <span className="absolute inset-3 rounded-sm border border-champagne/50" aria-hidden="true" />
              <Monogram size={open ? 46 : 62} />
              <AnimatePresence initial={false}>
                {!open && (
                  <motion.span
                    className="mt-4 block overflow-hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <span className="block font-script text-sage" style={{ fontSize: "2.1rem", lineHeight: 1.1 }}>
                      For you
                    </span>
                    <span className="eyebrow mt-2 block !text-[0.62rem]">Tap to Read</span>
                  </motion.span>
                )}
              </AnimatePresence>
              {/* fold crease */}
              <span
                className="absolute inset-x-0 bottom-0 h-px"
                style={{ background: "linear-gradient(90deg,transparent,rgb(37 36 42 / .12),transparent)" }}
                aria-hidden="true"
              />
            </motion.button>

            {/* the letter unfolds downward from the cover */}
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id="invitation-letter"
                  ref={letterRef}
                  key="letter"
                  className="overflow-hidden"
                  style={{ transformOrigin: "50% 0%" }}
                  initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0, rotateX: -70 }}
                  animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1, rotateX: 0 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0, rotateX: -70 }}
                  transition={{ duration: reduced ? 0.2 : 0.85, ease: EASE }}
                >
                  <div className="paper paper-shadow relative rounded-b-sm px-7 pb-10 pt-9 sm:px-14 sm:pb-14 sm:pt-12">
                    <span
                      className="absolute inset-x-3 bottom-3 top-0 rounded-b-sm border border-t-0 border-champagne/50"
                      aria-hidden="true"
                    />
                    <motion.div
                      className="relative"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.65, delay: reduced ? 0 : 0.45, ease: EASE }}
                    >
                      <p className="font-script text-sage" style={{ fontSize: "clamp(2rem, 7vw, 2.6rem)", lineHeight: 1.1 }}>
                        Dear Family &amp; Friends,
                      </p>
                      <p className="body-copy mt-6">
                        With grateful hearts and great happiness, we invite you to celebrate the wedding of Ameen and
                        Aysha.
                      </p>
                      <p className="body-copy mt-5">
                        Please join us on Saturday, 14 November 2026, at Hi Mall Auditorium, Pullara.
                      </p>
                      <p className="body-copy mt-5">Your presence and blessings mean so much to us.</p>
                      <Sprig className="my-7 w-24" />
                      <p className="body-copy italic text-forest">With love,</p>
                      {/* Componentry Signature — real glyph outlines drawn stroke by stroke */}
                      <div className="-ml-1 mt-1">
                        <Signature
                          text={wedding.displayName}
                          fontUrl={SIGNATURE_FONT}
                          color="#557F65"
                          fontSize={desktop ? 54 : 40}
                          duration={0.9}
                          delay={reduced ? 0 : 0.9}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={toggle}
                        className="mt-6 rounded-full py-2 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-forest underline decoration-champagne decoration-1 underline-offset-[6px] transition-colors hover:text-sage"
                      >
                        Close Letter
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
