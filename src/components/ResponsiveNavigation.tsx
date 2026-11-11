import { motion } from "motion/react";
import StaggeredMenu, { type StaggeredMenuItem } from "@/components/reactbits/StaggeredMenu";
import { EASE } from "@/config/wedding";

const menuItems: StaggeredMenuItem[] = [
  { label: "Home", ariaLabel: "Go to the top of the invitation", link: "#home" },
  { label: "Invitation", ariaLabel: "Go to the invitation message", link: "#invitation" },
  { label: "Save the Date", ariaLabel: "Go to the scratch and reveal date", link: "#save-the-date" },
  { label: "Countdown", ariaLabel: "Go to the wedding countdown", link: "#countdown" },
  { label: "Venue", ariaLabel: "Go to the venue", link: "#venue" },
  { label: "Share", ariaLabel: "Go to sharing options", link: "#share" },
];

const Logo = (
  <a
    href="#home"
    aria-label="Ameen and Aysha — back to top"
    className="inline-flex items-center rounded-full border border-sage/35 bg-ivory/90 px-4 py-[0.62rem] font-serif text-[1.05rem] font-semibold leading-none text-forest shadow-[0_8px_26px_-16px_rgb(54_92_69/.6)] backdrop-blur-md"
  >
    A<span className="mx-[0.3em] font-script text-[1.15em] font-normal text-sage">&amp;</span>A
  </a>
);

/** GSAP StaggeredMenu: sage → champagne → ivory panels sliding in from the right. */
export function ResponsiveNavigation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
    >
      <StaggeredMenu
        position="right"
        isFixed
        items={menuItems}
        socialItems={[]}
        displaySocials={false}
        displayItemNumbering
        // the component draws these as the two leading layers; the ivory panel follows them
        colors={["#A8B9A8", "#C4B58A"]}
        accentColor="#557F65"
        menuButtonColor="#365C45"
        openMenuButtonColor="#365C45"
        changeMenuColorOnOpen
        closeOnClickAway
        logo={Logo}
      />
    </motion.div>
  );
}
