import { NextResponse } from "next/server";
import {
  createSessionToken,
  passkeyMatches,
  setSessionCookie,
  clearSessionCookie,
  isAdmin,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!process.env.ADMIN_PASSKEY || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 503 });
  }
  try {
    const body = await req.json();
    const passkey = typeof body?.passkey === "string" ? body.passkey : "";
    if (!passkeyMatches(passkey)) {
      return NextResponse.json({ error: "Incorrect passkey" }, { status: 401 });
    }
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
