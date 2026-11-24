"use client";

import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";
import { useSiteContact } from "@/components/ContactProvider";
import {
  SiteVideo,
  VIDEO_CATEGORY_OPTIONS,
  normalizeSiteVideos,
} from "@/lib/site-videos";
import { fetchSiteContent, getCachedSiteContent } from "@/lib/service-order";
import { useScrollFloat } from "@/lib/use-scroll-float";

interface GalleryImage {
  id?: string;
  src: string;
  alt?: string;
  delay?: string;
  availability?: "available" | "in-session" | string;
}

// Single source of truth for specialist availability. The admin-controlled record field is
// authoritative; the positional fallback exists only for legacy rows with no availability
// field, and is kept identical for cards and lightbox so their badges can never disagree.
function isImageAvailable(img: GalleryImage, index: number): boolean {
  return img.availability !== undefined ? img.availability === "available" : index % 4 !== 1;
}

// The admin "Name" field is stored as the image's `alt`. Return it only when it is a
// real custom name — generic placeholder values must not produce a fabricated label.
function getCustomName(img: GalleryImage): string {
  const alt = (img.alt || "").trim();
  const lowered = alt.toLowerCase();
  // "Serenity Spa Gallery" is the API fallback for images with no admin-set name.
  // It must never be presented as a therapist name (caption or booking button).
  if (!alt || lowered === "the serenity spa" || lowered === "serenity spa gallery" || alt.includes("Serenity Spa -")) return "";
  return alt;
}

// One shared label for every gallery booking surface. The admin-set Name wins;
// the generic wording is only for records where no real name exists.
function getBookingLabel(img: GalleryImage): string {
  const name = getCustomName(img);
  return name ? `Book ${name}` : "Book Therapist";
}

// Video cards are NOT seeded locally. The admin-controlled /api/content
// `videos` array is the only source; first paint shows a loading state.
// A neutral inline frame is used only when an admin record has no poster.
const DEFAULT_VIDEO_POSTER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#13181e"/><stop offset="0.55" stop-color="#080b0e"/><stop offset="1" stop-color="#1d1710"/></linearGradient></defs><rect width="960" height="540" fill="url(#g)"/><circle cx="480" cy="270" r="58" fill="none" stroke="#c2a74e" stroke-width="3"/><path d="M463 242 L512 270 L463 298 Z" fill="#c2a74e"/><text x="480" y="378" fill="#8b7355" font-family="Georgia,serif" font-size="24" text-anchor="middle">SERENITY SPA FILM</text></svg>'
  );

// Route Worker-hosted media videos through our Range-supporting proxy so iOS Safari
// and mobile browsers receive proper 206 Partial Content & Accept-Ranges headers.
function getPlayableVideoSrc(url: string): string {
  if (!url) return "";
  if (url.includes(".workers.dev/media/")) {
    return `/api/video-stream?url=${encodeURIComponent(url)}`;
  }
  return url;
}

