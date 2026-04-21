// ─────────────────────────────────────────────────────────────────────────────
// scripts/generate-rss.mjs
//
// Build-time RSS 2.0 feed generator. Reads the static `src/data/articles.js`
// dataset and writes `public/rss.xml`. Vite then copies public/ verbatim into
// dist/ at build time, so the feed is served at https://sabr-labs.com/rss.xml.
//
// Third-party readers (Feedly, Inoreader) and Beehiiv's auto-import can both
// consume this. The site is client-rendered, so without a generated feed
// crawlers see an empty shell — this file is what makes the content
// machine-readable.
// ─────────────────────────────────────────────────────────────────────────────

import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITE_URL = 'https://sabr-labs.com';
const FEED_PATH = join(ROOT, 'public', 'rss.xml');
const MAX_ITEMS = 50;

function xmlEscape(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function toRfc822(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

function articleUrl(slug) {
  return `${SITE_URL}/article/${encodeURIComponent(slug)}`;
}

function itemXml(article) {
  const url = articleUrl(article.slug);
  const body = Array.isArray(article.body) ? article.body.join('\n\n') : String(article.body || '');
  const description = article.summary || body.slice(0, 400);
  const categories = []
    .concat(article.category ? [article.category] : [])
    .concat(Array.isArray(article.tags) ? article.tags : []);

  return [
    '    <item>',
    `      <title>${xmlEscape(article.title)}</title>`,
    `      <link>${xmlEscape(url)}</link>`,
    `      <guid isPermaLink="true">${xmlEscape(url)}</guid>`,
    `      <pubDate>${toRfc822(article.publishedAt)}</pubDate>`,
    article.author ? `      <author>noreply@sabr-labs.com (${xmlEscape(article.author)})</author>` : '',
    ...categories.map((c) => `      <category>${xmlEscape(c)}</category>`),
    `      <description>${xmlEscape(description)}</description>`,
    `      <content:encoded><![CDATA[${body.split('\n\n').map((p) => `<p>${p}</p>`).join('\n')}]]></content:encoded>`,
    '    </item>',
  ]
    .filter(Boolean)
    .join('\n');
}

async function main() {
  // Dynamic import because the articles file uses ES module syntax but we
  // want to read it from a plain Node script without a bundler.
  // Windows ESM dynamic import requires a file:// URL, not a raw path.
  const articlesUrl = pathToFileURL(join(ROOT, 'src', 'data', 'articles.js')).href;
  const { articles } = await import(articlesUrl);

  const sorted = [...articles]
    .filter((a) => a && a.slug && a.title)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, MAX_ITEMS);

  const now = new Date().toUTCString();
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>Sabr Cyber &amp; Tech News</title>',
    `    <link>${SITE_URL}</link>`,
    `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
    '    <description>Breaking cybersecurity, AI, and technology news — curated daily for professionals.</description>',
    '    <language>en-us</language>',
    `    <lastBuildDate>${now}</lastBuildDate>`,
    `    <pubDate>${now}</pubDate>`,
    '    <ttl>60</ttl>',
    sorted.map(itemXml).join('\n'),
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  await mkdir(dirname(FEED_PATH), { recursive: true });
  await writeFile(FEED_PATH, xml, 'utf8');
  console.log(`[rss] wrote ${sorted.length} items → ${FEED_PATH}`);
}

main().catch((err) => {
  console.error('[rss] generation failed:', err);
  process.exit(1);
});
