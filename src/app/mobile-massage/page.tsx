"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";

interface MobileService {
  title: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  image: string;
}

const MOBILE_SERVICES: MobileService[] = [
  {
    title: "Executive In-Room Swedish Massage",
    price: "UGX 200,000",
    duration: "60 - 90 mins",
    description: "Full-body classic Swedish relaxation delivered directly to your hotel room or residence. Calming strokes, kneading, and organic oils to ease travel fatigue.",
    features: ["Portable luxury massage bed", "Aromatherapy oils & fresh linens", "Relaxation background audio", "Available 7 days a week"],
    image: "/assets/service1.jpg",
  },
  {
    title: "Mobile Deep Tissue Therapy",
    price: "UGX 230,000",
    duration: "60 - 90 mins",
    description: "Targeted intense pressure for chronic muscular tension, travel soreness, and stiff joints. Ideal after long flights or busy corporate schedules.",
    features: ["Therapeutic firm pressure", "Focus on back, neck & shoulders", "Warming muscle balm", "Post-treatment stretching guidance"],
    image: "/assets/service2.jpg",
  },
  {
    title: "In-Call Aromatherapy Ritual",
    price: "UGX 250,000",
    duration: "75 mins",
    description: "A calming sensory journey combining gentle rhythmic massage with premium lavender, eucalyptus, and chamomile essential oils.",
    features: ["Custom oil blend selection", "Stress & anxiety relief", "Hot towel application", "Deep sleep enhancement"],
    image: "/assets/service4.jpg",
  },
  {
    title: "VIP Couple's In-Suite Massage",
    price: "UGX 450,000",
    duration: "90 mins",
    description: "Simultaneous side-by-side massage for two in your master suite or hotel room, conducted by two certified senior therapists.",
    features: ["Dual massage table setup", "Two therapists arrive together", "Rose petal & candle ambient kit", "Complimentary scented oils"],
    image: "/assets/service8.jpg",
  },
  {
    title: "Private Sensual & Nuru Out-Call",
    price: "UGX 350,000",
    duration: "60 - 90 mins",
    description: "Intimate and sensual full-body session in complete privacy. Performed with warm natural oils, soothing touch, and utmost discretion.",
    features: ["100% confidential & discreet", "Waterproof sheets & supplies included", "Warm aromatic oils", "Strict hygiene guarantee"],
    image: "/assets/service3.jpg",
  },
  {
    title: "4-Hands Duo In-Call Experience",
    price: "UGX 550,000",
    duration: "90 mins",
    description: "Two therapists working in seamless synchrony over your body at your home or hotel. The ultimate luxury out-call package.",
    features: ["Two senior therapists", "Harmonized strokes", "Maximum sensory stimulation", "Complete equipment provided"],
    image: "/assets/4hands-nuru-b2b.jpg",
  },
];

const COVERAGE_AREAS = [
  "Nakasero & Kololo",
  "Nakasero Hill & CBD Hotels",
  "Mengo & Sir Apollo Kaggwa",
  "Bugolobi & Mbuya",
  "Naguru & Bukoto",
  "Muyenga & Kansanga",
  "Ntinda & Kiwatule",
  "Munzi & Munyonyo",
  "Entebbe Road & Hotels",
  "All Greater Kampala Residences",
];

const whatsappNumber = "256781945510";

