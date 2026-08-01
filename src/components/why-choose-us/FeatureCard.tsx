"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Clock, Navigation, CheckCircle, Car } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  iconType: "drivers" | "pickup" | "availability" | "gps" | "safe" | "fleet";
  index: number;
}

export default function FeatureCard({ title, description, iconType, index }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Mouse tilt parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Calculate rotation angles (max 10 degrees)
    const rX = -(mouseY / (height / 2)) * 10;
    const rY = (mouseX / (width / 2)) * 10;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
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
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.1,
      }}
      animate={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      whileHover={{
        scale: 1.02,
        y: -4,
        boxShadow: "0 15px 35px rgba(255, 107, 0, 0.15)",
        borderColor: "rgba(255, 107, 0, 0.3)",
      }}
      className="relative flex items-start gap-4 p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-lg transition-colors duration-300 pointer-events-auto group select-none"
    >
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-[#FF6B00] opacity-0 group-hover:opacity-[0.02] blur-xl rounded-2xl transition-opacity duration-300 pointer-events-none" />

      {/* Ripple border reflection accent */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Left Icon Container */}
      <div className="p-3 rounded-xl bg-white/[0.05] border border-white/10 group-hover:bg-brand-orange/10 group-hover:border-brand-orange/30 transition-all duration-300 flex items-center justify-center shrink-0">
        <div className="group-hover:scale-110 transition-transform duration-300">
          {icons[iconType]}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex flex-col gap-1.5 text-left">
        <h4 className="font-sans font-bold text-sm sm:text-base tracking-wide text-white group-hover:text-brand-orange transition-colors duration-300">
          {title}
        </h4>
        <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed font-normal">
          {description}
        </p>
      </div>

    </motion.div>
  );
}
