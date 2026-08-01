"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  DESTINATIONS,
  Destination,
  RAJAHMUNDRY_HQ,
} from "./destinationsData";
import LuxuryMapContainer from "./LuxuryMapContainer";
import RouteDetailsPanel from "./RouteDetailsPanel";
import PopularRouteCards from "./PopularRouteCards";
import LiveStatsCounters from "./LiveStatsCounters";
import { FilterCategory } from "./LuxuryFilterBar";

export default function ExploreDestinations() {
  const [activeDestination, setActiveDestination] = useState<Destination>(
    RAJAHMUNDRY_HQ // Default active route: Rajahmundry HQ (no active route shown initially)
  );
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("All");

  return (
    <section
      id="destinations"
      className="relative w-full min-h-screen bg-[#030304] text-white py-16 md:py-24 px-4 md:px-8 lg:px-12 overflow-hidden select-none"
    >
      {/* Soft Ambient Background Lighting & Subtle Fog */}
      <div className="absolute top-1/4 left-1/3 w-full max-w-7xl h-[600px] bg-brand-orange/5 blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(15,15,17,0.7)_0%,rgba(3,3,4,1)_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
        >
          {/* Small Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(255,107,0,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            YOUR NEXT JOURNEY
          </div>

          {/* Large Heading */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.1] mb-4">
            Where Will Your Journey <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-orange via-brand-amber to-white bg-clip-text text-transparent">
              Take You?
            </span>
          </h2>

          {/* Description */}
          <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans max-w-2xl mx-auto">
            From Rajahmundry to every major destination across Andhra Pradesh and Telangana, Hanuman Travels offers safe, comfortable and premium intercity travel designed around your needs.
          </p>
        </motion.div>

        {/* Split Desktop Layout: 42% Content (Left) | 58% Interactive Map (Right) */}
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-10 w-full">
          {/* LEFT CONTENT COLUMN (42% Width on Desktop) */}
          <div className="w-full lg:w-[42%] flex flex-col justify-between">
            {/* Active Route Details Card */}
            <RouteDetailsPanel activeDestination={activeDestination} />

            {/* Popular Intercity Route Cards */}
            <PopularRouteCards
              activeDestinationId={activeDestination.id}
              onSelectRoute={(dest) => setActiveDestination(dest)}
            />
          </div>

          {/* RIGHT MAP COLUMN (58% Width on Desktop) */}
          <div className="w-full lg:w-[58%] min-h-[460px] lg:min-h-[620px]">
            <LuxuryMapContainer
              activeDestination={activeDestination}
              onSelectDestination={(dest) => setActiveDestination(dest)}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />
          </div>
        </div>

        {/* Live Animated Counters Section */}
        <LiveStatsCounters />
      </div>

      {/* Subtle Divider Line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
    </section>
  );
}
