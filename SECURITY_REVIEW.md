# Security Review — sabr-labs.com (`sabr-tech-site`)

**Date:** 2026-11-17 · **Branch:** `security/artex-hardening` · **Reviewed at:** `origin/main` @ `b5c1b0f`
**Driver:** FBI FLASH-20261113-001 (ARTEX agentic attack framework). This review treats the FLASH's technique list as an attacker's checklist against this repo.

## Stack reality check

The hardening brief assumes Next.js 14 + Turso + Stripe + auth. **This repo is none of those.** It is:

- A **Vite + React 18 SPA** (`react-router-dom`), statically built to `dist/` and post-rendered per route by `scripts/prerender.mjs`.
- **Four Vercel Node serverless functions** in `api/`.
- Content (686 articles) lives in `src/data/articles.js`, written by the **LLM-driven daily news routine** (`AGENTS.md`) via `scripts/add-articles.mjs`.
- One GitHub Actions workflow that picks Wikimedia photos and commits back to `main`.
- Git-integrated Vercel deploys: every push to `main` ships to production.

There is **no database, no user accounts, no sessions, no Stripe, no admin surface and no file upload in this repo.** Sign-in belongs to `app.sabr-labs.com` (`sabr-learning-labs`); this site only *reads* that session cross-origin. So the Phase 2 checks (IDOR, mass assignment, password reset, token signing) and the Phase 3 SQL checks have nothing to bite on here. They belong in the `sabr-learning-labs` pass. Cross-repo observations are listed at the end.

---

## Phase 0 — Attack-surface inventory

### Serverless functions (internet-reachable)

| Route | Methods | Auth | Reads / writes | Input validation | Notes |
|---|---|---|---|---|---|
| `/api/contact` | POST | none (public form) | Sends 1 email via Resend to fixed `CONTACT_EMAIL_TO` | Types, length caps, email regex, HTML-escaped into email | No rate limit, no bot check |
| `/api/newsletter-subscribe` | POST | none (public form) | Creates Beehiiv subscription, `reactivate_existing: true`, `send_welcome_email: true` | Email regex, 254 cap, `source` 40 cap | No rate limit, no bot check. **Currently returns 503**: Beehiiv isn't configured in prod |
| `/api/cron/daily-briefing` | any | `Bearer CRON_SECRET`, **fails open if unset** | Builds HTML from articles, publishes and **sends a Beehiiv post to every subscriber** | none needed | Vercel cron `55 9 * * *`. **Confirmed open in prod** (see F-01) |
| `/api/cover` (via `/covers/<slug>.png`) | GET, HEAD | none (public OG image) | Renders SVG → PNG for a known slug | Slug looked up in an in-memory Map; unknown → 404 | No SSRF, no path traversal, CDN-cached |

### Static routes
SPA routes (`src/App.jsx`) plus 719 prerendered HTML files: `/`, `/news`, `/tech-news`, `/ai-news`, `/cyber-security`, `/learning`, `/about`, `/contact`, `/newsletter`, `/qod`, `/try`, `/compare/*`, `/practice`, `/practice/<cert>`, `/article/<slug>`, `/privacy`, `/terms`, `/refund`, `/search`. Plus `rss.xml`, `sitemap.xml`, `robots.txt`, `llms.txt`, `sabr-logo.png`.

### Outbound integrations
| From | To | Purpose |
|---|---|---|
| `api/contact` | `api.resend.com` | Transactional email |
| `api/newsletter-subscribe`, `api/cron/daily-briefing` | `api.beehiiv.com` | Newsletter |
| Browser (`useAuth`) | `app.sabr-labs.com/api/auth/session`, `/api/user/signout` (credentialed CORS) | Show signed-in state |
| Browser (`QodPage`) | `app.sabr-labs.com/api/public/qod[/check]` | Question of the Day |
| Browser (`DemoLabPage`) | iframe `aruba-lab-simulator.vercel.app` + `postMessage` | Free demo lab |
| Browser | Sentry ingest, Vercel Analytics, Google Fonts, Wikimedia / Unsplash images | Monitoring / assets |
| GitHub Actions | `commons.wikimedia.org` | Photo picker (no secrets) |
| News routine (Claude, local) | arbitrary news sites via WebFetch | Article research → `articles.js` |

