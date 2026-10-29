// ─────────────────────────────────────────────────────────────────────────────
// api/cover.mjs — GET /covers/<slug>.png (rewritten here by vercel.json)
//
// Renders an article's generated cover (src/lib/articleCover.js) as a
// 1200x630 PNG for og:image / twitter:image and the NewsArticle JSON-LD.
// Social scrapers don't accept SVG, so the browser's data-URI cover can't be
// used there. Rendering on request (cached at the edge) instead of at build
// keeps builds fast and dist small as the archive grows.
// ─────────────────────────────────────────────────────────────────────────────

import { Resvg } from '@resvg/resvg-js';
import { articles } from '../src/data/articles.js';
import { articleCoverSvg } from '../src/lib/articleCover.js';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const bySlug = new Map(articles.map((a) => [a.slug, a]));

export default function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const slug = String(req.query.slug || '').replace(/\.png$/, '');
  const article = bySlug.get(slug);
  if (!article) return res.status(404).json({ error: 'Unknown article.' });

  // No text label: keeps output identical whatever fonts the runtime has.
  // Resizing the root to 1200x630 crops the 16:9 art (preserveAspectRatio slice).
  const svg = articleCoverSvg(article, { label: false })
    .replace(/ width="\d+" height="\d+"/, ` width="${OG_WIDTH}" height="${OG_HEIGHT}"`);
  const png = new Resvg(svg, { font: { loadSystemFonts: false } }).render().asPng();

  res.setHeader('Content-Type', 'image/png');
  // A cover never changes for a given slug unless the generator does, so let
  // the CDN hold it for a week and browsers for a day.
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
  return res.status(200).send(png);
}
