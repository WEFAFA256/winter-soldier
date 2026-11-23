"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";
import { useSiteContact } from "@/components/ContactProvider";
import {
  fetchSiteContent,
  formatServicePrice,
  isRealServiceTitle,
  parseServicePrice,
} from "@/lib/service-order";
import { usePageReveal } from "@/lib/use-page-reveal";

interface MobileService {
  title: string;
  price: number | string;
  duration: string;
  description: string;
  features: string[];
  image: string;
}

const MOBILE_SERVICES: MobileService[] = [];

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

const DEFAULT_MOBILE_FEATURES = [
  "Delivered to your hotel or residence",
  "Professional therapist and portable setup",
  "Fresh linens and aromatic oils",
  "Discreet, punctual service",
];

function normaliseMobileCard(raw: any): MobileService | null {
  if (!raw || !isRealServiceTitle(raw.title)) return null;
  return {
    title: String(raw.title),
    price: raw.price ?? 0,
    duration: String(raw.duration || "60 - 90 mins"),
    description: String(raw.description || "A premium out-call treatment delivered to your location."),
    features: Array.isArray(raw.features) && raw.features.length
      ? raw.features.map(String)
      : DEFAULT_MOBILE_FEATURES,
    image: String(raw.image || "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg"),
  };
}

function MobileServiceCard({
  service,
  index,
  imgSrc,
  fallbackImg,
}: {
  service: MobileService;
  index: number;
  imgSrc: string;
  fallbackImg: string;
}) {
  const { ref, className: revealClass } = usePageReveal<HTMLDivElement>({
    animateOnMount: true,
  });
  const { whatsappLink } = useSiteContact();

  const staggerDelay = (index % 3) * 0.08;
  const displayPrice = formatServicePrice(service.price);
  const bookingPrice = parseServicePrice(service.price);

  return (
    <div
      ref={ref}
      className={`col-lg-4 col-md-6 col-12 ${revealClass}`.trim()}
      style={{
        opacity: 1,
        transform: "translate3d(0, 0, 0)",
        "--page-motion-duration": "750ms",
        "--page-motion-delay": `${staggerDelay}s`,
        "--page-motion-offset": "32px",
        willChange: "transform, opacity",
      } as React.CSSProperties}
    >
      <div
        className="service-theme-card"
        style={{
          backgroundColor: "#efe3c6",
          backgroundImage: "linear-gradient(160deg, #f3e9cf 0%, #e8d7b3 52%, #dcc48f 100%)",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid rgba(176, 142, 52, 0.45)",
          boxShadow: "0 12px 30px rgba(120, 90, 30, 0.16), 0 6px 16px rgba(40, 30, 12, 0.1)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-10px)";
          e.currentTarget.style.borderColor = "rgba(176, 142, 52, 0.78)";
          e.currentTarget.style.boxShadow = "0 22px 44px rgba(120, 90, 30, 0.24), 0 10px 22px rgba(40, 30, 12, 0.14)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "rgba(176, 142, 52, 0.45)";
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(120, 90, 30, 0.16), 0 6px 16px rgba(40, 30, 12, 0.1)";
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: "linear-gradient(90deg, #b8922f 0%, #e7cc74 50%, #b8922f 100%)",
            zIndex: 3,
          }}
        />
        {/* Soft palm overlay for light luxury theme */}
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
            opacity: 0.08,
            filter: "sepia(1) saturate(1.5) hue-rotate(5deg)",
            zIndex: 1,
          }}
        />

        {/* Card Image — static, fills the entire image area with no empty edges */}
        <div
          style={{ height: "220px", overflow: "hidden", position: "relative", backgroundColor: "#e4d4b0", zIndex: 2 }}
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
                color: "#2a2115",
                textShadow: "none",
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
                backgroundColor: "#c2a74e",
                color: "#1a1408",
                padding: "5px 12px",
                borderRadius: "999px",
                fontWeight: 800,
                fontSize: "0.82rem",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 12px rgba(194, 167, 78, 0.3)",
                border: "1px solid rgba(168, 134, 42, 0.35)",
              }}
            >
              {displayPrice}
            </span>
          </div>

          <p
            style={{
              color: "#5a4e3a",
              textShadow: "none",
              fontSize: "0.93rem",
              lineHeight: 1.65,
              marginBottom: "20px",
              flex: 1,
              fontWeight: 400,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "4.2em",
            }}
          >
            {service.description || "A soothing treatment designed to revitalize mind, body, and senses."}
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "auto",
              paddingTop: "16px",
              borderTop: "1px solid rgba(168, 134, 42, 0.22)",
            }}
          >
            <a
              href={whatsappLink(`Hello, I'd like to book an out-call for ${service.title} (${displayPrice}) at my location.`)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: "11px 14px",
                backgroundColor: "transparent",
                border: "1.5px solid rgba(168, 134, 42, 0.55)",
                color: "#8a6920",
                borderRadius: "0px",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(194, 167, 78, 0.12)";
                e.currentTarget.style.color = "#5a4310";
                e.currentTarget.style.borderColor = "#b8922f";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#8a6920";
                e.currentTarget.style.borderColor = "rgba(168, 134, 42, 0.55)";
              }}
            >
              <i className="fab fa-whatsapp"></i> WhatsApp
            </a>

            <Link
              href={`/booking?service=${encodeURIComponent(service.title)}&price=${encodeURIComponent(
                Number.isNaN(bookingPrice) ? String(service.price) : String(bookingPrice)
              )}${imgSrc ? `&image=${encodeURIComponent(imgSrc)}` : ""}`}
              style={{
                flex: 1.3,
                padding: "11px 14px",
                backgroundColor: "#c2a74e",
                border: "1.5px solid #c2a74e",
                color: "#0e1317",
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
                boxShadow: "0 4px 14px rgba(194, 167, 78, 0.3)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#dfc268";
                e.currentTarget.style.borderColor = "#dfc268";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(194, 167, 78, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#c2a74e";
                e.currentTarget.style.borderColor = "#c2a74e";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(194, 167, 78, 0.3)";
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

export default function MobileMassagePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServices, setMobileServices] = useState<MobileService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMobileCards = async () => {
      try {
        const data = await fetchSiteContent();
        if (data && Array.isArray(data.mobileMassage)) {
          const cards = data.mobileMassage
            .map(normaliseMobileCard)
            .filter((card: MobileService | null): card is MobileService => Boolean(card));
          setMobileServices(cards);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Failed to load mobile massage cards, using defaults...", err);
      }
      setMobileServices(MOBILE_SERVICES);
      setLoading(false);
    };

    loadMobileCards();

    const refreshOnVisible = () => {
      if (document.visibilityState === "visible") loadMobileCards();
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
                  <li className="">
                    <Link href="/vip-packages">VIP Packages</Link>
                  </li>
                  <li className="current">
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

        {/* --- HERO BANNER --- */}
        <div
          style={{
            position: "relative",
            minHeight: "485px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: "url(/assets/images/backgrounds/slider-2-2.jpg)",
            backgroundColor: "#000000",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            textAlign: "center",
            padding: "175px 20px 80px",
            borderBottom: "1px solid rgba(194, 167, 78,0.2)",
          }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.75)" }} />

          <div
            className="page-motion-hero-content"
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: "840px",
              margin: "0 auto",
              opacity: 1,
              transform: "translateY(0)",
            }}
          >
            <span style={{ color: "#c2a74e", fontFamily: "'Great Vibes', cursive, Cormorant, serif", fontSize: "1.6rem", display: "block", marginBottom: "10px", letterSpacing: "2px" }}>
              At Your Doorstep · Hotel &amp; Home Out-Calls
            </span>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 700, color: "#ffffff", margin: "0 0 14px 0", lineHeight: 1.15 }}>
              Luxury Mobile Massage in Kampala
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "clamp(0.9rem, 2vw, 1.05rem)", maxWidth: "680px", margin: "0 auto 22px auto", lineHeight: 1.6 }}>
              Choose from our signature therapies delivered at your hotel, home, or private residence with a full professional setup and complete discretion.
            </p>
            <nav style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
              <span style={{ margin: "0 8px", color: "#c2a74e" }}>/</span>
              <span style={{ color: "#c2a74e" }}>Mobile Massage</span>
            </nav>
          </div>
        </div>

        {/* --- MOBILE SERVICE CARDS START IMMEDIATELY BELOW HERO --- */}
        <section style={{ padding: "56px 0 90px 0" }}>
          <div className="container">
            {loading ? (
              <div className="card-loading-slot" style={{ textAlign: "center", padding: "60px 0" }}>
                <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
                  <span className="visually-hidden">Loading mobile therapies...</span>
                </div>
                <p style={{ marginTop: "16px", color: "#9ca3af" }}>Loading out-call therapies...</p>
              </div>
            ) : mobileServices.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", backgroundColor: "#161c22", borderRadius: "12px", border: "1px dashed rgba(194,167,78,0.3)" }}>
                <h3 style={{ color: "#fff", fontFamily: "Cormorant, serif", fontSize: "1.8rem" }}>No out-call therapies selected yet</h3>
                <p style={{ color: "#9ca3af" }}>Ask the admin to add a treatment from the Mobile Massage tab.</p>
              </div>
            ) : (
              <div className="row g-4">
                {mobileServices.map((service, index) => (
                  <MobileServiceCard
                    key={`${service.title}-${index}`}
                    service={service}
                    index={index}
                    imgSrc={service.image || "/assets/spa-hero-bg-2.jpg"}
                    fallbackImg="/assets/spa-hero-bg-2.jpg"
                  />
                ))}
              </div>
            )}
          </div>
        </section>

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
                  <li><Link href="/escorts" style={{ color: "#9ca3af", textDecoration: "none" }}>Escorts</Link></li>
            </ul>
            <div>&copy; {new Date().getFullYear()} The Serenity Spa. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </>
  );
}
