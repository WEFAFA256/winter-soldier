"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, Clock, Menu, X, Sparkles, ChevronRight } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Treatments", href: "#treatments" },
    { label: "Featured", href: "#featured-profiles" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      {/* Topbar */}
      <div
        className={`bg-spa-secondary/95 border-b border-spa-border/40 py-2.5 px-4 md:px-8 text-xs text-spa-muted transition-all duration-300 ${
          isScrolled ? "hidden md:block py-1.5 opacity-90" : "block"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-2 hover:text-spa-gold transition-colors">
              <Phone className="w-3.5 h-3.5 text-spa-gold" />
              +1 (800) 555-SOLOX
            </span>
            <span className="flex items-center gap-2 hover:text-spa-gold transition-colors hidden sm:flex">
              <Mail className="w-3.5 h-3.5 text-spa-gold" />
              concierge@solox-spa.com
            </span>
            <span className="flex items-center gap-2 hidden lg:flex">
              <Clock className="w-3.5 h-3.5 text-spa-gold" />
              Mon - Sat: 9:00 AM - 8:00 PM
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-spa-gold font-medium flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              VIP Member Perks Available
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full px-4 md:px-8 transition-all duration-300 ${
          isScrolled
            ? "bg-spa-bg/95 backdrop-blur-md py-4 shadow-xl border-b border-spa-border"
            : "bg-spa-bg/70 backdrop-blur-sm py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/assets/images/logo-light.png"
              alt="Solox Spa & Wellness"
              className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
              onError={(e) => {
                // Fallback elegant text logo if image fails
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <span className="font-cormorant text-2xl md:text-3xl font-bold tracking-wider text-white">
              SOLOX<span className="text-spa-gold">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium tracking-wider text-gray-200 hover:text-spa-gold uppercase transition-colors relative group py-1"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-spa-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Action CTA & Mobile Trigger */}
          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="solox-btn hidden sm:inline-flex items-center gap-2"
            >
              <span>Book Appointment</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-spa-gold focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-spa-card/98 border-b border-spa-border px-6 py-8 shadow-2xl backdrop-blur-xl animate-fadeIn">
          <div className="flex flex-col gap-5">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-cormorant uppercase tracking-widest text-white hover:text-spa-gold transition-colors py-2 border-b border-white/5"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="solox-btn text-center mt-3"
            >
              <span>Book Appointment</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
