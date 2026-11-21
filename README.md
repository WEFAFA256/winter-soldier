# The Serenity Spa — website

Production: **https://www.executiveserenityspa.com** — a luxury massage and
wellness centre in Mengo / Sir Apollo Kaggwa Rd, Kampala, Uganda.

## What runs where

| Piece | Role | Where it lives |
| --- | --- | --- |
| Next.js 15 app (this repo) | Public pages, admin panel, content APIs | `src/app`, `src/components`, `src/lib` |
| Cloudflare Worker | Bookings, availability, payments, PawaPay callbacks | `webhook-worker/` |
| D1 database `serenity-spa` | Services, bookings, payment events, refund to-dos | bound to the Worker as `SERENITY_DB` |
| Cloudinary | Gallery images + `site-content.json`, `blog.json` raw stores | credentials in platform env vars |
| Vercel | Builds and hosts the Next.js app on push to `main` | project `winter-soldier` |

**Payments: PawaPay only.** MTN MoMo and Airtel Money prompts are initiated on
`/booking`. There is no PesaPal, DPO or card gateway in this codebase. The
Worker verifies every callback against PawaPay's own status API before it
confirms a booking; a forged callback cannot confirm anything.

Refunds are **manual and in person at the spa**. `refunds` is a staff to-do
ledger only — no automatic refund is ever issued by the system.

## Pages

`/` · `/services` · `/vip-packages` · `/mobile-massage` · `/gallery` ·
`/blog` · `/blog/[id]` · `/booking` · `/escorts` · `/admin/gallery`

`/robots.txt` and `/sitemap.xml` are generated. The sitemap includes published
blog articles with stable `lastmod` values.

## Local development

```bash
npm install
cp .env.example .env.local      # fill in values; never commit .env.local
npm run dev
```

Checks before any deploy:

```bash
node node_modules/typescript/bin/tsc --noEmit
npm run build
```

## Configuration

See `.env.example` for every variable and what consumes it. The two Worker URL
variables are deliberately separate:

- `PAY_API_URL` — server-side admin proxies only (never sent to the browser).
- `NEXT_PUBLIC_PAY_API_URL` — the browser booking flow; the prefix is required
  for Next to expose it to client bundles. The CSP `connect-src` is derived
  from this value at build time.

Admin sessions are HMAC-signed HttpOnly cookies. `ADMIN_SESSION_VERSION` is an
emergency kill switch: change its value and redeploy to invalidate every
outstanding session at once.

## Sync and deployment

`C:\Users\BAD_MAN\Desktop\spa` is the working site; this repo is the deploy
source. `spa/sync_to_repo.js` mirrors the whole `src/` and `public/` trees plus
root config files into this repo. It derives its file list from the filesystem
(so new routes cannot be silently omitted), refuses zero-byte sources, and
never deletes from the repo. `clean_sync.js` is intentionally disabled.

To ship a change:

1. `cd C:\Users\BAD_MAN\Desktop\spa && node sync_to_repo.js`
2. `tsc --noEmit` and `npm run build` in **both** directories.
3. If `webhook-worker/` changed, deploy it explicitly:
   `wrangler deploy` from `webhook-worker/` (push alone does NOT redeploy it).
4. Commit and push `main`. Vercel builds and deploys the Next.js app.
5. Verify the served HTML/headers after edge propagation, not just the green
   commit status.

Worker-specific endpoints, rate limits and the callback relay are documented
in `webhook-worker/README.md`.

## Security notes

- Login attempts are throttled; passwords and API tokens live only in platform
  env vars / Worker secrets, never in source.
- CSRF and content-type guards protect all public booking mutations.
- Callbacks are rate-limited, size-capped and never trusted by claimed status.
- Strict CSP, HSTS, `nosniff`, `frame-ancestors 'none'` and `base-uri 'none'`
  are applied to every route.
- AI/tool chat transcripts (`.specstory/`) are ignored and must never be
  committed — past credentials appeared in such files.
