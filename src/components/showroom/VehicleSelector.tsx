"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, ShieldCheck } from "lucide-react";
import { easeLuxury } from "./useShowroomMotion";

export type VehicleVariant = "4-seater" | "7-seater";

interface VehicleSelectorProps {
  selected: VehicleVariant;
  onSelect: (variant: VehicleVariant) => void;
}

export default function VehicleSelector({
  selected,
  onSelect,
}: VehicleSelectorProps) {
  return (
    <div className="flex items-center justify-center gap-3 my-6 z-30 relative">
      <div className="p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-2xl flex items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        {/* 4 Seater Option */}
        <button
          type="button"
          onClick={() => onSelect("4-seater")}
          className={`relative px-5 py-2.5 rounded-full text-xs md:text-sm font-medium tracking-wide transition-all duration-300 flex items-center gap-2 ${
            selected === "4-seater"
              ? "text-white font-semibold"
              : "text-white/60 hover:text-white"
          }`}
          aria-pressed={selected === "4-seater"}
        >
          {selected === "4-seater" && (
            <motion.div
              layoutId="selector-glow"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber shadow-[0_0_20px_rgba(255,107,0,0.5)]"
              transition={{ duration: 0.4, ease: easeLuxury }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Users className="w-4 h-4" />
            4 Seater Executive
          </span>
        </button>

        {/* 7 Seater Option */}
        <button
          type="button"
          onClick={() => onSelect("7-seater")}
          className={`relative px-5 py-2.5 rounded-full text-xs md:text-sm font-medium tracking-wide transition-all duration-300 flex items-center gap-2 ${
            selected === "7-seater"
              ? "text-white font-semibold"
              : "text-white/60 hover:text-white"
          }`}
          aria-pressed={selected === "7-seater"}
        >
          {selected === "7-seater" && (
            <motion.div
              layoutId="selector-glow"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber shadow-[0_0_20px_rgba(255,107,0,0.5)]"
              transition={{ duration: 0.4, ease: easeLuxury }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Users className="w-4 h-4" />
            7 Seater Luxury
          </span>
        </button>
      </div>
    </div>
  );
}
