"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";

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

const INITIAL_VIP_PACKAGES: Service[] = [
  {
    "title": "Body Care Packages",
    "image": "/assets/service7.jpg",
    "fullImage": "/assets/body-care-full.jpg",
    "description": "Got the time for Pure Relaxation & Stress Off? Out for a 120mins | 180mins Session as a Package for the Spa Day. We've got you covered! - Try these Massage sessions!",
    "delay": "delay-100",
    "price": 400000
  },
  {
    "title": "Kamasutra Session",
    "image": "/assets/kamasutra-session.jpg",
    "fullImage": "/assets/kamasutra-session.jpg",
    "description": "Pure intimacy and control. A distinctive session involving deep body contact, warm oils, and inverse B2B techniques. (400K)",
    "delay": "delay-200",
    "needsCrop": true,
    "price": 400000
  },
  {
    "title": "Premium Body Care Pack",
    "image": "/assets/premium-collage.jpg",
    "fullImage": "/assets/premium-pack.jpg",
    "description": "Aromatherapy, Body Waxing, Steam Bath, Jacuzzi, Wines & Drinks, Ped & Manicure. (400K)",
    "delay": "delay-200",
    "imageOnly": true,
    "price": 400000
  },
  {
    "title": "Couples | Duo Packages",
    "image": "/assets/service8.jpg",
    "fullImage": "/assets/couples-duo-full.jpg",
    "description": "Got the time for Pure Relaxation & Stress Off? Out for a 90mins | 120mins Session as a Package for the Spa Day. We've got you covered! - Try these Massage sessions!",
    "delay": "delay-200",
    "price": 450000
  },
  {
    "title": "4hands Nuru | B2b",
    "image": "/assets/4hands-nuru-b2b.jpg",
    "fullImage": "/assets/4hands-nuru-b2b.jpg",
    "description": "Experience pure arousal with two therapists. Sensual slides, sticky oils, and extreme body contact at its best. (450K)",
    "delay": "delay-300",
    "needsCrop": true,
    "price": 450000
  },
  {
    "title": "6hands Erotic",
    "image": "/assets/6hands-erotic.jpg",
    "fullImage": "/assets/6hands-erotic.jpg",
    "description": "Soothing beyond normal Erotic Sessions. Stimulate all sexual pleasures through intimate, romantic & teasing touches by three therapists. (450K)",
    "delay": "delay-200",
    "needsCrop": true,
    "price": 450000
  },
  {
    "title": "Classical Body Care Pack",
    "image": "/assets/classical-collage.jpg",
    "fullImage": "/assets/classical-pack.jpg",
    "description": "Nuru Full Pack, Waxing & Scrubs, Turkish Hammam, Foam Massage, Steam Facials, Ped & Manicure. (500K)",
    "delay": "delay-300",
    "imageOnly": true,
    "price": 500000
  },
  {
    "title": "Affluent Body Care Pack",
    "image": "/assets/affluent-collage.jpg",
    "fullImage": "/assets/affluent-pack.jpg",
    "description": "Tantra Full Pack, Scrubs & Waxing, Turkish Hammam, Jacuzzi & Steam, Ped & Manicure. (600K)",
    "delay": "delay-100",
    "imageOnly": true,
    "price": 600000
  },
  {
    "title": "4hands Full Service",
    "image": "/assets/4hands-full-service.jpg",
    "fullImage": "/assets/4hands-full-service.jpg",
    "description": "Intense duo intimacy. Thighs, curves, and extreme contact with warm scented oils. Pure sensation. (650K)",
    "delay": "delay-100",
    "needsCrop": true,
    "price": 650000
  },
  {
    "title": "4hands Tantra | Yoni",
    "image": "/assets/4hands-tantra-yoni.jpg",
    "fullImage": "/assets/4hands-tantra-yoni.jpg",
    "description": "Deep tantric soothing and arousal. Two therapists focus on intimate detail and pure sensation for ultimate release. (750K)",
    "delay": "delay-200",
    "needsCrop": true,
    "price": 750000
  },
  {
    "title": "6hands Full Service",
    "image": "/assets/6hands-full-service.jpg",
    "fullImage": "/assets/6hands-full-service.jpg",
    "description": "Combining B2b, Erotic & Aromatherapy. Unique pleasure using thighs, breasts, lips with extra body contact from three therapists. (900K)",
    "delay": "delay-300",
    "needsCrop": true,
    "price": 900000
  },
  {
    "title": "6hands Kamasutra",
    "image": "/assets/6hands-kamasutra.jpg",
    "fullImage": "/assets/6hands-kamasutra.jpg",
    "description": "Pure Romance, Erotic, and Tantric practices. Maximise the session with three therapists using extra full body contact. (1.2M)",
    "delay": "delay-100",
    "needsCrop": true,
    "price": 1200000
  }
];

