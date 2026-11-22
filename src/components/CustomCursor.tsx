"use client";

import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client with fine pointer (mouse, not touch)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let isClicking = false;
    let rafId: number;

    const render = () => {
      // Fluid luxury lerp damping (0.16 = silk smooth magnetic follower)
      const ease = 0.16;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      // GPU-accelerated transform positioning (uniformly small, no hover expansion)
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)${
        isClicking ? " scale(0.85)" : ""
      }`;

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      rafId = requestAnimationFrame(render);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        // Only hide the native cursor once we know where the custom one is.
        document.body.classList.add("cursor-ready");
        ring.style.opacity = "1";
        dot.style.opacity = "1";
        // Initialize position on first move to prevent flying in from corner
        ringX = mouseX;
        ringY = mouseY;
      }
    };

    const onMouseDown = () => {
      isClicking = true;
      ring.classList.add("cursor-active");
    };

    const onMouseUp = () => {
      isClicking = false;
      ring.classList.remove("cursor-active");
    };

    const onMouseLeave = () => {
      isVisible = false;
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };

    const onMouseEnter = () => {
      isVisible = true;
      document.body.classList.add("cursor-ready");
      ring.style.opacity = "1";
      dot.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      document.body.classList.remove("cursor-ready");
    };
  }, []);

  return (
    <>
      {/* Outer Floating Follower Ring - Uniformly Small */}
      <div
        ref={ringRef}
        className="luxury-cursor__ring"
        aria-hidden="true"
      />
      {/* Inner Precision Center Dot - Uniformly Small */}
      <div
        ref={dotRef}
        className="luxury-cursor__dot"
        aria-hidden="true"
      />
    </>
  );
}
