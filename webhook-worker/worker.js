/**
 * Serenity Spa — bookings API + permanent PawaPay callback relay.
 *
 * Public base: https://serenity-pawapay-webhook.turyatembajohn905.workers.dev
 *
 *  POST /                       PawaPay callbacks (all four flows) -> KV + verify + confirm booking
 *  GET  /health                 health check
 *  GET  /api/services           active services from D1
 *  POST /api/bookings           create a pending booking (amount always from D1)
 *  POST /api/bookings/:id/pay   initiate MTN/Airtel deposit directly on the booking page
 *  GET  /api/bookings/:id       booking status (polling + authoritative PawaPay fallback)
 *  POST /api/bookings/:id/cancel
 *  GET  /api/admin/bookings     admin list (Bearer ADMIN_API_TOKEN)
 *  POST /api/admin/bookings/:id/cancel
 *  GET  /return?booking=:id     post-payment status page
 *
 * The PawaPay API token and ADMIN_API_TOKEN are Worker SECRETS, never in this file.
 */

const KV_TTL_SECONDS = 60 * 60 * 24 * 90;

// Wildcard CORS allowed any site to drive the booking/payment API from a
// visitor's browser. Only the real site origins are allowed now.
const ALLOWED_ORIGINS = new Set([
  "https://www.executiveserenityspa.com",
  "https://executiveserenityspa.com",
  "http://localhost:3000",
]);

const CORS = {
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type, authorization",
  "access-control-max-age": "600",
};

const PROVIDERS = {
  MTN: { code: "MTN_MOMO_UGA", label: "MTN MoMo", prefix: /^256(77|78|79)\d{6}$/ },
  AIRTEL: { code: "AIRTEL_OAPI_UGA", label: "Airtel Money", prefix: /^256(75|76|70)\d{6}$/ },
};

function applySecurity(response, request, env) {
  const headers = new Headers(response.headers);
  const origin = request.headers.get("origin") || "";
  const siteUrl = (env.SITE_URL || "").replace(/\/$/, "");
  const allowed = new Set(ALLOWED_ORIGINS);
  if (siteUrl) allowed.add(siteUrl);
  if (origin && allowed.has(origin)) {
    headers.set("access-control-allow-origin", origin);
    headers.set("vary", "Origin");
  }
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");
  headers.set("referrer-policy", "no-referrer");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=(), payment=(self)");
  headers.set("strict-transport-security", "max-age=63072000; includeSubDomains; preload");
  const type = headers.get("content-type") || "";
  if (type.includes("text/html")) {
    headers.set(
      "content-security-policy",
      "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; " +
        "img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
    );
  } else {
    headers.set("content-security-policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
    if (!headers.has("cache-control")) headers.set("cache-control", "no-store");
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...CORS,
      ...extraHeaders,
    },
  });
}

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

function fail(message, status = 400, detail) {
  return json({ ok: false, error: message, ...(detail ? { detail } : {}) }, status);
}

function normalizePhone(input) {
  let p = String(input || "").replace(/[^\d]/g, "");
  if (p.startsWith("0")) p = "256" + p.slice(1);
  if (p.startsWith("2560")) p = "256" + p.slice(4);
  return /^256\d{9}$/.test(p) ? p : null;
}

function validDate(d) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const parsed = new Date(`${d}T00:00:00Z`);
  if (isNaN(parsed.getTime())) return false;
  const today = new Date().toISOString().slice(0, 10);
  return d >= today;
}

function validTime(t) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(t);
}

function chargeAmount(env, service) {
  const percent = Number(env.PAWAPAY_DEPOSIT_PERCENT || 100);
  if (!Number.isFinite(percent) || percent <= 0 || percent >= 100) return service.price_ugx;
  const amount = Math.round((service.price_ugx * percent) / 100 / 1000) * 1000;
  return Math.max(1000, amount);
}

