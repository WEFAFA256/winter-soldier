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
  const { ref, floatClass, style: floatStyle } = useScrollFloat<HTMLDivElement>({
    delay: (index % 3) * 0.1 + 0.05,
  });

  return (
    <div
      ref={ref}
      className={`col-lg-4 col-md-6 col-12 ${floatClass}`}
      style={floatStyle}
    >
      {/* VIP Card Shell: Rich gold luxury theme */}
      <div
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          border: "1.5px solid rgba(140, 95, 20, 0.42)",
          boxShadow: "0 8px 30px rgba(70, 45, 10, 0.22), 0 2px 8px rgba(40, 25, 5, 0.12)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0 20px 48px rgba(70, 45, 10, 0.32), 0 6px 18px rgba(40, 25, 5, 0.18)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(70, 45, 10, 0.22), 0 2px 8px rgba(40, 25, 5, 0.12)";
        }}
      >
        {/* Full-bleed Photo Header */}
        <img
          src={imgSrc}
          alt={service.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "240px",
            objectFit: "cover",
            display: "block",
            flexShrink: 0,
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = "scale(1.07)"; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = "scale(1)"; }}
          onError={(e) => { (e.target as HTMLImageElement).src = fallbackImg; }}
        />

        {/* Content area: Rich metallic gold background */}
        <div
          style={{
            padding: "20px 20px 22px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(165deg, #d3a43c 0%, #c49432 45%, #b18122 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Bottom-left corner botanical line-art */}
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              left: "-12px",
              bottom: "-12px",
              width: "90px",
              height: "90px",
              pointerEvents: "none",
              opacity: 0.22,
            }}
            aria-hidden="true"
          >
            <g transform="translate(10,90)">
              {([15, 35, 55, 75] as number[]).map((deg) => (
                <ellipse key={deg} cx="28" cy="-28" rx="8" ry="22" fill="none" stroke="#1a1208" strokeWidth="1.2" transform={`rotate(${deg})`} />
              ))}
              <circle cx="0" cy="0" r="10" fill="none" stroke="#1a1208" strokeWidth="1.2" />
            </g>
          </svg>

          {/* Bottom-right corner botanical line-art */}
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              right: "-12px",
              bottom: "-12px",
              width: "90px",
              height: "90px",
              pointerEvents: "none",
              opacity: 0.22,
            }}
            aria-hidden="true"
          >
            <g transform="translate(90,90)">
              {([-15, -35, -55, -75] as number[]).map((deg) => (
                <ellipse key={deg} cx="-28" cy="-28" rx="8" ry="22" fill="none" stroke="#1a1208" strokeWidth="1.2" transform={`rotate(${deg})`} />
              ))}
              <circle cx="0" cy="0" r="10" fill="none" stroke="#1a1208" strokeWidth="1.2" />
            </g>
          </svg>

          {/* Title + black price pill */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "12px", position: "relative", zIndex: 1 }}>
            <h3
              style={{
                fontFamily: "Cormorant, serif",
                fontSize: "1.32rem",
                fontWeight: 800,
                color: "#000000",
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: "0.6px",
                textTransform: "uppercase",
                flex: 1,
              }}
            >
              {service.title}
            </h3>
            <span
              style={{
                backgroundColor: "#141210",
                color: "#f5ede0",
                padding: "5px 16px",
                borderRadius: "999px",
                fontWeight: 800,
                fontSize: "0.78rem",
                whiteSpace: "nowrap",
                flexShrink: 0,
                letterSpacing: "0.3px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
              }}
            >
              {formatPrice(service.price)}
            </span>
          </div>

          {/* Description — 3-line clamp, deeper black for crisp readability */}
          <p
            style={{
              color: "#0a0703",
              fontSize: "0.93rem",
              lineHeight: 1.68,
              margin: 0,
              fontWeight: 500,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "4.6em",
              position: "relative",
              zIndex: 1,
            }}
          >
            {cleanDescription(service.description)}
          </p>

          {/* Luxury Diamond Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              margin: "18px 0 16px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(0, 0, 0, 0.35)" }} />
            <div
              style={{
                width: "6px",
                height: "6px",
                transform: "rotate(45deg)",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              }}
            />
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(0, 0, 0, 0.35)" }} />
          </div>

          {/* BOOK NOW — black luxury button with gold text & calendar icon */}
          <Link
            href={"/booking?service=" + encodeURIComponent(service.title) + "&price=" + encodeURIComponent(String(service.price)) + (imgSrc ? "&image=" + encodeURIComponent(imgSrc) : "")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "9px",
              width: "100%",
              padding: "14px 20px",
              backgroundColor: "#141210",
              color: "#deb853",
              border: "1px solid rgba(222, 184, 83, 0.25)",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "1.6px",
              textTransform: "uppercase",
              borderRadius: "6px",
              transition: "all 0.22s ease",
              boxSizing: "border-box",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.3)",
              position: "relative",
              zIndex: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#241f1a";
              e.currentTarget.style.borderColor = "rgba(222, 184, 83, 0.6)";
              e.currentTarget.style.color = "#edd07c";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#141210";
              e.currentTarget.style.borderColor = "rgba(222, 184, 83, 0.25)";
              e.currentTarget.style.color = "#deb853";
            }}
          >
            <i className="fas fa-calendar-check" style={{ fontSize: "14px", color: "#deb853" }}></i>
            BOOK NOW
          </Link>
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
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(194, 167, 78,0.08) 0%, rgba(14,19,23,0.75) 100%)",
            }}
          />
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
              <div className="card-loading-slot" style={{ textAlign: "center", padding: "80px 0" }}>
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
