"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Destination } from "./destinationsData";
import { Clock, MapPin, Users, ArrowRight, ShieldCheck } from "lucide-react";

interface RouteDetailsPanelProps {
  activeDestination: Destination;
}

export default function RouteDetailsPanel({
  activeDestination,
}: RouteDetailsPanelProps) {
  return (
    <div className="w-full my-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDestination.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="p-5 md:p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative overflow-hidden"
        >
          {/* Subtle Ambient Accent Flare */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/10 blur-3xl rounded-full pointer-events-none" />

          {/* Header Tag */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-[10px] font-mono font-bold uppercase tracking-widest">
              ACTIVE ROUTE FROM RAJAHMUNDRY
            </span>
            <span className="text-xs font-mono text-white/50">
              {activeDestination.state} Region
            </span>
          </div>

          {/* Destination Title & Price */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
            <h3 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
              {activeDestination.name}
            </h3>
            <div className="text-right">
              <span className="text-[11px] text-white/50 block font-mono">STARTS FROM</span>
              <span className="text-xl font-bold font-display text-brand-orange">
                ₹{activeDestination.price4Seater.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs md:text-sm text-white/70 leading-relaxed mb-5 font-sans">
            {activeDestination.description}
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-orange/10 text-brand-orange">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-white/50">Distance</div>
                <div className="text-sm font-semibold text-white">
                  {activeDestination.distanceKm > 0 ? `${activeDestination.distanceKm} km` : "HQ Hub"}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-orange/10 text-brand-orange">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-white/50">Est. Travel Time</div>
                <div className="text-sm font-semibold text-white">
                  {activeDestination.estimatedTime}
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Availability & CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-white/80">
                <Users className="w-3.5 h-3.5 text-brand-orange" />
                <span>4 Seater</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/80">
                <Users className="w-3.5 h-3.5 text-brand-orange" />
                <span>7 Seater</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Available 24x7</span>
              </div>
            </div>

            <a
              href="#booking"
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber text-white font-semibold text-xs md:text-sm tracking-wide shadow-[0_8px_25px_rgba(255,107,0,0.4)] hover:shadow-[0_12px_35px_rgba(255,107,0,0.6)] transition-all duration-300 w-full sm:w-auto"
            >
              Book Ride to {activeDestination.name.split(" ")[0]}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
