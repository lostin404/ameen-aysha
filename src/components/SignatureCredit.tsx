import { Signature } from "@/components/ui/signature";
import { wedding } from "@/config/wedding";
import { cn } from "@/lib/utils";

/**
 * Small creator mark, drawn once with the Signature handwriting effect when it
 * first scrolls into view. Allura carries a real underscore glyph, so the text
 * is exactly `lostin__404`; if the font cannot load the component falls back
 * to the same text set in the script face.
 */
export function SignatureCredit({ fixed = false, className }: { fixed?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none select-none opacity-55",
        fixed && "fixed bottom-2 right-4 z-30",
        className,
      )}
    >
      <Signature
        text={wedding.credit}
        fontUrl={`${import.meta.env.BASE_URL}fonts/Allura-Regular.ttf`}
        color="#557F65"
        fontSize={fixed ? 19 : 17}
        duration={0.7}
        delay={0.2}
        inView
        once
      />
    </div>
  );
}
