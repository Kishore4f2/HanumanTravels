"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Users,
  Wind,
  Zap,
  Navigation,
  Music,
  ShieldCheck,
  Luggage,
  Sparkles,
  ArrowRight,
  Gauge,
} from "lucide-react";
import VehicleCanvasPlayer from "./VehicleCanvasPlayer";

export type VehicleType = "4-seater" | "7-seater";

interface SpecData {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
}

const specs4Seater: SpecData[] = [
  { id: "seats", label: "Seats", value: "4 Passengers", icon: <Users className="w-4 h-4" /> },
  { id: "ac", label: "Air Conditioning", value: "Dual Zone AC", icon: <Wind className="w-4 h-4" /> },
  { id: "charging", label: "Phone Charging", value: "Fast USB Ports", icon: <Zap className="w-4 h-4" /> },
  { id: "gps", label: "GPS Tracking", value: "Real-time Live", icon: <Navigation className="w-4 h-4" /> },
  { id: "music", label: "Music System", value: "Premium Bluetooth", icon: <Music className="w-4 h-4" /> },
  { id: "driver", label: "Professional Driver", value: "Verified Chauffeur", icon: <ShieldCheck className="w-4 h-4" /> },
  { id: "luggage", label: "Luggage Space", value: "3 Large Bags", icon: <Luggage className="w-4 h-4" /> },
  { id: "comfort", label: "Comfort Level", value: "Executive Reclining", icon: <Gauge className="w-4 h-4" /> },
];

const specs7Seater: SpecData[] = [
  { id: "seats", label: "Seats", value: "7 Passengers", icon: <Users className="w-4 h-4" /> },
  { id: "ac", label: "Air Conditioning", value: "Tri-Zone Climate", icon: <Wind className="w-4 h-4" /> },
  { id: "charging", label: "Phone Charging", value: "All-Row Ports", icon: <Zap className="w-4 h-4" /> },
  { id: "gps", label: "GPS Tracking", value: "Fleet Telematics", icon: <Navigation className="w-4 h-4" /> },
  { id: "music", label: "Music System", value: "Surround Sound", icon: <Music className="w-4 h-4" /> },
  { id: "driver", label: "Professional Driver", value: "Senior Highway Captain", icon: <ShieldCheck className="w-4 h-4" /> },
  { id: "luggage", label: "Luggage Space", value: "5+ Heavy Suitcases", icon: <Luggage className="w-4 h-4" /> },
  { id: "comfort", label: "Comfort Level", value: "Ultra Lounge Seating", icon: <Gauge className="w-4 h-4" /> },
];

const transitionSpring = {
  type: "spring",
  stiffness: 140,
  damping: 22,
  mass: 1,
} as const;

