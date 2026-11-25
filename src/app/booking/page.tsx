"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";
import { useSiteContact } from "@/components/ContactProvider";
import {
  fetchSiteContent,
  getCachedSiteContent,
  splitServiceCatalog,
  orderServices,
  parseServicePrice,
  isRealServiceTitle,
} from "@/lib/service-order";
import QRCode from "qrcode";

/* ─── Real Services Catalog (Mirrored from active R2 catalog) ───────────── */
const SERVICES = [
  { name: "Swedish Massage", price: 150000 },
  { name: "Body Scrubs", price: 150000 },
  { name: "Sports Massage", price: 150000 },
  { name: "Signature Massage", price: 150000 },
  { name: "Deeptissue Massage", price: 180000 },
  { name: "Aromatherapy", price: 200000 },
  { name: "Hotstone Massage", price: 200000 },
  { name: "B2b Nuru Massage", price: 200000 },
  { name: "Body Care Package", price: 200000 },
  { name: "Erotic & Body to Body", price: 250000 },
  { name: "Womens' Packages", price: 250000 },
  { name: "Couples Massage", price: 250000 },
  { name: "4hands Essential Oils", price: 300000 },
  { name: "6hands Swedish", price: 300000 },
  { name: "Full Service Pack", price: 300000 },
  { name: "Xclusive Sessions", price: 300000 },
  { name: "Tantra Massage", price: 350000 },
  { name: "Turkish Bath Packages", price: 350000 },
  { name: "Body Care Packages", price: 400000 },
  { name: "Kamasutra Session", price: 400000 },
  { name: "Premium Body Care Pack", price: 400000 },
  { name: "4hands Nuru | B2b", price: 450000 },
  { name: "6hands Erotic", price: 450000 },
  { name: "Couples | Duo Packages", price: 450000 },
  { name: "Classical Body Care Pack", price: 500000 },
  { name: "Affluent Body Care Pack", price: 600000 },
  { name: "4hands Full Service", price: 650000 },
  { name: "4hands Tantra | Yoni", price: 750000 },
  { name: "6hands Full Service", price: 900000 },
  { name: "6hands Kamasutra", price: 1200000 },
];

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM",
  "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM", "08:00 PM",
  "09:00 PM", "10:00 PM",
];

const EMAIL = "theserenitybookings@gmail.com";

// Real booking + MTN/Airtel payment API (Cloudflare Worker). The PawaPay
// callback URL registered in the dashboard points to this same host.
const PAY_API = (
  process.env.NEXT_PUBLIC_PAY_API_URL ||
  "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev"
).replace(/\/$/, "");
const MAX_LEAD_DAYS = 90;
const MIN_LEAD_MINUTES = 30;

