// ─────────────────────────────────────────────────────────────────────────────
// /api/cron/daily-briefing — Vercel cron handler
//
// Fires every day at 09:55 UTC (4:55 AM Eastern in winter, 5:55 in summer —
// acceptable drift per the newsletter plan; revisit if readers complain).
//
// What it does:
//   1. Loads src/data/articles.js
//   2. Picks the top 5 stories from the last 24h (widens to 72h if <5)
//   3. Picks one "category === learning" certification-tagged article for
//      the daily cert spotlight — rotated deterministically by day-of-year
//   4. POSTs a new post to Beehiiv with status: "confirmed" and
//      send_now: true so Beehiiv publishes + sends in one call
//
// Auth: the Vercel cron runner sends `Authorization: Bearer ${CRON_SECRET}`
// when CRON_SECRET is set in project env. Manual HTTP callers need the same.
// ─────────────────────────────────────────────────────────────────────────────

import { articles as allArticles } from '../../src/data/articles.js';

const SITE_URL = 'https://sabr-labs.com';
const BEEHIIV_BASE = 'https://api.beehiiv.com/v2';
const TOP_NEWS_COUNT = 5;

function isAuthed(req) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return true; // dev / no-secret mode
  const header = req.headers.authorization || req.headers.Authorization || '';
  return header === `Bearer ${expected}`;
}

function dayOfYear(date = new Date()) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const diff = date.getTime() - start;
  return Math.floor(diff / 86_400_000);
}

function scoreArticle(a) {
  // Highest-priority first. Breaking beats featured beats trending; within a
  // band, newer wins. Tie-break: id, so ordering is deterministic for a
  // given dataset snapshot.
  let score = 0;
  if (a.breaking) score += 10_000;
  if (a.featured) score += 1_000;
  if (a.trending) score += 100;
  const ts = new Date(a.publishedAt).getTime();
  score += ts / 1_000_000; // recency bonus, normalized
  return score;
}

function pickTopNews(articles, now = new Date()) {
  const cutoff24 = now.getTime() - 24 * 60 * 60 * 1000;
  const cutoff72 = now.getTime() - 72 * 60 * 60 * 1000;
  const within = (t) => articles.filter((a) => new Date(a.publishedAt).getTime() >= t);
  // Cascade freshness: last 24h first, then 72h, then fall back to "top N
  // of all time" so a quiet news cycle doesn't skip the send.
  let pool = within(cutoff24);
  if (pool.length < TOP_NEWS_COUNT) pool = within(cutoff72);
  if (pool.length < TOP_NEWS_COUNT) pool = [...articles];
  return pool
    .slice()
    .sort((a, b) => scoreArticle(b) - scoreArticle(a))
    .slice(0, TOP_NEWS_COUNT);
}

function pickCertSpotlight(articles, now = new Date()) {
  const certArticles = articles.filter(
    (a) =>
      a.category === 'learning' &&
      Array.isArray(a.tags) &&
      a.tags.some((t) => /certif/i.test(t))
  );
  if (certArticles.length === 0) return null;
  // Deterministic rotation so reruns on the same day pick the same article.
  const sorted = [...certArticles].sort((a, b) =>
    String(a.slug).localeCompare(String(b.slug))
  );
  return sorted[dayOfYear(now) % sorted.length];
}

