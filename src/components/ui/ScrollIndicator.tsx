"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScrollIndicatorProps {
  onScrollClick?: () => void;
}

export default function ScrollIndicator({ onScrollClick }: ScrollIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
      onClick={onScrollClick}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 cursor-pointer group"
    >
      <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-white/50 group-hover:text-brand-orange transition-colors duration-300">
        Scroll to Explore
      </span>

      {/* Mouse Outer Capsule */}
      <div className="w-5 h-9 rounded-full border border-white/20 group-hover:border-brand-orange/60 transition-colors duration-300 flex justify-center p-1 backdrop-blur-sm bg-black/20 shadow-lg">
        {/* Animated Inner Scroll Wheel Dot */}
        <motion.div
          animate={{
            y: [0, 12, 0],
            opacity: [1, 0.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-1 h-2 rounded-full bg-brand-orange shadow-[0_0_8px_#FF6B00]"
        />
      </div>
    </motion.div>
  );
}
