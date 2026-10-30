// ─────────────────────────────────────────────────────────────────────────────
// lib/articlePhoto.js
//
// The real photo for an article, when it has one. Photos come from Wikimedia
// Commons, are picked automatically by scripts/pick-photos.mjs (never the same
// photo twice) and are listed in data/articlePhotos.js. An article without a
// pick, or with an explicit `image`, is handled by ArticleImage as before.
//
// Images are hotlinked from upload.wikimedia.org at standard thumbnail widths
// only, which Wikimedia serves from cache. Every use must show the credit
// (author, license, link to the file page): see PhotoCredit.jsx.
// ─────────────────────────────────────────────────────────────────────────────

import { articlePhotos } from '../data/articlePhotos.js';

const UPLOAD = 'https://upload.wikimedia.org/wikipedia/commons/';
// Wikimedia's standard thumbnail steps (the ones we use).
export const PHOTO_WIDTHS = [500, 960, 1280, 1920];

export function photoFor(article) {
  if (!article || article.image) return null;
  const p = articlePhotos[article.slug];
  return p && p.path ? p : null;
}

// Widths this photo can serve: a thumbnail can't be wider than the original.
function widthsFor(p) {
  const ws = PHOTO_WIDTHS.filter((w) => w < p.w);
  return ws.length ? ws : [PHOTO_WIDTHS[0]];
}

export function photoUrl(p, minWidth = 960) {
  const ws = widthsFor(p);
  const w = ws.find((x) => x >= minWidth) || ws[ws.length - 1];
  const file = p.path.split('/').pop();
  return `${UPLOAD}thumb/${p.path}/${w}px-${file}`;
}

export function photoSrcSet(p) {
  const file = p.path.split('/').pop();
  return widthsFor(p).map((w) => `${UPLOAD}thumb/${p.path}/${w}px-${file} ${w}w`).join(', ');
}

export function photoPage(p) {
  return p.page || `https://commons.wikimedia.org/wiki/File:${p.path.split('/').pop()}`;
}
