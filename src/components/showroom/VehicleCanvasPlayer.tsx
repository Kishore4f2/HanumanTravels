"use client";

import React, { useEffect, useRef, useState } from "react";

interface VehicleCanvasPlayerProps {
  folderPath: string; // e.g. "/4-seater" or "/7-seater"
  frameCount?: number; // 300
  isActive: boolean;
  shouldPreload: boolean;
}

export default function VehicleCanvasPlayer({
  folderPath,
  frameCount = 300,
  isActive,
  shouldPreload,
}: VehicleCanvasPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);

  // 1. Preload and Cache Frames
  useEffect(() => {
    if (!shouldPreload || imagesRef.current.length > 0 || isPreloading) return;

    setIsPreloading(true);
    let loadedCount = 0;
    const cache: HTMLImageElement[] = new Array(frameCount);

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, "0");
      img.src = `${folderPath}/ezgif-frame-${frameNum}.jpg`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          imagesRef.current = cache;
          setIsLoaded(true);
          setIsPreloading(false);
        }
      };

      img.onerror = () => {
        // Fallback progress count on minor network frame hiccup
        loadedCount++;
        if (loadedCount === frameCount) {
          imagesRef.current = cache;
          setIsLoaded(true);
          setIsPreloading(false);
        }
      };

      cache[i - 1] = img;
    }
  }, [folderPath, frameCount, shouldPreload, isPreloading]);

  // 2. High-Performance RAF Render Loop
  useEffect(() => {
    if (!isActive || !isLoaded || imagesRef.current.length === 0) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let lastTimestamp = performance.now();
    const targetFps = 30; // 30 FPS playback for ultra smooth cinematic motion loop
    const frameInterval = 1000 / targetFps;

    const render = (now: number) => {
      const elapsed = now - lastTimestamp;

      if (elapsed >= frameInterval) {
        lastTimestamp = now - (elapsed % frameInterval);

        const currentFrame = currentFrameRef.current;
        const img = imagesRef.current[currentFrame];

        if (img && img.complete && img.naturalWidth > 0) {
          // Adjust canvas internal dimensions to match parent or image aspect ratio
          if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth || 1280;
            canvas.height = canvas.clientHeight || 720;
          }

          const cWidth = canvas.width;
          const cHeight = canvas.height;
          const imgWidth = img.naturalWidth;
          const imgHeight = img.naturalHeight;

          // Object-contain math: calculate aspect ratio so car is never cropped
          const scale = Math.min(cWidth / imgWidth, cHeight / imgHeight);
          const drawWidth = imgWidth * scale;
          const drawHeight = imgHeight * scale;
          const offsetX = (cWidth - drawWidth) / 2;
          const offsetY = (cHeight - drawHeight) / 2;

          ctx.fillStyle = "#030304";
          ctx.fillRect(0, 0, cWidth, cHeight);
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }

        // Increment frame for seamless 60 FPS loop
        currentFrameRef.current = (currentFrame + 1) % frameCount;
      }

      rafIdRef.current = requestAnimationFrame(render);
    };

    rafIdRef.current = requestAnimationFrame(render);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isActive, isLoaded, frameCount]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#030304] overflow-hidden">
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Loading Skeleton / Loader when frames are caching */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#030304]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
            <span className="text-xs font-mono tracking-widest text-white/50 uppercase">
              Initializing Studio View...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
