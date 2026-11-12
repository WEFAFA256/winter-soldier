"use client";
import React from "react";

const steps = [
  {
    number: "01",
    title: "Book a Consultation",
    description:
      "Begin with a personal wellness consultation where our expert therapists assess your needs, health history, and goals to craft the ideal treatment plan for you.",
    image: "/assets/images/resources/work-process-1.jpg",
  },
  {
    number: "02",
    title: "Customized Treatment",
    description:
      "Experience a bespoke session designed exclusively around your body and mind. Every product, technique, and environment is curated to your unique profile.",
    image: "/assets/images/resources/work-process-2.jpg",
  },
  {
    number: "03",
    title: "Ongoing Wellness",
    description:
      "Sustain your transformation with tailored follow-up programs, membership benefits, and exclusive access to our wellness community and seasonal rituals.",
    image: "/assets/images/resources/work-process-3.jpg",
  },
];

export default function WorkProcessSection() {
  return (
    <section className="py-24 bg-spa-bg">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-alex text-spa-gold text-3xl mb-2">Our Process</p>
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-white">
            How We Work
          </h2>
          <div className="mx-auto mt-4 w-14 h-px bg-spa-gold/60" />
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, idx) => (
            <div key={idx} className="group flex flex-col">
              {/* Image */}
              <div className="relative overflow-hidden rounded-sm mb-6 aspect-[4/3]">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Step number badge */}
                <span className="absolute top-4 left-4 w-12 h-12 flex items-center justify-center rounded-full bg-spa-gold text-black font-cormorant font-bold text-xl shadow-lg">
                  {step.number}
                </span>
              </div>

              {/* Connector line (not on last) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-12 h-px bg-spa-gold/30" />
              )}

              <h3 className="font-cormorant text-2xl font-semibold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
