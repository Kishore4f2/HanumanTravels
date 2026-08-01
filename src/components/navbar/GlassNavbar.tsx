"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, ArrowUpRight } from "lucide-react";
import SpotlightButton from "../ui/SpotlightButton";

export default function GlassNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Journey", href: "#road-awaits" },
    { name: "Fleet", href: "#choose-your-ride" },
    { name: "Routes", href: "#destinations" },
    { name: "Booking", href: "#booking" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-8 pt-4 pb-2 pointer-events-auto"
    >
      <div
        className={`w-full max-w-7xl h-[68px] rounded-full transition-all duration-300 flex items-center justify-between px-5 sm:px-8 border ${
          isScrolled
            ? "bg-black/80 backdrop-blur-2xl border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.9)] scale-[0.99]"
            : "bg-black/35 backdrop-blur-xl border-white/10 shadow-[0_6px_25px_rgba(0,0,0,0.3)]"
        }`}
      >
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-2.5 group text-decoration-none">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF6B00] to-[#FF8800] p-[1px] shadow-[0_0_15px_rgba(255,107,0,0.4)] group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-black/90 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-orange animate-pulse-slow" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-display font-extrabold text-sm sm:text-base tracking-[0.18em] text-white uppercase group-hover:text-brand-orange transition-colors duration-300">
              Hanuman
            </span>
            <span className="text-[8px] uppercase tracking-[0.35em] text-white/50 font-medium">
              Travels
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.2em] font-medium text-white/75 hover:text-white transition-all duration-300 relative group py-1"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-brand-orange to-brand-amber group-hover:w-full transition-all duration-300 rounded-full" />
            </a>
          ))}
        </nav>

        {/* Book Ride Action Button */}
        <div className="hidden sm:flex items-center gap-4">
          <SpotlightButton
            variant="primary"
            onClick={() => {
              const el = document.getElementById("booking");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="!px-5 !py-2 !text-[11px] !tracking-[0.15em]"
          >
            <span>Book Ride</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </SpotlightButton>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white/80 hover:text-white p-2 rounded-full glass-button"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-brand-orange" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute top-20 left-4 right-4 bg-black/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 flex flex-col gap-4 shadow-2xl md:hidden z-50"
          >
            <div className="flex flex-col gap-3 border-b border-white/10 pb-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs uppercase tracking-[0.2em] font-medium text-white/80 hover:text-brand-orange transition-colors py-1"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <SpotlightButton
              variant="primary"
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById("booking");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full justify-center !py-3"
            >
              <span>Book Ride Now</span>
              <ArrowUpRight className="w-4 h-4" />
            </SpotlightButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
