"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Destination, DESTINATIONS } from "../destinations/destinationsData";
import {
  Calendar,
  Clock,
  Users,
  User,
  Phone,
  MessageSquare,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface ReservationPanelProps {
  pickupLocation: string;
  onChangePickupLocation: (val: string) => void;
  destination: Destination;
  onChangeDestination: (dest: Destination) => void;
  vehicleType: "4-seater" | "7-seater";
  onChangeVehicleType: (type: "4-seater" | "7-seater") => void;
  pickupDate: string;
  setPickupDate: (date: string) => void;
  pickupTime: string;
  setPickupTime: (time: string) => void;
  passengers: number;
  setPassengers: (num: number) => void;
  fullName: string;
  setFullName: (name: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  specialRequests: string;
  setSpecialRequests: (req: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export default function ReservationPanel({
  pickupLocation,
  onChangePickupLocation,
  destination,
  onChangeDestination,
  vehicleType,
  onChangeVehicleType,
  pickupDate,
  setPickupDate,
  pickupTime,
  setPickupTime,
  passengers,
  setPassengers,
  fullName,
  setFullName,
  phoneNumber,
  setPhoneNumber,
  specialRequests,
  setSpecialRequests,
  onSubmit,
  isSubmitting,
}: ReservationPanelProps) {
  const maxPassengers = vehicleType === "4-seater" ? 4 : 7;

  return (
    <div className="w-full rounded-[36px] bg-[#050507] border border-white/10 p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(255,107,0,0.08)] text-left relative overflow-hidden">
      {/* 1. BOOKING PROGRESS STEP INDICATOR */}
      <div className="flex items-center justify-between gap-2 mb-8 pb-6 border-b border-white/10 text-[10px] md:text-xs font-mono">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Vehicle</span>
        </div>
        <span className="text-white/20">➔</span>

        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Route</span>
        </div>
        <span className="text-white/20">➔</span>

        <div className="flex items-center gap-1.5 text-brand-orange font-bold">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
          <span>Details</span>
        </div>
        <span className="text-white/20">➔</span>

        <div className="flex items-center gap-1.5 text-white/40">
          <span>Confirmation</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* 2. AUTO PRE-FILLED READ-ONLY SELECTIONS SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
          <div>
            <span className="text-[9px] uppercase font-mono text-white/40 block mb-0.5">Pickup</span>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => onChangePickupLocation(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white font-display focus:outline-none w-full border-b border-white/5 focus:border-brand-orange/40 pb-0.5"
            />
          </div>

          <div>
            <label className="text-[9px] uppercase font-mono text-white/40 block mb-0.5">Destination</label>
            <select
              value={destination.id}
              onChange={(e) => {
                if (e.target.value === "custom") {
                  // If custom was selected, keep the destination object as is
                } else {
                  const found = DESTINATIONS.find((d) => d.id === e.target.value);
                  if (found) onChangeDestination(found);
                }
              }}
              className="bg-transparent text-xs font-semibold text-brand-orange font-display focus:outline-none cursor-pointer w-full border-b border-white/5 focus:border-brand-orange/40 pb-0.5"
            >
              {destination.id === "custom" && (
                <option value="custom" className="bg-black text-brand-orange">
                  {destination.name} (Planned)
                </option>
              )}
              {DESTINATIONS.map((d) => (
                <option key={d.id} value={d.id} className="bg-black text-white">
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[9px] uppercase font-mono text-white/40 block mb-0.5">Vehicle Model</label>
            <select
              value={vehicleType}
              onChange={(e) => onChangeVehicleType(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-white font-display focus:outline-none cursor-pointer w-full border-b border-white/5 focus:border-brand-orange/40 pb-0.5"
            >
              <option value="4-seater" className="bg-black text-white">4 Seater Executive</option>
              <option value="7-seater" className="bg-black text-white">7 Seater Luxury</option>
            </select>
          </div>
        </div>

        {/* 3. DATE & TIME PICKERS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Glass Date Picker */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-mono text-white/60 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-brand-orange" />
              Journey Date
            </label>
            <input
              type="date"
              value={pickupDate}
              required
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-black/70 border border-white/10 text-white focus:border-brand-orange focus:outline-none text-xs md:text-sm font-sans"
            />
          </div>

          {/* Glass Time Picker */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-mono text-white/60 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-brand-orange" />
              Pickup Time
            </label>
            <input
              type="time"
              value={pickupTime}
              required
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-black/70 border border-white/10 text-white focus:border-brand-orange focus:outline-none text-xs md:text-sm font-sans"
            />
          </div>
        </div>

        {/* 4. PASSENGER SELECTOR (- / + ANIMATED COUNTER) */}
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-widest font-mono text-white/60 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-brand-orange" />
              Passenger Count
            </span>
            <span className="text-[10px] text-white/40">Max {maxPassengers} Guests</span>
          </label>
          <div className="flex items-center justify-between p-2 rounded-2xl bg-white/[0.02] border border-white/10">
            <button
              type="button"
              onClick={() => setPassengers(Math.max(1, passengers - 1))}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg flex items-center justify-center transition"
            >
              -
            </button>
            <span className="text-base font-bold font-display text-white">
              {passengers} {passengers === 1 ? "Passenger" : "Passengers"}
            </span>
            <button
              type="button"
              onClick={() => setPassengers(Math.min(maxPassengers, passengers + 1))}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg flex items-center justify-center transition"
            >
              +
            </button>
          </div>
        </div>

        {/* 5. FLOATING INPUTS (NAME & PHONE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-mono text-white/60 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-brand-orange" />
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={fullName}
              required
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-black/70 border border-white/10 text-white focus:border-brand-orange focus:outline-none text-xs md:text-sm font-sans"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-mono text-white/60 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-brand-orange" />
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              required
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-black/70 border border-white/10 text-white focus:border-brand-orange focus:outline-none text-xs md:text-sm font-sans"
            />
          </div>
        </div>

        {/* 6. SPECIAL REQUESTS (OPTIONAL) */}
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-widest font-mono text-white/60 flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-brand-orange" />
            Special Instructions (Optional)
          </label>
          <input
            type="text"
            placeholder="Child seat, luggage assistance, specific pickup spot..."
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="w-full px-4 py-3.5 rounded-2xl bg-black/70 border border-white/10 text-white focus:border-brand-orange focus:outline-none text-xs md:text-sm font-sans"
          />
        </div>

        {/* 7. PRIMARY CTA BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber text-white font-semibold text-sm md:text-base tracking-wide shadow-[0_10px_35px_rgba(255,107,0,0.4)] hover:shadow-[0_15px_45px_rgba(255,107,0,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden disabled:opacity-50"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="relative z-10 flex items-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Reserving Your Journey...
              </>
            ) : (
              <>
                Ready to Begin? Reserve My Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
}
