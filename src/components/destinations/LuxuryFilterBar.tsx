"use client";

import React from "react";
import { motion } from "framer-motion";

export type FilterCategory = "All" | "AP" | "Telangana" | "Popular";

interface LuxuryFilterBarProps {
  selectedCategory: FilterCategory;
  onSelectCategory: (cat: FilterCategory) => void;
}

const CATEGORIES: { label: string; value: FilterCategory }[] = [
  { label: "All Routes", value: "All" },
  { label: "Andhra Pradesh", value: "AP" },
  { label: "Telangana", value: "Telangana" },
  { label: "Popular", value: "Popular" },
];

export default function LuxuryFilterBar({
  selectedCategory,
  onSelectCategory,
}: LuxuryFilterBarProps) {
  return (
    <div className="w-full flex justify-center py-2 my-2">
      <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => onSelectCategory(cat.value)}
              className={`relative px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-300 ${
                isActive ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="filter-bar-glow"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber shadow-[0_0_20px_rgba(255,107,0,0.5)]"
                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
