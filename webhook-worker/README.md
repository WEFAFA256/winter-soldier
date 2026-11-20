# Serenity Spa — permanent PawaPay callback relay

## Why this exists

PawaPay requires callback URLs before it will issue an API token, and those URLs
are part of the merchant configuration. Changing them later means going back into
the dashboard and re-saving everything.

This Worker gives us **one URL that never changes**. PawaPay is configured once.
When the booking app is deployed (or moved to another host), we only change
`FORWARD_TO` in `wrangler.toml` and re-deploy this Worker.

## URL to paste in PawaPay

After deploy, Wrangler prints the URL. It looks like:

```
https://serenity-pawapay-webhook.<account>.workers.dev
```

Paste that **same URL into all four boxes** in the PawaPay sandbox dashboard
(Developers → Callback URLs):

- Checkout
- Deposits
- Payouts
- Refunds

Then Save Changes, then generate the API token.

## Deploy

```bat
cd C:\Users\BAD_MAN\Desktop\winter-soldier\webhook-worker
"C:\Users\BAD_MAN\Desktop\hex\node_modules\.bin\wrangler.cmd" deploy
```

## Verify

```
GET  https://serenity-pawapay-webhook.<account>.workers.dev/health   -> 200 JSON
POST https://serenity-pawapay-webhook.<account>.workers.dev/          -> 200 {"ok":true,...}
```

## Inspect stored callbacks (replay source)

```bat
"C:\Users\BAD_MAN\Desktop\hex\node_modules\.bin\wrangler.cmd" kv key list --binding SERENITY_PAWAPAY_EVENTS
"C:\Users\BAD_MAN\Desktop\hex\node_modules\.bin\wrangler.cmd" kv key get event:<id> --binding SERENITY_PAWAPAY_EVENTS
```

## Later, when the app has real callback routes

Set `FORWARD_TO` to the app base, e.g.:

```toml
[vars]
FORWARD_TO = "https://theserenityspa.ug/api/payments/pawapay"
```

Re-deploy this Worker. PawaPay settings do **not** change.

## Security notes

- Signed callback headers (`Content-Digest`, `Signature`, `Signature-Input`) are
  forwarded unchanged so the app can verify authenticity itself.
- Do not enable PawaPay IP allowlisting with Vercel serverless (no static egress IP).
- The KV store holds raw callback bodies for 90 days — treat it as sensitive.