function clientIp(request) {
  return request.headers.get("cf-connecting-ip") ||
    (request.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() ||
    "unknown";
}

async function rateLimited(request, env) {
  const windowMs = 10 * 60 * 1000;
  const bucket = Math.floor(Date.now() / windowMs);
  const windowStart = new Date(bucket * windowMs).toISOString();
  const key = `book:${clientIp(request)}:${bucket}`;

  await env.SERENITY_DB.prepare(
    "DELETE FROM rate_limits WHERE window_start < ?"
  ).bind(new Date(Date.now() - windowMs * 2).toISOString()).run();

  await env.SERENITY_DB.prepare(
    `INSERT INTO rate_limits (key, window_start, count) VALUES (?, ?, 1)
     ON CONFLICT(key) DO UPDATE SET count = count + 1`
  ).bind(key, windowStart).run();

  const row = await env.SERENITY_DB.prepare(
    "SELECT count FROM rate_limits WHERE key = ?"
  ).bind(key).first();
  if (row && Number(row.count) > 5) return true;

  const recent = await env.SERENITY_DB.prepare(
    "SELECT count(*) AS n FROM bookings WHERE created_at > ?"
  ).bind(new Date(Date.now() - 60 * 60 * 1000).toISOString()).first();
  return Boolean(recent && Number(recent.n) > 50);
}

// Separate, tighter throttle for payment initiation so a hostile client
// cannot flood PawaPay with provider prompts even if it creates bookings slowly.
async function payRateLimited(request, env) {
  const windowMs = 10 * 60 * 1000;
  const bucket = Math.floor(Date.now() / windowMs);
  const key = `pay:${clientIp(request)}:${bucket}`;
  await env.SERENITY_DB.prepare(
    `INSERT INTO rate_limits (key, window_start, count) VALUES (?, ?, 1)
     ON CONFLICT(key) DO UPDATE SET count = count + 1`
  ).bind(key, new Date(bucket * windowMs).toISOString()).run();
  const row = await env.SERENITY_DB.prepare(
    "SELECT count FROM rate_limits WHERE key = ?"
  ).bind(key).first();
  return Boolean(row && Number(row.count) > 8);
}

function isAdmin(request, env) {
  const header = request.headers.get("authorization") || "";
  return Boolean(env.ADMIN_API_TOKEN) && header === `Bearer ${env.ADMIN_API_TOKEN}`;
}

async function pawapay(env, path, options = {}) {
  const base = (env.PAWAPAY_API_BASE_URL || "https://api.sandbox.pawapay.io").replace(/\/$/, "");
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      authorization: `Bearer ${env.PAWAPAY_API_TOKEN}`,
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 500) }; }
  return { status: res.status, ok: res.ok, data };
}

async function storeEvent(env, record) {
  await env.SERENITY_PAWAPAY_EVENTS.put(
    `event:${record.id}`,
    JSON.stringify(record),
    { expirationTtl: KV_TTL_SECONDS }
  );
}

function extractDeposit(body) {
  const candidate = body && typeof body === "object" ? body : {};
  const data = candidate.data || candidate.deposit || candidate;
  return {
    depositId: candidate.depositId || data.depositId || null,
    status: candidate.status || data.status || null,
    failureCode: (data.failureReason && data.failureReason.failureCode) ||
      (candidate.failureReason && candidate.failureReason.failureCode) || null,
  };
}

