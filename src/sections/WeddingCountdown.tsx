import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { EASE, wedding } from "@/config/wedding";
import { hasWebGL2, useFinePointer, useIsDesktop, useNearViewport, useReducedMotion } from "@/hooks/useMedia";

const LineWaves = lazy(() => import("@/components/reactbits/LineWaves"));

const TARGET = new Date(wedding.date.startOfDay).getTime();
const DAY = 86_400_000;

type Phase = "before" | "today" | "after";

function read(now: number) {
  const left = TARGET - now;
  const phase: Phase = left > 0 ? "before" : now < TARGET + DAY ? "today" : "after";
  const safe = Math.max(0, left); // never negative
  return {
    phase,
    days: Math.floor(safe / DAY),
    hours: Math.floor((safe / 3_600_000) % 24),
    minutes: Math.floor((safe / 60_000) % 60),
    seconds: Math.floor((safe / 1000) % 60),
  };
}

function Digit({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, "0");
  const reduced = useReducedMotion();
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-white bg-white/75 py-5 shadow-[0_18px_40px_-28px_rgb(54_92_69/.6)] sm:py-8"
        style={{ backdropFilter: "blur(6px)" }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="numeral block tabular-nums text-forest"
            style={{ fontSize: "clamp(2rem, 9.5vw, 5.4rem)", lineHeight: 1, letterSpacing: "-0.03em" }}
            initial={reduced ? false : { y: "55%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: "-55%", opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            aria-hidden="true"
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="eyebrow mt-4 !text-[0.62rem] sm:!text-[0.72rem]">{label}</span>
    </div>
  );
}

export function WeddingCountdown() {
  const [t, setT] = useState(() => read(Date.now()));
  const [ref, near] = useNearViewport<HTMLElement>("40% 0px");
  const desktop = useIsDesktop();
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [gl] = useState(hasWebGL2);

  useEffect(() => {
    const id = window.setInterval(() => setT(read(Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Days", value: t.days },
    { label: "Hours", value: t.hours },
    { label: "Minutes", value: t.minutes },
    { label: "Seconds", value: t.seconds },
  ];

  return (
    <section id="countdown" ref={ref} className="section-pad relative isolate overflow-hidden bg-ivory">
      {/* static fallback wash: shown under the canvas and on its own without WebGL */}
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(70% 55% at 20% 30%, rgb(168 185 168 / .28), transparent 70%), radial-gradient(60% 50% at 85% 75%, rgb(196 181 138 / .22), transparent 70%)",
        }}
      />
      {/* React Bits Line Waves — the only animated background in this section */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {near && gl && (
          <Suspense fallback={null}>
            <LineWaves
              color1="#557F65"
              color2="#A8B9A8"
              color3="#C4B58A"
              speed={reduced ? 0 : 0.35}
              lineCount={desktop ? 18 : 11}
              lineWidth={1}
              glow={0.2}
              brightness={0.7}
              highlight={0.4}
              edgeFade={0.65}
              warpIntensity={desktop ? 1 : 0.7}
              lightMode
              opacity={desktop ? 0.5 : 0.42}
              enableMouseInteraction={fine}
              mouseInfluence={0.15}
              clickRipple={false}
              intro
              maxDevicePixelRatio={desktop ? 1.5 : 1}
            />
          </Suspense>
        )}
      </div>

      <div className="wrap relative flex flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow">{wedding.date.long}</p>
        </Reveal>
        <Reveal variant="heading" delay={0.08}>
          <h2 className="heading mt-5">
            {t.phase === "before" && "Counting Down to Forever"}
            {t.phase === "today" && "Today Is Our Special Day!"}
            {t.phase === "after" && "Forever Begins Here"}
          </h2>
        </Reveal>

        {t.phase === "before" ? (
          <>
            <RevealGroup
              className="mt-12 grid w-full max-w-[1040px] grid-cols-4 gap-2.5 sm:gap-5 lg:gap-7"
              role="timer"
              aria-label={`${t.days} days, ${t.hours} hours and ${t.minutes} minutes until the wedding`}
            >
              {units.map((u) => (
                <RevealItem key={u.label}>
                  <Digit value={u.value} label={u.label} />
                </RevealItem>
              ))}
            </RevealGroup>
            <Reveal delay={0.3}>
              <p className="body-copy mt-10 italic text-forest">
                until {wedding.groom} &amp; {wedding.bride} say forever.
              </p>
            </Reveal>
          </>
        ) : (
          <Reveal delay={0.2}>
            <p className="mt-8 font-script text-sage" style={{ fontSize: "clamp(2.6rem, 9vw, 5rem)", lineHeight: 1.1 }}>
              {wedding.displayName}
            </p>
            <p className="eyebrow mt-4">{wedding.date.short}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
