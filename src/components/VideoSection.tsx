"use client";
import React, { useState } from "react";

export default function VideoSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section
        className="relative py-36 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url(/assets/images/backgrounds/video-bg-1-1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10 text-center px-4">
          {/* Play button */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Play video"
            className="group inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-spa-gold text-spa-gold hover:bg-spa-gold hover:text-black transition-all duration-300 mb-8 mx-auto shadow-gold"
          >
            <svg
              className="w-10 h-10 translate-x-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          {/* Pulse rings */}
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="w-24 h-24 rounded-full border border-spa-gold/30 animate-ping absolute" />
            <span className="w-32 h-32 rounded-full border border-spa-gold/20 animate-ping absolute" style={{ animationDelay: "0.3s" }} />
          </span>

          <p className="font-alex text-spa-gold text-2xl mb-2">Watch Our Story</p>
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-white max-w-xl mx-auto leading-tight">
            Experience the Art of True Wellness
          </h2>
          <p className="text-gray-400 mt-4 max-w-md mx-auto text-sm tracking-wide">
            Step inside our sanctuary and discover what makes Solox the premier
            destination for luxury spa & wellness in the city.
          </p>
        </div>
      </section>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/wSQw2CQXMS0?autoplay=1"
              title="Spa Video"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-spa-gold text-3xl font-light"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
