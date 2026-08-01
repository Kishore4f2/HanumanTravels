"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Car } from "lucide-react";
import SpotlightButton from "../ui/SpotlightButton";

interface HeroTextTimelineProps {
  triggerTimeline: boolean; // Triggered when canvas reaches final frame 300
}

export default function HeroTextTimeline({ triggerTimeline }: HeroTextTimelineProps) {
  const [step, setStep] = useState<number>(0);

  // Staggered reveal timeline triggered after canvas reaches final frame 300
  useEffect(() => {
    if (!triggerTimeline) return;

    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setStep(1), 150)); // Brand Title & Route
    timers.push(setTimeout(() => setStep(2), 450)); // Action Buttons

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [triggerTimeline]);

  const easeLuxury = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-end items-center overflow-hidden pb-12 sm:pb-16">
      
      {/* Readability Scrim Overlay at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[45vh] bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-10" />

      {/* Main Centered Content Container (positioned below the car) */}
      <div className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center text-center px-6 pointer-events-auto">
        <AnimatePresence>
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: easeLuxury }}
              className="flex flex-col items-center gap-4 mb-6"
            >
              {/* Brand Title: Centered and positioned below the car */}
              <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.16em] uppercase text-white select-none drop-shadow-[0_12px_35px_rgba(0,0,0,0.95)]">
                HANUMAN TRAVELS
              </h1>

              {/* Service Route: Clean borderless typography that merges with the layout */}
              <div className="inline-flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold tracking-[0.15em] text-white/90 uppercase drop-shadow-md">
                <span>Rajahmundry</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse shadow-[0_0_8px_#FF6B00]" />
                <span>Anywhere in Andhra Pradesh &amp; Telangana</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easeLuxury }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              {/* Primary Button */}
              <SpotlightButton
                variant="primary"
                onClick={() => {
                  const el = document.getElementById("booking");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto !py-3.5 !px-8"
              >
                <span>Book Your Ride</span>
                <ChevronRight className="w-4 h-4" />
              </SpotlightButton>

              {/* Secondary Button */}
              <SpotlightButton
                variant="secondary"
                onClick={() => {
                  const el = document.getElementById("fleet");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto !py-3.5 !px-8"
              >
                <Car className="w-4 h-4 text-brand-orange" />
                <span>Explore Our Fleet</span>
              </SpotlightButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
