// ─────────────────────────────────────────────────────────────────────────────
// lib/articleCover.js
//
// Generates a unique cover image (SVG) for every article, so the site no
// longer recycles the same handful of stock photos across hundreds of
// stories. Each cover is seeded from the article's slug, so it never changes
// once published, and picks:
//   • a palette from the category (cyber red, AI purple, tech cyan, ...)
//   • a background pattern (circuit traces, node graph, orbits, waves, ...)
//   • a topic glyph matched from the tags and title (bug for a CVE, CPU for
//     chips, rocket for launches, ...)
//
// Pure string output with no DOM or React dependency: the browser renders it
// as a data URI (see components/articles/ArticleImage.jsx) and the build
// renders the same SVG to PNG for og:image (see scripts/generate-covers.mjs).
// ─────────────────────────────────────────────────────────────────────────────

import { glyphs } from './coverGlyphs.js';

export const COVER_WIDTH = 1200;
export const COVER_HEIGHT = 675; // 16:9, matches the cards' aspect-video

const PALETTES = {
  cyber:    { base: '#0b0f1a', tint: '#3b0d16', accent: '#f87171', alt: '#fb923c' },
  ai:       { base: '#0c0b1a', tint: '#2a1250', accent: '#c084fc', alt: '#818cf8' },
  tech:     { base: '#07131a', tint: '#0c3445', accent: '#22d3ee', alt: '#38bdf8' },
  space:    { base: '#05081a', tint: '#101d4d', accent: '#60a5fa', alt: '#a5b4fc' },
  learning: { base: '#06140f', tint: '#0b3a2a', accent: '#34d399', alt: '#a3e635' },
};

// Ordered most-specific first. Each rule lists a few interchangeable glyphs;
// the slug seed picks one so two ransomware stories don't look identical.
const GLYPH_RULES = [
  [/ransomware|extortion|encrypt/, ['lockKeyhole', 'lock']],
  [/phishing|social engineering|smishing|vishing|\bemail\b|\bbec\b/, ['mailWarning', 'fish']],
  [/infostealer|malware|trojan|botnet|backdoor|\brat\b|worm|spyware|wiper/, ['skull', 'biohazard', 'bugOff']],
  [/crypto|bitcoin|ethereum|wallet|exchange|binance|coinbase|defi|polymarket/, ['wallet', 'bitcoin']],
  [/breach|leak|exposed|stolen data|data theft|shinyhunters|records/, ['database', 'databaseZap']],
  [/supply chain|\bnpm\b|pypi|open source|github|package|dependency|devops|devsecops/, ['package', 'boxes', 'gitBranch']],
  [/credential|password|authentication|\bmfa\b|identity|active directory|\bsso\b|okta|passkey/, ['keyRound', 'fingerprint']],
  [/\bot security|\bics\b|scada|critical infrastructure|energy|power grid|utility|manufacturing/, ['factory', 'zap', 'radioTower']],
  [/zero-day|\brce\b|remote code|\bcve\b|vulnerab|exploit|patch|kev|privilege escalation|injection|bypass/, ['bug', 'shieldAlert', 'triangleAlert', 'fileWarning']],
  [/firewall|\bvpn\b|sd-wan|router|switch|networking|network security|fortinet|palo alto|netscaler|citrix|check point/, ['network', 'router', 'shieldCheck']],
  [/incident|threat intel|\bfbi\b|cisa|advisory|nation-state|\bapt\b|espionage/, ['radar', 'siren']],
  [/privacy|surveillance|tracking|biometric/, ['eye', 'eyeOff']],
  [/semiconductor|\bchip|nvidia|tsmc|dram|\bhbm\b|\bamd\b|intel|\bgpu|sk hynix|samsung|broadcom|micron|wafer/, ['cpu', 'microchip']],
  [/earnings|\bipo\b|funding|valuation|stock|nasdaq|revenue|acquisition|acquire|\bdeal\b|share sale|buyout|layoff/, ['trendingUp', 'chartLine', 'banknote']],
  [/data center|capex|infrastructure|inference|hyperscal|server/, ['server', 'serverCog']],
  [/\bagent/, ['bot', 'brainCircuit']],
  [/quantum/, ['atom']],
  [/starship|rocket|booster|in orbit|reaches orbit|spacex|blue origin|\bnasa\b|artemis|\besa\b|isro|skyroot/, ['rocket', 'rocket', 'orbit', 'earth']],
  [/satellite|starlink|kuiper/, ['satellite', 'satelliteDish']],
  [/telescope|webb|hubble|asteroid|mars|moon|lunar|planet|astronom/, ['telescope', 'earth']],
  [/certification|exam|comptia|\bccnp|\bccna|isc2|cissp|security\+|\bexam\b|study guide/, ['graduationCap', 'award', 'bookOpen']],
  [/regulation|policy|\blaw\b|lawsuit|court|antitrust|government|congress|\beu\b|ftc|\bsec\b|export control|\bban\b/, ['landmark', 'scale', 'gavel']],
  [/iphone|android|smartphone|mobile|pixel|galaxy/, ['smartphone']],
  [/browser|chrome|firefox|safari|web security|wordpress/, ['globe']],
  [/cloud|azure|\baws\b|google cloud|saas/, ['cloud', 'cloudCog']],
  [/tesla|\bev\b|autonomous|robotaxi|waymo|vehicle/, ['car']],
  [/llm|model|openai|anthropic|claude|gemini|gpt|deepseek|\bai\b|machine learning|benchmark|open weights/, ['brain', 'sparkles', 'brainCircuit']],
  [/windows|linux|macos|software|developer|code/, ['code', 'terminal', 'monitor']],
];