export default function MobileMassagePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <CustomCursor />

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
                  <li><Link href="/vip-packages" style={{ color: "#ffffff", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>VIP Packages</Link></li>
                  <li className="current"><Link href="/mobile-massage" style={{ color: "#c2a74e", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Mobile Massage</Link></li>
                  <li><Link href="/gallery" style={{ color: "#ffffff", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Gallery</Link></li>
                  <li><Link href="/blog" style={{ color: "#ffffff", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Blog</Link></li>
                </ul>
              </nav>

              <div className="main-header__right" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello, I would like to book an Out-Call / Mobile Massage session in Kampala.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="solox-btn main-header__btn d-none d-sm-inline-flex"
                  style={{
                    backgroundColor: "#25D366",
                    color: "#ffffff",
                    padding: "10px 22px",
                    fontWeight: 700,
                    fontSize: "12px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    borderRadius: "4px",
                    textDecoration: "none",
                  }}
                >
                  <i className="fab fa-whatsapp" style={{ marginRight: "6px" }}></i>
                  <span>Call to Room</span>
                </a>

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
            minHeight: "440px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: "url(/assets/images/backgrounds/slider-2-2.jpg)",
            backgroundColor: "#000000",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            textAlign: "center",
            padding: "80px 20px",
            borderBottom: "1px solid rgba(194, 167, 78,0.2)",
          }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.75)" }} />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: "840px",
              margin: "0 auto",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            <span style={{ color: "#c2a74e", fontFamily: "'Great Vibes', cursive, Cormorant, serif", fontSize: "1.6rem", display: "block", marginBottom: "10px", letterSpacing: "2px" }}>
              At Your Doorstep · Hotel &amp; Home Out-Calls
            </span>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 700, color: "#ffffff", margin: "0 0 14px 0", lineHeight: 1.15 }}>
              Luxury Mobile Massage in Kampala
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "clamp(0.9rem, 2vw, 1.05rem)", maxWidth: "680px", margin: "0 auto 22px auto", lineHeight: 1.6 }}>
              Enjoy our full five-star spa experience without leaving the comfort of your hotel room, apartment, or private residence. Our certified therapists bring luxury tables, fresh linens, organic oils, and soothing ambience directly to you.
            </p>
            <nav style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
              <span style={{ margin: "0 8px", color: "#c2a74e" }}>/</span>
              <span style={{ color: "#c2a74e" }}>Mobile Massage</span>
            </nav>
          </div>
        </div>

        {/* --- HOW IT WORKS (3 STEPS) --- */}
        <section style={{ padding: "60px 0 50px 0", backgroundColor: "#12171c" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span style={{ color: "#c2a74e", textTransform: "uppercase", letterSpacing: "2px", fontSize: "12px", fontWeight: 700 }}>
                Simple &amp; Discreet
              </span>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "2.4rem", fontWeight: 700, color: "#fff", margin: "8px 0 0 0" }}>
                How Mobile Out-Call Works
              </h2>
            </div>

            <div className="row g-4">
              {[
                {
                  step: "01",
                  title: "Book via WhatsApp or Call",
                  desc: "Share your location (hotel name & room, or residence address), your preferred therapy, and convenient arrival time.",
                  icon: "fas fa-mobile-alt",
                },
                {
                  step: "02",
                  title: "Therapist Arrives with Setup",
                  desc: "Our verified, professional therapist arrives promptly with a portable massage table, warm oils, fresh towels, and relaxing sound.",
                  icon: "fas fa-spa",
                },
                {
                  step: "03",
                  title: "Indulge in Total Privacy",
                  desc: "Relax in your personal sanctuary without traffic or stress. Pay conveniently after your session via Cash, Mobile Money, or Card.",
                  icon: "fas fa-glass-cheers",
                },
              ].map((item, idx) => (
                <div key={idx} className="col-md-4 col-12">
                  <div
                    style={{
                      backgroundColor: "#161c22",
                      border: "1px solid rgba(194, 167, 78,0.25)",
                      borderRadius: "10px",
                      padding: "30px 24px",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <span style={{ fontFamily: "Cormorant, serif", fontSize: "2.2rem", fontWeight: 700, color: "#c2a74e" }}>
                        {item.step}
                      </span>
                      <i className={item.icon} style={{ fontSize: "1.8rem", color: "rgba(194, 167, 78,0.6)" }}></i>
                    </div>
                    <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.35rem", fontWeight: 700, color: "#ffffff", marginBottom: "10px" }}>
                      {item.title}
                    </h3>
                    <p style={{ color: "#9ca3af", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- MOBILE SERVICES LIST --- */}
        <section style={{ padding: "70px 0 90px 0" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <span style={{ color: "#c2a74e", textTransform: "uppercase", letterSpacing: "2px", fontSize: "12px", fontWeight: 700 }}>
                Popular Out-Call Therapies
              </span>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "2.4rem", fontWeight: 700, color: "#fff", margin: "8px 0 0 0" }}>
                Therapies Available for Out-Call
              </h2>
            </div>

            <div className="row g-4">
              {MOBILE_SERVICES.map((service, index) => (
                <div key={index} className="col-lg-4 col-md-6 col-12">
                  <div
                    style={{
                      backgroundColor: "#161c22",
                      border: "1px solid rgba(194, 167, 78,0.3)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                    }}
                  >
                    <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                      <img
                        src={service.image}
                        alt={service.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/assets/service1.jpg";
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          backgroundColor: "#c2a74e",
                          color: "#0e1317",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                        }}
                      >
                        {service.duration}
                      </div>
                    </div>

                    <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
                        <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.35rem", fontWeight: 700, color: "#fff", margin: 0 }}>
                          {service.title}
                        </h3>
                      </div>
                      <div style={{ color: "#c2a74e", fontSize: "1.2rem", fontWeight: 700, fontFamily: "Cormorant, serif", marginBottom: "12px" }}>
                        {service.price}
                      </div>

                      <p style={{ color: "#9ca3af", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "16px", flex: 1 }}>
                        {service.description}
                      </p>

                      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", fontSize: "12px", color: "#d1d5db" }}>
                        {service.features.map((feat, fIdx) => (
                          <li key={fIdx} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                            <i className="fas fa-check" style={{ color: "#c2a74e", fontSize: "10px" }}></i>
                            {feat}
                          </li>
                        ))}
                      </ul>

                      <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
                        <a
                          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello, I'd like to book an out-call for ${service.title} (${service.price}) at my location.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            padding: "10px 12px",
                            backgroundColor: "#25D366",
                            color: "#ffffff",
                            borderRadius: "4px",
                            fontWeight: 700,
                            fontSize: "12px",
                            textAlign: "center",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          <i className="fab fa-whatsapp"></i> Book via WhatsApp
                        </a>
                        <Link
                          href={`/booking?service=${encodeURIComponent(service.title)}`}
                          style={{
                            padding: "10px 14px",
                            backgroundColor: "transparent",
                            border: "1px solid rgba(194, 167, 78,0.4)",
                            color: "#c2a74e",
                            borderRadius: "4px",
                            fontWeight: 700,
                            fontSize: "12px",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          Book Online
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- COVERAGE AREAS & GUARANTEE --- */}
        <section style={{ padding: "60px 0", backgroundColor: "#12171c", borderTop: "1px solid rgba(194, 167, 78,0.2)" }}>
          <div className="container">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6 col-12">
                <span style={{ color: "#c2a74e", textTransform: "uppercase", letterSpacing: "2px", fontSize: "12px", fontWeight: 700 }}>
                  Service Coverage
                </span>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "2.3rem", fontWeight: 700, color: "#fff", margin: "10px 0 16px 0" }}>
                  Serving All Kampala Hotels, Airbnbs &amp; Residences
                </h2>
                <p style={{ color: "#9ca3af", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "22px" }}>
                  Whether you are staying at Sheraton, Serena, Mestil, Latitude 0°, Protea, or an executive Airbnb, our therapists arrive within 45 to 60 minutes of booking confirmation.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                  {COVERAGE_AREAS.map((area, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#e5e7eb" }}>
                      <i className="fas fa-map-pin" style={{ color: "#c2a74e", fontSize: "11px" }}></i>
                      {area}
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-lg-6 col-12">
                <div
                  style={{
                    backgroundColor: "#161c22",
                    border: "1px solid rgba(194, 167, 78,0.35)",
                    borderRadius: "12px",
                    padding: "36px 30px",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
                  }}
                >
                  <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.8rem", color: "#c2a74e", marginBottom: "14px" }}>
                    Our Mobile Service Guarantee
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <i className="fas fa-user-shield" style={{ color: "#c2a74e", fontSize: "20px", marginTop: "4px" }}></i>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>100% Verified Therapists</div>
                        <div style={{ color: "#9ca3af", fontSize: "12px", lineHeight: 1.5 }}>
                          All mobile staff are professionally trained, background-checked, and carry official spa identification.
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <i className="fas fa-pump-medical" style={{ color: "#c2a74e", fontSize: "20px", marginTop: "4px" }}></i>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>Sterilized &amp; Fresh Equipment</div>
                        <div style={{ color: "#9ca3af", fontSize: "12px", lineHeight: 1.5 }}>
                          Freshly laundered single-use sheets, sanitized equipment, and disposable covers provided for each appointment.
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <i className="fas fa-lock" style={{ color: "#c2a74e", fontSize: "20px", marginTop: "4px" }}></i>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>Complete Discretion &amp; Privacy</div>
                        <div style={{ color: "#9ca3af", fontSize: "12px", lineHeight: 1.5 }}>
                          We uphold strict confidentiality standards for every client, hotel guest, and diplomat in Kampala.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
              <li><Link href="/vip-packages" style={{ color: "#9ca3af", textDecoration: "none" }}>VIP Packages</Link></li>
              <li><Link href="/mobile-massage" style={{ color: "#c2a74e", textDecoration: "none" }}>Mobile Massage</Link></li>
              <li><Link href="/gallery" style={{ color: "#9ca3af", textDecoration: "none" }}>Gallery</Link></li>
              <li><Link href="/blog" style={{ color: "#9ca3af", textDecoration: "none" }}>Blog</Link></li>
            </ul>
            <div>&copy; {new Date().getFullYear()} The Serenity Spa. All rights reserved.</div>
          </div>
        </footer>

        <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      </div>
    </>
  );
}
