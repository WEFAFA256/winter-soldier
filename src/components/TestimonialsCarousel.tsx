"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Sparkles, Quote } from "lucide-react";

interface Testimonial {
  hash: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  isFeatured?: boolean;
  profileLink?: string;
}

const testimonials: Testimonial[] = [
  {
    hash: "item1",
    name: "Eleanor Vance",
    role: "Verified Guest",
    avatar: "/assets/images/resources/testi-1-1.jpg",
    quote:
      "Saturday at Solox is an otherworldly experience. It is not selfish to love yourself, take care of your body, and make peace your priority. The aromatherapy session completely restored my vitality.",
  },
  {
    hash: "item2",
    name: "Mike Hardson",
    role: "FEATURED • Master Therapist",
    avatar: "/assets/images/resources/testi-1-2.jpg",
    quote:
      "Witnessing our guests transition from exhaustion to effortless radiance is our highest calling. Our bespoke hydro-rituals and thermal healing spaces are crafted to deliver nothing less than perfection.",
    isFeatured: true,
    profileLink: "/profile/mike-hardson",
  },
  {
    hash: "item3",
    name: "Jessica Rose",
    role: "Regular Wellness Member",
    avatar: "/assets/images/resources/testi-1-3.jpg",
    quote:
      "The private thermal suites and organic botanical facials are unmatched anywhere in the city. The serene ambiance instantly dissolves any fatigue or anxiety.",
  },
  {
    hash: "item4",
    name: "David Miller",
    role: "Executive Member",
    avatar: "/assets/images/resources/testi-1-4.jpg",
    quote:
      "An essential sanctuary for anyone demanding elite quality. The heated volcanic river stones and attentive staff ensure an unforgettable rejuvenating escape every visit.",
  },
  {
    hash: "item5",
    name: "Sophia Laurent",
    role: "VIP Member",
    avatar: "/assets/images/resources/testi-1-5.jpg",
    quote:
      "From the welcoming herbal infusion teas to the restorative eucalyptus sauna, every single detail reflects unparalleled luxury and heartfelt craftsmanship.",
  },
];

export default function TestimonialsCarousel() {
  const [activeHash, setActiveHash] = useState("item2"); // Default to item2 as requested

  const current = testimonials.find((t) => t.hash === activeHash) || testimonials[1];

  return (
    <section
      id="testimonials"
      className="py-24 bg-cover bg-center relative"
      style={{
        backgroundImage: "url(/assets/images/backgrounds/testimonial-bg-1.jpg)",
      }}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 text-spa-gold text-xs uppercase tracking-widest font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Voices of Harmony
        </div>

        <h2 className="font-cormorant text-3xl sm:text-5xl font-bold text-white mb-12">
          Testimonials & Master Insights
        </h2>

        {/* Active Testimonial Card */}
        <div
          id={current.hash}
          className="bg-spa-card/90 border border-spa-border p-8 sm:p-12 rounded-2xl shadow-2xl relative max-w-3xl mx-auto transition-all duration-500"
        >
          {/* Top Featured Badge if item2 */}
          {current.isFeatured && (
            <div className="mb-4">
              <span className="solox-badge-featured">
                FEATURED
              </span>
            </div>
          )}

          {/* Stars */}
          <div className="flex justify-center items-center gap-1.5 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-spa-gold text-spa-gold" />
            ))}
          </div>

          {/* Quote Icon & Text */}
          <Quote className="w-10 h-10 text-spa-gold/30 mx-auto mb-4" />
          <p className="font-cormorant text-xl sm:text-2xl text-gray-100 font-light italic leading-relaxed mb-6">
            &ldquo;{current.quote}&rdquo;
          </p>

          {/* Name & Role */}
          <h4 className="font-cormorant text-2xl font-bold text-white">{current.name}</h4>
          <p className={`text-xs uppercase tracking-wider mt-1 ${current.isFeatured ? "text-spa-gold font-bold" : "text-gray-400"}`}>
            {current.role}
          </p>

          {/* Action button if Featured */}
          {current.isFeatured && current.profileLink && (
            <div className="mt-6">
              <Link href={current.profileLink} className="solox-btn py-2.5 px-6 text-xs">
                <span>View Profile</span>
              </Link>
            </div>
          )}
        </div>

        {/* Thumbnail Selector (Anchor Navigation matching #item1, #item2, etc.) */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-10">
          {testimonials.map((t) => {
            const isSelected = activeHash === t.hash;
            return (
              <button
                key={t.hash}
                id={`thumb-${t.hash}`}
                onClick={() => setActiveHash(t.hash)}
                className={`flex items-center gap-3 p-2 rounded-full border transition-all duration-300 ${
                  isSelected
                    ? "border-spa-gold bg-spa-card shadow-gold ring-1 ring-spa-gold scale-105"
                    : "border-spa-border/50 bg-spa-card/60 opacity-60 hover:opacity-100 hover:border-spa-gold"
                }`}
              >
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-xs font-semibold text-white pr-3 hidden sm:inline-block">
                  {t.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
