"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";

interface AppleLoaderProps {
  progress: number; // 0 to 100
  isLoaded: boolean;
  onStartExperience?: () => void;
}

export default function AppleLoader({ progress, isLoaded, onStartExperience }: AppleLoaderProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  // Smooth counter animation up to the loaded percentage
  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < progress) {
          return Math.min(prev + 1, progress);
        }
        return prev;
      });
    }, 15);

    return () => clearInterval(timer);
  }, [progress]);

  useEffect(() => {
    if (displayProgress >= 100 && isLoaded && onStartExperience) {
      const timeout = setTimeout(() => {
        onStartExperience();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [displayProgress, isLoaded, onStartExperience]);

  return (
    <AnimatePresence>
      {(!isLoaded || displayProgress < 100) && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } }}
          className="fixed inset-0 z-[10000] bg-[#020203] flex flex-col items-center justify-center px-6 selection:bg-none"
        >
          {/* Subtle Ambient Background Radial Glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-brand-orange/20 via-amber-500/10 to-transparent blur-[120px] pointer-events-none animate-glow-pulse" />

          {/* Luxury Logo Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex flex-col items-center gap-4 text-center z-10"
          >
            {/* Animated Crest Icon */}
            <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-2xl shadow-[0_0_50px_rgba(255,107,0,0.25)]">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-orange/30 via-transparent to-white/5 opacity-50" />
              <Sparkles className="w-10 h-10 text-brand-orange animate-pulse" />
            </div>

            {/* Brand Title */}
            <div className="flex flex-col items-center gap-1 mt-2">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-[0.25em] text-white uppercase drop-shadow-md">
                HANUMAN TRAVELS
              </h1>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-white/50 font-medium">
                Every Journey Begins Here
              </span>
            </div>
          </motion.div>

          {/* Thin Glowing Loading Line Container */}
          <div className="w-full max-w-xs sm:max-w-md mt-12 flex flex-col items-center gap-3 z-10">
            <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative backdrop-blur-sm">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF6B00] via-[#FF9E43] to-white shadow-[0_0_15px_#FF6B00]"
                style={{ width: `${displayProgress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Percentage & Status Text */}
            <div className="w-full flex items-center justify-between text-[11px] font-mono tracking-widest text-white/40">
              <span className="flex items-center gap-1.5 text-white/50">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
                <span>PRELOADING CINEMATIC ENGINE</span>
              </span>
              <span className="text-white/80 font-bold">{Math.round(displayProgress)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
