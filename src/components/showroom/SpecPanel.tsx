"use client";

import React from "react";
import { motion } from "framer-motion";
import { specCardVariants } from "./useShowroomMotion";

export interface SpecItem {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
}

interface SpecPanelProps {
  specs: SpecItem[];
}

export default function SpecPanel({ specs }: SpecPanelProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-5xl mx-auto my-6 px-4">
      {specs.map((spec, index) => (
        <motion.div
          key={spec.label}
          custom={index}
          variants={specCardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="group relative p-4 md:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-brand-orange/40 backdrop-blur-xl transition-colors duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Subtle Ambient Hover Glow */}
          <div className="absolute -inset-px bg-gradient-to-br from-brand-orange/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

          <div className="relative z-10 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-brand-orange/10 border border-brand-orange/20 text-brand-orange group-hover:scale-110 transition-transform duration-300">
              {spec.icon}
            </div>
            <div>
              <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/50">
                {spec.label}
              </div>
              <div className="text-base md:text-lg font-bold font-display text-white mt-0.5 tracking-tight">
                {spec.value}
              </div>
              {spec.subtext && (
                <div className="text-[11px] text-brand-orange/90 font-medium mt-0.5">
                  {spec.subtext}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