async function handleCallback(request, env, ctx, path) {
  const raw = await request.text();
  let body;
  try { body = JSON.parse(raw); } catch { body = { raw: raw.slice(0, 2000) }; }

  const eventId = `${Date.now()}-${crypto.randomUUID()}`;
  const event = {
    id: eventId,
    receivedAt: new Date().toISOString(),
    path,
    headers: Object.fromEntries(request.headers.entries()),
    body: raw.slice(0, 64000),
  };
  await storeEvent(env, event);

  // Optional onward forwarding (e.g. to a future app handler). Never blocks the 200.
  const { depositId, status } = extractDeposit(body);
  if (env.FORWARD_TO) {
    const target = `${env.FORWARD_TO.replace(/\/$/, "")}${path === "/" ? "/callback" : path}`;
    ctx.waitUntil(
      fetch(target, { method: "POST", headers: request.headers, body: raw }).catch((e) =>
        console.error("callback forward failed", String(e))
      )
    );
  }

  if (!depositId) {
    console.log("callback without depositId stored", eventId);
    return json({ ok: true, id: eventId, note: "stored; no depositId in payload" });
  }

  // Authoritative verification: ONLY PawaPay's own status lookup can change a booking.
  // Never fall back to the callback body's claimed status — that would let a forged
  // POST confirm a booking for free.
  const checked = await pawapay(env, `/v2/deposits/${encodeURIComponent(depositId)}`);
  const verified = checked.data && checked.data.status === "FOUND" && checked.data.data
    ? checked.data.data
    : null;
  const finalStatus = verified && verified.depositId === depositId ? verified.status : null;

  if (!finalStatus) {
    console.log("callback left booking untouched: PawaPay could not verify deposit", { depositId, eventId, apiStatus: checked.status });
    event.verifiedStatus = "UNVERIFIED";
    await storeEvent(env, event);
    return json({ ok: true, id: eventId, depositId, note: "unverified; booking unchanged" });
  }

  const booking = await env.SERENITY_DB.prepare(
    "SELECT id, amount_ugx FROM bookings WHERE deposit_id = ?"
  ).bind(depositId).first();

  // Amount must match too, so a real payment for a different amount can't confirm this booking.
  const paidAmount = verified.amount ? Number(String(verified.amount).replace(/[^\d.]/g, "")) : null;
  const amountMatches = Boolean(booking) && paidAmount !== null && paidAmount === booking.amount_ugx;

  if (finalStatus === "COMPLETED" && amountMatches) {
    const now = new Date().toISOString();
    const result = await env.SERENITY_DB.prepare(
      `UPDATE bookings SET status = 'CONFIRMED', confirmed_at = ?, updated_at = ?
       WHERE deposit_id = ? AND status = 'PENDING_PAYMENT'`
    ).bind(now, now, depositId).run();
    if (result.meta && result.meta.changes > 0) {
      console.log("booking confirmed", { depositId, eventId });
      event.verifiedStatus = finalStatus;
      await storeEvent(env, event);
    }
  } else if (finalStatus === "FAILED") {
    // Free the slot immediately so the customer can retry.
    await env.SERENITY_DB.prepare(
      `DELETE FROM bookings WHERE deposit_id = ? AND status = 'PENDING_PAYMENT'`
    ).bind(depositId).run();
    console.log("failed payment released slot", { depositId, eventId });
  }

  return json({ ok: true, id: eventId, depositId, status: finalStatus });
}

async function createBooking(request, env) {
  let input;
  try {
    input = await request.json();
  } catch {
    return fail("Invalid JSON body");
  }

  const serviceId = String(input.serviceId || "").trim();
  const name = String(input.name || "").trim();
  const email = String(input.email || "").trim();
  const phone = normalizePhone(input.phone);
  const date = String(input.date || "").trim();
  const time = String(input.time || "").trim();

  if (!serviceId || name.length < 2) return fail("serviceId and name are required");
  if (!phone) return fail("Enter a valid Uganda phone number (e.g. 0755123456)");
  if (!validDate(date)) return fail("Choose a valid present or future date (YYYY-MM-DD)");
  if (!validTime(time)) return fail("Choose a valid time (HH:mm)");

  const service = await env.SERENITY_DB.prepare(
    "SELECT id, title, price_ugx, duration_minutes FROM services WHERE id = ? AND active = 1"
  ).bind(serviceId).first();

  if (!service) return fail("Unknown service", 404);
  if (await rateLimited(request, env)) {
    return fail("Too many booking attempts. Please try again shortly.", 429);
  }

  const amount = chargeAmount(env, service);

  // Expire stale holds (PawaPay payment pages live for 15 minutes).
  const cutoff = new Date(Date.now() - 20 * 60 * 1000).toISOString();
  await env.SERENITY_DB.prepare(
    "DELETE FROM bookings WHERE status = 'PENDING_PAYMENT' AND created_at < ?"
  ).bind(cutoff).run();

  const bookingId = crypto.randomUUID();
  const depositId = crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    await env.SERENITY_DB.prepare(
      `INSERT INTO bookings
        (id, deposit_id, service_id, service_title, amount_ugx, customer_name,
         customer_phone, customer_email, booking_date, booking_time, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_PAYMENT', ?, ?)`
    ).bind(
      bookingId, depositId, service.id, service.title, amount,
      name, phone, email || null, date, time, now, now
    ).run();
  } catch (e) {
    if (String(e.message || e).includes("UNIQUE")) {
      return fail("That time slot is already taken. Pick another time.", 409);
    }
    throw e;
  }

  // No hosted checkout: the deposit is initiated by /api/bookings/:id/pay once
  // the customer has chosen MTN or Airtel and entered the wallet number.
  return json({
    ok: true,
    bookingId,
    depositId,
    amount,
    status: "PENDING_PAYMENT",
    paymentRequired: true,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  }, 201);
}