export default function ChooseYourRide() {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>("4-seater");
  const [hasInteracted7Seater, setHasInteracted7Seater] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { margin: "-100px 0px" });

  const handleSelectVehicle = (v: VehicleType) => {
    if (v === "7-seater" && !hasInteracted7Seater) {
      setHasInteracted7Seater(true);
    }
    setSelectedVehicle(v);
  };

  const is4Seater = selectedVehicle === "4-seater";
  const currentSpecs = is4Seater ? specs4Seater : specs7Seater;

  return (
    <section
      id="choose-your-ride"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#030304] text-white py-16 md:py-24 px-4 md:px-8 lg:px-12 overflow-hidden select-none"
    >
      {/* Background Soft Orange Ambient Lighting & Floating Particles */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.08)_0%,transparent_70%)] blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(15,15,17,0.8)_0%,rgba(3,3,4,1)_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(255,107,0,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            PREMIUM VEHICLE SELECTION
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.1] mb-4">
            Designed Around <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-orange via-brand-amber to-white bg-clip-text text-transparent">
              Your Journey.
            </span>
          </h2>

          <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans max-w-2xl mx-auto">
            Choose between our premium 4-seater and spacious 7-seater vehicles, both maintained to the highest standards of safety, cleanliness and comfort for every journey across Andhra Pradesh and Telangana.
          </p>
        </motion.div>

        {/* Vehicle Selector (Top Centre Segmented Control) */}
        <div className="flex justify-center mb-10 md:mb-14">
          <div className="p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-2xl flex items-center gap-2 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            <button
              type="button"
              onClick={() => handleSelectVehicle("4-seater")}
              className={`relative px-6 py-3 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-colors duration-300 flex items-center gap-2 ${
                is4Seater ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {is4Seater && (
                <motion.div
                  layoutId="vehicle-selector-glow"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber shadow-[0_0_25px_rgba(255,107,0,0.6)]"
                  transition={transitionSpring}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Users className="w-4 h-4" />
                4 Seater
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectVehicle("7-seater")}
              className={`relative px-6 py-3 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-colors duration-300 flex items-center gap-2 ${
                !is4Seater ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {!is4Seater && (
                <motion.div
                  layoutId="vehicle-selector-glow"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber shadow-[0_0_25px_rgba(255,107,0,0.6)]"
                  transition={transitionSpring}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Users className="w-4 h-4" />
                7 Seater
              </span>
            </button>
          </div>
        </div>

        {/* Main Morphing Layout Container (FLIP Animation between 4-seater and 7-seater) */}
        <motion.div
          layout
          transition={transitionSpring}
          className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 w-full ${
            is4Seater ? "lg:flex-row" : "lg:flex-row-reverse"
          }`}
        >
          {/* VIDEO CONTAINER COLUMN (55% width on desktop) */}
          <motion.div
            layout
            transition={transitionSpring}
            className="w-full lg:w-[55%] flex-shrink-0"
          >
            <div className="relative w-full aspect-[16/10] min-h-[300px] md:min-h-[420px] rounded-[36px] overflow-hidden border border-white/10 bg-[#050507] shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(255,107,0,0.1)] group">
              {/* Top ambient highlight flare */}
              <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-brand-orange/15 to-transparent pointer-events-none z-10" />

              {/* Player A: 4-Seater Image Sequence */}
              <div
                className={`absolute inset-0 transition-opacity duration-700 ${
                  is4Seater ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <VehicleCanvasPlayer
                  folderPath="/4-seater"
                  frameCount={300}
                  isActive={is4Seater && isInView}
                  shouldPreload={isInView}
                />
              </div>

              {/* Player B: 7-Seater Image Sequence */}
              <div
                className={`absolute inset-0 transition-opacity duration-700 ${
                  !is4Seater ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <VehicleCanvasPlayer
                  folderPath="/7-seater"
                  frameCount={300}
                  isActive={!is4Seater && isInView}
                  shouldPreload={hasInteracted7Seater || (!is4Seater && isInView)}
                />
              </div>

              {/* Bottom luxury reflection vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030304] via-transparent to-transparent opacity-50 pointer-events-none z-20" />
            </div>
          </motion.div>

          {/* CONTENT COLUMN (45% width on desktop) */}
          <motion.div
            layout
            transition={transitionSpring}
            className="w-full lg:w-[45%] flex flex-col justify-center text-left"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedVehicle}
                initial={{ opacity: 0, x: is4Seater ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: is4Seater ? -20 : 20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {/* Heading */}
                <h3 className="text-2xl md:text-4xl font-bold font-display text-white mb-3 tracking-tight">
                  {is4Seater ? "Executive Comfort" : "Luxury Family Travel"}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-white/70 leading-relaxed mb-6 font-sans">
                  {is4Seater
                    ? "Perfect for solo travellers, couples and small families. Ideal for airport transfers, business travel and premium city rides."
                    : "Designed for larger families and groups with generous seating, luggage space and long-distance comfort."}
                </p>

                {/* Specifications Grid (8 Glass Cards) */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {currentSpecs.map((spec, index) => (
                    <motion.div
                      key={spec.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-brand-orange/40 backdrop-blur-xl transition-all duration-300 flex items-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.4)] group"
                    >
                      <div className="p-2 rounded-xl bg-brand-orange/10 border border-brand-orange/20 text-brand-orange group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        {spec.icon}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-[10px] uppercase font-mono tracking-wider text-white/50 truncate">
                          {spec.label}
                        </div>
                        <div className="text-xs md:text-sm font-semibold font-display text-white truncate">
                          {spec.value}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <a
                  href="#booking"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber text-white font-semibold text-sm md:text-base tracking-wide shadow-[0_10px_35px_rgba(255,107,0,0.4)] hover:shadow-[0_15px_45px_rgba(255,107,0,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden w-full sm:w-auto"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative z-10 flex items-center gap-3">
                    Book This Vehicle
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </a>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
