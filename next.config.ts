import type { NextConfig } from "next";

// Security headers. The template loads its own local vendor scripts and uses
// inline styles, so script/style need 'unsafe-inline'; everything else is
// locked down to the origins the site actually uses.
const WORKER_ORIGIN = "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev";

function originOf(value: string | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

// The browser talks to the Worker directly from /booking. Derive connect-src
// from the same env var the client uses so a custom Worker host is never
// silently blocked by a stale hardcoded CSP origin.
const connectOrigins = new Set<string>([WORKER_ORIGIN]);
const configured = originOf(process.env.NEXT_PUBLIC_PAY_API_URL);
if (configured) connectOrigins.add(configured);

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https:",
  `media-src 'self' ${[...connectOrigins].join(" ")}`,
  `connect-src 'self' ${[...connectOrigins].join(" ")}`,
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://maps.google.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
