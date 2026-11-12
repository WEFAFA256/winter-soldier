"use client";
import React, { useState } from "react";

const faqs = [
  {
    q: "What should I expect during my first visit?",
    a: "Your first visit begins with a private wellness consultation. A specialist will review your health profile, discuss your wellness goals, and tailor the perfect treatment sequence. Allow an extra 20 minutes before your scheduled session.",
  },
  {
    q: "Do I need to bring anything to my appointment?",
    a: "Nothing at all — we provide premium robes, slippers, towels, and all personal care amenities. Simply arrive, relax, and let us take care of everything from the moment you step through our doors.",
  },
  {
    q: "What is your cancellation policy?",
    a: "We ask for at least 24 hours' notice for cancellations or rescheduling. Cancellations within 24 hours are subject to a 50% service charge. No-shows are charged in full. Members enjoy one complimentary late cancellation per month.",
  },
  {
    q: "Are your treatments suitable for all skin types?",
    a: "Yes. Our therapists conduct a brief skin and health assessment prior to any facial or body treatment. All product selections are adapted to your specific skin type, sensitivities, and goals using our curated line of organic formulations.",
  },
  {
    q: "Do you offer couples or group packages?",
    a: "Absolutely. Our signature Couples Retreat is available in our private double suite. For groups of 6 or more, we offer bespoke corporate and celebration packages — contact our concierge team for bespoke pricing and scheduling.",
  },
  {
    q: "Is Solox membership worth it?",
    a: "Our members save an average of 35% per visit and receive priority booking, exclusive seasonal rituals, complimentary birthday treatments, and access to our members-only wellness lounge. Most guests recoup the membership fee within two visits.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 bg-spa-card">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-alex text-spa-gold text-3xl mb-2">
            Frequently Asked
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-white">
            Questions & Answers
          </h2>
          <div className="mx-auto mt-4 w-14 h-px bg-spa-gold/60" />
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={idx}
                className={`border ${
                  isOpen ? "border-spa-gold/50" : "border-spa-border"
                } rounded-sm overflow-hidden transition-colors duration-300`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left group"
                >
                  <span
                    className={`font-cormorant text-lg md:text-xl font-semibold transition-colors duration-200 ${
                      isOpen ? "text-spa-gold" : "text-white group-hover:text-spa-gold"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={`ml-4 flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "border-spa-gold bg-spa-gold text-black rotate-45"
                        : "border-spa-border text-gray-400 group-hover:border-spa-gold group-hover:text-spa-gold"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Author callout */}
        <div className="mt-12 flex items-center gap-5 bg-spa-bg border border-spa-border rounded-sm p-6">
          <img
            src="/assets/images/resources/faq-1-author.jpg"
            alt="Expert"
            className="w-16 h-16 rounded-full object-cover border-2 border-spa-gold/40 flex-shrink-0"
          />
          <div>
            <p className="text-white font-cormorant text-lg font-semibold">
              Still have questions?
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Our wellness concierge team is available 7 days a week.{" "}
              <a href="#contact" className="text-spa-gold hover:underline">
                Contact us →
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
