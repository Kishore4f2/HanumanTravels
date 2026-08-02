"use client";

import React from "react";
import { motion } from "framer-motion";
import { Destination } from "../destinations/destinationsData";
import {
  Users,
  Wind,
  Zap,
  Navigation,
  ShieldCheck,
  Luggage,
  Clock,
  MapPin,
  Sparkles,
  Award,
} from "lucide-react";

interface JourneyDashboardProps {
  pickupLocation: string;
  destination: Destination;
  vehicleType: "4-seater" | "7-seater";
  fare: number;
  tripType?: "one-way" | "round-trip";
}

export default function JourneyDashboard({
  pickupLocation,
  destination,
  vehicleType,
  fare,
  tripType = "one-way",
}: JourneyDashboardProps) {
  const vehicleTitle =
    vehicleType === "4-seater" ? "4 Seater Executive" : "7 Seater Luxury";

  const isRoundTrip = tripType === "round-trip";

  return (
    <div className="w-full flex flex-col gap-5 text-left">
      {/* 1. TOP JOURNEY CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative p-6 rounded-3xl bg-gradient-to-b from-white/[0.05] via-white/[0.03] to-white/[0.01] border border-white/10 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] overflow-hidden group"
      >
        {/* Soft Ambient Accent Lighting */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/15 blur-3xl rounded-full pointer-events-none" />

        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[10px] font-mono font-bold tracking-widest text-brand-orange uppercase px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30">
            {isRoundTrip ? "ROUND-TRIP JOURNEY" : "ONE-WAY JOURNEY"}
          </span>
          <span className="text-xs font-semibold text-white/70">
            {vehicleTitle}
          </span>
        </div>

        {/* Route Overview */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="max-w-[45%]">
            <span className="text-[10px] uppercase font-mono text-white/50 block">PICKUP</span>
            <span className="text-sm font-extrabold text-white font-display truncate block" title={pickupLocation}>
              {pickupLocation}
            </span>
          </div>

          <div className="flex items-center gap-1 text-brand-orange font-mono">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
            <span className="text-xs">{isRoundTrip ? "⇄" : "➔"}</span>
          </div>

          <div className="text-right max-w-[45%]">
            <span className="text-[10px] uppercase font-mono text-white/50 block">DESTINATION</span>
            <span className="text-sm font-extrabold text-brand-orange font-display truncate block" title={destination.name}>
              {destination.name}
            </span>
          </div>
        </div>

        {/* Key Trip Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-xs">
          <div>
            <span className="text-[10px] uppercase font-mono text-white/40 block">Distance</span>
            <span className="font-semibold text-white font-display">
              {isRoundTrip ? destination.distanceKm * 2 : destination.distanceKm} km
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-white/40 block">Duration</span>
            <span className="font-semibold text-white font-display">
              {isRoundTrip ? `${destination.estimatedTime} x2` : destination.estimatedTime}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-white/40 block">Est. Fare</span>
            <span className="font-bold text-brand-orange font-display">₹{fare.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {/* 2. LIVE ROUTE PREVIEW (Mini animated highway) */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden flex items-center justify-between gap-3 text-xs">
        <span className="font-mono text-white/70 font-semibold truncate max-w-[30%]">{pickupLocation.split(",")[0]}</span>

        {/* Highway line with moving car */}
        <div className="relative flex-1 h-0.5 bg-white/10 rounded-full mx-2 overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1 w-3 h-2 bg-brand-orange rounded-full shadow-[0_0_8px_#FF6B00]"
          />
        </div>

        <span className="font-mono text-brand-orange font-semibold truncate max-w-[30%]">{destination.name.split(",")[0].split(" ")[0]}</span>
      </div>

      {/* 3. VEHICLE SPECS CARD */}
      <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-3">
        <div className="text-[10px] uppercase font-mono tracking-widest text-white/50">
          VEHICLE SPECIFICATIONS & AMENITIES
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
            <Wind className="w-4 h-4 text-brand-orange shrink-0" />
            <span className="text-white/80 font-medium truncate">Climate Control</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-orange shrink-0" />
            <span className="text-white/80 font-medium truncate">Fast USB Charging</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-brand-orange shrink-0" />
            <span className="text-white/80 font-medium truncate">Live GPS Telematics</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
            <span className="text-white/80 font-medium truncate">Verified Captain</span>
          </div>
        </div>
      </div>

      {/* 4. LIVE AVAILABILITY WIDGET */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/80 font-medium">Fleet Available Today</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
          INSTANT CONFIRMATION
        </span>
      </div>

      {/* 5. TRUST CARD */}
      <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-2 text-xs">
        <div className="flex items-center gap-2 text-brand-orange font-semibold">
          <Award className="w-4 h-4" />
          <span>Hanuman Travels Guarantee</span>
        </div>
        <p className="text-[11px] text-white/60 leading-relaxed font-sans">
          Guaranteed on-time pickup, 100% sanitized vehicles, and transparent flat pricing with zero hidden charges.
        </p>
      </div>
    </div>
  );
}
