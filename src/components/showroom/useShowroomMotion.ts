"use client";

import { useMemo } from "react";

// Standard luxury easing curve matching Hero & WhyChooseUs sections
export const easeLuxury = [0.16, 1, 0.3, 1] as const;

export const studioTransitionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: easeLuxury,
    },
  },
};

export const specCardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.15,
      ease: easeLuxury,
    },
  }),
};
