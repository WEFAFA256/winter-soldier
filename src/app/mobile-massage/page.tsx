"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";
import { useSiteContact } from "@/components/ContactProvider";
import { fetchSiteContent, isRealServiceTitle } from "@/lib/service-order";
import { usePageReveal } from "@/lib/use-page-reveal";

interface MobileService {
  title: string;
  price: number | string;
  image?: string;
  description?: string;
}

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

function formatPrice(price: number | string): string {
  if (typeof price === "number") return "UGX " + price.toLocaleString();
  const num = parseInt(String(price).replace(/\D/g, ""), 10);
  if (!isNaN(num) && num > 0) return "UGX " + num.toLocaleString();
  return "UGX " + price;
}

function ServiceCard({
  service,
  index,
  imgSrc,
  fallbackImg,
  whatsappLink,
}: {
  service: MobileService;
  index: number;
  imgSrc: string;
  fallbackImg: string;
  whatsappLink: (message?: string) => string;
}) {
  const { ref, className: revealClass } = usePageReveal<HTMLDivElement>({
    animateOnMount: true,
  });
  const staggerDelay = (index % 3) * 0.08;
  const desc = service.description
    ? service.description.split(".")[0].substring(0, 60).trim() +
      (service.description.split(".")[0].length > 60 ? "…" : "")
    : "Premium mobile massage therapy.";

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
        style={{
          backgroundColor: "#FDF3E6",
          borderRadius: "24px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
          padding: "32px 28px",
        }}
      >
        <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
          <img
            src={imgSrc}
            alt={service.title}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImg;
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <h3
            style={{
              fontFamily: "Cormorant, serif",
              fontSize: "2rem",
              fontWeight: 800,
              color: "#60351A",
              margin: 0,
              lineHeight: 1.3,
              letterSpacing: "1.2px",
              textAlign: "center",
              textTransform: "none",
            }}
          >
            {service.title}
          </h3>

          <p
            style={{
              fontFamily: "Cormorant, serif",
              fontSize: "0.95rem",
              fontWeight: 400,
              color: "#60351A",
              lineHeight: 1.5,
              margin: 0,
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            {desc}
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginTop: "auto",
              paddingTop: "12px",
            }}
          >
            <Link
              href={`/booking?service=${encodeURIComponent(service.title)}&price=${encodeURIComponent(String(service.price))}`}
              style={{
                flex: 1,
                maxWidth: "200px",
                padding: "10px 16px",
                backgroundColor: "#60351A",
                border: "none",
                color: "#FDF3E6",
                borderRadius: "4px",
                fontFamily: "Cormorant, serif",
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Book Now
            </Link>

            <a
              href={whatsappLink(
                `Hello, I'd like to book ${service.title} (${formatPrice(service.price)}). Please send details and availability.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                maxWidth: "200px",
                padding: "10px 16px",
                backgroundColor: "transparent",
                border: "1.5px solid #60351A",
                color: "#60351A",
                borderRadius: "4px",
                fontFamily: "Cormorant, serif",
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              <i className="fab fa-whatsapp" style={{ marginRight: "6px", fontSize: "1rem" }}></i>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MobileMassagePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [services, setServices] = useState<MobileService[]>([]);
  const [loading, setLoading] = useState(true);
  const { phoneHref, phoneDisplay, whatsappDisplay, whatsappLink } = useSiteContact();

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchSiteContent();
        const list = Array.isArray(data?.mobileMassage) ? data.mobileMassage : [];
        if (list.length > 0) {
          setServices(list.filter((s: MobileService) => isRealServiceTitle(s.title)));
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Failed to load /api/content for mobile massage", err);
      }

      try {
        const localRes = await fetch("/site-content.json");
        if (localRes.ok) {
          const localData = await localRes.json();
          const list = Array.isArray(localData?.mobileMassage) ? localData.mobileMassage : [];
          setServices(list.filter((s: MobileService) => isRealServiceTitle(s.title)));
        }
      } catch (localErr) {
        console.error("Failed to load local mobile massage JSON", localErr);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
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

  return (
    <>
      <CustomCursor />

      <div className="page-wrapper" style={{ backgroundColor: "#FDF3E6", color: "#60351A", minHeight: "100vh" }}>
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
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/services">Services</Link></li>
                  <li><Link href="/vip-packages">VIP Packages</Link></li>
                  <li className="current"><Link href="/mobile-massage">Mobile Massage</Link></li>
                  <li><Link href="/gallery">Gallery</Link></li>
                  <li><Link href="/blog">Blog</Link></li>
                  <li><Link href="/escorts">Escorts</Link></li>
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
                <Link href="/booking" className="solox-btn main-header__btn">
                  <span>Book now</span>
                </Link>
              </div>
            </div>
          </div>
          <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </header>

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
            style={{ position: "relative", zIndex: 2, maxWidth: "840px", margin: "0 auto" }}
          >
            <span style={{ color: "#c2a74e", fontFamily: "'Great Vibes', cursive, Cormorant, serif", fontSize: "clamp(1.15rem, 2.4vw, 1.45rem)", display: "block", marginBottom: "8px", letterSpacing: "1.5px" }}>
              At Your Doorstep · Hotel &amp; Home Out-Calls
            </span>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(2rem, 4.6vw, 3.2rem)", fontWeight: 700, color: "#ffffff", margin: "0 0 12px 0", lineHeight: 1.15 }}>
              Luxury Mobile Massage in Kampala
            </h1>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "clamp(0.8rem, 1.5vw, 0.92rem)", maxWidth: "620px", margin: "0 auto 18px auto", lineHeight: 1.6 }}>
              Premium therapies delivered to your hotel, home, or private residence with full professional setup and complete discretion.
            </p>
            <nav style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
              <span style={{ margin: "0 8px", color: "#c2a74e" }}>/</span>
              <span style={{ color: "#c2a74e" }}>Mobile Massage</span>
            </nav>
          </div>
        </div>

        <section style={{ padding: "60px 0 30px 0", backgroundColor: "#FDF3E6" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span style={{ color: "#60351A", textTransform: "uppercase", letterSpacing: "2px", fontSize: "12px", fontWeight: 700 }}>
                Mobile Services
              </span>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "2.2rem", fontWeight: 700, color: "#60351A", margin: "8px 0 0 0" }}>
                Treatments Delivered to You
              </h2>
            </div>

            {loading ? (
              <div className="card-loading-slot" style={{ textAlign: "center", padding: "60px 0" }}>
                <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
                  <span className="visually-hidden">Loading treatments...</span>
                </div>
                <p style={{ marginTop: "16px", color: "#60351A" }}>Loading mobile treatments...</p>
              </div>
            ) : services.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", backgroundColor: "#FDF3E6", borderRadius: "12px", border: "1px dashed rgba(96,53,26,0.3)" }}>
                <i className="fas fa-spa" style={{ fontSize: "3rem", color: "#60351A", marginBottom: "16px" }}></i>
                <h3 style={{ color: "#60351A", fontFamily: "Cormorant, serif", fontSize: "1.8rem" }}>Mobile services coming soon</h3>
                <p style={{ color: "#60351A", marginBottom: "20px" }}>Please check back shortly or contact us on WhatsApp.</p>
                <a href={whatsappLink("Hello, I would like to enquire about mobile massage services.")} target="_blank" rel="noopener noreferrer" style={{ padding: "10px 20px", backgroundColor: "#60351A", color: "#FDF3E6", borderRadius: "4px", textDecoration: "none", fontWeight: 700 }}>
                  WhatsApp Us
                </a>
              </div>
            ) : (
              <div className="row g-4">
                {services.map((service, index) => {
                  const fallbackImg = `/assets/images/resources/service-1-${(index % 5) + 1}.jpg`;
                  const imgSrc = service.image || fallbackImg;
                  return (
                    <ServiceCard
                      key={service.title || index}
                      service={service}
                      index={index}
                      imgSrc={imgSrc}
                      fallbackImg={fallbackImg}
                      whatsappLink={whatsappLink}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section style={{ padding: "60px 0 50px 0", backgroundColor: "#FDF3E6", borderTop: "1px solid rgba(96,53,26,0.12)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span style={{ color: "#60351A", textTransform: "uppercase", letterSpacing: "2px", fontSize: "12px", fontWeight: 700 }}>
                Simple &amp; Discreet
              </span>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "2.4rem", fontWeight: 700, color: "#60351A", margin: "8px 0 0 0" }}>
                How Mobile Out-Call Works
              </h2>
            </div>

            <div className="row g-4">
              {[
                { step: "01", title: "Book via WhatsApp or Call", desc: "Share your location, preferred therapy, and convenient arrival time.", icon: "fas fa-mobile-alt" },
                { step: "02", title: "Therapist Arrives with Setup", desc: "Our verified therapist arrives with table, warm oils, fresh towels, and relaxing sound.", icon: "fas fa-spa" },
                { step: "03", title: "Indulge in Total Privacy", desc: "Relax in your personal sanctuary. Pay conveniently after your session.", icon: "fas fa-glass-cheers" },
              ].map((item, idx) => (
                <div key={idx} className="col-md-4 col-12">
                  <div style={{ backgroundColor: "#FDF3E6", border: "1px solid rgba(96,53,26,0.2)", borderRadius: "12px", padding: "30px 24px", height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <span style={{ fontFamily: "Cormorant, serif", fontSize: "2.2rem", fontWeight: 700, color: "#60351A" }}>{item.step}</span>
                      <i className={item.icon} style={{ fontSize: "1.8rem", color: "rgba(96,53,26,0.35)" }}></i>
                    </div>
                    <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.35rem", fontWeight: 700, color: "#60351A", marginBottom: "10px" }}>{item.title}</h3>
                    <p style={{ color: "#60351A", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "60px 0", backgroundColor: "#FDF3E6", borderTop: "1px solid rgba(96,53,26,0.12)" }}>
          <div className="container">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6 col-12">
                <span style={{ color: "#60351A", textTransform: "uppercase", letterSpacing: "2px", fontSize: "12px", fontWeight: 700 }}>
                  Service Coverage
                </span>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "2.3rem", fontWeight: 700, color: "#60351A", margin: "10px 0 16px 0" }}>
                  Serving All Kampala Hotels, Airbnbs &amp; Residences
                </h2>
                <p style={{ color: "#60351A", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "22px" }}>
                  Whether you are at Sheraton, Serena, Mestil, Latitude 0°, Protea, or an executive Airbnb, our therapists arrive within 45 to 60 minutes of confirmation.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                  {COVERAGE_AREAS.map((area, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#60351A" }}>
                      <i className="fas fa-map-pin" style={{ color: "#60351A", fontSize: "11px" }}></i>
                      {area}
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-lg-6 col-12">
                <div style={{ backgroundColor: "#FDF3E6", border: "1px solid rgba(96,53,26,0.2)", borderRadius: "12px", padding: "36px 30px" }}>
                  <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.8rem", color: "#60351A", marginBottom: "14px" }}>
                    Our Mobile Service Guarantee
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {[
                      { icon: "fas fa-user-shield", title: "100% Verified Therapists", desc: "Professionally trained, background-checked, with official spa identification." },
                      { icon: "fas fa-pump-medical", title: "Sterilized & Fresh Equipment", desc: "Freshly laundered sheets, sanitized equipment, and disposable covers for each appointment." },
                      { icon: "fas fa-lock", title: "Complete Discretion & Privacy", desc: "Strict confidentiality for every client, hotel guest, and diplomat in Kampala." },
                    ].map((item) => (
                      <div key={item.title} style={{ display: "flex", gap: "12px" }}>
                        <i className={item.icon} style={{ color: "#60351A", fontSize: "20px", marginTop: "4px" }}></i>
                        <div>
                          <div style={{ color: "#60351A", fontWeight: 700, fontSize: "14px" }}>{item.title}</div>
                          <div style={{ color: "#60351A", fontSize: "12px", lineHeight: 1.5 }}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer style={{ backgroundColor: "#0e1317", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "50px 0 30px 0", color: "#9ca3af", fontSize: "13px" }}>
          <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/assets/logo.jpg" alt="The Serenity Spa" style={{ height: "32px", width: "32px", borderRadius: "50%", objectFit: "cover" }} />
              <span style={{ color: "#ffffff", fontWeight: 700, letterSpacing: "1px" }}>THE SERENITY SPA</span>
            </div>
            <ul style={{ listStyle: "none", display: "flex", gap: "20px", margin: 0, padding: 0, flexWrap: "wrap" }}>
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