function friendlyPayError(code) {
  switch (code) {
    case "INVALID_PHONE_NUMBER": return "PawaPay could not use that number. Check it and try again.";
    case "AMOUNT_OUT_OF_BOUNDS": return "This amount is outside the mobile money limit. Please contact us.";
    case "DEPOSITS_NOT_ALLOWED":
    case "AUTHORISATION_ERROR":
    case "AUTHENTICATION_ERROR": return "Mobile money payments are temporarily unavailable. Please contact us.";
    case "PROVIDER_TEMPORARILY_UNAVAILABLE": return "That network is temporarily unavailable. Try the other provider.";
    case "INVALID_PROVIDER": return "Choose MTN MoMo or Airtel Money.";
    default: return "Payment could not be started. Please try again or contact us.";
  }
}

async function initiateDeposit(request, env, bookingId) {
  let input;
  try {
    input = await request.json();
  } catch {
    return fail("Invalid JSON body");
  }

  const providerKey = String(input.provider || "").toUpperCase();
  const provider = PROVIDERS[providerKey];
  const phone = normalizePhone(input.phoneNumber);

  if (!provider) return fail("Choose MTN MoMo or Airtel Money");
  if (!phone) return fail("Enter a valid Uganda phone number, e.g. 0755123456");
  if (!provider.prefix.test(phone)) {
    return fail(`That number does not look like ${provider.label}. Check the network and try again.`);
  }

  const booking = await env.SERENITY_DB.prepare(
    "SELECT * FROM bookings WHERE id = ?"
  ).bind(bookingId).first();
  if (!booking) return fail("Booking not found", 404);
  if (booking.status === "CONFIRMED") {
    return json({ ok: true, bookingId, status: "CONFIRMED", amount: booking.amount_ugx });
  }
  if (booking.status !== "PENDING_PAYMENT") return fail("This booking can no longer be paid", 409);

  const initiatedAt = booking.deposit_initiated_at ? Date.parse(booking.deposit_initiated_at) : 0;
  if (initiatedAt && Date.now() - initiatedAt < 2 * 60 * 1000) {
    return json({
      ok: true,
      bookingId,
      depositId: booking.deposit_id,
      status: "ALREADY_INITIATED",
      amount: booking.amount_ugx,
      provider: booking.payment_provider || providerKey,
      message: "A payment prompt is already open on that phone. Check it before trying again.",
    });
  }

  if (await payRateLimited(request, env)) {
    return fail("Too many payment attempts. Please wait a few minutes.", 429);
  }

  // The amount comes from D1 only — never from the browser payload.
  const pay = await pawapay(env, "/v2/deposits", {
    method: "POST",
    body: JSON.stringify({
      depositId: booking.deposit_id,
      payer: {
        type: "MMO",
        accountDetails: { phoneNumber: phone, provider: provider.code },
      },
      amount: String(booking.amount_ugx),
      currency: env.PAWAPAY_CURRENCY || "UGX",
      clientReferenceId: booking.id,
      customerMessage: "Serenity Spa",
      metadata: [
        { bookingId: booking.id },
        { serviceId: booking.service_id },
        { paymentPhone: phone, isPII: true },
      ],
    }),
  });

  const status = pay.data && pay.data.status;
  if (status === "REJECTED") {
    const code = pay.data.failureReason && pay.data.failureReason.failureCode;
    return fail(friendlyPayError(code), 502, code || undefined);
  }
  if (status !== "ACCEPTED" && status !== "DUPLICATE_IGNORED") {
    console.error("deposit initiation failed", { status: pay.status, data: pay.data });
    return fail("Could not start payment with PawaPay. Please try again.", 502);
  }

  const now = new Date().toISOString();
  await env.SERENITY_DB.prepare(
    `UPDATE bookings SET payment_provider = ?, payment_phone = ?, deposit_initiated_at = ?, updated_at = ?
     WHERE id = ?`
  ).bind(providerKey, phone, now, now, bookingId).run();

  return json({
    ok: true,
    bookingId,
    depositId: booking.deposit_id,
    status: "PENDING_PAYMENT",
    amount: booking.amount_ugx,
    provider: providerKey,
    message: `Check your ${provider.label} phone for the payment prompt and approve it.`,
  }, 201);
}

