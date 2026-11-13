"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";
import QRCode from "qrcode";

/* ─── Real Services Catalog ───────────────────────────────────────────── */
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

function formatPrice(p: number | string) {
  const num = typeof p === "number" ? p : parseInt(String(p).replace(/\D/g, ""), 10);
  return isNaN(num) ? String(p) : `UGX ${num.toLocaleString()}`;
}

function getTodayString() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function generateBookingId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SSP-${ts}-${rand}`;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(197, 168, 128, 0.25)",
  borderRadius: "8px",
  padding: "13px 16px",
  color: "#ffffff",
  fontSize: "14px",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.25s, box-shadow 0.25s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: "#c5a880",
  marginBottom: "8px",
};

function BookingFormInner() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || searchParams.get("serviceName") || "";

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingSummary, setBookingSummary] = useState<{
    id: string;
    name: string;
    phone: string;
    email: string;
    service: string;
    price: number;
    date: string;
    time: string;
    notes: string;
  } | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: initialService,
    date: "",
    time: "",
    notes: "",
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync service from URL if provided
  useEffect(() => {
    if (initialService) {
      setForm((prev) => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  const selectedService = SERVICES.find(
    (s) => s.name.toLowerCase() === form.service.toLowerCase()
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.service || !form.date || !form.time) {
      alert("Please fill in all required fields (Name, Phone, Service, Date, Time).");
      return;
    }

    const price = selectedService ? selectedService.price : 150000;
    const newId = generateBookingId();

    const summary = {
      id: newId,
      name: form.name,
      phone: form.phone,
      email: form.email,
      service: form.service,
      price: price,
      date: form.date,
      time: form.time,
      notes: form.notes,
    };

    setBookingSummary(summary);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Generate QR Code onto canvas once submitted
  useEffect(() => {
    if (submitted && bookingSummary && canvasRef.current) {
      const qrData = [
        `THE SERENITY SPA KAMPALA`,
        `BOOKING CONFIRMATION`,
        `Booking ID: ${bookingSummary.id}`,
        `Client: ${bookingSummary.name}`,
        `Phone: ${bookingSummary.phone}`,
        `Service: ${bookingSummary.service}`,
        `Amount: UGX ${bookingSummary.price.toLocaleString()}`,
        `Date: ${bookingSummary.date}`,
        `Time: ${bookingSummary.time}`,
        `Payment: Pay at Venue / Cash / MoMo`,
      ].join("\n");

      QRCode.toCanvas(
        canvasRef.current,
        qrData,
        {
          width: 220,
          margin: 1,
          color: {
            dark: "#0e1317",
            light: "#ffffff",
          },
        },
        (error) => {
          if (error) console.error("QR Code generation error:", error);
        }
      );
    }
  }, [submitted, bookingSummary]);

  function downloadQRCode() {
    if (!canvasRef.current || !bookingSummary) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.download = `serenity-spa-booking-${bookingSummary.id}.png`;
    a.href = url;
    a.click();
  }

  function openWhatsAppWithSummary() {
    if (!bookingSummary) return;
    const lines = [
      `🌿 *Booking Confirmation — The Serenity Spa*`,
      ``,
      `🔖 *Booking ID:* ${bookingSummary.id}`,
      `👤 *Client:* ${bookingSummary.name}`,
      `📞 *Phone:* ${bookingSummary.phone}`,
      bookingSummary.email ? `📧 *Email:* ${bookingSummary.email}` : "",
      `💆 *Service:* ${bookingSummary.service}`,
      `💰 *Amount:* ${formatPrice(bookingSummary.price)}`,
      `📅 *Date:* ${bookingSummary.date}`,
      `🕐 *Time:* ${bookingSummary.time}`,
      bookingSummary.notes ? `📝 *Notes:* ${bookingSummary.notes}` : "",
      ``,
      `_I have completed my reservation on the website and will present my QR confirmation pass._`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`, "_blank");
  }

  function resetBooking() {
    setSubmitted(false);
    setBookingSummary(null);
    setForm({ name: "", phone: "", email: "", service: "", date: "", time: "", notes: "" });
  }

  return (
    <>
      <CustomCursor />
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* ── HEADER ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9000,
          background: "rgba(14, 19, 23, 0.98)",
          borderBottom: "1px solid rgba(197, 168, 128, 0.18)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 20px",
            height: "76px",
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
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(197,168,128,0.6)",
                display: "block",
              }}
            />
            <span
              style={{
                fontFamily: "Cormorant, serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "1.5px",
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.1,
              }}
            >
              <span>THE SERENITY</span>
              <span style={{ color: "#c5a880", fontSize: "0.72rem", letterSpacing: "3px", fontWeight: 400 }}>SPA KAMPALA</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", gap: "30px", alignItems: "center" }} className="d-none d-xl-flex">
            {[
              { label: "Home", href: "/" },
              { label: "Services & Packages", href: "/services" },
              { label: "Gallery", href: "/gallery" },
              { label: "Book Appointment", href: "/booking" },
              { label: "Blog", href: "/blog" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  color: l.href === "/booking" ? "#c5a880" : "#d4d4d4",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Header right */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="serenity-gold-btn"
              style={{
                padding: "8px 16px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
              }}
            >
              <i className="fab fa-whatsapp" style={{ fontSize: "15px" }}></i>
              <span className="d-none d-sm-inline">WhatsApp</span>
            </a>

            <div
              className="mobile-nav__btn mobile-nav__toggler d-xl-none"
              onClick={() => setDrawerOpen(true)}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "5px",
                padding: "8px 10px",
                background: "rgba(197, 168, 128, 0.1)",
                border: "1px solid rgba(197, 168, 128, 0.35)",
                borderRadius: "6px",
              }}
              aria-label="Toggle navigation menu"
            >
              <span style={{ width: "22px", height: "2px", backgroundColor: "#c5a880", display: "block" }}></span>
              <span style={{ width: "22px", height: "2px", backgroundColor: "#c5a880", display: "block" }}></span>
              <span style={{ width: "22px", height: "2px", backgroundColor: "#c5a880", display: "block" }}></span>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(175deg, #0a0e12 0%, #0e1317 40%, #111820 100%)",
          paddingTop: "76px",
          paddingBottom: "80px",
        }}
      >
        {/* Compact Title Section */}
        <div
          style={{
            padding: "44px 20px 24px",
            textAlign: "center",
            borderBottom: "1px solid rgba(197,168,128,0.12)",
            background: "linear-gradient(180deg, rgba(197,168,128,0.05) 0%, transparent 100%)",
          }}
        >
          <span style={{ color: "#c5a880", fontFamily: "Alex Brush, cursive", fontSize: "2.2rem", display: "block", marginBottom: "4px" }}>
            Instant Reservation
          </span>
          <h1
            style={{
              fontFamily: "Cormorant, serif",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 700,
              color: "#ffffff",
              margin: 0,
            }}
          >
            Book an <span style={{ color: "#c5a880", fontStyle: "italic" }}>Appointment</span>
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "8px", maxWidth: "560px", margin: "8px auto 0", lineHeight: 1.6 }}>
            {submitted
              ? "Your reservation pass is generated below with your verification QR code."
              : "Complete the reservation form below to receive your QR verification pass to present on arrival."}
          </p>
        </div>

        {/* Form or Summary Container */}
        <div style={{ maxWidth: "1120px", margin: "40px auto 0", padding: "0 20px" }}>
          {!submitted ? (
            /* ── BOOKING FORM ── */
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr min(380px, 100%)",
                gap: "40px",
                alignItems: "start",
              }}
              className="booking-grid"
            >
              {/* Form Card */}
              <div
                style={{
                  backgroundColor: "#161c22",
                  borderRadius: "14px",
                  padding: "36px",
                  border: "1px solid rgba(197,168,128,0.22)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "Cormorant, serif",
                    fontSize: "1.6rem",
                    color: "#ffffff",
                    marginBottom: "24px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid rgba(197,168,128,0.15)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <i className="fas fa-calendar-check" style={{ color: "#c5a880", fontSize: "1.2rem" }}></i>
                  Reservation Details
                </h2>

                <form onSubmit={handleSubmit}>
                  {/* Name + Phone */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }} className="form-row">
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
                      <label style={labelStyle}>Phone Number *</label>
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
                    <label style={labelStyle}>Email Address (Optional)</label>
                    <input
                      style={inputStyle}
                      type="email"
                      name="email"
                      placeholder="For your confirmation receipt"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Service Selection */}
                  <div style={{ marginBottom: "18px" }}>
                    <label style={labelStyle}>Treatment / Package *</label>
                    <select
                      style={{ ...inputStyle, cursor: "pointer" }}
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      required
                    >
                      <option value="">— Select a Treatment —</option>
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
                          padding: "8px 14px",
                          backgroundColor: "rgba(197,168,128,0.12)",
                          borderRadius: "6px",
                          fontSize: "13px",
                          color: "#c5a880",
                          display: "flex",
                          justifyContent: "space-between",
                          border: "1px solid rgba(197,168,128,0.25)",
                        }}
                      >
                        <span>Selected Treatment Fee</span>
                        <strong>{formatPrice(selectedService.price)}</strong>
                      </div>
                    )}
                  </div>

                  {/* Date + Time */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }} className="form-row">
                    <div>
                      <label style={labelStyle}>Appointment Date *</label>
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
                      <label style={labelStyle}>Appointment Time *</label>
                      <select
                        style={{ ...inputStyle, cursor: "pointer" }}
                        name="time"
                        value={form.time}
                        onChange={handleChange}
                        required
                      >
                        <option value="">— Select Time —</option>
                        {TIME_SLOTS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div style={{ marginBottom: "26px" }}>
                    <label style={labelStyle}>Special Requests / Allergies</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: "85px", resize: "vertical" }}
                      name="notes"
                      placeholder="Preferences, focus areas (shoulders, lower back), or specific requests..."
                      value={form.notes}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="serenity-gold-btn"
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 800,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <i className="fas fa-qrcode" style={{ fontSize: "16px" }}></i>
                    Generate Booking &amp; QR Pass
                  </button>

                  <p style={{ fontSize: "12px", color: "#6b7280", textAlign: "center", marginTop: "12px", margin: "12px 0 0" }}>
                    Instant reservation • Pay at venue (Cash / Mobile Money / Card) • No prepayment required
                  </p>
                </form>
              </div>

              {/* Sidebar Info */}
              <div>
                <div
                  style={{
                    backgroundColor: "#161c22",
                    borderRadius: "14px",
                    padding: "26px",
                    border: "1px solid rgba(197,168,128,0.2)",
                    marginBottom: "20px",
                  }}
                >
                  <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.3rem", color: "#fff", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid rgba(197,168,128,0.12)" }}>
                    How It Works
                  </h3>
                  {[
                    { step: "1", title: "Fill Details", desc: "Choose your therapy, date and preferred time slot." },
                    { step: "2", title: "Receive QR Pass", desc: "Get an instant verifiable booking pass with your unique ID." },
                    { step: "3", title: "Present On Arrival", desc: "Show your pass to the reception concierge and enjoy." },
                  ].map((s) => (
                    <div key={s.step} style={{ display: "flex", gap: "14px", marginBottom: "16px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "#c5a880",
                          color: "#0e1317",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "13px",
                          flexShrink: 0,
                        }}
                      >
                        {s.step}
                      </div>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: "13px" }}>{s.title}</div>
                        <div style={{ color: "#9ca3af", fontSize: "12px", lineHeight: 1.4 }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(197,168,128,0.06)",
                    borderRadius: "14px",
                    padding: "24px",
                    border: "1px solid rgba(197,168,128,0.22)",
                  }}
                >
                  <h4 style={{ fontFamily: "Cormorant, serif", fontSize: "1.2rem", color: "#c5a880", margin: "0 0 10px 0" }}>
                    Prefer WhatsApp Direct?
                  </h4>
                  <p style={{ color: "#c4cfde", fontSize: "12px", lineHeight: 1.5, margin: "0 0 14px 0" }}>
                    Speak directly with our front-desk therapist right now for immediate confirmation or custom requests.
                  </p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "12px",
                      borderRadius: "6px",
                      backgroundColor: "#25D366",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "13px",
                      textDecoration: "none",
                    }}
                  >
                    <i className="fab fa-whatsapp" style={{ fontSize: "16px" }}></i>
                    Book via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* ── BOOKING CONFIRMATION SUMMARY + VERIFIABLE QR CODE ── */
            bookingSummary && (
              <div
                style={{
                  maxWidth: "760px",
                  margin: "0 auto",
                  backgroundColor: "#161c22",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid rgba(197,168,128,0.35)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                  animation: "cardFloatIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
                }}
              >
                {/* Header Banner */}
                <div
                  style={{
                    backgroundColor: "#11161b",
                    padding: "28px",
                    textAlign: "center",
                    borderBottom: "1px solid rgba(197,168,128,0.18)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(37,211,102,0.15)",
                      border: "2px solid #25D366",
                      color: "#25D366",
                      fontSize: "26px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                    }}
                  >
                    ✓
                  </div>
                  <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "2rem", color: "#ffffff", margin: "0 0 6px 0", fontWeight: 700 }}>
                    Booking Confirmed!
                  </h2>
                  <p style={{ color: "#c5a880", fontSize: "13px", margin: 0, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700 }}>
                    Pass #{bookingSummary.id}
                  </p>
                </div>

                {/* Body: QR Code & Summary Details */}
                <div style={{ padding: "36px 30px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      gap: "32px",
                      alignItems: "center",
                      marginBottom: "30px",
                    }}
                    className="summary-split"
                  >
                    {/* QR Code Canvas Card */}
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        padding: "16px",
                        borderRadius: "12px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <canvas ref={canvasRef} style={{ display: "block" }}></canvas>
                      <span style={{ color: "#0e1317", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", marginTop: "8px", textTransform: "uppercase" }}>
                        Present at Reception
                      </span>
                    </div>

                    {/* Summary Details */}
                    <div
                      style={{
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(197,168,128,0.18)",
                        borderRadius: "12px",
                        padding: "22px 24px",
                      }}
                    >
                      <div style={{ display: "grid", gap: "10px", fontSize: "13px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                          <span style={{ color: "#9ca3af" }}>Booking Pass ID:</span>
                          <strong style={{ color: "#c5a880" }}>{bookingSummary.id}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                          <span style={{ color: "#9ca3af" }}>Client Name:</span>
                          <strong style={{ color: "#ffffff" }}>{bookingSummary.name}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                          <span style={{ color: "#9ca3af" }}>Phone:</span>
                          <strong style={{ color: "#ffffff" }}>{bookingSummary.phone}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                          <span style={{ color: "#9ca3af" }}>Therapy / Package:</span>
                          <strong style={{ color: "#c5a880" }}>{bookingSummary.service}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                          <span style={{ color: "#9ca3af" }}>Total Amount:</span>
                          <strong style={{ color: "#25D366", fontSize: "14px" }}>{formatPrice(bookingSummary.price)}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                          <span style={{ color: "#9ca3af" }}>Date &amp; Time:</span>
                          <strong style={{ color: "#ffffff" }}>{bookingSummary.date} at {bookingSummary.time}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#9ca3af" }}>Payment Status:</span>
                          <span style={{ color: "#f59e0b", fontWeight: 700, backgroundColor: "rgba(245,158,11,0.12)", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>
                            Pay at Venue (Cash / MoMo)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Download QR Pass, Send to WhatsApp, or New Booking */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }} className="action-row">
                    <button
                      onClick={downloadQRCode}
                      className="serenity-gold-btn"
                      style={{
                        padding: "14px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <i className="fas fa-download"></i> Save / Download QR Pass
                    </button>

                    <button
                      onClick={openWhatsAppWithSummary}
                      style={{
                        padding: "14px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        backgroundColor: "#25D366",
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      <i className="fab fa-whatsapp" style={{ fontSize: "16px" }}></i>
                      Send Copy to WhatsApp
                    </button>
                  </div>

                  <div style={{ textAlign: "center", marginTop: "16px" }}>
                    <button
                      onClick={resetBooking}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#9ca3af",
                        fontSize: "13px",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      Make Another Booking
                    </button>
                  </div>

                  <div
                    style={{
                      marginTop: "24px",
                      padding: "14px",
                      backgroundColor: "rgba(197,168,128,0.06)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "#9ca3af",
                      textAlign: "center",
                      border: "1px solid rgba(197,168,128,0.15)",
                    }}
                  >
                    📍 Please present this pass on your phone at reception (Sir Apollo Kaggwa Rd or Mengo). Please arrive 10 minutes before your scheduled appointment.
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "#080c10",
          borderTop: "1px solid rgba(197,168,128,0.12)",
          padding: "32px 20px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
          © {new Date().getFullYear()} The Serenity Spa — Kampala, Uganda. All Rights Reserved.
        </p>
      </footer>

      {/* ── STYLES ── */}
      <style>{`
        @keyframes cardFloatIn {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        input::placeholder, textarea::placeholder { color: #525f70; }
        input:focus, select:focus, textarea:focus {
          border-color: rgba(197, 168, 128, 0.65) !important;
          box-shadow: 0 0 0 3px rgba(197, 168, 128, 0.12);
        }
        select option { background: #161c22; color: #ffffff; }

        @media (max-width: 900px) {
          .booking-grid {
            grid-template-columns: 1fr !important;
          }
          .summary-split {
            grid-template-columns: 1fr !important;
            justify-items: center;
          }
          .action-row {
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

export default function BookingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#0e1317", color: "#c5a880", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Reservation...</div>}>
      <BookingFormInner />
    </Suspense>
  );
}
