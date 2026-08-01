"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

export default function HighwayParallax() {
  const [dayTime, setDayTime] = useState<"morning" | "golden" | "cloudy">("golden");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Slow daylight cycle transition
  useEffect(() => {
    const cycle = ["golden", "cloudy", "morning"] as const;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % cycle.length;
      setDayTime(cycle[idx]);
    }, 15000); // 15 seconds per phase
    return () => clearInterval(interval);
  }, []);

  // requestAnimationFrame loop for continuous environmental updates & dust particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Dust particles kicked up behind tires
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      size: number;
    }
    const particles: Particle[] = [];

    const spawnParticle = (startX: number, startY: number) => {
      particles.push({
        x: startX,
        y: startY,
        vx: -2 - Math.random() * 5,
        vy: -0.5 - Math.random() * 1.5,
        alpha: 0.6 + Math.random() * 0.4,
        size: 2 + Math.random() * 5,
      });
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // Generate dust from the two wheels periodically
      // Left wheel base is roughly at 30% width, 82% height of car container
      // Right wheel base is roughly at 72% width, 75% height of car container
      const carRect = {
        x: width * 0.45,
        y: height * 0.38,
        w: width * 0.52,
        h: (width * 0.52) * (510 / 710),
      };

      const leftWheelX = carRect.x + carRect.w * 0.22;
      const leftWheelY = carRect.y + carRect.h * 0.82;
      const rightWheelX = carRect.x + carRect.w * 0.81;
      const rightWheelY = carRect.y + carRect.h * 0.74;

      if (Math.random() < 0.3) {
        spawnParticle(leftWheelX, leftWheelY);
      }
      if (Math.random() < 0.3) {
        spawnParticle(rightWheelX, rightWheelY);
      }

      // Draw & update particles
      ctx.fillStyle = "rgba(200, 200, 200, 0.2)";
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        p.size += 0.2;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-3xl border border-white/10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] select-none">
      
      {/* Sky Background Parallax Layer */}
      <div
        className={`absolute inset-0 transition-colors duration-[5000ms] ${
          dayTime === "golden"
            ? "bg-gradient-to-b from-[#FFA751] via-[#FFE5B4] to-[#FFE5B4]"
            : dayTime === "cloudy"
            ? "bg-gradient-to-b from-[#7A889B] via-[#A1B0C4] to-[#C9D6DF]"
            : "bg-gradient-to-b from-[#4A00E0] via-[#8E2DE2] to-[#FFE5B4]"
        }`}
      />

      {/* Sun/Light Glow Layer */}
      <div
        className={`absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] transition-all duration-[5000ms] opacity-60 ${
          dayTime === "golden"
            ? "bg-[#FF512F]"
            : dayTime === "cloudy"
            ? "bg-white/10"
            : "bg-[#FF758C]"
        }`}
      />

      {/* Drifting Clouds (Slowest Background Parallax) */}
      <div className="absolute inset-x-0 top-10 h-32 opacity-35 pointer-events-none overflow-hidden">
        <div className="flex gap-40 animate-[marquee_120s_linear_infinite] whitespace-nowrap">
          <div className="w-48 h-16 bg-white/40 rounded-full blur-xl" />
          <div className="w-72 h-20 bg-white/50 rounded-full blur-xl" />
          <div className="w-56 h-14 bg-white/30 rounded-full blur-xl" />
        </div>
      </div>

      {/* Soft Mountain Range Parallax Layer */}
      <div className="absolute bottom-[35%] inset-x-0 h-44 overflow-hidden opacity-85">
        <svg
          viewBox="0 0 1200 120"
          className="w-[200%] h-full fill-[#2a2438] opacity-40 animate-[marquee_45s_linear_infinite] will-change-transform transform-gpu"
          preserveAspectRatio="none"
        >
          <path d="M0 120 L100 80 L250 110 L400 60 L600 100 L750 70 L900 110 L1050 50 L1200 120 Z" />
        </svg>
      </div>

      {/* Passing Highway Trees & Palm Trees Parallax Layer */}
      <div className="absolute bottom-[28%] inset-x-0 h-36 overflow-hidden opacity-90 z-10">
        <div className="flex items-end gap-32 w-[250%] h-full animate-[marquee_20s_linear_infinite] will-change-transform transform-gpu">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              {i % 3 === 0 ? (
                // Palm tree outline
                <div className="w-1.5 h-24 bg-[#1b1c24] relative rounded-full">
                  <div className="absolute -top-4 -left-8 w-18 h-6 bg-[#162a22] rounded-full rotate-[15deg] blur-[0.5px]" />
                  <div className="absolute -top-4 -right-8 w-18 h-6 bg-[#162a22] rounded-full -rotate-[15deg] blur-[0.5px]" />
                </div>
              ) : (
                // Regular highway green tree outline
                <div className="w-2.5 h-20 bg-[#16171f] relative rounded-full">
                  <div className="absolute -top-8 -left-6 w-14 h-14 bg-[#14231c] rounded-full blur-[0.5px]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Electric Poles Passing Layer */}
      <div className="absolute bottom-[28%] inset-x-0 h-44 overflow-hidden z-10 opacity-75">
        <div className="flex items-end gap-[400px] w-[300%] h-full animate-[marquee_12s_linear_infinite] will-change-transform transform-gpu">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-1.5 h-36 bg-[#111115] relative flex justify-center">
              {/* Pole crossbar */}
              <div className="absolute top-4 w-12 h-1 bg-[#111115]" />
            </div>
          ))}
        </div>
      </div>

      {/* Fresh Asphalt Highway & Lane Markings Parallax Layer */}
      <div className="absolute bottom-0 inset-x-0 h-[30%] bg-[#121319] overflow-hidden border-t-2 border-[#1c1d26] z-10">
        {/* Moving Lane Markings */}
        <div className="absolute top-1/2 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#DFB260]/60 to-transparent w-[200%] animate-[marquee_4s_linear_infinite] flex gap-16 will-change-transform transform-gpu">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="w-16 h-[3px] bg-[#DFB260]" />
          ))}
        </div>
        {/* Edge white lines */}
        <div className="absolute top-2 inset-x-0 h-[2px] bg-white/20" />
        <div className="absolute bottom-3 inset-x-0 h-[2px] bg-white/20" />
      </div>

      {/* Canvas Dust Particles kicks up */}
      <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none" />

      {/* The Ertiga Car Container (Centered-right with suspension bounce & camera vibration) */}
      <motion.div
        animate={{
          y: [0, -3, 1, -1, 2, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[8%] right-[8%] w-[52%] h-auto z-20 select-none will-change-transform transform-gpu"
        style={{ aspectRatio: "710/510" }}
      >
        {/* Under-car Moving Ground Shadow */}
        <motion.div
          animate={{
            scale: [1, 1.02, 0.99, 1.01, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-2 left-6 right-6 h-6 bg-black/65 blur-md rounded-full z-0"
        />

        {/* The cropped Suzuki Ertiga car */}
        <img
          src="/images/hero-car.png"
          alt="Hanuman Travels Luxury Ertiga"
          className="w-full h-full object-contain relative z-10 pointer-events-none select-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
        />

        {/* Headlight beam overlay (adds volumetric glow matching golden hour/ambient lighting) */}
        <div className="absolute top-[48%] left-[-25%] w-[45%] h-[20%] bg-gradient-to-r from-[#FFA751]/35 to-transparent blur-md rounded-full rotate-[15deg] z-20 pointer-events-none mix-blend-screen" />

        {/* 1. Left Wheel Spinning spoke blur overlay */}
        <div className="absolute left-[14.5%] top-[70%] w-[13.5%] h-[18%] z-20 pointer-events-none rounded-full overflow-hidden">
          <div className="w-full h-full bg-black/30 rounded-full border border-white/5 relative animate-[spin_0.25s_linear_infinite]">
            {/* Spinning reflection spokes */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(255,255,255,0.15)_100%)]" />
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/20 transform -translate-y-1/2 rotate-45" />
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/20 transform -translate-y-1/2 -rotate-45" />
          </div>
        </div>

        {/* 2. Right Wheel Spinning spoke blur overlay */}
        <div className="absolute left-[77.2%] top-[57.8%] w-[11.5%] h-[15.5%] z-20 pointer-events-none rounded-full overflow-hidden">
          <div className="w-full h-full bg-black/30 rounded-full border border-white/5 relative animate-[spin_0.25s_linear_infinite]">
            {/* Spinning reflection spokes */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(255,255,255,0.15)_100%)]" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 transform -translate-y-1/2 rotate-45" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 transform -translate-y-1/2 -rotate-45" />
          </div>
        </div>
      </motion.div>

      {/* Volumetric ambient lighting & cinematic vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none z-30" />
      <div className="absolute inset-0 bg-grain opacity-25 mix-blend-overlay pointer-events-none z-30" />

      {/* Marquee Keyframes injected directly */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

    </div>
  );
}
