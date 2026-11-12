"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";

/* ─── Real Services ───────────────────────────────────────────── */
const SERVICES = [
  { name: "Swedish Massage", price: 150000 },
  { name: "Body Scrubs", price: 150000 },
  { name: "Sports Massage", price: 150000 },
  { name: "Signature Massage", price: 150000 },
  { name: "Deep Tissue Massage", price: 180000 },
  { name: "Aromatherapy", price: 200000 },
  { name: "Hotstone Massage", price: 200000 },
  { name: "B2B Nuru Massage", price: 200000 },
  { name: "Body Care Package", price: 200000 },
  { name: "Erotic & Body to Body", price: 250000 },
  { name: "Women's Packages", price: 250000 },
  { name: "Couples Massage", price: 250000 },
  { name: "Full Body Massage 90 Mins", price: 250000 },
  { name: "Lomi Lomi Massage", price: 250000 },
  { name: "Four-Hand Massage", price: 300000 },
  { name: "Four-Hand Nuru Massage", price: 350000 },
  { name: "Four-Hand Body to Body", price: 400000 },
  { name: "Four-Hand Full Package", price: 450000 },
  { name: "VIP Four-Hand Full Body", price: 450000 },
  { name: "VIP Body to Body Package", price: 500000 },
  { name: "VIP Full Package", price: 500000 },
  { name: "Executive VIP Session", price: 600000 },
];

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM",
  "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM", "08:00 PM",
  "09:00 PM", "10:00 PM",
];

const WHATSAPP_NUMBER = "256781945510";
const EMAIL = "theserenityspakla@gmail.com";

function formatPrice(p: number) {
  return `UGX ${p.toLocaleString()}`;
}

function getTodayString() {
  const d = new Date();
  d.setDate(d.getDate()); // today
  return d.toISOString().split("T")[0];
}

