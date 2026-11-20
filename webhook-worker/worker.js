/**
 * Permanent PawaPay callback relay for The Serenity Spa.
 *
 * PawaPay dashboard (all four boxes -> this ONE URL):
 *   https://serenity-pawapay-webhook.<account>.workers.dev
 *
 * Design goal: the URL given to PawaPay never changes. When the booking app
 * moves host/domain, only the FORWARD_TO variable changes — the dashboard,
 * the API token, and staff settings stay exactly as they are.
 *
 * - POST: store the raw callback in KV (durable replay source), respond 200 fast.
 * - POST: best-effort forward to FORWARD_TO with original signature headers,
 *   so the app can verify RFC-9421 signed callbacks itself later.
 * - GET : health check, used to prove the URL is live before pasting it.
 */

const MAX_BODY_BYTES = 64 * 1024;
const KV_TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function forwardedHeaders(request) {
  const headers = new Headers();
  const skip = new Set([
    "host",
    "content-length",
    "connection",
    "cf-connecting-ip",
    "cf-ipcountry",
    "cf-ray",
    "cf-visitor",
    "x-forwarded-for",
    "x-forwarded-proto",
    "x-forwarded-host",
  ]);
  for (const [name, value] of request.headers) {
    const lower = name.toLowerCase();
    if (skip.has(lower) || lower.startsWith("cf-")) continue;
    // content-digest / signature / signature-input MUST pass through untouched
    // for signed-callback verification at the app.
    headers.set(name, value);
  }
  return headers;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "GET") {
      if (url.pathname === "/health" || url.pathname === "/") {
        return jsonResponse({
          ok: true,
          service: "serenity-pawapay-webhook",
          time: new Date().toISOString(),
          forwarding: env.FORWARD_TO ? "enabled" : "not-configured-yet",
          note: "POST PawaPay callbacks here. Stored durably; forwarded once FORWARD_TO is set.",
        });
      }
      return new Response("Not found", { status: 404 });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: { allow: "GET, POST" } });
    }

    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      // Still acknowledge so PawaPay does not retry forever; record the problem.
      console.error("Oversized callback body", { bytes: rawBody.length, path: url.pathname });
      return jsonResponse({ ok: true, warning: "body too large to store" });
    }

    const headers = Object.fromEntries(request.headers.entries());
    const eventId = `${Date.now()}-${crypto.randomUUID()}`;
    const record = {
      id: eventId,
      receivedAt: new Date().toISOString(),
      method: request.method,
      path: url.pathname,
      headers,
      body: rawBody,
      forwardedTo: null,
    };

    // Durable first: even if the app is down or not built yet, the callback is safe.
    await env.SERENITY_PAWAPAY_EVENTS.put(
      `event:${eventId}`,
      JSON.stringify(record),
      { expirationTtl: KV_TTL_SECONDS }
    );

    // Best-effort forward, never blocks the 200 response PawaPay requires.
    if (env.FORWARD_TO) {
      const target = `${env.FORWARD_TO.replace(/\/$/, "")}${url.pathname === "/" ? "/callback" : url.pathname}`;
      ctx.waitUntil(
        fetch(target, {
          method: "POST",
          headers: forwardedHeaders(request),
          body: rawBody,
        })
          .then(async (res) => {
            record.forwardedTo = { target, status: res.status };
            await env.SERENITY_PAWAPAY_EVENTS.put(
              `event:${eventId}`,
              JSON.stringify(record),
              { expirationTtl: KV_TTL_SECONDS }
            );
          })
          .catch((err) => {
            console.error("Forward failed", { target, error: String(err) });
          })
      );
    }

    console.log("PawaPay callback stored", { id: eventId, path: url.pathname });
    return jsonResponse({ ok: true, id: eventId });
  },
};
