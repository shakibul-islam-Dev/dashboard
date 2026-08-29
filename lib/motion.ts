import type { Variants } from "motion/react";

/* ── Reusable motion variants shared across dashboard pages ──────────────── */

/* Stagger container: child motion.divs with `variants={fadeUp}` animate in sequence */
export const fadeUpStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

/* Fade + slide-up entrance (used per card / row inside a stagger container) */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

/* Soft drop-in entrance (headers, toolbars) */
export const dropDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

/* Small pop used for dropdown menus / popovers */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -6 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.15 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -6,
    transition: { duration: 0.12 },
  },
};

/* Subtle hover lift for cards */
export const cardHover = {
  whileHover: { y: -4 } as const,
  transition: { type: "spring" as const, stiffness: 300, damping: 24 },
};