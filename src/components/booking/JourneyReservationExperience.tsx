"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DESTINATIONS, Destination, RAJAHMUNDRY_HQ } from "../destinations/destinationsData";
import JourneyDashboard from "./JourneyDashboard";
import ReservationPanel from "./ReservationPanel";
import ConfirmationCard from "./ConfirmationCard";
import { Sparkles } from "lucide-react";

export default function JourneyReservationExperience() {
  // State synchronized from choices
  const [selectedDestination, setSelectedDestination] = useState<Destination>(
    DESTINATIONS[0] // Defaults to Hyderabad or selected route
  );
  const [vehicleType, setVehicleType] = useState<"4-seater" | "7-seater">("4-seater");

  // Form Inputs
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Process & Confirmation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");

  // Calculate live fare
  const currentPrice =
    vehicleType === "4-seater"
      ? selectedDestination.price4Seater
      : selectedDestination.price7Seater;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupDate || !pickupTime || !fullName || !phoneNumber) {
      alert("Please enter all journey details.");
      return;
    }

    setIsSubmitting(true);

    // Generate random luxury booking ref id (e.g. HT-2026-8492)
    const randomRef = `HT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const vehicleTitle = vehicleType === "4-seater" ? "4 Seater Executive" : "7 Seater Luxury";
    const message = `Hi Hanuman Travels, I have reserved a luxury ride on your portal.
*Booking Ref:* #${randomRef}
*Passenger:* ${fullName} (${phoneNumber})
*Route:* Rajahmundry (HQ) ➔ ${selectedDestination.name}
*Vehicle:* ${vehicleTitle}
*Date & Time:* ${pickupDate} at ${pickupTime} (${passengers} Passengers)
*Estimated Fare:* ₹${currentPrice.toLocaleString()}
${specialRequests ? `*Special Instructions:* ${specialRequests}` : ""}`;

    const encoded = encodeURIComponent(message);

    setTimeout(() => {
      setBookingId(randomRef);
      setIsSubmitting(false);
      setIsConfirmed(true);
      window.open(`https://wa.me/916300071224?text=${encoded}`, "_blank");
    }, 1800);
  };

  const handleReset = () => {
    setIsConfirmed(false);
    setIsSubmitting(false);
  };

  return (
    <section
      id="booking"
      className="relative w-full min-h-screen bg-[#030304] text-white py-16 md:py-24 px-4 md:px-8 lg:px-12 overflow-hidden select-none"
    >
      {/* Background Soft Orange Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-brand-orange/5 blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(15,15,17,0.7)_0%,rgba(3,3,4,1)_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
        >
          {/* Small Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(255,107,0,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            PREMIUM RESERVATION
          </div>

          {/* Large Heading */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.1] mb-4">
            Confirm Your{" "}
            <span className="bg-gradient-to-r from-brand-orange via-brand-amber to-white bg-clip-text text-transparent">
              Journey.
            </span>
          </h2>

          {/* Description */}
          <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans max-w-xl mx-auto">
            Everything is ready. Review your selected journey, choose your preferred travel time, and reserve your premium ride with Hanuman Travels.
          </p>
        </motion.div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {isConfirmed ? (
            /* Confirmation Card Receipt */
            <ConfirmationCard
              key="confirmation"
              bookingId={bookingId}
              pickupLocation="Rajahmundry (HQ)"
              destination={selectedDestination}
              vehicleType={vehicleType}
              pickupDate={pickupDate}
              pickupTime={pickupTime}
              passengers={passengers}
              fullName={fullName}
              phoneNumber={phoneNumber}
              fare={currentPrice}
              onReset={handleReset}
            />
          ) : (
            /* Split Desktop Layout: 40% Dashboard (Left) | 60% Reservation Panel (Right) */
            <motion.div
              key="reservation-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 w-full"
            >
              {/* LEFT PANEL: 40% Width on Desktop */}
              <div className="w-full lg:w-[40%] flex flex-col">
                <JourneyDashboard
                  destination={selectedDestination}
                  vehicleType={vehicleType}
                  fare={currentPrice}
                />
              </div>

              {/* RIGHT PANEL: 60% Width on Desktop */}
              <div className="w-full lg:w-[60%] flex flex-col">
                <ReservationPanel
                  destination={selectedDestination}
                  onChangeDestination={(dest) => setSelectedDestination(dest)}
                  vehicleType={vehicleType}
                  onChangeVehicleType={(type) => setVehicleType(type)}
                  pickupDate={pickupDate}
                  setPickupDate={setPickupDate}
                  pickupTime={pickupTime}
                  setPickupTime={setPickupTime}
                  passengers={passengers}
                  setPassengers={setPassengers}
                  fullName={fullName}
                  setFullName={setFullName}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  specialRequests={specialRequests}
                  setSpecialRequests={setSpecialRequests}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle Bottom Divider Line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
    </section>
  );
}
