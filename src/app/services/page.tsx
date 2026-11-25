"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";
import { useSiteContact } from "@/components/ContactProvider";
import {
  fetchSiteContent,
  getCachedSiteContent,
  isRealServiceTitle,
  orderServices,
  splitServiceCatalog,
} from "@/lib/service-order";
import { useScrollFloat } from "@/lib/use-scroll-float";

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


// ── New Card Design: Parchment cream, full-bleed photo top, chrysanthemum watermark ──
function ServiceCard({
  service,
  index,
  imgSrc,
  fallbackImg,
}: {
  service: Service;
  index: number;
  imgSrc: string;
  fallbackImg: string;
}) {
  const { ref, floatClass, style: floatStyle } = useScrollFloat<HTMLDivElement>({
    delay: (index % 3) * 0.08,
  });
  const staggerDelay = (index % 3) * 0.08;

  return (
    <div
      ref={ref}
      className={`col-lg-4 col-md-6 col-12 ${floatClass}`}
      style={floatStyle}
    >
      {/* Card shell — overflow:hidden + border-radius clips image & button flush */}
      <div
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1.5px solid rgba(176, 142, 52, 0.42)',
          boxShadow: '0 6px 24px rgba(90, 60, 10, 0.14)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 46px rgba(90, 60, 10, 0.22)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(90, 60, 10, 0.14)';
        }}
      >
        {/* Full-bleed image — flush, no gap, no radius override needed */}
        <img
          src={imgSrc}
          alt={service.title}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '240px',
            objectFit: 'cover',
            display: 'block',
            flexShrink: 0,
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = 'scale(1.07)'; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = 'scale(1)'; }}
          onError={(e) => { (e.target as HTMLImageElement).src = fallbackImg; }}
        />

        {/* Content area — flat parchment cream, padded */}
        <div
          style={{
            padding: '18px 20px 20px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f0e8ca',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Chrysanthemum floral watermark — inline SVG, bottom-right */}
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              right: '-16px',
              bottom: '-16px',
              width: '168px',
              height: '168px',
              pointerEvents: 'none',
              opacity: 0.2,
            }}
            aria-hidden="true"
          >
            <g transform="translate(100,100)">
              {/* Outer ring — 16 petals */}
              {([0,22.5,45,67.5,90,112.5,135,157.5,180,202.5,225,247.5,270,292.5,315,337.5] as number[]).map((deg) => (
                <ellipse key={deg} cx="0" cy="-58" rx="9" ry="28" fill="none" stroke="#b8922f" strokeWidth="1.4" transform={`rotate(${deg})`} />
              ))}
              {/* Inner ring — 8 petals, offset by 11.25° */}
              {([11.25,56.25,101.25,146.25,191.25,236.25,281.25,326.25] as number[]).map((deg) => (
                <ellipse key={deg} cx="0" cy="-36" rx="7" ry="17" fill="none" stroke="#b8922f" strokeWidth="1.1" transform={`rotate(${deg})`} />
              ))}
              {/* Centre circles */}
              <circle cx="0" cy="0" r="13" fill="none" stroke="#b8922f" strokeWidth="1.4" />
              <circle cx="0" cy="0" r="6"  fill="none" stroke="#b8922f" strokeWidth="1"   />
            </g>
          </svg>

          {/* Title + gold price pill */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
            <h3
              style={{
                fontFamily: 'Cormorant, serif',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: '#000000',
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                flex: 1,
              }}
            >
              {service.title}
            </h3>
            <span
              style={{
                backgroundColor: '#b8922f',
                color: '#f5edd8',
                padding: '5px 16px',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '0.78rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                letterSpacing: '0.3px',
              }}
            >
              {formatPrice(service.price)}
            </span>
          </div>

          {/* Description — 3-line clamp */}
          <p
            style={{
              color: '#110c05',
              fontSize: '0.93rem',
              lineHeight: 1.68,
              margin: 0,
              fontWeight: 450,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '4.6em',
            }}
          >
            {service.description || 'A soothing treatment designed to revitalize mind, body, and senses.'}
          </p>

          {/* BOOK NOW — inside content area, padded on all sides like the reference */}
          <Link
            href={'/booking?service=' + encodeURIComponent(service.title) + '&price=' + encodeURIComponent(String(service.price)) + (imgSrc ? '&image=' + encodeURIComponent(imgSrc) : '')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '9px',
              width: '100%',
              marginTop: '18px',
              padding: '14px 20px',
              backgroundColor: '#c9a93c',
              color: '#1a1208',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '1.6px',
              textTransform: 'uppercase',
              borderRadius: '6px',
              transition: 'background-color 0.2s ease',
              boxSizing: 'border-box',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d4b447'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#c9a93c'; }}
          >
            <i className="fas fa-calendar-check" style={{ fontSize: '14px' }}></i>
            BOOK NOW
          </Link>
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
  const { phoneHref, phoneDisplay, whatsappDisplay, whatsappLink, locations } = useSiteContact();
  const [activeMapIndex, setActiveMapIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const cached = getCachedSiteContent();
    if (cached) {
      const cachedCatalog = splitServiceCatalog(cached);
      if (cachedCatalog.services.length > 0) {
        setServices(cachedCatalog.services);
        setLoading(false);
      }
    }

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

      if (cached) return;
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
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {locations.map((loc, idx) => {
                      const mapHref =
                        loc.mapUrl && /^https?:\/\//i.test(loc.mapUrl)
                          ? loc.mapUrl
                          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name)}`;
                      return (
                        <div key={idx} style={{ fontSize: "14px", lineHeight: 1.5, color: "#c4cfde" }}>
                          <div>• {loc.name}</div>
                          <a
                            href={mapHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#c2a74e", fontSize: "12px", textDecoration: "none", marginLeft: "10px", fontWeight: 600 }}
                          >
                            Open in Google Maps ↗
                          </a>
                        </div>
                      );
                    })}
                  </div>
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
            {(() => {
              const safeIdx = activeMapIndex < locations.length ? activeMapIndex : 0;
              const activeLoc = locations[safeIdx] || { name: "Sir Apollo Kaggwa Rd, Kampala", mapUrl: "" };
              const rawUrl = activeLoc.mapUrl || "";
              const embedSrc =
                rawUrl.includes("/maps/embed") || rawUrl.includes("output=embed")
                  ? rawUrl
                  : `https://maps.google.com/maps?q=${encodeURIComponent(activeLoc.name)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
              return (
                <div style={{ marginTop: "40px" }}>
                  {locations.length > 1 && (
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
                      {locations.map((loc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveMapIndex(idx)}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                            border: safeIdx === idx ? "1.5px solid #c2a74e" : "1px solid rgba(255,255,255,0.14)",
                            backgroundColor: safeIdx === idx ? "#c2a74e" : "#161c22",
                            color: safeIdx === idx ? "#0e1317" : "#c4cfde",
                          }}
                        >
                          Location {idx + 1}: {loc.name}
                        </button>
                      ))}
                    </div>
                  )}
                  <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(194, 167, 78,0.2)", height: "320px" }}>
                    <iframe
                      key={embedSrc}
                      title={activeLoc.name || "The Serenity Spa Location"}
                      src={embedSrc}
                      width="100%"
                      height="100%"
                      style={{ border: 0, filter: "grayscale(70%) invert(90%) contrast(90%)" }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              );
            })()}
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
