import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAY_API_URL =
  process.env.PAY_API_URL ||
  "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev";

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const depositId = typeof body?.depositId === "string" ? body.depositId : "";
  if (!/^[0-9a-f-]{36}$/i.test(depositId)) {
    return NextResponse.json({ error: "Invalid deposit id" }, { status: 400 });
  }
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Payments admin API is not configured" }, { status: 503 });
  }
  try {
    const res = await fetch(
      `${PAY_API_URL.replace(/\/$/, "")}/api/admin/refunds/${depositId}/mark`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") || "application/json",
        "cache-control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Payments API unavailable" }, { status: 502 });
  }
}
