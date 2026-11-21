"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";
import { useSiteContact } from "@/components/ContactProvider";
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


// ── Exact Old Site Scroll Animation & Gold Theme ──
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
          // Only reset when scrolled back ABOVE viewport, preventing jarring resets
          setInView(false);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Delay calculation for column stagger: 0.08s per column
  const staggerDelay = (index % 3) * 0.08;

  return (
    <div
      ref={ref}
      className="col-lg-4 col-md-6 col-12"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate3d(0, 0, 0)' : 'translate3d(0, 32px, 0)',
        transition: `opacity 0.75s cubic-bezier(0.25, 1, 0.5, 1) ${staggerDelay}s, transform 0.75s cubic-bezier(0.25, 1, 0.5, 1) ${staggerDelay}s`,
        willChange: 'transform, opacity',
      }}
    >
      <div
        className="service-theme-card"
        style={{
          backgroundColor: '#14191f',
          backgroundImage: 'linear-gradient(165deg, #171d24 0%, #0e1216 100%)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(194, 167, 78, 0.22)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.55)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-10px)';
          e.currentTarget.style.borderColor = 'rgba(194, 167, 78, 0.55)';
          e.currentTarget.style.boxShadow = '0 20px 48px rgba(0, 0, 0, 0.75), 0 0 25px rgba(194, 167, 78, 0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'rgba(194, 167, 78, 0.22)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.55)';
        }}
      >
        {/* Palm leaf line art overlay with subtle dark theme opacity */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '180px',
            height: '180px',
            backgroundImage: 'url(/assets/images/shapes/funfact-bg-2-shape.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left bottom',
            pointerEvents: 'none',
            opacity: 0.22,
            filter: 'brightness(1.5)',
            zIndex: 1,
          }}
        />

        {/* Card Image — static, fills the entire image area with no empty edges */}
        <div
          style={{ height: '220px', overflow: 'hidden', position: 'relative', backgroundColor: '#0e1317', zIndex: 2 }}
        >
          <img
            src={imgSrc}
            alt={service.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'scale(1)';
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImg;
            }}
          />
        </div>

        {/* Card Content with Distinct Obsidian Dark Luxury Theme */}
        <div style={{ padding: '24px 22px', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' }}>
            <h3
              style={{
                fontFamily: 'Cormorant, serif',
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#ffffff',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {service.title}
            </h3>
            <span
              style={{
                backgroundColor: 'rgba(194, 167, 78, 0.12)',
                color: '#e5c970',
                padding: '4px 12px',
                borderRadius: '16px',
                fontWeight: 800,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                border: '1px solid rgba(194, 167, 78, 0.38)',
              }}
            >
              {formatPrice(service.price)}
            </span>
          </div>

          <p
            style={{
              color: 'rgba(255, 255, 255, 0.78)',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              fontSize: '0.92rem',
              lineHeight: 1.6,
              marginBottom: '20px',
              flex: 1,
              fontWeight: 400,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '4.2em',
            }}
          >
            {service.description || 'A soothing treatment designed to revitalize mind, body, and senses.'}
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: 'auto',
              paddingTop: '16px',
              borderTop: '1px solid rgba(194, 167, 78, 0.15)',
            }}
          >
            <Link
              href={'/booking?service=' + encodeURIComponent(service.title) + '&price=' + encodeURIComponent(String(service.price))}
              style={{
                flex: 1.3,
                padding: '11px 14px',
                backgroundColor: '#c2a74e',
                border: '1.5px solid #c2a74e',
                color: '#0e1317',
                borderRadius: '0px',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(194, 167, 78, 0.3)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dfc268';
                e.currentTarget.style.borderColor = '#dfc268';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(194, 167, 78, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#c2a74e';
                e.currentTarget.style.borderColor = '#c2a74e';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(194, 167, 78, 0.3)';
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

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function ServicesPage() {
  // Never render the hardcoded INITIAL_SERVICES array: it contains old image
  // paths and caused a brief stale-image flash before /api/content resolved.
  const [services, setServices] = useState<Service[]>([]);
  const { phoneHref, phoneDisplay, whatsappDisplay, whatsappLink } = useSiteContact();
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  // Hero reveal on mount (slight delay so it feels intentional not glitchy)
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchSiteContent();
        if (data) {
          const catalog = splitServiceCatalog(data);
          if (catalog.services.length > 0) {
            setServices(catalog.services);
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
          if (localData) {
            const catalog = splitServiceCatalog(localData);
            if (catalog.services.length > 0) setServices(catalog.services);
          }
        }
      } catch (localErr) {
        console.error("Failed to load local JSON", localErr);
      } finally {
        setLoading(false);
      }
    };

    loadServices();

    // An admin save should show up in an already-open public tab as soon as the
    // visitor returns to it. The probe is cache-busted and read-only.
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

  // Explicit catalogue order from the site owner first; every unlisted card is
  // merged in by price so nothing disappears from the page.
  const filteredServices = useMemo(() => {
    let list = orderServices(
      services.filter((s) => isRealServiceTitle(s.title)),
      "services"
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
    return list;
  }, [services, activeCategory, searchQuery]);

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
                  <li className="current">
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

        {/* ─── LUXURY HERO BANNER ─── */}
        <div
          ref={heroRef}
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
          {/* Background image */}
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
          {/* Gold gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(194, 167, 78,0.08) 0%, rgba(14,19,23,0.75) 100%)",
            }}
          />
          {/* Text content */}
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
              Indulge &amp; Rejuvenate
            </span>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700, color: "#ffffff", margin: "0 0 12px 0", lineHeight: 1.15 }}>
              Our Spa Services &amp; Wellness Rituals
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(0.85rem, 2vw, 1rem)", maxWidth: "600px", margin: "0 auto 18px auto", lineHeight: 1.6 }}>
              Explore our essential therapies in Kampala — from restorative Swedish strokes and deep tissue therapy to soothing scrubs, aromatherapy, and relaxing couples sessions.
            </p>
            <nav style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
              <span style={{ margin: "0 8px", color: "#c2a74e" }}>/</span>
              <span style={{ color: "#c2a74e" }}>Services</span>
            </nav>
          </div>
        </div>

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
              <div style={{ textAlign: "center", padding: "60px 0", backgroundColor: "#161c22", borderRadius: "12px", border: "1px dashed rgba(194, 167, 78,0.3)" }}>
                <i className="fas fa-spa" style={{ fontSize: "3rem", color: "#c2a74e", marginBottom: "16px" }}></i>
                <h3 style={{ color: "#fff", fontFamily: "Cormorant, serif", fontSize: "1.8rem" }}>No treatments found</h3>
                <p style={{ color: "#9ca3af", marginBottom: "20px" }}>Try adjusting your search terms or category filter.</p>
                <button
                  onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
                  style={{ padding: "8px 20px", backgroundColor: "#c2a74e", color: "#0e1317", border: "none", borderRadius: "4px", fontWeight: 700, cursor: "pointer" }}
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
        {/* --- VIP & EXCLUSIVE RETREAT BANNER --- */}
        <section
          style={{
            padding: "60px 0",
            backgroundColor: "#131920",
            borderTop: "1px solid rgba(194, 167, 78,0.15)",
            borderBottom: "1px solid rgba(194, 167, 78,0.15)",
          }}
        >
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <span style={{ color: "#c2a74e", textTransform: "uppercase", letterSpacing: "2px", fontSize: "12px", fontWeight: 700 }}>
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
                  href={whatsappLink("Hello The Serenity Spa, I would like to inquire about bespoke VIP packages and private suite bookings.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="serenity-gold-btn"
                  style={{
                    backgroundColor: "#c2a74e",
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
              <span style={{ color: "#c2a74e", fontFamily: "Alex Brush, cursive", fontSize: "1.8rem" }}>Visit Sanctuary</span>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "2.6rem", fontWeight: 700, color: "#fff" }}>
                Our Locations &amp; Concierge
              </h2>
            </div>

            <div className="row g-4">
              <div className="col-lg-4">
                <div style={{ backgroundColor: "#161c22", padding: "30px", borderRadius: "10px", border: "1px solid rgba(194, 167, 78,0.2)", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                    <div style={{ width: "46px", height: "46px", borderRadius: "50%", backgroundColor: "rgba(194, 167, 78,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c2a74e", fontSize: "20px" }}>
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h4 style={{ color: "#fff", margin: 0, fontSize: "1.1rem" }}>Spa Locations</h4>
                      <p style={{ color: "#c2a74e", margin: 0, fontSize: "12px" }}>Kampala, Uganda</p>
                    </div>
                  </div>
                  <p style={{ color: "#c4cfde", fontSize: "14px", lineHeight: 1.6 }}>
                    • Sir Apollo Kaggwa Road, Kampala<br />
                    • Mengo Branch, Kampala
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div style={{ backgroundColor: "#161c22", padding: "30px", borderRadius: "10px", border: "1px solid rgba(194, 167, 78,0.2)", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                    <div style={{ width: "46px", height: "46px", borderRadius: "50%", backgroundColor: "rgba(194, 167, 78,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c2a74e", fontSize: "20px" }}>
                      <i className="fas fa-clock"></i>
                    </div>
                    <div>
                      <h4 style={{ color: "#fff", margin: 0, fontSize: "1.1rem" }}>Operating Hours</h4>
                      <p style={{ color: "#c2a74e", margin: 0, fontSize: "12px" }}>Open 7 Days A Week</p>
                    </div>
                  </div>
                  <p style={{ color: "#c4cfde", fontSize: "14px", lineHeight: 1.6 }}>
                    Every day: <strong>Open 24 Hours</strong><br />
                    Mobile &amp; Outcall services available upon early booking.
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div style={{ backgroundColor: "#161c22", padding: "30px", borderRadius: "10px", border: "1px solid rgba(194, 167, 78,0.2)", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                    <div style={{ width: "46px", height: "46px", borderRadius: "50%", backgroundColor: "rgba(194, 167, 78,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c2a74e", fontSize: "20px" }}>
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div>
                      <h4 style={{ color: "#fff", margin: 0, fontSize: "1.1rem" }}>Direct Lines</h4>
                      <p style={{ color: "#c2a74e", margin: 0, fontSize: "12px" }}>Instant Confirmation</p>
                    </div>
                  </div>
                  <p style={{ color: "#c4cfde", fontSize: "14px", lineHeight: 1.6 }}>
                    Phone: <a href={phoneHref} style={{ color: "#fff", textDecoration: "none" }}>{phoneDisplay || "Call us"}</a><br />
                    WhatsApp: <a href={whatsappLink()} style={{ color: "#25D366", textDecoration: "none" }}>{whatsappDisplay || "WhatsApp us"}</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div style={{ marginTop: "40px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(194, 167, 78,0.2)", height: "320px" }}>
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
                  <img src="/assets/logo.jpg" alt="The Serenity Spa" style={{ height: "46px", width: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(194, 167, 78,0.5)" }} />
                  <span style={{ fontFamily: "Cormorant, serif", fontSize: "1.4rem", fontWeight: 700, color: "#ffffff" }}>
                    THE SERENITY SPA
                  </span>
                </Link>
                <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6, maxWidth: "320px" }}>
                  Kampala’s sanctuary for holistic rejuvenation, luxury hydrotherapy, and authentic massage rituals.
                </p>
                <div style={{ display: "flex", gap: "14px", marginTop: "16px" }}>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" style={{ color: "#c2a74e", fontSize: "18px" }}><i className="fab fa-whatsapp"></i></a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#c2a74e", fontSize: "18px" }}><i className="fab fa-instagram"></i></a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#c2a74e", fontSize: "18px" }}><i className="fab fa-facebook"></i></a>
                </div>
              </div>

              <div className="col-lg-2 col-md-6">
                <h4 style={{ color: "#ffffff", fontFamily: "Cormorant, serif", fontSize: "1.2rem", marginBottom: "16px" }}>Navigation</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                  <li><Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Home</Link></li>
                  <li><Link href="/services" style={{ color: "#c2a74e", textDecoration: "none" }}>Services</Link></li>
                  <li><Link href="/gallery" style={{ color: "#9ca3af", textDecoration: "none" }}>Gallery</Link></li>
                  <li><Link href="/blog" style={{ color: "#9ca3af", textDecoration: "none" }}>Blog</Link></li>
                  <li><Link href="/escorts" style={{ color: "#9ca3af", textDecoration: "none" }}>Escorts</Link></li>
                </ul>
              </div>

              <div className="col-lg-3 col-md-6">
                <h4 style={{ color: "#ffffff", fontFamily: "Cormorant, serif", fontSize: "1.2rem", marginBottom: "16px" }}>Contacts</h4>
                <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                  Sir Apollo Kaggwa Rd &amp; Mengo, Kampala<br />
                  Phone: <a href={phoneHref} style={{ color: "#c2a74e", textDecoration: "none" }}>{phoneDisplay || "Call us"}</a><br />
                  Email: <a href="mailto:theserenitybookings@gmail.com" style={{ color: "#c2a74e", textDecoration: "none" }}>theserenitybookings@gmail.com</a>
                </p>
              </div>

              <div className="col-lg-3 col-md-6">
                <h4 style={{ color: "#ffffff", fontFamily: "Cormorant, serif", fontSize: "1.2rem", marginBottom: "16px" }}>Hours</h4>
                <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                  Open 24 Hours, 7 Days a Week:<br />
                  <strong style={{ color: "#fff" }}>Any time, day or night</strong><br />
                  Private appointments accommodated on request.
                </p>
              </div>
            </div>

            <div style={{ marginTop: "50px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", color: "#6b7280", fontSize: "12px" }}>
              © {new Date().getFullYear()} The Serenity Spa Kampala. All rights reserved.
            </div>
          </div>
        </footer>

      </div>
    
      {/* ── EXACT OLD SITE FLOAT-IN TRANSITION & THEME STYLES ── */}
      <style>{`
        @keyframes floatInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float-up {
          animation: floatInUp 1s ease-out forwards;
        }

        .opacity-0 {
          opacity: 0;
          transform: translateY(30px);
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
  
    </>
  );
}
