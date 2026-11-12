"use client";
import React, { useRef, useState } from "react";

const images = [
  "/assets/images/instagram/instagram-2-1.jpg",
  "/assets/images/instagram/instagram-2-2.jpg",
  "/assets/images/instagram/instagram-2-3.jpg",
  "/assets/images/instagram/instagram-2-4.jpg",
  "/assets/images/instagram/instagram-2-5.jpg",
];

export default function GallerySection() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <section className="py-24 bg-spa-bg">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="font-alex text-spa-gold text-3xl mb-2">Gallery</p>
            <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-white">
              Inside Our Sanctuary
            </h2>
            <div className="mx-auto mt-4 w-14 h-px bg-spa-gold/60" />
          </div>

          {/* Instagram-style grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {images.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setLightbox(src)}
                className="group relative aspect-square overflow-hidden rounded-sm focus:outline-none"
              >
                <img
                  src={src}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* hover overlay */}
                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                    />
                  </svg>
                </span>
              </button>
            ))}
          </div>

          {/* Instagram handle */}
          <p className="text-center mt-8 text-gray-500 text-sm tracking-widest uppercase">
            Follow us on Instagram{" "}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-spa-gold hover:underline ml-1"
            >
              @solox.wellness
            </a>
          </p>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Gallery full"
            className="max-w-full max-h-full object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-white hover:text-spa-gold text-4xl font-light leading-none"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
