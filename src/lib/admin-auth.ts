import { createHmac, timingSafeEqual } from "crypto";
import type { NextResponse } from "next/server";

export const ADMIN_COOKIE = "serenity_admin";

const SESSION_HOURS = 8;

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }
  return value;
}

// Emergency revocation: sessions are stateless, so this version is signed into
// every token. Changing ADMIN_SESSION_VERSION (and redeploying) invalidates
// all outstanding sessions at once, even a stolen cookie that was never used
// to call /api/admin/login (which clears the browser's own cookie).
function sessionVersion(): string {
  return process.env.ADMIN_SESSION_VERSION || "1";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({
      exp: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
      v: sessionVersion(),
    })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return (
      typeof parsed.exp === "number" &&
      parsed.exp > Date.now() &&
      typeof parsed.v === "string" &&
      parsed.v === sessionVersion()
    );
  } catch {
    return false;
  }
}

function cookies(req: Request): Record<string, string> {
  const result: Record<string, string> = {};
  for (const part of (req.headers.get("cookie") || "").split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) result[key] = decodeURIComponent(value);
  }
  return result;
}

export function isAdmin(req: Request): boolean {
  try {
    return verifySessionToken(cookies(req)[ADMIN_COOKIE]);
  } catch {
    return false;
  }
}

export function passkeyMatches(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSKEY;
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

export function setSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