function to24Hour(value: string) {
  const m = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return value;
  let h = parseInt(m[1], 10) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

function formatPrice(p: number | string) {
  const num = typeof p === "number" ? p : parseInt(String(p).replace(/\D/g, ""), 10);
  return isNaN(num) ? String(p) : `UGX ${num.toLocaleString()}`;
}

// Kampala is UTC+3 year-round. Using UTC "today" would offer yesterday's date
// between midnight and 3am local time.
function kampalaNow() {
  const d = new Date(Date.now() + 3 * 60 * 60 * 1000);
  return {
    date: d.toISOString().slice(0, 10),
    minutes: d.getUTCHours() * 60 + d.getUTCMinutes(),
  };
}

function getTodayString() {
  return kampalaNow().date;
}

function slotMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

// Ugandan MoMo prefixes. Used to catch a wrong-network number in the browser
// before a booking is created or PawaPay is called.
function detectProvider(phone: string): "MTN" | "AIRTEL" | null {
  let p = String(phone || "").replace(/\D/g, "");
  if (p.startsWith("0")) p = "256" + p.slice(1);
  if (p.startsWith("2560")) p = "256" + p.slice(4);
  if (!/^256\d{9}$/.test(p)) return null;
  const prefix = p.slice(3, 5);
  if (["76", "77", "78", "79"].includes(prefix)) return "MTN";
  if (["70", "74", "75"].includes(prefix)) return "AIRTEL";
  return null;
}

const PROVIDER_LABEL = { MTN: "MTN MoMo", AIRTEL: "Airtel Money" } as const;

/* ── Service-aware booking backdrop (Current R2 Service Card Images) ─────── */
const DEFAULT_SERVICE_IMAGES: Record<string, string> = {
  swedishmassage: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/27ebf3bad7a048059646f41800777eb3.jpg",
  bodyscrubs: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/a4202e3dba3f45a5adc609d73d826b52.jpg",
  sportsmassage: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/ef2a0f99592c468faf41f9d2bcf82724.jpg",
  signaturemassage: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/855693080da1488c8c6df52d99a89899.jpg",
  deeptissuemassage: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/eab8a1b1a3084ce3aab8e3cbc4af3d38.jpg",
  aromatherapy: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/63c5e661ef434046858deeeca8c7b6c1.jpg",
  hotstonemassage: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/ffb4f235c4ad491484fe238488450159.jpg",
  b2bnurumassage: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/f7a55b43277a4ef7a41171fbec3f87c7.jpg",
  bodycarepackage: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/2685b0d96a444b9983b2c80e57beb5b1.jpg",
  eroticandbodytobody: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/611c06b7c82e44bba50d3c234d0d3dae.jpg",
  womenspackages: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/77ca840fad26468dbfb3bcdf8cb2ed1f.jpg",
  couplesmassage: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/454275185d6542b9ba21c4d05c15d3ca.jpg",
  xclusivesessions: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/5970ec8c035c4cbcbb09ae059dae419b.jpg",
  "4handsessentialoils": "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/1ca61031c6c24b20bbc209c3803a0c92.jpg",
  "6handsswedish": "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/53e19ce0e3f64298a887ab591d44fdd8.jpg",
  fullservicepack: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/054971eef38c4d4fbffd6902470959e4.jpg",
  turkishbathpackages: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/48df454ae21443a5a0715566dc67335f.jpg",
  tantramassage: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/c9a5fe71766342d8a3e35f25f5fa1aab.jpg",
  bodycarepackages: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/64700756945f48d58f9c52095678a6d3.jpg",
  kamasutrasession: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/a20440f0e12a44cbb448461ce498c822.jpg",
  premiumbodycarepack: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/e6bcea39a9c941af9fef9928e4e4d501.jpg",
  couplesduopackages: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/8af83a2289e54b40bf04a097c913b3d9.jpg",
  "4handsnurub2b": "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/223a117ff63247178e1c7fe7cf1cb65c.jpg",
  "6handserotic": "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/ab0f142da190494f8a5a8b2eb91b57c5.jpg",
  classicalbodycarepack: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/1fc4ceed670f44b0aed17a32d0dd6830.jpg",
  affluentbodycarepack: "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/0cef2801727a47f1a23c887359c42593.jpg",
  "4handsfullservice": "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/63a618e3561a4d1185a999600ea7b373.jpg",
  "4handstantrayoni": "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/a741a9a1dcb44b47a93e23156d080106.jpg",
  "6handsfullservice": "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/98a02d66f2854284b2b35127b82384a1.jpg",
  "6handskamasutra": "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev/media/image/2026/11/4e454fa677c243e88fe983e4f6f256e3.jpg",
};

const BOOKING_FALLBACK_IMAGE = DEFAULT_SERVICE_IMAGES.swedishmassage;

function serviceImageKey(title: unknown) {
  return String(title || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "");
}

const SERVICE_IMAGE_ALIASES: Record<string, string> = {
  deeptissue: "deeptissuemassage",
  fourhandsessentialoils: "4handsessentialoils",
  sixhandsswedish: "6handsswedish",
  fourhandsnurub2b: "4handsnurub2b",
  fourhandsnuru: "4handsnurub2b",
  sixhandserotic: "6handserotic",
  fourhandsfullservice: "4handsfullservice",
  fourhandstantrayoni: "4handstantrayoni",
  sixhandsfullservice: "6handsfullservice",
  sixhandskamasutra: "6handskamasutra",
  b2bnuru: "b2bnurumassage",
  nurub2b: "b2bnurumassage",
  eroticmassage: "eroticandbodytobody",
  bodytobodymassage: "eroticandbodytobody",
  bodyscrub: "bodyscrubs",
  hotstone: "hotstonemassage",
  swedish: "swedishmassage",
};

function validImageUrl(value: unknown) {
  const url = String(value || "").trim();
  return /^(https?:\/\/|\/)/i.test(url) ? url.replace(/["'\\]/g, "") : "";
}

function buildServiceImageMap(data: any): Record<string, string> {
  const map: Record<string, string> = { ...DEFAULT_SERVICE_IMAGES };
  for (const group of ["services", "vipServices", "mobileMassage"]) {
    for (const item of Array.isArray(data?.[group]) ? data[group] : []) {
      const key = serviceImageKey(item?.title);
      const image = validImageUrl(item?.image || item?.img);
      if (key && image) map[key] = image;
    }
  }
  return map;
}

function resolveServiceImage(
  title: unknown,
  images: Record<string, string>,
  queryImage?: string | null
): string {
  if (queryImage && validImageUrl(queryImage)) {
    return queryImage;
  }
  const key = serviceImageKey(title);
  if (!key) return BOOKING_FALLBACK_IMAGE;

  const currentMap = { ...DEFAULT_SERVICE_IMAGES, ...images };

  if (currentMap[key]) return currentMap[key];
  if (SERVICE_IMAGE_ALIASES[key] && currentMap[SERVICE_IMAGE_ALIASES[key]]) {
    return currentMap[SERVICE_IMAGE_ALIASES[key]];
  }

  for (const [k, url] of Object.entries(currentMap)) {
    if (k.includes(key) || key.includes(k)) {
      return url;
    }
  }

  return BOOKING_FALLBACK_IMAGE;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(194, 167, 78, 0.25)",
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
  color: "#c2a74e",
  marginBottom: "8px",
};

function BookingFormInner() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || searchParams.get("serviceName") || "";
  const initialImage = searchParams.get("image") || searchParams.get("img") || "";
  const { whatsappLink } = useSiteContact();

  const [passedImage, setPassedImage] = useState(initialImage);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // `submitted` means the payment is CONFIRMED and the QR pass may be shown.
  // `paymentStarted` only means the prompt was sent; the form stays visible
  // until the Worker reports a confirmed payment.
  const [submitted, setSubmitted] = useState(false);
  const [paymentStarted, setPaymentStarted] = useState(false);
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
  const paymentAlertRef = useRef<HTMLDivElement | null>(null);

  // Live services from the payment API keep prices/IDs in sync with what
  // PawaPay will actually charge. Falls back to the hardcoded list if the
  // API is unreachable, but payment is then disabled.
  const [apiServices, setApiServices] = useState<{
    id: string; title: string; price_ugx: number; duration_minutes: number;
  }[]>([]);
  const [servicesError, setServicesError] = useState("");
  // Admin-edited card images & treatments from /api/content drive the booking
  // selector and backdrop, matching Services, VIP Packages, and Mobile Massage.
  const [serviceImages, setServiceImages] = useState<Record<string, string>>(DEFAULT_SERVICE_IMAGES);
  const [siteCatalog, setSiteCatalog] = useState<{
    services: { name: string; price: number }[];
    vip: { name: string; price: number }[];
    mobile: { name: string; price: number }[];
  } | null>(null);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  // Inline mobile-money checkout: nothing is charged until the customer picks
  // a network, enters the wallet number and confirms on this same page.
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [provider, setProvider] = useState<"MTN" | "AIRTEL" | null>(null);
  const [payPhone, setPayPhone] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("PENDING_PAYMENT");
  const [paymentNotice, setPaymentNotice] = useState("");
  // One payment prompt per attempt. Polling is bounded and never re-issues a
  // prompt, so aborting the PIN prompt cannot cause an endless loop.
  const [pollStopped, setPollStopped] = useState(false);

  // The Worker returns the provider's authoritative reason for a declined
  // payment (insufficient funds, limit reached, etc.). Style those messages as
  // errors for BOTH MTN and Airtel so the customer cannot miss them.
  const isDecline = (text: string) =>
    /insufficient|declin|not enough|transaction limit|limit reached|not registered|outside|cannot receive|unavailable|cancelled|timed out/i.test(text);
  const declined = isDecline(paymentNotice) || isDecline(payError);

  const getFailureHeading = (text: string) => {
    if (/insufficient|not enough/i.test(text)) return "Insufficient Balance";
    if (/limit/i.test(text)) return "Transaction Limit Reached";
    if (/not registered/i.test(text)) return "Number Not Registered for MoMo";
    if (/unavailable/i.test(text)) return "Network Unavailable";
    if (/cancel|timed out/i.test(text)) return "Payment Cancelled";
    return "Payment Failed";
  };

  // A declined payment must not look like a dead button. Bring the in-panel
  // alert into view as soon as the Worker reports a terminal decline.
  useEffect(() => {
    if (!paymentOpen || !paymentAlertRef.current) return;
    const hasAlert = Boolean(payError) ||
      (paymentStarted && !submitted && Boolean(paymentNotice || pollStopped));
    if (hasAlert && (declined || pollStopped)) {
      paymentAlertRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [paymentOpen, payError, paymentNotice, paymentStarted, submitted, pollStopped, declined]);

  const loadServices = () => {
    setServicesError("");
    fetch(`${PAY_API}/api/services`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("services unavailable"))))
      .then((d) => {
        if (!Array.isArray(d.services) || d.services.length === 0) {
          throw new Error("no services");
        }
        setApiServices(d.services);
      })
      .catch(() => {
        setServicesError("We could not load live prices. Please retry — do not submit a payment until prices are shown.");
      });
  };

  useEffect(() => { loadServices(); }, []);

  // The same admin-edited card catalog & images used on Services, VIP Packages,
  // and Mobile Massage drive this page's selector and backdrop. Refresh on focus,
  // visibility, and admin save events so edits/new cards appear immediately.
  useEffect(() => {
    let active = true;
    const applySiteData = (data: any) => {
      if (!active || !data) return;
      setServiceImages(buildServiceImageMap(data));
      const { services: rawServices, vipServices: rawVip } = splitServiceCatalog(data);
      const toOptionList = (items: any[]) =>
        items
          .filter((item) => isRealServiceTitle(item?.title))
          .map((item) => {
            const parsed = parseServicePrice(item?.price);
            return {
              name: String(item.title).trim(),
              price: Number.isFinite(parsed) && parsed > 0 ? parsed : 0,
            };
          });
      const services = toOptionList(orderServices(rawServices, "services"));
      const vip = toOptionList(orderServices(rawVip, "vip"));
      const mobile = toOptionList(Array.isArray(data?.mobileMassage) ? data.mobileMassage : []);
      setSiteCatalog({ services, vip, mobile });
    };

    const cached = getCachedSiteContent();
    if (cached) applySiteData(cached);

    const loadCatalog = async (force = false) => {
      try {
        const data = await fetchSiteContent(force ? { force: true } : undefined);
        applySiteData(data);
      } catch {
        // Keep the previous catalog if temporarily offline.
      }
    };
    loadCatalog(false);

    const refresh = () => {
      if (document.visibilityState === "visible") loadCatalog(true);
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("serenity-content");
      channel.onmessage = () => loadCatalog(true);
    } catch {}
    const onStorage = (e: StorageEvent) => {
      if (e.key === "serenity:content-updated") loadCatalog(true);
    };
    window.addEventListener("storage", onStorage);

    return () => {
      active = false;
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      try { channel?.close(); } catch {}
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Show which slots are already booked BEFORE the customer enters wallet
  // details. D1 remains authoritative; the server still returns 409 on a race.
  useEffect(() => {
    if (!form.date || submitted || paymentStarted) { setTakenSlots([]); return; }
    let active = true;
    fetch(`${PAY_API}/api/availability?date=${encodeURIComponent(form.date)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("unavailable"))))
      .then((d) => { if (active) setTakenSlots(Array.isArray(d.taken) ? d.taken : []); })
      .catch(() => { if (active) setTakenSlots([]); });
    return () => { active = false; };
  }, [form.date, submitted, paymentStarted]);

  // Sync service and image from URL if provided
  useEffect(() => {
    if (initialService) {
      setForm((prev) => ({ ...prev, service: initialService }));
    }
    if (initialImage) {
      setPassedImage(initialImage);
    }
  }, [initialService, initialImage]);

  const resolveApiServiceId = (title: string): string => {
    const key = serviceImageKey(title);
    const aliasKey = SERVICE_IMAGE_ALIASES[key] || key;
    const match = apiServices.find((a) => {
      const aKey = serviceImageKey(a.title);
      return aKey === key || aKey === aliasKey;
    });
    return match?.id || "";
  };

  const groupedTreatments = {
    services: (siteCatalog?.services || []).map((s) => ({
      value: `services::${s.name}`,
      categoryKey: "services" as const,
      category: "Services" as const,
      name: s.name,
      price: s.price,
      id: resolveApiServiceId(s.name),
    })),
    vip: (siteCatalog?.vip || []).map((s) => ({
      value: `vip::${s.name}`,
      categoryKey: "vip" as const,
      category: "VIP Packages" as const,
      name: s.name,
      price: s.price,
      id: resolveApiServiceId(s.name),
    })),
    mobile: (siteCatalog?.mobile || []).map((s) => ({
      value: `mobile::${s.name}`,
      categoryKey: "mobile" as const,
      category: "Mobile Massage" as const,
      name: s.name,
      price: s.price,
      id: resolveApiServiceId(s.name),
    })),
  };

  const serviceOptions = [
    ...groupedTreatments.services,
    ...groupedTreatments.vip,
    ...groupedTreatments.mobile,
  ];

  const selectedService =
    serviceOptions.find((s) => s.value === form.service) ||
    serviceOptions.find((s) => s.name.toLowerCase() === form.service.toLowerCase()) ||
    serviceOptions.find((s) => serviceImageKey(s.name) === serviceImageKey(form.service));
  const bookingBackgroundImage = resolveServiceImage(
    selectedService?.name || form.service,
    serviceImages,
    passedImage
  );

  const nowEAT = kampalaNow();
  const timeOptions = TIME_SLOTS.filter((t) =>
    form.date !== nowEAT.date || slotMinutes(to24Hour(t)) >= nowEAT.minutes + MIN_LEAD_MINUTES
  );
  const maxDate = new Date(Date.now() + MAX_LEAD_DAYS * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000)
    .toISOString().slice(0, 10);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    if (name === "service") {
      setPassedImage("");
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // First tap only reveals the payment controls on this page. No booking and
  // no payment request is made until the customer confirms the wallet number.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (paying) return;
    setPayError("");
    setPaymentNotice("");
    if (!form.name.trim() || !form.phone.trim() || !form.service || !form.date || !form.time) {
      setPayError("Please fill in all required fields (Name, Phone, Service, Date, Time).");
      return;
    }
    if (form.name.trim().length < 2) {
      setPayError("Please enter your full name.");
      return;
    }
    if (!selectedService) {
      setPayError("Choose a treatment from the list.");
      return;
    }
    const hhmm = to24Hour(form.time);
    if (form.date === getTodayString() && slotMinutes(hhmm) < kampalaNow().minutes + MIN_LEAD_MINUTES) {
      setPayError("That time has already passed today. Choose a later slot.");
      return;
    }
    if (takenSlots.includes(hhmm)) {
      setPayError("That time slot is already taken. Pick another time.");
      return;
    }
    setPaymentOpen((open) => !open);
  }

  async function handlePay() {
    if (paying) return;
    setPayError("");
    setPollStopped(false);
    if (!provider) {
      setPayError("Choose MTN MoMo or Airtel Money first.");
      return;
    }
    if (!payPhone.trim()) {
      setPayError("Enter the phone number you want to pay from.");
      return;
    }
    const detected = detectProvider(payPhone);
    if (!detected) {
      setPayError("Enter a valid Uganda MoMo number, e.g. 078 123 4567 (MTN) or 075 123 4567 (Airtel).");
      return;
    }
    if (detected !== provider) {
      setPayError(`That number is ${PROVIDER_LABEL[detected]}. Tap the ${PROVIDER_LABEL[detected]} button above, then Confirm & Pay.`);
      return;
    }
    if (!selectedService) {
      setPayError("Choose a treatment from the list.");
      return;
    }

    setPaying(true);
    let createdBookingId: string | null = null;
    try {
      // Amount is resolved authoritatively on the Worker from R2 site-content (or D1 fallback).
      const createdRes = await fetch(`${PAY_API}/api/bookings`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          serviceTitle: selectedService.name,
          serviceCategory: selectedService.categoryKey,
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          date: form.date,
          time: to24Hour(form.time),
          notes: form.notes.trim(),
        }),
      });
      const created = await createdRes.json();
      if (!createdRes.ok || !created.bookingId) {
        throw new Error(created.error || "Could not reserve your slot. Please try again.");
      }
      createdBookingId = created.bookingId;

      const payRes = await fetch(
        `${PAY_API}/api/bookings/${encodeURIComponent(created.bookingId)}/pay`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ provider, phoneNumber: payPhone.trim() }),
        }
      );
      const paid = await payRes.json();
      if (!payRes.ok) {
        throw new Error(paid.error || "Could not start the payment. Please try again.");
      }

      setBookingSummary({
        id: created.bookingId,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        service: selectedService.name,
        price: Number(created.amount) || selectedService.price,
        date: form.date,
        time: form.time,
        notes: form.notes.trim(),
      });
      setPaymentStatus("PENDING_PAYMENT");
      setPaymentNotice(
        paid.message || "Check your phone for the payment prompt and approve it."
      );
      // Stay on the booking form until payment is actually confirmed.
      setPaymentStarted(true);
    } catch (err) {
      // If the booking was created but the prompt failed, release our own slot
      // so the customer's retry does not collide with their own pending row.
      if (createdBookingId) {
        try {
          await fetch(`${PAY_API}/api/bookings/${encodeURIComponent(createdBookingId)}/cancel`, {
            method: "POST",
          });
        } catch { /* best effort; the Worker also expires stale holds */ }
      }
      setPayError(err instanceof Error ? err.message : "Payment could not be started.");
    } finally {
      setPaying(false);
    }
  }

  // Poll the Worker briefly while the customer approves. This is a STATUS
  // check only — it never starts or re-sends a payment prompt. It stops on a
  // final state or after ~2 minutes, then waits for an explicit user action.
  useEffect(() => {
    if (!paymentStarted || !bookingSummary || pollStopped || submitted) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    let tries = 0;
    const MAX_TRIES = 40; // 40 × 3s = 2 minutes
    const poll = async () => {
      if (!active) return;
      tries += 1;
      try {
        const res = await fetch(
          `${PAY_API}/api/bookings/${encodeURIComponent(bookingSummary.id)}`,
          { cache: "no-store" }
        );
        const data = await res.json().catch(() => ({}));
        if (data.ok && data.booking) {
          setPaymentStatus(data.booking.status);
          if (data.booking.status === "CONFIRMED") {
            setPaymentNotice("Payment received. Your booking is confirmed.");
            setSubmitted(true);
            setPollStopped(true);
            return;
          }
          if (data.booking.status !== "PENDING_PAYMENT") {
            setPaymentNotice("This payment is no longer pending. Please make a new booking if you still need it.");
            setPollStopped(true);
            return;
          }
        } else if (!data.ok) {
          // e.g. 410 "Payment failed" — the Worker already released the slot.
          setPaymentNotice(data.error || "Payment was not completed. Please make a new booking.");
          setPollStopped(true);
          return;
        }
      } catch {
        // Transient network error: retry on the next tick.
      }
      if (active && tries < MAX_TRIES) {
        timer = setTimeout(poll, 3000);
      } else if (active) {
        setPaymentNotice("We didn't receive your payment. No further prompt was sent — check your phone once, or make a new booking.");
        setPollStopped(true);
      }
    };
    timer = setTimeout(poll, 1500);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [paymentStarted, bookingSummary?.id, pollStopped, submitted]);

  // Single, user-triggered status check. Never initiates a new deposit.
  async function checkStatusOnce() {
    if (!bookingSummary) return;
    try {
      const res = await fetch(
        `${PAY_API}/api/bookings/${encodeURIComponent(bookingSummary.id)}`,
        { cache: "no-store" }
      );
      const data = await res.json().catch(() => ({}));
      if (data.ok && data.booking) {
        setPaymentStatus(data.booking.status);
        if (data.booking.status === "CONFIRMED") {
          setPaymentNotice("Payment received. Your booking is confirmed.");
          setSubmitted(true);
          setPollStopped(true);
        } else if (data.booking.status !== "PENDING_PAYMENT") {
          setPaymentNotice("This payment is no longer pending. Please make a new booking if you still need it.");
        } else {
          setPaymentNotice("Still awaiting payment. No new prompt was sent — check your phone or make a new booking.");
        }
      } else {
        setPaymentNotice(data.error || "Could not check right now. Please try again shortly.");
      }
    } catch {
      setPaymentNotice("Could not check right now. Please try again shortly.");
    }
  }

  // Generate QR Code onto canvas once submitted
  useEffect(() => {
    if (submitted && bookingSummary && canvasRef.current) {
      const qrData = [
        `THE SERENITY SPA KAMPALA`,
        `BOOKING REFERENCE`,
        `Booking ID: ${bookingSummary.id}`,
        `Client: ${bookingSummary.name}`,
        `Service: ${bookingSummary.service}`,
        `Amount: UGX ${bookingSummary.price.toLocaleString()}`,
        `Date: ${bookingSummary.date}`,
        `Time: ${bookingSummary.time}`,
        `Payment: MTN/Airtel MoMo (PawaPay)`,
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
    // Send ONLY the reference (plus enough context for the spa to identify the
    // booking). Never put the client's name, phone, email or notes into a wa.me
    // URL: it leaks PII into WhatsApp's servers, browser history and logs.
    // The spa looks the full record up by reference in the admin dashboard.
    const lines = [
      `🌿 *Booking enquiry — The Serenity Spa*`,
      ``,
      `🔖 *Reference:* ${bookingSummary.id}`,
      `💆 *Service:* ${bookingSummary.service}`,
      `📅 *Date:* ${bookingSummary.date}`,
      `🕐 *Time:* ${bookingSummary.time}`,
      ``,
      `_Payment: ${paymentStatus === "CONFIRMED" ? "confirmed" : "awaiting confirmation"}. Please quote the reference._`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(whatsappLink(lines), "_blank");
  }

  function resetBooking() {
    setSubmitted(false);
    setPaymentStarted(false);
    setBookingSummary(null);
    setPollStopped(false);
    setPaymentNotice("");
    setPaymentStatus("PENDING_PAYMENT");
    setPayError("");
    setPaying(false);
    setPaymentOpen(false);
    setProvider(null);
    setPayPhone("");
    setTakenSlots([]);
    setForm({ name: "", phone: "", email: "", service: initialService, date: "", time: "", notes: "" });
  }

  return (
    <>
      <CustomCursor />
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* ── HEADER ── */}
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
                  onClick={() => setDrawerOpen(true)}
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
          
        </header>

      {/* ── MAIN CONTENT ── */}
      <main
        className="booking-page-main"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(175deg, #0a0e12 0%, #0e1317 40%, #111820 100%)",
          paddingTop: "120px",
          paddingBottom: "80px",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        {/* Service-aware backdrop. The key restarts the short fade on change. */}
        <div
          key={bookingBackgroundImage}
          className="booking-background-image"
          data-booking-background
          data-service={selectedService?.name || ""}
          style={{ backgroundImage: `url("${bookingBackgroundImage}")` }}
          aria-hidden="true"
        />
        <div className="booking-background-overlay" aria-hidden="true" />

        <div className="booking-page-content">
        {/* Compact Title Section */}
        <div
          style={{
            padding: "44px 20px 24px",
            textAlign: "center",
            borderBottom: "1px solid rgba(194, 167, 78,0.12)",
            background: "linear-gradient(180deg, rgba(194, 167, 78,0.05) 0%, transparent 100%)",
          }}
        >
          <span style={{ color: "#c2a74e", fontFamily: "Alex Brush, cursive", fontSize: "2.2rem", display: "block", marginBottom: "4px" }}>
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
            Book an <span style={{ color: "#c2a74e", fontStyle: "italic" }}>Appointment</span>
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "14px", maxWidth: "560px", margin: "8px auto 0", lineHeight: 1.6 }}>
            {submitted
              ? "Your reservation pass is generated below with your verification QR code."
              : paymentStarted
                ? "Payment prompt sent — your QR pass will appear here as soon as payment is confirmed."
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
                  border: "1px solid rgba(194, 167, 78,0.22)",
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
                    borderBottom: "1px solid rgba(194, 167, 78,0.15)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <i className="fas fa-calendar-check" style={{ color: "#c2a74e", fontSize: "1.2rem" }}></i>
                  Reservation Details
                </h2>

                <form onSubmit={handleSubmit}>
                  {/* Name + Phone */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }} className="form-row">
                    <div>
                      <label htmlFor="booking-name" style={labelStyle}>Full Name *</label>
                      <input
                        id="booking-name"
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
                      <label htmlFor="booking-phone" style={labelStyle}>Phone Number *</label>
                      <input
                        id="booking-phone"
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
                    <label htmlFor="booking-email" style={labelStyle}>Email Address (Optional)</label>
                    <input
                      id="booking-email"
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
                    <label htmlFor="booking-service" style={labelStyle}>Treatment / Package *</label>
                    <select
                      id="booking-service"
                      style={{ ...inputStyle, cursor: "pointer" }}
                      name="service"
                      value={selectedService?.value || ""}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        {siteCatalog === null ? "— Loading Treatments… —" : "— Select a Treatment —"}
                      </option>
                      {groupedTreatments.services.length > 0 && (
                        <optgroup label="Services" style={{ backgroundColor: "#161c22", color: "#c2a74e", fontWeight: 700 }}>
                          {groupedTreatments.services.map((s) => (
                            <option key={s.value} value={s.value} style={{ backgroundColor: "#161c22", color: "#ffffff" }}>
                              {s.name} — {formatPrice(s.price)}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {groupedTreatments.vip.length > 0 && (
                        <optgroup label="VIP Packages" style={{ backgroundColor: "#161c22", color: "#c2a74e", fontWeight: 700 }}>
                          {groupedTreatments.vip.map((s) => (
                            <option key={s.value} value={s.value} style={{ backgroundColor: "#161c22", color: "#ffffff" }}>
                              {s.name} — {formatPrice(s.price)}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {groupedTreatments.mobile.length > 0 && (
                        <optgroup label="Mobile Massage" style={{ backgroundColor: "#161c22", color: "#c2a74e", fontWeight: 700 }}>
                          {groupedTreatments.mobile.map((s) => (
                            <option key={s.value} value={s.value} style={{ backgroundColor: "#161c22", color: "#ffffff" }}>
                              {s.name} — {formatPrice(s.price)}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>

                    {selectedService && (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "8px 14px",
                          backgroundColor: "rgba(194, 167, 78,0.12)",
                          borderRadius: "6px",
                          fontSize: "13px",
                          color: "#c2a74e",
                          display: "flex",
                          justifyContent: "space-between",
                          border: "1px solid rgba(194, 167, 78,0.25)",
                        }}
                      >
                        <span>Selected Treatment Fee</span>
                        <strong>{formatPrice(selectedService.price)}</strong>
                      </div>
                    )}
                    {servicesError && (
                      <div role="alert" style={{ marginTop: "10px", color: "#fca5a5", fontSize: "12px", lineHeight: 1.5 }}>
                        {servicesError}{" "}
                        <button type="button" onClick={loadServices} style={{ background: "none", border: "none", color: "#c2a74e", textDecoration: "underline", cursor: "pointer", fontSize: "12px", padding: 0 }}>
                          Retry
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Date + Time */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }} className="form-row">
                    <div>
                      <label htmlFor="booking-date" style={labelStyle}>Appointment Date *</label>
                      <input
                        id="booking-date"
                        style={inputStyle}
                        type="date"
                        name="date"
                        min={getTodayString()}
                        max={maxDate}
                        value={form.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-time" style={labelStyle}>Appointment Time *</label>
                      <select
                        id="booking-time"
                        style={{ ...inputStyle, cursor: "pointer" }}
                        name="time"
                        value={form.time}
                        onChange={handleChange}
                        required
                      >
                        <option value="">— Select Time —</option>
                        {timeOptions.map((t) => {
                          const taken = takenSlots.includes(to24Hour(t));
                          return (
                            <option key={t} value={t} disabled={taken}>
                              {t}{taken ? " — Taken" : ""}
                            </option>
                          );
                        })}
                      </select>
                      {timeOptions.length === 0 && (
                        <p style={{ color: "#fca5a5", fontSize: "12px", margin: "8px 0 0" }}>
                          No slots remain today. Please choose another date.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div style={{ marginBottom: "26px" }}>
                    <label htmlFor="booking-notes" style={labelStyle}>Special Requests / Allergies</label>
                    <textarea
                      id="booking-notes"
                      style={{ ...inputStyle, minHeight: "85px", resize: "vertical" }}
                      name="notes"
                      placeholder="Preferences, focus areas (shoulders, lower back), or specific requests..."
                      value={form.notes}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Submit Button */}
                  {/* Inline mobile-money checkout — revealed only after the
                      customer taps the "Pay with MTN / Airtel" button below.
                      No booking or payment request is made until Confirm. */}
                  {paymentOpen && (
                    <div
                      className="inline-pay-panel"
                      style={{
                        backgroundColor: "rgba(194,167,78,0.06)",
                        border: "1px solid rgba(194,167,78,0.38)",
                        borderRadius: "12px",
                        padding: "22px",
                        marginBottom: "18px",
                        animation: "cardFloatIn 0.35s cubic-bezier(0.16,1,0.3,1) both",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", gap: "10px" }}>
                        <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.35rem", color: "#fff", margin: 0 }}>
                          Pay with Mobile Money
                        </h3>
                        {selectedService && (
                          <span style={{ color: "#c2a74e", fontWeight: 800, fontSize: "15px", whiteSpace: "nowrap" }}>
                            {formatPrice(selectedService.price)}
                          </span>
                        )}
                      </div>

                      {/* Payment errors are shown at the TOP of the open panel so a
                          declined wallet never looks like a dead Confirm button. */}
                      {(payError || (paymentStarted && !submitted && (paymentNotice || pollStopped))) && (
                        <div
                          id="payment-status-alert"
                          ref={paymentAlertRef}
                          role={declined ? "alert" : "status"}
                          aria-live="assertive"
                          style={{
                            backgroundColor: declined ? "rgba(239,68,68,0.14)" : "rgba(194,167,78,0.10)",
                            border: `1px solid ${declined ? "rgba(239,68,68,0.55)" : "rgba(194,167,78,0.40)"}`,
                            borderRadius: "10px",
                            padding: "16px",
                            marginBottom: "18px",
                            textAlign: "center",
                            color: declined ? "#fca5a5" : "#c2a74e",
                            boxShadow: declined ? "0 0 0 3px rgba(239,68,68,0.08)" : "none",
                          }}
                        >
                          <strong style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>
                            {declined
                              ? getFailureHeading(payError || paymentNotice)
                              : payError
                                ? "Payment Could Not Be Started"
                                : pollStopped && paymentStatus !== "CONFIRMED"
                                  ? "Payment Not Completed"
                                  : "Waiting for Confirmation"}
                          </strong>
                          <span style={{ display: "block", fontSize: "13px", lineHeight: 1.55 }}>
                            {payError || paymentNotice || "Approve the prompt on your phone."}
                          </span>
                          {pollStopped && paymentStatus !== "CONFIRMED" && (
                            <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
                              <button
                                type="button"
                                onClick={checkStatusOnce}
                                className="serenity-gold-btn"
                                style={{ padding: "9px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                              >
                                Check payment status once
                              </button>
                              <button
                                type="button"
                                onClick={resetBooking}
                                style={{
                                  padding: "9px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 700,
                                  background: "transparent", color: "inherit",
                                  border: `1px solid ${declined ? "rgba(239,68,68,0.45)" : "rgba(194,167,78,0.45)"}`,
                                  cursor: "pointer",
                                }}
                              >
                                Start a new booking
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div role="group" aria-label="1. Choose your network" style={labelStyle}>1. Choose your network</div>
                      <div className="pay-networks" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                        <button
                          type="button"
                          onClick={() => setProvider("MTN")}
                          aria-pressed={provider === "MTN"}
                          disabled={paymentStarted}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                            padding: "14px 10px", borderRadius: "10px",
                            cursor: paymentStarted ? "not-allowed" : "pointer",
                            opacity: paymentStarted ? 0.6 : 1,
                            border: provider === "MTN" ? "2px solid #FFCC00" : "1px solid rgba(255,255,255,0.15)",
                            backgroundColor: provider === "MTN" ? "rgba(255,204,0,0.12)" : "rgba(255,255,255,0.03)",
                            boxShadow: provider === "MTN" ? "0 0 0 3px rgba(255,204,0,0.12)" : "none",
                            transition: "all 0.2s",
                          }}
                        >
                          <span style={{
                            width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#FFCC00",
                            color: "#0e1317", display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 900, fontSize: "10px", flexShrink: 0, letterSpacing: "-0.5px",
                          }}>MTN</span>
                          <span style={{ color: "#fff", fontWeight: 700, fontSize: "13px" }}>MTN MoMo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setProvider("AIRTEL")}
                          aria-pressed={provider === "AIRTEL"}
                          disabled={paymentStarted}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                            padding: "14px 10px", borderRadius: "10px",
                            cursor: paymentStarted ? "not-allowed" : "pointer",
                            opacity: paymentStarted ? 0.6 : 1,
                            border: provider === "AIRTEL" ? "2px solid #E4002B" : "1px solid rgba(255,255,255,0.15)",
                            backgroundColor: provider === "AIRTEL" ? "rgba(228,0,43,0.12)" : "rgba(255,255,255,0.03)",
                            boxShadow: provider === "AIRTEL" ? "0 0 0 3px rgba(228,0,43,0.12)" : "none",
                            transition: "all 0.2s",
                          }}
                        >
                          <span style={{
                            width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#ffffff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, padding: "5px",
                          }}>
                            <img
                              src="/assets/images/payments/airtel-logo.svg"
                              alt=""
                              style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            />
                          </span>
                          <span style={{ color: "#fff", fontWeight: 700, fontSize: "13px" }}>Airtel Money</span>
                        </button>
                      </div>

                      <label htmlFor="pay-phone" style={labelStyle}>2. Number to withdraw from</label>
                      <input
                        id="pay-phone"
                        style={{ ...inputStyle, opacity: paymentStarted ? 0.6 : 1 }}
                        disabled={paymentStarted}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder={
                          provider === "AIRTEL"
                            ? "e.g. 075 123 4567"
                            : provider === "MTN"
                              ? "e.g. 078 123 4567"
                              : "e.g. 078 123 4567 (MTN) or 075 123 4567 (Airtel)"
                        }
                        value={payPhone}
                        onChange={(e) => {
                          const value = e.target.value;
                          setPayPhone(value);
                          const detected = detectProvider(value);
                          if (detected) setProvider(detected);
                          if (payError) setPayError("");
                        }}
                      />
                      <p style={{ fontSize: "11px", color: "#6b7280", margin: "6px 0 16px" }}>
                        {detectProvider(payPhone)
                          ? `Detected ${PROVIDER_LABEL[detectProvider(payPhone)!]} from that number.`
                          : "Enter the MTN or Airtel number that will receive the payment prompt."}
                      </p>

                      <button
                        type="button"
                        onClick={handlePay}
                        disabled={paying || paymentStarted}
                        className="serenity-gold-btn"
                        style={{
                          width: "100%", padding: "15px", borderRadius: "8px", fontSize: "13px",
                          fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", border: "none",
                          cursor: paying || paymentStarted ? "wait" : "pointer",
                          opacity: paying || paymentStarted ? 0.7 : 1,
                        }}
                      >
                        {paying
                          ? "Sending payment prompt…"
                          : paymentStarted
                            ? "Waiting for payment confirmation…"
                            : "Confirm & Pay"}
                      </button>
                      <p style={{ fontSize: "11px", color: "#6b7280", textAlign: "center", margin: "10px 0 0" }}>
                        A prompt will appear on your phone — approve it to complete payment.
                      </p>
                    </div>
                  )}

                  {payError && !paymentOpen && (
                    <div
                      role="alert"
                      style={{
                        backgroundColor: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.35)",
                        color: "#fca5a5",
                        borderRadius: "8px",
                        padding: "12px 14px",
                        fontSize: "13px",
                        marginBottom: "14px",
                      }}
                    >
                      {payError}
                    </div>
                  )}

                  {/* Keep the customer on this page until the Worker confirms
                      payment. The QR pass is only rendered once submitted=true. */}
                  {!paymentOpen && paymentStarted && !submitted && (paymentNotice || pollStopped) && (
                    <div
                      role={declined ? "alert" : "status"}
                      style={{
                        backgroundColor: declined ? "rgba(239,68,68,0.12)" : "rgba(194,167,78,0.10)",
                        border: `1px solid ${declined ? "rgba(239,68,68,0.45)" : "rgba(194,167,78,0.40)"}`,
                        color: declined ? "#fca5a5" : "#c2a74e",
                        borderRadius: "8px",
                        padding: "14px 16px",
                        fontSize: "13px",
                        lineHeight: 1.6,
                        textAlign: "center",
                        margin: "0 0 16px",
                      }}
                    >
                      <strong style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>
                        {declined
                          ? getFailureHeading(paymentNotice || payError)
                          : pollStopped && paymentStatus !== "CONFIRMED"
                            ? "Payment Not Completed"
                            : "Waiting for Confirmation"}
                      </strong>
                      {paymentNotice || "Approve the prompt on your phone."}
                      <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
                        {pollStopped && paymentStatus !== "CONFIRMED" && (
                          <button
                            type="button"
                            onClick={checkStatusOnce}
                            className="serenity-gold-btn"
                            style={{ padding: "9px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                          >
                            Check payment status once
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={resetBooking}
                          style={{
                            padding: "9px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 700,
                            background: "transparent", color: "inherit",
                            border: `1px solid ${declined ? "rgba(239,68,68,0.45)" : "rgba(194,167,78,0.45)"}`,
                            cursor: "pointer",
                          }}
                        >
                          Start a new booking
                        </button>
                      </div>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="serenity-gold-btn"
                    disabled={paying || paymentStarted}
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 800,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      cursor: paying || paymentStarted ? "wait" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      opacity: paying || paymentStarted ? 0.7 : 1,
                    }}
                  >
                    <i className={paymentOpen ? "fas fa-chevron-up" : "fas fa-mobile-alt"} style={{ fontSize: "16px" }}></i>
                    {paymentStarted
                      ? "Waiting for payment confirmation…"
                      : paymentOpen
                        ? "Hide payment options"
                        : "Pay with MTN / Airtel Money"}
                  </button>

                  <p style={{ fontSize: "12px", color: "#6b7280", textAlign: "center", margin: "12px 0 0" }}>
                    Secure on-page payment via PawaPay • MTN MoMo &amp; Airtel Money • Confirmed only after payment
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
                    border: "1px solid rgba(194, 167, 78,0.2)",
                    marginBottom: "20px",
                  }}
                >
                  <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.3rem", color: "#fff", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid rgba(194, 167, 78,0.12)" }}>
                    How It Works
                  </h3>
                  {[
                    { step: "1", title: "Fill Details", desc: "Choose your therapy, date and preferred time slot." },
                    { step: "2", title: "Pay Securely", desc: "Choose MTN or Airtel and approve the prompt right here on this page." },
                    { step: "3", title: "Present On Arrival", desc: "Show your booking reference to reception and enjoy." },
                  ].map((s) => (
                    <div key={s.step} style={{ display: "flex", gap: "14px", marginBottom: "16px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "#c2a74e",
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
                    backgroundColor: "rgba(194, 167, 78,0.06)",
                    borderRadius: "14px",
                    padding: "24px",
                    border: "1px solid rgba(194, 167, 78,0.22)",
                  }}
                >
                  <h4 style={{ fontFamily: "Cormorant, serif", fontSize: "1.2rem", color: "#c2a74e", margin: "0 0 10px 0" }}>
                    Prefer WhatsApp Direct?
                  </h4>
                  <p style={{ color: "#c4cfde", fontSize: "12px", lineHeight: 1.5, margin: "0 0 14px 0" }}>
                    Speak directly with our front-desk therapist right now for immediate confirmation or custom requests.
                  </p>
                  <a
                    href={whatsappLink()}
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
                  border: "1px solid rgba(194, 167, 78,0.35)",
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
                    borderBottom: "1px solid rgba(194, 167, 78,0.18)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: paymentStatus === "CONFIRMED" ? "rgba(37,211,102,0.15)" : "rgba(194,167,78,0.15)",
                      border: `2px solid ${paymentStatus === "CONFIRMED" ? "#25D366" : "#c2a74e"}`,
                      color: paymentStatus === "CONFIRMED" ? "#25D366" : "#c2a74e",
                      fontSize: "26px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                    }}
                  >
                    {paymentStatus === "CONFIRMED" ? "✓" : <i className="fas fa-mobile-alt" style={{ fontSize: "24px" }}></i>}
                  </div>
                  <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "2rem", color: "#ffffff", margin: "0 0 6px 0", fontWeight: 700 }}>
                    {paymentStatus === "CONFIRMED" ? "Booking Confirmed" : "Complete Your Payment"}
                  </h2>
                  <p style={{ color: "#c2a74e", fontSize: "13px", margin: 0, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700 }}>
                    Reference #{bookingSummary.id}
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
                        Payment Reference
                      </span>
                    </div>

                    {/* Summary Details */}
                    <div
                      style={{
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(194, 167, 78,0.18)",
                        borderRadius: "12px",
                        padding: "22px 24px",
                      }}
                    >
                      <div style={{ display: "grid", gap: "10px", fontSize: "13px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                          <span style={{ color: "#9ca3af" }}>Booking Pass ID:</span>
                          <strong style={{ color: "#c2a74e" }}>{bookingSummary.id}</strong>
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
                          <strong style={{ color: "#c2a74e" }}>{bookingSummary.service}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                          <span style={{ color: "#9ca3af" }}>Total Amount:</span>
                          <strong style={{ color: "#25D366", fontSize: "14px" }}>{formatPrice(bookingSummary.price)}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                          <span style={{ color: "#9ca3af" }}>Date &amp; Time:</span>
                          <strong style={{ color: "#ffffff" }}>{bookingSummary.date} at {bookingSummary.time}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "#9ca3af" }}>Payment Status:</span>
                          <span
                            style={{
                              color: paymentStatus === "CONFIRMED" ? "#25D366" : "#f59e0b",
                              fontWeight: 700,
                              backgroundColor: paymentStatus === "CONFIRMED" ? "rgba(37,211,102,0.12)" : "rgba(245,158,11,0.12)",
                              padding: "2px 8px", borderRadius: "4px", fontSize: "11px",
                            }}
                          >
                            {paymentStatus === "CONFIRMED" ? "Paid & Confirmed" : "Awaiting Mobile Money Payment"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {paymentNotice && !declined && (
                    <div
                      role="status"
                      style={{
                        backgroundColor: paymentStatus === "CONFIRMED" ? "rgba(37,211,102,0.1)" : "rgba(194,167,78,0.1)",
                        border: `1px solid ${paymentStatus === "CONFIRMED" ? "rgba(37,211,102,0.4)" : "rgba(194,167,78,0.4)"}`,
                        color: paymentStatus === "CONFIRMED" ? "#86efac" : "#c2a74e",
                        borderRadius: "8px", padding: "12px 14px", fontSize: "13px",
                        textAlign: "center", margin: "0 0 16px",
                      }}
                    >
                      {paymentNotice}
                    </div>
                  )}

                  {pollStopped && paymentStatus !== "CONFIRMED" && (
                    <div style={{ textAlign: "center", margin: "0 0 14px" }}>
                      <button
                        type="button"
                        onClick={checkStatusOnce}
                        className="serenity-gold-btn"
                        style={{
                          padding: "10px 18px", borderRadius: "8px", fontSize: "12px",
                          fontWeight: 700, letterSpacing: "0.5px", cursor: "pointer",
                        }}
                      >
                        Check payment status once
                      </button>
                    </div>
                  )}

                  <p style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center", margin: "0 0 16px" }}>
                    Your booking is confirmed automatically once PawaPay verifies your payment.{" "}
                    <a
                      href={`${PAY_API}/return?booking=${encodeURIComponent(bookingSummary.id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#c2a74e", textDecoration: "underline" }}
                    >
                      Open live status page
                    </a>
                  </p>

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
                      backgroundColor: "rgba(194, 167, 78,0.06)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "#9ca3af",
                      textAlign: "center",
                      border: "1px solid rgba(194, 167, 78,0.15)",
                    }}
                  >
                    📍 After payment is confirmed, present this reference on your phone at reception (Sir Apollo Kaggwa Rd or Mengo). Please arrive 10 minutes before your scheduled appointment.
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "#080c10",
          borderTop: "1px solid rgba(194, 167, 78,0.12)",
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
        @keyframes bookingBgFade {
          from { opacity: 0; transform: scale(1.02); }
          to { opacity: 1; transform: scale(1); }
        }
        .booking-background-image {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 620px;
          z-index: 0;
          pointer-events: none;
          background-size: cover;
          background-position: center 32%;
          background-repeat: no-repeat;
          opacity: 0.96;
          filter: brightness(1.16) saturate(1.06);
          animation: bookingBgFade 0.55s ease both;
        }
        .booking-background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 620px;
          z-index: 0;
          pointer-events: none;
          background:
            linear-gradient(180deg, rgba(10,14,18,0.45) 0%, rgba(10,14,18,0.70) 62%, #0e1317 100%),
            linear-gradient(90deg, rgba(10,14,18,0.35) 0%, rgba(10,14,18,0.08) 55%, rgba(10,14,18,0.30) 100%);
        }
        .booking-page-content { position: relative; z-index: 1; }

        input::placeholder, textarea::placeholder { color: #525f70; }
        input:focus, select:focus, textarea:focus {
          border-color: rgba(194, 167, 78, 0.65) !important;
          box-shadow: 0 0 0 3px rgba(194, 167, 78, 0.12);
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
          .booking-background-image {
            height: 560px;
            background-size: 170% auto;
            background-position: center 24%;
          }
          .booking-background-overlay { height: 560px; }
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .inline-pay-panel { padding: 16px !important; }
          .pay-networks button {
            flex-direction: column;
            gap: 6px;
            padding: 12px 4px;
          }
        }
      `}</style>
    </>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#0e1317", color: "#c2a74e", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Reservation...</div>}>
      <BookingFormInner />
    </Suspense>
  );
}
