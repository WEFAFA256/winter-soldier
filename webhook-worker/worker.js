/**
 * Serenity Spa — bookings API + permanent PawaPay callback relay.
 *
 * Public base: https://serenity-pawapay-webhook.turyatembajohn905.workers.dev
 *
 *  POST /                       PawaPay callbacks (all four flows) -> KV + verify + confirm booking
 *  GET  /health                 health check
 *  GET  /api/services           active services from D1
 *  GET  /api/availability?date= booked times for a date (UX only; D1 is authoritative)
 *  POST /api/bookings           create a pending booking (amount always from D1)
 *  POST /api/bookings/:id/pay   initiate MTN/Airtel deposit directly on the booking page
 *  GET  /api/bookings/:id       booking status (polling + authoritative PawaPay fallback)
 *  POST /api/bookings/:id/cancel
 *  GET  /api/admin/bookings     admin list (Bearer ADMIN_API_TOKEN), includes refund to-dos
 *  POST /api/admin/bookings/:id/cancel
 *  GET  /api/admin/refunds
 *  POST /api/admin/refunds/:depositId/mark
 *  GET  /return?booking=:id     post-payment status page
 *
 * The PawaPay API token and ADMIN_API_TOKEN are Worker SECRETS, never in this file.
 * A callback's claimed status is NEVER trusted; only PawaPay's own GET
 * /v2/deposits/{id} with a matching depositId AND amount can change a booking.
 */

const KV_TTL_SECONDS = 60 * 60 * 24 * 90;
const CALLBACK_LOOKUP_TTL_MS = 30 * 1000;
const HOLD_TTL_MS = 20 * 60 * 1000;
const PAY_CLAIM_MS = 2 * 60 * 1000;

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
  // Uganda allocations: MTN 076/077/078/079, Airtel 070/074/075.
  // Full MSISDN is 256 + 9 digits: 2-digit network prefix + 7 subscriber digits.
  MTN: { code: "MTN_MOMO_UGA", label: "MTN MoMo", prefix: /^256(76|77|78|79)\d{7}$/ },
  AIRTEL: { code: "AIRTEL_OAPI_UGA", label: "Airtel Money", prefix: /^256(70|74|75)\d{7}$/ },
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

// Constant-time-ish compare (no early exit on content) for the admin token.
function constantTimeEqual(a, b) {
  const x = String(a ?? "");
  const y = String(b ?? "");
  let diff = x.length ^ y.length;
  const xl = x.length || 1;
  const yl = y.length || 1;
  for (let i = 0; i < x.length; i++) diff |= x.charCodeAt(i) ^ y.charCodeAt(i % yl);
  for (let i = 0; i < y.length; i++) diff |= y.charCodeAt(i) ^ x.charCodeAt(i % xl);
  return diff === 0;
}

function normalizePhone(input) {
  let p = String(input || "").replace(/[^\d]/g, "");
  if (p.startsWith("0")) p = "256" + p.slice(1);
  if (p.startsWith("2560")) p = "256" + p.slice(4);
  return /^256\d{9}$/.test(p) ? p : null;
}

// Kampala is UTC+3 with no DST. Using local date/time prevents a customer from
// buying a slot that has already passed in East Africa.
function kampalaNow() {
  const d = new Date(Date.now() + 3 * 60 * 60 * 1000);
  return {
    date: d.toISOString().slice(0, 10),
    minutes: d.getUTCHours() * 60 + d.getUTCMinutes(),
  };
}

function validDate(d) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const [y, m, day] = d.split("-").map(Number);
  const probe = new Date(Date.UTC(y, m - 1, day));
  // Rejects impossible dates such as 2026-02-30, which JS silently rolls over.
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== m - 1 || probe.getUTCDate() !== day) {
    return false;
  }
  const today = kampalaNow().date;
  const latest = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000)
    .toISOString().slice(0, 10);
  return d >= today && d <= latest;
}

function validTime(t) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(t);
}

