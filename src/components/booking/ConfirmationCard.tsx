"use client";

import React from "react";
import { motion } from "framer-motion";
import { Destination } from "../destinations/destinationsData";
import {
  CheckCircle,
  Phone,
  MessageSquare,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  Users,
  MapPin,
} from "lucide-react";

interface ConfirmationCardProps {
  bookingId: string;
  pickupLocation: string;
  destination: Destination;
  vehicleType: "4-seater" | "7-seater";
  pickupDate: string;
  pickupTime: string;
  passengers: number;
  fullName: string;
  phoneNumber: string;
  fare: number;
  onReset: () => void;
}

export default function ConfirmationCard({
  bookingId,
  pickupLocation,
  destination,
  vehicleType,
  pickupDate,
  pickupTime,
  passengers,
  fullName,
  phoneNumber,
  fare,
  onReset,
}: ConfirmationCardProps) {
  const vehicleTitle =
    vehicleType === "4-seater" ? "4 Seater Executive" : "7 Seater Luxury";

  const handleWhatsAppClick = () => {
    const message = `Hi Hanuman Travels, I have confirmed a luxury reservation on your portal.
*Booking Ref:* #${bookingId}
*Passenger:* ${fullName} (${phoneNumber})
*Route:* ${pickupLocation} ➔ ${destination.name}
*Vehicle:* ${vehicleTitle}
*Date & Time:* ${pickupDate} at ${pickupTime} (${passengers} Passengers)
*Estimated Fare:* ₹${fare.toLocaleString()}`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/916300071224?text=${encoded}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full rounded-[36px] bg-gradient-to-b from-[#09090b] via-[#050507] to-[#020203] border border-white/10 p-6 md:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(255,107,0,0.12)] text-left relative overflow-hidden"
    >
      {/* Subtle Top Ambient Lighting Flare */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-brand-orange/15 via-transparent to-transparent pointer-events-none" />

      {/* Success Icon & Header */}
      <div className="flex flex-col items-center text-center mb-8 relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
        >
          <CheckCircle className="w-8 h-8" />
        </motion.div>

        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
          RESERVATION CONFIRMED &middot; #{bookingId}
        </span>

        <h3 className="text-2xl md:text-4xl font-extrabold font-display text-white tracking-tight mb-2">
          Journey Reserved Successfully
        </h3>

        <p className="text-xs md:text-sm text-white/70 max-w-md leading-relaxed font-sans">
          Thank you, <span className="text-white font-semibold">{fullName}</span>. Your chauffeur captain dispatch has been registered.
        </p>
      </div>

      {/* Receipt Details Card */}
      <div className="p-5 md:p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl mb-8 relative z-10 space-y-4">
        {/* Route Line Summary */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono text-white/50 uppercase block">PICKUP</span>
            <span className="text-sm font-semibold text-white font-display">{pickupLocation}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-mono">
            ➔
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-white/50 uppercase block">DESTINATION</span>
            <span className="text-sm font-semibold text-brand-orange font-display">{destination.name}</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-white/50 text-[10px] uppercase font-mono block">Vehicle</span>
            <span className="font-semibold text-white truncate block">{vehicleTitle}</span>
          </div>
          <div>
            <span className="text-white/50 text-[10px] uppercase font-mono block">Date & Time</span>
            <span className="font-semibold text-white truncate block">{pickupDate} at {pickupTime}</span>
          </div>
          <div>
            <span className="text-white/50 text-[10px] uppercase font-mono block">Passengers</span>
            <span className="font-semibold text-white truncate block">{passengers} Guest(s)</span>
          </div>
          <div>
            <span className="text-white/50 text-[10px] uppercase font-mono block">Est. Total Fare</span>
            <span className="font-bold text-brand-orange text-sm truncate block">₹{fare.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
        <button
          type="button"
          onClick={handleWhatsAppClick}
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs md:text-sm tracking-wide shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Connect Captain on WhatsApp</span>
        </button>

        <a
          href="tel:+916300071224"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs md:text-sm tracking-wide transition-all duration-300"
        >
          <Phone className="w-4 h-4 text-brand-orange" />
          <span>Call 24×7 Concierge Support</span>
        </a>
      </div>

      {/* Secondary Reset Button */}
      <div className="text-center mt-6 relative z-10">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition font-mono"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reserve Another Journey</span>
        </button>
      </div>
    </motion.div>
  );
}
