import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ParallaxSparkles } from "@/components/ParallaxSparkles";
import { Reveal } from "@/components/Reveal";
import { Sprig } from "@/components/Botanical";
import { EASE, wedding } from "@/config/wedding";

const CLEAR_THRESHOLD = 0.45;

function paintFoil(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width: w, height: h } = canvas;
  ctx.globalCompositeOperation = "source-over";
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#D8CCA3");
  g.addColorStop(0.28, "#C4B58A");
  g.addColorStop(0.5, "#ECE4C8");
  g.addColorStop(0.72, "#C4B58A");
  g.addColorStop(1, "#B5A678");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // brushed-foil streaks
  ctx.globalAlpha = 0.08;
  for (let i = -h; i < w; i += Math.max(5, w / 90)) {
    ctx.strokeStyle = i % 2 ? "#fff" : "#8D7F52";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + h, h);
    ctx.stroke();
  }
  // fine speckle
  ctx.globalAlpha = 0.16;
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < (w * h) / 500; i++) {
    ctx.fillStyle = rnd() > 0.5 ? "#fff" : "#9C8E60";
    ctx.fillRect(rnd() * w, rnd() * h, 1.2, 1.2);
  }
  ctx.globalAlpha = 1;

  // inner frame + label
  const pad = Math.round(w * 0.035);
  ctx.strokeStyle = "rgba(255,255,255,.55)";
  ctx.lineWidth = Math.max(1, w / 420);
  ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
  ctx.fillStyle = "rgba(54,92,69,.82)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const size = Math.max(11, w / 30);
  ctx.font = `600 ${size}px Manrope, sans-serif`;
  const label = "SCRATCH HERE";
  // manual letter-spacing for broad browser support
  const gap = size * 0.34;
  const widths = [...label].map((ch) => ctx.measureText(ch).width + gap);
  let x = w / 2 - (widths.reduce((a, b) => a + b, 0) - gap) / 2;
  [...label].forEach((ch, i) => {
    ctx.fillText(ch, x + (widths[i] - gap) / 2, h / 2);
    x += widths[i];
  });
}

export function ScratchReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [gone, setGone] = useState(false);
  const scratched = useRef(false);
  const drawing = useRef<{ x: number; y: number } | null>(null);
  const lastCheck = useRef(0);

  // paint the foil, and keep it sized to the card until the first scratch
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fit = () => {
      if (scratched.current) return;
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      paintFoil(canvas);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => ro.disconnect();
  }, []);

  const clearedFraction = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return 0;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 24) {
      total++;
      if (data[i] < 40) clear++;
    }
    return clear / total;
  }, []);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const k = canvas.width / rect.width;
    return { x: (e.clientX - rect.left) * k, y: (e.clientY - rect.top) * k, k };
  };

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx || !drawing.current) return;
    const p = point(e);
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "#000"; // fully opaque so the foil is removed completely
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 46 * p.k;
    ctx.beginPath();
    ctx.moveTo(drawing.current.x, drawing.current.y);
    ctx.lineTo(p.x + 0.01, p.y + 0.01);
    ctx.stroke();
    drawing.current = { x: p.x, y: p.y };
    scratched.current = true;

    const now = performance.now();
    if (now - lastCheck.current > 220) {
      lastCheck.current = now;
      if (clearedFraction() > CLEAR_THRESHOLD) setRevealed(true);
    }
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealed) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = point(e);
    drawing.current = { x: p.x, y: p.y };
    scratch(e);
  };
  const onUp = () => {
    if (!drawing.current) return;
    drawing.current = null;
    if (clearedFraction() > CLEAR_THRESHOLD) setRevealed(true);
  };

  return (
    <section
      id="save-the-date"
      className="section-pad relative overflow-hidden"
      style={{ background: "linear-gradient(180deg,#F8F7F3 0%,#F1F1F1 50%,#F8F7F3 100%)" }}
    >
      <ParallaxSparkles />

      <div className="wrap relative flex flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow">Scratch to Reveal</p>
        </Reveal>
        <Reveal variant="heading" delay={0.08}>
          <h2 className="heading mt-5">A Little Surprise</h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="body-copy mt-5 text-forest">Scratch to reveal our special date.</p>
        </Reveal>

        <Reveal variant="card" delay={0.2} className="mt-10 w-full max-w-[560px]">
          <div className="paper paper-shadow relative aspect-[5/3] w-full select-none overflow-hidden rounded-md">
            <span className="absolute inset-2.5 rounded-sm border border-champagne/60" aria-hidden="true" />
            {/* the hidden message */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
              <p className="font-script text-sage" style={{ fontSize: "clamp(1.9rem, 8vw, 3rem)", lineHeight: 1 }}>
                Save the Date
              </p>
              <p
                className="numeral mt-3 text-forest"
                style={{ fontSize: "clamp(1.15rem, 5.4vw, 2.15rem)", lineHeight: 1.1, letterSpacing: "0.02em" }}
              >
                14 NOVEMBER 2026
              </p>
              <Sprig className="my-3 w-24" />
              <p className="name-face !font-light" style={{ fontSize: "clamp(1rem, 4.4vw, 1.5rem)" }}>
                {wedding.displayName}
              </p>
            </div>

            {!gone && (
              <motion.canvas
                ref={canvasRef}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full cursor-grab touch-none active:cursor-grabbing"
                animate={{ opacity: revealed ? 0 : 1, scale: revealed ? 1.03 : 1 }}
                transition={{ duration: 0.9, ease: EASE }}
                onAnimationComplete={() => revealed && setGone(true)}
                onPointerDown={onDown}
                onPointerMove={scratch}
                onPointerUp={onUp}
                onPointerCancel={onUp}
                style={{ pointerEvents: revealed ? "none" : "auto" }}
              />
            )}
          </div>
        </Reveal>

        <div className="mt-7 min-h-12" aria-live="polite">
          {revealed ? (
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              {wedding.date.long}
            </motion.p>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={() => setRevealed(true)}>
              Tap to Reveal
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
