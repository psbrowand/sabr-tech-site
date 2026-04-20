# sabr-tech-site

Cyber & tech news site for the **sabr-labs.com** umbrella. Vite + React SPA, deployed to Vercel.

Sister project:
- [`sabr-learning-labs`](https://github.com/SABR-Browand/sabr-learning-labs) — the cert-training product at `app.sabr-labs.com` + forum at `discussions.sabr-labs.com`.

## Stack

- Vite 6 + React 18
- React Router 7
- Tailwind 3.4
- lucide-react + framer-motion
- Vercel Serverless Functions (under `/api/`) for newsletter + contact
- Resend for all email (transactional + newsletter broadcasts)

## Develop

```bash
npm install
cp .env.example .env.local   # fill in RESEND_API_KEY, RESEND_AUDIENCE_ID
npm run dev                  # vite on :5173
```

## Deploy

Linked to Vercel project `sabr-tech-site`. Pushes to `main` auto-deploy to production; PRs get preview URLs.

Environment variables live in the Vercel dashboard. See `.env.example` for the full list; production values are set there, not here.

## Architecture

```
sabr-labs.com             → this site (tech news)          ← Vercel: sabr-tech-site
app.sabr-labs.com         → learning app                   ← Vercel: sabr-learning-labs
discussions.sabr-labs.com → forum (same app, rewritten)    ← Vercel: sabr-learning-labs
```

Legacy `sabrlearning.com` hosts 301 to the matching `sabr-labs.com` host at the Cloudflare edge.
