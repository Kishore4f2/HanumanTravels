"use client";

import React, { useEffect, useRef, useState } from "react";
import { Destination, RAJAHMUNDRY_HQ, DESTINATIONS } from "./destinationsData";
import { FilterCategory } from "./LuxuryFilterBar";

interface RealLuxuryMapProps {
  activeDestination: Destination;
  onSelectDestination: (dest: Destination) => void;
  selectedCategory: FilterCategory;
}

export default function RealLuxuryMap({
  activeDestination,
  onSelectDestination,
  selectedCategory,
}: RealLuxuryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const activeRouteRef = useRef<any>(null);
  const activeVehicleRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Filter destinations based on selected category
  const filteredDestinations = DESTINATIONS.filter((d) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "AP") return d.state === "AP";
    if (selectedCategory === "Telangana") return d.state === "Telangana";
    if (selectedCategory === "Popular") {
      // Only highlight specific popular cities: hyderabad, warangal, vijayawada, kakinada, vizag (visakhapatnam), tirupati
      const popularIds = ["hyderabad", "warangal", "vijayawada", "kakinada", "visakhapatnam", "tirupati"];
      return popularIds.includes(d.id);
    }
    return true;
  });

  // 1. Dynamic Initialization of Leaflet (prevents SSR errors)
  useEffect(() => {
    if (typeof window === "undefined" || mapInstanceRef.current) return;

    const container = mapContainerRef.current;
    if (!container || (container as any)._leaflet_id) return;

    import("leaflet").then((L) => {
      // Re-verify after import delay
      if ((container as any)._leaflet_id) return;

      // Create Map Instance
      const map = L.map(container, {
        center: [17.0005, 81.804], // Center on Rajahmundry
        zoom: 7,
        zoomControl: false,
        attributionControl: false,
        maxBounds: [
          [12.0, 75.0], // Southwest bounds of AP/Telangana
          [20.5, 86.0], // Northeast bounds
        ],
        minZoom: 6,
        maxZoom: 10,
      });

      // CartoDB Dark Matter Tile Server (Near black, ultra premium real map theme)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 20,
        }
      ).addTo(map);

      mapInstanceRef.current = map;
      setLeafletLoaded(true);

      // Add Zoom Control on bottom-right
      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Zoom in/out dynamically based on Category Selection
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    if (selectedCategory === "AP") {
      // Calculate bounds of AP destinations
      const apDests = DESTINATIONS.filter((d) => d.state === "AP");
      const apPoints: [number, number][] = apDests.map((d) => [d.lat, d.lng]);
      // Add Rajahmundry HQ in the bounds too
      apPoints.push([RAJAHMUNDRY_HQ.lat, RAJAHMUNDRY_HQ.lng]);

      map.fitBounds(apPoints, {
        padding: [60, 60],
        animate: true,
        duration: 1.2,
      });
    } else if (selectedCategory === "Telangana") {
      // Calculate bounds of Telangana destinations
      const tgDests = DESTINATIONS.filter((d) => d.state === "Telangana");
      const tgPoints: [number, number][] = tgDests.map((d) => [d.lat, d.lng]);

      map.fitBounds(tgPoints, {
        padding: [60, 60],
        animate: true,
        duration: 1.2,
      });
    } else {
      // Zoom out to default full view for "All" and "Popular"
      map.setView([17.0005, 81.804], 7, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [leafletLoaded, selectedCategory]);

  // 3. Render HQ and Clickable Text Name-Only Markers dynamically
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;

      // Clear existing markers
      Object.keys(markersRef.current).forEach((key) => {
        markersRef.current[key].remove();
      });
      markersRef.current = {};

      // HQ custom name-only marker
      const hqIcon = L.divIcon({
        className: "custom-hq-marker",
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 rounded-full bg-[#FF6B00]/25 animate-pulse"></span>
            <div class="px-3 py-1.5 rounded-full bg-black/95 border-2 border-[#FF6B00] text-[#FF6B00] text-[10px] font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,107,0,0.4)] whitespace-nowrap cursor-default">
              RAJAHMUNDRY (HQ)
            </div>
          </div>
        `,
        iconSize: [120, 30],
        iconAnchor: [60, 15],
      });

      const hqMarker = L.marker([RAJAHMUNDRY_HQ.lat, RAJAHMUNDRY_HQ.lng], {
        icon: hqIcon,
      }).addTo(map);

      markersRef.current["hq"] = hqMarker;

      // Destination name-only markers (no highlighted circle points)
      filteredDestinations.forEach((dest) => {
        const isActive = activeDestination.id === dest.id;

        // Custom anchor offsets to prevent Hyderabad & Vizag airport labels from overlapping
        let anchor: [number, number] = [50, 12];
        if (dest.id === "rgia-airport") {
          anchor = [50, -18]; // Push Hyderabad RGIA Airport down (since it is south of Hyderabad)
        } else if (dest.id === "vizag-airport") {
          anchor = [50, 42]; // Push Vizag Airport up (since it is north of Vizag city)
        }

        // Custom HTML for clickable text name-only markers
        const nameIcon = L.divIcon({
          className: "custom-name-marker-wrapper",
          html: `
            <div class="cursor-pointer font-display text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap px-2.5 py-1.5 rounded-xl border backdrop-blur-md ${
              isActive
                ? "text-[#FF6B00] bg-black/90 border-[#FF6B00] shadow-[0_0_15px_rgba(255,107,0,0.25)] scale-105"
                : "text-white/70 bg-black/40 border-white/10 hover:text-white hover:border-[#FF6B00]/40 hover:bg-black/60 hover:scale-102"
            }">
              ${dest.name}
            </div>
          `,
          iconSize: [100, 24],
          iconAnchor: anchor,
        });

        const marker = L.marker([dest.lat, dest.lng], { icon: nameIcon })
          .addTo(map)
          .on("click", () => onSelectDestination(dest));

        markersRef.current[dest.id] = marker;
      });
    });
  }, [leafletLoaded, filteredDestinations, activeDestination, onSelectDestination]);

  // 4. Draw animated route paths only when a city name is clicked (and active destination is not Rajahmundry HQ)
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current || !activeDestination) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;

      // Clear existing active route and vehicle
      if (activeRouteRef.current) activeRouteRef.current.remove();
      if (activeVehicleRef.current) activeVehicleRef.current.remove();

      // If active destination is the HQ itself, do not draw any route path line
      if (activeDestination.id === RAJAHMUNDRY_HQ.id) return;

      const points: [number, number][] = [
        [RAJAHMUNDRY_HQ.lat, RAJAHMUNDRY_HQ.lng],
        [activeDestination.lat, activeDestination.lng],
      ];

      // Draw glowing active route polyline
      const routePolyline = L.polyline(points, {
        color: "#FF6B00",
        weight: 3,
        opacity: 0.9,
        className: "glowing-route-line",
      }).addTo(map);

      activeRouteRef.current = routePolyline;

      // Zoom in to fit the active route bounds smoothly
      map.fitBounds(routePolyline.getBounds(), {
        padding: [80, 80],
        animate: true,
        duration: 1.0,
      });

      // Traveling vehicle dot icon
      const vehicleIcon = L.divIcon({
        className: "moving-vehicle-marker",
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-3.5 h-3.5 rounded-full bg-white animate-ping"></span>
            <div class="w-2.5 h-2.5 rounded-full bg-[#FF6B00] border border-white shadow-[0_0_8px_#FF6B00]"></div>
          </div>
        `,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });

      const vehicleMarker = L.marker([RAJAHMUNDRY_HQ.lat, RAJAHMUNDRY_HQ.lng], {
        icon: vehicleIcon,
      }).addTo(map);

      activeVehicleRef.current = vehicleMarker;

      // Animate vehicle marker along the route coordinates
      let fraction = 0;
      const step = 0.015; // Animation step speed

      const animateVehicle = () => {
        fraction += step;
        if (fraction > 1) {
          fraction = 0; // restart loop
        }

        const currentLat = RAJAHMUNDRY_HQ.lat + (activeDestination.lat - RAJAHMUNDRY_HQ.lat) * fraction;
        const currentLng = RAJAHMUNDRY_HQ.lng + (activeDestination.lng - RAJAHMUNDRY_HQ.lng) * fraction;

        vehicleMarker.setLatLng([currentLat, currentLng]);

        if (activeVehicleRef.current === vehicleMarker) {
          requestAnimationFrame(animateVehicle);
        }
      };

      requestAnimationFrame(animateVehicle);
    });
  }, [leafletLoaded, activeDestination]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px] lg:min-h-[620px] bg-[#030305] z-10" />

      {/* Inline Leaflet CSS overlay mapping to prevent layout popouts */}
      <style jsx global>{`
        .leaflet-container {
          background-color: #030305 !important;
          outline: none;
          width: 100% !important;
          height: 100% !important;
        }
        .glowing-route-line {
          stroke-dasharray: 8, 4;
          animation: routeFlow 25s linear infinite;
          filter: drop-shadow(0 0 4px #ff6b00);
        }
        @keyframes routeFlow {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </div>
  );
}
