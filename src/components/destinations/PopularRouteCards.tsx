"use client";

import React from "react";
import { motion } from "framer-motion";
import { POPULAR_ROUTES, DESTINATIONS, Destination } from "./destinationsData";
import { ArrowRight, MapPin } from "lucide-react";

interface PopularRouteCardsProps {
  onSelectRoute: (dest: Destination) => void;
  activeDestinationId: string;
}

export default function PopularRouteCards({
  onSelectRoute,
  activeDestinationId,
}: PopularRouteCardsProps) {
  return (
    <div className="w-full my-6">
      <div className="text-xs font-mono uppercase tracking-widest text-white/50 mb-3">
        POPULAR INTERCITY ROUTES
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {POPULAR_ROUTES.map((route) => {
          const matchingDest = DESTINATIONS.find((d) => d.id === route.id);
          const isActive = activeDestinationId === route.id;

          return (
            <motion.div
              key={route.id}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => matchingDest && onSelectRoute(matchingDest)}
              className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-xl shadow-lg relative overflow-hidden group ${
                isActive
                  ? "bg-brand-orange/10 border-brand-orange shadow-[0_0_20px_rgba(255,107,0,0.25)]"
                  : "bg-white/[0.03] border-white/10 hover:border-brand-orange/50"
              }`}
            >
              {/* Top Accent Indicator */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-mono text-brand-orange/90 font-bold">
                  {route.distance}
                </span>
                <ArrowRight className="w-3 h-3 text-white/40 group-hover:text-brand-orange group-hover:translate-x-0.5 transition-all" />
              </div>

              {/* Cities */}
              <div className="text-xs font-semibold text-white font-display mb-1 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-brand-orange flex-shrink-0" />
                <span className="truncate">{route.to}</span>
              </div>

              {/* Price & Time */}
              <div className="flex items-center justify-between text-[11px] text-white/60 font-sans mt-2 pt-2 border-t border-white/5">
                <span>{route.time}</span>
                <span className="font-bold text-white">{route.price}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
