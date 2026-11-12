"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface Slide {
  id: number;
  image: string;
  tagline: string;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/assets/images/backgrounds/slider-2-1.jpg",
    tagline: "Place of your beauty & serenity",
    title: "Beauty Spa & Luxury Sanctuary",
    subtitle: "Immerse yourself in sensory tranquility with bespoke holistic therapies and curated mineral baths.",
  },
  {
    id: 2,
    image: "/assets/images/backgrounds/slider-2-2.jpg",
    tagline: "Exclusive Wellness Experiences",
    title: "Restore Harmony, Mind & Soul",
    subtitle: "Experience therapeutic hydro-massages, authentic herbal saunas, and rejuvenating stone treatments.",
  },
  {
    id: 3,
    image: "/assets/images/backgrounds/slider-2-3.jpg",
    tagline: "Bespoke Botanical Formulations",
    title: "Natural Organic Healing Treatments",
    subtitle: "Pure organic botanical infusions crafted by master therapists to revive radiance and vitality.",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section id="hero" className="relative h-screen min-h-[700px] w-full overflow-hidden bg-black">
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image with Dark Vignette & Gradient */}
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-[7000ms] ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-spa-bg via-black/60 to-black/40" />
            </div>

            {/* Slide Content */}
            <div className="relative z-20 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center items-center text-center">
              <div
                className={`transition-all duration-1000 delay-200 transform ${
                  isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-spa-secondary/80 border border-spa-border/60 text-spa-gold text-xs uppercase tracking-widest font-semibold mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  {slide.tagline}
                </div>

                <h1 className="font-cormorant text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white max-w-4xl mx-auto leading-tight mb-6">
                  {slide.title}
                </h1>

                <p className="text-gray-300 text-base md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                  {slide.subtitle}
                </p>

                <div className="flex flex-wrap justify-center items-center gap-4">
                  <a href="#treatments" className="solox-btn">
                    <span>Explore Treatments</span>
                  </a>
                  <a
                    href="#featured-profiles"
                    className="px-7 py-3 text-xs uppercase tracking-wider font-bold text-white border border-spa-border hover:border-spa-gold hover:text-spa-gold transition-all duration-300 rounded"
                  >
                    View Specialists
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-spa-border/60 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:text-spa-gold hover:border-spa-gold hover:bg-black/70 transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-spa-border/60 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:text-spa-gold hover:border-spa-gold hover:bg-black/70 transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              idx === current ? "w-8 h-2 bg-spa-gold" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