function fmtDate(d = new Date()) {
  return d.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function articleUrl(slug) {
  return `${SITE_URL}/article/${encodeURIComponent(slug)}`;
}

function buildHtml({ topNews, certPick, dateLabel }) {
  // Keep HTML small and email-client-safe. Beehiiv will wrap this with the
  // publication header/footer + unsubscribe link automatically.
  const storyBlock = (a, i) => `
    <div style="margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid #1f2937;">
      <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:4px;">Story ${i + 1} · ${a.category}</div>
      <h2 style="font-size:20px;line-height:1.3;margin:0 0 8px;color:#f1f5f9;"><a href="${articleUrl(a.slug)}" style="color:#f1f5f9;text-decoration:none;">${a.title}</a></h2>
      <p style="margin:0 0 10px;color:#cbd5e1;font-size:15px;line-height:1.5;">${a.summary || ''}</p>
      <a href="${articleUrl(a.slug)}" style="color:#22d3ee;font-size:14px;text-decoration:none;">Read the full story →</a>
    </div>`;

  const certBlock = certPick
    ? `
    <div style="margin-top:32px;padding:20px;border-radius:12px;background:#0f172a;border:1px solid rgba(52,211,153,0.25);">
      <div style="font-size:12px;color:#34d399;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px;">Cert Spotlight</div>
      <h2 style="font-size:20px;line-height:1.3;margin:0 0 8px;color:#f1f5f9;"><a href="${articleUrl(certPick.slug)}" style="color:#f1f5f9;text-decoration:none;">${certPick.title}</a></h2>
      <p style="margin:0 0 10px;color:#cbd5e1;font-size:15px;line-height:1.5;">${certPick.summary || ''}</p>
      <a href="${articleUrl(certPick.slug)}" style="color:#34d399;font-size:14px;text-decoration:none;">Read more →</a>
    </div>`
    : '';

  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;color:#f1f5f9;background:#080c18;padding:32px 24px;">
      <div style="font-size:13px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.14em;margin-bottom:6px;">Sabr Daily Briefing</div>
      <h1 style="font-size:26px;line-height:1.2;margin:0 0 24px;font-weight:900;color:#f1f5f9;">${dateLabel}</h1>
      ${topNews.map(storyBlock).join('')}
      ${certBlock}
      <p style="margin:32px 0 0;font-size:13px;color:#64748b;">Read all of today's stories at <a href="${SITE_URL}" style="color:#22d3ee;">sabr-labs.com</a>.</p>
    </div>`;
}

function buildSubject(topStory, dateLabel) {
  // Format: "{Mon Apr 20}: {first 60 chars of top headline}"
  const short = dateLabel.replace(/, \d{4}$/, ''); // drop year
  const title = (topStory && topStory.title) || 'Your daily cyber + tech briefing';
  const clipped = title.length > 70 ? `${title.slice(0, 67)}…` : title;
  return `${short}: ${clipped}`;
}

async function publishToBeehiiv({ subject, html, subtitle }) {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !publicationId) {
    throw new Error('Beehiiv credentials missing (BEEHIIV_API_KEY / BEEHIIV_PUBLICATION_ID).');
  }
  const res = await fetch(
    `${BEEHIIV_BASE}/publications/${encodeURIComponent(publicationId)}/posts`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: subject,
        subtitle,
        body_content: html,
        status: 'confirmed',
        send_email: true,
        send_now: true,
        email_settings: {
          email_subject_line: subject,
        },
      }),
    }
  );
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Beehiiv publish failed (${res.status}): ${body}`);
  }
  return res.json().catch(() => ({}));
}

export default async function handler(req, res) {
  if (!isAuthed(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const now = new Date();
    const topNews = pickTopNews(allArticles, now);
    if (topNews.length === 0) {
      console.warn('[daily-briefing] no articles in window — skipping send');
      return res.status(200).json({ ok: true, skipped: 'no-articles' });
    }
    const certPick = pickCertSpotlight(allArticles, now);
    const dateLabel = fmtDate(now);
    const subject = buildSubject(topNews[0], dateLabel);
    const subtitle = topNews[0]?.summary?.slice(0, 160) || '';
    const html = buildHtml({ topNews, certPick, dateLabel });

    // Dry-run mode for local testing: ?dryRun=1 returns the rendered payload
    // without hitting Beehiiv.
    const url = new URL(req.url || '/', 'http://local');
    if (url.searchParams.get('dryRun') === '1') {
      return res.status(200).json({
        ok: true,
        dryRun: true,
        subject,
        subtitle,
        topNewsTitles: topNews.map((a) => a.title),
        certPickTitle: certPick?.title || null,
        html,
      });
    }

    const result = await publishToBeehiiv({ subject, html, subtitle });
    console.log('[daily-briefing] published', { subject, topN: topNews.length, cert: certPick?.slug });
    return res.status(200).json({ ok: true, subject, postId: result?.data?.id ?? null });
  } catch (err) {
    console.error('[daily-briefing] failed', err);
    return res.status(500).json({ error: String(err.message || err) });
  }
}
