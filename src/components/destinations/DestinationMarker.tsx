"use client";

import React from "react";
import { motion } from "framer-motion";
import { Destination } from "./destinationsData";

interface DestinationMarkerProps {
  destination: Destination;
  isActive: boolean;
  onSelect: (dest: Destination) => void;
}

export default function DestinationMarker({
  destination,
  isActive,
  onSelect,
}: DestinationMarkerProps) {
  const isHQ = destination.isHQ;

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
      style={{ left: `${destination.vectorX}%`, top: `${destination.vectorY}%` }}
      onClick={() => onSelect(destination)}
      onMouseEnter={() => onSelect(destination)}
    >
      {/* HQ Pulse Rings */}
      {isHQ ? (
        <div className="relative flex items-center justify-center">
          <span className="absolute w-8 h-8 rounded-full bg-brand-orange/40 animate-ping opacity-75" />
          <span className="absolute w-12 h-12 rounded-full border border-brand-orange/30 animate-pulse" />
          <div className="relative w-5 h-5 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber border-2 border-white shadow-[0_0_20px_#FF6B00] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </div>

          {/* HQ Permanent Label */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap">
            <span className="px-2 py-0.5 rounded-full bg-black/90 border border-brand-orange/50 text-[10px] font-mono font-bold text-brand-orange tracking-widest uppercase shadow-[0_0_15px_rgba(255,107,0,0.4)]">
              RAJAHMUNDRY (HQ)
            </span>
          </div>
        </div>
      ) : (
        /* Regular Destination Pins */
        <div className="relative flex items-center justify-center">
          {/* Active Glow Ring */}
          {isActive && (
            <motion.span
              layoutId="active-marker-glow"
              className="absolute w-7 h-7 rounded-full bg-brand-orange/30 border border-brand-orange/60 animate-ping"
            />
          )}

          <div
            className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
              isActive
                ? "bg-brand-orange border-white scale-125 shadow-[0_0_15px_#FF6B00]"
                : "bg-black/80 border-white/60 group-hover:border-brand-orange group-hover:scale-110"
            }`}
          />

          {/* Hover / Active Label */}
          <div
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap transition-all duration-300 pointer-events-none ${
              isActive
                ? "opacity-100 scale-100 -translate-y-0 z-30"
                : "opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0"
            }`}
          >
            <div className="px-2.5 py-1 rounded-lg bg-black/90 border border-white/20 backdrop-blur-md text-[11px] font-semibold text-white shadow-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              {destination.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
