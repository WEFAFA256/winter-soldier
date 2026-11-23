"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";
import { useSiteContact } from "@/components/ContactProvider";
import {
  fetchSiteContent,
  isRealServiceTitle,
  orderServices,
  splitServiceCatalog,
} from "@/lib/service-order";
import { usePageReveal } from "@/lib/use-page-reveal";

interface Service {
  title: string;
  price: number | string;
  image: string;
  fullImage?: string;
  description: string;
  delay?: string;
  needsCrop?: boolean;
  imageOnly?: boolean;
}


function formatPrice(price: number | string): string {
  if (typeof price === "number") {
    return "UGX " + price.toLocaleString();
  }
  const num = parseInt(String(price).replace(/\D/g, ""), 10);
  if (!isNaN(num) && num > 0) {
    return "UGX " + num.toLocaleString();
  }
  return "UGX " + price;
}


// ── Exact Old Site Scroll Animation & Gold Theme ──
function ServiceCard({
  service,
  index,
  imgSrc,
  fallbackImg,
  whatsappLink,
}: {
  service: Service;
  index: number;
  imgSrc: string;
  fallbackImg: string;
  whatsappLink: (message?: string) => string;
}) {
  // These cards only exist after the catalogue fetch, so they can safely
  // animate on mount; offscreen cards wait for the one-shot scroll reveal.
  const { ref, className: revealClass } = usePageReveal<HTMLDivElement>({
    animateOnMount: true,
  });

  // Delay calculation for column stagger: 0.08s per column
  const staggerDelay = (index % 3) * 0.08;

  // Summarize description: take first sentence or limit to ~60 chars
  const desc = service.description
    ?.split('.')[0]
    .substring(0, 60)
    .trim() + (service.description?.split('.')[0].length > 60 ? '…' : '');

  return (
    <div
      ref={ref}
      className={`col-lg-4 col-md-6 col-12 ${revealClass}`.trim()}
      style={{
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
        '--page-motion-duration': '750ms',
        '--page-motion-delay': `${staggerDelay}s`,
        '--page-motion-offset': '32px',
        willChange: 'transform, opacity',
      } as React.CSSProperties}
    >
      <div
        style={{
          backgroundColor: '#FDF3E6',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          padding: '32px 28px',
        }}
      >
        {/* Card Image — static, fills the entire image area with no empty edges */}
        <div
          style={{ height: '200px', overflow: 'hidden', position: 'relative' }}
        >
          <img
            src={imgSrc}
            alt={service.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImg;
            }}
          />
        </div>

        {/* Card Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 2 }}>
          <h3
            style={{
              fontFamily: 'Cormorant, serif',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#60351A',
              textShadow: 'none',
              margin: 0,
              lineHeight: 1.3,
              letterSpacing: '1.2px',
              textAlign: 'center',
              textTransform: 'none',
            }}
          >
            {service.title}
          </h3>

          <p
            style={{
              fontFamily: 'Cormorant, serif',
              fontSize: '0.95rem',
              fontWeight: 400,
              color: '#60351A',
              textShadow: 'none',
              lineHeight: 1.5,
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            {desc || 'Premium massage therapy.'}
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginTop: 'auto',
              paddingTop: '12px',
            }}
          >
            <Link
              href={'/booking?service=' + encodeURIComponent(service.title) + '&price=' + encodeURIComponent(String(service.price))}
              style={{
                flex: 1,
                maxWidth: '200px',
                padding: '10px 16px',
                backgroundColor: '#60351A',
                border: 'none',
                color: '#FDF3E6',
                borderRadius: '4px',
                fontFamily: 'Cormorant, serif',
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Book Now
            </Link>

            <a
              href={whatsappLink(`Hello, I'd like to book ${service.title} (${service.price}). Please send details and availability.`)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                maxWidth: '200px',
                padding: '10px 16px',
                backgroundColor: '#25D366',
                border: 'none',
                color: '#FDF3E6',
                borderRadius: '4px',
                fontFamily: 'Cormorant, serif',
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              <i className="fab fa-whatsapp" style={{ marginRight: '6px', fontSize: '1rem' }}></i>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function ServicesPage() {
  // Catalogue starts empty and paints only admin-managed R2-backed records.
  const [services, setServices] = useState<Service[]>([]);
  const { phoneHref, phoneDisplay, whatsappDisplay, whatsappLink } = useSiteContact();
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchSiteContent();
        if (data) {
          const catalog = splitServiceCatalog(data);
          if (catalog.services.length > 0) {
            setServices(catalog.services);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load /api/content, trying local JSON...", err);
      }

      try {
        const localRes = await fetch("/site-content.json");
        if (localRes.ok) {
          const localData = await localRes.json();
          if (localData) {
            const catalog = splitServiceCatalog(localData);
            if (catalog.services.length > 0) setServices(catalog.services);
          }
        }
      } catch (localErr) {
        console.error("Failed to load local JSON", localErr);
      } finally {
        setLoading(false);
      }
    };

    loadServices();

    // An admin save should show up in an already-open public tab as soon as the
    // visitor returns to it. The probe is cache-busted and read-only.
    const refreshOnVisible = () => {
      if (document.visibilityState === "visible") loadServices();
    };
    window.addEventListener("focus", refreshOnVisible);
    document.addEventListener("visibilitychange", refreshOnVisible);
    return () => {
      window.removeEventListener("focus", refreshOnVisible);
      document.removeEventListener("visibilitychange", refreshOnVisible);
    };
  }, []);

  // Explicit catalogue order from the site owner first; every unlisted card is
  // merged in by price so nothing disappears from the page.
  const filteredServices = useMemo(() => {
    let list = orderServices(
      services.filter((s) => isRealServiceTitle(s.title)),
      "services"
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.description && s.description.toLowerCase().includes(q))
      );
    }

    if (activeCategory === "all") return list;
    if (activeCategory === "essential") {
      const keywords = ["swedish", "deep", "aroma", "sports", "hotstone", "scrubs", "signature"];
      return list.filter((s) => keywords.some((k) => s.title.toLowerCase().includes(k)));
    }
    if (activeCategory === "sensual") {
      const keywords = ["nuru", "erotic", "tantra", "kamasutra", "b2b", "xclusive"];
      return list.filter((s) => keywords.some((k) => s.title.toLowerCase().includes(k)));
    }
    if (activeCategory === "multihand") {
      const keywords = ["4hands", "6hands"];
      return list.filter((s) => keywords.some((k) => s.title.toLowerCase().includes(k)));
    }
    return list;
  }, [services, activeCategory, searchQuery]);

  return (
    <>
      <CustomCursor />

      <div className="page-wrapper" style={{ backgroundColor: "#0e1317", color: "#c4cfde", minHeight: "100vh" }}>
        {/* --- NATIVE SOLOX LUXURY HEADER --- */}
        <header className="main-header main-header--two sticky-header sticky-header--normal">
          <div className="container-fluid">
            <div className="main-header__inner">
              <div className="main-header__logo">
                <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                  <img
                    src="/assets/logo.jpg"
                    alt="The Serenity Spa"
                    style={{
                      height: "52px",
                      width: "52px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid rgba(194, 167, 78, 0.6)",
                      display: "block",
                    }}
                  />
                </Link>
              </div>

              <nav className="main-header__nav main-menu">
                <ul className="main-menu__list">
                  <li className="">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="current">
                    <Link href="/services">Services</Link>
                  </li>
                  <li className="">
                    <Link href="/vip-packages">VIP Packages</Link>
                  </li>
                  <li className="">
                    <Link href="/mobile-massage">Mobile Massage</Link>
                  </li>
                  <li className="">
                    <Link href="/gallery">Gallery</Link>
                  </li>
                  <li className="">
                    <Link href="/blog">Blog</Link>
                  </li>
                  <li className="">
                    <Link href="/escorts">Escorts</Link>
                  </li>
                </ul>
              </nav>

              <div className="main-header__right">
                <div
                  className="mobile-nav__btn mobile-nav__toggler"
                  onClick={() => setMobileMenuOpen(true)}
                  style={{ cursor: "pointer" }}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <Link href="/booking" className="solox-btn main-header__btn">
                  <span>Book now</span>
                </Link>
              </div>
            </div>
          </div>
          <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </header>

        {/* ─── LUXURY HERO BANNER ─── */}
        <div
          style={{
            position: "relative",
            height: "465px",
            paddingTop: "125px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Background image */}
          <div
            className="page-motion-hero-media"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('/assets/images/backgrounds/services-header-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "scale(1)",
              filter: "brightness(0.35)",
            }}
          />
          {/* Gold gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(194, 167, 78,0.08) 0%, rgba(14,19,23,0.75) 100%)",
            }}
          />
          {/* Text content */}
          <div
            className="page-motion-hero-content"
            style={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              padding: "0 20px",
              opacity: 1,
              transform: "translateY(0)",
            }}
          >
            <span style={{ color: "#c2a74e", fontFamily: "'Great Vibes', cursive, Cormorant, serif", fontSize: "1.5rem", display: "block", marginBottom: "10px", letterSpacing: "2px" }}>
              Indulge &amp; Rejuvenate
            </span>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700, color: "#ffffff", margin: "0 0 12px 0", lineHeight: 1.15 }}>
              Our Spa Services &amp; Wellness Rituals
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(0.85rem, 2vw, 1rem)", maxWidth: "600px", margin: "0 auto 18px auto", lineHeight: 1.6 }}>
              Explore our essential therapies in Kampala — from restorative Swedish strokes and deep tissue therapy to soothing scrubs, aromatherapy, and relaxing couples sessions.
            </p>
            <nav style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
              <span style={{ margin: "0 8px", color: "#c2a74e" }}>/</span>
              <span style={{ color: "#c2a74e" }}>Services</span>
            </nav>
          </div>
        </div>

        {/* --- BALANCED TREATMENT CARDS GRID (PROPORTIONAL 3-COLUMN LAYOUT) --- */}
        <section style={{ padding: "60px 0 90px 0" }}>
          <div className="container">
            {loading ? (
              <div className="card-loading-slot" style={{ textAlign: "center", padding: "80px 0" }}>
                <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
                  <span className="visually-hidden">Loading therapies...</span>
                </div>
                <p style={{ marginTop: "16px", color: "#9ca3af" }}>Loading authentic treatments...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", backgroundColor: "#161c22", borderRadius: "12px", border: "1px dashed rgba(194, 167, 78,0.3)" }}>
                <i className="fas fa-spa" style={{ fontSize: "3rem", color: "#c2a74e", marginBottom: "16px" }}></i>
                <h3 style={{ color: "#fff", fontFamily: "Cormorant, serif", fontSize: "1.8rem" }}>No treatments found</h3>
                <p style={{ color: "#9ca3af", marginBottom: "20px" }}>Try adjusting your search terms or category filter.</p>
                <button
                  onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
                  style={{ padding: "8px 20px", backgroundColor: "#c2a74e", color: "#0e1317", border: "none", borderRadius: "4px", fontWeight: 700, cursor: "pointer" }}
                >
                  Show All Treatments
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {filteredServices.map((service, index) => {
                  const fallbackImg = `/assets/images/resources/service-1-${(index % 5) + 1}.jpg`;
                  const imgSrc = service.image || fallbackImg;

                  return (
                    <ServiceCard
                      key={service.title || index}
                      service={service}
                      index={index}
                      imgSrc={imgSrc}
                      fallbackImg={fallbackImg}
                      whatsappLink={whatsappLink}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>
        {/* --- VIP & EXCLUSIVE RETREAT BANNER --- */}
        <section
          style={{
            padding: "60px 0",
            backgroundColor: "#131920",
            borderTop: "1px solid rgba(194, 167, 78,0.15)",
            borderBottom: "1px solid rgba(194, 167, 78,0.15)",
          }}
        >
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <span style={{ color: "#c2a74e", textTransform: "uppercase", letterSpacing: "2px", fontSize: "12px", fontWeight: 700 }}>
                  Private Suites &amp; Bespoke Packages
                </span>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "2.3rem", fontWeight: 700, color: "#fff", margin: "8px 0 12px 0" }}>
                  Looking for Duo, 4-Hands or Custom Group Sessions?
                </h2>
                <p style={{ color: "#9ca3af", margin: 0, fontSize: "1rem", lineHeight: 1.6, maxWidth: "620px" }}>
                  We arrange tailor-made private suite appointments for couples, multi-therapist treatments, and full-day Turkish Hammam rituals with complimentary refreshments.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <div className="vip-cta-wrap">
                  <Link href="/vip-packages" className="vip-explore-btn">
                    <i className="fas fa-crown" style={{ fontSize: "17px" }}></i>
                    <span>Explore VIP Packages</span>
                    <i className="fas fa-arrow-right" style={{ fontSize: "15px" }}></i>
                  </Link>
                  <a
                    href={whatsappLink("Hello The Serenity Spa, I would like to inquire about bespoke VIP packages and private suite bookings.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vip-concierge-link"
                  >
                    <i className="fab fa-whatsapp" style={{ marginRight: "6px" }}></i>
                    Or chat with our concierge
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- LOCATION, CONTACT & MAP SECTION --- */}
        <section style={{ padding: "80px 0", backgroundColor: "#0e1317" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span style={{ color: "#c2a74e", fontFamily: "Alex Brush, cursive", fontSize: "1.8rem" }}>Visit Sanctuary</span>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "2.6rem", fontWeight: 700, color: "#fff" }}>
                Our Locations &amp; Concierge
              </h2>
            </div>

            <div className="row g-4">
              <div className="col-lg-4">
                <div style={{ backgroundColor: "#161c22", padding: "30px", borderRadius: "10px", border: "1px solid rgba(194, 167, 78,0.2)", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                    <div style={{ width: "46px", height: "46px", borderRadius: "50%", backgroundColor: "rgba(194, 167, 78,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c2a74e", fontSize: "20px" }}>
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h4 style={{ color: "#fff", margin: 0, fontSize: "1.1rem" }}>Spa Locations</h4>
                      <p style={{ color: "#c2a74e", margin: 0, fontSize: "12px" }}>Kampala, Uganda</p>
                    </div>
                  </div>
                  <p style={{ color: "#c4cfde", fontSize: "14px", lineHeight: 1.6 }}>
                    • Sir Apollo Kaggwa Road, Kampala<br />
                    • Mengo Branch, Kampala
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div style={{ backgroundColor: "#161c22", padding: "30px", borderRadius: "10px", border: "1px solid rgba(194, 167, 78,0.2)", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                    <div style={{ width: "46px", height: "46px", borderRadius: "50%", backgroundColor: "rgba(194, 167, 78,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c2a74e", fontSize: "20px" }}>
                      <i className="fas fa-clock"></i>
                    </div>
                    <div>
                      <h4 style={{ color: "#fff", margin: 0, fontSize: "1.1rem" }}>Operating Hours</h4>
                      <p style={{ color: "#c2a74e", margin: 0, fontSize: "12px" }}>Open 7 Days A Week</p>
                    </div>
                  </div>
                  <p style={{ color: "#c4cfde", fontSize: "14px", lineHeight: 1.6 }}>
                    Every day: <strong>Open 24 Hours</strong><br />
                    Mobile &amp; Outcall services available upon early booking.
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div style={{ backgroundColor: "#161c22", padding: "30px", borderRadius: "10px", border: "1px solid rgba(194, 167, 78,0.2)", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                    <div style={{ width: "46px", height: "46px", borderRadius: "50%", backgroundColor: "rgba(194, 167, 78,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c2a74e", fontSize: "20px" }}>
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div>
                      <h4 style={{ color: "#fff", margin: 0, fontSize: "1.1rem" }}>Direct Lines</h4>
                      <p style={{ color: "#c2a74e", margin: 0, fontSize: "12px" }}>Instant Confirmation</p>
                    </div>
                  </div>
                  <p style={{ color: "#c4cfde", fontSize: "14px", lineHeight: 1.6 }}>
                    Phone: <a href={phoneHref} style={{ color: "#fff", textDecoration: "none" }}>{phoneDisplay || "Call us"}</a><br />
                    WhatsApp: <a href={whatsappLink()} style={{ color: "#25D366", textDecoration: "none" }}>{whatsappDisplay || "WhatsApp us"}</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div style={{ marginTop: "40px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(194, 167, 78,0.2)", height: "320px" }}>
              <iframe
                title="The Serenity Spa Kampala"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.043537096646!2d32.55836855!3d0.33748235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb0e8fa7f763%3A0x6b30f295bc1cc14c!2sSir%20Apollo%20Kaggwa%20Rd%2C%20Kampala!5e0!3m2!1sen!2sug!4v1700000000000!5m2!1sen!2sug"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(70%) invert(90%) contrast(90%)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>

        {/* --- NATIVE SOLOX LUXURY FOOTER --- */}
        <footer className="main-footer-two" style={{ backgroundColor: "#0b0f13", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "70px 0 30px 0" }}>
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-4 col-md-6">
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "18px" }}>
                  <img src="/assets/logo.jpg" alt="The Serenity Spa" style={{ height: "46px", width: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(194, 167, 78,0.5)" }} />
                  <span style={{ fontFamily: "Cormorant, serif", fontSize: "1.4rem", fontWeight: 700, color: "#ffffff" }}>
                    THE SERENITY SPA
                  </span>
                </Link>
                <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6, maxWidth: "320px" }}>
                  Kampala’s sanctuary for holistic rejuvenation, luxury hydrotherapy, and authentic massage rituals.
                </p>
                <div style={{ display: "flex", gap: "14px", marginTop: "16px" }}>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" style={{ color: "#c2a74e", fontSize: "18px" }}><i className="fab fa-whatsapp"></i></a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#c2a74e", fontSize: "18px" }}><i className="fab fa-instagram"></i></a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#c2a74e", fontSize: "18px" }}><i className="fab fa-facebook"></i></a>
                </div>
              </div>

              <div className="col-lg-2 col-md-6">
                <h4 style={{ color: "#ffffff", fontFamily: "Cormorant, serif", fontSize: "1.2rem", marginBottom: "16px" }}>Navigation</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                  <li><Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Home</Link></li>
                  <li><Link href="/services" style={{ color: "#c2a74e", textDecoration: "none" }}>Services</Link></li>
                  <li><Link href="/gallery" style={{ color: "#9ca3af", textDecoration: "none" }}>Gallery</Link></li>
                  <li><Link href="/blog" style={{ color: "#9ca3af", textDecoration: "none" }}>Blog</Link></li>
                  <li><Link href="/escorts" style={{ color: "#9ca3af", textDecoration: "none" }}>Escorts</Link></li>
                </ul>
              </div>

              <div className="col-lg-3 col-md-6">
                <h4 style={{ color: "#ffffff", fontFamily: "Cormorant, serif", fontSize: "1.2rem", marginBottom: "16px" }}>Contacts</h4>
                <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                  Sir Apollo Kaggwa Rd &amp; Mengo, Kampala<br />
                  Phone: <a href={phoneHref} style={{ color: "#c2a74e", textDecoration: "none" }}>{phoneDisplay || "Call us"}</a><br />
                  Email: <a href="mailto:theserenitybookings@gmail.com" style={{ color: "#c2a74e", textDecoration: "none" }}>theserenitybookings@gmail.com</a>
                </p>
              </div>

              <div className="col-lg-3 col-md-6">
                <h4 style={{ color: "#ffffff", fontFamily: "Cormorant, serif", fontSize: "1.2rem", marginBottom: "16px" }}>Hours</h4>
                <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                  Open 24 Hours, 7 Days a Week:<br />
                  <strong style={{ color: "#fff" }}>Any time, day or night</strong><br />
                  Private appointments accommodated on request.
                </p>
              </div>
            </div>

            <div style={{ marginTop: "50px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", color: "#6b7280", fontSize: "12px" }}>
              © {new Date().getFullYear()} The Serenity Spa Kampala. All rights reserved.
            </div>
          </div>
        </footer>

      </div>
    
      {/* ── EXACT OLD SITE FLOAT-IN TRANSITION & THEME STYLES ── */}
      <style>{`
        @keyframes floatInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float-up {
          animation: floatInUp 1s ease-out forwards;
        }

        .opacity-0 {
          opacity: 0;
          transform: translateY(30px);
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }

        html {
          scroll-behavior: auto;
        }
      `}</style>
  
    </>
  );
}