const CATEGORY_FALLBACK = {
  cyber: ['shield', 'shieldAlert', 'shieldCheck'],
  ai: ['sparkles', 'brain', 'brainCircuit'],
  tech: ['cpu', 'monitor', 'code'],
  space: ['rocket', 'orbit', 'earth'],
  learning: ['bookOpen', 'graduationCap', 'award'],
};

// Patterns each category leans toward (first entries are the most likely).
const CATEGORY_PATTERNS = {
  cyber: ['circuit', 'grid', 'hex', 'waves', 'graph'],
  ai: ['graph', 'waves', 'grid', 'circuit', 'hex'],
  tech: ['circuit', 'hex', 'grid', 'waves', 'graph'],
  space: ['orbits', 'stars', 'orbits', 'waves'],
  learning: ['grid', 'hex', 'waves', 'graph'],
};

// ── Seeded randomness ────────────────────────────────────────────────────────

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rand, list) => list[Math.floor(rand() * list.length)];
const between = (rand, min, max) => min + rand() * (max - min);
const r1 = (n) => Math.round(n * 10) / 10;

// ── Topic matching ───────────────────────────────────────────────────────────

export function coverGlyphName(article, rand = Math.random) {
  // Tags are the most deliberate signal, so they're checked before the title.
  const tagText = (article.tags || []).join(' | ').toLowerCase();
  const titleText = (article.title || '').toLowerCase();
  for (const text of [tagText, titleText]) {
    for (const [re, names] of GLYPH_RULES) {
      if (re.test(text)) return pick(rand, names);
    }
  }
  return pick(rand, CATEGORY_FALLBACK[article.category] || CATEGORY_FALLBACK.tech);
}

function labelFor(article) {
  const cat = (article.category || 'tech').toUpperCase();
  const tag = (article.tags || [])[0];
  const text = tag ? `${cat} // ${tag.toUpperCase()}` : cat;
  return text.length > 42 ? text.slice(0, 41) + '…' : text;
}

const escapeXml = (s) =>
  String(s).replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));

// ── Pattern layers ───────────────────────────────────────────────────────────

const W = COVER_WIDTH;
const H = COVER_HEIGHT;

