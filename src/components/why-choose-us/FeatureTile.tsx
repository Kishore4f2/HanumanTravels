"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Clock, Navigation, CheckCircle, Car } from "lucide-react";

interface FeatureTileProps {
  title: string;
  iconType: "drivers" | "pickup" | "availability" | "gps" | "safe" | "fleet";
  index: number;
}

export default function FeatureTile({ title, iconType, index }: FeatureTileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tileRef.current) return;
    const tile = tileRef.current;
    const rect = tile.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const rX = -(mouseY / (height / 2)) * 8;
    const rY = (mouseX / (width / 2)) * 8;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const icons = {
    drivers: <ShieldCheck className="w-6 h-6 text-brand-orange" />,
    pickup: <MapPin className="w-6 h-6 text-brand-orange" />,
    availability: <Clock className="w-6 h-6 text-brand-orange" />,
    gps: <Navigation className="w-6 h-6 text-brand-orange" />,
    safe: <CheckCircle className="w-6 h-6 text-brand-orange" />,
    fleet: <Car className="w-6 h-6 text-brand-orange" />,
  };

  return (
    <motion.div
      ref={tileRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.08,
      }}
      animate={{
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      whileHover={{
        y: -3,
        borderColor: "rgba(255, 107, 0, 0.25)",
      }}
      className="relative flex items-center gap-3.5 sm:gap-4 p-4 lg:p-5 rounded-[24px] border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 pointer-events-auto group select-none overflow-hidden"
    >
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-[#FF6B00] opacity-0 group-hover:opacity-[0.02] blur-xl transition-opacity duration-300 pointer-events-none" />

      {/* Luxury Border Outline Reflection */}
      <div className="absolute inset-px rounded-[23px] border border-white/[0.05] pointer-events-none group-hover:border-white/15 transition-all duration-300" />

      {/* Ripple/Shine highlight */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />

      {/* Left Icon Container */}
      <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 group-hover:bg-brand-orange/10 group-hover:border-brand-orange/30 transition-all duration-300 flex items-center justify-center shrink-0">
        <div className="group-hover:scale-110 transition-transform duration-300">
          {icons[iconType]}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex flex-col text-left">
        <h4 className="font-sans font-bold text-[12px] leading-[1.2] tracking-wide text-white group-hover:text-brand-orange transition-colors duration-300">
          {title}
        </h4>
        <span className="text-[9px] uppercase tracking-widest text-white/40 mt-1">
          Luxury Service
        </span>
      </div>
    </motion.div>
  );
}
