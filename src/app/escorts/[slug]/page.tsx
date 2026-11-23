"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";
import { useSiteContact } from "@/components/ContactProvider";
import {
  Companion,
  EscortVideo,
  companionGallery,
  companionVideos,
  findCompanion,
} from "@/lib/escorts";

const SCRIPT = '"Alex Brush", cursive';
const SERIF = '"Cormorant", serif';
const GOLD = "#c2a74e";
const CREAM = "#e8d9b0";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "VIP Packages", href: "/vip-packages" },
  { label: "Mobile Massage", href: "/mobile-massage" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Escorts", href: "/escorts" },
];

function SectionHeading({ tagline, title }: { tagline: string; title: string }) {
  return (
    <div className="sec-title" style={{ textAlign: "center", marginBottom: "40px" }}>
      <span style={{ display: "block", fontFamily: SCRIPT, fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: GOLD, lineHeight: 1.1, marginBottom: "6px" }}>
        {tagline}
      </span>
      <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "#fff", margin: 0, lineHeight: 1.2 }}>
        {title}
      </h2>
    </div>
  );
}

export default function EscortProfilePage() {
  const params = useParams<{ slug: string }>();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || "";

  const [companions, setCompanions] = useState<Companion[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<EscortVideo | null>(null);
  const { whatsappLink } = useSiteContact();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/content?cb=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.escorts) && !cancelled) setCompanions(data.escorts);
        }
      } catch {
        // R2-backed store unavailable; keep the empty state.
      }

      try {
        const res = await fetch(`/api/gallery?cb=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const urls = (Array.isArray(data) ? data : [])
            .map((item: any) => (typeof item === "string" ? item : item?.src))
            .filter((u: unknown): u is string => typeof u === "string" && u.trim() !== "");
          if (urls.length && !cancelled) setPhotos(urls);
        }
      } catch {
        // keep photos empty
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const companion = findCompanion(companions, slug);
  const companionIndex = companion ? companions.indexOf(companion) : 0;
  const gallery = companion ? companionGallery(companion, photos, companionIndex) : [];
  const videos = companion ? companionVideos(companion, companionIndex) : [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
        setSelectedVideo(null);
      }
      if (selectedPhoto !== null && gallery.length) {
        if (e.key === "ArrowLeft") setSelectedPhoto((p) => (p !== null ? (p - 1 + gallery.length) % gallery.length : null));
        if (e.key === "ArrowRight") setSelectedPhoto((p) => (p !== null ? (p + 1) % gallery.length : null));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedPhoto, gallery.length]);

  const isAvailable = companion?.availability === "available";
  const displayName = companion?.name || "Companion";
  const description = companion?.description?.trim()
    ? companion.description
    : `${displayName} is one of The Serenity Spa's curated Kampala companions, selected for warmth, discretion, and effortless conversation. Enquire privately for availability, rates, and arrangements.`;

  return (
    <>
      <CustomCursor />
      <style jsx global>{`
        .ep-card { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, box-shadow 0.35s ease; }
        .ep-card:hover { transform: translateY(-6px); border-color: rgba(194,167,78,0.6) !important; }
        .ep-photo { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .ep-card:hover .ep-photo { transform: scale(1.07); }
        .ep-gallery-card:focus-visible,
        .ep-video-card:focus-visible,
        .mobile-nav__toggler:focus-visible { outline: 2px solid #c2a74e; outline-offset: 3px; }
        .ep-lightbox { padding: 0 !important; }
        .ep-lightbox-stage,
        .ep-lightbox-img {
          max-width: 100vw !important;
          max-height: 100dvh !important;
          width: 100vw !important;
          height: 100dvh !important;
          border-radius: 0 !important;
          border: none !important;
        }
        .ep-lightbox-img { object-fit: contain !important; }
        @media (max-width: 575px) {
          .ep-gallery-img { height: 180px !important; }
          .ep-video-poster { height: 150px !important; }
        }
      `}</style>

      <div style={{ backgroundColor: "#0e1317", color: "#c4cfde", minHeight: "100vh", overflowX: "hidden" }}>
        <header className="main-header main-header--two sticky-header sticky-header--normal">
          <div className="container-fluid">
            <div className="main-header__inner">
              <div className="main-header__logo">
                <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                  <img src="/assets/logo.jpg" alt="The Serenity Spa" style={{ height: "52px", width: "52px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(194,167,78,0.6)", display: "block" }} />
                </Link>
              </div>
              <nav className="main-header__nav main-menu">
                <ul className="main-menu__list">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href} className={item.href === "/escorts" ? "current" : ""}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="main-header__right">
                <div className="mobile-nav__btn mobile-nav__toggler" onClick={() => setMobileMenuOpen(true)} style={{ cursor: "pointer" }}>
                  <span></span><span></span><span></span>
                </div>
                <Link href="/booking" className="solox-btn main-header__btn"><span>Book now</span></Link>
              </div>
            </div>
          </div>
          <MobileDrawer isOpen={mobileMenuOpen} onClose={() => { setMobileMenuOpen(false); document.body.classList.remove("locked"); }} />
        </header>

        {loading ? (
          <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
            <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}><span className="visually-hidden">Loading profile...</span></div>
            <p style={{ color: "#9ca3af" }}>Loading profile...</p>
          </div>
        ) : !companion ? (
          <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "18px", textAlign: "center", padding: "140px 20px 80px" }}>
            <h1 style={{ fontFamily: SERIF, fontSize: "2.4rem", color: "#fff", margin: 0 }}>Profile not found</h1>
            <p style={{ color: "#9ca3af" }}>That companion is not currently listed. Browse the full escort directory instead.</p>
            <Link href="/escorts" style={{ padding: "12px 26px", background: GOLD, color: "#0e1317", fontWeight: 800, textDecoration: "none", borderRadius: "4px" }}>Back to Companions</Link>
          </div>
        ) : (
          <>
            {/* HERO */}
            <div style={{ position: "relative", minHeight: "520px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "150px 20px 80px" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: `url("${companion.image}")`, backgroundSize: "cover", backgroundPosition: "center 25%", filter: "brightness(0.42)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(14,19,23,0.55) 0%, rgba(14,19,23,0.92) 100%)" }} />
              <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "820px" }}>
                <nav style={{ fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "22px" }}>
                  <Link href="/" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Home</Link>
                  <span style={{ margin: "0 8px", color: GOLD }}>/</span>
                  <Link href="/escorts" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Escorts</Link>
                  <span style={{ margin: "0 8px", color: GOLD }}>/</span>
                  <span style={{ color: GOLD }}>{displayName}</span>
                </nav>
                <span style={{ fontFamily: SCRIPT, fontSize: "clamp(2rem, 4vw, 2.8rem)", color: GOLD, display: "block", lineHeight: 1.1 }}>Meet {displayName}</span>
                <h1 style={{ fontFamily: SERIF, fontSize: "clamp(2.4rem, 7vw, 4.6rem)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#fff", margin: "8px 0 14px", lineHeight: 1.1 }}>
                  {companion.title || "Elite Companion"}
                </h1>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ padding: "6px 16px", borderRadius: "20px", border: "1px solid rgba(194,167,78,0.35)", color: GOLD, fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                    {companion.specialty}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "6px 16px", borderRadius: "20px", background: "rgba(10,14,18,0.8)", border: `1px solid ${isAvailable ? "rgba(16,185,129,0.5)" : "rgba(239,68,68,0.45)"}`, fontSize: "11px", fontWeight: 700, color: isAvailable ? "#34d399" : "#f87171", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: isAvailable ? "#10b981" : "#ef4444" }} />
                    {isAvailable ? "Available" : "Engaged"}
                  </span>
                </div>
              </div>
            </div>

            {/* INFO */}
            <section style={{ padding: "70px 0 30px" }}>
              <div className="container">
                <SectionHeading tagline="A Little About Her" title={`${displayName}'s Profile`} />
                <div style={{ maxWidth: "820px", margin: "0 auto", textAlign: "center" }}>
                  <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(1.1rem, 2.4vw, 1.4rem)", lineHeight: 1.8, color: "rgba(232,217,176,0.88)", margin: "0 0 26px" }}>
                    {description}
                  </p>
                  <div className="row g-3" style={{ justifyContent: "center" }}>
                    {[
                      { icon: "fa-gem", label: "Profile", value: companion.title || "Elite Companion" },
                      { icon: "fa-star", label: "Speciality", value: companion.specialty || "Companionship" },
                      { icon: "fa-map-marker-alt", label: "Location", value: "Kampala, Uganda" },
                    ].map((f) => (
                      <div key={f.label} className="col-6 col-md-4">
                        <div className="ep-card" style={{ padding: "20px 14px", borderRadius: "10px", background: "linear-gradient(160deg,#161c22,#1a2130)", border: "1px solid rgba(194,167,78,0.2)", height: "100%" }}>
                          <i className={`fas ${f.icon}`} style={{ color: GOLD, fontSize: "18px", marginBottom: "10px" }} />
                          <div style={{ fontSize: "10px", letterSpacing: "1.4px", textTransform: "uppercase", color: "rgba(196,207,222,0.5)", marginBottom: "6px" }}>{f.label}</div>
                          <div style={{ color: CREAM, fontSize: "14px", fontWeight: 700 }}>{f.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* GALLERY */}
            <section style={{ padding: "60px 0 50px", borderTop: "1px solid rgba(194,167,78,0.12)" }}>
              <div className="container">
                <SectionHeading tagline="Her Gallery" title={`Photos of ${displayName}`} />
                <div className="row g-3">
                  {gallery.map((src, i) => (
                    <div key={`${src}-${i}`} className="col-6 col-md-4 col-lg-3">
                      <div
                        className="ep-gallery-card ep-card"
                        role="button"
                        tabIndex={0}
                        aria-label={`View full-size photo ${i + 1} of ${displayName}`}
                        onClick={() => setSelectedPhoto(i)}
                        onKeyDown={(e) => {
                          if (e.target !== e.currentTarget) return;
                          if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); setSelectedPhoto(i); }
                        }}
                        style={{ position: "relative", height: "300px", borderRadius: "10px", overflow: "hidden", cursor: "pointer", border: "1px solid rgba(194,167,78,0.22)", background: "#161c22" }}
                      >
                        <img src={src} alt={`${displayName} photo ${i + 1}`} loading="lazy" className="ep-photo ep-gallery-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).src = "/assets/service1.jpg"; }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 55%,rgba(0,0,0,0.7) 100%)", pointerEvents: "none" }} />
                        <span style={{ position: "absolute", bottom: "12px", right: "14px", color: GOLD, fontSize: "18px" }}>⤢</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* VIDEOS */}
            <section style={{ padding: "60px 0 80px", background: "#0a0e12", borderTop: "1px solid rgba(194,167,78,0.12)" }}>
              <div className="container">
                <SectionHeading tagline="Her Videos" title={`Watch ${displayName}`} />
                <div className="row g-4">
                  {videos.map((video, i) => (
                    <div key={`${video.youtubeId}-${i}`} className="col-12 col-md-6 col-lg-4">
                      <div
                        className="ep-video-card ep-card"
                        role="button"
                        tabIndex={0}
                        aria-label={`Play ${video.title}`}
                        onClick={() => setSelectedVideo(video)}
                        onKeyDown={(e) => {
                          if (e.target !== e.currentTarget) return;
                          if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); setSelectedVideo(video); }
                        }}
                        style={{ borderRadius: "12px", overflow: "hidden", cursor: "pointer", background: "#161c22", border: "1px solid rgba(194,167,78,0.22)", height: "100%" }}
                      >
                        <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
                          <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                            alt={video.title}
                            loading="lazy"
                            className="ep-photo ep-video-poster"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(14,19,23,0.35)" }}>
                            <span style={{ width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: GOLD, color: "#0e1317", fontSize: "22px" }}>▶</span>
                          </div>
                        </div>
                        <div style={{ padding: "18px 18px 22px" }}>
                          <div style={{ fontFamily: SERIF, fontSize: "1.25rem", fontWeight: 700, color: CREAM, marginBottom: "8px" }}>{video.title}</div>
                          <span style={{ fontSize: "10px", letterSpacing: "1.2px", textTransform: "uppercase", color: GOLD }}>Watch video</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section style={{ padding: "80px 24px", textAlign: "center", borderTop: "1px solid rgba(194,167,78,0.14)" }}>
              <span style={{ fontFamily: SCRIPT, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: GOLD, display: "block", marginBottom: "8px" }}>Arrange a Private Meeting</span>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#fff", textTransform: "uppercase", margin: "0 0 24px" }}>Enquire About {displayName}</h2>
              <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={whatsappLink(`Hello, I'd like to enquire about ${displayName} at The Serenity Spa.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 30px", background: GOLD, color: "#0e1317", borderRadius: "4px", textDecoration: "none", fontWeight: 800, fontSize: "11px", letterSpacing: "1.2px", textTransform: "uppercase" }}
                >
                  <i className="fab fa-whatsapp" /> WhatsApp Enquiry
                </a>
                <Link href={`/booking?therapist=${encodeURIComponent(displayName)}`} style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 30px", background: "transparent", color: GOLD, borderRadius: "4px", border: `1.5px solid rgba(194,167,78,0.55)`, textDecoration: "none", fontWeight: 700, fontSize: "11px", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                  <i className="fas fa-calendar-alt" /> Book Online
                </Link>
              </div>
              <div style={{ marginTop: "28px" }}>
                <Link href="/escorts" style={{ color: "rgba(196,207,222,0.65)", fontSize: "12px", textDecoration: "none" }}>← View all companions</Link>
              </div>
            </section>

            <footer style={{ padding: "42px 24px 32px", background: "#0a0e12", borderTop: "1px solid rgba(194,167,78,0.12)", textAlign: "center" }}>
              <img src="/assets/logo.jpg" alt="The Serenity Spa" style={{ height: "42px", width: "42px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(194,167,78,0.4)" }} />
              <p style={{ color: "rgba(194,167,78,0.8)", fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", margin: "12px 0 16px" }}>The Serenity Spa</p>
              <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
                {NAV_ITEMS.map((item) => (
                  <Link key={item.href} href={item.href} style={{ color: "rgba(196,207,222,0.6)", fontSize: "11px", textDecoration: "none" }}>{item.label}</Link>
                ))}
              </div>
              <p style={{ color: "rgba(196,207,222,0.4)", fontSize: "11px", marginTop: "16px" }}>All engagements are strictly confidential. Adults only. Kampala, Uganda.</p>
            </footer>
          </>
        )}

        {/* FULL-SCREEN PHOTO VIEWER */}
        {selectedPhoto !== null && gallery[selectedPhoto] && (
          <div
            className="ep-lightbox"
            style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.97)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
            onClick={() => setSelectedPhoto(null)}
          >
            <button onClick={() => setSelectedPhoto(null)} aria-label="Close photo" style={{ position: "absolute", top: "18px", right: "22px", background: "none", border: "none", color: "#c4cfde", fontSize: "2.2rem", zIndex: 10, cursor: "pointer" }}>×</button>
            <button aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setSelectedPhoto((selectedPhoto - 1 + gallery.length) % gallery.length); }} style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", width: "48px", height: "48px", borderRadius: "50%", background: "rgba(22,28,34,0.8)", border: "1px solid rgba(194,167,78,0.4)", color: GOLD, fontSize: "22px", zIndex: 10, cursor: "pointer" }}>‹</button>
            <div className="ep-lightbox-stage" style={{ maxWidth: "88vw", maxHeight: "78vh", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={(e) => e.stopPropagation()}>
              <img className="ep-lightbox-img" src={gallery[selectedPhoto]} alt={`${displayName} photo ${selectedPhoto + 1}`} style={{ maxWidth: "100%", maxHeight: "78vh", objectFit: "contain" }} />
            </div>
            <button aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setSelectedPhoto((selectedPhoto + 1) % gallery.length); }} style={{ position: "absolute", right: "18px", top: "50%", transform: "translateY(-50%)", width: "48px", height: "48px", borderRadius: "50%", background: "rgba(22,28,34,0.8)", border: "1px solid rgba(194,167,78,0.4)", color: GOLD, fontSize: "22px", zIndex: 10, cursor: "pointer" }}>›</button>
            <div style={{ position: "absolute", bottom: "18px", color: "#fff", fontSize: "13px", zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
              {selectedPhoto + 1} / {gallery.length} · {displayName}
              <a href={gallery[selectedPhoto]} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: "10px", color: GOLD, fontSize: "12px" }}>Open full image ↗</a>
            </div>
          </div>
        )}

        {/* VIDEO MODAL */}
        {selectedVideo && (
          <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setSelectedVideo(null)}>
            <button onClick={() => setSelectedVideo(null)} aria-label="Close video" style={{ position: "absolute", top: "18px", right: "22px", background: "none", border: "none", color: "#c4cfde", fontSize: "2.2rem", zIndex: 10, cursor: "pointer" }}>×</button>
            <div style={{ width: "min(900px, 94vw)", maxWidth: "900px" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "#000", borderRadius: "8px", overflow: "hidden" }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                />
              </div>
              <p style={{ color: CREAM, fontFamily: SERIF, fontSize: "1.2rem", textAlign: "center", marginTop: "14px" }}>{selectedVideo.title}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
