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

const SCRIPT = '"Alex Brush", cursive';
const SERIF = '"Cormorant", serif';
const GOLD = "#c2a74e";
const CREAM = "#e8d9b0";

const waLink = (message: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

/* Shared section heading — the exact Alex Brush + Cormorant scale used on the
   homepage and /vip-packages, so this page finally matches the rest of the site. */
function SectionTitle({
  tagline,
  title,
  align = "center",
  style,
}: {
  tagline: string;
  title: string;
  align?: "center" | "left";
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="sec-title"
      style={{ textAlign: align, marginBottom: "46px", ...style }}
    >
      <span
        style={{
          display: "block",
          fontFamily: SCRIPT,
          fontSize: "clamp(2rem, 4vw, 2.7rem)",
          lineHeight: 1.1,
          color: GOLD,
          marginBottom: "6px",
        }}
      >
        {tagline}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: "clamp(1.9rem, 4vw, 3rem)",
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "#ffffff",
          margin: 0,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          width: "72px",
          height: "2px",
          margin: align === "center" ? "20px auto 0" : "20px 0 0",
          background: `linear-gradient(90deg, ${GOLD}, rgba(194,167,78,0.1))`,
        }}
      />
    </div>
  );
}

/* IntersectionObserver reveal — same timing as the VIP page (1000ms ease). */
function Reveal({
  children,
  delay = 0,
  offset = 80,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  offset?: number;
  style?: React.CSSProperties;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translate3d(0,0,0)" : `translate3d(0,${offset}px,0)`,
        transition: `opacity 1000ms ease ${delay}ms, transform 1000ms ease ${delay}ms`,
        willChange: "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function EscortsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroVisible, setHeroVisible] = React.useState(false);
  const [filter, setFilter] = useState<"all" | "available" | "engaged">("all");

  React.useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const shownCompanions = companions.filter((c) =>
    filter === "all"
      ? true
      : filter === "available"
        ? c.availability === "available"
        : c.availability !== "available"
  );

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "VIP Packages", href: "/vip-packages" },
    { label: "Mobile Massage", href: "/mobile-massage" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Escorts", href: "/escorts" },
  ];

  return (
    <>
      <CustomCursor />

      <style jsx global>{`
        @keyframes escortGoldShimmer {
          0% { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes escortStatusPulse {
          0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.65); }
          70% { box-shadow: 0 0 0 7px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }
        @keyframes escortScrollCue {
          0% { transform: translateY(0); opacity: 0.9; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        .escort-status-pulse { animation: escortStatusPulse 2s infinite; }
        .escort-companion-card {
          transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, box-shadow 0.45s ease;
        }
        .escort-companion-card:hover {
          transform: translateY(-10px);
          border-color: rgba(194,167,78,0.75) !important;
          box-shadow: 0 26px 60px rgba(0,0,0,0.62), 0 0 34px rgba(194,167,78,0.2) !important;
        }
        .escort-companion-card:hover .companion-img {
          transform: scale(1.08);
        }
        .escort-companion-card:hover .companion-hover {
          opacity: 1 !important;
        }
        .companion-img { transition: transform 0.7s cubic-bezier(0.16,1,0.3,1); }
        .companion-hover { transition: opacity 0.35s ease; }
        .escort-book-btn { transition: all 0.25s ease; }
        .escort-book-btn:hover { background: #ffffff !important; color: #0e1317 !important; transform: scale(1.03); }
        .escort-gold-title {
          background: linear-gradient(90deg, #7a5c1e 0%, #c2a74e 20%, #f5e199 35%, #d4af37 50%, #f5e199 65%, #c2a74e 80%, #7a5c1e 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: escortGoldShimmer 5s linear infinite;
        }
        .escort-scroll-cue { animation: escortScrollCue 1.8s ease-in-out infinite; }
        .escort-filter-pill { transition: all 0.25s ease; }
        .escort-filter-pill:hover { border-color: rgba(194,167,78,0.8) !important; color: #f5e199 !important; }
        @media (max-width: 991px) {
          .escort-hero { min-height: 600px !important; padding-top: 100px !important; }
          .escort-intro-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .escort-trust-strip { flex-direction: column !important; gap: 18px !important; }
          .escort-trust-divider { display: none !important; }
          .escort-timeline-line { display: none !important; }
        }
      `}</style>

      <div style={{ backgroundColor: "#0e1317", color: "#c4cfde", minHeight: "100vh", overflowX: "hidden" }}>

        {/* ─── HEADER (transparent overlay, unchanged) ─── */}
        <header className="main-header main-header--two sticky-header sticky-header--normal">
          <div className="container-fluid">
            <div className="main-header__inner">
              <div className="main-header__logo">
                <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                  <img
                    src="/assets/logo.jpg"
                    alt="The Serenity Spa"
                    style={{
                      height: "52px", width: "52px", borderRadius: "50%", objectFit: "cover",
                      border: "2px solid rgba(194,167,78,0.6)", display: "block",
                    }}
                  />
                </Link>
              </div>
              <nav className="main-header__nav main-menu">
                <ul className="main-menu__list">
                  {navItems.map((item) => (
                    <li key={item.href} className={item.href === "/escorts" ? "current" : ""}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="main-header__right">
                <div
                  className="mobile-nav__btn mobile-nav__toggler"
                  onClick={() => setMobileMenuOpen(true)}
                  style={{ cursor: "pointer" }}
                >
                  <span></span><span></span><span></span>
                </div>
                <Link href="/booking" className="solox-btn main-header__btn"><span>Book now</span></Link>
              </div>
            </div>
          </div>
          <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </header>

        {/* ─── NEW CINEMATIC HERO ─── */}
        <div
          className="escort-hero"
          style={{
            position: "relative",
            minHeight: "680px",
            paddingTop: "133px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute", inset: 0,
              backgroundImage: "url('https://res.cloudinary.com/njzctr4m/image/upload/v1784667206/serenity_gallery/u7wll8tto5yxjt4ptcbl.jpg')",
              backgroundSize: "cover", backgroundPosition: "center 22%",
              transform: heroVisible ? "scale(1)" : "scale(1.1)",
              transition: "transform 1.8s cubic-bezier(0.16,1,0.3,1)",
              filter: "brightness(0.3) saturate(0.85)",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(14,19,23,0.65) 0%, rgba(14,19,23,0.35) 40%, #0e1317 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, rgba(194,167,78,0.1) 0%, transparent 62%)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #c2a74e, transparent)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #c2a74e, transparent)" }} />

          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "40px 24px 80px", maxWidth: "900px" }}>
            {/* eyebrow drops from above */}
            <div
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(-60px)",
                transition: "opacity 900ms ease 120ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 120ms",
                marginBottom: "18px",
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: "rgba(232,217,176,0.75)" }}>
                The Serenity Spa · Kampala
              </span>
            </div>

            <div
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(-40px)",
                transition: "opacity 900ms ease 260ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 260ms",
              }}
            >
              <span style={{ fontFamily: SCRIPT, fontSize: "clamp(2.2rem, 5vw, 3.2rem)", lineHeight: 1, color: GOLD, display: "block", marginBottom: "10px" }}>
                Private Companionship
              </span>
            </div>

            {/* title rises through a curtain that sweeps out of its own wrapper */}
            <div
              style={{
                position: "relative", display: "inline-block", overflow: "hidden",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(70px)",
                transition: "opacity 1200ms ease 400ms, transform 1200ms cubic-bezier(0.16,1,0.3,1) 400ms",
                padding: "0 8px",
              }}
            >
              <h1
                className="escort-gold-title"
                style={{
                  fontFamily: SERIF, fontSize: "clamp(3rem, 8vw, 5.6rem)", fontWeight: 700,
                  lineHeight: 1.05, letterSpacing: "0.03em", textTransform: "uppercase",
                  margin: "6px 0 0", whiteSpace: "nowrap",
                }}
              >
                Escort Services
              </h1>
              <span
                aria-hidden="true"
                style={{
                  position: "absolute", inset: 0, backgroundColor: "#0e1317", zIndex: 2,
                  transform: heroVisible ? "translateX(101%)" : "translateX(0)",
                  transition: "transform 1000ms cubic-bezier(0.858,0.01,0.068,0.99) 450ms",
                }}
              />
            </div>

            <div
              style={{
                width: "110px", height: "2px", margin: "26px auto",
                background: "linear-gradient(90deg, transparent, #c2a74e, transparent)",
                position: "relative",
              }}
            >
              <span style={{ position: "absolute", left: "50%", top: "50%", width: "7px", height: "7px", background: GOLD, transform: "translate(-50%,-50%) rotate(45deg)" }} />
            </div>

            <p
              style={{
                fontFamily: SERIF, fontStyle: "italic",
                fontSize: "clamp(1.05rem, 2.4vw, 1.35rem)",
                color: "rgba(232,217,176,0.85)", maxWidth: "620px", margin: "0 auto",
                lineHeight: 1.7,
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 1500ms ease 650ms, transform 1500ms cubic-bezier(0.16,1,0.3,1) 650ms",
              }}
            >
              Exclusive, discreet, and utterly refined — curated companionship for the discerning gentleman.
            </p>

            <div
              style={{
                display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginTop: "34px",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 1500ms ease 800ms, transform 1500ms cubic-bezier(0.16,1,0.3,1) 800ms",
              }}
            >
              <a
                href="#companions"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 30px",
                  background: `linear-gradient(135deg, ${GOLD}, #d4af37, ${GOLD})`, backgroundSize: "200% auto",
                  color: "#0e1317", borderRadius: "4px", textDecoration: "none", fontWeight: 800,
                  fontSize: "11px", letterSpacing: "1.6px", textTransform: "uppercase",
                  animation: "escortGoldShimmer 4s linear infinite",
                  boxShadow: "0 10px 30px rgba(194,167,78,0.3)",
                }}
              >
                <i className="fas fa-user-check" style={{ fontSize: "13px" }} /> Meet the Companions
              </a>
              <a
                href={waLink("Hello, I would like to enquire about your escort companionship services at The Serenity Spa.")}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 30px",
                  background: "rgba(14,19,23,0.5)", color: CREAM, borderRadius: "4px",
                  textDecoration: "none", fontWeight: 700, fontSize: "11px", letterSpacing: "1.6px",
                  textTransform: "uppercase", border: "1px solid rgba(194,167,78,0.55)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <i className="fab fa-whatsapp" style={{ fontSize: "15px" }} /> WhatsApp Concierge
              </a>
            </div>
          </div>

          <a
            href="#intro"
            aria-label="Scroll to introduction"
            style={{
              position: "absolute", bottom: "26px", left: "50%", transform: "translateX(-50%)",
              zIndex: 3, color: GOLD, fontSize: "20px", opacity: 0.85,
            }}
          >
            <i className="fas fa-chevron-down escort-scroll-cue" />
          </a>
        </div>

        {/* ─── DISCRETION STRIP (new) ─── */}
        <div
          className="escort-trust-strip"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0",
            padding: "26px 24px", background: "#0a0e12",
            borderTop: "1px solid rgba(194,167,78,0.12)", borderBottom: "1px solid rgba(194,167,78,0.12)",
          }}
        >
          {[
            { icon: "fa-shield-alt", text: "Verified companion profiles" },
            { icon: "fa-user-secret", text: "Absolute discretion, always" },
            { icon: "fa-clock", text: "Concierge available 24/7" },
          ].map((item, i) => (
            <React.Fragment key={item.text}>
              {i > 0 && <div className="escort-trust-divider" style={{ width: "1px", height: "34px", background: "rgba(194,167,78,0.22)", margin: "0 42px" }} />}
              <Reveal delay={i * 120} offset={24}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <i className={`fas ${item.icon}`} style={{ color: GOLD, fontSize: "18px" }} />
                  <span style={{ fontFamily: SERIF, fontSize: "1.05rem", letterSpacing: "0.03em", color: CREAM, whiteSpace: "nowrap" }}>
                    {item.text}
                  </span>
                </div>
              </Reveal>
            </React.Fragment>
          ))}
        </div>

        {/* ─── INTRO (two-column editorial) ─── */}
        <section id="intro" style={{ padding: "110px 0 90px", background: "#0e1317" }}>
          <div className="container">
            <div className="escort-intro-grid" style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "70px", alignItems: "start" }}>
              <Reveal offset={60}>
                <div style={{ borderLeft: "2px solid rgba(194,167,78,0.5)", paddingLeft: "28px" }}>
                  <SectionTitle tagline="The Serenity Experience" title="Discreet. Elegant. Unforgettable." align="left" style={{ marginBottom: 0 }} />
                </div>
              </Reveal>
              <Reveal delay={140} offset={60}>
                <div>
                  <p style={{ color: "rgba(196,207,222,0.85)", fontSize: "clamp(1.05rem, 1.8vw, 1.2rem)", lineHeight: 1.9, margin: "0 0 22px", fontFamily: SERIF }}>
                    At The Serenity Spa, our escort service offers a level of sophistication and discretion that is simply unmatched. Whether you require an elegant companion for a corporate gala, a private dinner, a social event, or a memorable getaway — our curated companions are selected for their poise, intellect, and natural charm.
                  </p>
                  <p style={{ color: "rgba(196,207,222,0.6)", fontSize: "clamp(1rem, 1.6vw, 1.1rem)", lineHeight: 1.9, margin: 0, fontFamily: SERIF, fontStyle: "italic" }}>
                    Every engagement is conducted with absolute confidentiality and the highest standards of professionalism. Your privacy is our paramount commitment.
                  </p>
                  <div style={{ display: "flex", gap: "30px", marginTop: "34px", flexWrap: "wrap" }}>
                    {[
                      { n: "04", l: "Curated companions" },
                      { n: "100%", l: "Confidential" },
                      { n: "24/7", l: "Concierge support" },
                    ].map((s) => (
                      <div key={s.l}>
                        <div style={{ fontFamily: SERIF, fontSize: "1.9rem", fontWeight: 700, color: GOLD, lineHeight: 1 }}>{s.n}</div>
                        <div style={{ fontSize: "10px", letterSpacing: "1.4px", textTransform: "uppercase", color: "rgba(196,207,222,0.55)", marginTop: "6px" }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── COMPANIONS GRID + FILTER ─── */}
        <section id="companions" style={{ padding: "20px 0 110px", background: "#0e1317" }}>
          <div className="container">
            <Reveal offset={50}>
              <SectionTitle tagline="Our Companions" title="Meet the Elite" />
            </Reveal>

            <Reveal delay={80} offset={30}>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "46px", flexWrap: "wrap" }}>
                {([
                  { key: "all", label: "All Companions" },
                  { key: "available", label: "Available Now" },
                  { key: "engaged", label: "Currently Engaged" },
                ] as const).map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className="escort-filter-pill"
                    onClick={() => setFilter(f.key)}
                    aria-pressed={filter === f.key}
                    style={{
                      padding: "10px 22px", borderRadius: "30px", cursor: "pointer",
                      fontSize: "10px", fontWeight: 800, letterSpacing: "1.3px", textTransform: "uppercase",
                      background: filter === f.key ? GOLD : "rgba(194,167,78,0.06)",
                      color: filter === f.key ? "#0e1317" : "rgba(232,217,176,0.7)",
                      border: filter === f.key ? `1px solid ${GOLD}` : "1px solid rgba(194,167,78,0.28)",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </Reveal>

            <div className="row g-4">
              {shownCompanions.map((c, i) => {
                const isAvailable = c.availability === "available";
                return (
                  <div key={c.name} className="col-xl-3 col-lg-4 col-md-6 col-12">
                    <Reveal delay={(i % 4) * 90} offset={70} style={{ height: "100%" }}>
                      <div
                        className="escort-companion-card"
                        style={{
                          background: "linear-gradient(160deg, #161c22 0%, #1a2130 100%)",
                          border: "1px solid rgba(194,167,78,0.22)", borderRadius: "14px",
                          overflow: "hidden", height: "100%", display: "flex", flexDirection: "column",
                          boxShadow: "0 10px 34px rgba(0,0,0,0.5)",
                        }}
                      >
                        <div style={{ position: "relative", height: "330px", overflow: "hidden" }}>
                          <img
                            src={c.image}
                            alt={c.name}
                            className="companion-img"
                            loading="lazy"
                            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }}
                            onError={(e) => { (e.target as HTMLImageElement).src = "/assets/service1.jpg"; }}
                          />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 38%, rgba(14,19,23,0.96) 100%)" }} />
                          <div className="companion-hover" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(14,19,23,0.45)", opacity: 0 }}>
                            <span style={{ fontFamily: SCRIPT, fontSize: "2rem", color: "#f5e199" }}>Enquire</span>
                          </div>
                          <span style={{ position: "absolute", top: "14px", left: "16px", fontFamily: SERIF, fontSize: "1.1rem", fontWeight: 700, color: "rgba(232,217,176,0.55)" }}>
                            {String(companions.indexOf(c) + 1).padStart(2, "0")}
                          </span>
                          <div
                            style={{
                              position: "absolute", top: "12px", right: "12px", display: "inline-flex", alignItems: "center", gap: "6px",
                              padding: "6px 11px", borderRadius: "20px", background: "rgba(10,14,18,0.88)", backdropFilter: "blur(6px)",
                              border: isAvailable ? "1px solid rgba(16,185,129,0.55)" : "1px solid rgba(239,68,68,0.45)",
                            }}
                          >
                            <span
                              className={isAvailable ? "escort-status-pulse" : ""}
                              style={{ width: "8px", height: "8px", borderRadius: "50%", background: isAvailable ? "#10b981" : "#ef4444", display: "inline-block" }}
                            />
                            <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.6px", textTransform: "uppercase", color: isAvailable ? "#34d399" : "#f87171", lineHeight: 1 }}>
                              {isAvailable ? "Available" : "Engaged"}
                            </span>
                          </div>
                          <div style={{ position: "absolute", bottom: "16px", left: "18px" }}>
                            <h3 style={{ fontFamily: SERIF, fontSize: "1.7rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1, textShadow: "0 2px 8px rgba(0,0,0,0.85)" }}>
                              {c.name}
                            </h3>
                            <p style={{ margin: "6px 0 0", fontSize: "10px", fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase", color: GOLD }}>
                              {c.title}
                            </p>
                          </div>
                        </div>

                        <div style={{ padding: "22px 20px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "14px", padding: "6px 12px", borderRadius: "20px", background: "rgba(194,167,78,0.1)", border: "1px solid rgba(194,167,78,0.25)", width: "fit-content" }}>
                            <i className="fas fa-star" style={{ color: GOLD, fontSize: "9px" }} />
                            <span style={{ fontSize: "10px", color: GOLD, fontWeight: 700, letterSpacing: "0.5px" }}>{c.specialty}</span>
                          </div>
                          <p style={{ fontSize: "0.95rem", color: "rgba(196,207,222,0.75)", lineHeight: 1.7, margin: "0 0 22px", fontFamily: SERIF, fontStyle: "italic", flex: 1 }}>
                            {c.description}
                          </p>
                          <a
                            href={waLink(
                              isAvailable
                                ? `Hello, I'm interested in booking ${c.name} for escort companionship services at The Serenity Spa.`
                                : `Hello, I'd like to join the waitlist for ${c.name} at The Serenity Spa.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="escort-book-btn"
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                              padding: "13px 20px",
                              background: isAvailable ? GOLD : "rgba(24,30,36,0.9)",
                              color: isAvailable ? "#0e1317" : "#c4cfde",
                              border: isAvailable ? `1.5px solid #d4af37` : "1px solid rgba(194,167,78,0.3)",
                              borderRadius: "4px", textDecoration: "none", fontSize: "10px", fontWeight: 800,
                              letterSpacing: "1.2px", textTransform: "uppercase",
                            }}
                          >
                            <i className="fab fa-whatsapp" style={{ fontSize: "14px" }} />
                            <span>{isAvailable ? "Book Companion" : "Join Waitlist"}</span>
                          </a>
                        </div>
                      </div>
                    </Reveal>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── QUOTE BAND (new) ─── */}
        <section
          style={{
            padding: "100px 24px", textAlign: "center", position: "relative",
            background: "linear-gradient(135deg, #161c22 0%, #0a0e12 100%)",
            borderTop: "1px solid rgba(194,167,78,0.14)", borderBottom: "1px solid rgba(194,167,78,0.14)",
          }}
        >
          <div style={{ maxWidth: "820px", margin: "0 auto" }}>
            <span style={{ fontFamily: SERIF, fontSize: "5rem", lineHeight: 0.5, color: "rgba(194,167,78,0.35)", display: "block", marginBottom: "18px" }}>
              “
            </span>
            <Reveal offset={50}>
              <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(1.4rem, 3.4vw, 2.2rem)", lineHeight: 1.5, color: CREAM, margin: "0 0 22px" }}>
                True luxury is the confidence of knowing every detail has been considered — and every confidence kept.
              </p>
            </Reveal>
            <div style={{ width: "70px", height: "2px", background: GOLD, margin: "0 auto 18px" }} />
            <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: GOLD }}>
              The Serenity Standard
            </span>
          </div>
        </section>

        {/* ─── HOW IT WORKS (timeline) ─── */}
        <section style={{ padding: "110px 0", background: "#0e1317" }}>
          <div className="container">
            <Reveal offset={50}>
              <SectionTitle tagline="The Process" title="How It Works" />
            </Reveal>
            <div style={{ position: "relative", maxWidth: "1050px", margin: "0 auto" }}>
              <div className="escort-timeline-line" style={{ position: "absolute", top: "34px", left: "8%", right: "8%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(194,167,78,0.55), transparent)" }} />
              <div className="row g-4">
                {[
                  { step: "01", icon: "fa-comments", title: "Enquire Discreetly", desc: "Reach out via WhatsApp or our booking form. All communication is strictly confidential." },
                  { step: "02", icon: "fa-user-check", title: "Select Your Companion", desc: "Browse our curated profiles and choose the companion that matches your preference and occasion." },
                  { step: "03", icon: "fa-calendar-check", title: "Confirm & Arrange", desc: "We handle all logistics. Time, venue, and special requirements are arranged with absolute discretion." },
                  { step: "04", icon: "fa-gem", title: "Enjoy the Experience", desc: "Your companion arrives impeccably presented, ready to make your occasion truly memorable." },
                ].map((s, i) => (
                  <div key={s.step} className="col-md-6 col-lg-3">
                    <Reveal delay={i * 130} offset={60} style={{ height: "100%" }}>
                      <div style={{ textAlign: "center", padding: "0 8px", height: "100%" }}>
                        <div
                          style={{
                            width: "68px", height: "68px", borderRadius: "50%", margin: "0 auto 22px",
                            background: "#0e1317", border: `1.5px solid ${GOLD}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 0 0 7px #0e1317, 0 8px 24px rgba(0,0,0,0.5)",
                          }}
                        >
                          <i className={`fas ${s.icon}`} style={{ color: GOLD, fontSize: "21px" }} />
                        </div>
                        <div style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "2px", color: "rgba(194,167,78,0.6)", marginBottom: "8px" }}>STEP {s.step}</div>
                        <h4 style={{ fontFamily: SERIF, fontSize: "1.35rem", fontWeight: 700, color: CREAM, margin: "0 0 10px" }}>
                          {s.title}
                        </h4>
                        <p style={{ fontSize: "0.9rem", color: "rgba(196,207,222,0.65)", lineHeight: 1.75, margin: 0 }}>
                          {s.desc}
                        </p>
                      </div>
                    </Reveal>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── RICH CTA ─── */}
        <section
          style={{
            position: "relative", padding: "120px 24px", textAlign: "center", overflow: "hidden",
            backgroundImage: "url('https://res.cloudinary.com/njzctr4m/image/upload/v1784667087/serenity_gallery/cnl0pcncguetzsg6ms5v.jpg')",
            backgroundSize: "cover", backgroundPosition: "center 30%",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(14,19,23,0.9), rgba(14,19,23,0.96))" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(194,167,78,0.1), transparent 65%)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #c2a74e, transparent)" }} />
          <div style={{ position: "relative", zIndex: 2, maxWidth: "720px", margin: "0 auto" }}>
            <Reveal offset={50}>
              <span style={{ fontFamily: SCRIPT, fontSize: "clamp(2rem, 4vw, 2.7rem)", color: GOLD, display: "block", marginBottom: "10px" }}>
                Begin Your Experience
              </span>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 700, lineHeight: 1.15, textTransform: "uppercase", letterSpacing: "0.04em", color: "#fff", margin: "0 0 20px" }}>
                Arrange a Private Consultation
              </h2>
              <div style={{ width: "90px", height: "2px", background: "linear-gradient(90deg, transparent, #c2a74e, transparent)", margin: "0 auto 24px" }} />
              <p style={{ color: "rgba(196,207,222,0.78)", fontSize: "clamp(1rem, 2vw, 1.1rem)", lineHeight: 1.8, marginBottom: "34px", fontFamily: SERIF }}>
                Our concierge team is available 24/7 to assist you in selecting the perfect companion and arranging all details with the utmost discretion.
              </p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={waLink("Hello, I would like to enquire about your escort companionship services at The Serenity Spa.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "10px", padding: "15px 34px",
                    background: `linear-gradient(135deg, ${GOLD}, #d4af37, ${GOLD})`, backgroundSize: "200% auto",
                    color: "#0e1317", borderRadius: "4px", textDecoration: "none", fontWeight: 800,
                    fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase",
                    animation: "escortGoldShimmer 3s linear infinite", boxShadow: "0 10px 28px rgba(194,167,78,0.35)",
                  }}
                >
                  <i className="fab fa-whatsapp" style={{ fontSize: "16px" }} /> WhatsApp Us Now
                </a>
                <Link
                  href="/booking"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "10px", padding: "15px 34px",
                    background: "transparent", color: GOLD, borderRadius: "4px", textDecoration: "none",
                    fontWeight: 700, fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase",
                    border: `1.5px solid rgba(194,167,78,0.55)`,
                  }}
                >
                  <i className="fas fa-calendar-alt" style={{ fontSize: "13px" }} /> Book Online
                </Link>
              </div>
              <p style={{ margin: "28px 0 0", fontSize: "10px", letterSpacing: "1.8px", textTransform: "uppercase", color: "rgba(196,207,222,0.45)" }}>
                Adults only · 18+ · Kampala, Uganda
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer style={{ padding: "46px 24px 34px", background: "#0a0e12", borderTop: "1px solid rgba(194,167,78,0.12)", textAlign: "center" }}>
          <img src="/assets/logo.jpg" alt="The Serenity Spa" style={{ height: "42px", width: "42px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(194,167,78,0.4)" }} />
          <p style={{ color: "rgba(194,167,78,0.8)", fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", margin: "12px 0 18px" }}>
            The Serenity Spa
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "22px", flexWrap: "wrap", marginBottom: "18px" }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} style={{ color: "rgba(196,207,222,0.6)", fontSize: "11px", textDecoration: "none", letterSpacing: "0.04em" }}>
                {item.label}
              </Link>
            ))}
          </div>
          <p style={{ color: "rgba(196,207,222,0.4)", fontSize: "11px", margin: 0 }}>
            All engagements are strictly confidential. Adults only. Kampala, Uganda.
          </p>
        </footer>
      </div>
    </>
  );
}
