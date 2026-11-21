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
| `GET` | `/api/availability?date=` | Booked times for a date (read-only UX hint; D1 is authoritative) |
| `POST` | `/api/bookings` | Create a pending booking (amount from D1); returns `bookingId` + `depositId` |
| `POST` | `/api/bookings/:id/pay` | Send the MTN/Airtel MoMo prompt; amount always from D1 |
| `GET` | `/api/bookings/:id` | Poll booking status (`PENDING_PAYMENT` / `CONFIRMED` / `CANCELLED`) |
| `POST` | `/api/bookings/:id/cancel` | Cancel a pending booking and free the slot |
| `GET` | `/api/admin/bookings?status=&limit=` | Admin list incl. archive + refund to-dos (requires `Authorization: Bearer <ADMIN_API_TOKEN>`) |
| `GET` | `/api/admin/refunds` | Manual refund to-do ledger (refunds are processed in person at the spa) |
| `POST` | `/api/admin/refunds/:depositId/mark` | Mark a refund to-do as done after it is paid in person |
| `POST` | `/api/admin/bookings/:id/cancel` | Admin cancel of a pending or confirmed booking (refund is manual) |
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
The booking page initiates **MTN MoMo** and **Airtel Money** prompts directly via `/pay`. By default the full
service price is charged. To take a deposit instead, set `PAWAPAY_DEPOSIT_PERCENT` (e.g. `30`);
amounts are rounded up to the next 1,000 UGX.

`POST /api/bookings` is throttled: at most 5 attempts per client IP per 10-minute window, plus a
global stop at 100 live holds/bookings created in the last hour. Excess requests get HTTP 429.
Callbacks are throttled per IP (50 per 10 minutes) and capped at 64 KB to prevent quota/storage abuse.

## Deployment

```bat
cd C:\Users\BAD_MAN\Desktop\winter-soldier\webhook-worker
"C:\Users\BAD_MAN\Desktop\hex\node_modules\.bin\wrangler.cmd" deploy
```

Bindings (in `wrangler.toml`):

- D1 `SERENITY_DB` → `serenity-spa` (`e347be07-91a9-486c-b03a-415c42b906c3`)
- KV `SERENITY_PAWAPAY_EVENTS` (`1b4dfdce62c040bbbeee9ae1ab8c37fc`) — raw callbacks, 90-day TTL
- Secret `PAWAPAY_API_TOKEN` — set with `wrangler secret put PAWAPAY_API_TOKEN`; **never in files or git**
- Secret `ADMIN_API_TOKEN` — set with `wrangler secret put ADMIN_API_TOKEN`; protects the admin
  bookings endpoints. Use the same value as the Next app's `ADMIN_API_TOKEN` env var.
- Vars: `PAWAPAY_API_BASE_URL`, `PAWAPAY_CURRENCY=UGX`, `FORWARD_TO`,
  `SITE_URL`, `PAWAPAY_DEPOSIT_PERCENT=100`

Database schema and seed data are in `schema.sql` and `seed.sql`. Apply with:

```bat
wrangler d1 execute serenity-spa --remote --file schema.sql
wrangler d1 execute serenity-spa --remote --file seed.sql
```

`schema.sql` is safe to re-run — it only creates tables/indexes that do not exist yet.

## Verify

```
GET  /health                     -> 200 JSON, "db":"30 services"
GET  /api/services               -> 200 JSON, 30 services
POST /api/bookings               -> 201 with bookingId + depositId
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
- Pending holds expire 20 minutes after the payment prompt is sent (not at booking creation).
  Expiry runs on availability checks, status checks and the next create request, so a customer
  at the PIN prompt is never evicted. A late `FAILED` result never overturns a CONFIRMED booking.

## Sandbox test numbers (Uganda)

- MTN: `256783456789` → COMPLETED, `256783456129` → SUBMITTED
- Airtel: `256753456789` → COMPLETED, `256753456129` → SUBMITTED

## Security notes

- Callback bodies are rate-limited and size-capped. Signed headers (`Content-Digest`,
  `Signature`, `Signature-Input`) are forwarded
  unchanged when `FORWARD_TO` is set.
- Do not enable PawaPay IP allowlisting with Vercel serverless (no static egress IP).
- The KV store holds raw callback bodies for 90 days — treat it as sensitive.
- The PawaPay token exists only as a Worker secret and in the PawaPay dashboard. Any token ever
  pasted into chat must be revoked and reissued by the user; never claim rotation happened.
