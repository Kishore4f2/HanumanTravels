"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface JourneyCanvasProps {
  onProgress?: (progress: number) => void;
  onLoaded?: () => void;
}

const TOTAL_FRAMES = 300;

export default function JourneyCanvas({ onProgress, onLoaded }: JourneyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [inViewport, setInViewport] = useState(false);

  // Preload and cache all 300 frames of the second sequence
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    const padZero = (num: number) => num.toString().padStart(3, "0");

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameIndex = padZero(i);
      img.src = `/frames2/ezgif-frame-${frameIndex}.jpg`;

      img.onload = () => {
        loadedCount++;
        const pct = (loadedCount / TOTAL_FRAMES) * 100;
        if (onProgress) onProgress(pct);

        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
          if (onLoaded) onLoaded();
        }
      };

      img.onerror = () => {
        loadedCount++;
        const pct = (loadedCount / TOTAL_FRAMES) * 100;
        if (onProgress) onProgress(pct);

        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
          if (onLoaded) onLoaded();
        }
      };

      images.push(img);
    }

    imagesRef.current = images;
  }, [onProgress, onLoaded]);

  // Center and scale preserving full car visibility (no excessive zoom/cropping)
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const displayWidth = rect.width;
    const displayHeight = rect.height;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const imgAspect = imgWidth / imgHeight;
    const canvasAspect = displayWidth / displayHeight;

    let drawWidth = displayWidth;
    let drawHeight = displayHeight;
    let offsetX = 0;
    let offsetY = 0;

    // Use fit contain scaling instead of cover so the car is never cropped/excessively zoomed
    if (canvasAspect > imgAspect) {
      drawHeight = displayHeight;
      drawWidth = displayHeight * imgAspect;
      offsetX = (displayWidth - drawWidth) / 2;
    } else {
      drawWidth = displayWidth;
      drawHeight = displayWidth / imgAspect;
      offsetY = (displayHeight - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, displayWidth, displayHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    ctx.restore();
  }, []);

  // Monitor visibility (play only when >= 50% visible, pause outside viewport)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInViewport(entry.isIntersecting);
      },
      { threshold: 0.5 } // 50% visibility threshold
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Handle resizing
  useEffect(() => {
    const handleResize = () => {
      renderFrame(currentFrameRef.current);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame]);

  // Initial draw
  useEffect(() => {
    if (imagesLoaded && imagesRef.current.length > 0) {
      renderFrame(0);
    }
  }, [imagesLoaded, renderFrame]);

  // requestAnimationFrame playback loop
  useEffect(() => {
    if (!imagesLoaded || !inViewport) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      return;
    }

    let lastTime = performance.now();
    const fps = 30;
    const interval = 1000 / fps;

    const tick = (now: number) => {
      const delta = now - lastTime;

      if (delta >= interval) {
        lastTime = now - (delta % interval);

        currentFrameRef.current = (currentFrameRef.current + 1) % TOTAL_FRAMES;
        renderFrame(currentFrameRef.current);
      }
      animationFrameIdRef.current = requestAnimationFrame(tick);
    };

    animationFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [imagesLoaded, inViewport, renderFrame]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-black/60 rounded-[36px] overflow-hidden">
      {/* Canvas Element */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block will-change-transform transform-gpu"
      />
      {/* Glass Reflection & Inner Glow */}
      <div className="absolute inset-0 pointer-events-none rounded-[36px] border border-white/10 bg-gradient-to-tr from-white/[0.03] to-transparent shadow-[inset_0_4px_30px_rgba(255,255,255,0.05)]" />
    </div>
  );
}
