import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAY_API_URL =
  process.env.PAY_API_URL ||
  "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev";

async function proxy(path: string, init?: RequestInit): Promise<NextResponse> {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Payments admin API is not configured" }, { status: 503 });
  }
  const url = `${PAY_API_URL.replace(/\/$/, "")}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
      "cache-control": "no-store",
    },
  });
}

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const status = new URL(req.url).searchParams.get("status");
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  try {
    return await proxy(`/api/admin/bookings${query}`);
  } catch {
    return NextResponse.json({ error: "Payments API unavailable" }, { status: 502 });
  }
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const id = typeof body?.id === "string" ? body.id : "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
  }
  try {
    return await proxy(`/api/admin/bookings/${id}/cancel`, { method: "POST" });
  } catch {
    return NextResponse.json({ error: "Payments API unavailable" }, { status: 502 });
  }
}
