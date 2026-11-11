import { FlippingWordSwap } from "@/components/ui/flipping-word-swap";
import { Branch, Sprig } from "@/components/Botanical";
import { Reveal } from "@/components/Reveal";

export function InvitationMessage() {
  return (
    <section id="invitation" className="section-pad relative overflow-hidden bg-ivory">
      <Branch
        tone="soft"
        className="absolute -right-20 -top-10 w-[170px] opacity-70 lg:-right-10 lg:-top-16 lg:w-[300px]"
        style={{ transform: "rotate(170deg)" }}
        still
      />
      <Branch
        className="absolute -bottom-10 -right-12 w-[200px] lg:w-[300px]"
        style={{ rotate: "-24deg", ["--sway-origin" as string]: "100% 100%" }}
      />

      <div className="wrap relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow">The Invitation</p>
          </Reveal>
          <Reveal variant="heading" delay={0.08}>
            <h2 className="heading mt-5">
              A Beautiful{" "}
              <em className="font-script not-italic text-sage" style={{ fontSize: "1.25em", lineHeight: 0.8 }}>
                Beginning
              </em>
            </h2>
          </Reveal>

          {/* decorative word swap — reacts to hover, focus and tap */}
          <Reveal delay={0.2} className="mt-10 flex items-center gap-4">
            <span className="h-px w-10 bg-champagne" aria-hidden="true" />
            <FlippingWordSwap
              word1="FOREVER"
              word2="TOGETHER"
              duration={400}
              stagger={44}
              className="name-face !font-[350] text-forest"
              toClassName="text-sage"
              style={{ fontSize: "clamp(1.7rem, 7vw, 3.2rem)", lineHeight: 1.15, letterSpacing: "0.04em" }}
            />
          </Reveal>
          <Reveal delay={0.28}>
            <p className="mt-3 pl-14 font-sans text-[0.68rem] font-medium uppercase tracking-[0.22em] text-sage">
              <span className="hidden [@media(hover:hover)]:inline">Hover the word</span>
              <span className="[@media(hover:hover)]:hidden">Tap the word</span>
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal variant="card" delay={0.12}>
            <div className="paper paper-shadow relative rounded-sm px-7 py-10 sm:px-12 sm:py-14">
              <span className="absolute inset-3 rounded-sm border border-champagne/50" aria-hidden="true" />
              <Sprig className="mx-auto mb-7 w-28" />
              <p className="body-copy text-center">
                With love and happiness in our hearts, we warmly invite you to celebrate the wedding of Ameen and
                Aysha.
              </p>
              <p className="body-copy mt-6 text-center">
                Your presence and blessings will make our special day even more memorable.
              </p>
              <Sprig className="mx-auto mt-7 w-28 rotate-180" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
