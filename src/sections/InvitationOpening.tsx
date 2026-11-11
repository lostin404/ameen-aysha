import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Branch } from "@/components/Botanical";
import { EASE, wedding } from "@/config/wedding";
import { useReducedMotion } from "@/hooks/useMedia";

type Props = {
  /** Fired when the hero should begin appearing underneath. */
  onReveal: () => void;
  /** Fired when the overlay has fully left the screen. */
  onDone: () => void;
};

/** 0 idle · 1 seal · 2 flap · 3 paper rises · 4 expands into the page */
type Stage = 0 | 1 | 2 | 3 | 4;

/**
 * Full-screen envelope. The backdrop is translucent so the Aurora that lives
 * behind the hero glows softly through it — one canvas serves both moments.
 */
export function InvitationOpening({ onReveal, onDone }: Props) {
  const [stage, setStage] = useState<Stage>(0);
  const timers = useRef<number[]>([]);
  const reduced = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    window.scrollTo(0, 0);
    buttonRef.current?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = previous;
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const finish = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStage(4);
    onReveal();
    later(onDone, reduced ? 250 : 750);
  }, [onDone, onReveal, reduced]);

  const open = useCallback(() => {
    if (stage !== 0) return;
    if (reduced) return finish();
    setStage(1);
    later(() => setStage(2), 320);
    later(() => setStage(3), 980);
    later(finish, 1680);
  }, [stage, reduced, finish]);

  const leaving = stage === 4;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Wedding invitation from ${wedding.displayName}`}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: "rgb(248 247 243 / 0.62)", pointerEvents: leaving ? "none" : "auto" }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: reduced ? 0.2 : 0.7, ease: EASE }}
    >
      {/* corner botanicals */}
      <motion.div
        className="absolute -left-10 -top-6 w-[46vw] max-w-[300px] sm:-left-6"
        style={{ rotate: 150 }}
        animate={{ x: stage >= 2 ? -40 : 0, opacity: stage >= 3 ? 0 : 1 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <Branch style={{ ["--sway-origin" as string]: "0% 100%" }} />
      </motion.div>
      <motion.div
        className="absolute -bottom-8 -right-10 w-[50vw] max-w-[340px] sm:-right-6"
        style={{ rotate: -28 }}
        animate={{ x: stage >= 2 ? 40 : 0, opacity: stage >= 3 ? 0 : 1 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <Branch leaves={11} style={{ ["--sway-origin" as string]: "100% 100%" }} />
      </motion.div>

      <motion.div
        className="relative flex w-full max-w-md flex-col items-center text-center"
        animate={{ scale: leaving ? 1.12 : 1, y: leaving ? -10 : 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <motion.p
          className="font-script text-sage"
          style={{ fontSize: "clamp(2.6rem, 11vw, 3.6rem)", lineHeight: 1 }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: stage >= 3 ? 0 : 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: stage === 0 ? 0.15 : 0 }}
        >
          You&rsquo;re Invited
        </motion.p>

        {/* ── Envelope ── */}
        <motion.div
          className="relative mt-[clamp(3.2rem,12vh,6rem)]"
          style={{ width: "clamp(240px, 72vw, 380px)", aspectRatio: "3 / 2", perspective: 1400 }}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
        >
          {/* back of envelope */}
          <div
            className="absolute inset-0 rounded-md"
            style={{
              background: "linear-gradient(180deg,#E9E6DC,#EFECE3)",
              boxShadow: "0 30px 60px -30px rgb(54 92 69 / .45), 0 10px 20px -12px rgb(37 36 42 / .2)",
            }}
          />

          {/* invitation paper */}
          <motion.div
            className="paper absolute inset-x-[5%] top-[5%] flex h-[90%] flex-col items-center justify-start rounded-sm pt-[9%]"
            style={{ boxShadow: "0 2px 10px rgb(37 36 42 / .12)", zIndex: 2 }}
            animate={{
              y: stage >= 3 ? "-64%" : "0%",
              scale: leaving ? 1.5 : 1,
              opacity: leaving ? 0 : 1,
            }}
            transition={{ duration: stage >= 4 ? 0.7 : 0.75, ease: EASE }}
          >
            <span className="eyebrow !text-[0.5rem] !tracking-[0.3em]">The Wedding Of</span>
            <span className="name-face mt-[5%] text-[clamp(1.1rem,5.4vw,1.75rem)] leading-[1.05]">
              {wedding.groom}
              <span className="mx-[0.25em] font-script text-champagne">&amp;</span>
              {wedding.bride}
            </span>
            <span className="mt-[5%] h-px w-10 bg-champagne" />
          </motion.div>

          {/* pocket: left, right and bottom folds */}
          <div className="absolute inset-0" style={{ zIndex: 3, filter: "drop-shadow(0 -1px 2px rgb(37 36 42 / .07))" }}>
            <div
              className="absolute inset-0 rounded-md"
              style={{
                background: "linear-gradient(160deg,#FBFAF6 0%,#F1EEE6 100%)",
                clipPath: "polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)",
              }}
            />
          </div>
          <div
            className="absolute inset-0 rounded-md"
            style={{
              zIndex: 3,
              background: "linear-gradient(0deg,#F6F4EE,#FDFCF9)",
              clipPath: "polygon(0 100%, 50% 46%, 100% 100%)",
              filter: "drop-shadow(0 -2px 3px rgb(37 36 42 / .08))",
            }}
          />

          {/* top flap */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[60%]"
            style={{
              transformOrigin: "50% 0%",
              transformStyle: "preserve-3d",
              zIndex: stage >= 3 ? 1 : 4,
              filter: "drop-shadow(0 3px 4px rgb(37 36 42 / .12))",
            }}
            animate={{ rotateX: stage >= 2 ? 178 : 0 }}
            transition={{ duration: 0.75, ease: [0.5, 0, 0.2, 1] }}
          >
            <div
              className="absolute inset-0 rounded-t-md"
              style={{
                background: "linear-gradient(180deg,#F7F5EF,#ECE9DF)",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />
          </motion.div>

          {/* wax seal */}
          <motion.div
            className="absolute left-1/2 top-[60%] flex items-center justify-center rounded-full font-serif text-white"
            style={{
              zIndex: 5,
              width: "21%",
              aspectRatio: "1",
              x: "-50%",
              y: "-50%",
              fontSize: "clamp(.8rem,3.6vw,1.15rem)",
              background: "radial-gradient(circle at 35% 30%, #E2D8B6 0%, #C4B58A 45%, #A99A6E 100%)",
              boxShadow:
                "inset 0 0 0 3px rgb(255 255 255 / .22), inset 0 -3px 6px rgb(120 105 60 / .35), 0 4px 10px rgb(120 105 60 / .35)",
            }}
            animate={
              stage === 0
                ? { scale: [1, 1.035, 1], opacity: 1 }
                : { scale: [1, 1.16, 0.6], opacity: [1, 1, 0], rotate: [0, -6, 14] }
            }
            transition={
              stage === 0
                ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.5, ease: EASE }
            }
          >
            <span style={{ textShadow: "0 1px 1px rgb(120 105 60 / .6)" }}>A&amp;A</span>
          </motion.div>
        </motion.div>

        {/* names + date */}
        <motion.div
          className="mt-8 flex flex-col items-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: stage >= 2 ? 0 : 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: stage === 0 ? 0.45 : 0 }}
        >
          <h1 className="font-serif text-forest" style={{ fontSize: "clamp(1.9rem, 8vw, 2.6rem)", lineHeight: 1.05 }}>
            {wedding.groom} <span className="font-script text-sage">&amp;</span> {wedding.bride}
          </h1>
          <p className="eyebrow mt-3">{wedding.date.short}</p>
        </motion.div>

        <motion.div
          className="mt-8 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: stage >= 1 ? 0 : 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: stage === 0 ? 0.6 : 0 }}
        >
          <button ref={buttonRef} type="button" className="btn btn-primary" onClick={open} disabled={stage !== 0}>
            Open Invitation
          </button>
          <button
            type="button"
            onClick={finish}
            disabled={stage === 4}
            className="rounded-full px-4 py-2 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-forest underline decoration-champagne decoration-1 underline-offset-[6px] transition-colors hover:text-sage"
          >
            Skip
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
