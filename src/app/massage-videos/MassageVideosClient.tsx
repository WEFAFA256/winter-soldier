"use client";

import React, { useState, useEffect, useRef } from "react";
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

const DEFAULT_VIDEO_POSTER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#13181e"/><stop offset="0.55" stop-color="#080b0e"/><stop offset="1" stop-color="#1d1710"/></linearGradient></defs><rect width="960" height="540" fill="url(#g)"/><circle cx="480" cy="270" r="58" fill="none" stroke="#c2a74e" stroke-width="3"/><path d="M463 242 L512 270 L463 298 Z" fill="#c2a74e"/><text x="480" y="378" fill="#8b7355" font-family="Georgia,serif" font-size="24" text-anchor="middle">SERENITY SPA MASSAGE</text></svg>'
  );

function getPlayableVideoSrc(url: string): string {
  if (!url) return "";
  if (url.includes(".workers.dev/media/")) {
    return `/api/video-stream?url=${encodeURIComponent(url)}`;
  }
  return url;
}

export default function MassageVideosClient({
  initialVideos,
}: {
  initialVideos?: SiteVideo[];
}) {
  const { contact, whatsappLink } = useSiteContact();
  const [videos, setVideos] = useState<SiteVideo[]>(initialVideos ?? []);
  const [loading, setLoading] = useState(initialVideos === undefined);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedVideo, setSelectedVideo] = useState<SiteVideo | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setVideoError(false);
    const el = videoRef.current;
    if (!selectedVideo?.videoUrl || !el) return;
    el.load();
    const playPromise = el.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        el.muted = true;
        el.play().catch(() => {});
      });
    }
  }, [selectedVideo]);

  useEffect(() => {
    const loadVideos = (fresh = false) => {
      const loader = fresh ? fetchSiteContent() : getCachedSiteContent();
      loader
        .then((content: any) => {
          if (content) {
            setVideos(normalizeSiteVideos(content.massageVideos));
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    loadVideos(initialVideos === undefined);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("serenity-content");
      channel.onmessage = () => loadVideos(true);
    } catch {}

    const onStorage = (e: StorageEvent) => {
      if (e.key === "serenity:content-updated") loadVideos(true);
    };
    window.addEventListener("storage", onStorage);

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedVideo(null);
    };
    window.addEventListener("keydown", onEsc);

    return () => {
      try {
        channel?.close();
      } catch {}
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("keydown", onEsc);
    };
  }, [initialVideos]);

  const filteredVideos =
    activeFilter === "all"
      ? videos
      : videos.filter((v) => v.category === activeFilter);

  const filterButtons = VIDEO_CATEGORY_OPTIONS.map((option) => ({
    key: option.value,
    label: option.value === "all" ? "All Massages" : option.label,
  }));

  return (
    <>
      <CustomCursor />
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <style jsx global>{`
        @keyframes livePulseRed {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes playGlowRipple {
          0% { box-shadow: 0 0 0 0 rgba(194, 167, 78, 0.7), 0 0 20px rgba(194, 167, 78, 0.4); }
          70% { box-shadow: 0 0 0 14px rgba(194, 167, 78, 0), 0 0 30px rgba(194, 167, 78, 0.2); }
          100% { box-shadow: 0 0 0 0 rgba(194, 167, 78, 0), 0 0 20px rgba(194, 167, 78, 0); }
        }
        .live-dot-pulse { animation: livePulseRed 1.8s ease-in-out infinite; }
        .video-card-play-btn { animation: playGlowRipple 2.2s infinite; }
        .video-card-box {
          transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.32s ease, box-shadow 0.32s ease;
        }
        .video-card-box:hover {
          transform: translateY(-8px);
          border-color: rgba(194, 167, 78, 0.65) !important;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.75), 0 0 25px rgba(194, 167, 78, 0.25) !important;
        }
        .video-card-box:hover .video-card-poster { transform: scale(1.06); }
        .video-card-poster { transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>

      <div className="page-wrapper" style={{ backgroundColor: "#0e1317", color: "#c4cfde", minHeight: "100vh" }}>
        {/* Header */}
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
                  <li><Link href="/mobile-massage">Mobile Massage</Link></li>
                  <li><Link href="/gallery">Gallery</Link></li>
                  <li><Link href="/blog">Blog</Link></li>
                </ul>
              </nav>

              <div className="main-header__right">
                <Link href="/booking" className="solox-btn main-header__btn">
                  <span>Book Now</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="mobile-nav__btn mobile-nav__toggler"
                  aria-label="Open menu"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                >
                  <span />
                  <span />
                  <span />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Hero */}
        <section
          style={{
            padding: "70px 20px 44px",
            textAlign: "center",
            background: "radial-gradient(circle at top, rgba(194, 167, 78, 0.14), #0a0e12 68%)",
            borderBottom: "1px solid rgba(194, 167, 78, 0.15)",
          }}
        >
          <div className="container" style={{ maxWidth: "780px" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "2.4px",
                textTransform: "uppercase",
                color: "#c2a74e",
                marginBottom: "10px",
              }}
            >
              The Serenity Spa • Mengo, Kampala
            </span>
            <h1
              style={{
                fontFamily: "Cormorant, Georgia, serif",
                fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
                fontWeight: 700,
                color: "#ffffff",
                margin: "0 0 12px",
                lineHeight: 1.1,
              }}
            >
              Watch Our Massages Video
            </h1>
            <p style={{ color: "#9ca3af", fontSize: "15px", lineHeight: 1.7, margin: 0 }}>
              Explore real massage sessions, soothing spa techniques, and treatments from our therapists at The Serenity Spa.
            </p>
          </div>
        </section>

        {/* Videos Grid Section */}
        <section style={{ padding: "56px 0 90px", backgroundColor: "#0a0e12" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "40px" }}>
              {filterButtons.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "30px",
                    border: activeFilter === tab.key ? "1.5px solid #c2a74e" : "1px solid rgba(255,255,255,0.12)",
                    backgroundColor: activeFilter === tab.key ? "#c2a74e" : "rgba(20, 26, 32, 0.7)",
                    color: activeFilter === tab.key ? "#0e1317" : "#d1d5db",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.6px",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    boxShadow: activeFilter === tab.key ? "0 4px 16px rgba(194, 167, 78, 0.35)" : "none",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: "70px 20px", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                Loading massage videos…
              </div>
            ) : videos.length === 0 ? (
              <div
                style={{
                  maxWidth: "560px",
                  margin: "0 auto",
                  padding: "60px 24px",
                  textAlign: "center",
                  backgroundColor: "#13181e",
                  borderRadius: "14px",
                  border: "1px dashed rgba(194, 167, 78, 0.3)",
                }}
              >
                <p style={{ fontSize: 38, margin: "0 0 12px" }}>💆</p>
                <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.9rem", color: "#fff", margin: "0 0 10px" }}>
                  Massage videos coming soon
                </h3>
                <p style={{ color: "#9ca3af", fontSize: 14, margin: "0 0 24px", lineHeight: 1.7 }}>
                  No massage videos have been uploaded yet. In the meantime, explore our signature treatments or book a session directly.
                </p>
                <Link
                  href="/services"
                  style={{
                    display: "inline-block",
                    padding: "11px 24px",
                    backgroundColor: "#c2a74e",
                    color: "#0e1317",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    textDecoration: "none",
                  }}
                >
                  Browse Treatments
                </Link>
              </div>
            ) : filteredVideos.length === 0 ? (
              <div style={{ padding: "70px 20px", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                No massage videos in this category yet.
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
                      aria-label={`Play massage video: ${video.title}`}
                      onKeyDown={(e) => {
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
                      <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", overflow: "hidden", backgroundColor: "#080b0e" }}>
                        {video.poster ? (
                          <img
                            src={video.poster}
                            alt={video.title}
                            className="video-card-poster"
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
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
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
                          />
                        ) : (
                          <img
                            src={video.youtubeId ? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg` : DEFAULT_VIDEO_POSTER}
                            alt={video.title}
                            className="video-card-poster"
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_VIDEO_POSTER; }}
                          />
                        )}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.85) 100%)",
                          }}
                        />

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
                            border: "1px solid rgba(239, 68, 68, 0.5)",
                          }}
                        >
                          <span className="live-dot-pulse" style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
                          <span style={{ color: "#f87171", fontSize: "10px", fontWeight: 800, letterSpacing: "0.7px", textTransform: "uppercase" }}>
                            Massage Film
                          </span>
                        </div>

                        {video.duration && (
                          <div
                            style={{
                              position: "absolute",
                              top: "12px",
                              right: "12px",
                              zIndex: 3,
                              padding: "4px 9px",
                              borderRadius: "6px",
                              backgroundColor: "rgba(0,0,0,0.75)",
                              color: "#fff",
                              fontSize: "11px",
                              fontWeight: 700,
                            }}
                          >
                            {video.duration}
                          </div>
                        )}

                        <div
                          className="video-card-play-btn"
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "58px",
                            height: "58px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(194, 167, 78, 0.94)",
                            color: "#0e1317",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                            zIndex: 3,
                          }}
                        >
                          <i className="fas fa-play" style={{ marginLeft: "3px" }} />
                        </div>
                      </div>

                      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.8px",
                              color: "#c2a74e",
                              backgroundColor: "rgba(194, 167, 78, 0.12)",
                              padding: "3px 9px",
                              borderRadius: "4px",
                            }}
                          >
                            {video.categoryLabel}
                          </span>
                          {video.specialist && (
                            <span style={{ fontSize: "11.5px", color: "#9ca3af" }}>by {video.specialist}</span>
                          )}
                        </div>

                        <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.4rem", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
                          {video.title}
                        </h3>

                        {video.description && (
                          <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.6, margin: "0 0 18px", flex: 1 }}>
                            {video.description}
                          </p>
                        )}

                        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                          <span style={{ color: "#c2a74e", fontSize: "12px", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase" }}>
                            Tap to Watch →
                          </span>
                          <Link
                            href={`/booking?service=${encodeURIComponent(video.bookingService || video.title)}&therapist=${encodeURIComponent(video.specialist)}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              padding: "7px 14px",
                              backgroundColor: "#c2a74e",
                              color: "#0e1317",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.7px",
                              textDecoration: "none",
                            }}
                          >
                            Book Session
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="main-footer background-black">
          <div className="main-footer__bg" style={{ backgroundImage: "url(/assets/images/shapes/footer-bg-1-1.png)" }} />
          <div className="main-footer__bottom">
            <div className="container">
              <div className="main-footer__bottom__inner" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", padding: "24px 0" }}>
                <p className="main-footer__copyright" style={{ margin: 0 }}>
                  &copy; {new Date().getFullYear()} The Serenity Spa • {contact?.address || "Sir Apollo Kaggwa Rd & Mengo, Kampala, Uganda"}
                </p>
                <Link href="/gallery" style={{ color: "#c2a74e", fontSize: "13px", textDecoration: "none" }}>
                  Explore Full Gallery →
                </Link>
              </div>
            </div>
          </div>
        </footer>

        {/* Modal Video Player */}
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
              <button
                onClick={() => setSelectedVideo(null)}
                aria-label="Close video player"
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
                }}
              >
                ✕
              </button>

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
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              <div style={{ padding: "24px 28px", backgroundColor: "#12161c" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px", marginBottom: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
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
                      {selectedVideo.specialist && (
                        <span style={{ color: "#c2a74e", fontSize: "13px", fontWeight: 700 }}>
                          {selectedVideo.specialist}
                        </span>
                      )}
                      {selectedVideo.role && (
                        <>
                          <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
                          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>{selectedVideo.role}</span>
                        </>
                      )}
                    </div>
                    <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.6rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                      {selectedVideo.title}
                    </h3>
                  </div>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <a
                      href={whatsappLink("Hello Serenity Spa, I just watched the massage video \"" + selectedVideo.title + "\". I would like to inquire about booking this session.")}
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
                      }}
                    >
                      <i className="fab fa-whatsapp"></i> WhatsApp Inquiry
                    </a>

                    <Link
                      href={`/booking?service=${encodeURIComponent(selectedVideo.bookingService || selectedVideo.title)}&therapist=${encodeURIComponent(selectedVideo.specialist)}`}
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
                      }}
                    >
                      <i className="fas fa-calendar-check"></i> Book Treatment
                    </Link>
                  </div>
                </div>

                {selectedVideo.description && (
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13.5px", lineHeight: 1.6, margin: 0 }}>
                    {selectedVideo.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
