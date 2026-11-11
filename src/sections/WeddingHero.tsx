import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Aurora from "@/components/reactbits/Aurora";
import { LetterCascade } from "@/components/ui/letter-cascade";
import { Branch } from "@/components/Botanical";
import { EASE, wedding } from "@/config/wedding";
import { useFinePointer, useIsDesktop, useNearViewport, useReducedMotion } from "@/hooks/useMedia";

/**
 * Letter Cascade is hover/click driven, so this wrapper adds the entrance and
 * plays the cascade once by itself after the name has settled.
 */
function CascadeName({ text, delay, play, touch }: { text: string; delay: number; play: boolean; touch: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!play || reduced) return;
    const id = window.setTimeout(
      () => {
        const target = ref.current?.firstElementChild;
        // React derives onMouseEnter from mouseover, so this plays the real component animation.
        target?.dispatchEvent(new MouseEvent(touch ? "click" : "mouseover", { bubbles: true }));
      },
      (delay + 0.95) * 1000,
    );
    return () => clearTimeout(id);
  }, [play, reduced, delay, touch]);

  return (
    <motion.span
      ref={ref}
      className="block"
      initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
      animate={play ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      <LetterCascade
        text={text}
        staggerDuration={0.04}
        stiffness={220}
        damping={18}
        triggerOnClick={touch}
        className="name-face !justify-start leading-[0.95]"
      />
    </motion.span>
  );
}

export function WeddingHero({ opened }: { opened: boolean }) {
  const desktop = useIsDesktop();
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [ref, near] = useNearViewport<HTMLElement>("20% 0px");

  const item = (delay: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: opened ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.75, delay, ease: EASE },
  });

  return (
    <section
      id="home"
      ref={ref}
      aria-label="The wedding of Ameen and Aysha"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden"
      style={{ background: "linear-gradient(180deg,#F1F1F1 0%,#F4F3EF 55%,#F8F7F3 100%)" }}
    >
      {/* Aurora — the only animated background behind the opening + hero */}
      <div className="pointer-events-none absolute inset-0 -z-20" aria-hidden="true">
        {near && (
          <Aurora
            colorStops={["#A8B9A8", "#C4B58A", "#557F65"]}
            amplitude={0.7}
            blend={0.7}
            speed={reduced ? 0 : 0.3}
            height={desktop ? 0.6 : 0.5}
            scale={desktop ? 1 : 0.7}
            glow={0.45}
            brightness={0.9}
            layers={desktop ? 2 : 1}
            direction="top"
            mouseInteraction={fine}
            intro
            opacity={desktop ? 0.7 : 0.6}
            lightMode
            dpr={desktop ? 1.5 : 1}
          />
        )}
      </div>
      {/* soft ivory wash so type never fights the light */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(120% 70% at 30% 60%, rgb(248 247 243 / .82) 0%, rgb(248 247 243 / .35) 55%, transparent 100%)",
        }}
      />

      {/* oversized 14 + calligraphy + botanical */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-6vw] top-[3svh] -z-10 select-none lg:right-[2vw] lg:top-1/2 lg:-translate-y-1/2"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={opened ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 1.6, ease: EASE }}
      >
        <div className="relative">
          <span
            className="numeral block text-white"
            style={{
              fontSize: desktop ? "min(58vh, 40vw)" : "min(78vw, 50svh)",
              textShadow: "0 30px 80px rgb(54 92 69 / .10), 0 2px 0 rgb(255 255 255 / .9)",
            }}
          >
            14
          </span>
          <motion.span
            className="absolute left-[4%] top-[58%] font-script text-sage lg:left-[-8%]"
            style={{ fontSize: desktop ? "min(15vh, 10vw)" : "min(19vw, 12svh)", lineHeight: 1, rotate: -7 }}
            initial={{ opacity: 0, x: -24 }}
            animate={opened ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 1.2, delay: 0.7, ease: EASE }}
          >
            November
          </motion.span>
          <motion.div
            className="absolute -right-[4%] bottom-[-34%] hidden w-[46%] lg:block"
            style={{ rotate: -18 }}
            initial={{ opacity: 0, y: 30 }}
            animate={opened ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1.3, delay: 0.9, ease: EASE }}
          >
            <Branch leaves={11} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-12 -z-10 w-[52vw] max-w-[260px] lg:hidden"
        style={{ rotate: -30 }}
        initial={{ opacity: 0 }}
        animate={opened ? { opacity: 1 } : undefined}
        transition={{ duration: 1.3, delay: 0.9 }}
      >
        <Branch />
      </motion.div>

      {/* content */}
      <div className="wrap relative grid w-full px-[clamp(1.5rem,6vw,5rem)] pb-32 pt-[36svh] lg:grid-cols-12 lg:pb-24 lg:pt-28">
        <div className="lg:col-span-7">
          <motion.p className="eyebrow" {...item(0.15)}>
            The Wedding Of
          </motion.p>

          <h1
            className="mt-5"
            style={{ fontSize: desktop ? "clamp(4.6rem, 8.6vw, 9.4rem)" : "clamp(3.3rem, 17.5vw, 6rem)" }}
            aria-label={wedding.displayName}
          >
            <CascadeName text={wedding.groom} delay={0.3} play={opened} touch={!fine} />
            <motion.span
              aria-hidden="true"
              className="-my-[0.14em] ml-[0.9em] block font-script leading-none text-champagne"
              style={{ fontSize: "0.62em" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={opened ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            >
              &amp;
            </motion.span>
            <CascadeName text={wedding.bride} delay={0.62} play={opened} touch={!fine} />
          </h1>

          <motion.div className="mt-8 h-px w-24 origin-left bg-sage" {...item(0.95)} />

          <motion.p className="mt-6 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.24em] text-ink sm:text-[0.86rem]" {...item(1.05)}>
            {wedding.date.weekday} <span className="mx-1 text-champagne">·</span> {wedding.date.short}
          </motion.p>
          <motion.p className="mt-2 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-forest sm:text-[0.78rem]" {...item(1.15)}>
            {wedding.venue.name} <span className="mx-1 text-champagne">·</span> {wedding.venue.locality}
          </motion.p>

          <motion.p className="body-copy mt-7 max-w-[26ch] italic text-forest sm:max-w-[34ch]" {...item(1.3)}>
            Together with love, we invite you to celebrate our special day.
          </motion.p>
        </div>
      </div>

      {/* scroll indicator */}
      <motion.a
        href="#invitation"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 rounded-full px-3 py-2"
        initial={{ opacity: 0 }}
        animate={opened ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 1.7 }}
      >
        <span className="eyebrow !text-[0.6rem]">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-sage/30">
          <span
            className="scroll-cue-dot absolute inset-x-0 top-0 h-4 bg-forest"
            style={{ animation: "scroll-cue 2.4s cubic-bezier(.6,0,.2,1) infinite" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
