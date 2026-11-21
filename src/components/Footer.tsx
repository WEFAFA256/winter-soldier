"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-spa-secondary border-t border-spa-border/40 text-gray-400 text-xs pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top Newsletter Card */}
        <div className="bg-spa-card border border-spa-border p-8 rounded-2xl mb-16 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-spa-gold text-xs uppercase tracking-widest font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              VIP Newsletter
            </div>
            <h4 className="font-cormorant text-2xl text-white font-bold">
              Join Our Exclusive Wellness Circle
            </h4>
            <p className="text-gray-400 text-xs font-light">
              Receive private monthly invitations, seasonal ritual previews, and member specials.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-spa-secondary border border-spa-border px-4 py-2.5 rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none focus:border-spa-gold w-full sm:w-64"
            />
            <button type="submit" className="solox-btn py-2.5 px-5 shrink-0 flex items-center gap-1.5">
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1 */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="font-cormorant text-2xl font-bold tracking-wider text-white">
                SOLOX<span className="text-spa-gold">.</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed mb-4 font-light">
              A bespoke luxury sanctuary offering thermal healing, organic botanical infusions, and transformative wellness rituals.
            </p>
            <p className="text-spa-gold font-medium">Appointments & VIP Access: +1 (800) 555-SOLOX</p>
          </div>

          {/* Col 2 */}
          <div>
            <h5 className="font-cormorant text-lg font-bold text-white uppercase tracking-wider mb-4 border-b border-spa-border/40 pb-2">
              Featured Rituals
            </h5>
            <ul className="space-y-2.5">
              <li><a href="#treatments" className="hover:text-spa-gold transition-colors">Sauna Relax Ritual</a></li>
              <li><a href="#treatments" className="hover:text-spa-gold transition-colors">Aromatherapy Full Body</a></li>
              <li><a href="#treatments" className="hover:text-spa-gold transition-colors">Heated Basalt Stone Massage</a></li>
              <li><a href="#treatments" className="hover:text-spa-gold transition-colors">Acupressure Reflexology</a></li>
              <li><a href="#treatments" className="hover:text-spa-gold transition-colors">Organic Cellular Facial</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5 className="font-cormorant text-lg font-bold text-white uppercase tracking-wider mb-4 border-b border-spa-border/40 pb-2">
              Navigation
            </h5>
            <ul className="space-y-2.5">
              <li><a href="#hero" className="hover:text-spa-gold transition-colors">Home & Sanctuary</a></li>
              <li><a href="#about" className="hover:text-spa-gold transition-colors">About Our Philosophy</a></li>
              <li><a href="#featured-profiles" className="hover:text-spa-gold transition-colors">Featured Specialists</a></li>
              <li><a href="#testimonials" className="hover:text-spa-gold transition-colors">Guest Testimonials</a></li>
              <li><a href="#contact" className="hover:text-spa-gold transition-colors">Reserve Appointment</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h5 className="font-cormorant text-lg font-bold text-white uppercase tracking-wider mb-4 border-b border-spa-border/40 pb-2">
              Sanctuary Hours
            </h5>
            <p className="text-sm text-spa-gold font-semibold">Open 24 Hours, 7 Days a Week</p>
            <p className="text-[11px] text-gray-500 mt-4">
              Appointments available day or night by request.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-spa-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} Solox Spa & Sanctuary. All rights reserved.</p>
          <p className="text-gray-400">
            Reconstructed with Next.js, React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
