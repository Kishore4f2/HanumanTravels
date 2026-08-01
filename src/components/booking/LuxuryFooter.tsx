"use client";

import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Send, Sparkles, MapPin, Phone, Mail } from "lucide-react";

export default function LuxuryFooter() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing to Hanuman Travels newsletters!");
  };

  return (
    <footer className="relative w-full bg-[#030304] text-white/70 pt-16 pb-8 px-4 md:px-8 border-t border-white/10 select-none overflow-hidden">
      {/* Background ambient corner flare */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 relative z-20">
        {/* Column 1: Brand & Logo */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(255,107,0,0.4)]">
              H
            </div>
            <span className="text-lg font-bold font-display tracking-tight text-white flex items-center gap-1.5">
              HANUMAN TRAVELS
              <Sparkles className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
            </span>
          </div>
          <p className="text-xs leading-relaxed text-white/50 font-sans">
            Redefining intercity transit across Andhra Pradesh and Telangana with a premium digital fleet and exceptional chauffeur-driven convenience.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="p-2 rounded-full bg-white/[0.03] border border-white/10 hover:border-brand-orange hover:text-brand-orange transition-all" aria-label="Facebook Link">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/[0.03] border border-white/10 hover:border-brand-orange hover:text-brand-orange transition-all" aria-label="Twitter Link">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/[0.03] border border-white/10 hover:border-brand-orange hover:text-brand-orange transition-all" aria-label="Instagram Link">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/[0.03] border border-white/10 hover:border-brand-orange hover:text-brand-orange transition-all" aria-label="LinkedIn Link">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="space-y-3 font-sans">
          <h4 className="text-xs font-bold font-display uppercase tracking-widest text-white">
            EXPLORE
          </h4>
          <ul className="text-xs space-y-2 text-white/50">
            <li><a href="#home" className="hover:text-brand-orange transition">Home & Concierge</a></li>
            <li><a href="#choose-your-ride" className="hover:text-brand-orange transition">Our Fleet Studio</a></li>
            <li><a href="#destinations" className="hover:text-brand-orange transition">Explore Map Routes</a></li>
            <li><a href="#booking" className="hover:text-brand-orange transition">Reserve Luxury Ride</a></li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="space-y-3 font-sans">
          <h4 className="text-xs font-bold font-display uppercase tracking-widest text-white">
            CONTACT CENTER
          </h4>
          <ul className="text-xs space-y-2.5 text-white/50">
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-brand-orange flex-shrink-0 mt-0.5" />
              <span>Rajahmundry HQ, East Godavari, AP, India</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-brand-orange" />
              <a href="tel:+916300071224" className="hover:text-brand-orange transition">+91 63000 71224</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-brand-orange" />
              <span>info@hanumantravels.com</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="space-y-3 font-sans">
          <h4 className="text-xs font-bold font-display uppercase tracking-widest text-white">
            SUBSCRIBE TO JOURNAL
          </h4>
          <p className="text-[11px] text-white/50 leading-relaxed">
            Get travel insights, premium road trip itineraries, and fleet dispatch announcements.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/10 focus-within:border-brand-orange/50 transition">
            <input
              type="email"
              required
              placeholder="Your email address"
              className="bg-transparent pl-3 pr-1 py-1.5 text-xs text-white focus:outline-none w-full"
            />
            <button
              type="submit"
              className="p-2 rounded-full bg-brand-orange hover:bg-brand-amber text-white transition flex-shrink-0 shadow-lg shadow-brand-orange/20"
              aria-label="Send Newsletter Email"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Copyright bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-20 text-[10px] font-mono text-white/40">
        <div>
          &copy; {new Date().getFullYear()} Hanuman Travels. All rights reserved.
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-brand-orange transition">Terms of Service</a>
          <a href="#" className="hover:text-brand-orange transition">Privacy Shield</a>
        </div>
      </div>
    </footer>
  );
}
