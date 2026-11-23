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
          borderRadius: "18px",
          overflow: "hidden",
          border: "1.5px solid rgba(176, 142, 52, 0.5)",
          boxShadow: "0 8px 32px rgba(90, 60, 10, 0.18), 0 2px 8px rgba(40, 30, 12, 0.10)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease",
          background: "#f5ecd7",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0 20px 48px rgba(90, 60, 10, 0.26), 0 6px 18px rgba(40, 30, 12, 0.14)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(90, 60, 10, 0.18), 0 2px 8px rgba(40, 30, 12, 0.10)";
        }}
      >
        {/* Full-width image */}
        <div style={{ position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <img
            src={imgSrc}
            alt={service.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "240px",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = "scale(1.07)"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = "scale(1)"; }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImg;
            }}
          />
        </div>

        {/* Card Content */}
        <div
          style={{
            padding: "20px 20px 0 20px",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            position: "relative",
            background: "linear-gradient(170deg, #f7f0de 0%, #ede0c0 100%)",
          }}
        >
          {/* Floral watermark */}
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "160px",
              height: "160px",
              backgroundImage: "url(/assets/images/shapes/funfact-bg-2-shape.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right bottom",
              opacity: 0.13,
              pointerEvents: "none",
              filter: "sepia(0.6) saturate(1.2)",
            }}
          />

          {/* Title row + price badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
            <h3
              style={{
                fontFamily: "Cormorant, serif",
                fontSize: "1.3rem",
                fontWeight: 800,
                color: "#1a1208",
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                flex: 1,
              }}
            >
              {service.title}
            </h3>
            <span
              style={{
                background: "linear-gradient(135deg, #b8922f 0%, #d4a843 60%, #c2a74e 100%)",
                color: "#1a1208",
                padding: "6px 14px",
                borderRadius: "999px",
                fontWeight: 800,
                fontSize: "0.78rem",
                whiteSpace: "nowrap",
                flexShrink: 0,
                letterSpacing: "0.3px",
              }}
            >
              {displayPrice}
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              color: "#4a3e28",
              fontSize: "0.92rem",
              lineHeight: 1.68,
              marginBottom: "16px",
              flex: 1,
              fontWeight: 400,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "4.6em",
            }}
          >
            {service.description || "A soothing treatment designed to revitalize mind, body, and senses."}
          </p>

          {/* WhatsApp button above the full-width book button */}
          <a
            href={whatsappLink(`Hello, I'd like to book an out-call for ${service.title} (${displayPrice}) at my location.`)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              width: "calc(100% + 40px)",
              marginLeft: "-20px",
              marginRight: "-20px",
              padding: "11px 20px",
              background: "#25d366",
              color: "#fff",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              transition: "filter 0.22s ease",
              borderTop: "1px solid rgba(0,0,0,0.06)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; }}
          >
            <i className="fab fa-whatsapp" style={{ fontSize: "15px" }}></i>
            WHATSAPP
          </a>

          {/* Book Now — full-width gold button */}
          <Link
            href={`/booking?service=${encodeURIComponent(service.title)}&price=${encodeURIComponent(
              Number.isNaN(bookingPrice) ? String(service.price) : String(bookingPrice)
            )}${imgSrc ? `&image=${encodeURIComponent(imgSrc)}` : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "calc(100% + 40px)",
              marginLeft: "-20px",
              marginRight: "-20px",
              padding: "15px 20px",
              background: "linear-gradient(135deg, #b8922f 0%, #c9a63c 50%, #b8922f 100%)",
              color: "#1a1208",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              transition: "filter 0.22s ease",
              marginTop: "auto",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; }}
          >
            <i className="fas fa-calendar-check" style={{ fontSize: "14px" }}></i>
            BOOK NOW
          </Link>
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