### Environment variables
- **Server-only (Vercel, Production scope):** `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`. Referenced but **not set:** `CRON_SECRET`, `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`.
- **Client (`VITE_*`, baked into the bundle):** `VITE_APP_ORIGIN`, `VITE_DISCUSSIONS_ORIGIN`, `VITE_LAB_ENGINE_ORIGIN`, `VITE_SENTRY_DSN`, `VITE_VERCEL_ENV`, `VITE_VERCEL_GIT_COMMIT_SHA`. All are public by nature (origins, a public DSN, build metadata).
- **Local only:** `.env.local` holds a `CLOUDFLARE_API_TOKEN` that no code in this repo references. It is gitignored and has never been committed.

### Crons and automation
- Vercel cron → `/api/cron/daily-briefing` (daily 09:55 UTC).
- GitHub Actions `article-photos.yml`: on push to `main`, hourly, weekly; `contents: write`; commits `src/data/articlePhotos.js` back to `main`, which auto-deploys.
- Claude "Sabr daily news" routine: writes article drafts → `add-articles.mjs` → commits to `main` → auto-deploys.

### Forgotten / leftover surface
- **`/api/cron/daily-briefing` is the forgotten endpoint ARTEX looks for.** It's internet-reachable, its auth is silently off, and it can email the whole subscriber list.
- `src/components/{About,Contact,Footer,Hero,Navbar,Testimonials,WhyChooseUs,TrustBanner,Game}.jsx`: legacy single-page-site components, **imported nowhere** (tree-shaken, not reachable). Dead code only.
- `src/components/comments/CommentSection.jsx`: mock comments with a commented-out `POST /api/comments`. No backend exists, and `/api/comments` returns 404.
- `Resume-site/` and `.vercel/`: local only and gitignored. Deploys come from git, so neither ships.
- Probed in prod and all safe: `/.env`, `/.git/config`, `/.vercel/project.json`, `/src/data/articles.js` → 404; `/Resume-site/` → SPA shell.

---

## Findings