// ── Specialist Profile Card — memoized so parent state changes do not re-render all cards ──
const GalleryCard = memo(function GalleryCard({
  img,
  index,
  fallbackImg,
  onClick,
}: {
  img: GalleryImage;
  index: number;
  fallbackImg: string;
  onClick: () => void;
}) {
  const isAvailable = isImageAvailable(img, index);
  const customName = getCustomName(img);
  const specialistName = customName || `Specialist #${index + 1}`;

  const { ref, floatClass, style: floatStyle } = useScrollFloat<HTMLDivElement>({
    delay: (index % 4) * 0.07,
  });

  const handleBooking = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/booking?therapist=${encodeURIComponent(specialistName)}`;
  }, [specialistName]);

  return (
    <div
      ref={ref}
      className={`col-xl-3 col-lg-4 col-md-6 col-6 gallery-card-col ${floatClass}`}
      style={floatStyle}
    >      <div
        className={`gallery-card-inner gallery-card-available-${isAvailable ? "yes" : "no"}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={`View full-size photos of ${specialistName}`}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {/* Availability Badge */}
        <div className={`gallery-badge gallery-badge--${isAvailable ? "available" : "busy"}`}>
          <span className={isAvailable ? "status-dot-pulse-green" : "gallery-dot-busy"} />
          <span className="gallery-badge__label">
            {isAvailable ? "Available" : "In Session"}
          </span>
        </div>

        {/* Image */}
        <div className="gallery-img-wrap">
          <img
            src={img.src}
            alt={img.alt || "The Serenity Spa"}
            loading="lazy"
            decoding="async"
            className="gallery-img"
            onError={(e) => { (e.target as HTMLImageElement).src = fallbackImg; }}
          />
          <div className="gallery-gradient" />
          <div className="gallery-overlay">
            <div className="gallery-zoom-icon">
              <i className="fas fa-search-plus" />
            </div>
          </div>

          {/* Book button */}
          <div className="gallery-book-wrap">
            <button
              className={`gallery-book-btn gallery-book-btn--${isAvailable ? "available" : "busy"}`}
              onClick={handleBooking}
            >
              <i className="fas fa-calendar-check" />
              <span>{getBookingLabel(img)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function GalleryPage({
  initialHeroSrc,
  initialImages,
  initialVideos,
}: {
  initialHeroSrc?: string;
  initialImages?: GalleryImage[];
  initialVideos?: SiteVideo[];
} = {}) {
  const [images, setImages] = useState<GalleryImage[]>(() => initialImages || []);
  const [loading, setLoading] = useState(!initialImages);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<SiteVideo | null>(null);
  const [videos, setVideos] = useState<SiteVideo[]>(() => initialVideos || []);
  const [videosLoading, setVideosLoading] = useState(!initialVideos);
  const [activeVideoFilter, setActiveVideoFilter] = useState<string>("all");
  // The gallery opens on Images; the Videos tab reveals the demonstration reels.
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { phoneHref, phoneDisplay, whatsappLink } = useSiteContact();
  // Server provides the current first gallery image so the hero paints on
  // first HTML. After the authoritative gallery fetch completes, only its data
  // decides the hero — never a stale default.
  const heroSrc = images[0]?.src || (loading ? initialHeroSrc : undefined);

  useEffect(() => {
    setVideoError(false);
    const el = videoRef.current;
    if (!selectedVideo?.videoUrl || !el) return;
    el.load();
    const playPromise = el.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Fallback to muted autoplay if browser policy blocks unmuted autoplay
        el.muted = true;
        el.play().catch(() => {});
      });
    }
  }, [selectedVideo]);

  useEffect(() => {
    let cancelled = false;
    if (!initialImages) {
      try {
        const cached = sessionStorage.getItem("serenity_gallery_v1");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setImages(parsed);
            setLoading(false);
          }
        }
      } catch {}
    }

    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            try {
              sessionStorage.setItem("serenity_gallery_v1", JSON.stringify(data));
            } catch {}
            if (!cancelled) {
              setImages(data);
              setLoading(false);
            }
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load /api/gallery", err);
      }
      if (!cancelled && !initialImages) {
        setLoading(false);
      }
    };

    fetchGallery();
    return () => { cancelled = true; };
  }, [initialImages]);

  // Reels come from the same durable store as the admin Videos tab. Refetch on
  // admin save or visibility return without blocking first paint.
  useEffect(() => {
    let cancelled = false;
    let requestId = 0;

    if (!initialVideos) {
      const cached = getCachedSiteContent();
      if (cached) {
        setVideos(normalizeSiteVideos(cached.videos));
        setVideosLoading(false);
      }
    }

    const loadVideos = async (force = false) => {
      const currentRequest = ++requestId;
      try {
        const data = await fetchSiteContent({ force });
        if (data && !cancelled && currentRequest === requestId) {
          setVideos(normalizeSiteVideos(data.videos));
        }
      } catch (err) {
        console.error("Failed to load /api/content videos", err);
      } finally {
        if (!cancelled && currentRequest === requestId) setVideosLoading(false);
      }
    };

    loadVideos(false);
    const onAdminSave = () => loadVideos(true);
    const onVisibility = () => {
      if (document.visibilityState === "visible") loadVideos(false);
    };
    window.addEventListener("serenity-content-updated", onAdminSave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      window.removeEventListener("serenity-content-updated", onAdminSave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [initialVideos]);

  // Keyboard navigation for lightbox & video modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
        setSelectedVideo(null);
      }
      if (selectedIndex !== null) {
        if (e.key === "ArrowLeft") {
          setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
        }
        if (e.key === "ArrowRight") {
          setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  const videoFilterButtons = VIDEO_CATEGORY_OPTIONS.map((option) => ({
    key: option.value,
    label: `${option.label} (${
      option.value === "all"
        ? videos.length
        : videos.filter((video) => video.category === option.value).length
    })`,
  }));

  const filteredVideos =
    activeVideoFilter === "all"
      ? videos
      : videos.filter((video) => video.category === activeVideoFilter);

  return (
    <>
      <CustomCursor />

      <style jsx global>{`
        @keyframes statusPulseGreen {
          0%   { box-shadow: 0 0 0 0   rgba(16, 185, 129, 0.7); }
          70%  { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0   rgba(16, 185, 129, 0); }
        }
        @keyframes livePulseRed {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes playGlowRipple {
          0%   { box-shadow: 0 0 0 0   rgba(194, 167, 78, 0.7), 0 0 20px rgba(194, 167, 78, 0.4); }
          70%  { box-shadow: 0 0 0 14px rgba(194, 167, 78, 0),   0 0 30px rgba(194, 167, 78, 0.2); }
          100% { box-shadow: 0 0 0 0   rgba(194, 167, 78, 0),   0 0 20px rgba(194, 167, 78, 0); }
        }
        @keyframes escortCtaShimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 300% center; }
        }

        /* ── Gallery cards: pure-CSS hover (zero JS DOM queries on scroll) ── */
        .gallery-card-col {
          contain: layout style;
        }
        .gallery-card-inner {
          height: 330px;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          background-color: #161c22;
          border: 1px solid rgba(194, 167, 78, 0.22);
          box-shadow: 0 6px 20px rgba(0,0,0,0.35);
          display: flex;
          flex-direction: column;
          transition: transform 0.32s cubic-bezier(0.16,1,0.3,1),
                      border-color 0.28s ease,
                      box-shadow 0.32s ease;
          will-change: transform;
        }
        .gallery-card-inner:hover {
          transform: translateY(-8px);
          border-color: rgba(194, 167, 78, 0.65);
          box-shadow: 0 18px 40px rgba(194, 167, 78, 0.18);
        }
        .gallery-img-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.55s cubic-bezier(0.16,1,0.3,1);
          display: block;
        }
        .gallery-card-inner:hover .gallery-img {
          transform: scale(1.08);
        }
        .gallery-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.82) 100%);
          pointer-events: none;
        }
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(14,19,23,0.25) 0%, rgba(14,19,23,0.7) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.28s ease;
        }
        .gallery-card-inner:hover .gallery-overlay { opacity: 1; }
        .gallery-zoom-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(194,167,78,0.95);
          color: #0e1317;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.5);
          transform: translateY(-12px);
          transition: transform 0.32s cubic-bezier(0.16,1,0.3,1);
        }
        .gallery-card-inner:hover .gallery-zoom-icon { transform: translateY(0); }

        /* Badge */
        .gallery-badge {
          position: absolute;
          top: 12px; right: 12px;
          z-index: 6;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 11px;
          border-radius: 20px;
          background: rgba(10,14,18,0.88);
          backdrop-filter: blur(6px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.45);
        }
        .gallery-badge--available { border: 1px solid rgba(16,185,129,0.55); }
        .gallery-badge--busy      { border: 1px solid rgba(239,68,68,0.45); }
        .gallery-badge__label {
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.6px; text-transform: uppercase; line-height: 1;
        }
        .gallery-badge--available .gallery-badge__label { color: #34d399; }
        .gallery-badge--busy      .gallery-badge__label { color: #f87171; }
        .gallery-dot-busy {
          width: 8px; height: 8px; border-radius: 50%;
          background: #ef4444; display: inline-block;
          animation: livePulseRed 1.8s ease-in-out infinite;
        }

        /* Book button */
        .gallery-book-wrap {
          position: absolute;
          bottom: 12px; left: 12px; right: 12px;
          z-index: 6; display: flex; justify-content: center;
        }
        .gallery-book-btn {
          width: 100%;
          padding: 9px 14px;
          border-radius: 4px;
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.8px; text-transform: uppercase;
          cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.6);
          transition: background-color 0.22s ease, color 0.22s ease,
                      border-color 0.22s ease, transform 0.22s ease;
          backdrop-filter: blur(4px);
        }
        .gallery-book-btn--available {
          background: #c2a74e; color: #0e1317; border: 1.5px solid #d4af37;
        }
        .gallery-book-btn--busy {
          background: rgba(24,30,36,0.92); color: #fff;
          border: 1px solid rgba(194,167,78,0.4);
        }
        .gallery-book-btn:hover {
          background: #fff !important; color: #0e1317 !important;
          border-color: #fff !important; transform: scale(1.02);
        }

        .status-dot-pulse-green { animation: statusPulseGreen 2s infinite; }
        .live-dot-pulse         { animation: livePulseRed 1.8s ease-in-out infinite; }
        .video-card-play-btn    { animation: playGlowRipple 2.2s infinite; }
        .video-card-box {
          transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.32s ease, box-shadow 0.32s ease;
          will-change: transform;
        }
        .video-card-box:hover {
          transform: translateY(-8px);
          border-color: rgba(194, 167, 78, 0.65) !important;
          box-shadow: 0 20px 45px rgba(0,0,0,0.75), 0 0 25px rgba(194,167,78,0.25) !important;
        }
        .video-card-box:hover .video-card-poster { transform: scale(1.06); }
        .video-card-poster { transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1); }
        .gallery-card-inner:focus-visible,
        .video-card-box:focus-visible,
        .mobile-nav__toggler:focus-visible,
        .gallery-book-session-btn:focus-visible { outline: 2px solid #c2a74e; outline-offset: 3px; }
        .gallery-lightbox { padding: 0 !important; }
        .gallery-lightbox-stage,
        .gallery-lightbox-img {
          max-width: 100vw !important; max-height: 100dvh !important;
          width: 100vw !important; height: 100dvh !important;
          border-radius: 0 !important; border: none !important;
        }
        .gallery-lightbox-img { object-fit: contain !important; }
        .gallery-profile-grid { --bs-gutter-x: 8px !important; --bs-gutter-y: 8px !important; }
        @media (max-width: 575px) {
          .gallery-card-inner { height: 250px !important; }
          .gallery-lightbox-nav { width: 40px !important; height: 40px !important; }
        }
        /* Reduce animation for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          .gallery-card-col { animation: none; }
          .gallery-card-inner,
          .gallery-img,
          .gallery-overlay,
          .gallery-zoom-icon { transition: none !important; }
          .status-dot-pulse-green,
          .live-dot-pulse,
          .video-card-play-btn,
          .gallery-dot-busy { animation: none !important; }
        }
      `}</style>

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
                  <li className="">
                    <Link href="/mobile-massage">Mobile Massage</Link>
                  </li>
                  <li className="current">
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
                  role="button"
                  tabIndex={0}
                  aria-label="Open navigation menu"
                  onKeyDown={(e) => {
                    if (e.target !== e.currentTarget) return;
                    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                      e.preventDefault();
                      setMobileMenuOpen(true);
                    }
                  }}
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

        {/* ─── LUXURY GALLERY HERO BANNER ─── */}
        <div
          style={{
            position: "relative",
            height: "460px",
            paddingTop: "120px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {heroSrc ? <link rel="preload" as="image" href={heroSrc} /> : null}
          <div
            className="page-motion-hero-media"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: heroSrc ? `url("${heroSrc}")` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "scale(1)",
              filter: "brightness(0.28)",
              opacity: heroSrc ? 1 : 0,
              transition: "opacity 350ms ease",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(194, 167, 78,0.12) 0%, rgba(14,19,23,0.88) 100%)",
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
            <span style={{ color: "#c2a74e", fontFamily: "'Great Vibes', cursive, Cormorant, serif", fontSize: "1.7rem", display: "block", marginBottom: "8px" }}>
              A Visual &amp; Sensory Journey
            </span>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(2.1rem, 4.8vw, 3.4rem)", fontWeight: 700, color: "#ffffff", margin: "0 0 12px 0", lineHeight: 1.15 }}>
              Therapist Profiles &amp; Video Sanctuary
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "clamp(0.85rem, 2vw, 1.02rem)", maxWidth: "620px", margin: "0 auto 20px auto", lineHeight: 1.6 }}>
              Explore live specialist availability, watch video demonstrations of treatments in motion, and discover our private hydrotherapy suites.
            </p>
            <nav style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
              <span style={{ margin: "0 8px", color: "#c2a74e" }}>/</span>
              <span style={{ color: "#c2a74e" }}>Gallery &amp; Videos</span>
            </nav>
          </div>
        </div>

        {/* ─── IMAGES / VIEWS TOGGLE ─── */}
        <div
          role="tablist"
          aria-label="Gallery view"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            padding: "26px 20px 0",
          }}
        >
          {[
            { key: "images" as const, label: "Images", icon: "fas fa-images" },
            { key: "videos" as const, label: "Videos", icon: "fas fa-video" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSelectedIndex(null);
                setSelectedVideo(null);
              }}
              style={{
                minWidth: "160px",
                minHeight: "46px",
                padding: "12px 26px",
                borderRadius: "30px",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: "14px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                border: activeTab === tab.key ? "1.5px solid #c2a74e" : "1px solid rgba(255,255,255,0.18)",
                background: activeTab === tab.key ? "linear-gradient(90deg, #7a5c1e, #c2a74e)" : "rgba(20,26,32,0.85)",
                color: activeTab === tab.key ? "#0e1317" : "#e5e7eb",
                transition: "all 0.25s ease",
                boxShadow: activeTab === tab.key ? "0 6px 22px rgba(194,167,78,0.35)" : "none",
              }}
            >
              <i className={tab.icon} style={{ marginRight: "8px" }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── SECTION 1: SPECIALIST PROFILES & SANCTUARY GALLERY ─── */}
        <section
          style={{
            padding: "46px 0 60px 0",
            borderBottom: "1px solid rgba(194, 167, 78, 0.15)",
            display: activeTab === "images" ? "block" : "none",
          }}
        >
          <div className="container">
            {loading ? (
              <div className="card-loading-slot" style={{ textAlign: "center" }}>
                <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
                  <span className="visually-hidden">Loading gallery...</span>
                </div>
                <p style={{ marginTop: "16px", color: "#9ca3af" }}>Loading specialist photographs...</p>
              </div>
            ) : images.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", backgroundColor: "#161c22", borderRadius: "12px", border: "1px dashed rgba(194, 167, 78,0.3)" }}>
                <i className="fas fa-images" style={{ fontSize: "3rem", color: "#c2a74e", marginBottom: "16px" }}></i>
                <h3 style={{ color: "#fff", fontFamily: "Cormorant, serif", fontSize: "1.8rem" }}>No profiles found</h3>
                <p style={{ color: "#9ca3af" }}>Check back soon as we update our luxury suite gallery.</p>
              </div>
            ) : (
              <div className="row g-2 gallery-profile-grid">
                {images.map((img, index) => {
                  const fallbackImg = `/assets/images/instagram/instagram-2-${(index % 5) + 1}.jpg`;
                  return (
                    <GalleryCard
                      key={img.id || index}
                      img={img}
                      index={index}
                      fallbackImg={fallbackImg}
                      onClick={() => setSelectedIndex(index)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ─── GET ESCORT SERVICE CTA ─── */}
        <section
          style={{
            padding: "60px 24px",
            backgroundColor: "#0e1317",
            borderTop: "1px solid rgba(194,167,78,0.1)",
            borderBottom: "1px solid rgba(194,167,78,0.1)",
            textAlign: "center",
            display: activeTab === "images" ? "block" : "none",
          }}
        >
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "18px",
              }}
            >
              <div style={{ height: "1px", width: "50px", background: "linear-gradient(90deg, transparent, #c2a74e)" }} />
              <span
                style={{
                  color: "#c2a74e",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontFamily: "'Cormorant', serif",
                }}
              >
                Exclusive Service
              </span>
              <div style={{ height: "1px", width: "50px", background: "linear-gradient(90deg, #c2a74e, transparent)" }} />
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant', serif",
                fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                fontWeight: 700,
                color: "#e8d9b0",
                margin: "0 0 10px 0",
                lineHeight: 1.2,
              }}
            >
              Private Companionship, Redefined
            </h2>
            <p
              style={{
                color: "rgba(196,207,222,0.65)",
                fontSize: "1rem",
                lineHeight: 1.75,
                marginBottom: "32px",
                fontFamily: "'Cormorant', serif",
                fontStyle: "italic",
              }}
            >
              Sophisticated, discreet, and unforgettable escort experiences curated for the discerning gentleman.
            </p>

            <Link
              href="/escorts"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 44px",
                background: "linear-gradient(90deg, #7a5c1e 0%, #c2a74e 25%, #f5e199 50%, #d4af37 75%, #c2a74e 100%)",
                backgroundSize: "300% auto",
                color: "#0e1317",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "13px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                boxShadow: "0 8px 32px rgba(194,167,78,0.4), 0 2px 8px rgba(0,0,0,0.5)",
                fontFamily: "'Cormorant', serif",
                WebkitAnimation: "escortCtaShimmer 3s linear infinite",
                animation: "escortCtaShimmer 3s linear infinite",
                border: "1.5px solid rgba(212,175,55,0.6)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 14px 44px rgba(194,167,78,0.6), 0 2px 12px rgba(0,0,0,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(194,167,78,0.4), 0 2px 8px rgba(0,0,0,0.5)";
              }}
            >
              <i className="fas fa-crown" style={{ fontSize: "15px" }} />
              <span>Get Escort Service</span>
              <i className="fas fa-arrow-right" style={{ fontSize: "12px" }} />
            </Link>
          </div>
        </section>

        {/* ─── SECTION 2: THERAPIES IN MOTION (VIDEO DEMONSTRATIONS) ─── */}
        <section
          style={{
            padding: "46px 0 90px 0",
            backgroundColor: "#0a0e12",
            display: activeTab === "videos" ? "block" : "none",
          }}
        >
          <div className="container">
            {/* Video Category Filter Tabs */}
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "40px" }}>
              {videoFilterButtons.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveVideoFilter(tab.key)}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "30px",
                    border: activeVideoFilter === tab.key ? "1.5px solid #c2a74e" : "1px solid rgba(255,255,255,0.12)",
                    backgroundColor: activeVideoFilter === tab.key ? "#c2a74e" : "rgba(20, 26, 32, 0.7)",
                    color: activeVideoFilter === tab.key ? "#0e1317" : "#d1d5db",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.6px",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    boxShadow: activeVideoFilter === tab.key ? "0 4px 16px rgba(194, 167, 78, 0.35)" : "none",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Video Cards Grid — loaded only from the admin store */}
            {videosLoading ? (
              <div className="video-state" style={{ padding: "70px 20px", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                Loading videos…
              </div>
            ) : videos.length === 0 ? (
              <div className="video-state" style={{ padding: "70px 20px", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                <p style={{ fontSize: 34, margin: "0 0 10px" }}>🎬</p>
                <p style={{ margin: 0 }}>No videos have been added yet. Please check back soon.</p>
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="video-state" style={{ padding: "70px 20px", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                No videos in this category yet.
              </div>
            ) : (
            <div className="row g-4">
              {filteredVideos.map((video) => (
                <div key={video.id} className="col-lg-4 col-md-6 col-12">
                  <div
                    className="video-card-box"
                    onClick={() => setSelectedVideo(video)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Play demonstration: ${video.title}`}
                    onKeyDown={(e) => {
                      // The nested "Book Session" button handles its own keyboard activation.
                      if (e.target !== e.currentTarget) return;
                      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                        e.preventDefault();
                        setSelectedVideo(video);
                      }
                    }}
                    style={{
                      backgroundColor: "#13181e",
                      borderRadius: "14px",
                      overflow: "hidden",
                      border: "1px solid rgba(194, 167, 78, 0.25)",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                      cursor: "pointer",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* 16:9 Thumbnail Reel with Glowing Play Button */}
                    <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", overflow: "hidden", backgroundColor: "#080b0e" }}>
                      {video.poster ? (
                        <img
                          src={video.poster}
                          alt={video.title}
                          className="video-card-poster"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_VIDEO_POSTER; }}
                        />
                      ) : video.videoUrl ? (
                        <video
                          src={`${getPlayableVideoSrc(video.videoUrl)}#t=0.5`}
                          preload="metadata"
                          muted
                          playsInline
                          aria-label={video.title}
                          className="video-card-poster"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            pointerEvents: "none",
                          }}
                        />
                      ) : (
                        <img
                          src={video.youtubeId ? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg` : DEFAULT_VIDEO_POSTER}
                          alt={video.title}
                          className="video-card-poster"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_VIDEO_POSTER; }}
                        />
                      )}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.85) 100%)",
                        }}
                      />

                      {/* Top Badges: Live Demo + Duration */}
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          zIndex: 3,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          backgroundColor: "rgba(14, 19, 23, 0.85)",
                          backdropFilter: "blur(4px)",
                          border: "1px solid rgba(239, 68, 68, 0.5)",
                        }}
                      >
                        <span
                          className="live-dot-pulse"
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            backgroundColor: "#ef4444",
                            display: "inline-block",
                          }}
                        />
                        <span style={{ color: "#fca5a5", fontSize: "10px", fontWeight: 800, letterSpacing: "0.6px" }}>
                          DEMO REEL
                        </span>
                      </div>

                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          zIndex: 3,
                          padding: "4px 9px",
                          borderRadius: "4px",
                          backgroundColor: "rgba(14, 19, 23, 0.85)",
                          backdropFilter: "blur(4px)",
                          color: "#c2a74e",
                          fontSize: "11px",
                          fontWeight: 700,
                          border: "1px solid rgba(194, 167, 78, 0.35)",
                        }}
                      >
                        {video.duration}
                      </div>

                      {/* Center Glowing Play Icon */}
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          zIndex: 4,
                        }}
                      >
                        <div
                          className="video-card-play-btn"
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "50%",
                            backgroundColor: "#c2a74e",
                            color: "#0e1317",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                            paddingLeft: "3px",
                            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.6)",
                            transition: "transform 0.25s ease",
                          }}
                        >
                          <i className="fas fa-play"></i>
                        </div>
                      </div>

                      {/* Bottom Overlay Category Badge */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "14px",
                          zIndex: 3,
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: "rgba(194, 167, 78, 0.2)",
                            color: "#fef08a",
                            border: "1px solid rgba(194, 167, 78, 0.5)",
                            padding: "3px 9px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: 800,
                            letterSpacing: "0.6px",
                            textTransform: "uppercase",
                          }}
                        >
                          {video.categoryLabel}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
                      <h3
                        style={{
                          fontFamily: "Cormorant, serif",
                          fontSize: "1.35rem",
                          fontWeight: 700,
                          color: "#ffffff",
                          margin: "0 0 8px 0",
                          lineHeight: 1.25,
                        }}
                      >
                        {video.title}
                      </h3>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <i className="fas fa-user-check" style={{ color: "#c2a74e", fontSize: "12px" }}></i>
                        <span style={{ color: "#c2a74e", fontSize: "12.5px", fontWeight: 700 }}>
                          {video.specialist}
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>•</span>
                        <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "11.5px" }}>
                          {video.role}
                        </span>
                      </div>

                      <p
                        style={{
                          color: "rgba(255,255,255,0.75)",
                          fontSize: "13px",
                          lineHeight: 1.6,
                          margin: "0 0 18px 0",
                          flex: 1,
                        }}
                      >
                        {video.description}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingTop: "14px",
                          borderTop: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <span style={{ color: "#c2a74e", fontSize: "12px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <i className="fas fa-play-circle"></i> Watch Session
                        </span>

                        <button
                          type="button"
                          className="gallery-book-session-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/booking?service=${encodeURIComponent(video.bookingService)}&therapist=${encodeURIComponent(video.specialist)}`;
                          }}
                          style={{
                            padding: "6px 14px",
                            backgroundColor: "transparent",
                            border: "1px solid rgba(194, 167, 78, 0.45)",
                            color: "#c2a74e",
                            borderRadius: "4px",
                            fontFamily: "inherit",
                            lineHeight: "inherit",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#c2a74e";
                            e.currentTarget.style.color = "#0e1317";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "#c2a74e";
                          }}
                        >
                          Book Session
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
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
                  Kampala’s premier executive sanctuary for holistic rejuvenation, luxury hydrotherapy, and authentic massage rituals.
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
                  <li><Link href="/services" style={{ color: "#9ca3af", textDecoration: "none" }}>Services</Link></li>
                  <li><Link href="/vip-packages" style={{ color: "#9ca3af", textDecoration: "none" }}>VIP Packages</Link></li>
                  <li><Link href="/mobile-massage" style={{ color: "#9ca3af", textDecoration: "none" }}>Mobile Massage</Link></li>
                  <li><Link href="/gallery" style={{ color: "#c2a74e", textDecoration: "none" }}>Gallery &amp; Videos</Link></li>
                  <li><Link href="/blog" style={{ color: "#9ca3af", textDecoration: "none" }}>Blog</Link></li>
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
                  Private suite appointments accommodated on request.
                </p>
              </div>
            </div>

            <div style={{ marginTop: "50px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", color: "#6b7280", fontSize: "12px" }}>
              © {new Date().getFullYear()} The Serenity Spa Kampala. All rights reserved.
            </div>
          </div>
        </footer>

        {/* ─── CINEMA VIDEO MODAL ─── */}
        {selectedVideo && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              backgroundColor: "rgba(5, 7, 10, 0.95)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={() => setSelectedVideo(null)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "960px",
                backgroundColor: "#12161c",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid rgba(194, 167, 78, 0.4)",
                boxShadow: "0 25px 70px rgba(0, 0, 0, 0.85), 0 0 40px rgba(194, 167, 78, 0.2)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "16px",
                  background: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  color: "#ffffff",
                  fontSize: "18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#c2a74e";
                  e.currentTarget.style.color = "#0e1317";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.6)";
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                ✕
              </button>

              {/* 16:9 Widescreen Responsive Player. Direct media uploads play in a
                  native <video>; YouTube records keep the privacy-enhanced embed. */}
              <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", backgroundColor: "#000" }}>
                {selectedVideo.videoUrl ? (
                  videoError ? (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        padding: "20px",
                        textAlign: "center",
                        color: "#c4cfde",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: "14px" }}>Unable to stream video inline on this browser.</p>
                      <a
                        href={selectedVideo.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: "9px 18px",
                          backgroundColor: "#c2a74e",
                          color: "#0e1317",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        Open Video Directly ↗
                      </a>
                    </div>
                  ) : (
                    <video
                      key={selectedVideo.id}
                      ref={videoRef}
                      src={getPlayableVideoSrc(selectedVideo.videoUrl)}
                      poster={selectedVideo.poster || undefined}
                      title={selectedVideo.title}
                      controls
                      autoPlay
                      playsInline
                      preload="auto"
                      onError={() => setVideoError(true)}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#000",
                        objectFit: "contain",
                      }}
                    />
                  )
                ) : (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={selectedVideo.title}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              {/* Video Info & Booking Bar */}
              <div style={{ padding: "24px 28px", backgroundColor: "#12161c" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px", marginBottom: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span
                        style={{
                          backgroundColor: "rgba(194, 167, 78, 0.15)",
                          color: "#fef08a",
                          border: "1px solid rgba(194, 167, 78, 0.4)",
                          padding: "3px 10px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 800,
                          textTransform: "uppercase",
                        }}
                      >
                        {selectedVideo.categoryLabel}
                      </span>
                      <span style={{ color: "#c2a74e", fontSize: "13px", fontWeight: 700 }}>
                        {selectedVideo.specialist}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
                        {selectedVideo.role}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.6rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                      {selectedVideo.title}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <a
                      href={whatsappLink("Hello Serenity Spa, I just watched the video demonstration of " + selectedVideo.title + " with " + selectedVideo.specialist + ". I would like to inquire about booking this session.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "10px 18px",
                        backgroundColor: "rgba(37, 211, 102, 0.15)",
                        border: "1px solid rgba(37, 211, 102, 0.5)",
                        color: "#25d366",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "7px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <i className="fab fa-whatsapp"></i> WhatsApp Inquiry
                    </a>

                    <Link
                      href={`/booking?service=${encodeURIComponent(selectedVideo.bookingService)}&therapist=${encodeURIComponent(selectedVideo.specialist)}`}
                      style={{
                        padding: "10px 22px",
                        backgroundColor: "#c2a74e",
                        border: "1px solid #ffd700",
                        color: "#0e1317",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 800,
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        boxShadow: "0 4px 15px rgba(194, 167, 78, 0.35)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <i className="fas fa-calendar-check"></i> Book Treatment
                    </Link>
                  </div>
                </div>

                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13.5px", lineHeight: 1.6, margin: 0 }}>
                  {selectedVideo.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- FULLSCREEN PHOTO LIGHTBOX POPUP --- */}
        {selectedIndex !== null && images[selectedIndex] && (() => {
          const selectedImage = images[selectedIndex];
          // Read the SAME admin-controlled record field the gallery card uses - never derive
          // availability from the lightbox position.
          const isLightboxAvailable = isImageAvailable(selectedImage, selectedIndex);
          const lightboxCustomName = getCustomName(selectedImage);
          const specialistName = lightboxCustomName || `Specialist #${selectedIndex + 1}`;

          return (
            <div
              className="gallery-lightbox"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 99999,
                backgroundColor: "rgba(0,0,0,0.96)",
                backdropFilter: "blur(8px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
              onClick={() => setSelectedIndex(null)}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedIndex(null)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "24px",
                  background: "none",
                  border: "none",
                  color: "#c4cfde",
                  fontSize: "2.2rem",
                  cursor: "pointer",
                  lineHeight: 1,
                  zIndex: 10,
                }}
              >
                ×
              </button>

              {/* Prev Button */}
              <button
                className="gallery-lightbox-nav"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
                }}
                style={{
                  position: "absolute",
                  left: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(22,28,34,0.8)",
                  border: "1px solid rgba(194, 167, 78,0.4)",
                  color: "#c2a74e",
                  fontSize: "1.6rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  transition: "all 0.2s ease",
                }}
              >
                ‹
              </button>

              {/* Image */}
              <div
                className="gallery-lightbox-stage"
                style={{
                  maxWidth: "85vw",
                  maxHeight: "72vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  className="gallery-lightbox-img"
                  src={selectedImage.src}
                  alt={selectedImage.alt || "The Serenity Spa"}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "72vh",
                    objectFit: "contain",
                    borderRadius: "8px",
                    border: "1px solid rgba(194, 167, 78,0.3)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                  }}
                />
              </div>

              {/* Next Button */}
              <button
                className="gallery-lightbox-nav"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((selectedIndex + 1) % images.length);
                }}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(22,28,34,0.8)",
                  border: "1px solid rgba(194, 167, 78,0.4)",
                  color: "#c2a74e",
                  fontSize: "1.6rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  transition: "all 0.2s ease",
                }}
              >
                ›
              </button>

              {/* Counter, Availability & Book Action */}
              <div
                style={{
                  marginTop: "16px",
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: "14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {/* Availability Badge */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "3px 10px",
                      borderRadius: "16px",
                      backgroundColor: "rgba(14, 19, 23, 0.85)",
                      border: isLightboxAvailable
                        ? "1px solid rgba(16, 185, 129, 0.5)"
                        : "1px solid rgba(239, 68, 68, 0.45)",
                      color: isLightboxAvailable ? "#34d399" : "#f87171",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        backgroundColor: isLightboxAvailable ? "#10b981" : "#ef4444",
                      }}
                    />
                    {isLightboxAvailable ? "Available Now" : "In Session"}
                  </span>

                  <span style={{ color: "#ffffff", fontWeight: 600 }}>{specialistName}</span>
                  <span style={{ color: "#c2a74e" }}>•</span>
                  <span style={{ color: "#c2a74e", fontWeight: 700 }}>
                    {selectedIndex + 1} / {images.length}
                  </span>
                </div>

                <a
                  href={selectedImage.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: "#c2a74e", fontSize: "12px", textDecoration: "underline" }}
                >
                  Open full image ↗
                </a>

                <button
                  onClick={() => {
                    window.location.href = `/booking?therapist=${encodeURIComponent(specialistName)}`;
                  }}
                  style={{
                    padding: "8px 22px",
                    backgroundColor: "#c2a74e",
                    border: "1px solid #ffd700",
                    color: "#0e1317",
                    borderRadius: "4px",
                    fontSize: "11.5px",
                    fontWeight: 800,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    boxShadow: "0 4px 14px rgba(194, 167, 78, 0.4)",
                  }}
                >
                  <i className="fas fa-calendar-check"></i>
                  <span>{getBookingLabel(selectedImage)}</span>
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        html { scroll-behavior: smooth; }
      `}</style>
    </>
  );
}