async function getBooking(id, env) {
  const row = await env.SERENITY_DB.prepare(
    `SELECT id, service_title, amount_ugx, customer_name, booking_date, booking_time,
            status, confirmed_at, created_at, deposit_id, payment_provider,
            deposit_initiated_at, status_check_at
     FROM bookings WHERE id = ?`
  ).bind(id).first();
  if (!row) return fail("Booking not found", 404);

  // Callbacks are authoritative, but if one is lost or a dashboard URL was
  // mistyped, a throttled server-to-server status check still finalises the
  // booking. Only PawaPay's own response can change state here.
  if (row.status === "PENDING_PAYMENT" && row.deposit_initiated_at) {
    const last = row.status_check_at ? Date.parse(row.status_check_at) : 0;
    if (Date.now() - last > 10000) {
      await env.SERENITY_DB.prepare(
        "UPDATE bookings SET status_check_at = ? WHERE id = ?"
      ).bind(new Date().toISOString(), id).run();

      const checked = await pawapay(env, `/v2/deposits/${encodeURIComponent(row.deposit_id)}`);
      const data = checked.data && checked.data.status === "FOUND" ? checked.data.data : null;
      const paidAmount = data && data.amount
        ? Number(String(data.amount).replace(/[^\d.]/g, "")) : null;
      const amountMatches = paidAmount !== null && paidAmount === Number(row.amount_ugx);

      if (data && data.depositId === row.deposit_id && amountMatches) {
        const now = new Date().toISOString();
        if (data.status === "COMPLETED") {
          await env.SERENITY_DB.prepare(
            `UPDATE bookings SET status = 'CONFIRMED', confirmed_at = ?, updated_at = ?
             WHERE id = ? AND status = 'PENDING_PAYMENT'`
          ).bind(now, now, id).run();
          row.status = "CONFIRMED";
          row.confirmed_at = now;
        } else if (data.status === "FAILED") {
          await env.SERENITY_DB.prepare(
            "DELETE FROM bookings WHERE id = ? AND status = 'PENDING_PAYMENT'"
          ).bind(id).run();
          return fail("Payment failed. Please make a new booking.", 410);
        }
      }
    }
  }

  return json({ ok: true, booking: row });
}