function circuitPattern(rand, color) {
  const step = pick(rand, [40, 48, 60]);
  let out = '';
  const traces = 16 + Math.floor(rand() * 10);
  for (let i = 0; i < traces; i++) {
    let x = Math.floor(rand() * (W / step)) * step;
    let y = Math.floor(rand() * (H / step)) * step;
    let d = `M${x} ${y}`;
    const segs = 2 + Math.floor(rand() * 4);
    for (let s = 0; s < segs; s++) {
      const len = (1 + Math.floor(rand() * 4)) * step;
      if (s % 2 === 0) x += rand() < 0.5 ? -len : len;
      else y += rand() < 0.5 ? -len : len;
      d += ` L${x} ${y}`;
    }
    const op = r1(between(rand, 0.18, 0.5));
    out += `<path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-opacity="${op}" stroke-linejoin="round"/>`;
    out += `<circle cx="${x}" cy="${y}" r="5" fill="${color}" fill-opacity="${op + 0.2}"/>`;
  }
  return out;
}

// Grid and hex use an SVG <pattern> for the repeating base, so the file stays
// small; only the handful of highlighted cells are drawn individually.
function gridPattern(rand, color, alt, id) {
  const step = pick(rand, [28, 34, 40]);
  let out = `<defs><pattern id="${id}p" width="${step}" height="${step}" patternUnits="userSpaceOnUse">`
    + `<circle cx="${step / 2}" cy="${step / 2}" r="1.6" fill="${color}" fill-opacity="0.18"/></pattern></defs>`
    + `<rect width="${W}" height="${H}" fill="url(#${id}p)"/>`;
  const cols = Math.floor(W / step);
  const rows = Math.floor(H / step);
  const lit = 30 + Math.floor(rand() * 30);
  for (let i = 0; i < lit; i++) {
    const x = Math.floor(rand() * cols) * step + step / 2;
    const y = Math.floor(rand() * rows) * step + step / 2;
    out += `<circle cx="${x}" cy="${y}" r="3.2" fill="${color}" fill-opacity="0.75"/>`;
  }
  return out;
}

function hexagon(x, y, r) {
  const pts = [];
  for (let k = 0; k < 6; k++) {
    const a = (Math.PI / 3) * k + Math.PI / 6;
    pts.push(`${r1(x + r * Math.cos(a))},${r1(y + r * Math.sin(a))}`);
  }
  return pts.join(' ');
}

function hexPattern(rand, color, alt, id) {
  const r = pick(rand, [34, 42, 52]);
  const hw = Math.sqrt(3) * r;
  const th = 3 * r; // tile height: two staggered rows
  let out = `<defs><pattern id="${id}p" width="${r1(hw)}" height="${th}" patternUnits="userSpaceOnUse">`;
  for (const [x, y] of [[0, 0], [hw, 0], [hw / 2, 1.5 * r], [0, th], [hw, th]]) {
    out += `<polygon points="${hexagon(x, y, r)}" fill="none" stroke="${color}" stroke-opacity="0.13" stroke-width="1.5"/>`;
  }
  out += `</pattern></defs><rect width="${W}" height="${H}" fill="url(#${id}p)"/>`;
  const lit = 10 + Math.floor(rand() * 10);
  for (let i = 0; i < lit; i++) {
    const row = Math.floor(rand() * (H / (1.5 * r) + 1));
    const col = Math.floor(rand() * (W / hw + 1));
    const x = col * hw + (row % 2 ? hw / 2 : 0);
    const y = row * 1.5 * r;
    out += `<polygon points="${hexagon(x, y, r)}" fill="${color}" fill-opacity="0.14" stroke="${color}" stroke-opacity="0.6" stroke-width="1.5"/>`;
  }
  return out;
}

function wavesPattern(rand, color) {
  let out = '';
  const lines = 9 + Math.floor(rand() * 6);
  const amp = between(rand, 18, 60);
  const freq = between(rand, 0.004, 0.011);
  const phase = rand() * Math.PI * 2;
  for (let i = 0; i < lines; i++) {
    const y0 = (H / (lines + 1)) * (i + 1);
    let d = '';
    for (let x = 0; x <= W; x += 20) {
      const y = y0 + Math.sin(x * freq + phase + i * 0.45) * amp * (0.5 + i / lines);
      d += `${x === 0 ? 'M' : ' L'}${x} ${r1(y)}`;
    }
    out += `<path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-opacity="${r1(0.1 + (i / lines) * 0.35)}"/>`;
  }
  return out;
}

