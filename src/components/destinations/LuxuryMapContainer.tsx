"use client";

import React, { useState } from "react";
import { Destination } from "./destinationsData";
import LuxuryFilterBar, { FilterCategory } from "./LuxuryFilterBar";
import { Navigation } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically load RealLuxuryMap to prevent SSR hydration errors
const RealLuxuryMap = dynamic(() => import("./RealLuxuryMap"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#030305] z-10">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
        <span className="text-xs font-mono tracking-widest text-white/50 uppercase">
          Initializing Real Map System...
        </span>
      </div>
    </div>
  ),
});

interface LuxuryMapContainerProps {
  activeDestination: Destination;
  onSelectDestination: (dest: Destination) => void;
  selectedCategory: FilterCategory;
  onSelectCategory: (cat: FilterCategory) => void;
}

export default function LuxuryMapContainer({
  activeDestination,
  onSelectDestination,
  selectedCategory,
  onSelectCategory,
}: LuxuryMapContainerProps) {
  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[620px] rounded-[36px] overflow-hidden border border-white/10 bg-[#050507] shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(255,107,0,0.1)] group flex flex-col justify-between p-4 md:p-6 select-none">
      {/* Top Bar Overlay: Navigation indicator */}
      <div className="relative z-30 w-full flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/85 border border-white/10 backdrop-blur-xl text-[11px] font-mono text-white/80 shadow-md">
          <Navigation className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
          <span>AP & TELANGANA REAL NAVIGATION NETWORK</span>
        </div>
      </div>

      {/* Real Interactive Leaflet Map Instance */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <RealLuxuryMap
          activeDestination={activeDestination}
          onSelectDestination={onSelectDestination}
          selectedCategory={selectedCategory}
        />
      </div>

      {/* Bottom Filter Controls Overlay */}
      <div className="relative z-30 w-full mt-auto">
        <LuxuryFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </div>

      {/* Soft Ambient reflections & lighting overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030304]/80 via-transparent to-transparent opacity-30 pointer-events-none z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.45)_100%)] pointer-events-none z-20" />
    </div>
  );
}
