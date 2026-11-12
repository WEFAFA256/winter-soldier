import React from "react";
import { CheckCircle2, Award, Sparkles } from "lucide-react";

export default function AboutSection() {
  const highlights = [
    "100% Certified Organic Cosmetics & Essential Oils",
    "Tailored Thermal, Mineral & Hydro Wellness Programs",
    "Private Sanctuary Suites with Dedicated Specialists",
    "Personalized Aromatherapy with Bespoke Infusions",
  ];

  return (
    <section id="about" className="py-24 bg-spa-secondary relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image */}
              <div className="relative rounded-lg overflow-hidden border border-spa-border/60 shadow-2xl">
                <img
                  src="/assets/images/resources/about-2-1.jpg"
                  alt="Solox Sanctuary Interior"
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>

              {/* Floating 28 Years Badge */}
              <div className="absolute -bottom-8 -left-6 md:-left-8 bg-spa-card/95 border-2 border-spa-gold p-6 rounded-lg shadow-gold backdrop-blur-md max-w-[220px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-spa-gold/20 flex items-center justify-center text-spa-gold">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="font-cormorant text-3xl font-bold text-white">28+</span>
                </div>
                <p className="text-xs uppercase tracking-wider text-spa-gold font-bold">Years of Pure Excellence</p>
                <p className="text-[11px] text-gray-400 mt-1">Honored across 15+ international wellness awards</p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 text-spa-gold text-xs uppercase tracking-widest font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Get To Know Solox
            </div>

            <h2 className="font-cormorant text-3xl sm:text-5xl font-bold text-white leading-tight mb-6">
              A World-Class Haven of Body, Mind & Spiritual Rejuvenation
            </h2>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 font-light">
              Nestled in tranquil seclusion, Solox was conceived to provide deeply immersive restorative rituals. We fuse ancient eastern healing arts with modern physiological wellness therapies to release stress, nourish dermal radiance, and restore inner equilibrium.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-spa-gold shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-gray-200 font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Author / Signature Footer */}
            <div className="pt-6 border-t border-spa-border/40 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/images/resources/about-author-1.png"
                  alt="Founder"
                  className="w-14 h-14 rounded-full border border-spa-gold object-cover"
                />
                <div>
                  <h4 className="font-cormorant text-xl font-bold text-white">Jessica Brown</h4>
                  <p className="text-xs text-spa-gold uppercase tracking-wider">Founder & Master Therapist</p>
                </div>
              </div>

              <img
                src="/assets/images/resources/about-sign-2.png"
                alt="Signature"
                className="h-10 w-auto opacity-80 invert filter"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