function graphPattern(rand, color) {
  const pts = [];
  const n = 26 + Math.floor(rand() * 12);
  for (let i = 0; i < n; i++) pts.push([r1(rand() * W), r1(rand() * H)]);
  let out = '';
  for (let i = 0; i < n; i++) {
    const dists = pts
      .map((p, j) => [j, Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])])
      .filter(([j]) => j !== i)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 2);
    for (const [j] of dists) {
      if (j < i) continue;
      out += `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[j][0]}" y2="${pts[j][1]}" stroke="${color}" stroke-width="1.5" stroke-opacity="0.28"/>`;
    }
  }
  for (const [x, y] of pts) {
    const big = rand() < 0.2;
    out += `<circle cx="${x}" cy="${y}" r="${big ? 7 : 4}" fill="${color}" fill-opacity="${big ? 0.8 : 0.45}"/>`;
  }
  return out;
}

function starField(rand, color, count) {
  let out = '';
  for (let i = 0; i < count; i++) {
    out += `<circle cx="${r1(rand() * W)}" cy="${r1(rand() * H)}" r="${r1(between(rand, 0.6, 2.4))}" fill="${color}" fill-opacity="${r1(between(rand, 0.25, 0.9))}"/>`;
  }
  return out;
}

function orbitsPattern(rand, color, alt) {
  const cx = r1(between(rand, 0.2, 0.8) * W);
  const cy = r1(between(rand, 0.3, 0.9) * H);
  const tilt = r1(between(rand, -25, 25));
  let out = starField(rand, '#ffffff', 90);
  out += `<g transform="rotate(${tilt} ${cx} ${cy})">`;
  const rings = 4 + Math.floor(rand() * 3);
  for (let i = 1; i <= rings; i++) {
    const rx = 90 * i + rand() * 30;
    const ry = rx * 0.38;
    out += `<ellipse cx="${cx}" cy="${cy}" rx="${r1(rx)}" ry="${r1(ry)}" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="${r1(0.4 - i * 0.04)}"/>`;
    const a = rand() * Math.PI * 2;
    out += `<circle cx="${r1(cx + rx * Math.cos(a))}" cy="${r1(cy + ry * Math.sin(a))}" r="${r1(between(rand, 4, 10))}" fill="${i % 2 ? alt : color}" fill-opacity="0.85"/>`;
  }
  out += `<circle cx="${cx}" cy="${cy}" r="${r1(between(rand, 26, 44))}" fill="${color}" fill-opacity="0.35"/></g>`;
  return out;
}

function starsPattern(rand, color, alt) {
  let out = starField(rand, '#ffffff', 180);
  // A faint "constellation" so it reads as more than noise.
  const pts = [];
  let x = between(rand, 0.1, 0.5) * W;
  let y = between(rand, 0.2, 0.8) * H;
  for (let i = 0; i < 6; i++) {
    pts.push([r1(x), r1(y)]);
    x += between(rand, 60, 140);
    y += between(rand, -90, 90);
  }
  out += `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${alt}" stroke-width="1.5" stroke-opacity="0.45"/>`;
  for (const [px, py] of pts) out += `<circle cx="${px}" cy="${py}" r="4" fill="${color}"/>`;
  return out;
}

const PATTERNS = {
  circuit: circuitPattern,
  grid: gridPattern,
  hex: hexPattern,
  waves: wavesPattern,
  graph: graphPattern,
  orbits: orbitsPattern,
  stars: starsPattern,
};

// ── Glyph ────────────────────────────────────────────────────────────────────

