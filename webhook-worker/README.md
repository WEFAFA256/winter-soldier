# Serenity Spa — bookings API + permanent PawaPay callback relay

One Cloudflare Worker does two jobs:

1. **Permanent PawaPay callback URL** — configured once in the PawaPay dashboard, never changed.
2. **Booking + payment API** — the site's booking page creates bookings here and redirects
   customers to PawaPay's hosted checkout. Bookings are confirmed only after PawaPay's own
   status lookup says the deposit completed.

Public base URL (stable):

```
https://serenity-pawapay-webhook.turyatembajohn905.workers.dev
```

## Why the callback URL is permanent

PawaPay requires callback URLs before it will issue an API token, and those URLs are merchant
configuration. Changing them later means re-entering and re-saving everything. Paste the
**same URL into all four boxes** (Developers → Callback URLs) — checkout, deposits, payouts,
refunds — and save once. When the app moves hosts, only `FORWARD_TO` in `wrangler.toml` changes.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Health + service count + forwarding state |
| `GET` | `/api/services` | Active service catalog from D1 (id, title, price, duration) |
| `POST` | `/api/bookings` | Create a pending booking and PawaPay checkout session; returns `checkoutUrl` |
| `GET` | `/api/bookings/:id` | Poll booking status (`PENDING_PAYMENT` / `CONFIRMED` / `CANCELLED`) |
| `POST` | `/api/bookings/:id/cancel` | Cancel a pending booking and free the slot |
| `GET` | `/return?booking=:id` | Post-payment page that polls the booking until confirmed |
| `POST` | `/` (also `/checkout`, `/deposit`, `/deposits`, `/payouts`, `/refunds`, `/callback`) | PawaPay callbacks: store raw body in KV, verify with PawaPay, confirm booking |

`POST /api/bookings` accepts:

```json
{
  "serviceId": "svc-001",
  "name": "Client Name",
  "phone": "0755123456",
  "email": "client@example.com",
  "date": "2026-11-21",
  "time": "14:30"
}
```

The amount is always looked up from D1 by `serviceId` — the browser never decides what to charge.
The hosted payment page supports both **MTN MoMo** and **Airtel Money**.

## Deployment

```bat
cd C:\Users\BAD_MAN\Desktop\winter-soldier\webhook-worker
"C:\Users\BAD_MAN\Desktop\hex\node_modules\.bin\wrangler.cmd" deploy
```

Bindings (in `wrangler.toml`):

- D1 `SERENITY_DB` → `serenity-spa` (`e347be07-91a9-486c-b03a-415c42b906c3`)
- KV `SERENITY_PAWAPAY_EVENTS` (`1b4dfdce62c040bbbeee9ae1ab8c37fc`) — raw callbacks, 90-day TTL
- Secret `PAWAPAY_API_TOKEN` — set with `wrangler secret put PAWAPAY_API_TOKEN`; **never in files or git**
- Vars: `PAWAPAY_API_BASE_URL`, `PAWAPAY_COUNTRY=UGA`, `PAWAPAY_CURRENCY=UGX`, `FORWARD_TO`, `SITE_URL`

Database schema and seed data are in `schema.sql` and `seed.sql`. Apply with:

```bat
wrangler d1 execute serenity-spa --remote --file schema.sql
wrangler d1 execute serenity-spa --remote --file seed.sql
```

## Verify

```
GET  /health                     -> 200 JSON, "db":"30 services"
GET  /api/services               -> 200 JSON, 30 services
POST /api/bookings               -> 201 with a sandbox checkoutUrl
GET  /api/bookings/<id>          -> 200, status PENDING_PAYMENT
POST /api/bookings (same slot)   -> 409
POST / with forged COMPLETED     -> 200 "unverified; booking unchanged"
```

`wrangler kv key list|get` crashes locally on this Windows host (workerd access violation).
Use the Cloudflare REST API to inspect stored callbacks instead.

## Payment confirmation rules

- The callback body's `status` is **never trusted**. A forged POST cannot confirm a booking.
- The Worker calls `GET /v2/deposits/{depositId}` and requires `status: FOUND`, a matching
  `depositId`, and a matching amount before setting `CONFIRMED`.
- Failed deposits delete the pending booking so the slot can be rebooked.
- Pending bookings older than 20 minutes are expired on the next create request (payment pages
  are valid for 15 minutes).

## Sandbox test numbers (Uganda)

- MTN: `256783456789` → COMPLETED, `256783456129` → SUBMITTED
- Airtel: `256753456789` → COMPLETED, `256753456129` → SUBMITTED

## Security notes

- Signed callback headers (`Content-Digest`, `Signature`, `Signature-Input`) are forwarded
  unchanged when `FORWARD_TO` is set.
- Do not enable PawaPay IP allowlisting with Vercel serverless (no static egress IP).
- The KV store holds raw callback bodies for 90 days — treat it as sensitive.
- The PawaPay token exists only as a Worker secret and in the PawaPay dashboard. Any token ever
  pasted into chat must be revoked and reissued by the user; never claim rotation happened.