| ID | Sev | Category | Location | Description | Exploit scenario | Fix |
|---|---|---|---|---|---|---|
| **F-01** | **High** (latent Critical) | Missing auth on internal endpoint | `api/cron/daily-briefing.mjs:25-30` | `isAuthed()` returns `true` when `CRON_SECRET` is unset, and it is unset in prod. **Verified live:** unauthenticated `GET ?dryRun=1` → 200. The route also accepts any method, returns raw upstream error text (`:206`), and uses a non-constant-time compare. | Today the send path fails because Beehiiv isn't configured. The day `BEEHIIV_*` is added, anyone can `curl` the URL in a loop and blast every subscriber with repeat newsletters, burning Beehiiv sending reputation and getting the list reported as spam. | Fail closed when the secret is missing, use `timingSafeEqual`, allow GET only, return generic errors. Sam sets `CRON_SECRET` (MANUAL_ACTIONS). |
| **F-02** | **High** (dormant) | Abuse / mass email / consent | `api/newsletter-subscribe.mjs:66-72` | Public, un-rate-limited endpoint calls Beehiiv with `reactivate_existing: true` and `send_welcome_email: true`, and reports `alreadySubscribed` back to the caller. | A script submits a list of victim addresses. Each one gets a welcome email from Sabr's domain (email bombing), and **people who unsubscribed are silently re-subscribed**, which is a CAN-SPAM/GDPR consent problem. `alreadySubscribed` also lets an attacker test whether an address is on the list. | `reactivate_existing: false`, drop the enumeration flag, honeypot field, per-IP limiter. Beehiiv double opt-in plus a Vercel Firewall rate-limit rule (MANUAL_ACTIONS). |
| **F-03** | **Medium** | Stored XSS (LLM / prompt-injection path) | `scripts/prerender.mjs:89` | JSON-LD is emitted with raw `JSON.stringify` inside `<script>`. `JSON.stringify` does not escape `<`, so a title or summary containing `</script><script>…` breaks out and runs on every prerendered article page. | Article text is written by an LLM that reads attacker-controllable web pages. A poisoned headline that survives into a draft becomes persistent XSS on sabr-labs.com. That's same-site with `app.sabr-labs.com`, and this site makes credentialed calls to it. | Escape `<`, `>`, `&`, U+2028/2029 as `\uXXXX` in JSON-LD. |
| **F-04** | **Medium** | HTML injection into outbound email | `api/cron/daily-briefing.mjs:98-123` | `title`, `summary` and `category` are interpolated into the newsletter HTML unescaped. | Same LLM-content path as F-03: injected markup (phishing links, hidden content) ships to every subscriber's inbox under Sabr's name. | HTML-escape every interpolated field. |
| **F-05** | **Medium** | Abuse controls | `api/contact.mjs` | No rate limit and no bot protection. The recipient is fixed, so it isn't an open relay. | A bot floods Sam's inbox and burns the Resend quota and domain reputation. Attacker text arrives "from" `contact@sabr-labs.com`, which helps phishing pretexts against Sam. | Honeypot field, per-IP limiter, Vercel Firewall rule (MANUAL_ACTIONS). |
| **F-06** | **Medium** | Missing security headers | `vercel.json` headers | No `Content-Security-Policy`. Uses `X-Frame-Options: SAMEORIGIN` rather than `frame-ancestors 'none'`. | With no CSP, any XSS (F-03, a compromised dependency, a future bug) has full script execution and unrestricted exfiltration. | Enforced CSP allow-listing exactly the origins the site uses, plus `frame-ancestors 'none'` and `X-Frame-Options: DENY`. |
| **F-07** | **Medium** | Vulnerable dependency | `package.json` | `react-router-dom`/`react-router` 7.17.0: `npm audit` reports 1 high and 1 moderate, including an open redirect via backslash in `<Link>`/`useNavigate` (GHSA-wrjc-x8rr-h8h6). The other advisories affect SSR/RSC modes this SPA doesn't use. | Crafted paths can redirect visitors off-site from a trusted sabr-labs.com link. | Upgrade to 7.18.5 (patch-level, same major). |
| **F-08** | **Low** | URL-scheme injection | `scripts/add-articles.mjs:286-291`, `src/pages/ArticlePage.jsx:206` | `sources[].url` is only checked for being a non-empty string, then rendered as `<a href>`. React 18 does not block `javascript:` URLs. Body links and `image` already enforce `https://`. | A poisoned draft with `"url": "javascript:…"` becomes a click-to-XSS "source" link. | Require `https://` in the validator, and guard at render too. |
| **F-09** | **Low** | CI/CD supply chain | `.github/workflows/article-photos.yml` | `actions/checkout@v4` and `actions/setup-node@v4` are pinned to movable tags, not SHAs. `contents: write` is granted workflow-wide. Good: no secrets used, no `pull_request_target`, inputs passed via `env`. | A compromised action tag runs with a write token to a repo that auto-deploys production. | Pin to commit SHAs. Move `permissions` to the job. |
| **F-10** | **Low** | Supply chain hygiene | repo | No Dependabot / Renovate config. | Vulnerable dependencies (like F-07) linger unnoticed. | Add `.github/dependabot.yml` for npm and GitHub Actions. |
| **F-11** | **Low** | Logging / PII | `api/contact.mjs:95`, `api/newsletter-subscribe.mjs:89` | Upstream error bodies are logged in full and may echo the submitter's email into Vercel logs. | PII spreads into logs that are retained and visible to anyone with project access. | Log status and error code only. |
| **F-12** | **Info** | Secret hygiene (local) | `.env.local` | Contains a `CLOUDFLARE_API_TOKEN` not used by this project. Gitignored, never committed, not in the bundle. | Only exposed if this machine or folder is compromised, but there's no reason for it to live here. | MANUAL_ACTIONS: confirm scope, move or remove, rotate if unsure. |
| **F-13** | **Info** | Detection | — | No alerting on 4xx/429 spikes or email volume. Sentry is browser-only, with nothing on the API functions. | ARTEX-style bursts go unnoticed. | Sentry/Vercel alert rules (MANUAL_ACTIONS). Rate-limit hits are now logged with a `[abuse]` prefix. |

### Phase-by-phase notes

**Phase 1 — Secrets.** Production bundle (`dist/assets/*.js`) scanned for `sk_`, `rk_`, `re_`, `sk-ant-`, `sk-`, JWTs, `libsql://`, private-key headers and env-var names. Only false positives: article text that names token prefixes. No source maps are emitted (Vite default is off). A full `git log --all -p` scan with the same patterns found only false positives (image filenames, article prose). `gitleaks`/`trufflehog` aren't installed on this machine, so the history scan used equivalent regexes: worth a real `gitleaks` run in CI (Dependabot PR or MANUAL_ACTIONS). `.env*` is ignored, `.env.example` holds empty placeholders only, and only `.env.example` has ever been committed. All Vercel secrets are Production-scoped, so previews don't get them.

