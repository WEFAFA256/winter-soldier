"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";
import { useSiteContact } from "@/components/ContactProvider";
import { Companion, escortSlug } from "@/lib/escorts";
import { usePageReveal } from "@/lib/use-page-reveal";

const SCRIPT = '"Alex Brush", cursive';
const SERIF = '"Cormorant", serif';
const GOLD = "#c2a74e";
const CREAM = "#e8d9b0";

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
      <h1
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
      </h1>
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

/* One-shot section reveal. Already-visible first-paint sections stay static;
   offscreen sections animate once when scrolled into view and always end visible. */
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
  const { ref, className } = usePageReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={className}
      style={
        {
          opacity: 1,
          transform: "translate3d(0,0,0)",
          "--page-motion-duration": "1000ms",
          "--page-motion-delay": `${delay}ms`,
          "--page-motion-offset": `${offset}px`,
          willChange: "opacity, transform",
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

export default function EscortsPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "available" | "engaged">("all");
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [loading, setLoading] = useState(true);
  const { whatsappLink } = useSiteContact();

  // Admin edits live in the R2-backed content store. First paint is empty and
  // only records returned by that store are rendered — no seeded defaults.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/content", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.escorts)) {
            if (!cancelled) {
              setCompanions(data.escorts);
              setLoading(false);
            }
            return;
          }
        }
      } catch {
        // fall through to the empty state
      }
      if (!cancelled) {
        setCompanions([]);
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const shownCompanions = companions.filter((c) =>
    filter === "all"
      ? true
      : filter === "available"
        ? c.availability === "available"
        : c.availability !== "available"
  );

  // Prefer the second admin-ordered companion (the established hero choice),
  // but fall back to the first when only one escort has been uploaded. While
  // the content store is loading there is NO hero photo — never a stale default.
  const heroImage = companions[1]?.image || companions[0]?.image;

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
        .escort-filter-pill { transition: all 0.25s ease; }
        .escort-filter-pill:hover { border-color: rgba(194,167,78,0.8) !important; color: #f5e199 !important; }
        .escort-companion-card:focus-visible { outline: 2px solid #c2a74e; outline-offset: 3px; }
        /* The template's .row rule overrides Bootstrap gutter utilities; scope this grid. */
        .escort-profile-grid { --bs-gutter-x: 8px !important; --bs-gutter-y: 8px !important; }
        /* Mobile only: two slightly larger companion profiles per row, side by side. */
        @media (max-width: 575px) {
          .escort-companion-photo { height: 270px !important; }
          .escort-companion-card h3 { font-size: 1.3rem !important; }
        }
        @media (max-width: 991px) {
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

        {/* ─── COMPANION HERO BANNER ─── */}
        <div
          className="escort-hero"
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
              backgroundImage: heroImage ? `url("${heroImage}")` : "none",
              backgroundColor: "#141a20",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.35)",
              opacity: heroImage ? 1 : 0,
              transition: "opacity 350ms ease",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(194,167,78,0.08) 0%, rgba(14,19,23,0.75) 100%)",
            }}
          />
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 20px" }}>
            <SectionTitle tagline="Our Companions" title="Meet the Elite" style={{ marginBottom: 0 }} />
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "clamp(0.85rem, 2vw, 1rem)", maxWidth: "620px", margin: "0 auto 18px auto", lineHeight: 1.6 }}>
              Refined company for dining, events, travel, and private evenings — chosen for warmth, discretion, and effortless conversation.
            </p>
            <nav style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
              <span style={{ margin: "0 8px", color: GOLD }}>/</span>
              <span style={{ color: GOLD }}>Escorts</span>
            </nav>
          </div>
        </div>

        {/* ─── COMPANIONS GRID + FILTER ─── */}
        <section id="companions" style={{ padding: "70px 0 110px", background: "#0e1317" }}>
          <div className="container">
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

            {loading ? (
              <div className="card-loading-slot" style={{ textAlign: "center", padding: "80px 0" }}>
                <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
                  <span className="visually-hidden">Loading companions...</span>
                </div>
                <p style={{ marginTop: "16px", color: "#9ca3af" }}>Loading companions...</p>
              </div>
            ) : shownCompanions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", backgroundColor: "#161c22", borderRadius: "12px", border: "1px dashed rgba(194,167,78,0.3)" }}>
                <h3 style={{ color: "#fff", fontFamily: SERIF, fontSize: "1.8rem" }}>No companions available</h3>
                <p style={{ color: "#9ca3af" }}>Please check back soon.</p>
              </div>
            ) : (
            <div className="row g-2 escort-profile-grid">
              {shownCompanions.map((c, i) => {
                const isAvailable = c.availability === "available";
                return (
                  <div key={c.name} className="col-xl-3 col-lg-4 col-md-6 col-6">
                    <Reveal delay={(i % 4) * 90} offset={70} style={{ height: "100%" }}>
                      <div
                        className="escort-companion-card"
                        role="link"
                        tabIndex={0}
                        aria-label={`View ${c.name}'s profile`}
                        onClick={() => router.push(`/escorts/${escortSlug(c.name)}`)}
                        onKeyDown={(e) => {
                          if (e.target !== e.currentTarget) return;
                          if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                            e.preventDefault();
                            router.push(`/escorts/${escortSlug(c.name)}`);
                          }
                        }}
                        style={{
                          background: "linear-gradient(160deg, #161c22 0%, #1a2130 100%)",
                          border: "1px solid rgba(194,167,78,0.22)", borderRadius: "14px",
                          overflow: "hidden", height: "100%", display: "flex", flexDirection: "column",
                          boxShadow: "0 10px 34px rgba(0,0,0,0.5)",
                        }}
                      >
                        <div className="escort-companion-photo" style={{ position: "relative", height: "360px", overflow: "hidden" }}>
                          <img
                            src={c.image}
                            alt={c.name}
                            className="companion-img"
                            loading="lazy"
                            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }}
                          />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 38%, rgba(14,19,23,0.96) 100%)" }} />
                          <div className="companion-hover" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(14,19,23,0.45)", opacity: 0 }}>
                            <span style={{ fontFamily: SCRIPT, fontSize: "2rem", color: "#f5e199" }}>View Profile</span>
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
                            onClick={(e) => e.stopPropagation()}
                            href={whatsappLink(
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
            )}
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
            backgroundImage: heroImage ? `url("${heroImage}")` : "none",
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
                  href={whatsappLink("Hello, I would like to enquire about your escort companionship services at The Serenity Spa.")}
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
