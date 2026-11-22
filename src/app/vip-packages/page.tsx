"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";
import {
  fetchSiteContent,
  isRealServiceTitle,
  orderServices,
  splitServiceCatalog,
} from "@/lib/service-order";

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

// Package descriptions are about the experience; the price already has its own badge.
function cleanDescription(description: string): string {
  return String(description || "")
    .replace(/\s*\((?:UGX\s*)?\d[\d,.]*\s*(?:K|M)?\)/gi, "")
    .replace(/\s+/g, " ")
    .trim() || "An exclusive luxury package designed for total relaxation.";
}

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

  const staggerDelay = (index % 3) * 0.1 + 0.05;

  return (
    <div
      ref={ref}
      className="col-lg-4 col-md-6 col-12"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate3d(0, 0, 0)" : "translate3d(0, 60px, 0)",
        transition: `opacity 1000ms ease ${staggerDelay}s, transform 1000ms ease ${staggerDelay}s`,
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

        {/* Card Image — static, fills the entire image area with no empty edges */}
        <div
          style={{ height: "220px", width: "100%", overflow: "hidden", position: "relative", backgroundColor: "#0e1317", zIndex: 2 }}
        >
          <img
            src={imgSrc}
            alt={service.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
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
            {cleanDescription(service.description)}
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
  // Start empty so no stale package cards flash before the live catalogue loads.
  const [packages, setPackages] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        try {
          const data = await fetchSiteContent();
          if (data) {
            const catalog = splitServiceCatalog(data);
            const vip = orderServices(
              catalog.vipServices.filter((s: Service) => isRealServiceTitle(s.title)),
              "vip"
            );
            if (vip.length > 0) {
              setPackages(vip);
              return;
            }
          }
        } catch (err) {
          console.error("Failed to load /api/content, trying local JSON...", err);
        }

        try {
          const res = await fetch("/site-content.json");
          if (res.ok) {
            const data = await res.json();
            if (data) {
              const catalog = splitServiceCatalog(data);
              const vip = orderServices(
                catalog.vipServices.filter((s: Service) => isRealServiceTitle(s.title)),
                "vip"
              );
              if (vip.length > 0) setPackages(vip);
            }
          }
        } catch (err) {
          console.error("Failed to load local JSON", err);
        }
      } finally {
        // Runs on the success return too — otherwise the page stays on the skeleton.
        setLoading(false);
      }
    };

    loadPackages();

    const refreshOnVisible = () => {
      if (document.visibilityState === "visible") loadPackages();
    };
    window.addEventListener("focus", refreshOnVisible);
    document.addEventListener("visibilitychange", refreshOnVisible);
    return () => {
      window.removeEventListener("focus", refreshOnVisible);
      document.removeEventListener("visibilitychange", refreshOnVisible);
    };
  }, []);

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
                  <li className="">
                    <Link href="/services">Services</Link>
                  </li>
                  <li className="current">
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

        {/* --- LUXURY HERO BANNER --- */}
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
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('/assets/images/backgrounds/services-header-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: heroVisible ? "scale(1)" : "scale(1.08)",
              transition: "transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
              filter: "brightness(0.35)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(194, 167, 78,0.08) 0%, rgba(14,19,23,0.75) 100%)",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              padding: "0 20px",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            <span style={{ color: "#c2a74e", fontFamily: "'Great Vibes', cursive, Cormorant, serif", fontSize: "1.5rem", display: "block", marginBottom: "10px", letterSpacing: "2px" }}>
              Elevate Your Ritual
            </span>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700, color: "#ffffff", margin: "0 0 12px 0", lineHeight: 1.15 }}>
              VIP Packages &amp; Exclusive Rituals
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(0.85rem, 2vw, 1rem)", maxWidth: "600px", margin: "0 auto 18px auto", lineHeight: 1.6 }}>
              Discover our most indulgent experiences — synchronized multi-hand sessions, private suite rituals, and full-day hammam journeys created for guests who want more time, privacy, and care.
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
            {/* VIP cards start immediately below the hero. */}
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
                    />
                  );
                })}
              </div>
            )}
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
                  <li><Link href="/escorts" style={{ color: "#9ca3af", textDecoration: "none" }}>Escorts</Link></li>
            </ul>
            <div>&copy; {new Date().getFullYear()} The Serenity Spa. All rights reserved.</div>
          </div>
        </footer>

      </div>
    </>
  );
}
