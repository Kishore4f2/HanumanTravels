"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Map, Clock, ShieldCheck, Award } from "lucide-react";

interface CounterItem {
  id: string;
  target: number;
  suffix: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

const STATS: CounterItem[] = [
  {
    id: "destinations",
    target: 150,
    suffix: "+",
    label: "Destinations",
    sublabel: "Across AP & Telangana",
    icon: <Map className="w-5 h-5 text-brand-orange" />,
  },
  {
    id: "service",
    target: 24,
    suffix: "x7",
    label: "Live Service",
    sublabel: "Non-stop Intercity",
    icon: <Clock className="w-5 h-5 text-brand-orange" />,
  },
  {
    id: "ontime",
    target: 99,
    suffix: "%",
    label: "On-Time Arrival",
    sublabel: "Punctual Travel",
    icon: <Award className="w-5 h-5 text-brand-orange" />,
  },
  {
    id: "drivers",
    target: 100,
    suffix: "%",
    label: "Verified Drivers",
    sublabel: "Safety First Captains",
    icon: <ShieldCheck className="w-5 h-5 text-brand-orange" />,
  },
];

function SingleCounter({ stat, isVisible }: { stat: CounterItem; isVisible: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = stat.target;
    const duration = 1800; // ms
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, stat.target]);

  return (
    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-lg flex items-center gap-3">
      <div className="p-2.5 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex-shrink-0">
        {stat.icon}
      </div>
      <div>
        <div className="text-xl md:text-2xl font-extrabold font-display text-white tracking-tight">
          {count}
          {stat.suffix}
        </div>
        <div className="text-xs font-semibold text-white/90">{stat.label}</div>
        <div className="text-[10px] text-white/50 font-mono">{stat.sublabel}</div>
      </div>
    </div>
  );
}

export default function LiveStatsCounters() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6 w-full">
      {STATS.map((stat) => (
        <SingleCounter key={stat.id} stat={stat} isVisible={isInView} />
      ))}
    </div>
  );
}
