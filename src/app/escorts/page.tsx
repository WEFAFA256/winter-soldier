"use client";

import React, { useState } from "react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";

const whatsappNumber = "256781945510";

const companions = [
  {
    name: "Sophia",
    title: "Elite Companion",
    specialty: "Fine Dining & Corporate Events",
    availability: "available",
    image: "https://res.cloudinary.com/njzctr4m/image/upload/v1784667206/serenity_gallery/u7wll8tto5yxjt4ptcbl.jpg",
    description: "Sophisticated, articulate, and effortlessly elegant — Sophia brings grace and warmth to any occasion.",
  },
  {
    name: "Valentina",
    title: "Premium Companion",
    specialty: "Social Events & Private Dinners",
    availability: "in-session",
    image: "https://res.cloudinary.com/njzctr4m/image/upload/v1784667142/serenity_gallery/afxgagluqzhsoe03mqk9.jpg",
    description: "Charming and refined, Valentina adapts seamlessly to any social setting with poise and intelligence.",
  },
  {
    name: "Isabelle",
    title: "Luxury Companion",
    specialty: "Travel & Leisure Companionship",
    availability: "available",
    image: "https://res.cloudinary.com/njzctr4m/image/upload/v1784667087/serenity_gallery/cnl0pcncguetzsg6ms5v.jpg",
    description: "Adventurous yet refined, Isabelle is the perfect travel companion for unforgettable journeys.",
  },
  {
    name: "Aurora",
    title: "Elite Companion",
    specialty: "VIP Experiences & Gala Events",
    availability: "available",
    image: "https://res.cloudinary.com/njzctr4m/image/upload/v1784667018/serenity_gallery/kxvbybo5fbghkfomnavv.jpg",
    description: "Aurora brings an air of mystique and allure to every encounter — magnetic, cultured, and unforgettable.",
  },
];

