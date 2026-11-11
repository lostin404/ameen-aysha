import { lazy, Suspense, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Branch, Monogram } from "@/components/Botanical";
import { Reveal } from "@/components/Reveal";
import { SignatureCredit } from "@/components/SignatureCredit";
import { wedding } from "@/config/wedding";
import { hasWebGL2, useFinePointer, useIsDesktop, useMedia, useNearViewport, useReducedMotion } from "@/hooks/useMedia";

const LightRays = lazy(() => import("@/components/reactbits/LightRays"));
const TechText = lazy(() => import("@/components/reactbits/TechText"));

export function WeddingClosing() {
  const [ref, near] = useNearViewport<HTMLElement>("40% 0px");
  const desktop = useIsDesktop();
  const tablet = useMedia("(min-width: 640px)");
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [gl] = useState(hasWebGL2);

  const wordmarkSize = desktop ? 132 : tablet ? 92 : 54;

  return (
    <section
      id="closing"
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg,#F1F1F1 0%,#F8F7F3 60%,#F8F7F3 100%)" }}
    >
      {/* champagne illumination: static wash underneath, live rays on top */}
      <div
        className="pointer-events-none absolute inset-0 -z-30"
        aria-hidden="true"
        style={{ background: "radial-gradient(80% 60% at 50% -10%, rgb(196 181 138 / .38), transparent 70%)" }}
      />
      <div className="pointer-events-none absolute inset-0 -z-20" aria-hidden="true">
        {near && gl && (
          <Suspense fallback={null}>
            <LightRays
              raysOrigin="top-center"
              raysColor="#C4B58A"
              raysSpeed={reduced ? 0 : 0.6}
              lightSpread={desktop ? 0.75 : 0.55}
              rayLength={2.4}
              rayDensity={desktop ? 1 : 0.7}
              raySharpness={0.2}
              glow={0.5}
              haze={0.35}
              atmosphere={0.25}
              intensity={1.15}
              saturation={0.9}
              followMouse={fine}
              mouseInfluence={0.08}
              cursorShadow={false}
              clickPulse={false}
              intro
              lightMode
              opacity={desktop ? 0.85 : 0.75}
              maxDevicePixelRatio={desktop ? 1.5 : 1}
            />
          </Suspense>
        )}
      </div>

      {/* oversized translucent 14 */}
      <span
        aria-hidden="true"
        className="numeral pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none text-white/75"
        style={{ fontSize: "min(92vw, 78svh)", textShadow: "0 40px 100px rgb(54 92 69 / .08)" }}
      >
        14
      </span>
      <Branch
        className="absolute -bottom-6 -left-12 -z-10 w-[200px] lg:w-[360px]"
        style={{ rotate: "6deg", ["--sway-origin" as string]: "0% 100%" }}
        leaves={11}
      />
      <Branch
        tone="soft"
        className="absolute -right-14 -top-4 -z-10 w-[190px] lg:w-[340px]"
        style={{ transform: "rotate(190deg)" }}
        still
      />

      <div className="wrap flex flex-1 flex-col items-center justify-center px-[clamp(1.25rem,5vw,4rem)] pb-10 pt-28 text-center">
        <Reveal>
          <Monogram size={58} className="bg-ivory/70" />
        </Reveal>

        {/* React Bits TechText — interactive decorative wordmark */}
        <Reveal variant="heading" delay={0.1} className="mt-6 w-full">
          <h2 className="sr-only">{wedding.displayName}</h2>
          <div
            aria-hidden="true"
            className="relative mx-auto w-full max-w-[1280px] text-sage"
            style={{ height: wordmarkSize * 1.55, fontFamily: '"Archivo", sans-serif', fontStretch: "118%" }}
          >
            {near ? (
              <Suspense fallback={<WordmarkFallback size={wordmarkSize} />}>
                <TechText
                  text={wedding.displayName}
                  fontFamily='"Archivo", sans-serif'
                  fontWeight={300}
                  fontSize={wordmarkSize}
                  letterSpacing={-0.05}
                  color="#557F65"
                  accentColor="#557F65"
                  align="center"
                  reveal="letter"
                  reach={desktop ? 200 : 120}
                  softness={0.7}
                  dashLength={4}
                  dashGap={2}
                  strokeWidth={1.5}
                  lineStyle="dashed"
                  specks={desktop ? 15 : 8}
                  selection={false}
                  labels={false}
                  draggable={false}
                  guides={false}
                  bounce={0.4}
                  speed={1}
                  sweep
                  clickKick
                  intro="none"
                  introDuration={2}
                />
              </Suspense>
            ) : (
              <WordmarkFallback size={wordmarkSize} />
            )}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-2 font-script text-forest" style={{ fontSize: "clamp(2.2rem, 7.4vw, 4.2rem)", lineHeight: 1.1 }}>
            Together is a beautiful place to be.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mx-auto my-7 h-px w-24 bg-champagne" aria-hidden="true" />
          <p className="eyebrow !text-[0.8rem]">{wedding.date.short}</p>
          <p className="body-copy mt-5 italic text-forest">We can&rsquo;t wait to celebrate with you.</p>
        </Reveal>
        <Reveal delay={0.4} className="mt-10">
          <a href="#home" className="btn btn-ghost">
            <ArrowUp size={15} strokeWidth={1.6} aria-hidden="true" />
            Back to Top
          </a>
        </Reveal>
      </div>

      <footer className="relative flex items-end justify-between gap-4 border-t border-sage/20 px-[clamp(1.25rem,5vw,4rem)] py-5">
        <p className="font-sans text-[0.68rem] font-medium uppercase tracking-[0.2em] text-forest">
          {wedding.displayName}
          <span className="hidden sm:inline"> · {wedding.date.short}</span>
        </p>
        {/* on phones the credit lives here; on desktop it is the fixed corner mark */}
        {!desktop && <SignatureCredit />}
      </footer>
    </section>
  );
}

function WordmarkFallback({ size }: { size: number }) {
  return (
    <span
      className="name-face absolute inset-0 flex items-center justify-center whitespace-nowrap"
      style={{ fontSize: size * 0.82, fontWeight: 300 }}
    >
      {wedding.displayName}
    </span>
  );
}
