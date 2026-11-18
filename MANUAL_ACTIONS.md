# Manual actions for Sam — sabr-labs.com (`sabr-tech-site`)

Everything here needs a dashboard or a human decision. The code fixes are already shipped (see `SECURITY_REVIEW.md`). Ordered by priority.

## Do first (blocks a code fix from being complete)

- [ ] **Vercel → sabr-tech-site → Settings → Environment Variables → add `CRON_SECRET`** (Production only). Use a random value of at least 32 characters (for example, run `openssl rand -hex 32` locally). Vercel's cron runner sends it automatically. Until it's set, `/api/cron/daily-briefing` now returns 401 to everyone, including the cron. That's fine today, because the briefing can't send anyway with Beehiiv unconfigured. (F-01)
- [ ] **Before adding `BEEHIIV_API_KEY` / `BEEHIIV_PUBLICATION_ID`:** set `CRON_SECRET` first. Then, in Beehiiv, turn on **double opt-in** for the publication, so a third party can't subscribe someone just by typing their address. (F-02)

## Vercel

- [ ] **Firewall rate-limit rules** (Project → Firewall → Rules). The in-app limiter is per-instance best-effort. This is the durable control.
  - `POST /api/contact`: 5 requests / 10 min per IP → deny (429)
  - `POST /api/newsletter-subscribe`: 5 requests / 10 min per IP → deny (429)
  - `/api/cron/*`: deny any request whose user-agent isn't `vercel-cron/1.0`. This is defense in depth only, since the secret is the real check.
- [ ] 2FA on the Vercel account. Review team members and installed integrations.
- [ ] Deployment Protection on preview deployments (Vercel Authentication) is on.
- [ ] Env-var scoping is already correct (all secrets are Production-only, so previews don't get them). Keep it that way when adding `CRON_SECRET` and the Beehiiv keys.
- [ ] The Vercel MCP connection used by Claude was denied **env-var listing** and **firewall config** reads. That's fine from a least-privilege view. Re-grant read access only if you want Claude to verify these settings for you.

## GitHub (`psbrowand/sabr-tech-site`)

- [ ] 2FA on the account.
- [ ] **Branch protection on `main`.** Caution: the photo-picker workflow and the news routine push straight to `main`. Use a ruleset that blocks force-push and deletion, and add the `github-actions[bot]` bypass if you require PRs.
- [ ] Settings → Code security: enable **Secret scanning**, **Push protection** and **Dependabot alerts**. A `dependabot.yml` for version updates is now in the repo.
- [ ] Review authorized OAuth apps, GitHub Apps and deploy keys (Settings → Applications, repo → Deploy keys).
- [ ] Optional: run `gitleaks detect` once locally. This review used equivalent regex scans because gitleaks isn't installed, and they found nothing.

## Resend

- [ ] `RESEND_API_KEY` should be a **Sending access** key restricted to the `sabr-labs.com` domain, not Full access.
- [ ] Confirm SPF, DKIM and DMARC records are in place for `sabr-labs.com`. DMARC should be at least `p=quarantine` once reports look clean.
- [ ] Set a usage alert so a sudden spike in contact-form mail is noticed.

## Beehiiv (when you turn the newsletter on)

- [ ] Double opt-in on (see above).
- [ ] An API key with minimum scope, stored in Vercel Production only.

## Sentry

- [ ] Alert rule on the `sabr-labs-site` project: error-count spike (for example, more than 20 in 5 min).
- [ ] Sentry auth tokens (if any exist for CI or source maps) scoped to `project:releases` only.

## Local machine hygiene

- [ ] `sabr-tech-site/.env.local` contains a `CLOUDFLARE_API_TOKEN` that no code in this repo uses. It's gitignored and was never committed. Confirm what it's scoped to, move it somewhere it belongs, and **rotate it if you're unsure where else it's been copied.** (F-12)

## LLM / news routine

- [ ] Spend limits and usage alerts on whatever API key or plan the "Sabr daily news" routine runs under.
- [ ] Awareness: articles are written from web pages the model reads, so a hostile page can try to plant content. The code now neutralizes the HTML-injection paths (F-03, F-04, F-08). The remaining risk is misleading *text*, which only editorial review catches.

## Domain registrar and DNS

- [ ] 2FA on the registrar and DNS provider (Cloudflare, given the token above). Turn on **registrar lock**.

## Not applicable to this repo (do these in the `sabr-learning-labs` pass)

Turso tokens, Stripe restricted keys and webhook secret, and auth-secret rotation (`AUTH_SECRET`/`NEXTAUTH_SECRET`). See the cross-repo list at the end of `SECURITY_REVIEW.md`.
