"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Users, ArrowRight, Loader2, Navigation, CheckCircle2, X, RotateCcw } from "lucide-react";
import { gsap } from "gsap";
import { JourneyData } from "@/app/page";
import { searchLocation, calculateJourneyMetrics, LocationResult } from "./routingUtils";

// Unsplash premium travel & cityscape images for popular destinations
const POPULAR_CAROUSEL_DATA = [
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867, img: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&w=400&q=80" },
  { id: "vijayawada", name: "Vijayawada", state: "AP", lat: 16.5062, lng: 80.648, img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80" },
  { id: "visakhapatnam", name: "Visakhapatnam", state: "AP", lat: 17.6868, lng: 83.2185, img: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=400&q=80" },
  { id: "kakinada", name: "Kakinada", state: "AP", lat: 16.9891, lng: 82.2475, img: "/images/kakinada.png" },
  { id: "warangal", name: "Warangal", state: "Telangana", lat: 17.9689, lng: 79.5941, img: "/images/warangal.png" },
  { id: "tirupati", name: "Tirupati", state: "AP", lat: 13.6288, lng: 79.4192, img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80" },
  { id: "araku", name: "Araku Valley", state: "AP", lat: 18.3273, lng: 82.8775, img: "/images/araku.png" },
  { id: "srisailam", name: "Srisailam", state: "AP", lat: 16.0748, lng: 78.8681, img: "/images/srisailam.png" },
  { id: "khammam", name: "Khammam", state: "Telangana", lat: 17.2473, lng: 80.1514, img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80" },
  { id: "nellore", name: "Nellore", state: "AP", lat: 14.4426, lng: 79.9865, img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80" },
];

interface ExploreDestinationsProps {
  onJourneyPlanned: (data: JourneyData) => void;
}

export default function ExploreDestinations({ onJourneyPlanned }: ExploreDestinationsProps) {
  // Configurator inputs
  const [pickupInput, setPickupInput] = useState("");
  const [pickupLocation, setPickupLocation] = useState<LocationResult | null>(null);
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationResult[]>([]);
  const [isPickupFocused, setIsPickupFocused] = useState(false);

  const [destInput, setDestInput] = useState("");
  const [destLocation, setDestLocation] = useState<LocationResult | null>(null);
  const [destSuggestions, setDestSuggestions] = useState<LocationResult[]>([]);
  const [isDestFocused, setIsDestFocused] = useState(false);

  const [vehicleType, setVehicleType] = useState<"4-seater" | "7-seater">("4-seater");
  const [travelDate, setTravelDate] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);

  // Search histories
  const [recentSearches, setRecentSearches] = useState<LocationResult[]>([]);

  // Calculation state
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationFinished, setCalculationFinished] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Result metrics
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState("");
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [animatedFare, setAnimatedFare] = useState(0);

  const fareRef = useRef<{ value: number }>({ value: 0 });

  // Popular destination distances
  const [carouselCards, setCarouselCards] = useState<any[]>(POPULAR_CAROUSEL_DATA);

  // Debounced search logic for pickup
  useEffect(() => {
    if (!pickupInput || pickupInput.length < 2 || pickupLocation?.displayName === pickupInput) {
      setPickupSuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      const results = await searchLocation(pickupInput);
      setPickupSuggestions(results);
    }, 400);
    return () => clearTimeout(delay);
  }, [pickupInput, pickupLocation]);

  // Debounced search logic for destination
  useEffect(() => {
    if (!destInput || destInput.length < 2 || destLocation?.displayName === destInput) {
      setDestSuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      const results = await searchLocation(destInput);
      setDestSuggestions(results);
    }, 400);
    return () => clearTimeout(delay);
  }, [destInput, destLocation]);

  // Initialize recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ht_recent_searches");
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Update popular carousel distance predictions when pickup changes
  useEffect(() => {
    const updateCarousel = async () => {
      const origin = pickupLocation || { lat: 17.0005, lng: 81.804, name: "Rajahmundry" }; // Default HQ
      
      const promises = POPULAR_CAROUSEL_DATA.map(async (city) => {
        // Simple straight-line fallback to prevent flooding public OSRM during load
        const R = 6371; // radius
        const dLat = (city.lat - origin.lat) * (Math.PI / 180);
        const dLon = (city.lng - origin.lng) * (Math.PI / 180);
        const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(origin.lat * (Math.PI / 180)) * Math.cos(city.lat * (Math.PI / 180)) * 
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const estDist = Math.round(R * c * 1.27);
        const estTimeHrs = Math.round(estDist / 55 * 10) / 10;
        
        return {
          ...city,
          distance: estDist,
          time: estTimeHrs > 0 ? `${estTimeHrs} hrs` : "Under 1 hr",
        };
      });

      const updated = await Promise.all(promises);
      setCarouselCards(updated);
    };

    updateCarousel();
  }, [pickupLocation]);

  // Handle immediate fare recalculation on vehicle type shift after calculation finishes
  useEffect(() => {
    if (calculationFinished && distance > 0) {
      const rate = vehicleType === "4-seater" ? 14 : 18;
      const newFare = distance * rate;
      setEstimatedFare(newFare);
      
      // Animate fare change smoothly
      gsap.to(fareRef.current, {
        value: newFare,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => {
          setAnimatedFare(Math.round(fareRef.current.value));
        }
      });
    }
  }, [vehicleType, distance, calculationFinished]);

  const saveToRecent = (loc: LocationResult) => {
    const updated = [loc, ...recentSearches.filter(s => s.displayName !== loc.displayName)].slice(0, 3);
    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ht_recent_searches", JSON.stringify(updated));
    }
  };

  const executeCalculation = async (
    pickup: LocationResult | null,
    dest: LocationResult | null
  ) => {
    if (!pickup || !dest) {
      setErrorMsg("Please select both pickup and destination locations.");
      return;
    }
    if (pickup.displayName === dest.displayName) {
      setErrorMsg("Pickup and destination locations must be different.");
      return;
    }

    setErrorMsg("");
    setIsCalculating(true);
    
    // Simulate luxury loader feel
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const metrics = await calculateJourneyMetrics(pickup.lat, pickup.lng, dest.lat, dest.lng);
      
      if (metrics.distanceKm <= 0) {
        setErrorMsg("Unable to calculate driving route. Please check the addresses.");
        setIsCalculating(false);
        return;
      }

      setDistance(metrics.distanceKm);
      setDuration(metrics.durationStr);
      
      const rate = vehicleType === "4-seater" ? 14 : 18;
      const finalFare = metrics.distanceKm * rate;
      setEstimatedFare(finalFare);
      setCalculationFinished(true);

      // GSAP Count-up animation
      fareRef.current.value = 0;
      gsap.to(fareRef.current, {
        value: finalFare,
        duration: 1.5,
        ease: "power3.out",
        onUpdate: () => {
          setAnimatedFare(Math.round(fareRef.current.value));
        }
      });

      // Save to recent searches
      saveToRecent(pickup);
      saveToRecent(dest);
    } catch (e) {
      setErrorMsg("An error occurred. Using local flight calculations.");
      // Soft fallback
      const mockDist = Math.round(Math.sqrt(Math.pow(dest.lat - pickup.lat, 2) + Math.pow(dest.lng - pickup.lng, 2)) * 100 * 1.25);
      setDistance(mockDist);
      setDuration(`${Math.round(mockDist / 55)} hrs`);
      const rate = vehicleType === "4-seater" ? 14 : 18;
      setEstimatedFare(mockDist * rate);
      setCalculationFinished(true);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCarouselCardClick = async (city: any) => {
    const mockDest: LocationResult = {
      name: city.name,
      displayName: `${city.name}, AP/Telangana, India`,
      lat: city.lat,
      lng: city.lng
    };
    setDestLocation(mockDest);
    setDestInput(mockDest.displayName);
    
    const activePickup = pickupLocation || {
      name: "Rajahmundry",
      displayName: "Rajahmundry, Andhra Pradesh, India",
      lat: 17.0005,
      lng: 81.804
    };
    if (!pickupLocation) {
      setPickupLocation(activePickup);
      setPickupInput(activePickup.displayName);
    }

    // Recalculate immediately
    executeCalculation(activePickup, mockDest);
  };

  const handleContinue = () => {
    if (!pickupLocation || !destLocation) return;
    onJourneyPlanned({
      pickup: pickupLocation.name,
      destination: destLocation.name,
      vehicleType,
      distance,
      duration,
      estimatedFare,
      passengerCount,
      travelDate: travelDate || undefined,
    });
  };

  return (
    <section
      id="destinations"
      className="relative w-full min-h-screen bg-[#030304] text-white py-20 px-4 md:px-8 lg:px-12 overflow-hidden select-none"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-orange/5 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-brand-amber/5 blur-[220px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto relative z-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(255,107,0,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            PREMIUM JOURNEY PLANNER
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight mb-4">
            Plan Your <span className="text-orange-gradient">Journey.</span>
          </h2>

          <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-2xl mx-auto">
            Choose any pickup and destination across Andhra Pradesh and Telangana. Instantly calculate distance, estimated travel time and premium travel fare with complete transparency.
          </p>
        </motion.div>

        {/* Dynamic Configurator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* LEFT PANEL: CONFIGURATOR (7 Cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 md:p-8 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              
              {/* Pickup Address Search Input */}
              <div className="relative">
                <label className="text-[11px] uppercase tracking-widest font-mono text-white/60 mb-2 block">Pickup Address</label>
                <div className={`relative rounded-2xl bg-black/50 border transition-all duration-300 flex items-center ${isPickupFocused ? "border-brand-orange shadow-[0_0_15px_rgba(255,107,0,0.25)]" : "border-white/10"}`}>
                  <MapPin className="w-5 h-5 text-white/40 ml-4 shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter pickup city, town, or specific spot..."
                    value={pickupInput}
                    onChange={(e) => setPickupInput(e.target.value)}
                    onFocus={() => setIsPickupFocused(true)}
                    onBlur={() => setTimeout(() => setIsPickupFocused(false), 200)}
                    className="w-full px-3 py-4 bg-transparent text-sm text-white focus:outline-none placeholder-white/30"
                  />
                  {pickupInput && (
                    <button onClick={() => { setPickupInput(""); setPickupLocation(null); }} className="p-2 mr-2 text-white/40 hover:text-white transition">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Pickup Suggestions Dropdown */}
                <AnimatePresence>
                  {isPickupFocused && (pickupSuggestions.length > 0 || recentSearches.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 mt-2 p-2 rounded-2xl bg-[#09090c] border border-white/10 shadow-2xl z-50 max-h-60 overflow-y-auto"
                    >
                      {pickupSuggestions.length > 0 ? (
                        pickupSuggestions.map((item, idx) => (
                          <button
                            key={idx}
                            onMouseDown={() => {
                              setPickupLocation(item);
                              setPickupInput(item.displayName);
                            }}
                            className="w-full text-left p-3 rounded-xl hover:bg-white/[0.05] transition flex items-center gap-2.5 text-xs text-white/80"
                          >
                            <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                            <span>{item.displayName}</span>
                          </button>
                        ))
                      ) : (
                        <div>
                          <div className="p-2 text-[10px] font-mono text-white/40 uppercase tracking-widest border-b border-white/5">Recent Locations</div>
                          {recentSearches.map((item, idx) => (
                            <button
                              key={idx}
                              onMouseDown={() => {
                                setPickupLocation(item);
                                setPickupInput(item.displayName);
                              }}
                              className="w-full text-left p-3 rounded-xl hover:bg-white/[0.05] transition flex items-center gap-2.5 text-xs text-white/80"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-white/30" />
                              <span>{item.displayName}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Destination Address Search Input */}
              <div className="relative">
                <label className="text-[11px] uppercase tracking-widest font-mono text-white/60 mb-2 block">Destination Address</label>
                <div className={`relative rounded-2xl bg-black/50 border transition-all duration-300 flex items-center ${isDestFocused ? "border-brand-orange shadow-[0_0_15px_rgba(255,107,0,0.25)]" : "border-white/10"}`}>
                  <MapPin className="w-5 h-5 text-white/40 ml-4 shrink-0" />
                  <input
                    type="text"
                    placeholder="Where is your journey taking you?"
                    value={destInput}
                    onChange={(e) => setDestInput(e.target.value)}
                    onFocus={() => setIsDestFocused(true)}
                    onBlur={() => setTimeout(() => setIsDestFocused(false), 200)}
                    className="w-full px-3 py-4 bg-transparent text-sm text-white focus:outline-none placeholder-white/30"
                  />
                  {destInput && (
                    <button onClick={() => { setDestInput(""); setDestLocation(null); }} className="p-2 mr-2 text-white/40 hover:text-white transition">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Destination Suggestions Dropdown */}
                <AnimatePresence>
                  {isDestFocused && (destSuggestions.length > 0 || recentSearches.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 mt-2 p-2 rounded-2xl bg-[#09090c] border border-white/10 shadow-2xl z-50 max-h-60 overflow-y-auto"
                    >
                      {destSuggestions.length > 0 ? (
                        destSuggestions.map((item, idx) => (
                          <button
                            key={idx}
                            onMouseDown={() => {
                              setDestLocation(item);
                              setDestInput(item.displayName);
                            }}
                            className="w-full text-left p-3 rounded-xl hover:bg-white/[0.05] transition flex items-center gap-2.5 text-xs text-white/80"
                          >
                            <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                            <span>{item.displayName}</span>
                          </button>
                        ))
                      ) : (
                        <div>
                          <div className="p-2 text-[10px] font-mono text-white/40 uppercase tracking-widest border-b border-white/5">Recent Locations</div>
                          {recentSearches.map((item, idx) => (
                            <button
                              key={idx}
                              onMouseDown={() => {
                                setDestLocation(item);
                                setDestInput(item.displayName);
                              }}
                              className="w-full text-left p-3 rounded-xl hover:bg-white/[0.05] transition flex items-center gap-2.5 text-xs text-white/80"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-white/30" />
                              <span>{item.displayName}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Segmented Selector for Vehicle */}
              <div>
                <label className="text-[11px] uppercase tracking-widest font-mono text-white/60 mb-2.5 block">Select Luxury Cruiser</label>
                <div className="relative p-1 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-1">
                  
                  {/* Sliding Indicator */}
                  <motion.div
                    layoutId="active-vehicle-slider"
                    className="absolute top-1 bottom-1 rounded-xl bg-brand-orange shadow-[0_0_15px_rgba(255,107,0,0.3)] pointer-events-none"
                    style={{
                      width: "calc(50% - 6px)",
                      left: vehicleType === "4-seater" ? "6px" : "calc(50%)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  />

                  <button
                    type="button"
                    onClick={() => setVehicleType("4-seater")}
                    className={`relative z-10 w-1/2 py-3 px-4 rounded-xl text-xs md:text-sm font-semibold transition-colors duration-300 flex flex-col items-center justify-center ${vehicleType === "4-seater" ? "text-white" : "text-white/40 hover:text-white/70"}`}
                  >
                    <span>4 Seater Executive</span>
                    <span className="text-[10px] font-mono opacity-80 mt-0.5">₹14 / KM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVehicleType("7-seater")}
                    className={`relative z-10 w-1/2 py-3 px-4 rounded-xl text-xs md:text-sm font-semibold transition-colors duration-300 flex flex-col items-center justify-center ${vehicleType === "7-seater" ? "text-white" : "text-white/40 hover:text-white/70"}`}
                  >
                    <span>7 Seater Luxury</span>
                    <span className="text-[10px] font-mono opacity-80 mt-0.5">₹18 / KM</span>
                  </button>
                </div>
              </div>

              {/* Travel Date & Passengers selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-widest font-mono text-white/60 mb-2 block flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                    Travel Date <span className="opacity-40 font-sans font-normal">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-black/50 border border-white/10 text-xs md:text-sm text-white focus:outline-none focus:border-brand-orange transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-widest font-mono text-white/60 mb-2 block flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-brand-orange" />
                      Passenger Count
                    </span>
                    <span className="text-[10px] opacity-40">Max {vehicleType === "4-seater" ? 4 : 7}</span>
                  </label>
                  <div className="flex items-center justify-between p-1 rounded-2xl bg-black/50 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setPassengerCount(prev => Math.max(1, prev - 1))}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 font-bold flex items-center justify-center transition"
                    >
                      -
                    </button>
                    <span className="text-xs md:text-sm font-semibold">{passengerCount} Guests</span>
                    <button
                      type="button"
                      onClick={() => setPassengerCount(prev => Math.min(vehicleType === "4-seater" ? 4 : 7, prev + 1))}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 font-bold flex items-center justify-center transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-sans">
                {errorMsg}
              </motion.div>
            )}

            {/* Calculate Button */}
            <button
              onClick={() => executeCalculation(pickupLocation, destLocation)}
              disabled={isCalculating}
              className="mt-8 group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-amber text-white font-semibold text-sm md:text-base tracking-wide shadow-[0_10px_30px_rgba(255,107,0,0.3)] hover:shadow-[0_15px_40px_rgba(255,107,0,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isCalculating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Calculating Route Details...
                </>
              ) : (
                <>
                  Calculate Journey Experience
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* RIGHT PANEL: EXPERIENCE DASHBOARD (5 Cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 md:p-8 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] relative overflow-hidden min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/5 via-transparent to-transparent pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {!calculationFinished ? (
                <motion.div
                  key="empty-dashboard"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-brand-orange shadow-[0_0_30px_rgba(255,107,0,0.1)]">
                    <Navigation className="w-8 h-8 animate-pulse" />
                  </div>
                  <h4 className="text-lg font-bold font-display">Awaiting Configuration</h4>
                  <p className="text-xs text-white/50 max-w-xs leading-relaxed">
                    Select your pickup point and destination to trigger the luxury path metrics and pricing configurations.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="result-dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="h-full flex flex-col justify-between space-y-6"
                >
                  {/* Journey Summary */}
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-brand-orange uppercase px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30">
                      JOURNEY SUMMARY
                    </span>
                    <div className="mt-4 space-y-1.5 text-left">
                      <div className="flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <div>
                          <span className="text-[9px] uppercase font-mono text-white/40 block">From</span>
                          <span className="text-xs md:text-sm font-semibold text-white leading-tight">{pickupLocation?.displayName}</span>
                        </div>
                      </div>
                      <div className="w-px h-6 bg-white/10 ml-1" />
                      <div className="flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 shrink-0" />
                        <div>
                          <span className="text-[9px] uppercase font-mono text-white/40 block">To</span>
                          <span className="text-xs md:text-sm font-semibold text-brand-orange leading-tight">{destLocation?.displayName}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Animated Journey Preview Line */}
                  <div className="p-4.5 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden flex items-center justify-between text-xs">
                    <span className="font-mono text-white/60 font-medium truncate max-w-[25%]">{pickupLocation?.name}</span>
                    
                    {/* Glowing Journey Line */}
                    <div className="relative flex-1 h-0.5 bg-white/10 rounded-full mx-3 overflow-hidden">
                      <div className="absolute inset-0 bg-brand-orange/30 blur-xs" />
                      <motion.div
                        animate={{ x: ["-10%", "110%"] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-1 w-4 h-2 bg-brand-orange rounded-full shadow-[0_0_12px_rgba(255,107,0,1)] flex items-center justify-center"
                      >
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      </motion.div>
                    </div>

                    <span className="font-mono text-brand-orange font-semibold truncate max-w-[25%]">{destLocation?.name}</span>
                  </div>

                  {/* Pricing Luxury Glass Card */}
                  <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-xl space-y-4 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 blur-2xl rounded-full pointer-events-none" />
                    
                    <div>
                      <span className="text-[9px] uppercase font-mono text-white/50 block">ESTIMATED FARE</span>
                      <span className="text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-none block mt-1">
                        ₹{animatedFare.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-white/40 block">Total Distance</span>
                        <span className="font-bold text-white font-display text-sm mt-0.5 block">{distance} KM</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono text-white/40 block">Travel Duration</span>
                        <span className="font-bold text-white font-display text-sm mt-0.5 block">{duration}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono text-white/40 block">Vehicle Model</span>
                        <span className="font-semibold text-brand-orange mt-0.5 block">{vehicleType === "4-seater" ? "4 Seater Exec" : "7 Seater Luxury"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono text-white/40 block">Dynamic Pricing</span>
                        <span className="font-semibold text-brand-orange mt-0.5 block">₹{vehicleType === "4-seater" ? 14 : 18} / KM</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Continue */}
                  <button
                    onClick={handleContinue}
                    className="w-full py-4.5 rounded-2xl bg-white text-black hover:bg-brand-orange hover:text-white transition-all duration-300 font-bold text-sm tracking-wider flex items-center justify-center gap-2 group shadow-lg"
                  >
                    Continue to Reservation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* POPULAR DESTINATIONS LUXURY HORIZONTAL CAROUSEL */}
        <div className="mb-20">
          <div className="text-xs font-mono uppercase tracking-widest text-white/50 mb-5 text-left pl-1">
            POPULAR ADJACENT INTERCITY DESTINATIONS
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {carouselCards.map((city, idx) => {
              const currentRate = vehicleType === "4-seater" ? 14 : 18;
              const price = city.distance * currentRate;

              return (
                <motion.div
                  key={city.id}
                  whileHover={{ y: -6 }}
                  onClick={() => handleCarouselCardClick(city)}
                  className="flex-shrink-0 w-64 rounded-2xl bg-white/[0.02] border border-white/10 p-4.5 text-left cursor-pointer transition duration-300 hover:border-brand-orange/40 relative overflow-hidden group shadow-md"
                >
                  {/* City Image */}
                  <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3.5 bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={city.img} alt={city.name} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <span className="absolute bottom-2.5 left-2.5 font-display text-sm font-extrabold text-white">{city.name}</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-white/50">
                      <span>Distance</span>
                      <span className="font-semibold text-white font-mono">{city.distance} KM</span>
                    </div>
                    <div className="flex items-center justify-between text-white/50">
                      <span>Est. Travel Time</span>
                      <span className="font-semibold text-white">{city.time}</span>
                    </div>
                    <div className="flex items-center justify-between text-white/50 pt-2 border-t border-white/5">
                      <span>Dynamic Fare</span>
                      <span className="font-bold text-brand-orange font-display">₹{price.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* TRANSPARENCY / VEHICLE SPEC COMPARISON */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-10">
          <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 blur-xl rounded-full" />
            <h4 className="text-lg font-bold font-display text-white mb-2">4 Seater Executive</h4>
            <p className="text-3xl font-extrabold font-display text-brand-orange mb-3">₹14 <span className="text-xs text-white/40 font-mono">/ KM</span></p>
            <ul className="text-xs text-white/70 space-y-2 font-sans">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0" /> Ideal for 1–4 Passengers</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0" /> Sedans & Compact Luxury Cruisers</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0" /> Fast USB charger & Climate control</li>
            </ul>
          </div>

          <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-amber/5 blur-xl rounded-full" />
            <h4 className="text-lg font-bold font-display text-white mb-2">7 Seater Luxury</h4>
            <p className="text-3xl font-extrabold font-display text-brand-orange mb-3">₹18 <span className="text-xs text-white/40 font-mono">/ KM</span></p>
            <ul className="text-xs text-white/70 space-y-2 font-sans">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0" /> Ideal for 5–7 Passengers</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0" /> Luxury MUVs (Innova Crysta / Hycross class)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0" /> Premium captain chairs & extra cabin legroom</li>
            </ul>
          </div>
        </div>

        {/* Business Policy Note */}
        <p className="text-[11px] text-white/40 font-sans max-w-xl mx-auto leading-relaxed">
          *Note: Tolls, parking charges, state permits, and applicable taxes are handled according to Hanuman Travels' pricing policy and are computed separately at the time of final confirmation.
        </p>

      </div>
    </section>
  );
}
