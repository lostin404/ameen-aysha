import { Branch, Sprig } from "@/components/Botanical";
import { RevealGroup, RevealItem } from "@/components/Reveal";

export function BlessingsSection() {
  return (
    <section id="blessings" className="section-pad relative overflow-hidden bg-ivory">
      <Branch
        className="absolute -left-14 bottom-0 w-[190px] lg:w-[320px]"
        style={{ rotate: "8deg", ["--sway-origin" as string]: "0% 100%" }}
      />
      <Branch
        tone="soft"
        className="absolute -right-14 top-4 w-[190px] lg:w-[320px]"
        style={{ transform: "rotate(188deg)" }}
        still
      />
      <RevealGroup className="wrap relative flex max-w-[900px] flex-col items-center text-center" stagger={0.12}>
        <RevealItem>
          <p className="eyebrow">Your Blessings</p>
        </RevealItem>
        <RevealItem>
          <Sprig className="mx-auto mt-7 w-28" />
        </RevealItem>
        <RevealItem>
          <h2 className="heading mt-7" style={{ fontSize: "clamp(2.3rem, 6.6vw, 5rem)" }}>
            Your Presence Is Our{" "}
            <span className="font-script text-sage" style={{ fontSize: "1.2em", lineHeight: 0.9 }}>
              Greatest Gift
            </span>
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="body-copy mx-auto mt-8 max-w-[40ch]">
            Your love, presence, and blessings will make this celebration even more special.
          </p>
        </RevealItem>
        <RevealItem>
          <span className="mt-9 block h-12 w-px bg-champagne" aria-hidden="true" />
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