function slotIsFuture(date, time) {
  if (!validTime(time)) return false;
  const now = kampalaNow();
  if (date > now.date) return true;
  if (date < now.date) return false;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m >= now.minutes + 30; // 30-minute minimum lead time
}

function chargeAmount(env, service) {
  const percent = Number(env.PAWAPAY_DEPOSIT_PERCENT || 100);
  if (!Number.isFinite(percent) || percent <= 0 || percent >= 100) return service.price_ugx;
  const amount = Math.ceil((service.price_ugx * percent) / 100 / 1000) * 1000;
  return Math.max(1000, amount);
}

// PawaPay has returned the amount under different keys in different versions.
// Require one of these known fields; fail closed if none is present.
function extractPaidAmount(record) {
  if (!record || typeof record !== "object") return null;
  const details = record.amountDetails || record.amount_detail || {};
  const candidates = [
    record.amount,
    record.paidAmount,
    record.totalAmount,
    details.amount,
    details.AMOUNT,
    details.value,
    details.paidAmount,
  ];
  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined || candidate === "") continue;
    const n = Number(String(candidate).replace(/[^\d.]/g, ""));
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
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

  // Only live holds count toward the global stop; cancelled/expired rows must
  // never lock out legitimate customers.
  const recent = await env.SERENITY_DB.prepare(
    "SELECT count(*) AS n FROM bookings WHERE created_at > ? AND status IN ('PENDING_PAYMENT','CONFIRMED')"
  ).bind(new Date(Date.now() - 60 * 60 * 1000).toISOString()).first();
  return Boolean(recent && Number(recent.n) > 100);
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

// Callbacks are unauthenticated HTTP POSTs. PawaPay status is never trusted for
// state changes (see handleCallback), but an attacker could still burn provider
// API quota / KV storage by posting arbitrary depositIds. Throttle per IP.
async function callbackRateLimited(request, env) {
  const windowMs = 10 * 60 * 1000;
  const bucket = Math.floor(Date.now() / windowMs);
  const key = `cb:${clientIp(request)}:${bucket}`;
  await env.SERENITY_DB.prepare(
    `INSERT INTO rate_limits (key, window_start, count) VALUES (?, ?, 1)
     ON CONFLICT(key) DO UPDATE SET count = count + 1`
  ).bind(key, new Date(bucket * windowMs).toISOString()).run();
  const row = await env.SERENITY_DB.prepare(
    "SELECT count FROM rate_limits WHERE key = ?"
  ).bind(key).first();
  return Boolean(row && Number(row.count) > 50); // PawaPay retries ~8x/25min — generous
}

// Public booking mutations must be real JSON requests from an allowed origin.
// CORS alone does not stop a cross-origin no-cors form POST (side effects still
// happen); this guard does. Absent Origin is allowed for curl/server clients.
function rejectPublicMutation(request, env) {
  const ctype = (request.headers.get("content-type") || "").toLowerCase();
  if (!ctype.includes("application/json")) return fail("Expected application/json", 415);
  const origin = request.headers.get("origin");
  if (origin) {
    const siteUrl = (env.SITE_URL || "").replace(/\/$/, "");
    const allowed = new Set(ALLOWED_ORIGINS);
    if (siteUrl) allowed.add(siteUrl);
    if (!allowed.has(origin)) return fail("Origin not allowed", 403);
  }
  return null;
}

