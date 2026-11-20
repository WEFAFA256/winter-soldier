import { NextResponse } from "next/server";
import {
  createSessionToken,
  passkeyMatches,
  setSessionCookie,
  clearSessionCookie,
  isAdmin,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

// Brute-force throttle. Serverless instances are short-lived so this is
// per-instance, but combined with the strong passkey and constant-time compare
// it removes trivial/high-speed guessing. The Worker also rate-limits booking
// and payment endpoints independently.
type Attempt = { count: number; resetAt: number };
const attempts = new Map<string, Attempt>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILURES = 5;

function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  const ip =
    forwarded.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  return ip.slice(0, 64);
}

function isThrottled(key: string): boolean {
  const now = Date.now();
  // Occasional prune so the map cannot grow without bound on a warm instance.
  if (attempts.size > 2000) {
    for (const [k, v] of attempts) if (v.resetAt <= now) attempts.delete(k);
  }
  const rec = attempts.get(key);
  if (!rec || rec.resetAt <= now) {
    attempts.set(key, { count: 0, resetAt: now + WINDOW_MS });
    return false;
  }
  return rec.count >= MAX_FAILURES;
}

function recordFailure(key: string): void {
  const rec = attempts.get(key);
  if (rec) rec.count += 1;
}

function clearFailures(key: string): void {
  attempts.delete(key);
}

export async function POST(req: Request) {
  if (!process.env.ADMIN_PASSKEY || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 503 });
  }

  const key = clientKey(req);
  if (isThrottled(key)) {
    return NextResponse.json(
      { error: "Too many failed attempts. Please wait a few minutes." },
      { status: 429, headers: { "Retry-After": "600" } }
    );
  }

  try {
    const body = await req.json();
    const passkey = typeof body?.passkey === "string" ? body.passkey : "";
    if (!passkeyMatches(passkey)) {
      recordFailure(key);
      // Slow down automated guessing even before the hard throttle kicks in.
      await new Promise((resolve) => setTimeout(resolve, 350));
      return NextResponse.json({ error: "Incorrect passkey" }, { status: 401 });
    }
    clearFailures(key);
    const res = NextResponse.json({ ok: true });
    setSessionCookie(res, createSessionToken());
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(req: Request) {
  return NextResponse.json({ authenticated: isAdmin(req) });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);
  return res;
}
