import { useCallback, useState } from "react";
import { GlowCursorLayer } from "@/components/GlowCursorLayer";
import { ResponsiveNavigation } from "@/components/ResponsiveNavigation";
import { SignatureCredit } from "@/components/SignatureCredit";
import { useIsDesktop } from "@/hooks/useMedia";
import { BlessingsSection } from "@/sections/BlessingsSection";
import { InvitationLetter } from "@/sections/InvitationLetter";
import { InvitationMessage } from "@/sections/InvitationMessage";
import { InvitationOpening } from "@/sections/InvitationOpening";
import { RibbonTransition } from "@/sections/RibbonTransition";
import { ScratchReveal } from "@/sections/ScratchReveal";
import { ShareSection } from "@/sections/ShareSection";
import { VenueSection } from "@/sections/VenueSection";
import { WeddingClosing } from "@/sections/WeddingClosing";
import { WeddingCountdown } from "@/sections/WeddingCountdown";
import { WeddingEvent } from "@/sections/WeddingEvent";
import { WeddingHero } from "@/sections/WeddingHero";

export default function App() {
  /** `revealed`: the hero starts animating in. `done`: the envelope has left. */
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const desktop = useIsDesktop();

  const onReveal = useCallback(() => setRevealed(true), []);
  const onDone = useCallback(() => setDone(true), []);

  return (
    <>
      {!done && <InvitationOpening onReveal={onReveal} onDone={onDone} />}

      {/* the page stays out of reach of keyboard and screen readers until the envelope is opened or skipped */}
      <div inert={!revealed}>
        {revealed && <ResponsiveNavigation />}
        <main>
          <WeddingHero opened={revealed} />
          <InvitationMessage />
          <RibbonTransition />
          <ScratchReveal />
          <InvitationLetter />
          <WeddingEvent />
          <WeddingCountdown />
          <VenueSection />
          <BlessingsSection />
          <ShareSection />
          <WeddingClosing />
        </main>
      </div>

      {done && <GlowCursorLayer />}
      {done && desktop && <SignatureCredit fixed />}
    </>
  );
}
