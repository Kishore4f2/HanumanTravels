"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function LivingBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20; // -10px to +10px
      const y = (e.clientY / innerHeight - 0.5) * 20; // -10px to +10px
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Dynamic Mouse Parallax Layer */}
      <motion.div
        className="w-full h-full relative"
        style={{
          x: parallaxX,
          y: parallaxY,
        }}
      >
        {/* Soft Volumetric Headlight Glow */}
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-t from-[#FF8800]/15 via-[#FF6B00]/5 to-transparent rounded-full blur-[100px] opacity-70 animate-pulse-slow" />

        {/* Ambient Moving Fog Layer 1 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-fog-move blur-3xl opacity-40 transform scale-110 pointer-events-none" />

        {/* Floating Dust Particles */}
        <div className="absolute inset-0">
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full blur-[0.5px]"
              style={{
                top: `${(i * 17) % 90}%`,
                left: `${(i * 23) % 95}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, i % 2 === 0 ? 15 : -15, 0],
                opacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: 6 + (i % 5),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Cinematic Vignette Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.85)_100%)] pointer-events-none" />

      {/* Top & Bottom Dark Edge Shadows */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/70 to-transparent" />

      {/* Light Cinematic Grain Texture */}
      <div className="absolute inset-0 bg-grain opacity-40 mix-blend-overlay" />
    </div>
  );
}
