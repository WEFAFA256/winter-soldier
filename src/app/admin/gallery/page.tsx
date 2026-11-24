"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Companion } from "@/lib/escorts";
import { parseServicePrice, splitServiceCatalog } from "@/lib/service-order";
import {
  SiteVideo,
  VIDEO_CATEGORY_OPTIONS,
  blankSiteVideo,
  formatVideoDuration,
  normalizeSiteVideos,
} from "@/lib/site-videos";
import { validateImage } from "@/lib/image-validation";
import { validateVideo } from "@/lib/video-validation";

/* ─── Types ─────────────────────────────────────────────────── */
interface ServiceItem {
  title: string; price: number | string; image: string;
  fullImage?: string; description: string; delay?: string;
  needsCrop?: boolean; imageOnly?: boolean;
  duration?: string; features?: string[];
}
interface GalleryItem { id: string; src: string; alt: string; delay?: string; availability?: "available" | "in-session"; }
interface BlogPost { id: string; title: string; excerpt: string; content: string; image: string; date: string; author: string; }
interface Booking {
  id: string; deposit_id: string; service_title: string; amount_ugx: number;
  customer_name: string; customer_phone: string; customer_email: string | null;
  booking_date: string; booking_time: string; status: string;
  created_at: string; confirmed_at: string | null; notes?: string | null;
}
interface Refund {
  id: string; deposit_id: string; booking_id: string | null; amount_ugx: number;
  reason: string | null; status: string; created_at: string;
}

/* ─── Inline style constants ─────────────────────────────────── */
const C = {
  bg: "#0d1117", surface: "#161b22", border: "#30363d",
  gold: "#c2a74e", goldDim: "rgba(194,167,78,0.15)",
  text: "#e6edf3", muted: "#8b949e", danger: "#f85149",
  success: "#3fb950", white: "#ffffff",
};

const css = `
  /* Admin is a full-bleed dark app: kill the browser's default 8px white margin
     and the site shell's white background. Without this the dark panel floats
     inside an 8px white frame and controls appear to cross into "the white zone". */
  html, body { margin: 0 !important; padding: 0 !important; background: ${C.bg} !important; }
  /* Scope to the root wrapper only — nested cards/table also carry .adm. */
  .adm-root { width: 100% !important; min-height: 100dvh !important; }
  .adm * { cursor: auto !important; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }
  .adm input, .adm textarea, .adm select { cursor: text !important; }
  .adm button, .adm label[for], .adm a { cursor: pointer !important; }
  .adm input::placeholder, .adm textarea::placeholder { color: #484f58; }
  .adm input:focus, .adm textarea:focus { outline: none; border-color: ${C.gold} !important; }
  .adm ::-webkit-scrollbar { width: 6px; height: 6px; }
  .adm ::-webkit-scrollbar-track { background: ${C.bg}; }
  .adm ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
  .adm .tab-btn { transition: all 0.15s; }
  .adm .tab-btn:hover { background: rgba(194,167,78,0.08) !important; }
  .adm .btn-gold { transition: filter 0.15s; }
  .adm .btn-gold:hover { filter: brightness(1.12); }
  .adm .btn-danger:hover { background: #da3633 !important; }
  .adm .card { transition: border-color 0.15s; }
  .adm .card:hover { border-color: rgba(194,167,78,0.3); }
  .adm .img-thumb { transition: transform 0.2s; }
  .adm .img-thumb:hover { transform: scale(1.03); }
  .adm .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Add-image form: preview box + Upload Image button on the left, Name + Save
     on the right. Flex-wrap lets the Save group drop to its own line on narrow
     screens instead of being squeezed into an unusable sliver. */
  .adm .gal-add-form { display: flex !important; flex-wrap: wrap !important; gap: 16px !important; align-items: flex-end !important; }
  .adm .gal-upload-area { display: flex !important; align-items: center !important; gap: 12px !important; flex: 0 0 auto !important; }
  .adm .gal-preview { width: 96px !important; height: 96px !important; flex-shrink: 0 !important; border-radius: 8px !important; border: 1px dashed ${C.border} !important; background: ${C.bg} !important; overflow: hidden !important; display: flex !important; align-items: center !important; justify-content: center !important; color: ${C.muted} !important; font-size: 28px !important; line-height: 1 !important; }
  .adm .gal-preview img { width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important; }
  .adm .gal-upload-side { display: flex !important; flex-direction: column !important; gap: 8px !important; align-items: flex-start !important; }
  .adm .gal-save-area { display: flex !important; flex: 1 1 260px !important; align-items: flex-end !important; gap: 10px !important; min-width: 0 !important; }
  .adm .gal-save-area .gal-name-wrap { flex: 1 1 auto !important; min-width: 0 !important; margin-bottom: 0 !important; }
  .adm .gal-upload-btn, .adm .gal-save-btn { min-height: 44px !important; white-space: nowrap !important; }

  /* Admin-managed gallery reels. The form and list collapse to one column on
     small screens so no URL field is squeezed off the edge of a 390px viewport. */
  .adm .video-form-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
  .adm .video-toolbar { display: flex !important; align-items: center !important; justify-content: space-between !important; gap: 10px !important; flex-wrap: wrap !important; }
  .adm .video-card { display: flex !important; flex-direction: column !important; gap: 12px !important; }
  .adm .video-upload-label { display: inline-flex !important; align-items: center !important; justify-content: center !important; min-height: 44px !important; padding: 8px 14px !important; border: 1px solid ${C.border} !important; border-radius: 6px !important; color: ${C.gold} !important; font-size: 12px !important; font-weight: 600 !important; cursor: pointer !important; }
  .adm .video-upload-label:hover { border-color: ${C.gold} !important; background: ${C.goldDim} !important; }

   /* fixed: removed orphaned keyframe fragment */
  .adm .line-clamp2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .adm .mobile-panel-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
  .adm .mobile-option-card { display: flex !important; align-items: center !important; gap: 10px !important; }

  /* ─── Mobile responsiveness ─── */
  @media (max-width: 640px) {
    .adm header { flex-wrap: wrap !important; height: auto !important; padding: 10px 12px !important; gap: 8px !important; }
    .adm header > div:first-child { flex: 1 1 100% !important; justify-content: center !important; }
    .adm header > div:last-child { gap: 6px !important; }
    .adm header .btn-gold, .adm header button { padding: 5px 10px !important; font-size: 10px !important; }
    .adm main { padding: 12px 10px !important; max-width: 100% !important; }
    .adm .tab-wrap { overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; scrollbar-width: none !important; }
    .adm .tab-wrap::-webkit-scrollbar { display: none !important; }
    .adm .tab-btn { white-space: nowrap !important; flex-shrink: 0 !important; padding: 10px 12px !important; font-size: 11px !important; }
    /* Services toolbar: stack the Add button and the search field so the
       textbox cannot run into the edge of the screen. */
    .adm .svc-toolbar { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
    .adm .svc-toolbar .btn-gold { width: 100% !important; }
    .adm .svc-toolbar input { width: 100% !important; max-width: none !important; flex: none !important; }
    .adm .escort-toolbar { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
    .adm .escort-toolbar .btn-gold { width: 100% !important; }
    .adm .escort-toolbar input { width: 100% !important; max-width: none !important; flex: none !important; }
    .adm .upload-grid { grid-template-columns: 1fr !important; }
    /* Gallery purge controls: stack cleanly instead of crowding 390px screens. */
    .adm .gal-toolbar { flex-direction: column !important; align-items: stretch !important; }
    .adm .gal-toolbar > div { width: 100% !important; }
    .adm .gal-toolbar button { width: 100% !important; }
    .adm .svc-form-grid { grid-template-columns: 1fr !important; }
    .adm .escort-form-grid { grid-template-columns: 1fr !important; }
    .adm .blog-form-grid { grid-template-columns: 1fr !important; }
    .adm .vip-form-grid { grid-template-columns: 1fr !important; }
    .adm .video-form-grid { grid-template-columns: 1fr !important; }
    .adm .video-toolbar { flex-direction: column !important; align-items: stretch !important; }
    .adm .video-toolbar > * { width: 100% !important; }
    .adm .video-upload-label { width: 100% !important; }
    .adm .mobile-panel-grid { grid-template-columns: 1fr !important; }
    .adm .mobile-option-card { flex-direction: column !important; align-items: stretch !important; }
    .adm .settings-grid { grid-template-columns: 1fr !important; }
    .adm .blog-card { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; overflow: hidden !important; }
    .adm .blog-card img { width: 100% !important; height: auto !important; max-height: 160px !important; flex-shrink: 0 !important; }
    .adm .blog-card .btn-danger { align-self: flex-start !important; }
    .adm .service-card { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
    .adm .service-card .svc-card-actions { width: 100% !important; justify-content: space-between !important; }
    .adm .service-card .svc-card-actions > div { flex: 1 !important; }
    .adm .service-card .svc-card-actions input { width: 100% !important; }
    .adm .escort-card { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
    .adm .escort-card .escort-card-actions { flex-direction: row !important; width: 100% !important; justify-content: space-between !important; }
    .adm .escort-card .escort-card-actions select { flex: 1 !important; }
    .adm .bookings-table td, .adm .bookings-table th { white-space: normal !important; }
    /* Add-image form: stack everything and make both buttons full width. */
    .adm .gal-upload-area { width: 100% !important; }
    .adm .gal-save-area { flex-direction: column !important; align-items: stretch !important; width: 100% !important; flex: 1 1 100% !important; }
    .adm .gal-save-area .gal-name-wrap { width: 100% !important; }
    .adm .gal-upload-btn, .adm .gal-save-btn { width: 100% !important; }
    .adm input, .adm select, .adm textarea { font-size: 16px !important; }
  }
`;

/* ─── Reusable UI helpers ────────────────────────────────────── */
const Input = ({ label, ...p }: any) => (
  <div style={{ marginBottom: 12 }}>
    {label && <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{label}</label>}
    <input {...p} style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px", color: C.text, fontSize: 13, ...p.style }} />
  </div>
);

const Textarea = ({ label, ...p }: any) => (
  <div style={{ marginBottom: 12 }}>
    {label && <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{label}</label>}
    <textarea {...p} style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px", color: C.text, fontSize: 13, resize: "vertical", ...p.style }} />
  </div>
);

