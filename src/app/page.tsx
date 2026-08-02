"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import AppleLoader from "@/components/loader/AppleLoader";
import GlassNavbar from "@/components/navbar/GlassNavbar";
import ImageSequenceCanvas from "@/components/hero/ImageSequenceCanvas";
import LivingBackground from "@/components/hero/LivingBackground";
import HeroTextTimeline from "@/components/hero/HeroTextTimeline";
import WhyChooseUs from "@/components/why-choose-us/WhyChooseUs";
import ShowroomSection from "@/components/showroom/ShowroomSection";
import ExploreDestinations from "@/components/destinations/ExploreDestinations";
import BookingEngine from "@/components/booking/BookingEngine";
import LuxuryFooter from "@/components/booking/LuxuryFooter";
import WhatsAppFloatingButton from "@/components/ui/WhatsAppFloatingButton";

export interface JourneyData {
  pickup: string;
  destination: string;
  vehicleType: "4-seater" | "7-seater";
  distance: number;
  duration: string;
  estimatedFare: number;
  passengerCount: number;
  travelDate?: string;
}

export default function Home() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isLoaderFinished, setIsLoaderFinished] = useState(false);
  const [isSequenceComplete, setIsSequenceComplete] = useState(false);
  const [sharedJourney, setSharedJourney] = useState<JourneyData | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Scroll transforms for Hero container
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.45]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <main className="relative min-h-screen bg-[#030304] overflow-x-hidden text-white select-none">
      {/* 1. Apple-Style Preloader */}
      <AppleLoader
        progress={loadProgress}
        isLoaded={isPreloaded}
        onStartExperience={() => setIsLoaderFinished(true)}
      />

      {/* 2. Floating Glassmorphism Navbar */}
      <GlassNavbar />

      {/* 3. Luxury Hero Section Container (Scales down and fades out cleanly on scroll) */}
      <motion.section
        id="home"
        ref={heroRef}
        style={{ scale, opacity, y }}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center will-change-transform transform-gpu"
      >
        {/* HTML Canvas Image Sequence Engine */}
        <ImageSequenceCanvas
          onProgress={(pct) => setLoadProgress(pct)}
          onLoaded={() => setIsPreloaded(true)}
          onSequenceComplete={() => setIsSequenceComplete(true)}
          isReadyToPlay={isLoaderFinished}
        />

        {/* Living Background Enhancements (Fog, Dust Particles, Light Rays, Parallax) */}
        <LivingBackground />

        {/* Synchronized Hero Text Timeline Reveal */}
        <HeroTextTimeline triggerTimeline={isSequenceComplete} />
      </motion.section>

      {/* 4. Luxury The Road Awaits Section */}
      <WhyChooseUs />
      {/* 5. Choose Your Ride Section */}
      <ShowroomSection />
      {/* 6. Explore Destinations Section */}
      <ExploreDestinations onJourneyPlanned={(data) => {
        setSharedJourney(data);
        const bookingSection = document.getElementById("booking");
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: "smooth" });
        }
      }} />
      {/* 7. Luxury Booking Engine Section */}
      <BookingEngine initialJourney={sharedJourney} />
      {/* 8. Luxury Footer */}
      <LuxuryFooter />
      {/* 9. Floating WhatsApp Action Button (6300071224) */}
      <WhatsAppFloatingButton />
    </main>
  );
}
