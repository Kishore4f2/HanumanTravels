"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface SpotlightButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
}

export default function SpotlightButton({
  children,
  variant = "primary",
  onClick,
  className = "",
}: SpotlightButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  if (variant === "secondary") {
    return (
      <motion.button
        ref={btnRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className={`relative inline-flex items-center justify-center px-8 py-4 rounded-full overflow-hidden text-sm font-semibold tracking-wide transition-all duration-300 glass-button text-white border border-white/20 hover:border-white/40 shadow-lg cursor-pointer ${className}`}
      >
        {/* Spotlight Effect */}
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-full"
          style={{
            opacity,
            background: `radial-gradient(200px circle at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.15), transparent 80%)`,
          }}
        />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      ref={btnRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.04, y: -3 }}
      whileTap={{ scale: 0.97 }}
      className={`relative inline-flex items-center justify-center px-9 py-4 rounded-full overflow-hidden text-sm font-bold tracking-wider uppercase transition-all duration-300 bg-gradient-to-r from-[#FF8800] via-[#FF6B00] to-[#E65100] text-white shadow-luxury-orange hover:shadow-luxury-glow border border-orange-400/40 shine-sweep cursor-pointer ${className}`}
    >
      {/* Outer ambient glow */}
      <div className="absolute inset-0 bg-[#FF6B00] opacity-40 blur-md rounded-full pointer-events-none group-hover:opacity-70 transition-opacity duration-500" />

      {/* Dynamic Cursor Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-full z-0"
        style={{
          opacity,
          background: `radial-gradient(180px circle at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.35), transparent 80%)`,
        }}
      />

      <span className="relative z-10 flex items-center gap-2.5 drop-shadow-sm">{children}</span>
    </motion.button>
  );
}
