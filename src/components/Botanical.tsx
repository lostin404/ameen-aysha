import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const LEAF = "M0 0 C 9 -11, 30 -12, 40 0 C 30 12, 9 11, 0 0 Z";

/** Point and tangent angle on a quadratic bezier. */
function quad(t: number, p0: number[], p1: number[], p2: number[]) {
  const u = 1 - t;
  const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0];
  const y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
  const dx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
  const dy = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

type BranchProps = {
  className?: string;
  style?: CSSProperties;
  leaves?: number;
  /** Disable the gentle sway. */
  still?: boolean;
  tone?: "sage" | "soft";
};

/**
 * Original eucalyptus-style branch, drawn procedurally so it stays crisp at
 * any size. Grows from the bottom-left of its box toward the top-right.
 */
export function Branch({ className, style, leaves = 9, still, tone = "sage" }: BranchProps) {
  const p0 = [8, 232];
  const p1 = [70, 120];
  const p2 = [206, 30];
  const items = Array.from({ length: leaves }, (_, i) => {
    const t = 0.16 + (i / (leaves - 1)) * 0.84;
    const { x, y, angle } = quad(t, p0, p1, p2);
    const side = i % 2 === 0 ? -1 : 1;
    const size = 1.05 - t * 0.42 + (i % 3) * 0.05;
    return { x, y, rot: angle + side * (52 - t * 10), size, i };
  });
  const tip = quad(1, p0, p1, p2);
  const main = tone === "sage" ? "#557F65" : "#A8B9A8";
  const alt = tone === "sage" ? "#A8B9A8" : "#C9D4C9";
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
      className={cn("pointer-events-none select-none", !still && "sway", className)}
      style={style}
    >
      <path
        d={`M${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`}
        stroke="#557F65"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.75"
      />
      {items.map((l) => (
        <g key={l.i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot}) scale(${l.size})`}>
          <path
            d={LEAF}
            fill={l.i % 3 === 1 ? alt : main}
            opacity={l.i % 3 === 1 ? 0.85 : 0.9 - (l.i % 2) * 0.18}
          />
          <path d="M2 0 L 36 0" stroke="#F8F7F3" strokeWidth="0.6" opacity="0.55" />
        </g>
      ))}
      <g transform={`translate(${tip.x} ${tip.y}) rotate(${tip.angle}) scale(0.62)`}>
        <path d={LEAF} fill={main} opacity="0.9" />
      </g>
    </svg>
  );
}

/** A thin sprig used as a divider ornament. */
export function Sprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 24" fill="none" aria-hidden="true" className={cn("pointer-events-none", className)}>
      <path d="M2 12 H46 M74 12 H118" stroke="#557F65" strokeWidth="1" opacity="0.5" />
      <path d="M60 4 C 54 8, 54 16, 60 20 C 66 16, 66 8, 60 4 Z" fill="#557F65" opacity="0.85" />
      <path d="M50 12 C 52 8, 56 8, 58 12 C 56 16, 52 16, 50 12 Z" fill="#A8B9A8" />
      <path d="M62 12 C 64 8, 68 8, 70 12 C 68 16, 64 16, 62 12 Z" fill="#A8B9A8" />
    </svg>
  );
}

/** A&A monogram in a fine champagne ring. */
export function Monogram({ className, size = 64 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-champagne font-serif text-forest",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.34, letterSpacing: "-0.02em" }}
      aria-label="A and A monogram"
      role="img"
    >
      A
      <span className="mx-[0.06em] font-script text-sage" style={{ fontSize: "1.1em" }}>
        &amp;
      </span>
      A
    </span>
  );
}
