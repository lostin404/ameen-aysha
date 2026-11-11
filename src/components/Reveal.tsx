import { motion, type HTMLMotionProps } from "motion/react";
import { EASE } from "@/config/wedding";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  /** "card" adds the slight scale-up used for cards. */
  variant?: "text" | "heading" | "card";
};

/** Scroll-triggered reveal. Fires once and never un-reveals. */
export function Reveal({ delay = 0, variant = "text", children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: variant === "card" ? 0.97 : 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
      transition={{ duration: variant === "heading" ? 0.8 : 0.65, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers its <RevealItem> children when it scrolls into view. */
export function RevealGroup({
  children,
  stagger = 0.1,
  ...rest
}: HTMLMotionProps<"div"> & { stagger?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, ...rest }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 25 },
        show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
