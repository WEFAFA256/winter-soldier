"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, Clock, User, Mail, Phone, CheckCircle } from "lucide-react";

export default function BookingForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-24 bg-spa-bg relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Info Column */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 text-spa-gold text-xs uppercase tracking-widest font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Private Concierge
            </div>
            <h2 className="font-cormorant text-3xl sm:text-5xl font-bold text-white mb-6">
              Reserve Your Bespoke Rejuvenation Journey
            </h2>
            <p className="text-spa-muted text-sm leading-relaxed mb-8 font-light">
              Our specialists are ready to tailor every touch, scent, and temperature to your distinct physiological preferences. Select your desired ritual and specialist below.
            </p>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-spa-secondary border border-spa-border flex items-center justify-center text-spa-gold shrink-0">
                  <Phone className="w-4 h-4" />
                </span>
                <span>Direct Hotline: +1 (800) 555-SOLOX</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-spa-secondary border border-spa-border flex items-center justify-center text-spa-gold shrink-0">
                  <Mail className="w-4 h-4" />
                </span>
                <span>VIP Bookings: reservations@solox-spa.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-spa-secondary border border-spa-border flex items-center justify-center text-spa-gold shrink-0">
                  <Clock className="w-4 h-4" />
                </span>
                <span>Open 24 Hours (Appointments Preferred)</span>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-spa-card/90 border border-spa-border p-8 sm:p-10 rounded-2xl shadow-2xl relative">
              {submitted ? (
                <div className="text-center py-12 animate-fadeIn">
                  <CheckCircle className="w-16 h-16 text-spa-gold mx-auto mb-4" />
                  <h3 className="font-cormorant text-3xl font-bold text-white mb-2">Reservation Request Received</h3>
                  <p className="text-gray-300 text-sm max-w-md mx-auto">
                    Thank you. Our spa concierge will contact you via email or phone within 15 minutes to confirm your specialist and suite reservation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-spa-gold mb-2 font-semibold">
                        Your Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Amanda Stone"
                          className="w-full bg-spa-secondary border border-spa-border rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-spa-gold transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-spa-gold mb-2 font-semibold">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          placeholder="amanda@example.com"
                          className="w-full bg-spa-secondary border border-spa-border rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-spa-gold transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-spa-gold mb-2 font-semibold">
                        Select Ritual / Therapy
                      </label>
                      <select className="w-full bg-spa-secondary border border-spa-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-spa-gold transition-colors">
                        <option value="sauna">Sauna Relax Experience ($29.00)</option>
                        <option value="aroma">Aromatherapy Full Body ($69.00)</option>
                        <option value="reflexology">Acupressure Reflexology ($16.00)</option>
                        <option value="stone">Thermo Basalt Stone ($43.00)</option>
                        <option value="thai">Thai Herbal Compress ($55.00)</option>
                        <option value="facial">Cellular Glow Facial ($38.00)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-spa-gold mb-2 font-semibold">
                        Preferred Specialist
                      </label>
                      <select className="w-full bg-spa-secondary border border-spa-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-spa-gold transition-colors">
                        <option value="mike">Mike Hardson (FEATURED • Lead Hydro-Therapist)</option>
                        <option value="eleanor">Eleanor Vance (Senior Aromatherapist)</option>
                        <option value="jessica">Jessica Rose (Holistic Aesthetician)</option>
                        <option value="david">David Miller (Thermal & Stone Specialist)</option>
                        <option value="any">Any Available Master Therapist</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-spa-gold mb-2 font-semibold">
                        Desired Date
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                        <input
                          type="date"
                          required
                          className="w-full bg-spa-secondary border border-spa-border rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-spa-gold transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-spa-gold mb-2 font-semibold">
                        Time Slot
                      </label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                        <input
                          type="time"
                          required
                          className="w-full bg-spa-secondary border border-spa-border rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-spa-gold transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-spa-gold mb-2 font-semibold">
                      Special Requests / Medical Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify allergies, preferred oils, or pressure preferences..."
                      className="w-full bg-spa-secondary border border-spa-border rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-spa-gold transition-colors"
                    />
                  </div>

                  <button type="submit" className="w-full solox-btn py-3.5 mt-2">
                    <span>Confirm Booking Request</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