function isAdmin(request, env) {
  const header = request.headers.get("authorization") || "";
  return Boolean(env.ADMIN_API_TOKEN) && constantTimeEqual(header, `Bearer ${env.ADMIN_API_TOKEN}`);
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

// Move a row out of the active table so its (date,time) slot can be rebooked.
// Archive + delete run in one D1 batch; no cancelled booking ever blocks a slot.
async function archiveRow(env, row, status, reason) {
  if (!row) return false;
  const now = new Date().toISOString();
  const insert = env.SERENITY_DB.prepare(
    `INSERT OR IGNORE INTO bookings_archive
      (id, deposit_id, service_id, service_title, amount_ugx, customer_name, customer_phone,
       customer_email, booking_date, booking_time, status, notes, payment_provider, payment_phone,
       deposit_initiated_at, status_check_at, created_at, updated_at, confirmed_at, cancelled_at, cancel_reason)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    row.id, row.deposit_id, row.service_id, row.service_title, row.amount_ugx,
    row.customer_name, row.customer_phone, row.customer_email, row.booking_date, row.booking_time,
    status, row.notes || null, row.payment_provider || null, row.payment_phone || null,
    row.deposit_initiated_at || null, row.status_check_at || null,
    row.created_at || now, row.updated_at || now, row.confirmed_at || null, now, reason || null
  );
  const remove = env.SERENITY_DB.prepare("DELETE FROM bookings WHERE id = ?").bind(row.id);
  await env.SERENITY_DB.batch([insert, remove]);
  return true;
}

async function archiveBookingById(env, id, status, reason) {
  const row = await env.SERENITY_DB.prepare("SELECT * FROM bookings WHERE id = ?").bind(id).first();
  return archiveRow(env, row, status, reason);
}

async function expireStaleHolds(env) {
  const cutoff = new Date(Date.now() - HOLD_TTL_MS).toISOString();
  // Hold lifetime starts when the payment prompt was initiated, not when the
  // empty booking was created; a customer at the PIN prompt is never evicted.
  const stale = await env.SERENITY_DB.prepare(
    `SELECT * FROM bookings WHERE status = 'PENDING_PAYMENT'
     AND COALESCE(deposit_initiated_at, created_at) < ?`
  ).bind(cutoff).all();
  for (const row of stale.results || []) {
    await archiveRow(env, row, "EXPIRED", "stale-hold");
  }
}

async function handleCallback(request, env, ctx, path) {
  if (await callbackRateLimited(request, env)) {
    return fail("Too many callbacks. Please retry later.", 429);
  }
  const raw = await request.text();
  if (raw.length > 65536) return fail("Payload too large", 413);
  let body;
  try { body = JSON.parse(raw); } catch { body = { raw: raw.slice(0, 2000) }; }

  const eventId = `${Date.now()}-${crypto.randomUUID()}`;
  const headers = Object.fromEntries(request.headers.entries());
  for (const key of Object.keys(headers)) {
    if (["authorization", "cookie", "cf-connecting-ip", "x-forwarded-for"].includes(key.toLowerCase())) {
      headers[key] = "[redacted]";
    }
  }
  const event = {
    id: eventId,
    receivedAt: new Date().toISOString(),
    path,
    headers,
    // Raw payload kept for audit only; never store more than needed.
    body: raw.slice(0, 16000),
  };
  const finish = async (extra) => {
    await storeEvent(env, event);
    return json({ ok: true, id: eventId, ...extra });
  };

  const { depositId } = extractDeposit(body);
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
    event.verifiedStatus = "NO_DEPOSIT_ID";
    return finish({ note: "stored; no depositId in payload" });
  }

  let finalStatus = null;
  let paidAmount = null;
  const cachedLookup = await env.SERENITY_DB.prepare(
    "SELECT checked_at, status, amount FROM callback_lookups WHERE deposit_id = ?"
  ).bind(depositId).first();
  const fresh = cachedLookup && cachedLookup.status &&
    Date.now() - Date.parse(cachedLookup.checked_at) < CALLBACK_LOOKUP_TTL_MS;

  if (fresh) {
    // Replay / duplicate callback: reuse the authoritative answer instead of
    // hammering PawaPay's status endpoint.
    finalStatus = cachedLookup.status;
    paidAmount = cachedLookup.amount === null || cachedLookup.amount === undefined
      ? null : Number(cachedLookup.amount);
    event.lookup = "cached";
    event.verifiedStatus = finalStatus;
  } else {
    // Authoritative verification: ONLY PawaPay's own status lookup can change a
    // booking. Never fall back to the callback body's claimed status — that
    // would let a forged POST confirm a booking for free.
    const checked = await pawapay(env, `/v2/deposits/${encodeURIComponent(depositId)}`);
    const verified = checked.data && checked.data.status === "FOUND" && checked.data.data
      ? checked.data.data
      : null;
    if (!verified || verified.depositId !== depositId) {
      console.log("callback left booking untouched: PawaPay could not verify deposit", {
        depositId, eventId, apiStatus: checked.status,
      });
      event.verifiedStatus = "UNVERIFIED";
      return finish({ depositId, note: "unverified; booking unchanged" });
    }
    finalStatus = verified.status;
    paidAmount = extractPaidAmount(verified);
    await env.SERENITY_DB.prepare(
      `INSERT INTO callback_lookups (deposit_id, checked_at, status, amount)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(deposit_id) DO UPDATE SET
         checked_at = excluded.checked_at, status = excluded.status, amount = excluded.amount`
    ).bind(depositId, new Date().toISOString(), finalStatus, paidAmount).run();
    event.lookup = "pawapay";
    event.verifiedStatus = finalStatus;
  }

  // Keep a durable, queryable record of verified outcomes alongside the raw KV log.
  // Deterministic id makes INSERT OR IGNORE actually dedupe replays (a random
  // UUID never collides, so the old code wrote one ledger row per callback).
  await env.SERENITY_DB.prepare(
    `INSERT OR IGNORE INTO payment_events (id, deposit_id, status, raw_body, received_at)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(
    `pe:${depositId}:${finalStatus}`, depositId, finalStatus, raw.slice(0, 16000), event.receivedAt
  ).run();

  const booking = await env.SERENITY_DB.prepare(
    "SELECT id, deposit_id, amount_ugx, status, deposit_initiated_at FROM bookings WHERE deposit_id = ?"
  ).bind(depositId).first();

  const amountMatches = Boolean(booking) && paidAmount !== null &&
    paidAmount === Number(booking.amount_ugx);

  if (!booking) {
    // A payment can complete just after staff/customer cancelled. Money is real
    // even though the booking is gone — raise a refund task, never auto-confirm.
    const archived = await env.SERENITY_DB.prepare(
      "SELECT id, amount_ugx, deposit_initiated_at, status FROM bookings_archive WHERE deposit_id = ?"
    ).bind(depositId).first();
    if (finalStatus === "COMPLETED" && archived && archived.deposit_initiated_at &&
        paidAmount !== null && paidAmount === Number(archived.amount_ugx)) {
      await env.SERENITY_DB.prepare(
        `INSERT OR IGNORE INTO refunds (id, deposit_id, booking_id, amount_ugx, reason, status, created_at)
         VALUES (?, ?, ?, ?, ?, 'PENDING_REFUND', ?)`
      ).bind(
        crypto.randomUUID(), depositId, archived.id, archived.amount_ugx,
        "Payment completed after booking was cancelled", event.receivedAt
      ).run();
      event.verifiedStatus = "REFUND_REQUIRED";
      console.log("refund required: payment after cancellation", { depositId, eventId });
      return finish({ depositId, status: finalStatus, note: "payment after cancellation; refund required" });
    }
    return finish({ depositId, status: finalStatus, note: "no active booking for deposit" });
  }

  if (finalStatus === "COMPLETED" && amountMatches) {
    const result = await env.SERENITY_DB.prepare(
      `UPDATE bookings SET status = 'CONFIRMED', confirmed_at = ?, updated_at = ?
       WHERE deposit_id = ? AND status = 'PENDING_PAYMENT'`
    ).bind(event.receivedAt, event.receivedAt, depositId).run();
    if (result.meta && result.meta.changes > 0) {
      console.log("booking confirmed", { depositId, eventId });
    }
  } else if (finalStatus === "FAILED") {
    // Terminal states are final. A late/out-of-order FAILED result must never
    // overturn an already CONFIRMED booking and free a paid customer's slot.
    if (booking.status === "PENDING_PAYMENT") {
      await archiveRow(env, booking, "FAILED", "pawapay-failed");
      console.log("failed payment released slot", { depositId, eventId });
    } else {
      console.log("late FAILED callback ignored; booking already terminal", {
        depositId, eventId, status: booking.status,
      });
      event.verifiedStatus = "IGNORED_TERMINAL";
    }
  } else if (finalStatus === "COMPLETED" && !amountMatches) {
    console.warn("confirmed payment with mismatched amount left unchanged", {
      depositId, eventId, paidAmount, expectedAmount: booking.amount_ugx,
    });
    event.verifiedStatus = "AMOUNT_MISMATCH";
  }

  return finish({
    depositId,
    status: finalStatus,
    ...(finalStatus === "COMPLETED" && !amountMatches ? { note: "amount mismatch; booking unchanged" } : {}),
  });
}

async function createBooking(request, env) {
  const guard = rejectPublicMutation(request, env);
  if (guard) return guard;
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
  const notes = String(input.notes || "").trim().slice(0, 1000);

  if (!serviceId || name.length < 2) return fail("serviceId and name are required");
  if (!phone) return fail("Enter a valid Uganda phone number (e.g. 0755123456)");
  if (!validDate(date)) return fail("Choose a valid date within the next 90 days (YYYY-MM-DD)");
  if (!validTime(time)) return fail("Choose a valid time (HH:mm)");
  if (!slotIsFuture(date, time)) return fail("That time has already passed today. Choose a later slot.");

  const service = await env.SERENITY_DB.prepare(
    "SELECT id, title, price_ugx, duration_minutes FROM services WHERE id = ? AND active = 1"
  ).bind(serviceId).first();

  if (!service) return fail("Unknown service", 404);
  if (await rateLimited(request, env)) {
    return fail("Too many booking attempts. Please try again shortly.", 429);
  }

  const amount = chargeAmount(env, service);
  await expireStaleHolds(env);

  const bookingId = crypto.randomUUID();
  const depositId = crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    await env.SERENITY_DB.prepare(
      `INSERT INTO bookings
        (id, deposit_id, service_id, service_title, amount_ugx, customer_name,
         customer_phone, customer_email, booking_date, booking_time, notes, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_PAYMENT', ?, ?)`
    ).bind(
      bookingId, depositId, service.id, service.title, amount,
      name, phone, email || null, date, time, notes || null, now, now
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
    expiresAt: new Date(Date.now() + HOLD_TTL_MS).toISOString(),
  }, 201);
}

function friendlyPayError(code) {
  switch (code) {
    case "INVALID_PHONE_NUMBER": return "PawaPay says that number is not registered for mobile money. Use the MTN/Airtel number that receives your MoMo prompts.";
    case "AMOUNT_OUT_OF_BOUNDS": return "This amount is outside the mobile money limit. Please contact us.";
    case "DEPOSITS_NOT_ALLOWED":
    case "AUTHORISATION_ERROR":
    case "AUTHENTICATION_ERROR": return "Mobile money payments are temporarily unavailable. Please contact us.";
    case "PROVIDER_TEMPORARILY_UNAVAILABLE": return "That network is temporarily unavailable. Try the other provider.";
    case "INVALID_PROVIDER": return "Choose MTN MoMo or Airtel Money.";
    default: return "Payment could not be started. Please try again or contact us.";
  }
}

async function releasePayClaim(env, bookingId, claimAt) {
  await env.SERENITY_DB.prepare(
    "UPDATE bookings SET deposit_initiated_at = NULL, updated_at = ? WHERE id = ? AND deposit_initiated_at = ?"
  ).bind(new Date().toISOString(), bookingId, claimAt).run();
}

async function initiateDeposit(request, env, bookingId) {
  const guard = rejectPublicMutation(request, env);
  if (guard) return guard;
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
  if (!phone) return fail("Enter a valid Uganda MoMo number, e.g. 0781234567 (MTN) or 0751234567 (Airtel)");
  if (!provider.prefix.test(phone)) {
    const hint = providerKey === "MTN"
      ? "MTN MoMo numbers start 076, 077, 078 or 079"
      : "Airtel Money numbers start 070, 074 or 075";
    return fail(`That number is not ${provider.label}. ${hint}. Tap the correct network and try again.`);
  }

  const booking = await env.SERENITY_DB.prepare(
    "SELECT * FROM bookings WHERE id = ?"
  ).bind(bookingId).first();
  if (!booking) return fail("Booking not found", 404);
  if (booking.status === "CONFIRMED") {
    return json({ ok: true, bookingId, status: "CONFIRMED", amount: booking.amount_ugx });
  }
  if (booking.status !== "PENDING_PAYMENT") return fail("This booking can no longer be paid", 409);

  // Atomic claim: exactly one concurrent /pay request may talk to PawaPay.
  // Without this, two fast clicks could store the losing request's network/number.
  const claimAt = new Date().toISOString();
  const staleBefore = new Date(Date.now() - PAY_CLAIM_MS).toISOString();
  const claim = await env.SERENITY_DB.prepare(
    `UPDATE bookings SET deposit_initiated_at = ?, updated_at = ?
     WHERE id = ? AND status = 'PENDING_PAYMENT'
       AND (deposit_initiated_at IS NULL OR deposit_initiated_at < ?)`
  ).bind(claimAt, claimAt, bookingId, staleBefore).run();
  if (!claim.meta || claim.meta.changes === 0) {
    const current = await env.SERENITY_DB.prepare(
      "SELECT payment_provider FROM bookings WHERE id = ?"
    ).bind(bookingId).first();
    return json({
      ok: true,
      bookingId,
      depositId: booking.deposit_id,
      status: "ALREADY_INITIATED",
      amount: booking.amount_ugx,
      provider: current?.payment_provider || providerKey,
      message: "A payment prompt is already open on that phone. Check it before trying again.",
    });
  }

  if (await payRateLimited(request, env)) {
    await releasePayClaim(env, bookingId, claimAt);
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
    console.log("deposit rejected by PawaPay", {
      code,
      provider: providerKey,
      phoneTail: phone.slice(-3),
      response: pay.data && pay.data.failureReason,
    });
    await releasePayClaim(env, bookingId, claimAt);
    return fail(friendlyPayError(code), 502, code || undefined);
  }
  if (status !== "ACCEPTED" && status !== "DUPLICATE_IGNORED") {
    // Never log the full provider payload — error bodies can echo the payer's
    // MSISDN. Log only codes and the masked phone tail (matches REJECTED path).
    console.error("deposit initiation failed", {
      providerHttpStatus: pay.status,
      providerStatus: status,
      failureCode: pay.data && pay.data.failureReason && pay.data.failureReason.failureCode,
      provider: providerKey,
      phoneTail: phone.slice(-3),
    });
    await releasePayClaim(env, bookingId, claimAt);
    return fail("Could not start payment with PawaPay. Please try again.", 502);
  }

  const now = new Date().toISOString();
  const finalize = await env.SERENITY_DB.prepare(
    `UPDATE bookings SET payment_provider = ?, payment_phone = ?, deposit_initiated_at = ?, updated_at = ?
     WHERE id = ? AND deposit_initiated_at = ? AND status = 'PENDING_PAYMENT'`
  ).bind(providerKey, phone, now, now, bookingId, claimAt).run();
  if (!finalize.meta || finalize.meta.changes === 0) {
    // Booking changed underneath us (e.g. cancelled while the prompt was sent).
    return fail("Payment state changed. Check your phone before retrying.", 409);
  }

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
  // Expire abandoned holds on read too — otherwise a slot stays blocked and a
  // customer's status page stays PENDING forever until someone creates a booking.
  await expireStaleHolds(env);
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
      const paidAmount = extractPaidAmount(data);
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
          await archiveBookingById(env, id, "FAILED", "status-check");
          return fail("Payment failed. Please make a new booking.", 410);
        }
      }
    }
  }

  return json({ ok: true, booking: row });
}