const whatsappNumber = "256781945510";

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

function ServiceCard({
  service,
  index,
  imgSrc,
  fallbackImg,
  onLearnMore,
}: {
  service: Service;
  index: number;
  imgSrc: string;
  fallbackImg: string;
  onLearnMore: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else if (entry.boundingClientRect.top > 0) {
          setInView(false);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const staggerDelay = (index % 3) * 0.08;

  return (
    <div
      ref={ref}
      className="col-lg-4 col-md-6 col-12"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate3d(0, 0, 0)" : "translate3d(0, 32px, 0)",
        transition: `opacity 0.75s cubic-bezier(0.25, 1, 0.5, 1) ${staggerDelay}s, transform 0.75s cubic-bezier(0.25, 1, 0.5, 1) ${staggerDelay}s`,
        willChange: "transform, opacity",
      }}
    >
      <div
        className="service-theme-card"
        style={{
          backgroundImage: "url(/assets/images/shapes/funfact-bg-2.jpg)",
          backgroundColor: "#c2a74e",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid rgba(194, 167, 78, 0.4)",
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.45)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-10px)";
          e.currentTarget.style.boxShadow = "0 22px 50px rgba(194, 167, 78, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.45)";
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "180px",
            height: "180px",
            backgroundImage: "url(/assets/images/shapes/funfact-bg-2-shape.png)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left bottom",
            pointerEvents: "none",
            opacity: 0.85,
            zIndex: 1,
          }}
        />

        {/* Card Image */}
        <div
          onClick={onLearnMore}
          style={{ height: "220px", overflow: "hidden", position: "relative", cursor: "pointer", backgroundColor: "#0e1317", zIndex: 2 }}
        >
          <img
            src={imgSrc}
            alt={service.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: service.needsCrop ? "cover" : "contain",
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = "scale(1)";
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImg;
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "14px",
              backgroundColor: "rgba(14, 19, 23, 0.85)",
              backdropFilter: "blur(4px)",
              color: "#c2a74e",
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: "1px solid rgba(194, 167, 78, 0.4)",
              letterSpacing: "0.5px",
            }}
          >
            <i className="fas fa-search-plus"></i> View Flyer
          </div>
        </div>

        {/* Card Content */}
        <div style={{ padding: "24px 22px", display: "flex", flexDirection: "column", flex: 1, position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", gap: "8px" }}>
            <h3
              style={{
                fontFamily: "Cormorant, serif",
                fontSize: "1.45rem",
                fontWeight: 800,
                color: "#ffffff",
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {service.title}
            </h3>
            <span
              style={{
                backgroundColor: "#1c1a1d",
                color: "#ffffff",
                padding: "4px 12px",
                borderRadius: "16px",
                fontWeight: 800,
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {formatPrice(service.price)}
            </span>
          </div>

          <p
            style={{
              color: "rgba(255, 255, 255, 0.95)",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              fontSize: "0.92rem",
              lineHeight: 1.6,
              marginBottom: "20px",
              flex: 1,
              fontWeight: 500,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "4.2em",
            }}
          >
            {service.description || "An exclusive luxury package designed for total relaxation."}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "auto",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.25)",
            }}
          >
            <button
              onClick={onLearnMore}
              style={{
                flex: 1,
                padding: "11px 14px",
                backgroundColor: "transparent",
                border: "2px solid #1c1a1d",
                color: "#1c1a1d",
                borderRadius: "0px",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1c1a1d";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#1c1a1d";
              }}
            >
              Learn More
            </button>

            <Link
              href={"/booking?service=" + encodeURIComponent(service.title) + "&price=" + encodeURIComponent(String(service.price))}
              style={{
                flex: 1.3,
                padding: "11px 14px",
                backgroundColor: "#1c1a1d",
                border: "2px solid #1c1a1d",
                color: "#ffffff",
                borderRadius: "0px",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.color = "#1c1a1d";
                e.currentTarget.style.borderColor = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1c1a1d";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "#1c1a1d";
              }}
            >
              <i className="fas fa-calendar-check"></i> Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VipPackagesPage() {
  const [packages, setPackages] = useState<Service[]>(INITIAL_VIP_PACKAGES);
  const [loading, setLoading] = useState(false);
  const [modalService, setModalService] = useState<Service | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/content");
        if (res.ok) {
          const data = await res.json();
          if (data && data.services && Array.isArray(data.services) && data.services.length > 0) {
            const vip = data.services.filter((s: Service) => {
              const p = typeof s.price === "number" ? s.price : parseInt(String(s.price).replace(/\D/g, ""), 10);
              return !isNaN(p) && p >= 400000;
            });
            if (vip.length > 0) {
              setPackages(vip);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Failed to load /api/content", err);
      }
      setLoading(false);
    };

    fetchPackages();
  }, []);

  return (
    <>
      <CustomCursor />
      <style jsx global>{`
        @keyframes vipGoldShimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        @keyframes vipGlowPulse {
          0%, 100% {
            filter: drop-shadow(0 0 12px rgba(194, 167, 78, 0.45)) drop-shadow(0 0 24px rgba(255, 215, 0, 0.25));
          }
          50% {
            filter: drop-shadow(0 0 22px rgba(194, 167, 78, 0.9)) drop-shadow(0 0 40px rgba(255, 215, 0, 0.55));
          }
        }
        .vip-shimmer-text {
          background: linear-gradient(
            110deg,
            #c2a74e 0%,
            #dfc268 20%,
            #ffffff 45%,
            #fff4c2 55%,
            #e2b842 75%,
            #c2a74e 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: vipGoldShimmer 3s ease-in-out infinite, vipGlowPulse 2.8s ease-in-out infinite;
          display: inline-block;
          font-weight: 900;
          letter-spacing: 3px;
        }
        .vip-badge-shimmer {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 18px;
          border-radius: 30px;
          background: rgba(14, 19, 23, 0.75);
          border: 1px solid rgba(194, 167, 78, 0.6);
          box-shadow: 0 0 20px rgba(194, 167, 78, 0.3), inset 0 0 12px rgba(194, 167, 78, 0.15);
          margin-bottom: 14px;
        }
      `}</style>

      <div className="page-wrapper" style={{ backgroundColor: "#0e1317", color: "#c4cfde", minHeight: "100vh" }}>
        {/* --- NATIVE SOLOX LUXURY HEADER --- */}
        <header className="main-header main-header--two sticky-header sticky-header--normal" style={{ position: "relative", backgroundColor: "#0e1317", borderBottom: "1px solid rgba(194, 167, 78,0.15)" }}>
          <div className="container" style={{ padding: "0 15px" }}>
            <div className="main-header__inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "82px" }}>
              <div className="main-header__logo">
                <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                  <img
                    src="/assets/logo.jpg"
                    alt="The Serenity Spa"
                    style={{
                      height: "50px",
                      width: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid rgba(194, 167, 78,0.5)",
                      display: "block",
                    }}
                  />
                </Link>
              </div>

              <nav className="main-header__nav main-menu" style={{ display: "flex", alignItems: "center" }}>
                <ul style={{ listStyle: "none", gap: "24px", margin: 0, padding: 0, display: "flex", alignItems: "center" }} className="d-none d-xl-flex">
                  <li><Link href="/" style={{ color: "#ffffff", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Home</Link></li>
                  <li><Link href="/services" style={{ color: "#ffffff", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Services</Link></li>
                  <li className="current"><Link href="/vip-packages" style={{ color: "#c2a74e", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>VIP Packages</Link></li>
                  <li><Link href="/mobile-massage" style={{ color: "#ffffff", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Mobile Massage</Link></li>
                  <li><Link href="/gallery" style={{ color: "#ffffff", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Gallery</Link></li>
                  <li><Link href="/blog" style={{ color: "#ffffff", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Blog</Link></li>
                </ul>
              </nav>

              <div className="main-header__right" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <Link
                  href="/booking"
                  className="solox-btn main-header__btn d-none d-sm-inline-flex"
                  style={{
                    backgroundColor: "#c2a74e",
                    color: "#0e1317",
                    padding: "10px 22px",
                    fontWeight: 700,
                    fontSize: "12px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    borderRadius: "4px",
                    textDecoration: "none",
                  }}
                >
                  <span>Book VIP Session</span>
                </Link>

                <div
                  className="mobile-nav__btn mobile-nav__toggler d-xl-none"
                  onClick={() => setMobileMenuOpen(true)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    padding: "8px",
                    border: "1px solid rgba(194, 167, 78,0.4)",
                    borderRadius: "4px",
                  }}
                >
                  <span style={{ width: "20px", height: "2px", backgroundColor: "#c2a74e" }}></span>
                  <span style={{ width: "20px", height: "2px", backgroundColor: "#c2a74e" }}></span>
                  <span style={{ width: "20px", height: "2px", backgroundColor: "#c2a74e" }}></span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* --- HERO BANNER --- */}
        <div
          style={{
            position: "relative",
            minHeight: "420px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: "url(/assets/images/backgrounds/services-header-bg.jpg)",
            backgroundColor: "#000000",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            textAlign: "center",
            padding: "80px 20px",
            borderBottom: "1px solid rgba(194, 167, 78,0.2)",
          }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.72)" }} />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: "800px",
              margin: "0 auto",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            <span style={{ color: "#c2a74e", fontFamily: "'Great Vibes', cursive, Cormorant, serif", fontSize: "1.6rem", display: "block", marginBottom: "10px", letterSpacing: "2px" }}>
              Exclusive &amp; Bespoke
            </span>
            <div className="vip-badge-shimmer">
              <i className="fas fa-crown" style={{ color: "#c2a74e", fontSize: "14px" }}></i>
              <span className="vip-shimmer-text" style={{ fontSize: "13px", letterSpacing: "2.5px" }}>
                EXECUTIVE SUITE PRIVILEGE
              </span>
            </div>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 700, color: "#ffffff", margin: "0 0 14px 0", lineHeight: 1.15 }}>
              <span className="vip-shimmer-text">VIP</span> Luxury Packages &amp; Multi-Hand Rituals
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "clamp(0.9rem, 2vw, 1.05rem)", maxWidth: "660px", margin: "0 auto 20px auto", lineHeight: 1.6 }}>
              Curated exclusively for discerning clients seeking therapies of 400,000 UGX and above in Kampala — from synchronized 4-hand and 6-hand sessions to full-day Turkish hammam and royal body care rituals.
            </p>
            <nav style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
              <span style={{ margin: "0 8px", color: "#c2a74e" }}>/</span>
              <span style={{ color: "#c2a74e" }}>VIP Packages</span>
            </nav>
          </div>
        </div>

        {/* --- VIP PACKAGES GRID --- */}
        <section style={{ padding: "60px 0 90px 0" }}>
          <div className="container">
            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
                  <span className="visually-hidden">Loading VIP packages...</span>
                </div>
                <p style={{ marginTop: "16px", color: "#9ca3af" }}>Loading VIP packages...</p>
              </div>
            ) : (
              <div className="row g-4">
                {packages.map((service, index) => {
                  const fallbackImg = `/assets/images/resources/service-1-${(index % 5) + 1}.jpg`;
                  const imgSrc = service.image || fallbackImg;

                  return (
                    <ServiceCard
                      key={service.title || index}
                      service={service}
                      index={index}
                      imgSrc={imgSrc}
                      fallbackImg={fallbackImg}
                      onLearnMore={() => setModalService(service)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* --- VIP CONCIERGE BANNER --- */}
        <section style={{ padding: "60px 0", backgroundColor: "#12171c", borderTop: "1px solid rgba(194, 167, 78,0.2)", borderBottom: "1px solid rgba(194, 167, 78,0.2)" }}>
          <div className="container" style={{ textAlign: "center", maxWidth: "800px" }}>
            <span style={{ color: "#c2a74e", textTransform: "uppercase", letterSpacing: "2px", fontSize: "12px", fontWeight: 700 }}>
              Custom Tailored Experiences
            </span>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "2.4rem", fontWeight: 700, color: "#fff", margin: "10px 0 16px 0" }}>
              Require a Custom VIP Reservation or Private Suite?
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "1rem", lineHeight: 1.6, marginBottom: "26px" }}>
              Our dedicated executive concierge handles bespoke requests, private suite bookings, champagne setups, and confidential appointments with absolute discretion.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello, I would like to inquire about a custom VIP package at The Serenity Spa.")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "13px 28px",
                  backgroundColor: "#25D366",
                  color: "#ffffff",
                  borderRadius: "4px",
                  fontWeight: 700,
                  fontSize: "13px",
                  textDecoration: "none",
                  letterSpacing: "0.5px",
                }}
              >
                <i className="fab fa-whatsapp" style={{ fontSize: "16px" }}></i>
                WhatsApp Concierge
              </a>
              <Link
                href="/booking"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "13px 28px",
                  backgroundColor: "transparent",
                  border: "2px solid #c2a74e",
                  color: "#c2a74e",
                  borderRadius: "4px",
                  fontWeight: 700,
                  fontSize: "13px",
                  textDecoration: "none",
                  letterSpacing: "0.5px",
                }}
              >
                <i className="fas fa-calendar-alt"></i>
                Book Appointment
              </Link>
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer style={{ backgroundColor: "#090d10", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "50px 0 30px 0", color: "#6b7280", fontSize: "13px" }}>
          <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/assets/logo.jpg" alt="The Serenity Spa" style={{ height: "32px", width: "32px", borderRadius: "50%", objectFit: "cover" }} />
              <span style={{ color: "#ffffff", fontWeight: 700, letterSpacing: "1px" }}>THE SERENITY SPA</span>
            </div>
            <ul style={{ listStyle: "none", display: "flex", gap: "20px", margin: 0, padding: 0 }}>
              <li><Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Home</Link></li>
              <li><Link href="/services" style={{ color: "#9ca3af", textDecoration: "none" }}>Services</Link></li>
              <li><Link href="/vip-packages" style={{ color: "#c2a74e", textDecoration: "none" }}>VIP Packages</Link></li>
              <li><Link href="/mobile-massage" style={{ color: "#9ca3af", textDecoration: "none" }}>Mobile Massage</Link></li>
              <li><Link href="/gallery" style={{ color: "#9ca3af", textDecoration: "none" }}>Gallery</Link></li>
              <li><Link href="/blog" style={{ color: "#9ca3af", textDecoration: "none" }}>Blog</Link></li>
            </ul>
            <div>&copy; {new Date().getFullYear()} The Serenity Spa. All rights reserved.</div>
          </div>
        </footer>

        {/* --- MODAL DETAIL FLYER --- */}
        {modalService && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              backgroundColor: "rgba(0,0,0,0.92)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
            onClick={() => setModalService(null)}
          >
            <div
              style={{
                position: "relative",
                maxWidth: "680px",
                width: "100%",
                backgroundColor: "#161c22",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(194, 167, 78,0.35)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                display: "flex",
                flexDirection: "column",
                maxHeight: "90vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ height: "360px", backgroundColor: "#000", position: "relative", overflow: "hidden" }}>
                <img
                  src={modalService.fullImage || modalService.image}
                  alt={modalService.title}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/assets/service1.jpg";
                  }}
                />
                <button
                  onClick={() => setModalService(null)}
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    border: "1px solid rgba(194, 167, 78,0.5)",
                    color: "#fff",
                    fontSize: "16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: "26px", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }}>
                  <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "2rem", color: "#fff", margin: 0 }}>
                    {modalService.title}
                  </h3>
                  <span style={{ color: "#c2a74e", fontSize: "1.4rem", fontWeight: 700, fontFamily: "Cormorant, serif" }}>
                    {formatPrice(modalService.price)}
                  </span>
                </div>

                <p style={{ color: "#d1d5db", fontSize: "1rem", lineHeight: 1.7, marginBottom: "24px" }}>
                  {modalService.description}
                </p>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <Link
                    href={"/booking?service=" + encodeURIComponent(modalService.title) + "&price=" + encodeURIComponent(String(modalService.price))}
                    style={{
                      flex: 1,
                      minWidth: "160px",
                      padding: "13px 20px",
                      backgroundColor: "#c2a74e",
                      color: "#0e1317",
                      borderRadius: "4px",
                      fontWeight: 700,
                      textAlign: "center",
                      textDecoration: "none",
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Proceed to Booking
                  </Link>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello, I'd like to book ${modalService.title} (${formatPrice(modalService.price)}) at The Serenity Spa.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "13px 20px",
                      backgroundColor: "#25D366",
                      color: "#fff",
                      borderRadius: "4px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    <i className="fab fa-whatsapp"></i> Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      </div>
    </>
  );
}
