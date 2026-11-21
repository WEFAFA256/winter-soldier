"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";

interface SiteContact {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  location?: string;
  mapQuery?: string;
  [key: string]: unknown;
}

interface ContactContextValue {
  contact: SiteContact | null;
  ready: boolean;
  phoneDisplay: string;
  phoneHref: string;
  whatsappDisplay: string;
  whatsappNumber: string;
  whatsappLink: (message?: string) => string;
  emailDisplay: string;
  emailHref: string;
  locationDisplay: string;
}

const EMPTY_CONTACT: ContactContextValue = {
  contact: null,
  ready: false,
  phoneDisplay: "",
  phoneHref: "#",
  whatsappDisplay: "",
  whatsappNumber: "",
  whatsappLink: () => "#",
  emailDisplay: "",
  emailHref: "#",
  locationDisplay: "",
};

const ContactContext = createContext<ContactContextValue>(EMPTY_CONTACT);

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Convert any Uganda phone entry to the digits wa.me / tel: links expect. */
function toMsisdn(value: string): string {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0") && digits.length === 10) return `256${digits.slice(1)}`;
  if (digits.length === 9) return `256${digits}`;
  return digits;
}

function displayPhone(value: string): string {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  const digits = toMsisdn(trimmed);
  if (digits.length === 12 && digits.startsWith("256")) {
    return `+256 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return trimmed;
}

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [contact, setContact] = useState<SiteContact | null>(null);
  const [location, setLocation] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    const controller = new AbortController();
    const loadContact = async () => {
      try {
        const res = await fetch(`/api/content?cb=${Date.now()}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        const spa = data?.contact?.spa || null;
        setContact(spa);
        setLocation(String(data?.homepage?.spaContent?.location || ""));
        setReady(true);
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          // Keep the empty state rather than painting a stale hardcoded number.
          setReady(true);
        }
      }
    };

    loadContact();

    const refresh = () => {
      if (document.visibilityState === "visible") loadContact();
    };
    const onContentSaved = () => loadContact();
    const onStorage = (event: StorageEvent) => {
      if (event.key === "serenity-content-version") loadContact();
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("serenity-content-updated", onContentSaved);
    window.addEventListener("storage", onStorage);

    return () => {
      controller.abort();
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("serenity-content-updated", onContentSaved);
      window.removeEventListener("storage", onStorage);
    };
  }, [pathname]);

  const value = useMemo<ContactContextValue>(() => {
    const phoneRaw = String(contact?.phone || contact?.whatsapp || "");
    const whatsappRaw = String(contact?.whatsapp || contact?.phone || "");
    const emailRaw = String(contact?.email || "");
    const locationRaw = String(
      location || contact?.address || contact?.location || "Sir Apollo Kaggwa Rd & Mengo, Kampala"
    );
    const whatsappNumber = toMsisdn(whatsappRaw);

    return {
      contact,
      ready,
      phoneDisplay: displayPhone(phoneRaw),
      phoneHref: phoneRaw ? `tel:+${toMsisdn(phoneRaw)}` : "#",
      whatsappDisplay: displayPhone(whatsappRaw),
      whatsappNumber,
      whatsappLink: (message?: string) => {
        if (!whatsappNumber) return "#";
        const base = `https://wa.me/${whatsappNumber}`;
        return message ? `${base}?text=${encodeURIComponent(message)}` : base;
      },
      emailDisplay: emailRaw,
      emailHref: emailRaw ? `mailto:${emailRaw}` : "#",
      locationDisplay: locationRaw,
    };
  }, [contact, location, ready]);

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
}

export function useSiteContact(): ContactContextValue {
  return useContext(ContactContext);
}
