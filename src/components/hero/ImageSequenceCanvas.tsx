"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface ImageSequenceCanvasProps {
  onProgress?: (progress: number) => void;
  onLoaded?: () => void;
  onSequenceComplete?: () => void;
  isReadyToPlay?: boolean;
}

const TOTAL_FRAMES = 300;

export default function ImageSequenceCanvas({
  onProgress,
  onLoaded,
  onSequenceComplete,
  isReadyToPlay = false,
}: ImageSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Preload and cache all 300 image frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    const padZero = (num: number) => num.toString().padStart(3, "0");

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameIndex = padZero(i);
      img.src = `/frames/ezgif-frame-${frameIndex}.jpg`;

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
        // Retry logic or fallback graceful handling
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

  // High-performance canvas draw function with aspect ratio preservation
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Calculate aspect fill & position
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const imgAspect = imgWidth / imgHeight;
    const screenAspect = displayWidth / displayHeight;

    let drawWidth = displayWidth;
    let drawHeight = displayHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (screenAspect > imgAspect) {
      drawWidth = displayWidth;
      drawHeight = displayWidth / imgAspect;
      offsetY = (displayHeight - drawHeight) / 2;
    } else {
      drawHeight = displayHeight;
      drawWidth = displayHeight * imgAspect;
      offsetX = (displayWidth - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, displayWidth, displayHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    ctx.restore();
  }, []);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      renderFrame(currentFrameRef.current);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame]);

  // Initial draw of first frame once preloaded
  useEffect(() => {
    if (imagesLoaded && imagesRef.current.length > 0) {
      renderFrame(0);
    }
  }, [imagesLoaded, renderFrame]);

  // Main playback animation loop using requestAnimationFrame
  useEffect(() => {
    if (!isReadyToPlay || !imagesLoaded || hasCompleted) return;

    let lastTime = performance.now();
    const fps = 30; // Target 30 FPS playback speed for cinematic feel across 300 frames (~10 sec timeline)
    const interval = 1000 / fps;

    const tick = (now: number) => {
      const delta = now - lastTime;

      if (delta >= interval) {
        lastTime = now - (delta % interval);

        if (currentFrameRef.current < TOTAL_FRAMES - 1) {
          currentFrameRef.current += 1;
          renderFrame(currentFrameRef.current);
          animationFrameIdRef.current = requestAnimationFrame(tick);
        } else {
          // Reached final frame 300!
          // Freeze permanently on frame 300! Do NOT loop or restart!
          renderFrame(TOTAL_FRAMES - 1);
          setHasCompleted(true);
          if (onSequenceComplete) {
            onSequenceComplete();
          }
        }
      } else {
        animationFrameIdRef.current = requestAnimationFrame(tick);
      }
    };

    animationFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isReadyToPlay, imagesLoaded, hasCompleted, renderFrame, onSequenceComplete]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block will-change-transform transform-gpu"
        style={{ width: "100vw", height: "100vh" }}
      />
    </div>
  );
}