function glyphMarkup(name, x, y, size, color) {
  const nodes = glyphs[name] || glyphs.sparkles;
  const scale = size / 24;
  const inner = nodes
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs).map(([k, v]) => `${k}="${escapeXml(v)}"`).join(' ');
      return `<${tag} ${a}/>`;
    })
    .join('');
  // Lucide strokes are 2px at 24px; keep them proportionally bold.
  return `<g transform="translate(${r1(x)} ${r1(y)}) scale(${r1(scale)})" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Build the cover SVG for an article.
 * @param {object} article  needs slug, category, tags, title
 * @param {object} [opts]
 * @param {boolean} [opts.label=true]  draw the "CATEGORY // TAG" label (needs
 *   a font; the PNG build turns it off so output doesn't depend on fonts)
 */
export function articleCoverSvg(article, { label = true } = {}) {
  const seed = hashString(article.slug || article.title || 'sabr');
  const rand = mulberry32(seed);
  const pal = PALETTES[article.category] || PALETTES.tech;

  const angle = Math.floor(rand() * 360);
  const glowX = r1(between(rand, 0.15, 0.85) * 100);
  const glowY = r1(between(rand, 0.1, 0.9) * 100);
  const patternName = pick(rand, CATEGORY_PATTERNS[article.category] || CATEGORY_PATTERNS.tech);
  const patternColor = rand() < 0.7 ? pal.accent : pal.alt;
  const glyphName = coverGlyphName(article, rand);

  // Glyph sits in a glass tile on the left or right third.
  // Kept inside the middle ~64% of the width so square thumbnails, which crop
  // the sides, still show the whole tile.
  const onRight = rand() < 0.55;
  const tile = 300;
  const tileX = onRight ? W - tile - between(rand, 230, 290) : between(rand, 230, 290);
  const tileY = (H - tile) / 2 + between(rand, -50, 50);
  const glyphSize = 170;
  const glyphColor = rand() < 0.65 ? pal.accent : pal.alt;
  const roundTile = rand() < 0.35;

  const id = `c${seed.toString(36)}`;
  const pattern = PATTERNS[patternName](rand, patternColor, pal.alt, id);

  const labelMarkup = label
    ? `<text x="56" y="${H - 52}" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="22" font-weight="600" letter-spacing="4" fill="${pal.accent}" fill-opacity="0.85">${escapeXml(labelFor(article))}</text>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">`
    + `<defs>`
    + `<linearGradient id="${id}bg" gradientTransform="rotate(${angle} 0.5 0.5)"><stop offset="0" stop-color="${pal.base}"/><stop offset="1" stop-color="${pal.tint}"/></linearGradient>`
    + `<radialGradient id="${id}glow" cx="${glowX}%" cy="${glowY}%" r="55%"><stop offset="0" stop-color="${pal.accent}" stop-opacity="0.35"/><stop offset="1" stop-color="${pal.accent}" stop-opacity="0"/></radialGradient>`
    + `<linearGradient id="${id}tile" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.03"/></linearGradient>`
    + `<linearGradient id="${id}fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0.55" stop-color="${pal.base}" stop-opacity="0"/><stop offset="1" stop-color="${pal.base}" stop-opacity="0.7"/></linearGradient>`
    + `</defs>`
    + `<rect width="${W}" height="${H}" fill="url(#${id}bg)"/>`
    + `<rect width="${W}" height="${H}" fill="url(#${id}glow)"/>`
    + `<g>${pattern}</g>`
    + `<rect width="${W}" height="${H}" fill="url(#${id}fade)"/>`
    + `<rect x="${r1(tileX)}" y="${r1(tileY)}" width="${tile}" height="${tile}" rx="${roundTile ? tile / 2 : 56}" fill="url(#${id}tile)" stroke="#ffffff" stroke-opacity="0.14" stroke-width="2"/>`
    + `<circle cx="${r1(tileX + tile / 2)}" cy="${r1(tileY + tile / 2)}" r="120" fill="${glyphColor}" fill-opacity="0.12"/>`
    + glyphMarkup(glyphName, tileX + (tile - glyphSize) / 2, tileY + (tile - glyphSize) / 2, glyphSize, glyphColor)
    + labelMarkup
    + `</svg>`;
}

/** The cover as a data URI, ready for an <img src>. */
export function articleCoverDataUri(article, opts) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(articleCoverSvg(article, opts))}`;
}