const BtnGold = ({ children, style, ...p }: any) => (
  <button className="btn-gold" {...p} style={{ background: C.gold, color: "#0d1117", border: "none", borderRadius: 6, padding: "9px 18px", fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", ...style }}>
    {children}
  </button>
);

const BtnOutline = ({ children, style, ...p }: any) => (
  <button {...p} style={{ background: "transparent", color: C.muted, border: `1px solid ${C.border}`, borderRadius: 6, padding: "7px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer", ...style }}>
    {children}
  </button>
);

const Badge = ({ children, color = C.gold }: any) => (
  <span style={{ background: `${color}22`, color, border: `1px solid ${color}44`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{children}</span>
);

const SectionHead = ({ title, sub }: any) => (
  <div style={{ marginBottom: 20 }}>
    <h2 style={{ margin: 0, color: C.text, fontSize: 16, fontWeight: 700 }}>{title}</h2>
    {sub && <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 12 }}>{sub}</p>}
  </div>
);

/* Shared editor for a gallery reel. Used for both the add form and each saved
   record so their fields, validation and upload controls cannot drift apart. */
function VideoFields({
  value,
  onChange,
  onVideoFile,
  onPosterFile,
  videoBusy = false,
  posterBusy = false,
  resetKey = "",
  idPrefix,
}: {
  value: SiteVideo;
  onChange: (patch: Partial<SiteVideo>) => void;
  onVideoFile: (file: File | undefined) => void;
  onPosterFile: (file: File | undefined) => void;
  videoBusy?: boolean;
  posterBusy?: boolean;
  resetKey?: string;
  idPrefix: string;
}) {
  const categories = VIDEO_CATEGORY_OPTIONS.filter((option) => option.value !== "all");
  const sourceLabel = value.videoUrl ? "Uploaded video" : value.youtubeId ? "YouTube" : "No source yet";
  const sourceColor = value.videoUrl ? C.success : value.youtubeId ? C.gold : C.muted;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <Badge color={sourceColor}>{sourceLabel}</Badge>
        <label className="video-upload-label" aria-label={`Upload video for ${idPrefix}`}>
          {videoBusy ? "Uploading video…" : "⬆ Upload Video"}
          <input
            key={`video-file-${resetKey}`}
            type="file"
            accept="video/*"
            disabled={videoBusy}
            onChange={(e) => onVideoFile(e.target.files?.[0])}
            style={{ display: "none" }}
          />
        </label>
        <label className="video-upload-label" aria-label={`Upload poster for ${idPrefix}`}>
          {posterBusy ? "Uploading poster…" : "⬆ Upload Poster"}
          <input
            key={`poster-file-${resetKey}`}
            type="file"
            accept="image/*"
            disabled={posterBusy}
            onChange={(e) => onPosterFile(e.target.files?.[0])}
            style={{ display: "none" }}
          />
        </label>
        <span style={{ fontSize: 10, color: C.muted }}>
          Uploads go straight to the media store; click Save Changes to publish the reel.
        </span>
      </div>

      <div className="adm video-form-grid">
        <Input label="Title *" aria-label={`Title for ${idPrefix}`} placeholder="Deep Tissue & Muscular Release Flow" value={value.title} onChange={(e: any) => onChange({ title: e.target.value })} />
        <Input label="Specialist" aria-label={`Specialist for ${idPrefix}`} placeholder="Specialist Brenda" value={value.specialist} onChange={(e: any) => onChange({ specialist: e.target.value })} />
        <Input label="Role" aria-label={`Role for ${idPrefix}`} placeholder="Master Deep Bodywork" value={value.role} onChange={(e: any) => onChange({ role: e.target.value })} />
        <Input label="Category Label" aria-label={`Category label for ${idPrefix}`} placeholder="Deep Tissue" value={value.categoryLabel} onChange={(e: any) => onChange({ categoryLabel: e.target.value })} />
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>Filter Category</label>
          <select
            aria-label={`Filter category for ${idPrefix}`}
            value={value.category}
            onChange={(e: any) => onChange({ category: e.target.value as SiteVideo["category"] })}
            style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px", color: C.text, fontSize: 13 }}
          >
            {categories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
        <Input label="Duration" aria-label={`Duration for ${idPrefix}`} placeholder="4:15 HD" value={value.duration} onChange={(e: any) => onChange({ duration: e.target.value })} />
        <Input label="YouTube ID (optional)" aria-label={`YouTube ID for ${idPrefix}`} placeholder="abc123xyz" value={value.youtubeId} onChange={(e: any) => onChange({ youtubeId: e.target.value })} />
        <Input label="Uploaded Video URL (optional)" aria-label={`Video URL for ${idPrefix}`} placeholder="https://.../media/video/.../clip.mp4" value={value.videoUrl} onChange={(e: any) => onChange({ videoUrl: e.target.value })} />
        <Input label="Booking Service" aria-label={`Booking service for ${idPrefix}`} placeholder="Deep Tissue Massage" value={value.bookingService} onChange={(e: any) => onChange({ bookingService: e.target.value })} />
        <Input label="Poster Image URL" aria-label={`Poster URL for ${idPrefix}`} placeholder="https://.../media/image/.../poster.jpg" value={value.poster} onChange={(e: any) => onChange({ poster: e.target.value })} />
      </div>
      <Textarea label="Description" aria-label={`Description for ${idPrefix}`} rows={2} placeholder="What the visitor will see in this reel…" value={value.description} onChange={(e: any) => onChange({ description: e.target.value })} />
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function AdminGalleryPage() {
  const [tab, setTab] = useState<"gallery"|"videos"|"services"|"vip"|"mobile"|"escorts"|"blog"|"bookings"|"info">("gallery");
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");

  /* Gallery */
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [galFile, setGalFile] = useState<File|null>(null);
  const [galPreview, setGalPreview] = useState<string|null>(null);
  const [galAlt, setGalAlt] = useState("");
  const [galUploading, setGalUploading] = useState(false);
  const galFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [purging, setPurging] = useState(false);

  /* Services page cards */
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [siteContent, setSiteContent] = useState<any>(null);
  const [svcSearch, setSvcSearch] = useState("");
  const [showAddSvc, setShowAddSvc] = useState(false);
  const [newSvc, setNewSvc] = useState<Partial<ServiceItem>>({ title:"", price:150000, description:"", image:"https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg" });
  const [svcUploadIdx, setSvcUploadIdx] = useState<number | null>(null);
  const [svcNewUploading, setSvcNewUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* VIP packages page cards — separate from /services so price edits stay scoped */
  const [vipServices, setVipServices] = useState<ServiceItem[]>([]);
  const [vipSearch, setVipSearch] = useState("");
  const [showAddVip, setShowAddVip] = useState(false);
  const [newVip, setNewVip] = useState<Partial<ServiceItem>>({ title:"", price:300000, description:"", image:"https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg" });
  const [vipUploadIdx, setVipUploadIdx] = useState<number | null>(null);
  const [vipNewUploading, setVipNewUploading] = useState(false);

  /* Mobile Massage page cards — selected from services + VIP, own prices */
  const [mobileMassage, setMobileMassage] = useState<ServiceItem[]>([]);
  const [mobileSearch, setMobileSearch] = useState("");

  /* Escort profile cards */
  const [escorts, setEscorts] = useState<Companion[]>([]);
  const [escortSearch, setEscortSearch] = useState("");
  const [showAddEscort, setShowAddEscort] = useState(false);
  const [newEscort, setNewEscort] = useState<Partial<Companion>>({
    name: "", title: "Elite Companion", specialty: "",
    availability: "available", image: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg", description: "",
    gallery: [], videos: [],
  });
  const [escortUploadIdx, setEscortUploadIdx] = useState<number | null>(null);
  const [escortNewUploading, setEscortNewUploading] = useState(false);

  /* Admin-managed gallery videos */
  const [videos, setVideos] = useState<SiteVideo[]>([]);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [newVideo, setNewVideo] = useState<SiteVideo>(blankSiteVideo());
  const [videoFormKey, setVideoFormKey] = useState(0);
  const [newVideoUploading, setNewVideoUploading] = useState(false);
  const [newPosterUploading, setNewPosterUploading] = useState(false);
  const [videoUploadIdx, setVideoUploadIdx] = useState<number | null>(null);
  const [posterUploadIdx, setPosterUploadIdx] = useState<number | null>(null);

  /* Blog */
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [blogFile, setBlogFile] = useState<File|null>(null);
  const [blogPreview, setBlogPreview] = useState<string|null>(null);
  const [blogUploading, setBlogUploading] = useState(false);
  const [newBlog, setNewBlog] = useState<Partial<BlogPost>>({ title:"", excerpt:"", content:"", image:"", date: new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"}), author:"Admin" });

  /* Bookings */
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [bookingStatus, setBookingStatus] = useState("");
  const [bookingsError, setBookingsError] = useState("");
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState("");
  const [markingRefund, setMarkingRefund] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => { if (auth) loadData(); }, [auth]);

  const loadBookings = async (status = bookingStatus) => {
    setBookingsLoading(true);
    setBookingsError("");
    try {
      const qs = status ? `?status=${encodeURIComponent(status)}` : "";
      const res = await fetch(`/api/admin/bookings${qs}`, { credentials: "same-origin" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setBookings(data.bookings || []);
        setRefunds(data.refunds || []);
      } else setBookingsError(data.error || "Could not load bookings");
    } catch {
      setBookingsError("Could not reach the payments API");
    }
    setBookingsLoading(false);
  };

  useEffect(() => {
    if (auth && tab === "bookings") loadBookings();
  }, [auth, tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const cancelBooking = async (id: string) => {
    if (!confirm("Cancel this booking? The time slot will be released. If a payment prompt is already open, cancellation is blocked — contact reception instead.")) return;
    setCancellingId(id);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "CANCELLED" } : b));
      else alert(data.error || "Could not cancel booking");
    } catch {
      alert("Network error cancelling booking");
    }
    setCancellingId("");
  };

  // A payment that completed after a cancellation is recorded as a refund task.
  // Marking it here records that staff returned the money in PawaPay's dashboard.
  const markRefund = async (depositId: string) => {
    if (!confirm("Confirm this deposit was refunded in the PawaPay dashboard?")) return;
    setMarkingRefund(depositId);
    try {
      const res = await fetch("/api/admin/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ depositId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setRefunds((prev) => prev.filter((r) => r.deposit_id !== depositId));
      else alert(data.error || "Could not record refund");
    } catch {
      alert("Network error recording refund");
    }
    setMarkingRefund("");
  };

  const logout = async () => {
    try {
      await fetch("/api/admin/login", { method: "DELETE", credentials: "same-origin" });
    } catch { /* clear local state regardless */ }
    setAuth(false);
    setBookings([]);
    setRefunds([]);
  };

  useEffect(() => {
    fetch("/api/admin/login")
      .then((r) => (r.ok ? r.json() : { authenticated: false }))
      .then((d) => { if (d.authenticated) setAuth(true); })
      .catch(() => {});
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey: pw.trim() }),
      });
      if (res.ok) { setAuth(true); setPw(""); }
      else setPwErr("Incorrect passkey. Please try again.");
    } catch {
      setPwErr("Could not reach the server. Please try again.");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [gRes, cRes, bRes] = await Promise.all([
        fetch("/api/gallery"), fetch("/api/content"), fetch("/api/blog")
      ]);
      if (gRes.ok) setGallery(await gRes.json());
      if (cRes.ok) {
        const c = await cRes.json();
        const catalog = splitServiceCatalog(c);
        setSiteContent(c);
        setServices(catalog.services);
        setVipServices(catalog.vipServices);
        setMobileMassage(Array.isArray(c.mobileMassage) ? c.mobileMassage : []);
        setEscorts(Array.isArray(c.escorts) ? c.escorts : []);
        setVideos(normalizeSiteVideos(c.videos));
      }
      if (bRes.ok) {
        const blogList = await bRes.json();
        const validBlogs = Array.isArray(blogList) ? blogList : [];
        setBlogs(validBlogs);
        setSiteContent((prev: any) => ({ ...prev, blogs: validBlogs }));
      }
    } catch {
      // Keep the loaded lists; the R2-backed store is the only escort source.
    }
    setLoading(false);
  };

  /* One upload path for every admin image/reel: request a short-lived R2 ticket,
     then send the bytes directly to the Worker. Vercel never sees the file body. */
  const inferMediaType = (file: File, kind: "image" | "video"): string => {
    if (file.type) return file.type.toLowerCase();
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (kind === "image") {
      return ({ jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", avif: "image/avif" } as Record<string, string>)[ext] || "image/jpeg";
    }
    return ({ mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime", mkv: "video/x-matroska", ogv: "video/ogg", avi: "video/x-msvideo" } as Record<string, string>)[ext] || "video/mp4";
  };

  const uploadToR2 = async (
    file: File,
    kind: "image" | "video"
  ): Promise<{ url: string; key: string; public_id: string; bytes: number; contentType: string; duration: number } | null> => {
    const contentType = inferMediaType(file, kind);
    const header = new Uint8Array(await file.slice(0, 32).arrayBuffer());
    const invalid = kind === "image"
      ? validateImage({ type: contentType, size: file.size }, header)
      : validateVideo({ type: contentType, size: file.size }, header);
    if (invalid) {
      alert(invalid);
      return null;
    }

    const ticketEndpoint = kind === "image" ? "/api/upload" : "/api/upload-video";
    const ticketRes = await fetch(ticketEndpoint, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType, size: file.size }),
    });
    const ticketData = await ticketRes.json().catch(() => ({}));
    if (!ticketRes.ok || !ticketData.ticket || !ticketData.uploadPath) {
      alert(ticketData.error || "Could not start the upload. Please try again.");
      return null;
    }

    const uploadRes = await fetch(ticketData.uploadPath, {
      method: "POST",
      headers: { "Content-Type": contentType, "x-upload-ticket": ticketData.ticket },
      body: file,
    });
    const data = await uploadRes.json().catch(() => ({}));
    if (!uploadRes.ok || !data.url) {
      alert(data.error || "Upload failed. Please try again.");
      return null;
    }
    return {
      url: data.url,
      key: data.key || ticketData.key || "",
      public_id: data.public_id || data.key || ticketData.key || "",
      bytes: data.bytes || file.size,
      contentType,
      duration: data.duration || 0,
    };
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const result = await uploadToR2(file, "image");
    return result?.url || null;
  };

  /* Gallery handlers */
  const resetGalleryForm = () => {
    if (galPreview) URL.revokeObjectURL(galPreview);
    setGalFile(null); setGalPreview(null); setGalAlt("");
    if (galFileInputRef.current) galFileInputRef.current.value = "";
  };

  const pickGalleryFile = (file: File | undefined) => {
    if (!file) return;
    if (galPreview) URL.revokeObjectURL(galPreview);
    setGalFile(file);
    setGalPreview(URL.createObjectURL(file));
  };

  const addGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galFile) return alert("Choose an image first");
    setGalUploading(true);
    try {
      const uploaded = await uploadToR2(galFile, "image");
      if (!uploaded) {
        setGalUploading(false);
        return;
      }
      const id = `serenity_gallery/${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
      const image: GalleryItem = {
        id,
        src: uploaded.url,
        alt: galAlt.trim() || "The Serenity Spa",
        delay: "delay-100",
        availability: "available",
      };
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ image: { ...image, key: uploaded.key } }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) { setGallery([data.image || image, ...gallery]); resetGalleryForm(); }
      else alert(data.error || "Could not save the image");
    } catch {
      alert("Upload failed. Please try again.");
    }
    setGalUploading(false);
  };

  const deleteGalleryImage = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    const res = await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, { method:"DELETE", credentials:"same-origin" });
    if (res.ok) {
      setGallery(gallery.filter(i => i.id !== id));
      setSelectedImages(prev => prev.filter(x => x !== id));
    }
  };

  const toggleImageSelection = (id: string) => {
    setSelectedImages(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const availableImageIds = gallery
    .filter(img => img.id && (img.availability || "available") === "available")
    .map(img => img.id);

  const purgeSelectedImages = async () => {
    const ids = selectedImages.filter(id => gallery.some(img => img.id === id));
    if (!ids.length) return alert("Select at least one profile image first.");
    if (!confirm(`Permanently purge ${ids.length} selected profile image${ids.length === 1 ? "" : "s"} from the media store? This cannot be undone.`)) return;

    setPurging(true);
    try {
      const res = await fetch("/api/gallery/purge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ ids }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Could not purge the selected images.");
        return;
      }
      const deleted: string[] = Array.isArray(data.deleted) ? data.deleted : ids;
      const deletedSet = new Set(deleted);
      setGallery(prev => prev.filter(img => !deletedSet.has(img.id)));
      setSelectedImages(prev => prev.filter(id => !deletedSet.has(id)));
      if (Array.isArray(data.failed) && data.failed.length) {
        alert(`Purged ${deleted.length}. ${data.failed.length} could not be removed: ${data.failed.join(", ")}`);
      }
    } catch {
      alert("Network error purging images");
    }
    setPurging(false);
  };

  const toggleAvailability = async (id: string, currentStatus?: string) => {
    const newStatus = currentStatus === "in-session" ? "available" : "in-session";
    setGallery((prev) =>
      prev.map((img) => (img.id === id ? { ...img, availability: newStatus } : img))
    );

    try {
      const res = await fetch("/api/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id, availability: newStatus }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to update availability");
        setGallery((prev) =>
          prev.map((img) => (img.id === id ? { ...img, availability: currentStatus as any } : img))
        );
      }
    } catch {
      alert("Network error updating therapist availability");
      setGallery((prev) =>
        prev.map((img) => (img.id === id ? { ...img, availability: currentStatus as any } : img))
      );
    }
  };

  /* Service handlers */
  const updateSvc = (i: number, k: keyof ServiceItem, v: any) => {
    const u = [...services]; u[i] = { ...u[i], [k]: v }; setServices(u);
  };
  const deleteSvc = (i: number) => { if (!confirm(`Delete "${services[i].title}"?`)) return; setServices(services.filter((_,j)=>j!==i)); };
  const addSvc = () => { if (!newSvc.title) return alert("Enter a service title"); setServices([newSvc as ServiceItem, ...services]); setNewSvc({ title:"", price:150000, description:"", image:"https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg" }); setShowAddSvc(false); };

  // Upload a replacement image for an existing service card. Images go to the
  // same R2-backed media store as gallery/blog images; the returned URL is
  // written into the service record and persists when "Save All Changes" runs.
  const changeSvcImage = async (i: number, file: File | undefined) => {
    if (!file) return;
    setSvcUploadIdx(i);
    try {
      const url = await uploadFile(file);
      if (url) updateSvc(i, "image", url);
      else alert("Image upload failed. Please try again.");
    } catch {
      alert("Image upload failed. Please try again.");
    }
    setSvcUploadIdx(null);
  };

  const uploadNewSvcImage = async (file: File | undefined) => {
    if (!file) return;
    setSvcNewUploading(true);
    try {
      const url = await uploadFile(file);
      if (url) setNewSvc(s => ({ ...s, image: url }));
      else alert("Image upload failed. Please try again.");
    } catch {
      alert("Image upload failed. Please try again.");
    }
    setSvcNewUploading(false);
  };

  /* VIP page handlers — these edit `vipServices` only. */
  const updateVip = (i: number, k: keyof ServiceItem, v: any) => {
    const u = [...vipServices]; u[i] = { ...u[i], [k]: v }; setVipServices(u);
  };
  const deleteVip = (i: number) => {
    if (!confirm(`Delete "${vipServices[i].title}" from VIP packages?`)) return;
    setVipServices(vipServices.filter((_, j) => j !== i));
  };
  const addVip = () => {
    if (!newVip.title) return alert("Enter a VIP package title");
    setVipServices([newVip as ServiceItem, ...vipServices]);
    setNewVip({ title:"", price:300000, description:"", image:"https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg" });
    setShowAddVip(false);
  };
  const changeVipImage = async (i: number, file: File | undefined) => {
    if (!file) return;
    setVipUploadIdx(i);
    try {
      const url = await uploadFile(file);
      if (url) updateVip(i, "image", url);
      else alert("Image upload failed. Please try again.");
    } catch {
      alert("Image upload failed. Please try again.");
    }
    setVipUploadIdx(null);
  };
  const uploadNewVipImage = async (file: File | undefined) => {
    if (!file) return;
    setVipNewUploading(true);
    try {
      const url = await uploadFile(file);
      if (url) setNewVip(s => ({ ...s, image: url }));
      else alert("Image upload failed. Please try again.");
    } catch {
      alert("Image upload failed. Please try again.");
    }
    setVipNewUploading(false);
  };

  /* Gallery video handlers — the same durable `videos` array drives /gallery. */
  const uploadVideoFile = async (file: File): Promise<any | null> => {
    const uploaded = await uploadToR2(file, "video");
    if (!uploaded) return null;
    return {
      secure_url: uploaded.url,
      public_id: uploaded.public_id,
      duration: uploaded.duration,
      format: uploaded.contentType,
      bytes: uploaded.bytes,
    };
  };

  const uploadNewVideoFile = async (file: File | undefined) => {
    if (!file) return;
    setNewVideoUploading(true);
    try {
      const result = await uploadVideoFile(file);
      if (result?.secure_url) {
        setNewVideo((current) => ({
          ...current,
          videoUrl: result.secure_url,
          duration: current.duration || formatVideoDuration(result.duration),
        }));
      }
    } catch {
      alert("Video upload failed. Please try again.");
    }
    setNewVideoUploading(false);
  };

  const uploadNewPosterFile = async (file: File | undefined) => {
    if (!file) return;
    setNewPosterUploading(true);
    try {
      const url = await uploadFile(file);
      if (url) setNewVideo((current) => ({ ...current, poster: url }));
      else alert("Poster upload failed. Please try again.");
    } catch {
      alert("Poster upload failed. Please try again.");
    }
    setNewPosterUploading(false);
  };

  const resetVideoForm = () => {
    setNewVideo(blankSiteVideo());
    setVideoFormKey((key) => key + 1);
  };

  const addVideo = () => {
    if (!newVideo.title.trim()) return alert("Enter a video title");
    if (!newVideo.videoUrl && !newVideo.youtubeId) return alert("Upload a video or enter a YouTube ID");
    const categoryLabel =
      newVideo.categoryLabel.trim() ||
      VIDEO_CATEGORY_OPTIONS.find((option) => option.value === newVideo.category)?.label ||
      "Spa Film";
    const record: SiteVideo = {
      ...newVideo,
      id: newVideo.id || `video-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: newVideo.title.trim(),
      categoryLabel,
    };
    setVideos([record, ...videos]);
    resetVideoForm();
    setShowAddVideo(false);
  };

  const updateVideo = (index: number, patch: Partial<SiteVideo>) => {
    setVideos((current) => current.map((video, i) => (i === index ? { ...video, ...patch } : video)));
  };

  const deleteVideo = (index: number) => {
    if (!confirm(`Delete "${videos[index].title}" from the gallery reels?`)) return;
    setVideos((current) => current.filter((_, i) => i !== index));
  };

  const changeVideoFile = async (index: number, file: File | undefined) => {
    if (!file) return;
    setVideoUploadIdx(index);
    try {
      const result = await uploadVideoFile(file);
      if (result?.secure_url) {
        updateVideo(index, {
          videoUrl: result.secure_url,
          duration: videos[index].duration || formatVideoDuration(result.duration),
        });
      }
    } catch {
      alert("Video upload failed. Please try again.");
    }
    setVideoUploadIdx(null);
  };

  const changeVideoPoster = async (index: number, file: File | undefined) => {
    if (!file) return;
    setPosterUploadIdx(index);
    try {
      const url = await uploadFile(file);
      if (url) updateVideo(index, { poster: url });
      else alert("Poster upload failed. Please try again.");
    } catch {
      alert("Poster upload failed. Please try again.");
    }
    setPosterUploadIdx(null);
  };

  /* Mobile Massage handlers — prices here are a copy for /mobile-massage only. */
  const titleKey = (value: string) => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const addToMobile = (source: ServiceItem) => {
    if (mobileMassage.some(card => titleKey(card.title) === titleKey(source.title))) {
      return alert("This treatment is already on the Mobile Massage page.");
    }
    setMobileMassage([...mobileMassage, {
      title: source.title,
      price: source.price,
      image: source.image,
      description: source.description || "Premium out-call treatment delivered to your location.",
      duration: "60 - 90 mins",
      features: [
        "Delivered to your hotel or residence",
        "Professional therapist and portable setup",
        "Fresh linens and aromatic oils",
        "Discreet, punctual service",
      ],
    }]);
  };
  const updateMobilePrice = (i: number, price: number) => {
    const u = [...mobileMassage]; u[i] = { ...u[i], price }; setMobileMassage(u);
  };
  const removeFromMobile = (i: number) => {
    setMobileMassage(mobileMassage.filter((_, j) => j !== i));
  };

  /* Escort card handlers */
  const parseLines = (value: string) => value.split("\n").map((x) => x.trim()).filter(Boolean);
  const parseEscortVideos = (value: string) =>
    parseLines(value)
      .map((line) => {
        const [title, youtubeId] = line.split("|").map((x) => x.trim());
        return youtubeId ? { title: title || "Video", youtubeId } : null;
      })
      .filter(Boolean) as { title: string; youtubeId: string }[];
  const videoLines = (videos?: { title: string; youtubeId: string }[]) =>
    (videos || []).map((v) => `${v.title}|${v.youtubeId}`).join("\n");

  const updateEscort = (i: number, k: keyof Companion, v: any) => {
    const u = [...escorts]; u[i] = { ...u[i], [k]: v }; setEscorts(u);
  };
  const deleteEscort = (i: number) => {
    if (!confirm(`Delete "${escorts[i].name}"?`)) return;
    setEscorts(escorts.filter((_, j) => j !== i));
  };
  const addEscort = () => {
    if (!newEscort.name) return alert("Enter a name");
    setEscorts([newEscort as Companion, ...escorts]);
    setNewEscort({ name: "", title: "Elite Companion", specialty: "", availability: "available", image: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg", description: "", gallery: [], videos: [] });
    setShowAddEscort(false);
  };
  const changeEscortImage = async (i: number, file: File | undefined) => {
    if (!file) return;
    setEscortUploadIdx(i);
    try {
      const url = await uploadFile(file);
      if (url) updateEscort(i, "image", url);
      else alert("Image upload failed. Please try again.");
    } catch {
      alert("Image upload failed. Please try again.");
    }
    setEscortUploadIdx(null);
  };
  const uploadNewEscortImage = async (file: File | undefined) => {
    if (!file) return;
    setEscortNewUploading(true);
    try {
      const url = await uploadFile(file);
      if (url) setNewEscort(s => ({ ...s, image: url }));
      else alert("Image upload failed. Please try again.");
    } catch {
      alert("Image upload failed. Please try again.");
    }
    setEscortNewUploading(false);
  };

  const saveAll = async () => {
    setSaving(true);
    const body = { ...siteContent, services, vipServices, mobileMassage, escorts, videos, blogs };
    const res = await fetch("/api/content", { method:"POST", headers:{ "Content-Type":"application/json" }, credentials:"same-origin", body: JSON.stringify(body) });
    if (res.ok) {
      setSiteContent(body);
      // Tell already-open public tabs (and this browser's other windows) that
      // content changed so contact/catalogue values refresh immediately.
      try {
        window.dispatchEvent(new Event("serenity-content-updated"));
        localStorage.setItem("serenity-content-version", String(Date.now()));
      } catch {}
      alert("Saved to the media store ✓");
    }
    else alert("Save failed");
    setSaving(false);
  };

  /* Blog handlers */
  const addBlog = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newBlog.title || !newBlog.content) return alert("Title and content are required");
    setBlogUploading(true);
    let img = newBlog.image || "";
    if (blogFile) {
      const u = await uploadFile(blogFile);
      if (!u) {
        setBlogUploading(false);
        return;
      }
      img = u;
    }
    const post: BlogPost = { id: Date.now().toString(), title:newBlog.title||"", excerpt:newBlog.excerpt||"", content:newBlog.content||"", image:img, date:newBlog.date||"", author:newBlog.author||"Admin" };
    try {
      const res = await fetch("/api/blog", { method:"POST", headers:{ "Content-Type":"application/json" }, credentials:"same-origin", body: JSON.stringify(post) });
      if (res.ok) {
        const nextBlogs = [post, ...blogs];
        setBlogs(nextBlogs);
        setSiteContent((prev: any) => ({ ...prev, blogs: nextBlogs }));
        setNewBlog({ title:"", excerpt:"", content:"", image:"", date:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"}), author:"Admin" });
        setBlogFile(null);
        setBlogPreview(null);
        setShowAddBlog(false);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Failed to publish blog post");
      }
    } catch {
      alert("Network error publishing blog post");
    }
    setBlogUploading(false);
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blog?id=${encodeURIComponent(id)}`, { method:"DELETE", credentials:"same-origin" });
      if (res.ok) {
        const nextBlogs = blogs.filter(p=>p.id!==id);
        setBlogs(nextBlogs);
        setSiteContent((prev: any) => ({ ...prev, blogs: nextBlogs }));
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Failed to delete blog post");
      }
    } catch {
      alert("Network error deleting blog post");
    }
  };

  /* ── LOGIN SCREEN ────────────────────────────────────────────── */
  if (!auth) return (
    <div className="adm adm-root" style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <style>{css}</style>
      <div style={{ width:"100%", maxWidth:380, background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:36, boxShadow:"0 24px 64px rgba(0,0,0,0.6)" }}>
        {/* Logo area */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:48, height:48, borderRadius:"50%", background:C.goldDim, border:`1px solid ${C.gold}44`, marginBottom:12 }}>
            <span style={{ fontSize:22 }}>🌿</span>
          </div>
          <h1 style={{ margin:0, color:C.text, fontSize:20, fontWeight:700, letterSpacing:"0.02em" }}>The Serenity Spa</h1>
          <p style={{ margin:"4px 0 0", color:C.gold, fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase" }}>Admin Portal</p>
        </div>

        {pwErr && <div style={{ background:"#f8514922", border:"1px solid #f8514944", borderRadius:6, padding:"10px 14px", color:C.danger, fontSize:12, marginBottom:16, textAlign:"center" }}>{pwErr}</div>}

        <form onSubmit={login}>
          <label htmlFor="admin-passkey" style={{ display:"block", fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Admin Passkey</label>
          <input id="admin-passkey" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Enter your passkey…" required
            style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"11px 14px", color:C.text, fontSize:14, marginBottom:16 }} />
          <button type="submit" className="btn-gold" style={{ width:"100%", background:C.gold, color:"#0d1117", border:"none", borderRadius:8, padding:12, fontSize:13, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", cursor:"pointer" }}>
            Unlock Dashboard
          </button>
        </form>

        <div style={{ marginTop:20, textAlign:"center" }}>
          <Link href="/" style={{ color:C.muted, fontSize:12, textDecoration:"none" }}>← Back to website</Link>
        </div>
      </div>
    </div>
  );

  /* ── MAIN DASHBOARD ──────────────────────────────────────────── */
  const mobileOptions = [
    ...services.map((svc, i) => ({ svc, i, label: "Service" })),
    ...vipServices.map((svc, i) => ({ svc, i, label: "VIP" })),
  ].filter(({ svc }) => svc.title.toLowerCase().includes(mobileSearch.toLowerCase()));

  const tabs = [
    { id:"gallery", label:"Gallery", icon:"📸", count:gallery.length },
    { id:"videos", label:"Videos", icon:"🎬", count:videos.length },
    { id:"services", label:"Services", icon:"💅", count:services.length },
    { id:"vip", label:"VIP", icon:"👑", count:vipServices.length },
    { id:"mobile", label:"Mobile Massage", icon:"🚗", count:mobileMassage.length },
    { id:"escorts", label:"Escorts", icon:"💃", count:escorts.length },
    { id:"blog", label:"Blog", icon:"📝", count:blogs.length },
    { id:"bookings", label:"Bookings", icon:"📅" },
    { id:"info", label:"Settings", icon:"⚙️" },
  ];

  return (
    <div className="adm adm-root" style={{ minHeight:"100vh", background:C.bg, color:C.text }}>
      <style>{css}</style>

      {/* ── TOP BAR ── */}
      <header style={{ position:"sticky", top:0, zIndex:50, background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 20px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:14, fontWeight:700, color:C.text, letterSpacing:"0.04em" }}>THE SERENITY SPA</span>
          <Badge>Admin CMS</Badge>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <BtnGold onClick={saveAll} disabled={saving} style={{ padding:"6px 14px", fontSize:11 }}>
            {saving ? "Saving…" : "💾 Save Changes"}
          </BtnGold>
          <BtnOutline onClick={logout} style={{ padding:"5px 12px", fontSize:11 }}>Log out</BtnOutline>
        </div>
      </header>

      {/* ── TAB BAR ── */}
      <div className="adm tab-wrap" style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 20px", display:"flex", gap:4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id as any)} className="tab-btn"
            style={{ background:"transparent", border:"none", borderBottom: tab===t.id ? `2px solid ${C.gold}` : "2px solid transparent", color: tab===t.id ? C.gold : C.muted, padding:"10px 14px", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6, marginBottom:-1 }}>
            <span>{t.icon}</span> {t.label}
            {t.count !== undefined && <span style={{ background: tab===t.id ? C.goldDim : "#21262d", color: tab===t.id ? C.gold : C.muted, borderRadius:20, padding:"1px 8px", fontSize:10, fontWeight:700 }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth:1100, margin:"0 auto", padding:"24px 20px" }}>
        {loading ? (
          <div style={{ textAlign:"center", paddingTop:80 }}>
            <div className="spin" style={{ width:32, height:32, border:`3px solid ${C.border}`, borderTopColor:C.gold, borderRadius:"50%", display:"inline-block" }} />
            <p style={{ color:C.muted, fontSize:12, marginTop:12 }}>Loading data…</p>
          </div>
        ) : (
          <>
            {/* ══ GALLERY TAB ══ */}
            {tab === "gallery" && (
              <div className="admin-pane">
                <SectionHead title="Spa Gallery" sub="Upload photos directly to the media store — they appear on the gallery page instantly." />

                {/* Add Image — small preview box + Upload Image button, Name + Save */}
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:20, marginBottom:24 }}>
                  <p style={{ margin:"0 0 14px", fontSize:12, fontWeight:700, color:C.gold, textTransform:"uppercase", letterSpacing:"0.06em" }}>+ Add Image</p>
                  <form onSubmit={addGalleryImage} className="adm gal-add-form">
                    {/* The preview box replaces the native "Choose File" control */}
                    <div className="gal-upload-area">
                      <div className="gal-preview" title="Image preview">
                        {galPreview ? <img src={galPreview} alt="Selected preview" /> : <span>＋</span>}
                      </div>
                      <div className="gal-upload-side">
                        <input
                          ref={galFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={e=>pickGalleryFile(e.target.files?.[0])}
                          style={{ display:"none" }}
                        />
                        <BtnGold type="button" className="btn-gold gal-upload-btn" onClick={()=>galFileInputRef.current?.click()} style={{ padding:"0 16px" }}>
                          Upload Image
                        </BtnGold>
                        {galFile && (
                          <div style={{ display:"flex", alignItems:"center", gap:6, maxWidth:170 }}>
                            <span style={{ fontSize:10, color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{galFile.name}</span>
                            <button type="button" onClick={resetGalleryForm} title="Remove selected image" style={{ fontSize:11, color:C.danger, background:"none", border:"none", cursor:"pointer", padding:"2px 4px" }}>✕</button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name is stored as the image label and shown on the gallery cards */}
                    <div className="gal-save-area">
                      <div className="gal-name-wrap">
                        <label style={{ display:"block", fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Name</label>
                        <input type="text" placeholder="e.g. Hot stone massage session" value={galAlt} onChange={(e:any)=>setGalAlt(e.target.value)}
                          style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, padding:"10px 12px", color:C.text, fontSize:13, minHeight:44 }} />
                      </div>
                      <BtnGold type="submit" className="btn-gold gal-save-btn" disabled={galUploading||!galFile} style={{ padding:"0 20px" }}>
                        {galUploading ? "Saving…" : "Save"}
                      </BtnGold>
                    </div>
                  </form>
                </div>

                {/* Gallery grid & availability controls */}
                <div className="gal-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      All Therapists & Photos ({gallery.length})
                    </p>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 12, background: "rgba(63, 185, 80, 0.15)", color: "#3fb950", border: "1px solid rgba(63, 185, 80, 0.3)", fontWeight: 700 }}>
                      🟢 {gallery.filter(i => (i.availability || "available") === "available").length} Available
                    </span>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 12, background: "rgba(248, 81, 73, 0.15)", color: "#f85149", border: "1px solid rgba(248, 81, 73, 0.3)", fontWeight: 700 }}>
                      🔴 {gallery.filter(i => i.availability === "in-session").length} In Session
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <BtnOutline
                      onClick={() => setSelectedImages(availableImageIds)}
                      disabled={!availableImageIds.length}
                      title="Select every Available profile image for purging"
                      style={{ opacity: availableImageIds.length ? 1 : 0.45 }}
                    >
                      Select All Available ({availableImageIds.length})
                    </BtnOutline>
                    <BtnOutline
                      onClick={() => setSelectedImages([])}
                      disabled={!selectedImages.length}
                      style={{ opacity: selectedImages.length ? 1 : 0.45 }}
                    >
                      Clear ({selectedImages.length})
                    </BtnOutline>
                    <button
                      className="btn-danger"
                      onClick={purgeSelectedImages}
                      disabled={purging || !selectedImages.length}
                      title="Permanently delete the selected images from the media store"
                      style={{
                        background: "rgba(218, 54, 51, 0.2)",
                        border: "1px solid rgba(218, 54, 51, 0.5)",
                        borderRadius: 6,
                        color: C.danger,
                        padding: "7px 14px",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        opacity: selectedImages.length && !purging ? 1 : 0.45,
                      }}
                    >
                      {purging ? "Purging…" : `Purge Selected (${selectedImages.length})`}
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: C.muted, margin: "0 0 16px" }}>
                  💡 Tick photos to purge. “Select All Available” preselects only Available profiles — In Session photos stay untouched unless you tick them individually. Click a status button to change availability.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 14 }}>
                  {gallery.map(img => {
                    const isAvail = (img.availability || "available") === "available";
                    const isSelected = selectedImages.includes(img.id);
                    return (
                      <div
                        key={img.id || img.src}
                        className={`card${isSelected ? " gal-card-selected" : ""}`}
                        style={{
                          borderRadius: 10,
                          overflow: "hidden",
                          background: C.surface,
                          border: `2px solid ${isSelected ? C.gold : (isAvail ? "rgba(63, 185, 80, 0.3)" : "rgba(248, 81, 73, 0.3)")}`,
                          boxShadow: isSelected ? `0 0 0 2px ${C.gold}55` : "none",
                          display: "flex",
                          flexDirection: "column",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {/* Image + status chip */}
                        <div style={{ position: "relative", height: 140, background: "#0a0d12" }}>
                          <img
                            src={img.src}
                            alt={img.alt}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                          <label
                            title={isSelected ? "Deselect this image" : "Select this image for purge"}
                            style={{
                              position: "absolute",
                              top: 6,
                              left: 6,
                              width: 26,
                              height: 26,
                              borderRadius: 6,
                              background: "rgba(13, 17, 23, 0.85)",
                              border: `2px solid ${isSelected ? C.gold : "rgba(255,255,255,0.6)"}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              zIndex: 2,
                            }}
                          >
                            <input
                              type="checkbox"
                              aria-label={`Select ${img.alt || "profile image"} for purge`}
                              checked={isSelected}
                              onChange={() => toggleImageSelection(img.id)}
                              style={{
                                width: 16,
                                height: 16,
                                margin: 0,
                                accentColor: C.gold,
                                cursor: "pointer",
                              }}
                            />
                          </label>
                          <div
                            style={{
                              position: "absolute",
                              top: 6,
                              right: 6,
                              padding: "2px 8px",
                              borderRadius: 12,
                              fontSize: 10,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              background: isAvail ? "rgba(16, 185, 129, 0.9)" : "rgba(239, 68, 68, 0.9)",
                              color: "#ffffff",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                            }}
                          >
                            {isAvail ? "Available" : "In Session"}
                          </div>
                        </div>

                        {/* Card Info & Controls */}
                        <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8, flex: 1, justifyContent: "space-between" }}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 11,
                              fontWeight: 600,
                              color: C.text,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={img.alt}
                          >
                            {img.alt || "Therapist Profile"}
                          </p>

                          {/* Action row: Toggle availability + Delete */}
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <button
                              onClick={() => toggleAvailability(img.id, img.availability || "available")}
                              title="Click to toggle availability"
                              style={{
                                flex: 1,
                                padding: "6px 8px",
                                borderRadius: 6,
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                border: isAvail ? "1px solid rgba(63, 185, 80, 0.5)" : "1px solid rgba(248, 81, 73, 0.5)",
                                background: isAvail ? "rgba(63, 185, 80, 0.15)" : "rgba(248, 81, 73, 0.15)",
                                color: isAvail ? "#3fb950" : "#f85149",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 4,
                                transition: "all 0.15s ease",
                              }}
                            >
                              <span style={{ fontSize: 9 }}>{isAvail ? "●" : "■"}</span>
                              <span>{isAvail ? "Set In-Session" : "Set Available"}</span>
                            </button>

                            <button
                              onClick={() => deleteGalleryImage(img.id)}
                              className="btn-danger"
                              title="Delete photo"
                              style={{
                                background: "rgba(218, 54, 51, 0.2)",
                                border: "1px solid rgba(218, 54, 51, 0.4)",
                                borderRadius: 6,
                                color: "#f85149",
                                padding: "6px 9px",
                                fontSize: 11,
                                cursor: "pointer",
                              }}
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ══ VIDEOS TAB ══ */}
            {tab === "videos" && (
              <div className="admin-pane">
                <SectionHead title="Gallery Videos" sub="Upload reels or link YouTube films here. These records are the only source of the Videos tab on /gallery — click Save Changes to publish." />

                <div className="video-toolbar" style={{ marginBottom: 16 }}>
                  <BtnGold onClick={()=>setShowAddVideo(!showAddVideo)}>{showAddVideo ? "✕ Cancel" : "+ Add Video"}</BtnGold>
                  <span style={{ fontSize: 11, color: C.muted }}>{videos.length} reel{videos.length === 1 ? "" : "s"} in the gallery</span>
                </div>

                {showAddVideo && (
                  <div className="admin-pane" style={{ background:C.surface, border:`1px solid ${C.gold}44`, borderRadius:10, padding:20, marginBottom:16 }}>
                    <p style={{ margin:"0 0 14px", fontSize:12, fontWeight:700, color:C.gold, textTransform:"uppercase" }}>New Video Reel</p>
                    <VideoFields
                      value={newVideo}
                      onChange={(patch)=>setNewVideo((current)=>({ ...current, ...patch }))}
                      onVideoFile={uploadNewVideoFile}
                      onPosterFile={uploadNewPosterFile}
                      videoBusy={newVideoUploading}
                      posterBusy={newPosterUploading}
                      resetKey={String(videoFormKey)}
                      idPrefix="new reel"
                    />
                    <BtnGold onClick={addVideo} disabled={newVideoUploading || newPosterUploading}>
                      {newVideoUploading || newPosterUploading ? "Uploading…" : "Save Reel"}
                    </BtnGold>
                  </div>
                )}

                {videos.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"60px 20px", color:C.muted }}>
                    <p style={{ fontSize:32, margin:"0 0 8px" }}>🎬</p>
                    <p style={{ fontSize:13 }}>No videos yet. Click “+ Add Video” to upload the first reel.</p>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {videos.map((video, i) => (
                      <div key={video.id} className="card adm video-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:16 }}>
                        <div className="video-toolbar">
                          <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
                            {video.poster && (
                              <img src={video.poster} alt="" style={{ width:96, height:54, objectFit:"cover", borderRadius:6, border:`1px solid ${C.border}`, flexShrink:0 }}
                                onError={(e:any)=>{ e.target.style.display="none"; }} />
                            )}
                            <div style={{ minWidth:0 }}>
                              <p style={{ margin:0, color:C.text, fontSize:13, fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{video.title || "Untitled reel"}</p>
                              <p style={{ margin:"3px 0 0", color:C.muted, fontSize:11 }}>{video.videoUrl ? "Hosted video" : video.youtubeId ? "YouTube film" : "No playable source"}</p>
                            </div>
                          </div>
                          <BtnOutline onClick={()=>deleteVideo(i)} style={{ color:C.danger }}>🗑 Delete</BtnOutline>
                        </div>
                        <VideoFields
                          value={video}
                          onChange={(patch)=>updateVideo(i, patch)}
                          onVideoFile={(file)=>changeVideoFile(i, file)}
                          onPosterFile={(file)=>changeVideoPoster(i, file)}
                          videoBusy={videoUploadIdx === i}
                          posterBusy={posterUploadIdx === i}
                          resetKey={`${video.id}-${videoUploadIdx === i ? "busy" : "idle"}`}
                          idPrefix={video.title || `reel ${i + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop:20 }}>
                  <BtnGold onClick={saveAll} disabled={saving}>{saving ? "Saving…" : "💾 Save All Changes"}</BtnGold>
                </div>
              </div>
            )}

            {/* ══ SERVICES TAB ══ */}
            {tab === "services" && (
              <div className="admin-pane">
                <SectionHead title="Services Page Treatments" sub="These cards and prices appear on /services only. Edit titles, descriptions, prices and card images, then click Save Changes." />

                <div className="svc-toolbar" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, gap:12 }}>
                  <BtnGold onClick={()=>setShowAddSvc(!showAddSvc)}>{showAddSvc ? "✕ Cancel" : "+ Add Treatment"}</BtnGold>
                  <input placeholder="🔍  Search treatments…" value={svcSearch} onChange={e=>setSvcSearch(e.target.value)}
                    style={{ flex:1, maxWidth:260, background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:"7px 12px", color:C.text, fontSize:12 }} />
                </div>

                {/* Add service form */}
                {showAddSvc && (
                  <div className="admin-pane" style={{ background:C.surface, border:`1px solid ${C.gold}44`, borderRadius:10, padding:20, marginBottom:16 }}>
                    <p style={{ margin:"0 0 14px", fontSize:12, fontWeight:700, color:C.gold, textTransform:"uppercase" }}>New Treatment</p>
                    <div className="adm svc-form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:12 }}>
                      <Input label="Title" placeholder="e.g. Hot Stone Massage" value={newSvc.title||""} onChange={(e:any)=>setNewSvc({...newSvc,title:e.target.value})} />
                      <Input label="Price (UGX)" type="number" value={newSvc.price||""} onChange={(e:any)=>setNewSvc({...newSvc,price:+e.target.value})} />
                      <div>
                        <Input label="Image URL / Path" placeholder="https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg" value={newSvc.image||""} onChange={(e:any)=>setNewSvc({...newSvc,image:e.target.value})} />
                        <label style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:6, padding:"5px 10px", borderRadius:6, border:`1px solid ${C.border}`, color:C.gold, fontSize:11, fontWeight:600, cursor:"pointer" }}>
                          {svcNewUploading ? "Uploading…" : "⬆ Upload image"}
                          <input type="file" accept="image/*" disabled={svcNewUploading} onChange={e=>uploadNewSvcImage(e.target.files?.[0])} style={{ display:"none" }} />
                        </label>
                      </div>
                    </div>
                    <Textarea label="Description" rows={2} placeholder="Describe this treatment…" value={newSvc.description||""} onChange={(e:any)=>setNewSvc({...newSvc,description:e.target.value})} />
                    <BtnGold onClick={addSvc}>Save Treatment</BtnGold>
                  </div>
                )}

                {/* Services list */}
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {/* Map over the FULL array first so `i` stays the real index even
                      while a search filter is active — otherwise edits/delete/image
                      uploads would hit the wrong service. */}
                  {services.map((svc,i)=>({svc,i})).filter(({svc})=>svc.title.toLowerCase().includes(svcSearch.toLowerCase())).map(({svc,i})=>(
                    <div key={i} className="card adm service-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"12px 16px", display:"flex", gap:12, alignItems:"center" }}>
                      <label title="Click to change this card's image" style={{ position:"relative", width:56, height:56, flexShrink:0, borderRadius:6, overflow:"hidden", border:`1px solid ${C.border}`, background:"#0a0d12", cursor:"pointer", display:"block" }}>
                        <img src={svc.image} alt={svc.title} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                          onError={(e:any)=>{ e.target.src="https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg"; }} />
                        <span style={{ position:"absolute", bottom:2, right:2, padding:"1px 4px", borderRadius:4, background:"rgba(13,17,23,0.85)", color:C.gold, fontSize:10, fontWeight:700, lineHeight:1.3 }}>✎</span>
                        {svcUploadIdx === i && (
                          <span style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.65)", color:C.gold, fontSize:9, fontWeight:700 }}>Uploading…</span>
                        )}
                        <input type="file" accept="image/*" disabled={svcUploadIdx === i} onChange={e=>changeSvcImage(i, e.target.files?.[0])} style={{ display:"none" }} />
                      </label>
                      <div style={{ flex:1, minWidth:0 }}>
                        <input value={svc.title} onChange={e=>updateSvc(i,"title",e.target.value)}
                          style={{ width:"100%", background:"transparent", border:"none", borderBottom:`1px solid transparent`, color:C.text, fontSize:13, fontWeight:600, padding:"2px 0" }}
                          onFocus={e=>(e.target.style.borderBottomColor=C.gold)} onBlur={e=>(e.target.style.borderBottomColor="transparent")} />
                        <input value={svc.description} onChange={e=>updateSvc(i,"description",e.target.value)}
                          style={{ width:"100%", background:"transparent", border:"none", color:C.muted, fontSize:11, padding:"2px 0", marginTop:3 }}
                          placeholder="Description…" />
                        <div style={{ marginTop:4, display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ fontSize:9, color:C.muted, fontWeight:600, textTransform:"uppercase", flexShrink:0 }}>Image</span>
                          <input value={svc.image||""} onChange={e=>updateSvc(i,"image",e.target.value)} placeholder="https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg" aria-label={`Image URL for ${svc.title}`}
                            style={{ flex:1, minWidth:0, background:C.bg, border:`1px solid ${C.border}`, borderRadius:5, padding:"4px 7px", color:C.muted, fontSize:10 }} />
                        </div>
                      </div>
                      <div className="svc-card-actions" style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                        <div>
                          <p style={{ margin:"0 0 2px", fontSize:9, color:C.muted, fontWeight:600, textTransform:"uppercase" }}>Price (UGX)</p>
                          <input type="number" aria-label={`Service price for ${svc.title}`} value={typeof svc.price==="number"?svc.price:parseInt(String(svc.price))||0} onChange={e=>updateSvc(i,"price",+e.target.value)}
                            style={{ width:110, background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 8px", color:C.gold, fontSize:12, fontWeight:700, textAlign:"right" }} />
                        </div>
                        <button onClick={()=>deleteSvc(i)} className="btn-danger" style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:6, color:C.danger, padding:"6px 10px", fontSize:12, cursor:"pointer" }}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:20 }}>
                  <BtnGold onClick={saveAll} disabled={saving}>{saving ? "Saving…" : "💾 Save All Changes"}</BtnGold>
                </div>
              </div>
            )}

            {/* ══ VIP TAB ══ */}
            {tab === "vip" && (
              <div className="admin-pane">
                <SectionHead title="VIP Packages" sub="These cards and prices appear on /vip-packages only. Price edits here never change the /services cards." />

                <div className="svc-toolbar" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, gap:12 }}>
                  <BtnGold onClick={()=>setShowAddVip(!showAddVip)}>{showAddVip ? "✕ Cancel" : "+ Add VIP Package"}</BtnGold>
                  <input placeholder="🔍  Search VIP packages…" value={vipSearch} onChange={e=>setVipSearch(e.target.value)}
                    style={{ flex:1, maxWidth:260, background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:"7px 12px", color:C.text, fontSize:12 }} />
                </div>

                {showAddVip && (
                  <div className="admin-pane" style={{ background:C.surface, border:`1px solid ${C.gold}44`, borderRadius:10, padding:20, marginBottom:16 }}>
                    <p style={{ margin:"0 0 14px", fontSize:12, fontWeight:700, color:C.gold, textTransform:"uppercase" }}>New VIP Package</p>
                    <div className="adm vip-form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:12 }}>
                      <Input label="Title" placeholder="e.g. 4hands Tantra Yoni" value={newVip.title||""} onChange={(e:any)=>setNewVip({...newVip,title:e.target.value})} />
                      <Input label="Price (UGX)" type="number" value={newVip.price||""} onChange={(e:any)=>setNewVip({...newVip,price:+e.target.value})} />
                      <div>
                        <Input label="Image URL / Path" placeholder="https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg" value={newVip.image||""} onChange={(e:any)=>setNewVip({...newVip,image:e.target.value})} />
                        <label style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:6, padding:"5px 10px", borderRadius:6, border:`1px solid ${C.border}`, color:C.gold, fontSize:11, fontWeight:600, cursor:"pointer" }}>
                          {vipNewUploading ? "Uploading…" : "⬆ Upload image"}
                          <input type="file" accept="image/*" disabled={vipNewUploading} onChange={e=>uploadNewVipImage(e.target.files?.[0])} style={{ display:"none" }} />
                        </label>
                      </div>
                    </div>
                    <Textarea label="Description" rows={2} placeholder="Describe this VIP package…" value={newVip.description||""} onChange={(e:any)=>setNewVip({...newVip,description:e.target.value})} />
                    <BtnGold onClick={addVip}>Save VIP Package</BtnGold>
                  </div>
                )}

                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {vipServices.map((svc,i)=>({svc,i})).filter(({svc})=>svc.title.toLowerCase().includes(vipSearch.toLowerCase())).map(({svc,i})=>(
                    <div key={i} className="card adm service-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"12px 16px", display:"flex", gap:12, alignItems:"center" }}>
                      <label title="Click to change this card's image" style={{ position:"relative", width:56, height:56, flexShrink:0, borderRadius:6, overflow:"hidden", border:`1px solid ${C.border}`, background:"#0a0d12", cursor:"pointer", display:"block" }}>
                        <img src={svc.image} alt={svc.title} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                          onError={(e:any)=>{ e.target.src="https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg"; }} />
                        <span style={{ position:"absolute", bottom:2, right:2, padding:"1px 4px", borderRadius:4, background:"rgba(13,17,23,0.85)", color:C.gold, fontSize:10, fontWeight:700, lineHeight:1.3 }}>✎</span>
                        {vipUploadIdx === i && (<span style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.65)", color:C.gold, fontSize:9, fontWeight:700 }}>Uploading…</span>)}
                        <input type="file" accept="image/*" disabled={vipUploadIdx === i} onChange={e=>changeVipImage(i, e.target.files?.[0])} style={{ display:"none" }} />
                      </label>
                      <div style={{ flex:1, minWidth:0 }}>
                        <input value={svc.title} onChange={e=>updateVip(i,"title",e.target.value)}
                          style={{ width:"100%", background:"transparent", border:"none", borderBottom:"1px solid transparent", color:C.text, fontSize:13, fontWeight:600, padding:"2px 0" }}
                          onFocus={e=>(e.target.style.borderBottomColor=C.gold)} onBlur={e=>(e.target.style.borderBottomColor="transparent")} />
                        <input value={svc.description} onChange={e=>updateVip(i,"description",e.target.value)}
                          style={{ width:"100%", background:"transparent", border:"none", color:C.muted, fontSize:11, padding:"2px 0", marginTop:3 }}
                          placeholder="Description…" />
                      </div>
                      <div className="svc-card-actions" style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                        <div>
                          <p style={{ margin:"0 0 2px", fontSize:9, color:C.muted, fontWeight:600, textTransform:"uppercase" }}>VIP Price (UGX)</p>
                          <input type="number" aria-label={`VIP price for ${svc.title}`} value={typeof svc.price==="number"?svc.price:parseServicePrice(svc.price)||0} onChange={e=>updateVip(i,"price",+e.target.value)}
                            style={{ width:110, background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 8px", color:C.gold, fontSize:12, fontWeight:700, textAlign:"right" }} />
                        </div>
                        <button onClick={()=>deleteVip(i)} className="btn-danger" style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:6, color:C.danger, padding:"6px 10px", fontSize:12, cursor:"pointer" }}>🗑</button>
                      </div>
                    </div>
                  ))}
                  {vipServices.length === 0 && <p style={{ color:C.muted, fontSize:12 }}>No VIP packages yet. Add one above.</p>}
                </div>
                <div style={{ marginTop:20 }}>
                  <BtnGold onClick={saveAll} disabled={saving}>{saving ? "Saving…" : "💾 Save All Changes"}</BtnGold>
                </div>
              </div>
            )}

            {/* ══ MOBILE MASSAGE TAB ══ */}
            {tab === "mobile" && (
              <div className="admin-pane">
                <SectionHead title="Mobile Massage Page" sub="Add any service or VIP option to /mobile-massage. Prices edited here are a separate mobile price and never change /services or /vip-packages." />

                <div className="mobile-panel-grid">
                  <div className="admin-pane" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
                    <p style={{ margin:"0 0 12px", fontSize:12, fontWeight:700, color:C.gold, textTransform:"uppercase" }}>All Services &amp; VIP Options</p>
                    <input placeholder="🔍  Search all options…" value={mobileSearch} onChange={e=>setMobileSearch(e.target.value)}
                      style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 12px", color:C.text, fontSize:12, marginBottom:12 }} />
                    <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:520, overflowY:"auto" }}>
                      {mobileOptions.map(({svc,i,label}) => {
                        const alreadyAdded = mobileMassage.some(card => titleKey(card.title) === titleKey(svc.title));
                        const priceNum = parseServicePrice(svc.price);
                        return (
                          <div key={`${label}-${i}`} className="card adm mobile-option-card" style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:10 }}>
                            <img src={svc.image} alt="" style={{ width:44, height:44, borderRadius:6, objectFit:"cover", flexShrink:0 }}
                              onError={(e:any)=>{ e.target.src="https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg"; }} />
                            <div style={{ flex:1, minWidth:0 }}>
                              <strong style={{ display:"block", color:C.text, fontSize:12 }}>{svc.title}</strong>
                              <span style={{ color:C.muted, fontSize:10 }}>{label} · {Number.isNaN(priceNum) ? String(svc.price) : `UGX ${priceNum.toLocaleString()}`}</span>
                            </div>
                            <BtnOutline onClick={()=>addToMobile(svc)} disabled={alreadyAdded}
                              style={{ color:alreadyAdded?C.success:C.gold, borderColor:alreadyAdded?`${C.success}66`:`${C.gold}66`, fontSize:10, padding:"6px 8px", opacity:alreadyAdded?0.85:1 }}>
                              {alreadyAdded ? "✓ Added" : "+ Add to Mobile Massage"}
                            </BtnOutline>
                          </div>
                        );
                      })}
                      {mobileOptions.length === 0 && <p style={{ color:C.muted, fontSize:12 }}>No options match that search.</p>}
                    </div>
                  </div>

                  <div className="admin-pane" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
                    <p style={{ margin:"0 0 12px", fontSize:12, fontWeight:700, color:C.gold, textTransform:"uppercase" }}>Selected for /mobile-massage ({mobileMassage.length})</p>
                    {mobileMassage.length === 0 ? (
                      <p style={{ color:C.muted, fontSize:12 }}>No treatments selected yet. Use “Add to Mobile Massage” on the left.</p>
                    ) : (
                      <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:520, overflowY:"auto" }}>
                        {mobileMassage.map((card,i)=>(
                          <div key={`${card.title}-${i}`} className="card adm service-card" style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:10, display:"flex", gap:10, alignItems:"center" }}>
                            <img src={card.image} alt="" style={{ width:48, height:48, borderRadius:6, objectFit:"cover", flexShrink:0 }}
                              onError={(e:any)=>{ e.target.src="https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg"; }} />
                            <div style={{ flex:1, minWidth:0 }}>
                              <strong style={{ display:"block", color:C.text, fontSize:12 }}>{card.title}</strong>
                              <span style={{ color:C.muted, fontSize:10 }}>{card.description}</span>
                            </div>
                            <div className="svc-card-actions" style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                              <div>
                                <p style={{ margin:"0 0 2px", fontSize:9, color:C.muted, fontWeight:600, textTransform:"uppercase" }}>Mobile Price</p>
                                <input type="number" aria-label={`Mobile price for ${card.title}`} value={typeof card.price==="number"?card.price:parseServicePrice(card.price)||0} onChange={e=>updateMobilePrice(i,+e.target.value)}
                                  style={{ width:100, background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 7px", color:C.gold, fontSize:12, fontWeight:700, textAlign:"right" }} />
                              </div>
                              <button onClick={()=>removeFromMobile(i)} className="btn-danger" title="Remove from mobile page"
                                style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:6, color:C.danger, padding:"6px 8px", fontSize:11, cursor:"pointer" }}>✕</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ marginTop:20 }}>
                  <BtnGold onClick={saveAll} disabled={saving}>{saving ? "Saving…" : "💾 Save All Changes"}</BtnGold>
                </div>
              </div>
            )}

            {/* ══ ESCORTS TAB ══ */}
            {tab === "escorts" && (
              <div className="admin-pane">
                <SectionHead title="Escort Profile Cards" sub="Add, edit and reorder companions shown on /escorts. Each profile page uses her own gallery/video URLs when set; leave them blank to use the curated spa set. Click Save Changes." />

                <div className="escort-toolbar" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, gap:12 }}>
                  <BtnGold onClick={()=>setShowAddEscort(!showAddEscort)}>{showAddEscort ? "✕ Cancel" : "+ Add Companion"}</BtnGold>
                  <input placeholder="🔍  Search companions…" value={escortSearch} onChange={e=>setEscortSearch(e.target.value)}
                    style={{ flex:1, maxWidth:260, background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:"7px 12px", color:C.text, fontSize:12 }} />
                </div>

                {showAddEscort && (
                  <div className="admin-pane" style={{ background:C.surface, border:`1px solid ${C.gold}44`, borderRadius:10, padding:20, marginBottom:16 }}>
                    <p style={{ margin:"0 0 14px", fontSize:12, fontWeight:700, color:C.gold, textTransform:"uppercase" }}>New Companion</p>
                    <div className="adm escort-form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:12 }}>
                      <Input label="Name *" placeholder="e.g. Sophia" value={newEscort.name||""} onChange={(e:any)=>setNewEscort({...newEscort,name:e.target.value})} />
                      <Input label="Title" placeholder="Elite Companion" value={newEscort.title||""} onChange={(e:any)=>setNewEscort({...newEscort,title:e.target.value})} />
                      <Input label="Specialty" placeholder="Fine Dining & Corporate Events" value={newEscort.specialty||""} onChange={(e:any)=>setNewEscort({...newEscort,specialty:e.target.value})} />
                      <div>
                        <Input label="Image URL / Path" placeholder="https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg" value={newEscort.image||""} onChange={(e:any)=>setNewEscort({...newEscort,image:e.target.value})} />
                        <label style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:6, padding:"5px 10px", borderRadius:6, border:`1px solid ${C.border}`, color:C.gold, fontSize:11, fontWeight:600, cursor:"pointer" }}>
                          {escortNewUploading ? "Uploading…" : "⬆ Upload image"}
                          <input type="file" accept="image/*" disabled={escortNewUploading} onChange={e=>uploadNewEscortImage(e.target.files?.[0])} style={{ display:"none" }} />
                        </label>
                      </div>
                      <div>
                        <label style={{ display:"block", fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:5 }}>Status</label>
                        <select value={newEscort.availability||"available"} onChange={(e:any)=>setNewEscort({...newEscort,availability:e.target.value as Companion["availability"]})}
                          style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 12px", color:C.text, fontSize:13 }}>
                          <option value="available">Available</option>
                          <option value="in-session">Currently Engaged</option>
                        </select>
                      </div>
                    </div>
                    <Textarea label="Description" rows={2} placeholder="Describe this companion…" value={newEscort.description||""} onChange={(e:any)=>setNewEscort({...newEscort,description:e.target.value})} />
                    <Textarea label="Gallery image URLs (one per line)" rows={2} placeholder="https://.../media/image/.../photo.jpg" value={(newEscort.gallery||[]).join("\n")} onChange={(e:any)=>setNewEscort({...newEscort,gallery:parseLines(e.target.value)})} />
                    <Textarea label="Videos — Title | YouTube ID (one per line)" rows={2} placeholder="Private dinner tour | abc123xyz" value={videoLines(newEscort.videos)} onChange={(e:any)=>setNewEscort({...newEscort,videos:parseEscortVideos(e.target.value)})} />
                    <p style={{ fontSize: 10, color: C.muted, margin: "-6px 0 12px" }}>Leave media blank to use the curated spa gallery and reels on her profile page.</p>
                    <BtnGold onClick={addEscort}>Save Companion</BtnGold>
                  </div>
                )}

                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {escorts.map((c,i)=>({c,i})).filter(({c})=>c.name.toLowerCase().includes(escortSearch.toLowerCase())).map(({c,i})=>(
                    <div key={i} className="card adm escort-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"12px 16px", display:"flex", gap:12, alignItems:"center" }}>
                      <label title="Click to change this card's image" style={{ position:"relative", width:64, height:64, flexShrink:0, borderRadius:6, overflow:"hidden", border:`1px solid ${C.border}`, background:"#0a0d12", cursor:"pointer", display:"block" }}>
                        <img src={c.image} alt={c.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                          onError={(e:any)=>{ e.target.src="https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg"; }} />
                        <span style={{ position:"absolute", bottom:2, right:2, padding:"1px 4px", borderRadius:4, background:"rgba(13,17,23,0.85)", color:C.gold, fontSize:10, fontWeight:700, lineHeight:1.3 }}>✎</span>
                        {escortUploadIdx === i && (
                          <span style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.65)", color:C.gold, fontSize:9, fontWeight:700 }}>Uploading…</span>
                        )}
                        <input type="file" accept="image/*" disabled={escortUploadIdx === i} onChange={e=>changeEscortImage(i, e.target.files?.[0])} style={{ display:"none" }} />
                      </label>
                      <div style={{ flex:1, minWidth:0 }}>
                        <input value={c.name} onChange={e=>updateEscort(i,"name",e.target.value)} aria-label={`Name for companion ${i+1}`}
                          style={{ width:"100%", background:"transparent", border:"none", borderBottom:`1px solid transparent`, color:C.text, fontSize:13, fontWeight:600, padding:"2px 0" }}
                          onFocus={e=>(e.target.style.borderBottomColor=C.gold)} onBlur={e=>(e.target.style.borderBottomColor="transparent")} />
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:4 }}>
                          <input value={c.title} onChange={e=>updateEscort(i,"title",e.target.value)} aria-label={`Title for ${c.name}`} placeholder="Title"
                            style={{ width:"100%", minWidth:0, background:C.bg, border:`1px solid ${C.border}`, borderRadius:5, padding:"4px 7px", color:C.text, fontSize:11 }} />
                          <input value={c.specialty} onChange={e=>updateEscort(i,"specialty",e.target.value)} aria-label={`Specialty for ${c.name}`} placeholder="Specialty"
                            style={{ width:"100%", minWidth:0, background:C.bg, border:`1px solid ${C.border}`, borderRadius:5, padding:"4px 7px", color:C.text, fontSize:11 }} />
                        </div>
                        <input value={c.description} onChange={e=>updateEscort(i,"description",e.target.value)} aria-label={`Description for ${c.name}`} placeholder="Description…"
                          style={{ width:"100%", background:"transparent", border:"none", color:C.muted, fontSize:11, padding:"2px 0", marginTop:3 }} />
                        <div style={{ marginTop:4, display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ fontSize:9, color:C.muted, fontWeight:600, textTransform:"uppercase", flexShrink:0 }}>Image</span>
                          <input value={c.image||""} onChange={e=>updateEscort(i,"image",e.target.value)} placeholder="https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg" aria-label={`Image URL for ${c.name}`}
                            style={{ flex:1, minWidth:0, background:C.bg, border:`1px solid ${C.border}`, borderRadius:5, padding:"4px 7px", color:C.muted, fontSize:10 }} />
                        </div>
                        <textarea rows={2} value={(c.gallery||[]).join("\n")} onChange={e=>updateEscort(i,"gallery",parseLines(e.target.value))}
                          aria-label={`Gallery image URLs for ${c.name}`} placeholder="Gallery URLs, one per line (blank = curated spa set)"
                          style={{ width:"100%", minWidth:0, boxSizing:"border-box", background:C.bg, border:`1px solid ${C.border}`, borderRadius:5, padding:"5px 7px", color:C.muted, fontSize:10, marginTop:5, resize:"vertical" }} />
                        <textarea rows={2} value={videoLines(c.videos)} onChange={e=>updateEscort(i,"videos",parseEscortVideos(e.target.value))}
                          aria-label={`Videos for ${c.name}`} placeholder="Videos: Title | YouTube ID, one per line"
                          style={{ width:"100%", minWidth:0, boxSizing:"border-box", background:C.bg, border:`1px solid ${C.border}`, borderRadius:5, padding:"5px 7px", color:C.muted, fontSize:10, marginTop:5, resize:"vertical" }} />
                      </div>
                      <div className="escort-card-actions" style={{ display:"flex", flexDirection:"column", gap:8, flexShrink:0 }}>
                        <select value={c.availability} onChange={e=>updateEscort(i,"availability",e.target.value as Companion["availability"])} aria-label={`Status for ${c.name}`}
                          style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 8px", color:c.availability==="available"?C.success:C.danger, fontSize:11, fontWeight:700 }}>
                          <option value="available">Available</option>
                          <option value="in-session">Engaged</option>
                        </select>
                        <button onClick={()=>deleteEscort(i)} className="btn-danger" style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:6, color:C.danger, padding:"6px 10px", fontSize:12, cursor:"pointer" }}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:20 }}>
                  <BtnGold onClick={saveAll} disabled={saving}>{saving ? "Saving…" : "💾 Save All Changes"}</BtnGold>
                </div>
              </div>
            )}

            {/* ══ BLOG TAB ══ */}
            {tab === "blog" && (
              <div className="admin-pane">
                <SectionHead title="Blog Posts" sub="Publish and manage articles shown on the blog page." />

                <div style={{ marginBottom:16 }}>
                  <BtnGold onClick={()=>setShowAddBlog(!showAddBlog)}>{showAddBlog ? "✕ Cancel" : "+ New Post"}</BtnGold>
                </div>

                {showAddBlog && (
                  <div className="admin-pane" style={{ background:C.surface, border:`1px solid ${C.gold}44`, borderRadius:10, padding:20, marginBottom:20 }}>
                    <p style={{ margin:"0 0 16px", fontSize:12, fontWeight:700, color:C.gold, textTransform:"uppercase" }}>New Blog Post</p>
                    <form onSubmit={addBlog}>
                      <div className="adm blog-form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                        <Input label="Title *" required placeholder="e.g. Benefits of Aromatherapy" value={newBlog.title||""} onChange={(e:any)=>setNewBlog({...newBlog,title:e.target.value})} />
                        <Input label="Author" placeholder="Admin" value={newBlog.author||""} onChange={(e:any)=>setNewBlog({...newBlog,author:e.target.value})} />
                      </div>
                      <Input label="Short Excerpt" placeholder="A brief teaser shown on the blog card…" value={newBlog.excerpt||""} onChange={(e:any)=>setNewBlog({...newBlog,excerpt:e.target.value})} />
                      <Textarea label="Full Content *" required rows={5} placeholder="Write the full article here…" value={newBlog.content||""} onChange={(e:any)=>setNewBlog({...newBlog,content:e.target.value})} />
                      <div className="adm blog-form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                        <div>
                          <label style={{ display:"block", fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Cover Image</label>
                          <input type="file" accept="image/*" onChange={e=>{
                            const f = e.target.files?.[0];
                            if (blogPreview) URL.revokeObjectURL(blogPreview);
                            if (f) { setBlogFile(f); setBlogPreview(URL.createObjectURL(f)); }
                            else { setBlogFile(null); setBlogPreview(null); }
                          }}
                            style={{ width:"100%", fontSize:12, color:C.muted, background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, padding:"7px 10px" }} />
                          {blogPreview && (
                            <div style={{ marginTop:10 }}>
                              <p style={{ margin:"0 0 6px", fontSize:10, fontWeight:700, color:C.gold, letterSpacing:"0.06em", textTransform:"uppercase" }}>
                                Cover preview — full image, not cropped
                              </p>
                              <img src={blogPreview} alt="Cover image preview"
                                style={{ display:"block", width:"100%", maxHeight:240, objectFit:"contain",
                                  background:"#0b0f14", border:`1px solid ${C.border}`, borderRadius:6 }} />
                            </div>
                          )}
                        </div>
                        <Input label="Date" value={newBlog.date||""} onChange={(e:any)=>setNewBlog({...newBlog,date:e.target.value})} />
                      </div>
                      <div style={{ marginTop:4 }}>
                        <BtnGold type="submit" disabled={blogUploading}>{blogUploading ? "Publishing…" : "✓ Publish Post"}</BtnGold>
                      </div>
                    </form>
                  </div>
                )}

                {blogs.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"60px 20px", color:C.muted }}>
                    <p style={{ fontSize:32, margin:"0 0 8px" }}>📝</p>
                    <p style={{ fontSize:13 }}>No blog posts yet. Click "+ New Post" to get started.</p>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {blogs.map(post=>(
                      <div key={post.id} className="card adm blog-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"12px 16px", display:"flex", gap:14, alignItems:"center", overflow:"hidden" }}>
                        {post.image && <img src={post.image} alt={post.title} style={{ width:64, height:48, objectFit:"cover", borderRadius:6, border:`1px solid ${C.border}`, flexShrink:0 }} onError={(e:any)=>{e.target.style.display="none";}} />}
                        <div style={{ flex:1, minWidth:0, width:"100%" }}>
                          <p style={{ margin:0, fontWeight:700, fontSize:13, color:C.text, lineHeight:1.35, overflowWrap:"anywhere", wordBreak:"break-word" }}>{post.title}</p>
                          <p style={{ margin:"3px 0 0", fontSize:11, color:C.gold, overflowWrap:"anywhere" }}>{post.date} · by {post.author}</p>
                          <p className="line-clamp2" style={{ margin:"4px 0 0", fontSize:11, color:C.muted, overflowWrap:"anywhere", wordBreak:"break-word" }}>{post.excerpt||post.content?.substring(0,100)}</p>
                        </div>
                        <button onClick={()=>deleteBlog(post.id)} className="btn-danger" style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:6, color:C.danger, padding:"6px 10px", fontSize:12, cursor:"pointer", flexShrink:0 }}>🗑</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══ BOOKINGS TAB ══ */}
            {tab === "bookings" && (
              <div className="admin-pane">
                <SectionHead title="Bookings" sub="Live bookings from the payments service. A booking is only marked Confirmed after PawaPay verifies the payment." />

                {refunds.length > 0 && (
                  <div style={{ background:"#f59e0b1c", border:"1px solid #f59e0b55", borderRadius:8, padding:"12px 14px", marginBottom:16 }}>
                    <div style={{ color:C.gold, fontWeight:700, fontSize:12, marginBottom:8 }}>
                      ⚠ {refunds.length} payment{refunds.length === 1 ? "" : "s"} received after cancellation — refund required in PawaPay
                    </div>
                    {refunds.map(r => (
                      <div key={r.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, fontSize:11, color:C.text, padding:"6px 0", borderTop:"1px solid #f59e0b33", flexWrap:"wrap" }}>
                        <span>Deposit {r.deposit_id} · {Number(r.amount_ugx||0).toLocaleString()} UGX · {r.reason || "payment after cancellation"}</span>
                        <button onClick={()=>markRefund(r.deposit_id)} disabled={markingRefund===r.deposit_id}
                          style={{ background:"transparent", border:`1px solid ${C.gold}`, borderRadius:6, color:C.gold, padding:"4px 10px", fontSize:11, cursor:"pointer" }}>
                          {markingRefund === r.deposit_id ? "…" : "Mark refunded"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, flexWrap:"wrap" }}>
                  <select value={bookingStatus} onChange={e=>{ setBookingStatus(e.target.value); loadBookings(e.target.value); }}
                    style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:"7px 10px", color:C.text, fontSize:12 }}>
                    <option value="">All statuses</option>
                    <option value="PENDING_PAYMENT">Pending payment</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <BtnOutline onClick={()=>loadBookings()} disabled={bookingsLoading} style={{ padding:"6px 12px", fontSize:11 }}>↻ Refresh</BtnOutline>
                  <span style={{ fontSize:11, color:C.muted }}>{bookings.length} shown</span>
                </div>

                {bookingsError && (
                  <div style={{ background:"#f8514922", border:"1px solid #f8514944", borderRadius:6, padding:"10px 14px", color:C.danger, fontSize:12, marginBottom:14 }}>{bookingsError}</div>
                )}

                {bookingsLoading ? (
                  <div style={{ textAlign:"center", padding:40, color:C.muted, fontSize:12 }}>Loading bookings…</div>
                ) : bookings.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"60px 20px", color:C.muted }}>
                    <p style={{ fontSize:32, margin:"0 0 8px" }}>📅</p>
                    <p style={{ fontSize:13 }}>No bookings found.</p>
                  </div>
                ) : (
                  <div className="adm bookings-table" style={{ overflowX:"auto", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10 }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                      <thead>
                        <tr style={{ textAlign:"left", color:C.muted, fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                          <th style={{ padding:"10px 12px" }}>Date / Time</th>
                          <th style={{ padding:"10px 12px" }}>Service</th>
                          <th style={{ padding:"10px 12px" }}>Client</th>
                          <th style={{ padding:"10px 12px" }}>Phone</th>
                          <th style={{ padding:"10px 12px" }}>Amount</th>
                          <th style={{ padding:"10px 12px" }}>Status</th>
                          <th style={{ padding:"10px 12px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => {
                          const statusColor = b.status === "CONFIRMED" ? C.success : b.status === "PENDING_PAYMENT" ? C.gold : C.muted;
                          return (
                            <tr key={b.id} style={{ borderTop:`1px solid ${C.border}` }}>
                              <td style={{ padding:"10px 12px", whiteSpace:"nowrap" }}>
                                {b.booking_date}<br/><span style={{ color:C.muted }}>{b.booking_time}</span>
                              </td>
                              <td style={{ padding:"10px 12px" }}>
                                {b.service_title}
                                {b.notes && <><br/><span style={{ color:C.muted, fontSize:10 }} title={b.notes}>📝 {b.notes.slice(0,40)}{b.notes.length > 40 ? "…" : ""}</span></>}
                              </td>
                              <td style={{ padding:"10px 12px" }}>
                                {b.customer_name}
                                {b.customer_email && <><br/><span style={{ color:C.muted }}>{b.customer_email}</span></>}
                              </td>
                              <td style={{ padding:"10px 12px", whiteSpace:"nowrap" }}>{b.customer_phone}</td>
                              <td style={{ padding:"10px 12px", color:C.gold, fontWeight:700, whiteSpace:"nowrap" }}>{Number(b.amount_ugx || 0).toLocaleString()}</td>
                              <td style={{ padding:"10px 12px" }}>
                                <span style={{ color:statusColor, fontWeight:700, fontSize:11 }}>{b.status.replace("_", " ")}</span>
                              </td>
                              <td style={{ padding:"10px 12px", textAlign:"right" }}>
                                {(b.status === "PENDING_PAYMENT" || b.status === "CONFIRMED") && (
                                  <button onClick={()=>cancelBooking(b.id)} disabled={cancellingId===b.id}
                                    style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:6, color:C.danger, padding:"5px 10px", fontSize:11, cursor:"pointer" }}>
                                    {cancellingId === b.id ? "…" : "Cancel"}
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ══ SETTINGS TAB ══ */}
            {tab === "info" && siteContent && (
              <div className="admin-pane">
                <SectionHead title="Spa Settings" sub="Update contact details, phone numbers and location across the entire website." />
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:24, maxWidth:600 }}>
                  <div className="adm settings-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:4 }}>
                    <Input label="WhatsApp Number" placeholder="+256781945510" value={siteContent.contact?.spa?.whatsapp||""}
                      onChange={(e:any)=>{ const c={...siteContent}; if(!c.contact)c.contact={}; if(!c.contact.spa)c.contact.spa={}; c.contact.spa.whatsapp=e.target.value; setSiteContent(c); }} />
                    <Input label="Phone Line" placeholder="+256764001922" value={siteContent.contact?.spa?.phone||""}
                      onChange={(e:any)=>{ const c={...siteContent}; if(!c.contact)c.contact={}; if(!c.contact.spa)c.contact.spa={}; c.contact.spa.phone=e.target.value; setSiteContent(c); }} />
                  </div>
                  <Input label="Location / Address" placeholder="Sir Apollo Kaggwa Rd & Mengo, Kampala" value={siteContent.homepage?.spaContent?.location||""}
                    onChange={(e:any)=>{ const c={...siteContent}; if(!c.homepage)c.homepage={}; if(!c.homepage.spaContent)c.homepage.spaContent={}; c.homepage.spaContent.location=e.target.value; setSiteContent(c); }} />
                  <Input label="Spa Tagline" placeholder="Oasis of Relaxation in Kampala" value={siteContent.homepage?.spaContent?.tagline||""}
                    onChange={(e:any)=>{ const c={...siteContent}; if(!c.homepage)c.homepage={}; if(!c.homepage.spaContent)c.homepage.spaContent={}; c.homepage.spaContent.tagline=e.target.value; setSiteContent(c); }} />
                  <div style={{ marginTop:8, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
                    <BtnGold onClick={saveAll} disabled={saving}>{saving ? "Saving…" : "Save Settings"}</BtnGold>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
