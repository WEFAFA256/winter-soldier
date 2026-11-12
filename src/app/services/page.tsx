"use client";

import React, { useState, useEffect, useMemo } from "react";
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

const INITIAL_SERVICES: Service[] = [
  {
    "title": "Swedish Massage",
    "image": "/assets/service1.jpg",
    "fullImage": "/assets/swedish-massage-full.jpg",
    "description": "This is one of the most common & basic massage types traditionally for relaxing the mind & soothing the body. It's performed with slow simple calm movements to energize the body & overall health involving actions ie. Kneading, Rolling & Tapping. Oils are used.",
    "delay": "delay-100",
    "price": 150000
  },
  {
    "title": "Body Scrubs",
    "image": "/assets/body-scrubs.jpg",
    "fullImage": "/assets/body-scrubs.jpg",
    "description": "Coffee, Salt-Based, or Moisturizing scrubs rubbed onto skin to peel dead tissue, soothing and renewing skin to full potential. (150K)",
    "delay": "delay-200",
    "needsCrop": true,
    "price": 150000
  },
  {
    "title": "Sports Massage",
    "image": "/assets/sports-massage.jpg",
    "fullImage": "/assets/sports-massage.jpg",
    "description": "More effective than Deep Tissue. Focuses on pain relief, muscle tension, and flexibility using stretching, rolling, kneading & joint cracking. (150K)",
    "delay": "delay-100",
    "needsCrop": true,
    "price": 150000
  },
  {
    "title": "Signature Massage",
    "image": "/assets/signature-massage.jpg",
    "fullImage": "/assets/signature-massage.jpg",
    "description": "The most relaxing and pleasing session combining Aroma, Swedish & Deep Tissue techniques for ultimate stress relief and relaxation therapy. (150K)",
    "delay": "delay-200",
    "needsCrop": true,
    "price": 150000
  },
  {
    "title": "Deeptissue Massage",
    "image": "/assets/service2.jpg",
    "fullImage": "/assets/deeptissue-massage-full.jpg",
    "description": "Similar to Swedish Massage, also known as Hard Massage but with a deeptissue massage, the therapist applies slow, firm pressure to release muscle tension. The focus is on the deepest layers of muscle tissue, tendons & fascia. Highly recommended for clients with body pains, aches",
    "delay": "delay-200",
    "price": 180000
  },
  {
    "title": "Aromatherapy",
    "image": "/assets/service4.jpg",
    "fullImage": "/assets/aromatherapy-full.jpg",
    "description": "Aromatherapy incorporates the use of warm scented essential oils into a massage while alternating between gentle and harder pressure while using a specific blend of essential oils. Highly recommended for Clients working in fumes,etc to renew the Breathe Senses & Relax",
    "delay": "delay-300",
    "price": 200000
  },
  {
    "title": "Hotstone Massage",
    "image": "/assets/hotstone-massage.jpg",
    "fullImage": "/assets/hotstone-massage.jpg",
    "description": "Stone Therapy involving placement of heated basalt river rocks on the body. Allows deeper pressure without discomfort, increasing blood flow and healing. (200K)",
    "delay": "delay-300",
    "needsCrop": true,
    "price": 200000
  },
  {
    "title": "B2b Nuru Massage",
    "image": "/assets/b2b-nuru-massage.jpg",
    "fullImage": "/assets/b2b-nuru-massage.jpg",
    "description": "Sensual massage using oiled body techniques (Breasts, Thighs) to arouse sexual feeling and intimacy. Therapist fully nude. (200K)",
    "delay": "delay-100",
    "needsCrop": true,
    "price": 200000
  },
  {
    "title": "Body Care Package",
    "image": "/assets/body-care-package.jpg",
    "fullImage": "/assets/body-care-package.jpg",
    "description": "Pedicure, Manicure, Full Body Waxing, Warm Towel & Relaxing Massage. Refresh, rewind & cleanse yourself in one session. (200K)",
    "delay": "delay-200",
    "needsCrop": true,
    "price": 200000
  },
  {
    "title": "Erotic & Body to Body",
    "image": "/assets/service3.jpg",
    "fullImage": "/assets/erotic-massage-full.jpg",
    "description": "Definitely the most Relaxing & Sensual Massage Session combining Erotic Soothing Touches & Body 2 body Sensual Techniques of Romance. Except its more gentle & affectionate with calm relaxing touches to arouse intimacy",
    "delay": "delay-100",
    "price": 250000
  },
  {
    "title": "Womens' Packages",
    "image": "/assets/service9.jpg",
    "fullImage": "/assets/womens-packages-full.jpg",
    "description": "Out for a Massage Service? Planning for a 90mins | 120mins Session as a Mini Relaxation Package for the Girls Day Out. We've got you covered! - Try these Massage sessions!",
    "delay": "delay-300",
    "price": 250000
  },
  {
    "title": "Couples Massage",
    "image": "/assets/couples-massage-flyer.jpg",
    "fullImage": "/assets/couples-massage-flyer.jpg",
    "description": "Shared experience for two. Erotic/Swedish with 2 girls or 1 girl & 1 guy. A life time adventure creating memories forever. (250K)",
    "delay": "delay-300",
    "needsCrop": true,
    "price": 250000
  },
  {
    "title": "Xclusive Sessions",
    "image": "/assets/service5.jpg",
    "fullImage": "/assets/xclusive-sessions-full.jpg",
    "description": "The most sensual Erotically Satisfying Session due to the Pleasure it comes with combining B2b & Erotic Massage Techniques to arouse the Client in an immense Romantic Yoni | Tantric Feeling. It's inclusive of a Pack Of Extras",
    "delay": "delay-200",
    "price": 300000
  },
  {
    "title": "4hands Essential Oils",
    "image": "/assets/4hands-essential-oils.jpg",
    "fullImage": "/assets/4hands-essential-oils.jpg",
    "description": "Double the relaxation with two therapists using scented warm oils to heal mind, body, and soul. (300K)",
    "delay": "delay-100",
    "needsCrop": true,
    "price": 300000
  },
  {
    "title": "6hands Swedish",
    "image": "/assets/6hands-swedish.jpg",
    "fullImage": "/assets/6hands-swedish.jpg",
    "description": "Relaxation at its Peak. Get soothed like a Baby to refresh, stress relief & re-gain focus with three therapists. (300K)",
    "delay": "delay-100",
    "needsCrop": true,
    "price": 300000
  },
  {
    "title": "Full Service Pack",
    "image": "/assets/full-service-pack.jpg",
    "fullImage": "/assets/full-service-pack.jpg",
    "description": "The most Sensual Erotically Satisfying Session. Combines B2b & Erotic Massage. Complete pack inclusive of Extra Services for immense Romantic Tantra Mood. (300K)",
    "delay": "delay-100",
    "needsCrop": true,
    "price": 300000
  },
  {
    "title": "Turkish Bath Packages",
    "image": "/assets/service6.jpg",
    "fullImage": "/assets/turkish-bath-full.jpg",
    "description": "Time for Real Pampering & Soothing of that Body of Yours? Out for a 90 | 120mins Bath Session as a Spa Day Package We've got you covered! - Try these Massage sessions!",
    "delay": "delay-300",
    "price": 350000
  },
  {
    "title": "Tantra Massage",
    "image": "/assets/tantra-massage-flyer.jpg",
    "fullImage": "/assets/tantra-massage-flyer.jpg",
    "description": "Tantric Sex Practice Massage. Intensely teases client into Sensual Feeling. Therapist uses Breasts, Thighs & Soothing Hands. Not about one Orgasm but More Pleasure. (350K)",
    "delay": "delay-200",
    "needsCrop": true,
    "price": 350000
  },
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
const phoneNumber = "+256 781 945 510";

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

function getWhatsAppLink(title: string, price: number | string): string {
  const text = encodeURIComponent(
    `Hello The Serenity Spa, I would like to book the ${title} (${formatPrice(price)}). Please confirm availability and suite options.`
  );
  return `https://wa.me/${whatsappNumber}?text=${text}`;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalService, setModalService] = useState<Service | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/content");
        if (res.ok) {
          const data = await res.json();
          if (data && data.services && Array.isArray(data.services) && data.services.length > 0) {
            setServices(data.services);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load /api/content, trying local JSON...", err);
      }

      try {
        const localRes = await fetch("/site-content.json");
        if (localRes.ok) {
          const localData = await localRes.json();
          if (localData && localData.services) {
            setServices(localData.services);
          }
        }
      } catch (localErr) {
        console.error("Failed to load local JSON", localErr);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter logic
  const filteredServices = useMemo(() => {
    let list = services.filter(
      (s) => s.title && s.title.toLowerCase() !== "new spa treatment" && s.title.trim() !== ""
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.description && s.description.toLowerCase().includes(q))
      );
    }

    if (activeCategory === "all") return list;
    if (activeCategory === "essential") {
      const keywords = ["swedish", "deep", "aroma", "sports", "hotstone", "scrubs", "signature"];
      return list.filter((s) => keywords.some((k) => s.title.toLowerCase().includes(k)));
    }
    if (activeCategory === "sensual") {
      const keywords = ["nuru", "erotic", "tantra", "kamasutra", "b2b", "xclusive"];
      return list.filter((s) => keywords.some((k) => s.title.toLowerCase().includes(k)));
    }
    if (activeCategory === "multihand") {
      const keywords = ["4hands", "6hands"];
      return list.filter((s) => keywords.some((k) => s.title.toLowerCase().includes(k)));
    }
    if (activeCategory === "vip") {
      return list.filter((s) => {
        const num = typeof s.price === "number" ? s.price : parseInt(String(s.price).replace(/\D/g, ""), 10);
        return num >= 450000;
      });
    }
    return list;
  }, [services, activeCategory, searchQuery]);

  return (
    <>
      <CustomCursor />

      <div className="page-wrapper" style={{ backgroundColor: "#0e1317", color: "#c4cfde", minHeight: "100vh" }}>
        {/* --- NATIVE SOLOX LUXURY HEADER --- */}
        <header className="main-header main-header--two sticky-header sticky-header--normal" style={{ position: "relative", backgroundColor: "#0e1317", borderBottom: "1px solid rgba(197,168,128,0.15)" }}>
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
                      border: "2px solid rgba(197,168,128,0.5)",
                      display: "block",
                    }}
                  />
                </Link>
              </div>

              <nav className="main-header__nav main-menu d-none d-xl-block">
                <ul className="main-menu__list d-none d-xl-flex" style={{ listStyle: "none", gap: "24px", margin: 0, padding: 0 }}>
                  <li><Link href="/" style={{ color: "#ffffff", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Home</Link></li>
                  <li className="current"><Link href="/services" style={{ color: "#c5a880", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Services &amp; Packages</Link></li>
                  <li><Link href="/gallery" style={{ color: "#ffffff", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Gallery</Link></li>
                  <li><Link href="/booking" style={{ color: "#ffffff", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Book Appointment</Link></li>
                  <li><Link href="/blog" style={{ color: "#ffffff", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Blog</Link></li>
                </ul>
              </nav>

              <div className="main-header__right" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="serenity-gold-btn"
                  style={{
                    backgroundColor: "#c5a880",
                    color: "#0e1317",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    fontWeight: 700,
                    fontSize: "12px",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    textDecoration: "none"
                  }}
                >
                  <i className="fab fa-whatsapp" style={{ fontSize: "15px" }}></i>
                  <span className="d-none d-sm-inline">WhatsApp</span>
                </a>

                <div
                  className="mobile-nav__btn mobile-nav__toggler d-xl-none"
                  onClick={() => setMobileMenuOpen(true)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "5px",
                    padding: "8px 10px",
                    background: "rgba(197, 168, 128, 0.1)",
                    border: "1px solid rgba(197, 168, 128, 0.35)",
                    borderRadius: "6px"
                  }}
                  aria-label="Toggle navigation menu"
                >
                  <span style={{ width: "22px", height: "2px", backgroundColor: "#c5a880", display: "block" }}></span>
                  <span style={{ width: "22px", height: "2px", backgroundColor: "#c5a880", display: "block" }}></span>
                  <span style={{ width: "22px", height: "2px", backgroundColor: "#c5a880", display: "block" }}></span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Drawer Navigation */}
          <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </header>

        

        {/* --- FILTER & SEARCH CONTROLS --- */}
        <section style={{ padding: "40px 0 20px 0", backgroundColor: "#11161b" }}>
          <div className="container">
            <div className="row align-items-center g-3">
              {/* Category Pills */}
              <div className="col-lg-8">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {[
                    { id: "all", label: `All Treatments (${services.length})` },
                    { id: "essential", label: "Essential Massages" },
                    { id: "sensual", label: "Sensual & Nuru" },
                    { id: "multihand", label: "Multi-Hand (4 & 6 Hands)" },
                    { id: "vip", label: "VIP & Exclusive (450K+)" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "30px",
                        fontSize: "13px",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        border: activeCategory === cat.id ? "1px solid #c5a880" : "1px solid rgba(255,255,255,0.1)",
                        backgroundColor: activeCategory === cat.id ? "#c5a880" : "rgba(22,28,34,0.8)",
                        color: activeCategory === cat.id ? "#0e1317" : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Box */}
              <div className="col-lg-4">
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Search treatment (e.g. Swedish, Nuru, 4hands)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 16px 10px 40px",
                      backgroundColor: "#161c22",
                      border: "1px solid rgba(197,168,128,0.25)",
                      borderRadius: "24px",
                      color: "#fff",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                  <i
                    className="fas fa-search"
                    style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#c5a880", fontSize: "14px" }}
                  ></i>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "14px" }}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- BALANCED TREATMENT CARDS GRID (PROPORTIONAL 3-COLUMN LAYOUT) --- */}
        <section style={{ padding: "60px 0 90px 0" }}>
          <div className="container">
            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
                  <span className="visually-hidden">Loading therapies...</span>
                </div>
                <p style={{ marginTop: "16px", color: "#9ca3af" }}>Loading authentic treatments...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", backgroundColor: "#161c22", borderRadius: "12px", border: "1px dashed rgba(197,168,128,0.3)" }}>
                <i className="fas fa-spa" style={{ fontSize: "3rem", color: "#c5a880", marginBottom: "16px" }}></i>
                <h3 style={{ color: "#fff", fontFamily: "Cormorant, serif", fontSize: "1.8rem" }}>No treatments found</h3>
                <p style={{ color: "#9ca3af", marginBottom: "20px" }}>Try adjusting your search terms or category filter.</p>
                <button
                  onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
                  style={{ padding: "8px 20px", backgroundColor: "#c5a880", color: "#0e1317", border: "none", borderRadius: "4px", fontWeight: 700, cursor: "pointer" }}
                >
                  Show All Treatments
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {filteredServices.map((service, index) => {
                  const fallbackImg = `/assets/images/resources/service-1-${(index % 5) + 1}.jpg`;
                  const imgSrc = service.image || fallbackImg;

                  return (
                    <div key={service.title || index} className="col-lg-4 col-md-6 col-12 spa-card-animated" style={{ animationDelay: `${(index % 9) * 0.06}s` }}>
                      <div
                        style={{
                          backgroundColor: "#161c22",
                          borderRadius: "12px",
                          overflow: "hidden",
                          border: "1px solid rgba(197,168,128,0.2)",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-6px)";
                          e.currentTarget.style.borderColor = "rgba(197,168,128,0.5)";
                          e.currentTarget.style.boxShadow = "0 14px 32px rgba(197,168,128,0.12)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.borderColor = "rgba(197,168,128,0.2)";
                          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.35)";
                        }}
                      >
                        {/* --- CARD IMAGE CONTAINER (COMPACT 220PX HEIGHT) --- */}
                        <div
                          style={{
                            height: "220px",
                            position: "relative",
                            overflow: "hidden",
                            cursor: "pointer",
                            backgroundColor: "#11161b",
                          }}
                          onClick={() => setModalService(service)}
                        >
                          <img
                            src={imgSrc}
                            alt={service.title}
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.5s ease",
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

                          {/* Floating Price Tag */}
                          <div
                            style={{
                              position: "absolute",
                              top: "14px",
                              right: "14px",
                              background: "linear-gradient(135deg, #c5a880 0%, #9e7f53 100%)",
                              color: "#0e1317",
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontWeight: 800,
                              fontSize: "12px",
                              letterSpacing: "0.5px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                            }}
                          >
                            {formatPrice(service.price)}
                          </div>

                          {/* Zoom / View Flyer Badge */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: "12px",
                              left: "14px",
                              backgroundColor: "rgba(14,19,23,0.75)",
                              backdropFilter: "blur(4px)",
                              color: "#c5a880",
                              padding: "3px 10px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              border: "1px solid rgba(197,168,128,0.3)",
                            }}
                          >
                            <i className="fas fa-search-plus"></i> View Flyer
                          </div>
                        </div>

                        {/* --- CARD BODY --- */}
                        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
                          <h3
                            style={{
                              fontFamily: "Cormorant, serif",
                              fontSize: "1.35rem",
                              fontWeight: 700,
                              color: "#ffffff",
                              margin: "0 0 10px 0",
                              lineHeight: 1.25,
                            }}
                          >
                            {service.title}
                          </h3>

                          <p
                            style={{
                              color: "#9ca3af",
                              fontSize: "0.88rem",
                              lineHeight: 1.55,
                              marginBottom: "18px",
                              flex: 1,
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              minHeight: "4em",
                            }}
                          >
                            {service.description || "A soothing treatment designed to revitalize mind, body, and senses."}
                          </p>

                          {/* --- ACTION BUTTONS --- */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              marginTop: "auto",
                              paddingTop: "14px",
                              borderTop: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <button
                              onClick={() => setModalService(service)}
                              style={{
                                flex: 1,
                                padding: "9px 12px",
                                backgroundColor: "transparent",
                                border: "1px solid rgba(197,168,128,0.4)",
                                color: "#c5a880",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(197,168,128,0.1)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              Learn More
                            </button>

                            <a
                              href={getWhatsAppLink(service.title, service.price)}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                flex: 1.3,
                                padding: "9px 12px",
                                backgroundColor: "#c5a880",
                                border: "1px solid #c5a880",
                                color: "#0e1317",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: 700,
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#d6bd96";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#c5a880";
                              }}
                            >
                              <i className="fab fa-whatsapp"></i> Book Now
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* --- VIP & EXCLUSIVE RETREAT BANNER --- */}
        <section
          style={{
            padding: "60px 0",
            backgroundColor: "#131920",
            borderTop: "1px solid rgba(197,168,128,0.15)",
            borderBottom: "1px solid rgba(197,168,128,0.15)",
          }}
        >
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <span style={{ color: "#c5a880", textTransform: "uppercase", letterSpacing: "2px", fontSize: "12px", fontWeight: 700 }}>
                  Private Suites &amp; Bespoke Packages
                </span>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "2.3rem", fontWeight: 700, color: "#fff", margin: "8px 0 12px 0" }}>
                  Looking for Duo, 4-Hands or Custom Group Sessions?
                </h2>
                <p style={{ color: "#9ca3af", margin: 0, fontSize: "1rem", lineHeight: 1.6, maxWidth: "620px" }}>
                  We arrange tailor-made private suite appointments for couples, multi-therapist treatments, and full-day Turkish Hammam rituals with complimentary refreshments.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello The Serenity Spa, I would like to inquire about bespoke VIP packages and private suite bookings.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="serenity-gold-btn"
                  style={{
                    backgroundColor: "#c5a880",
                    color: "#0e1317",
                    padding: "14px 30px",
                    borderRadius: "4px",
                    fontWeight: 700,
                    fontSize: "14px",
                    letterSpacing: "1px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    textDecoration: "none",
                  }}
                >
                  <i className="fab fa-whatsapp" style={{ fontSize: "18px" }}></i>
                  <span>Inquire VIP Ritual</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* --- LOCATION, CONTACT & MAP SECTION --- */}
        <section style={{ padding: "80px 0", backgroundColor: "#0e1317" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span style={{ color: "#c5a880", fontFamily: "Alex Brush, cursive", fontSize: "1.8rem" }}>Visit Sanctuary</span>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "2.6rem", fontWeight: 700, color: "#fff" }}>
                Our Locations &amp; Concierge
              </h2>
            </div>

            <div className="row g-4">
              <div className="col-lg-4">
                <div style={{ backgroundColor: "#161c22", padding: "30px", borderRadius: "10px", border: "1px solid rgba(197,168,128,0.2)", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                    <div style={{ width: "46px", height: "46px", borderRadius: "50%", backgroundColor: "rgba(197,168,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c5a880", fontSize: "20px" }}>
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h4 style={{ color: "#fff", margin: 0, fontSize: "1.1rem" }}>Spa Locations</h4>
                      <p style={{ color: "#c5a880", margin: 0, fontSize: "12px" }}>Kampala, Uganda</p>
                    </div>
                  </div>
                  <p style={{ color: "#c4cfde", fontSize: "14px", lineHeight: 1.6 }}>
                    • Sir Apollo Kaggwa Road, Kampala<br />
                    • Mengo Branch, Kampala
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div style={{ backgroundColor: "#161c22", padding: "30px", borderRadius: "10px", border: "1px solid rgba(197,168,128,0.2)", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                    <div style={{ width: "46px", height: "46px", borderRadius: "50%", backgroundColor: "rgba(197,168,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c5a880", fontSize: "20px" }}>
                      <i className="fas fa-clock"></i>
                    </div>
                    <div>
                      <h4 style={{ color: "#fff", margin: 0, fontSize: "1.1rem" }}>Operating Hours</h4>
                      <p style={{ color: "#c5a880", margin: 0, fontSize: "12px" }}>Open 7 Days A Week</p>
                    </div>
                  </div>
                  <p style={{ color: "#c4cfde", fontSize: "14px", lineHeight: 1.6 }}>
                    Monday – Sunday: <strong>9:00 AM – 11:00 PM</strong><br />
                    Mobile &amp; Outcall services available upon early booking.
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div style={{ backgroundColor: "#161c22", padding: "30px", borderRadius: "10px", border: "1px solid rgba(197,168,128,0.2)", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                    <div style={{ width: "46px", height: "46px", borderRadius: "50%", backgroundColor: "rgba(197,168,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c5a880", fontSize: "20px" }}>
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div>
                      <h4 style={{ color: "#fff", margin: 0, fontSize: "1.1rem" }}>Direct Lines</h4>
                      <p style={{ color: "#c5a880", margin: 0, fontSize: "12px" }}>Instant Confirmation</p>
                    </div>
                  </div>
                  <p style={{ color: "#c4cfde", fontSize: "14px", lineHeight: 1.6 }}>
                    Phone: <a href="tel:+256781945510" style={{ color: "#fff", textDecoration: "none" }}>+256 781 945 510</a><br />
                    WhatsApp: <a href={`https://wa.me/${whatsappNumber}`} style={{ color: "#25D366", textDecoration: "none" }}>+256 781 945 510</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div style={{ marginTop: "40px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(197,168,128,0.2)", height: "320px" }}>
              <iframe
                title="The Serenity Spa Kampala"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.043537096646!2d32.55836855!3d0.33748235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb0e8fa7f763%3A0x6b30f295bc1cc14c!2sSir%20Apollo%20Kaggwa%20Rd%2C%20Kampala!5e0!3m2!1sen!2sug!4v1700000000000!5m2!1sen!2sug"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(70%) invert(90%) contrast(90%)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>

        {/* --- NATIVE SOLOX LUXURY FOOTER --- */}
        <footer className="main-footer-two" style={{ backgroundColor: "#0b0f13", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "70px 0 30px 0" }}>
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-4 col-md-6">
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "18px" }}>
                  <img src="/assets/images/logo-light.png" alt="The Serenity Spa" style={{ height: "40px" }} />
                  <span style={{ fontFamily: "Cormorant, serif", fontSize: "1.4rem", fontWeight: 700, color: "#ffffff" }}>
                    THE SERENITY SPA
                  </span>
                </Link>
                <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6, maxWidth: "320px" }}>
                  Kampala’s sanctuary for holistic rejuvenation, luxury hydrotherapy, and authentic massage rituals.
                </p>
                <div style={{ display: "flex", gap: "14px", marginTop: "16px" }}>
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" style={{ color: "#c5a880", fontSize: "18px" }}><i className="fab fa-whatsapp"></i></a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#c5a880", fontSize: "18px" }}><i className="fab fa-instagram"></i></a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#c5a880", fontSize: "18px" }}><i className="fab fa-facebook"></i></a>
                </div>
              </div>

              <div className="col-lg-2 col-md-6">
                <h4 style={{ color: "#ffffff", fontFamily: "Cormorant, serif", fontSize: "1.2rem", marginBottom: "16px" }}>Navigation</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                  <li><Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Home</Link></li>
                  <li><Link href="/services" style={{ color: "#c5a880", textDecoration: "none" }}>Services &amp; Packages</Link></li>
                  <li><Link href="/gallery" style={{ color: "#9ca3af", textDecoration: "none" }}>Gallery</Link></li>
                  <li><Link href="/blog" style={{ color: "#9ca3af", textDecoration: "none" }}>Blog</Link></li>
                </ul>
              </div>

              <div className="col-lg-3 col-md-6">
                <h4 style={{ color: "#ffffff", fontFamily: "Cormorant, serif", fontSize: "1.2rem", marginBottom: "16px" }}>Contacts</h4>
                <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                  Sir Apollo Kaggwa Rd &amp; Mengo, Kampala<br />
                  Phone: <a href="tel:+256781945510" style={{ color: "#c5a880", textDecoration: "none" }}>+256 781 945 510</a><br />
                  Email: <a href="mailto:theserenityspakla@gmail.com" style={{ color: "#c5a880", textDecoration: "none" }}>theserenityspakla@gmail.com</a>
                </p>
              </div>

              <div className="col-lg-3 col-md-6">
                <h4 style={{ color: "#ffffff", fontFamily: "Cormorant, serif", fontSize: "1.2rem", marginBottom: "16px" }}>Hours</h4>
                <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                  Open Daily (Mon - Sun):<br />
                  <strong style={{ color: "#fff" }}>9:00 AM – 11:00 PM</strong><br />
                  Private appointments accommodated on request.
                </p>
              </div>
            </div>

            <div style={{ marginTop: "50px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", color: "#6b7280", fontSize: "12px" }}>
              © {new Date().getFullYear()} The Serenity Spa Kampala. All rights reserved.
            </div>
          </div>
        </footer>

        {/* --- HIGH-RES TREATMENT FLYER MODAL --- */}
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
                border: "1px solid rgba(197,168,128,0.35)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                display: "flex",
                flexDirection: "column",
                maxHeight: "90vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 22px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "#11161b",
                }}
              >
                <div>
                  <h3 style={{ color: "#fff", fontFamily: "Cormorant, serif", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
                    {modalService.title}
                  </h3>
                  <span style={{ color: "#c5a880", fontWeight: 700, fontSize: "13px" }}>
                    {formatPrice(modalService.price)}
                  </span>
                </div>
                <button
                  onClick={() => setModalService(null)}
                  style={{
                    color: "#9ca3af",
                    background: "none",
                    border: "none",
                    fontSize: "2rem",
                    cursor: "pointer",
                    lineHeight: 1,
                    padding: "0 6px",
                  }}
                >
                  ×
                </button>
              </div>

              {/* Modal Flyer Image */}
              <div style={{ padding: "16px", display: "flex", justifyContent: "center", overflowY: "auto", flex: 1, backgroundColor: "#0b0f13" }}>
                <img
                  src={modalService.fullImage || modalService.image}
                  alt={modalService.title}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "56vh",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = modalService.image || "/assets/images/backgrounds/slider-2-1.jpg";
                  }}
                />
              </div>

              {/* Modal Description & CTA */}
              <div style={{ padding: "16px 22px", borderTop: "1px solid rgba(255,255,255,0.08)", backgroundColor: "#11161b" }}>
                <p style={{ color: "#c4cfde", fontSize: "13px", lineHeight: 1.5, margin: "0 0 14px 0" }}>
                  {modalService.description}
                </p>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    onClick={() => setModalService(null)}
                    style={{
                      padding: "10px 18px",
                      backgroundColor: "transparent",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#9ca3af",
                      borderRadius: "4px",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                  <a
                    href={getWhatsAppLink(modalService.title, modalService.price)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "10px 24px",
                      backgroundColor: "#c5a880",
                      color: "#0e1317",
                      borderRadius: "4px",
                      fontWeight: 700,
                      fontSize: "13px",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i className="fab fa-whatsapp"></i> Book This Treatment
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    
      {/* ── COOL ENTRANCE & HOVER ANIMATION STYLES ── */}
      <style>{`
        @keyframes cardFloatIn {
          from {
            opacity: 0;
            transform: translateY(28px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .spa-card-animated {
          animation: cardFloatIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
          will-change: transform, opacity;
        }
        .spa-card-animated:hover img {
          transform: scale(1.08) !important;
        }
      `}</style>
  
    </>
  );
}
