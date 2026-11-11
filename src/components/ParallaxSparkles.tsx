import { useEffect, useMemo, useRef } from "react";
import { useIsDesktop } from "@/hooks/useMedia";

/** Small deterministic PRNG so the sparkle field is identical on every render. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const FIELD = 900; // px — the drift loop distance

function shadows(count: number, seed: number, colors: string[], glow: number) {
  const rnd = seeded(seed);
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.round(rnd() * 2000);
    const y = Math.round(rnd() * FIELD);
    const c = colors[Math.floor(rnd() * colors.length)];
    // each dot twice, one field apart, so the upward drift loops seamlessly
    out.push(`${x}px ${y}px ${glow}px ${c}`, `${x}px ${y + FIELD}px ${glow}px ${c}`);
  }
  return out.join(",");
}

/**
 * The "parallax stars" idea re-cut as wedding sparkles: three sparse layers of
 * tiny champagne / pale-sage / warm-white dots at different sizes and speeds.
 * They drift slowly, shift at different rates on scroll, and never flash.
 */
export function ParallaxSparkles() {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();

  const layers = useMemo(() => {
    const k = desktop ? 1 : 0.5;
    return [
      { size: 2, speed: 150, depth: 0.05, sh: shadows(Math.round(46 * k), 11, ["#C4B58A", "#B9C7B9", "#D9CFAE"], 0) },
      { size: 3, speed: 105, depth: 0.11, sh: shadows(Math.round(24 * k), 29, ["#C4B58A", "#A8B9A8", "#E3DAB9"], 1) },
      { size: 4, speed: 70, depth: 0.2, sh: shadows(Math.round(11 * k), 53, ["#C4B58A", "#FFFDF4"], 5) },
    ];
  }, [desktop]);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]"));
    let raf = 0;
    let visible = false;
    const update = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      nodes.forEach((n) => {
        n.style.transform = `translate3d(0, ${(-offset * Number(n.dataset.depth)).toFixed(1)}px, 0)`;
      });
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      // pause the drift while the section is off-screen
      root.style.setProperty("--sparkle-state", visible ? "running" : "paused");
      onScroll();
    });
    io.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [layers]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {layers.map((l, i) => (
        <div key={i} data-depth={l.depth} className="absolute inset-0 will-change-transform">
          <div
            className="sparkle-layer absolute left-0 top-0 rounded-full"
            style={{
              width: l.size,
              height: l.size,
              background: "transparent",
              boxShadow: l.sh,
              animation: `sparkle-drift ${l.speed}s linear infinite`,
              animationPlayState: "var(--sparkle-state, running)" as never,
            }}
          />
        </div>
      ))}
    </div>
  );
}
