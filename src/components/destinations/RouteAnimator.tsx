"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { Destination, RAJAHMUNDRY_HQ } from "./destinationsData";

interface RouteAnimatorProps {
  activeDestination: Destination;
}

export default function RouteAnimator({ activeDestination }: RouteAnimatorProps) {
  const pathId = useId();

  // Coordinates from HQ to Active Destination
  const startX = RAJAHMUNDRY_HQ.vectorX;
  const startY = RAJAHMUNDRY_HQ.vectorY;
  const endX = activeDestination.vectorX;
  const endY = activeDestination.vectorY;

  // Calculate Bezier control points for a smooth curved arc route
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2 - 8; // arc curve offset

  const pathD = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        {/* Glowing Orange Route Gradient */}
        <linearGradient id={`${pathId}-gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FF8800" stopOpacity="1" />
          <stop offset="100%" stopColor="#DFB260" stopOpacity="0.9" />
        </linearGradient>

        {/* Glow Filter */}
        <filter id={`${pathId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Underneath Route Shadow / Ambient Line */}
      <path
        d={pathD}
        fill="none"
        stroke="#FF6B00"
        strokeWidth="0.8"
        strokeOpacity="0.25"
        vectorEffect="non-scaling-stroke"
      />

      {/* Main Animated Glowing Route Line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={`url(#${pathId}-gradient)`}
        strokeWidth="0.6"
        strokeLinecap="round"
        filter={`url(#${pathId}-glow)`}
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Traveling Vehicle Icon along the route */}
      <g>
        <circle r="0.8" fill="#FF6B00" filter={`url(#${pathId}-glow)`}>
          <animateMotion
            path={pathD}
            dur="3.5s"
            repeatCount="indefinite"
            rotate="auto"
          />
        </circle>
        {/* Trailing Pulse particle */}
        <circle r="0.4" fill="#FFFFFF">
          <animateMotion
            path={pathD}
            dur="3.5s"
            repeatCount="indefinite"
            rotate="auto"
          />
        </circle>
      </g>
    </svg>
  );
}
