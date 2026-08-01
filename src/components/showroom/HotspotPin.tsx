"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { easeLuxury } from "./useShowroomMotion";

export interface Hotspot {
  id: string;
  title: string;
  description: string;
  xPct: number; // percentage from left
  yPct: number; // percentage from top
  category?: string;
}

interface HotspotPinProps {
  hotspot: Hotspot;
}

export default function HotspotPin({ hotspot }: HotspotPinProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${hotspot.xPct}%`, top: `${hotspot.yPct}%` }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
      tabIndex={0}
      aria-label={`Feature hotspot: ${hotspot.title}`}
    >
      {/* Pulse Outer Ring */}
      <button
        type="button"
        className="relative group flex items-center justify-center w-8 h-8 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="absolute inset-0 rounded-full bg-brand-orange/40 animate-ping opacity-75" />
        <span className="relative w-4 h-4 rounded-full bg-brand-orange border-2 border-white shadow-[0_0_15px_#FF6B00] group-hover:scale-125 transition-transform duration-300" />
      </button>

      {/* Tooltip Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.3, ease: easeLuxury }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-4 rounded-2xl bg-black/80 border border-brand-orange/30 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(255,107,0,0.15)] text-left pointer-events-none"
          >
            {hotspot.category && (
              <span className="text-[10px] uppercase tracking-widest font-mono text-brand-orange/80 block mb-1">
                {hotspot.category}
              </span>
            )}
            <h4 className="text-xs font-semibold text-white tracking-wide mb-1 font-display">
              {hotspot.title}
            </h4>
            <p className="text-[11px] text-white/70 leading-relaxed">
              {hotspot.description}
            </p>

            {/* Downward Pointer */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