/* ─── Gold input style ─────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(197, 168, 128, 0.25)",
  borderRadius: "6px",
  padding: "13px 16px",
  color: "#ffffff",
  fontSize: "14px",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.25s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: "#c5a880",
  marginBottom: "7px",
};

/* ─── Component ────────────────────────────────────────────────── */
export default function BookingPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  /* form state */
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  const selectedService = SERVICES.find((s) => s.name === form.service);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function buildWhatsAppMessage() {
    const svc = selectedService;
    const lines = [
      `🌿 *New Booking Request — The Serenity Spa*`,
      ``,
      `👤 Name: ${form.name}`,
      `📞 Phone: ${form.phone}`,
      form.email ? `📧 Email: ${form.email}` : "",
      `💆 Service: ${form.service}${svc ? ` (${formatPrice(svc.price)})` : ""}`,
      `📅 Date: ${form.date}`,
      `🕐 Time: ${form.time}`,
      form.notes ? `📝 Notes: ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    return encodeURIComponent(lines);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.service || !form.date || !form.time) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      /* open WhatsApp */
      const msg = buildWhatsAppMessage();
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    }, 600);
  }

  function resetForm() {
    setSubmitted(false);
    setForm({ name: "", phone: "", email: "", service: "", date: "", time: "", notes: "" });
  }

  /* ─── NAV ────────────────────────────────────────────────────── */
  const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      <CustomCursor />
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9000,
          background: "rgba(14, 19, 23, 0.97)",
          borderBottom: "1px solid rgba(197, 168, 128, 0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
            <img
              src="/assets/logo.jpg"
              alt="Serenity Spa"
              style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(197,168,128,0.5)" }}
            />
            <span
              style={{
                fontFamily: "Cormorant, serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "1.5px",
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.1,
              }}
            >
              <span>SERENITY</span>
              <span style={{ color: "#c5a880", fontSize: "0.75rem", letterSpacing: "3px", fontWeight: 400 }}>SPA</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", gap: "32px", alignItems: "center" }} className="d-none d-lg-flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  color: "#d4d4d4",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/booking"
              style={{
                padding: "9px 20px",
                background: "linear-gradient(135deg, #c5a880, #a8865f)",
                color: "#0e1317",
                borderRadius: "5px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Book Now
            </Link>
          </nav>

          {/* Hamburger */}
          <button
            className="d-lg-none"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            style={{
              background: "transparent",
              border: "1px solid rgba(197,168,128,0.3)",
              borderRadius: "6px",
              padding: "8px 10px",
              cursor: "pointer",
              color: "#c5a880",
            }}
          >
            <span style={{ display: "block", width: "20px", height: "2px", background: "#c5a880", marginBottom: "4px" }} />
            <span style={{ display: "block", width: "20px", height: "2px", background: "#c5a880", marginBottom: "4px" }} />
            <span style={{ display: "block", width: "20px", height: "2px", background: "#c5a880" }} />
          </button>
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────────────────────────── */}
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(170deg, #0a0e12 0%, #0e1317 50%, #111820 100%)",
          paddingTop: "72px",
          paddingBottom: "80px",
        }}
      >
        {/* Hero strip */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(197,168,128,0.08) 0%, transparent 60%)",
            borderBottom: "1px solid rgba(197,168,128,0.1)",
            padding: "60px 24px 50px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* decorative lines */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(197,168,128,0.03) 0px, transparent 1px, transparent 80px)", pointerEvents: "none" }} />

          <p style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "#c5a880", marginBottom: "12px", fontWeight: 600 }}>
            Reserve Your Session
          </p>
          <h1
            style={{
              fontFamily: "Cormorant, serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Book an <span style={{ color: "#c5a880", fontStyle: "italic" }}>Appointment</span>
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "15px", marginTop: "14px", maxWidth: "480px", margin: "14px auto 0" }}>
            Fill the form below and we'll confirm via WhatsApp within minutes.
          </p>
        </div>

        {/* Content area */}
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "60px 24px 0",
            display: "grid",
            gridTemplateColumns: "1fr min(420px, 100%)",
            gap: "48px",
            alignItems: "start",
          }}
          className="booking-grid"
        >
          {/* ── LEFT: FORM ──────────────────────────────────────── */}
          <div>
            {!submitted ? (
              <form onSubmit={handleSubmit} noValidate>
                {/* Card */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(197,168,128,0.15)",
                    borderRadius: "12px",
                    padding: "36px",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "Cormorant, serif",
                      fontSize: "1.5rem",
                      color: "#ffffff",
                      marginBottom: "28px",
                      paddingBottom: "16px",
                      borderBottom: "1px solid rgba(197,168,128,0.12)",
                    }}
                  >
                    Your Details
                  </h2>

                  {/* Name + Phone */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }} className="form-row">
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input
                        style={inputStyle}
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone / WhatsApp *</label>
                      <input
                        style={inputStyle}
                        type="tel"
                        name="phone"
                        placeholder="+256 7XX XXX XXX"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ marginBottom: "18px" }}>
                    <label style={labelStyle}>Email Address</label>
                    <input
                      style={inputStyle}
                      type="email"
                      name="email"
                      placeholder="Optional — for confirmation email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Service */}
                  <div style={{ marginBottom: "18px" }}>
                    <label style={labelStyle}>Service / Package *</label>
                    <select
                      style={{ ...inputStyle, cursor: "pointer" }}
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      required
                    >
                      <option value="">— Select a service —</option>
                      {SERVICES.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name} — {formatPrice(s.price)}
                        </option>
                      ))}
                    </select>
                    {selectedService && (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "8px 12px",
                          background: "rgba(197,168,128,0.1)",
                          borderRadius: "5px",
                          fontSize: "13px",
                          color: "#c5a880",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Session Price</span>
                        <strong>{formatPrice(selectedService.price)}</strong>
                      </div>
                    )}
                  </div>

                  {/* Date + Time */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }} className="form-row">
                    <div>
                      <label style={labelStyle}>Preferred Date *</label>
                      <input
                        style={inputStyle}
                        type="date"
                        name="date"
                        min={getTodayString()}
                        value={form.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Preferred Time *</label>
                      <select
                        style={{ ...inputStyle, cursor: "pointer" }}
                        name="time"
                        value={form.time}
                        onChange={handleChange}
                        required
                      >
                        <option value="">— Select time —</option>
                        {TIME_SLOTS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div style={{ marginBottom: "28px" }}>
                    <label style={labelStyle}>Special Requests / Notes</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                      name="notes"
                      placeholder="Any preferences, allergies, or special requests..."
                      value={form.notes}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "16px",
                      background: loading
                        ? "rgba(197,168,128,0.4)"
                        : "linear-gradient(135deg, #25D366, #128C7E)",
                      border: "none",
                      borderRadius: "7px",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 800,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      transition: "all 0.25s",
                    }}
                  >
                    {loading ? (
                      <>
                        <span
                          style={{
                            display: "inline-block",
                            width: 16,
                            height: 16,
                            border: "2px solid rgba(255,255,255,0.3)",
                            borderTopColor: "#fff",
                            borderRadius: "50%",
                            animation: "spin 0.7s linear infinite",
                          }}
                        />
                        Preparing…
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Confirm via WhatsApp
                      </>
                    )}
                  </button>

                  <p style={{ fontSize: "12px", color: "#6b7280", textAlign: "center", marginTop: "12px" }}>
                    You'll be redirected to WhatsApp with your booking details pre-filled.
                  </p>
                </div>
              </form>
            ) : (
              /* ── SUCCESS STATE ──────────────────────────────── */
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(37, 211, 102, 0.3)",
                  borderRadius: "12px",
                  padding: "48px 36px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "rgba(37,211,102,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: "32px",
                  }}
                >
                  ✓
                </div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "1.8rem", color: "#ffffff", marginBottom: "12px" }}>
                  Booking Request Sent!
                </h2>
                <p style={{ color: "#9ca3af", marginBottom: "24px", lineHeight: 1.6 }}>
                  Your WhatsApp app has opened with your booking details pre-filled. Send the message to confirm your appointment with our team.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "12px 24px",
                      background: "#25D366",
                      borderRadius: "6px",
                      color: "#fff",
                      fontWeight: 700,
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    Open WhatsApp
                  </a>
                  <button
                    onClick={resetForm}
                    style={{
                      padding: "12px 24px",
                      background: "transparent",
                      border: "1px solid rgba(197,168,128,0.4)",
                      borderRadius: "6px",
                      color: "#c5a880",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    Book Another
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: INFO SIDEBAR ─────────────────────────────── */}
          <aside>
            {/* Why Book */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(197,168,128,0.15)",
                borderRadius: "12px",
                padding: "28px",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  fontFamily: "Cormorant, serif",
                  fontSize: "1.25rem",
                  color: "#ffffff",
                  marginBottom: "18px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid rgba(197,168,128,0.12)",
                }}
              >
                Why Book With Us?
              </h3>
              {[
                { icon: "⏱", label: "Quick Confirmation", desc: "We respond via WhatsApp within minutes" },
                { icon: "🌿", label: "Expert Therapists", desc: "Professional & certified spa therapists" },
                { icon: "🔒", label: "Private & Discreet", desc: "100% confidential, luxury environment" },
                { icon: "💳", label: "Flexible Payment", desc: "Pay on arrival — cash or mobile money" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: "14px", marginBottom: "16px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff", marginBottom: "2px" }}>{item.label}</div>
                    <div style={{ fontSize: "12px", color: "#9ca3af" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact block */}
            <div
              style={{
                background: "rgba(197,168,128,0.07)",
                border: "1px solid rgba(197,168,128,0.2)",
                borderRadius: "12px",
                padding: "28px",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.1rem", color: "#c5a880", marginBottom: "16px" }}>
                Contact Us Directly
              </h3>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "10px", color: "#25D366", textDecoration: "none", marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                +256 781 945 510
              </a>
              <a
                href={`mailto:${EMAIL}`}
                style={{ display: "flex", alignItems: "center", gap: "10px", color: "#c5a880", textDecoration: "none", marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                theserenityspakla@gmail.com
              </a>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "#9ca3af", fontSize: "13px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c5a880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}>
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Sir Apollo Kaggwa Rd & Mengo, Kampala, Uganda
              </div>
            </div>

            {/* Hours */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(197,168,128,0.15)",
                borderRadius: "12px",
                padding: "24px 28px",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.1rem", color: "#ffffff", marginBottom: "14px" }}>
                Opening Hours
              </h3>
              {[
                { day: "Monday – Sunday", hours: "9:00 AM – 11:00 PM" },
                { day: "Public Holidays", hours: "Open (call ahead)" },
              ].map((row) => (
                <div
                  key={row.day}
                  style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}
                >
                  <span style={{ color: "#9ca3af" }}>{row.day}</span>
                  <span style={{ color: "#c5a880", fontWeight: 600 }}>{row.hours}</span>
                </div>
              ))}
            </div>

            {/* Map */}
            <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(197,168,128,0.15)" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7573!2d32.5559!3d0.3024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb0f2dbb3b5b%3A0x4b7f8c9d2e6f1a0c!2sSir%20Apollo%20Kaggwa%20Rd%2C%20Kampala%2C%20Uganda!5e0!3m2!1sen!2sug!4v1700000000000!5m2!1sen!2sug"
                width="100%"
                height="200"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Serenity Spa Location"
              />
            </div>
          </aside>
        </div>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer
        style={{
          background: "#080c10",
          borderTop: "1px solid rgba(197,168,128,0.12)",
          padding: "32px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
          © {new Date().getFullYear()} The Serenity Spa — Kampala, Uganda.{" "}
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{ color: "#c5a880", textDecoration: "none" }}>
            Book Now on WhatsApp
          </a>
        </p>
      </footer>

      {/* ── STYLES ───────────────────────────────────────────────── */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        input::placeholder, textarea::placeholder { color: #4b5563; }
        input:focus, select:focus, textarea:focus {
          border-color: rgba(197, 168, 128, 0.6) !important;
          box-shadow: 0 0 0 3px rgba(197, 168, 128, 0.1);
        }
        select option { background: #12171c; color: #ffffff; }

        @media (max-width: 900px) {
          .booking-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
