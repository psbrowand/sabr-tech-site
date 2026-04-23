// ─────────────────────────────────────────────────────────────────────────────
// scripts/generate-sitemap.mjs
//
// Build-time sitemap.xml generator. Mirrors the pattern used by
// generate-rss.mjs — reads the static article dataset + a hardcoded list
// of marketing/utility routes, writes public/sitemap.xml, Vite copies it
// into dist/ at build time.
//
// Priority model:
//   1.0  →  /                (marketing front door)
//   0.9  →  /#certifications, /#pricing (anchor scroll on /)
//   0.8  →  /learning, /news (primary sections)
//   0.7  →  /tech-news, /ai-news, /cyber-security
//   0.6  →  /article/:slug   (individual posts)
//   0.4  →  /about, /contact, /newsletter, /qod
//   0.2  →  /privacy, /terms, /refund
// ─────────────────────────────────────────────────────────────────────────────

import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITE_URL = 'https://sabr-labs.com';
const OUT_PATH = join(ROOT, 'public', 'sitemap.xml');

function xmlEscape(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function toW3C(iso) {
  const d = iso ? new Date(iso) : new Date();
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

function urlXml({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod    ? `    <lastmod>${xmlEscape(lastmod)}</lastmod>` : '',
    changefreq ? `    <changefreq>${changefreq}</changefreq>`    : '',
    priority   ? `    <priority>${priority}</priority>`          : '',
    '  </url>',
  ].filter(Boolean).join('\n');
}

async function main() {
  const articlesUrl = pathToFileURL(join(ROOT, 'src', 'data', 'articles.js')).href;
  const { articles } = await import(articlesUrl);

  const today = toW3C();

  // Top-level marketing + utility routes.
  const staticRoutes = [
    { loc: `${SITE_URL}/`,                  priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/#certifications`,   priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/#pricing`,          priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/learning`,          priority: '0.8', changefreq: 'weekly' },
    { loc: `${SITE_URL}/news`,              priority: '0.8', changefreq: 'daily'  },
    { loc: `${SITE_URL}/tech-news`,         priority: '0.7', changefreq: 'daily'  },
    { loc: `${SITE_URL}/ai-news`,           priority: '0.7', changefreq: 'daily'  },
    { loc: `${SITE_URL}/cyber-security`,    priority: '0.7', changefreq: 'daily'  },
    { loc: `${SITE_URL}/qod`,               priority: '0.4', changefreq: 'daily'  },
    { loc: `${SITE_URL}/newsletter`,        priority: '0.4', changefreq: 'monthly'},
    { loc: `${SITE_URL}/about`,             priority: '0.4', changefreq: 'monthly'},
    { loc: `${SITE_URL}/contact`,           priority: '0.4', changefreq: 'monthly'},
    { loc: `${SITE_URL}/privacy`,           priority: '0.2', changefreq: 'yearly' },
    { loc: `${SITE_URL}/terms`,             priority: '0.2', changefreq: 'yearly' },
    { loc: `${SITE_URL}/refund`,            priority: '0.2', changefreq: 'yearly' },
  ].map((r) => ({ ...r, lastmod: today }));

  // One URL per article.
  const articleUrls = articles
    .filter((a) => a && a.slug && a.title)
    .map((a) => ({
      loc:        `${SITE_URL}/article/${encodeURIComponent(a.slug)}`,
      lastmod:    toW3C(a.publishedAt),
      changefreq: 'monthly',
      priority:   '0.6',
    }));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    [...staticRoutes, ...articleUrls].map(urlXml).join('\n'),
    '</urlset>',
    '',
  ].join('\n');

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, xml, 'utf8');
  console.log(`[sitemap] wrote ${staticRoutes.length + articleUrls.length} URLs → ${OUT_PATH}`);
}

main().catch((err) => {
  console.error('[sitemap] generation failed:', err);
  process.exit(1);
});