function returnPage(origin, siteUrl) {
  return html(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Payment status — The Serenity Spa</title>
<style>
 body{background:#0e1317;color:#fff;font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}
 .card{max-width:520px;padding:40px;text-align:center;background:#151c22;border:1px solid rgba(194,167,78,.35);border-radius:12px}
 h1{color:#c2a74e;font-size:28px} p{color:#c8ced4;line-height:1.6} a{color:#c2a74e}
 .spin{width:36px;height:36px;border:3px solid #333;border-top-color:#c2a74e;border-radius:50%;animation:s 1s linear infinite;margin:0 auto 22px}
 @keyframes s{to{transform:rotate(360deg)}}
</style></head><body><div class="card" id="c"><div class="spin"></div><h1>Checking your payment…</h1><p>Do not close this page.</p></div>
<script>
 const id=new URLSearchParams(location.search).get('booking');
 async function check(){
  if(!id){document.getElementById('c').innerHTML='<h1>Missing booking reference</h1>';return;}
  const r=await fetch('/api/bookings/'+encodeURIComponent(id));const d=await r.json();
  if(!d.ok){document.getElementById('c').innerHTML='<h1>Booking not found</h1>';return;}
  const b=d.booking;
  if(b.status==='CONFIRMED'){
   document.getElementById('c').innerHTML='<h1>You are booked ✓</h1><p><strong>'+b.service_title+'</strong><br>'+b.booking_date+' at '+b.booking_time+'</p><p>Reference: '+b.id+'</p>'+${JSON.stringify(siteUrl ? `<p><a href="${siteUrl}">Back to The Serenity Spa</a></p>` : "")};
  } else if(b.status==='PENDING_PAYMENT'){
   setTimeout(check,3000);
  } else {
   document.getElementById('c').innerHTML='<h1>Payment not completed</h1><p>Please contact us to arrange another payment.</p><p>Reference: '+b.id+'</p>';
  }
 }
 check();
</script></body></html>`);
}

const handler = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (method === "GET" && (path === "/" || path === "/health")) {
      let db = "unknown";
      try {
        const r = await env.SERENITY_DB.prepare("SELECT count(*) AS n FROM services").first();
        db = `${r.n} services`;
      } catch (e) { db = `error: ${String(e.message || e)}`; }
      return json({
        ok: true,
        service: "serenity-pawapay-webhook",
        time: new Date().toISOString(),
        db,
        forwarding: env.FORWARD_TO ? "enabled" : "disabled",
      });
    }

    // PawaPay callback paths (the four dashboard boxes all point to the root URL).
    const callbackPaths = new Set(["/", "/checkout", "/deposit", "/deposits", "/payouts", "/refunds", "/callback"]);
    if (method === "POST" && callbackPaths.has(path)) {
      return handleCallback(request, env, ctx, path);
    }

    if (method === "GET" && path === "/api/services") {
      const rows = await env.SERENITY_DB.prepare(
        "SELECT id, title, price_ugx, duration_minutes FROM services WHERE active = 1 ORDER BY price_ugx, title"
      ).all();
      return json({ ok: true, services: rows.results || [] });
    }

    if (method === "POST" && path === "/api/bookings") {
      try { return await createBooking(request, env); }
      catch (e) {
        console.error("createBooking error", e);
        return fail("Internal error", 500);
      }
    }

    let match = path.match(/^\/api\/bookings\/([0-9a-f-]{36})$/i);
    if (method === "GET" && match) {
      try { return await getBooking(match[1], env); }
      catch (e) { console.error("getBooking error", e); return fail("Internal error", 500); }
    }

    match = path.match(/^\/api\/bookings\/([0-9a-f-]{36})\/pay$/i);
    if (method === "POST" && match) {
      try { return await initiateDeposit(request, env, match[1]); }
      catch (e) { console.error("initiateDeposit error", e); return fail("Internal error", 500); }
    }

    match = path.match(/^\/api\/bookings\/([0-9a-f-]{36})\/cancel$/i);
    if (method === "POST" && match) {
      const result = await env.SERENITY_DB.prepare(
        "UPDATE bookings SET status='CANCELLED', updated_at=? WHERE id=? AND status='PENDING_PAYMENT'"
      ).bind(new Date().toISOString(), match[1]).run();
      if (!result.meta || result.meta.changes === 0) return fail("Nothing to cancel", 404);
      return json({ ok: true, status: "CANCELLED" });
    }

    // Admin-only bookings management. Requires the ADMIN_API_TOKEN Worker secret.
    if (path.startsWith("/api/admin/")) {
      if (!isAdmin(request, env)) return fail("Unauthorized", 401);

      if (method === "GET" && path === "/api/admin/bookings") {
        const status = url.searchParams.get("status");
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 100), 1), 500);
        const columns = `id, deposit_id, service_title, amount_ugx, customer_name, customer_phone,
                         customer_email, booking_date, booking_time, status, payment_provider,
                         payment_phone, created_at, confirmed_at`;
        const rows = status
          ? await env.SERENITY_DB.prepare(
              `SELECT ${columns} FROM bookings WHERE status = ?
               ORDER BY booking_date DESC, booking_time DESC LIMIT ?`
            ).bind(status, limit).all()
          : await env.SERENITY_DB.prepare(
              `SELECT ${columns} FROM bookings
               ORDER BY booking_date DESC, booking_time DESC LIMIT ?`
            ).bind(limit).all();
        return json({ ok: true, bookings: rows.results || [] });
      }

      const adminMatch = path.match(/^\/api\/admin\/bookings\/([0-9a-f-]{36})\/cancel$/i);
      if (method === "POST" && adminMatch) {
        // CONFIRMED bookings can be cancelled here; refunds remain a manual staff task.
        const result = await env.SERENITY_DB.prepare(
          `UPDATE bookings SET status='CANCELLED', updated_at=?
           WHERE id=? AND status IN ('PENDING_PAYMENT','CONFIRMED')`
        ).bind(new Date().toISOString(), adminMatch[1]).run();
        if (!result.meta || result.meta.changes === 0) return fail("Nothing to cancel", 404);
        return json({ ok: true, status: "CANCELLED" });
      }
    }

    if (method === "GET" && path === "/return") {
      return returnPage(new URL(request.url).origin, env.SITE_URL || "");
    }

    return fail("Not found", 404);
  },
};

export default {
  async fetch(request, env, ctx) {
    const response = await handler.fetch(request, env, ctx);
    return applySecurity(response, request, env);
  },
};
