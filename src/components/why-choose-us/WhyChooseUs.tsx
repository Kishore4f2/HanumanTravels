"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import FeatureTile from "./FeatureTile";
import JourneyCanvas from "./JourneyCanvas";
import SpotlightButton from "../ui/SpotlightButton";

export default function WhyChooseUs() {
  const featuresList = [
    { title: "Professional Drivers", iconType: "drivers" as const },
    { title: "Doorstep Pickup", iconType: "pickup" as const },
    { title: "24×7 Availability", iconType: "availability" as const },
    { title: "GPS Tracking", iconType: "gps" as const },
    { title: "Safe & Sanitised", iconType: "safe" as const },
    { title: "Premium 4 & 7 Seater Fleet", iconType: "fleet" as const },
  ];

  const easeLuxury = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      id="road-awaits"
      className="relative w-full min-h-screen bg-[#030304] overflow-hidden select-none flex items-center justify-center
        pt-[80px] md:pt-[100px] lg:pt-[120px] pb-[32px] md:pb-[48px] lg:pb-[64px] px-8 sm:px-12 lg:px-20"
    >
      {/* Background Polish Overlays */}
      <div className="absolute inset-0 bg-grain opacity-25 mix-blend-overlay pointer-events-none z-10" />
      <div className="absolute top-1/3 left-0 w-[600px] h-[600px] rounded-full bg-[#FF6B00]/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />

      {/* Floating Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full blur-[0.5px]"
            style={{
              top: `${(i * 19) % 95}%`,
              left: `${(i * 29) % 95}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 8 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Main split grid container with 42/58 layout */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-[48px] lg:gap-[96px] relative z-20">
        
        {/* LEFT SIDE CONTENT - 42% on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: easeLuxury }}
          className="w-full lg:w-[42%] flex flex-col items-start text-left shrink-0 z-20"
        >
          {/* Label: 14px, uppercase, orange, letter spacing */}
          <span className="text-[14px] uppercase tracking-[0.25em] font-bold text-brand-orange mb-4.5 block">
            Continue Your Journey
          </span>

          {/* Heading: 48px, bold, luxury white, max 2 lines, line height 1.1 */}
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-[48px] tracking-tight text-white leading-[1.1] max-w-[560px]">
            Travel Beyond the Destination.
          </h2>

          {/* Spacing from heading to description: 36px */}
          <div className="h-[36px]" />

          {/* Description: 16px, luxury grey, line height relaxed */}
          <p className="font-sans text-[15px] sm:text-[16px] text-gray-400 leading-relaxed max-w-[560px] font-normal">
            Every kilometre is built on trust, comfort, safety and professionalism. From Rajahmundry to every corner of Andhra Pradesh and Telangana, Hanuman Travels delivers a premium intercity experience with professional drivers, well-maintained vehicles and reliable service.
          </p>

          {/* Spacing from description to tiles: 56px */}
          <div className="h-[56px]" />

          {/* Feature Tiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {featuresList.map((feat, idx) => (
              <FeatureTile
                key={feat.title}
                title={feat.title}
                iconType={feat.iconType}
                index={idx}
              />
            ))}
          </div>

        </motion.div>

        {/* RIGHT SIDE VIEWPORT - 58% on desktop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease: easeLuxury }}
          className="w-full lg:w-[58%] z-10 shrink-0"
        >
          {/* Viewport container styled as a premium card with rounded edges, glass borders, and shadows */}
          <div className="relative w-full aspect-[16/10] min-h-[300px] md:min-h-[420px] rounded-[36px] overflow-hidden border border-white/10 bg-[#050507] shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(255,107,0,0.1)] flex flex-col items-center justify-between py-10 group">
            
            {/* Top ambient highlight flare */}
            <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-brand-orange/10 to-transparent pointer-events-none z-10" />

            <div className="absolute inset-0">
              <JourneyCanvas />
            </div>
            
            {/* Top Text Overlay */}
            <div className="relative z-10 w-full text-center pointer-events-none opacity-40">
              <span className="text-white text-xs sm:text-sm uppercase tracking-[0.3em] font-bold">
                Experience The Difference
              </span>
            </div>
            
            {/* Bottom Text Overlay */}
            <div className="relative z-10 w-full text-center pointer-events-none opacity-40">
              <span className="text-white text-xs sm:text-sm uppercase tracking-[0.3em] font-bold">
                Premium Intercity Travel
              </span>
            </div>

            {/* Bottom luxury reflection vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030304] via-transparent to-transparent opacity-50 pointer-events-none z-10" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