function returnPage(siteUrl) {
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
 const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let tries=0; const MAX=40; // ~2 minutes only; never poll forever
 async function check(){
  if(!id){document.getElementById('c').innerHTML='<h1>Missing booking reference</h1>';return;}
  try{
  const r=await fetch('/api/bookings/'+encodeURIComponent(id),{cache:'no-store'});const d=await r.json();
  if(!d.ok){document.getElementById('c').innerHTML='<h1>'+esc(d.error||'Booking not found')+'</h1><p>Reference: '+esc(id)+'</p>';return;}
  const b=d.booking;
  if(b.status==='CONFIRMED'){
   document.getElementById('c').innerHTML='<h1>You are booked ✓</h1><p><strong>'+esc(b.service_title)+'</strong><br>'+esc(b.booking_date)+' at '+esc(b.booking_time)+'</p><p>Reference: '+esc(b.id)+'</p>'+${JSON.stringify(siteUrl ? `<p><a href="${siteUrl}">Back to The Serenity Spa</a></p>` : "")};
  } else if(b.status==='PENDING_PAYMENT'){
   tries+=1;
   if(tries<MAX){setTimeout(check,3000);return;}
   document.getElementById('c').innerHTML='<h1>Payment not received</h1><p>We stopped checking automatically. If you paid, tap below; otherwise make a new booking.</p><button onclick="location.reload()" style="padding:10px 16px;background:#c2a74e;color:#0e1317;border:0;border-radius:8px;font-weight:700;cursor:pointer">Check once more</button><p>Reference: '+esc(b.id)+'</p>';
  } else {
   document.getElementById('c').innerHTML='<h1>Payment not completed</h1><p>Please make a new booking if you still need this slot.</p><p>Reference: '+esc(b.id)+'</p>';
  }
  }catch(e){
   if(tries<MAX){tries+=1;setTimeout(check,3000);return;}
   document.getElementById('c').innerHTML='<h1>Could not check right now</h1><p>Try again shortly.</p>';
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
      let db = "unavailable";
      try {
        const r = await env.SERENITY_DB.prepare("SELECT count(*) AS n FROM services").first();
        db = `${r.n} services`;
      } catch (e) {
        // Never leak raw DB/credential errors to unauthenticated callers.
        console.error("health check failed", e);
      }
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

    if (method === "GET" && path === "/api/availability") {
      const date = url.searchParams.get("date") || "";
      if (!validDate(date)) return fail("Choose a valid date within the next 90 days", 400);
      await expireStaleHolds(env);
      const rows = await env.SERENITY_DB.prepare(
        "SELECT booking_time FROM bookings WHERE booking_date = ? AND status IN ('PENDING_PAYMENT','CONFIRMED')"
      ).bind(date).all();
      return json({ ok: true, date, taken: (rows.results || []).map((r) => r.booking_time) });
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
      const guard = rejectPublicMutation(request, env);
      if (guard) return guard;
      try {
        const row = await env.SERENITY_DB.prepare(
          "SELECT id, status, deposit_initiated_at FROM bookings WHERE id = ?"
        ).bind(match[1]).first();
        if (!row || row.status !== "PENDING_PAYMENT") return fail("Nothing to cancel", 404);
        if (row.deposit_initiated_at) {
          // A PIN prompt may already be on the customer's phone. Cancelling now
          // could take money for a deleted booking; require staff intervention.
          return fail("A payment prompt is already open. Check your phone, or contact reception to cancel.", 409);
        }
        await archiveBookingById(env, match[1], "CANCELLED", "customer");
        return json({ ok: true, status: "CANCELLED" });
      } catch (e) {
        console.error("cancelBooking error", e);
        return fail("Internal error", 500);
      }
    }

    // Admin-only bookings management. Requires the ADMIN_API_TOKEN Worker secret.
    if (path.startsWith("/api/admin/")) {
      if (!isAdmin(request, env)) return fail("Unauthorized", 401);

      if (method === "GET" && path === "/api/admin/bookings") {
        const status = url.searchParams.get("status");
        const parsedLimit = Number(url.searchParams.get("limit") || 100);
        const limit = Number.isFinite(parsedLimit)
          ? Math.min(Math.max(parsedLimit, 1), 500) : 100;
        const columns = `id, deposit_id, service_title, amount_ugx, customer_name, customer_phone,
                         customer_email, booking_date, booking_time, status, payment_provider,
                         payment_phone, created_at, confirmed_at, notes`;
        const where = status ? "WHERE status = ?" : "";
        const args = status ? [status, limit] : [limit];
        const [active, archived, refunds] = await Promise.all([
          env.SERENITY_DB.prepare(
            `SELECT ${columns} FROM bookings ${where} ORDER BY booking_date DESC, booking_time DESC LIMIT ?`
          ).bind(...args).all(),
          env.SERENITY_DB.prepare(
            `SELECT ${columns} FROM bookings_archive ${where} ORDER BY booking_date DESC, booking_time DESC LIMIT ?`
          ).bind(...args).all(),
          env.SERENITY_DB.prepare(
            "SELECT id, deposit_id, booking_id, amount_ugx, reason, status, created_at FROM refunds WHERE status = 'PENDING_REFUND' ORDER BY created_at DESC LIMIT 100"
          ).all(),
        ]);
        const all = [...(active.results || []), ...(archived.results || [])];
        all.sort((a, b) =>
          String(b.booking_date + (b.booking_time || "")).localeCompare(String(a.booking_date + (a.booking_time || "")))
        );
        return json({ ok: true, bookings: all.slice(0, limit), refunds: refunds.results || [] });
      }

      const adminMatch = path.match(/^\/api\/admin\/bookings\/([0-9a-f-]{36})\/cancel$/i);
      if (method === "POST" && adminMatch) {
        try {
          const row = await env.SERENITY_DB.prepare(
            "SELECT id, status, deposit_initiated_at FROM bookings WHERE id = ?"
          ).bind(adminMatch[1]).first();
          if (!row || !["PENDING_PAYMENT", "CONFIRMED"].includes(row.status)) {
            return fail("Nothing to cancel", 404);
          }
          const reason = row.status === "PENDING_PAYMENT" && row.deposit_initiated_at
            ? "admin-during-payment" : "admin";
          await archiveBookingById(env, adminMatch[1], "CANCELLED", reason);
          return json({ ok: true, status: "CANCELLED" });
        } catch (e) {
          console.error("admin cancel error", e);
          return fail("Internal error", 500);
        }
      }

      if (method === "GET" && path === "/api/admin/refunds") {
        const rows = await env.SERENITY_DB.prepare(
          "SELECT * FROM refunds ORDER BY created_at DESC LIMIT 200"
        ).all();
        return json({ ok: true, refunds: rows.results || [] });
      }

      const refundMatch = path.match(/^\/api\/admin\/refunds\/([0-9a-f-]{8}-[0-9a-f-]{4}-[0-9a-f-]{4}-[0-9a-f-]{4}-[0-9a-f-]{12})\/mark$/i);
      if (method === "POST" && refundMatch) {
        const result = await env.SERENITY_DB.prepare(
          "UPDATE refunds SET status = 'REFUNDED', refunded_at = ? WHERE deposit_id = ? AND status = 'PENDING_REFUND'"
        ).bind(new Date().toISOString(), refundMatch[1]).run();
        if (!result.meta || result.meta.changes === 0) return fail("Nothing to mark", 404);
        return json({ ok: true, status: "REFUNDED" });
      }
    }

    if (method === "GET" && path === "/return") {
      return returnPage(env.SITE_URL || "");
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