export default function EscortsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroVisible, setHeroVisible] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <CustomCursor />

      <style jsx global>{`
        @keyframes goldShimmerText {
          0% { background-position: -400% center; }
          100% { background-position: 400% center; }
        }
        @keyframes escortGoldPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(194, 167, 78, 0.5); }
          50% { box-shadow: 0 0 0 10px rgba(194, 167, 78, 0); }
        }
        @keyframes statusPulseGreen {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerSlide {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .escort-companion-card {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.4s ease;
        }
        .escort-companion-card:hover {
          transform: translateY(-10px);
          border-color: rgba(194, 167, 78, 0.7) !important;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(194, 167, 78, 0.18) !important;
        }
        .escort-companion-card:hover .companion-img {
          transform: scale(1.07);
        }
        .companion-img {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .escort-book-btn {
          transition: all 0.25s ease;
        }
        .escort-book-btn:hover {
          background: #ffffff !important;
          color: #0e1317 !important;
          transform: scale(1.03);
        }
        .status-dot-pulse-green {
          animation: statusPulseGreen 2s infinite;
        }
        .vip-gold-title {
          background: linear-gradient(90deg,
            #7a5c1e 0%,
            #c2a74e 20%,
            #f5e199 35%,
            #d4af37 50%,
            #f5e199 65%,
            #c2a74e 80%,
            #7a5c1e 100%
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: goldShimmerText 4s linear infinite;
        }
      `}</style>

      <div className="page-wrapper" style={{ backgroundColor: "#0e1317", color: "#c4cfde", minHeight: "100vh" }}>

        {/* ─── HEADER ─── */}
        <header
          className="main-header main-header--two sticky-header sticky-header--normal"
          style={{ position: "relative", backgroundColor: "#0e1317", borderBottom: "1px solid rgba(194, 167, 78, 0.15)" }}
        >
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
                  <li className="current">
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

        {/* ─── HERO BANNER ─── */}
        <div
          style={{
            position: "relative",
            height: "420px",
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
              backgroundImage: "url('https://res.cloudinary.com/njzctr4m/image/upload/v1784667206/serenity_gallery/u7wll8tto5yxjt4ptcbl.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center top",
              transform: heroVisible ? "scale(1)" : "scale(1.08)",
              transition: "transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
              filter: "brightness(0.22)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(194,167,78,0.1) 0%, rgba(14,19,23,0.92) 100%)",
            }}
          />
          {/* Gold ornamental line top */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #c2a74e, transparent)" }} />
          {/* Gold ornamental line bottom */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #c2a74e, transparent)" }} />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              padding: "0 24px",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            <span
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                color: "#c2a74e",
                display: "block",
                marginBottom: "10px",
                letterSpacing: "1px",
              }}
            >
              Private Companionship
            </span>
            <h1
              className="vip-gold-title"
              style={{
                fontFamily: "'Cormorant', serif",
                fontSize: "clamp(2.8rem, 7vw, 5rem)",
                fontWeight: 700,
                margin: "0 0 16px 0",
                lineHeight: 1.1,
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              Escort Services
            </h1>
            <div
              style={{
                width: "80px",
                height: "2px",
                background: "linear-gradient(90deg, transparent, #c2a74e, transparent)",
                margin: "0 auto 20px auto",
              }}
            />
            <p
              style={{
                fontFamily: "'Cormorant', serif",
                fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                color: "rgba(196, 207, 222, 0.85)",
                maxWidth: "580px",
                margin: "0 auto",
                lineHeight: 1.7,
                fontStyle: "italic",
              }}
            >
              Exclusive, discreet, and utterly refined — curated companionship for the discerning gentleman.
            </p>
          </div>
        </div>

        {/* ─── INTRO SECTION ─── */}
        <section style={{ padding: "80px 0 60px 0", backgroundColor: "#0e1317" }}>
          <div className="container">
            <div style={{ maxWidth: "820px", margin: "0 auto", textAlign: "center" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "28px",
                }}
              >
                <div style={{ height: "1px", width: "60px", background: "linear-gradient(90deg, transparent, #c2a74e)" }} />
                <span
                  style={{
                    color: "#c2a74e",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                  }}
                >
                  The Serenity Experience
                </span>
                <div style={{ height: "1px", width: "60px", background: "linear-gradient(90deg, #c2a74e, transparent)" }} />
              </div>

              <h2
                style={{
                  fontFamily: "'Cormorant', serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                  color: "#e8d9b0",
                  marginBottom: "24px",
                  lineHeight: 1.2,
                }}
              >
                Discreet. Elegant. Unforgettable.
              </h2>
              <p
                style={{
                  color: "rgba(196, 207, 222, 0.8)",
                  fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
                  lineHeight: 1.85,
                  marginBottom: "16px",
                  fontFamily: "'Cormorant', serif",
                }}
              >
                At The Serenity Spa, our escort service offers a level of sophistication and discretion that is simply unmatched. Whether you require an elegant companion for a corporate gala, a private dinner, a social event, or a memorable getaway — our curated companions are selected for their poise, intellect, and natural charm.
              </p>
              <p
                style={{
                  color: "rgba(196, 207, 222, 0.65)",
                  fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)",
                  lineHeight: 1.85,
                  fontFamily: "'Cormorant', serif",
                  fontStyle: "italic",
                }}
              >
                Every engagement is conducted with absolute confidentiality and the highest standards of professionalism. Your privacy is our paramount commitment.
              </p>
            </div>
          </div>
        </section>

        {/* ─── COMPANIONS GRID ─── */}
        <section style={{ padding: "0 0 90px 0", backgroundColor: "#0e1317" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "52px" }}>
              <span
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: "1.8rem",
                  color: "#c2a74e",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Our Companions
              </span>
              <h2
                style={{
                  fontFamily: "'Cormorant', serif",
                  fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                  fontWeight: 700,
                  color: "#e8d9b0",
                  margin: "0 0 16px 0",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Meet the Elite
              </h2>
              <div style={{ width: "60px", height: "2px", background: "linear-gradient(90deg, transparent, #c2a74e, transparent)", margin: "0 auto" }} />
            </div>

            <div className="row g-4">
              {companions.map((c, i) => {
                const isAvailable = c.availability === "available";
                return (
                  <div key={i} className="col-xl-3 col-lg-4 col-md-6 col-12">
                    <div
                      className="escort-companion-card"
                      style={{
                        background: "linear-gradient(160deg, #161c22 0%, #1a2130 100%)",
                        border: "1px solid rgba(194, 167, 78, 0.22)",
                        borderRadius: "14px",
                        overflow: "hidden",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        animation: `fadeSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms both`,
                      }}
                    >
                      {/* Image */}
                      <div style={{ position: "relative", height: "280px", overflow: "hidden" }}>
                        <img
                          src={c.image}
                          alt={c.name}
                          className="companion-img"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { (e.target as HTMLImageElement).src = "/assets/service1.jpg"; }}
                        />
                        {/* Gradient overlay */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 40%, rgba(14,19,23,0.9) 100%)",
                          }}
                        />
                        {/* Availability badge */}
                        <div
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "5px 11px",
                            borderRadius: "20px",
                            backgroundColor: "rgba(10, 14, 18, 0.88)",
                            backdropFilter: "blur(6px)",
                            border: isAvailable ? "1px solid rgba(16, 185, 129, 0.55)" : "1px solid rgba(239, 68, 68, 0.45)",
                          }}
                        >
                          <span
                            className={isAvailable ? "status-dot-pulse-green" : ""}
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: isAvailable ? "#10b981" : "#ef4444",
                              display: "inline-block",
                            }}
                          />
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 800,
                              letterSpacing: "0.6px",
                              textTransform: "uppercase",
                              color: isAvailable ? "#34d399" : "#f87171",
                              lineHeight: 1,
                            }}
                          >
                            {isAvailable ? "Available" : "Engaged"}
                          </span>
                        </div>
                        {/* Name at bottom of image */}
                        <div style={{ position: "absolute", bottom: "14px", left: "16px" }}>
                          <h3
                            style={{
                              fontFamily: "'Cormorant', serif",
                              fontSize: "1.5rem",
                              fontWeight: 700,
                              color: "#e8d9b0",
                              margin: 0,
                              lineHeight: 1,
                              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                            }}
                          >
                            {c.name}
                          </h3>
                          <p style={{ margin: "4px 0 0", fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#c2a74e" }}>
                            {c.title}
                          </p>
                        </div>
                      </div>

                      {/* Body */}
                      <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "7px",
                            marginBottom: "12px",
                            padding: "5px 12px",
                            borderRadius: "20px",
                            background: "rgba(194, 167, 78, 0.1)",
                            border: "1px solid rgba(194, 167, 78, 0.25)",
                            width: "fit-content",
                          }}
                        >
                          <i className="fas fa-star" style={{ color: "#c2a74e", fontSize: "9px" }} />
                          <span style={{ fontSize: "11px", color: "#c2a74e", fontWeight: 600, letterSpacing: "0.5px" }}>{c.specialty}</span>
                        </div>

                        <p
                          style={{
                            fontSize: "0.92rem",
                            color: "rgba(196, 207, 222, 0.75)",
                            lineHeight: 1.7,
                            margin: "0 0 20px 0",
                            fontFamily: "'Cormorant', serif",
                            fontStyle: "italic",
                            flex: 1,
                          }}
                        >
                          {c.description}
                        </p>

                        <a
                          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello, I'm interested in booking ${c.name} for escort companionship services at The Serenity Spa.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="escort-book-btn"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            padding: "12px 20px",
                            background: isAvailable ? "#c2a74e" : "rgba(24,30,36,0.9)",
                            color: isAvailable ? "#0e1317" : "#c4cfde",
                            border: isAvailable ? "1.5px solid #d4af37" : "1px solid rgba(194,167,78,0.3)",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontSize: "11px",
                            fontWeight: 800,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                          }}
                        >
                          <i className="fab fa-whatsapp" style={{ fontSize: "14px" }} />
                          <span>{isAvailable ? "Book Companion" : "Join Waitlist"}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS SECTION ─── */}
        <section style={{ padding: "80px 0", backgroundColor: "#0a0e12", borderTop: "1px solid rgba(194,167,78,0.1)", borderBottom: "1px solid rgba(194,167,78,0.1)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "52px" }}>
              <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.8rem", color: "#c2a74e", display: "block", marginBottom: "8px" }}>
                The Process
              </span>
              <h2
                style={{
                  fontFamily: "'Cormorant', serif",
                  fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                  fontWeight: 700,
                  color: "#e8d9b0",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  margin: "0 0 16px 0",
                }}
              >
                How It Works
              </h2>
              <div style={{ width: "60px", height: "2px", background: "linear-gradient(90deg, transparent, #c2a74e, transparent)", margin: "0 auto" }} />
            </div>

            <div className="row g-4" style={{ maxWidth: "900px", margin: "0 auto" }}>
              {[
                { step: "01", icon: "fa-comments", title: "Enquire Discreetly", desc: "Reach out via WhatsApp or our booking form. All communication is strictly confidential." },
                { step: "02", icon: "fa-user-check", title: "Select Your Companion", desc: "Browse our curated profiles and choose the companion that matches your preference and occasion." },
                { step: "03", icon: "fa-calendar-check", title: "Confirm & Arrange", desc: "We handle all logistics. Time, venue, and special requirements are arranged with absolute discretion." },
                { step: "04", icon: "fa-gem", title: "Enjoy the Experience", desc: "Your companion arrives impeccably presented, ready to make your occasion truly memorable." },
              ].map((step, i) => (
                <div key={i} className="col-md-6 col-lg-3">
                  <div
                    style={{
                      textAlign: "center",
                      padding: "36px 24px",
                      background: "linear-gradient(160deg, #161c22, #1a2130)",
                      border: "1px solid rgba(194,167,78,0.18)",
                      borderRadius: "14px",
                      height: "100%",
                      animation: `fadeSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms both`,
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "rgba(194,167,78,0.12)",
                        border: "1.5px solid rgba(194,167,78,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px auto",
                      }}
                    >
                      <i className={`fas ${step.icon}`} style={{ color: "#c2a74e", fontSize: "20px" }} />
                    </div>
                    <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: "rgba(194,167,78,0.5)", marginBottom: "8px" }}>STEP {step.step}</div>
                    <h4
                      style={{
                        fontFamily: "'Cormorant', serif",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "#e8d9b0",
                        margin: "0 0 10px 0",
                      }}
                    >
                      {step.title}
                    </h4>
                    <p style={{ fontSize: "0.88rem", color: "rgba(196,207,222,0.65)", lineHeight: 1.75, margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA SECTION ─── */}
        <section style={{ padding: "90px 24px", backgroundColor: "#0e1317", textAlign: "center" }}>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.8rem", color: "#c2a74e", display: "block", marginBottom: "12px" }}>
              Begin Your Experience
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant', serif",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                fontWeight: 700,
                color: "#e8d9b0",
                margin: "0 0 20px 0",
                lineHeight: 1.2,
              }}
            >
              Arrange a Private Consultation
            </h2>
            <p style={{ color: "rgba(196,207,222,0.7)", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "36px", fontFamily: "'Cormorant', serif" }}>
              Our concierge team is available 24/7 to assist you in selecting the perfect companion and arranging all details with the utmost discretion.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello, I would like to enquire about your escort companionship services at The Serenity Spa.")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 32px",
                  background: "linear-gradient(135deg, #c2a74e, #d4af37, #c2a74e)",
                  backgroundSize: "200% auto",
                  color: "#0e1317",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: "12px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  animation: "shimmerSlide 3s linear infinite",
                  boxShadow: "0 8px 24px rgba(194,167,78,0.35)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(194,167,78,0.5)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(194,167,78,0.35)"; }}
              >
                <i className="fab fa-whatsapp" style={{ fontSize: "16px" }} />
                <span>WhatsApp Us Now</span>
              </a>
              <Link
                href="/booking"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 32px",
                  background: "transparent",
                  color: "#c2a74e",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "12px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  border: "1.5px solid rgba(194,167,78,0.5)",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(194,167,78,0.1)"; e.currentTarget.style.borderColor = "#c2a74e"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(194,167,78,0.5)"; }}
              >
                <i className="fas fa-calendar-alt" style={{ fontSize: "13px" }} />
                <span>Book Online</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer style={{ padding: "32px 24px", backgroundColor: "#0a0e12", borderTop: "1px solid rgba(194,167,78,0.1)", textAlign: "center" }}>
          <div style={{ marginBottom: "12px" }}>
            <img src="/assets/logo.jpg" alt="The Serenity Spa" style={{ height: "40px", width: "40px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(194,167,78,0.4)" }} />
          </div>
          <p style={{ color: "rgba(194,167,78,0.7)", fontSize: "11px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 6px 0" }}>The Serenity Spa</p>
          <p style={{ color: "rgba(196,207,222,0.4)", fontSize: "11px", margin: 0 }}>All engagements are strictly confidential. Adults only. Kampala, Uganda.</p>
        </footer>
      </div>
    </>
  );
}
