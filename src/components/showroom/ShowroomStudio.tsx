"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import HotspotPin, { Hotspot } from "./HotspotPin";
import { VehicleVariant } from "./VehicleSelector";
import { easeLuxury } from "./useShowroomMotion";

interface ShowroomStudioProps {
  selectedVariant: VehicleVariant;
}

// Hotspots configured for the vehicle view
const hotspots4Seater: Hotspot[] = [
  {
    id: "headlights",
    title: "Crystal LED Projectors",
    description: "Automatic high-beam projector lamps for superior night highway visibility.",
    xPct: 34,
    yPct: 44,
    category: "Lighting",
  },
  {
    id: "license-plate",
    title: "Verified Fleet AP 40 F 2619",
    description: "Fully licensed, GPS-tracked & comprehensive insurance covered.",
    xPct: 28,
    yPct: 59,
    category: "Security",
  },
  {
    id: "seats",
    title: "Plush Reclining Leatherette",
    description: "Ergonomic executive bucket seating with extra legroom & lumbar support.",
    xPct: 56,
    yPct: 38,
    category: "Interior",
  },
  {
    id: "ac",
    title: "Dual-Zone Climate Control",
    description: "Individual rear AC vents with speed control for optimal cooling.",
    xPct: 68,
    yPct: 34,
    category: "Comfort",
  },
  {
    id: "suspension",
    title: "Smooth Ride Tech",
    description: "Tuned suspension designed for bump-free long distance intercity journeys.",
    xPct: 75,
    yPct: 62,
    category: "Drive Quality",
  },
];

const hotspots7Seater: Hotspot[] = [
  {
    id: "headlights",
    title: "Dual Projector Headlamps",
    description: "Sharp beam intensity ensuring maximum safety during midnight travel.",
    xPct: 34,
    yPct: 44,
    category: "Lighting",
  },
  {
    id: "license-plate",
    title: "Verified Fleet AP 40 F 2619",
    description: "Commercial registration with real-time speed monitoring.",
    xPct: 28,
    yPct: 59,
    category: "Security",
  },
  {
    id: "third-row",
    title: "Flexible 3-Row Seating",
    description: "Spacious 7-passenger layout with split-folding luggage space.",
    xPct: 62,
    yPct: 36,
    category: "Capacity",
  },
  {
    id: "boot",
    title: "Extended Boot Space",
    description: "Ample room for 4+ large suitcases and extra carry-on bags.",
    xPct: 82,
    yPct: 48,
    category: "Luggage",
  },
  {
    id: "charging",
    title: "Multi-Port USB Chargers",
    description: "Dedicated fast-charging points for all row passengers.",
    xPct: 50,
    yPct: 42,
    category: "Convenience",
  },
];

export default function ShowroomStudio({
  selectedVariant,
}: ShowroomStudioProps) {
  const currentHotspots =
    selectedVariant === "4-seater" ? hotspots4Seater : hotspots7Seater;

  const imgSrc =
    selectedVariant === "4-seater"
      ? "/images/showroom-suzuki-4seater.png"
      : "/images/showroom-suzuki-7seater.png";

  return (
    <div className="relative w-full max-w-5xl aspect-[16/9] min-h-[340px] md:min-h-[460px] mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-[#09090b] via-[#050507] to-[#020203] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(255,107,0,0.08)] flex items-center justify-center">
      {/* 1. Volumetric Overhead Studio Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,107,0,0.18)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />

      {/* 2. Rotating Studio Stage Platform Base */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-[85%] h-[28%] rounded-[100%] border border-brand-orange/20 bg-gradient-to-b from-brand-orange/10 via-transparent to-transparent shadow-[0_0_60px_rgba(255,107,0,0.15)] pointer-events-none overflow-hidden">
        {/* Revolving stage highlight ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-[100%] border-t border-brand-orange/50 border-dashed"
        />
      </div>

      {/* 3. Ambient Floor Reflection Glow */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[70%] h-[15%] bg-brand-orange/15 blur-2xl rounded-full pointer-events-none" />

      {/* 4. Vehicle Display Container with Cross-Dissolve */}
      <div className="relative w-[90%] md:w-[82%] h-[82%] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedVariant}
            initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
            transition={{ duration: 0.7, ease: easeLuxury }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Main Vehicle Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={imgSrc}
                alt={`Hanuman Travels Suzuki Ertiga ${selectedVariant} AP 40 F 2619`}
                fill
                priority
                className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)]"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>

            {/* Render Hotspots OVER the car */}
            {currentHotspots.map((hotspot) => (
              <HotspotPin key={hotspot.id} hotspot={hotspot} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 5. Studio Fog / Haze Layer */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020203] via-transparent to-transparent opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
    </div>
  );
}
