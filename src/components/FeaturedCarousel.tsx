"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Sparkles, UserCheck } from "lucide-react";
import { specialistsData, Specialist } from "@/data/specialists";

export default function FeaturedCarousel() {
  const [startIndex, setStartIndex] = useState(0);
  const [activeItem, setActiveItem] = useState("item2"); // Default highlighted on item2 as requested

  useEffect(() => {
    // Check if URL hash matches item2 or other items
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash && specialistsData.some((s) => s.hash === hash)) {
        setActiveItem(hash);
        const foundIdx = specialistsData.findIndex((s) => s.hash === hash);
        if (foundIdx !== -1) {
          setStartIndex(Math.min(foundIdx, specialistsData.length - 1));
        }
      }
    }
  }, []);

  const next = () => {
    setStartIndex((prev) => (prev + 1) % specialistsData.length);
  };

  const prev = () => {
    setStartIndex((prev) => (prev - 1 + specialistsData.length) % specialistsData.length);
  };

  return (
    <section id="featured-profiles" className="py-24 bg-spa-bg relative overflow-hidden border-t border-spa-border/30">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-spa-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-spa-gold text-xs uppercase tracking-widest font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Top Tier Practitioners
          </div>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-bold text-white mb-4">
            Featured Wellness Specialists
          </h2>
          <p className="text-spa-muted text-sm md:text-base font-light">
            Indulge in sessions led by world-renowned specialists dedicated to personalized restoration and holistic excellence.
          </p>
        </div>

        {/* Carousel Slider Controls */}
        <div className="flex justify-end items-center gap-3 mb-8">
          <button
            onClick={prev}
            aria-label="Previous specialist"
            className="w-11 h-11 rounded-full border border-spa-border bg-spa-card flex items-center justify-center text-white hover:text-spa-gold hover:border-spa-gold transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next specialist"
            className="w-11 h-11 rounded-full border border-spa-border bg-spa-card flex items-center justify-center text-white hover:text-spa-gold hover:border-spa-gold transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Cards Grid / Carousel View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialistsData.map((item) => {
            const isHighlighted = activeItem === item.hash;

            return (
              <div
                key={item.id}
                id={item.hash}
                onClick={() => setActiveItem(item.hash)}
                className={`group relative bg-spa-card rounded-xl overflow-hidden border transition-all duration-500 cursor-pointer ${
                  isHighlighted
                    ? "border-spa-gold shadow-gold ring-1 ring-spa-gold"
                    : "border-spa-border hover:border-spa-gold/60 hover:-translate-y-1.5"
                }`}
              >
                {/* Photo & Badge */}
                <div className="relative h-72 sm:h-80 overflow-hidden bg-black">
                  {/* FEATURED Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="solox-badge-featured flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      {item.badge}
                    </span>
                  </div>

                  {/* Active Indicator Pin */}
                  {isHighlighted && (
                    <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-spa-gold text-[11px] text-spa-gold font-bold flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      SELECTED
                    </div>
                  )}

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-spa-card via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                  <p className="text-xs uppercase tracking-widest text-spa-gold font-semibold mb-1">
                    {item.designation}
                  </p>

                  <h3 className="font-cormorant text-2xl font-bold text-white mb-2 group-hover:text-spa-gold transition-colors">
                    {item.name}
                  </h3>

                  {/* Rating Stars */}
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-spa-gold text-spa-gold" />
                    ))}
                    <span className="text-xs text-gray-400 ml-1.5 font-medium">
                      ({item.rating.toFixed(1)} / {item.reviewCount} reviews)
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 font-light line-clamp-2 mb-6 px-2">
                    {item.bio}
                  </p>

                  {/* Action: View Profile */}
                  <Link
                    href={`/profile/${item.slug}`}
                    className="w-full solox-btn flex items-center justify-center gap-2 py-3"
                  >
                    <span>View Profile</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Note / Indicator */}
        <div className="mt-12 text-center">
          <p className="text-xs text-spa-muted flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-spa-gold animate-ping" />
            Showing Specialists 1 to {specialistsData.length} • Click any profile to inspect individual qualifications
          </p>
        </div>
      </div>
    </section>
  );
}