**Phase 2 — AuthN/AuthZ.** N/A in this repo. No users, sessions, roles or records. The site reads the learning app's NextAuth session via credentialed CORS and links to its login with a `callbackUrl`. Both protections live in `sabr-learning-labs` (see the cross-repo section).

**Phase 3 — Injection / SSRF.** No SQL, no `child_process`, no `eval`/`new Function`, no `dangerouslySetInnerHTML`/`innerHTML`. No server-side fetch takes a user-influenced URL. All outbound hosts are constants, and `/api/cover` only renders known slugs. resvg runs with system fonts off on SVG built from escaped values. No XML is parsed (RSS is *generated*, and escaped). The real injection risk here is **LLM-authored content flowing into HTML contexts**: F-03, F-04, F-08.

**Phase 4 — Abuse.** F-01, F-02, F-05. The in-app limiter is per-instance best-effort (no new paid service). The durable control is a Vercel Firewall rate-limit rule (MANUAL_ACTIONS). Contact email recipient is fixed. There is no endpoint that accepts an arbitrary recipient or HTML body.

**Phase 5 — Leakage and headers.** HSTS (`max-age=63072000`, Vercel default), `nosniff`, `Referrer-Policy` and `Permissions-Policy` are present. No `X-Powered-By`. Error responses to visitors are generic, except the cron (F-01). Sentry runs with `sendDefaultPii: false`, `allowUrls` set to own origins, and errors only (no replay/tracing). `robots.txt` advertises only `/api/` and `/search` (no secrets in that).

**Phase 6 — Dependencies.** `npm audit`: 2 issues, both react-router (F-07). The lockfile is committed. The workflow doesn't install dependencies (Node-only scripts). No suspicious `postinstall` hooks in direct dependencies. Direct dependencies are mainstream (`react`, `framer-motion`, `lucide-react`, `@sentry/react`, `@resvg/resvg-js`, `@vercel/analytics`). Major upgrades (React 19, Vite 8, Tailwind 4) are deliberately **out of scope**.

**Phase 7 — Detection.** No auth events exist here to log. Rate-limit and honeypot hits now log a single `[abuse]` line with route and IP. Emergency kill switches need no code: **remove `RESEND_API_KEY` to disable the contact form, and remove `BEEHIIV_API_KEY` to disable signups and the briefing.** Both endpoints already degrade gracefully when their key is missing. Redeploy after changing env vars.

### Checked and found OK
- `postMessage` listener in `DemoLabPage` verifies `e.origin === ENGINE_ORIGIN` and a `source` tag.
- Article body Markdown links are `https://`-only (`src/lib/articleBody.js:178`). `image` must be `https://` (`add-articles.mjs:276`). Photo `licenseUrl`/`page` are `https` (all 718 verified).
- RSS `content:encoded` is HTML-escaped and `]]>`-safe (`generate-rss.mjs`).
- Contact email body is HTML-escaped and inputs are length-capped. `reply_to` is the only visitor-controlled header.
- Every API route has a method allow-list (now including the cron).
- No CORS headers on the API functions, so browsers on other origins can't read responses.
- `/api/cover` builds only from known slugs, uses escaped XML attributes and is CDN-cached.
- GitHub workflow: no secrets, no `pull_request_target`, no untrusted input interpolated into `run:`.
- No `.env`, `.vercel` or key material in git history. The prod bundle holds no secrets.

### Cross-repo (for the `sabr-learning-labs` pass, not changed here)
1. `/api/auth/session` CORS with credentials: the origin allow-list must be exact-match (no suffix/regex that also matches `evil-sabr-labs.com`), because it returns the user's name and email.
2. `/login` and `/register` `callbackUrl`: confirm NextAuth's `redirect` callback restricts it to `*.sabr-labs.com` (open-redirect risk).
3. `/api/user/signout` is a cross-origin credentialed POST: confirm CSRF protection or an origin check.
4. `/api/public/qod` sends an `answerHash` to the browser. With four options, a plain hash is brute-forceable. It must be an HMAC with a server secret, and `/qod/check` should be rate-limited.
5. Stripe webhook (`src/app/api/webhooks/stripe/route.ts`): signature verification and idempotency, per the brief.
