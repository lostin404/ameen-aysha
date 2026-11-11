import { lazy, Suspense, useState } from "react";
import { hasWebGL2, useFinePointer, useReducedMotion } from "@/hooks/useMedia";

const GlowCursor = lazy(() => import("@/components/reactbits/GlowCursor"));

/**
 * Site-wide React Bits Glow Cursor. It is a fixed, click-through layer: the
 * normal cursor stays visible and nothing underneath loses pointer events.
 * It is not mounted at all on touch-only devices or under reduced motion.
 */
export function GlowCursorLayer() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [gl] = useState(hasWebGL2);
  if (!fine || reduced || !gl) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-20" aria-hidden="true">
      <Suspense fallback={null}>
        <GlowCursor
          color="#557F65"
          secondaryColor="#C4B58A"
          theme="light"
          intensity={0.55}
          trailWidth={0.9}
          linger={0.45}
          glow={0.7}
          hotspot={0.25}
          followSpeed={0.5}
          grain={0}
          clickBurst
          quality="low"
          maxDevicePixelRatio={1}
          className="pointer-events-none"
        />
      </Suspense>
    </div>
  );
}
