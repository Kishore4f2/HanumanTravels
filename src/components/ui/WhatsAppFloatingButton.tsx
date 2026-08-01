"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export default function WhatsAppFloatingButton() {
  const defaultMessage = encodeURIComponent(
    "Hi Hanuman Travels, I would like to book a luxury intercity ride. Please provide details."
  );

  return (
    <motion.a
      href={`https://wa.me/916300071224?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs tracking-wide shadow-[0_10px_30px_rgba(16,185,129,0.5)] border border-emerald-400/30 transition-colors pointer-events-auto"
      aria-label="Direct WhatsApp Contact"
    >
      <MessageSquare className="w-4 h-4 fill-white" />
      <span className="hidden sm:inline font-mono">Chat on WhatsApp</span>
    </motion.a>
  );
}
