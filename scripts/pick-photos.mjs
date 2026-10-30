#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// scripts/pick-photos.mjs
//
// Gives every article a real, freely licensed photo from Wikimedia Commons,
// never the same photo twice, and records the choice (with its credit and
// license) in src/data/articlePhotos.js. The site reads that file at build
// time, so no API call or key is ever needed to render a page; articles
// without a pick keep their generated cover (src/lib/articleCover.js).
//
// Runs in GitHub Actions (.github/workflows/article-photos.yml) after each
// push that adds articles, and hourly to work through the backlog. The cloud
// sessions that publish articles can't reach Commons, so they never run it.
//
// Usage:
//   node scripts/pick-photos.mjs                 pick for articles that need one
//   node scripts/pick-photos.mjs --max 50        cap articles handled this run
//   node scripts/pick-photos.mjs --verify        drop picks whose file is gone
//   node scripts/pick-photos.mjs --dry-run       print picks, write nothing
//
// Commons rules this follows: a descriptive User-Agent, one request at a
// time, maxlag on every call, a generator so one request returns 50
// candidates with their metadata, and only standard thumbnail widths
// (see src/lib/articlePhoto.js).
// ─────────────────────────────────────────────────────────────────────────────

import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { photoQueriesFor, cleanQuery } from './lib/photo-queries.mjs';

const REPO_ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');
export const ARTICLES_PATH = join(REPO_ROOT, 'src', 'data', 'articles.js');
export const PHOTOS_PATH = join(REPO_ROOT, 'src', 'data', 'articlePhotos.js');

const API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'SabrLabsNewsPhotos/1.0 (https://sabr-labs.com; https://github.com/psbrowand/sabr-tech-site)';
const UPLOAD_PREFIX = 'https://upload.wikimedia.org/wikipedia/commons/';
// Commons serves thumbnails from thumb.wikimedia.org now; older responses used
// upload.wikimedia.org/.../thumb/. Both are accepted.
const THUMB_PREFIXES = [
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/',
];
const STOPWORDS = new Set(['a', 'an', 'and', 'the', 'of', 'in', 'on', 'at', 'for', 'with', 'from', 'to']);
const MIN_WIDTH = 1600;          // the article page shows the photo up to ~800px wide at 2x
const MIN_WIDTH_UNRATED = 2000;  // stricter for photos not rated Quality Images
const MIN_RATIO = 1.3;           // landscape only: covers are 16:9
const MAX_RATIO = 2.4;
const NONE_RETRY_DAYS = 14;      // retry articles with no match after this long
const REQUEST_GAP_MS = 250;
const MAX_PAGES_PER_SEARCH = 4;  // 4 × 50 results per query/tier before moving on

// Free licenses whose terms a credit line under the photo satisfies.
// Excludes GFDL-only (requires the full license text) and anything NC/ND.
const LICENSE_OK = /^(cc0|public domain|pd\b|pdm|cc[ -]by(-sa)?[ -]\d(\.\d)?)/i;

// Words in a file's title or description that mean it isn't a usable cover:
// graphics and documents, identifiable people, and anything grim.
const REJECT_WORDS = /\b(logos?|icons?|maps?|diagrams?|charts?|graphs?|screenshots?|screen shot|flags?|coat of arms|emblems?|seals?|insignia|signatures?|posters?|banners?|infographic|scans?|scanned|documents?|letters?|stamps?|covers?|portraits?|headshots?|mugshots?|selfies?|crowds?|protests?|riots?|weapons?|guns?|rifles?|corpses?|dead|nude|naked|blood|accidents?|crash(ed|es)?|wreck|funeral|speaking|speech|speaker|keynote|interview|press conference|ceo|president|minister|senator|congressman|congresswoman|mr|mrs|ms|dr|sir|man|woman|men|women|boy|girl|child|children|people|person|family|wedding|team photo|group photo|meeting with|technicians?|workers?|engineers?|staff|employees?|students?|visitors?|tourists?|launchers?|missiles?|artillery|military|army|soldiers?|tanks?|warships?|bombs?|festival|concert|cafe|latte|cosplay|cosplayers?|expo|convention)\b/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Data files ───────────────────────────────────────────────────────────────

export async function loadArticles() {
  const mod = await import(pathToFileURL(ARTICLES_PATH).href + `?t=${Date.now()}`);
  return mod.articles;
}

export async function loadPhotos(path = PHOTOS_PATH) {
  try {
    const mod = await import(pathToFileURL(path).href + `?t=${Date.now()}`);
    return { ...(mod.articlePhotos || {}) };
  } catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND') return {};
    throw err;
  }
}

export function serializePhotos(photos) {
  const slugs = Object.keys(photos).sort();
  const lines = slugs.map((s) => `  ${JSON.stringify(s)}: ${JSON.stringify(photos[s])},`);
  return [
    '// ─────────────────────────────────────────────────────────────────────────────',
    '// data/articlePhotos.js — GENERATED by scripts/pick-photos.mjs. Do not edit.',
    '//',
    '// The Wikimedia Commons photo chosen for each article, keyed by slug, with',
    '// what the credit line needs. `none` marks an article with no good match yet',
    '// (it keeps its generated cover and is retried later). Read through',
    '// src/lib/articlePhoto.js.',
    '// ─────────────────────────────────────────────────────────────────────────────',
    '',
    'export const articlePhotos = {',
    ...lines,
    '};',
    '',
  ].join('\n');
}

// A photo's identity for the no-repeat rule: its Commons file path.
export function photoKey(p) {
  return p && p.path ? decodeURIComponent(p.path).toLowerCase() : null;
}

// Drops the query string Commons adds (utm_source=… etc.).
function bareUrl(url) {
  return String(url).split(/[?#]/)[0];
}

// Explicit `image` URLs on articles count as used too.
function imageUrlKey(url) {
  const s = bareUrl(url);
  const thumb = THUMB_PREFIXES.find((p) => s.startsWith(p));
  if (!thumb && !s.startsWith(UPLOAD_PREFIX)) return s.toLowerCase();
  // .../commons/a/ab/Name.jpg or .../commons/thumb/a/ab/Name.jpg/1280px-Name.jpg
  const rest = s.slice((thumb || UPLOAD_PREFIX).length);
  const m = rest.match(/^([0-9a-f]\/[0-9a-f]{2}\/[^/]+)/);
  return m ? decodeURIComponent(m[1]).toLowerCase() : rest.toLowerCase();
}

// ── Commons API ──────────────────────────────────────────────────────────────

// API errors that mean "slow down and try again" rather than "bad request".
const RETRYABLE = new Set(['maxlag', 'cirrussearch-too-busy-error', 'ratelimited', 'internal_api_error_DBQueryTimeoutError']);

export function makeClient({ fetchImpl = globalThis.fetch, gapMs = REQUEST_GAP_MS, log = console.log, backoffMs = 15_000 } = {}) {
  let last = 0;
  let requests = 0;
  async function call(params) {
    const qs = new URLSearchParams({ format: 'json', formatversion: '2', maxlag: '5', ...params });
    for (let attempt = 1; attempt <= 5; attempt++) {
      const wait = last + gapMs - Date.now();
      if (wait > 0) await sleep(wait);
      last = Date.now();
      requests++;
      let res;
      try {
        res = await fetchImpl(`${API}?${qs}`, { headers: { 'User-Agent': USER_AGENT, 'Api-User-Agent': USER_AGENT } });
      } catch (err) {
        log(`  request failed (${err.message}), attempt ${attempt}`);
        await sleep(2000 * attempt);
        continue;
      }
      if (res.status === 429 || res.status >= 500) {
        const retry = Number(res.headers?.get?.('retry-after')) || 5 * attempt;
        log(`  HTTP ${res.status}, waiting ${retry}s`);
        await sleep(retry * 1000);
        continue;
      }
      if (!res.ok) throw new Error(`Commons API HTTP ${res.status}`);
      const body = await res.json();
      if (RETRYABLE.has(body.error?.code)) {
        const retryMs = (Number(res.headers?.get?.('retry-after')) * 1000) || backoffMs * attempt;
        log(`  ${body.error.code}, waiting ${Math.round(retryMs / 1000)}s (attempt ${attempt})`);
        await sleep(retryMs);
        continue;
      }
      if (body.error) throw new Error(`Commons API error: ${body.error.code} ${body.error.info || ''}`);
      return body;
    }
    throw new Error('Commons API kept failing; giving up for this run');
  }
  return { call, get requests() { return requests; } };
}

// Kept light on purpose: extra search keywords make Commons' search slower
// and more likely to refuse with "too busy". Size, type and license are
// checked locally in toPhoto() instead.
function searchString(query, tier) {
  return tier === 'qi' ? `${query} incategory:Quality_images` : `${query} filetype:bitmap`;
}

export async function searchCommons(client, query, tier, offset = 0) {
  const body = await client.call({
    action: 'query',
    generator: 'search',
    gsrnamespace: '6',
    gsrlimit: '50',
    gsroffset: String(offset),
    gsrsearch: searchString(query, tier),
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: '1280',
    iiextmetadatafilter: 'Artist|LicenseShortName|LicenseUrl|AttributionRequired|ImageDescription|Restrictions|ObjectName',
    iiextmetadatalanguage: 'en',
  });
  const pages = (body.query?.pages || []).slice().sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  const more = body.continue?.gsroffset !== undefined;
  return { pages, next: more ? Number(body.continue.gsroffset) : null };
}

// ── Candidate checks ─────────────────────────────────────────────────────────

export function stripHtml(s) {
  return String(s || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();
}

function shorten(s, max) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ') > max * 0.6 ? cut.lastIndexOf(' ') : cut.length).trim() + '…';
}

// Commons search matches words loosely (a search for "server room" also finds
// paintings of dining rooms), so the photo's own title or description must
// name the search words as whole words. Plurals count ("cables" matches
// "cable"), and so does a run-together spelling ("datacenter").
function singular(word) {
  const w = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  return w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w;
}

export function matchesQuery(query, text) {
  const words = cleanQuery(query).split(' ').filter((w) => w && !STOPWORDS.has(w)).map(singular).filter(Boolean);
  if (!words.length) return true;
  const tokens = String(text).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).map(singular);
  const have = new Set(tokens);
  for (let i = 0; i + 1 < tokens.length; i++) have.add(tokens[i] + tokens[i + 1]);
  if (have.has(words.join(''))) return true;
  const hits = words.filter((w) => have.has(w)).length;
  return words.length <= 2 ? hits === words.length : hits >= words.length - 1;
}

// The file name must name the search words, or the description must say
// them together as a phrase. Descriptions ramble, so scattered words there
// prove little (a bird photo's caption can mention a "patch" and a "panel").
export function matchesPhoto(query, title, description) {
  if (matchesQuery(query, title)) return true;
  const words = cleanQuery(query).split(' ').filter((w) => w && !STOPWORDS.has(w)).map(singular).filter(Boolean);
  if (!words.length) return true;
  const tokens = String(description).toLowerCase().split(/[^a-z0-9]+/)
    .filter((w) => w && !STOPWORDS.has(w)).map(singular);
  const phrase = words.join(' ');
  for (let i = 0; i + words.length <= tokens.length; i++) {
    if (tokens.slice(i, i + words.length).join(' ') === phrase) return true;
  }
  return words.length > 1 && tokens.join(' ').includes(words.join(''));
}

// Commons descriptions are sometimes license text or an uploader's note
// rather than a description; the file name reads better as alt text then.
function altText(description, title) {
  const fromTitle = title
    .replace(/_/g, ' ')
    .replace(/\s*\((?:\d+|cropped|unsplash)\)\s*/gi, ' ')
    .replace(/\s*[-–]?\s*(?:IMG|DSC|P)_?\d+\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  const d = description.trim();
  const boilerplate = /waiver|copyright|licen[cs]e|all rights|public domain|\bcc[- ]?(by|0)\b|https?:|free picture/i;
  if (d.split(/\s+/).length >= 3 && !boilerplate.test(d)) return d;
  return fromTitle || d;
}

// Returns the record to store, or null with the reason it was rejected.
export function toPhoto(page, { query, tier, today }) {
  const ii = page.imageinfo?.[0];
  if (!ii) return { reject: 'no imageinfo' };
  if (ii.mime !== 'image/jpeg') return { reject: 'not a jpeg' };
  const minW = tier === 'qi' ? MIN_WIDTH : MIN_WIDTH_UNRATED;
  if (!(ii.width >= minW)) return { reject: 'too small' };
  const ratio = ii.width / ii.height;
  if (!(ratio >= MIN_RATIO && ratio <= MAX_RATIO)) return { reject: 'not landscape' };

  const md = ii.extmetadata || {};
  const val = (k) => stripHtml(md[k]?.value);
  if (val('Restrictions')) return { reject: `restricted (${val('Restrictions')})` };

  const license = val('LicenseShortName');
  if (!LICENSE_OK.test(license)) return { reject: `license "${license}"` };

  const title = String(page.title || '').replace(/^File:/, '').replace(/\.jpe?g$/i, '');
  const description = val('ImageDescription');
  if (REJECT_WORDS.test(title) || REJECT_WORDS.test(description)) return { reject: 'subject words' };
  if (!matchesPhoto(query, title, [description, val('ObjectName')].join(' . '))) return { reject: 'off topic' };

  let author = val('Artist');
  if (/^unknown/i.test(author)) author = '';
  if (!author && !/^(cc0|public domain|pd\b|pdm)/i.test(license)) return { reject: 'no author for attribution' };

  if (typeof ii.url !== 'string' || !bareUrl(ii.url).startsWith(UPLOAD_PREFIX)) return { reject: 'unexpected url' };
  const path = bareUrl(ii.url).slice(UPLOAD_PREFIX.length);
  if (!/^[0-9a-f]\/[0-9a-f]{2}\/[^/?#]+$/.test(path)) return { reject: 'unexpected path' };
  const file = path.split('/').pop();
  // The thumbnail URL must follow the standard pattern, so other standard
  // widths can be built from the path alone.
  const thumb = bareUrl(ii.thumburl || '');
  if (!THUMB_PREFIXES.some((p) => thumb === `${p}${path}/1280px-${file}`)) return { reject: 'odd thumbnail url' };

  const photo = {
    path,
    w: ii.width,
    h: ii.height,
    author: shorten(author || 'Unknown author', 80),
    license: shorten(license, 40),
    alt: shorten(altText(description, title), 140),
    q: query,
    at: today,
  };
  const licenseUrl = String(md.LicenseUrl?.value || '').trim();
  if (/^https?:\/\//.test(licenseUrl)) photo.licenseUrl = licenseUrl.replace(/^http:/, 'https:');
  // The file page is normally commons.wikimedia.org/wiki/File:<same name>.
  if (ii.descriptionurl && ii.descriptionurl !== `https://commons.wikimedia.org/wiki/File:${file}`) {
    photo.page = ii.descriptionurl;
  }
  return { photo };
}

// ── Picking ──────────────────────────────────────────────────────────────────

function daysBetween(a, b) {
  return (Date.parse(b) - Date.parse(a)) / 86_400_000;
}

export function needsPhoto(article, entry, today) {
  if (!article?.slug || article.image) return false;
  if (!entry) return true;
  if (entry.none) return daysBetween(entry.none, today) >= NONE_RETRY_DAYS;
  return false;
}

export async function pickPhotos({ articles, photos, client, max = Infinity, today, log = console.log, deadline = Infinity }) {
  const used = new Set();
  for (const p of Object.values(photos)) {
    const k = photoKey(p);
    if (k) used.add(k);
  }
  for (const a of articles) if (a.image) used.add(imageUrlKey(a.image));

  const todo = articles
    .filter((a) => needsPhoto(a, photos[a.slug], today))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, max);

  // Search results are shared across articles in one run: many stories use
  // the same topic phrases, so this keeps request counts low.
  const cache = new Map(); // `${tier}|${query}` → { candidates: [], next, pagesFetched }
  const rejects = new Map(); // reason → count, printed at the end to tune filters
  let seen = 0;
  async function* candidatesFor(query, tier) {
    const key = `${tier}|${query}`;
    let entry = cache.get(key);
    if (!entry) {
      entry = { candidates: [], next: 0, pagesFetched: 0 };
      cache.set(key, entry);
    }
    let i = 0;
    while (true) {
      while (i < entry.candidates.length) yield entry.candidates[i++];
      if (entry.next === null || entry.pagesFetched >= MAX_PAGES_PER_SEARCH) return;
      const { pages, next } = await searchCommons(client, query, tier, entry.next);
      entry.pagesFetched++;
      entry.next = next;
      for (const page of pages) {
        const r = toPhoto(page, { query, tier, today });
        if (r.photo) entry.candidates.push(r.photo);
        else {
          const why = r.reject.replace(/ \(.*$|".*$/, '');
          rejects.set(why, (rejects.get(why) || 0) + 1);
        }
        seen++;
      }
    }
  }

  const picked = [];
  const misses = [];
  let missed = 0;
  let error = null;
  for (const article of todo) {
    if (Date.now() > deadline) {
      log('Time budget used; the rest wait for the next run.');
      break;
    }
    let choice = null;
    try {
      outer: for (const query of photoQueriesFor(article)) {
        for (const tier of ['qi', 'any']) {
          for await (const cand of candidatesFor(cleanQuery(query), tier)) {
            if (!used.has(photoKey(cand))) {
              choice = cand;
              break outer;
            }
          }
        }
      }
    } catch (err) {
      // Keep what this run already picked; the rest wait for the next run.
      log(`Stopping early: ${err.message}`);
      error = err;
      break;
    }
    if (choice) {
      used.add(photoKey(choice));
      photos[article.slug] = choice;
      picked.push({ slug: article.slug, photo: choice });
      log(`✓ ${article.slug}\n    ${choice.path}  [${choice.q}]  ${choice.license}, ${choice.author}`);
    } else {
      missed++;
      misses.push(article.slug);
      log(`· ${article.slug}: no unused match, keeps its generated cover`);
    }
  }
  if (rejects.size) {
    log(`\nChecked ${seen} search results. Rejected: ${[...rejects].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(', ')}`);
  }
  // Nothing at all fitting across many articles points at a broken filter or
  // API change, not at a lack of photos: don't mark them, fail loudly instead.
  if (picked.length === 0 && misses.length >= 20 && !error) {
    error = new Error(`no photo fit any of ${misses.length} articles; not marking them as misses`);
    log(error.message);
  } else {
    for (const slug of misses) photos[slug] = { none: today };
  }
  return { picked, missed, considered: todo.length, error };
}

// Drop picks whose Commons file was deleted, renamed or overwritten, so the
// article falls back to its cover now and gets a fresh pick on the next run.
export async function verifyPhotos({ photos, client, log = console.log }) {
  const slugs = Object.keys(photos).filter((s) => photos[s].path);
  let dropped = 0;
  for (let i = 0; i < slugs.length; i += 50) {
    const batch = slugs.slice(i, i + 50);
    const titleOf = (slug) => `File:${decodeURIComponent(photos[slug].path.split('/').pop())}`;
    const body = await client.call({
      action: 'query', titles: batch.map(titleOf).join('|'), prop: 'imageinfo', iiprop: 'url',
    });
    const normalized = new Map((body.query?.normalized || []).map((n) => [n.from, n.to]));
    const urlByTitle = new Map(
      (body.query?.pages || []).map((p) => [p.title, p.missing ? null : p.imageinfo?.[0]?.url || null]),
    );
    for (const slug of batch) {
      const asked = titleOf(slug);
      const url = urlByTitle.get(normalized.get(asked) || asked);
      if (!url || bareUrl(url) !== `${UPLOAD_PREFIX}${photos[slug].path}`) {
        log(`✗ ${slug}: ${photos[slug].path} ${url ? 'changed' : 'is gone'}, dropping it`);
        delete photos[slug];
        dropped++;
      }
    }
  }
  return { dropped, checked: slugs.length };
}

// ── CLI ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const flag = (n) => args.includes(n);
  const opt = (n, d) => {
    const i = args.indexOf(n);
    return i >= 0 && args[i + 1] ? args[i + 1] : d;
  };
  const max = Number(opt('--max', process.env.PHOTOS_MAX || '400'));
  const minutes = Number(opt('--minutes', process.env.PHOTOS_MINUTES || '25'));
  const today = new Date().toISOString().slice(0, 10);

  const articles = await loadArticles();
  const photos = await loadPhotos();
  const before = serializePhotos(photos);
  const client = makeClient();

  if (opt('--explain')) {
    // Shows why each result for one search is accepted or rejected.
    const query = cleanQuery(opt('--explain'));
    let firstOk = null;
    for (const tier of ['qi', 'any']) {
      const { pages } = await searchCommons(client, query, tier);
      console.log(`\n${tier}: ${pages.length} results`);
      for (const page of pages.slice(0, 12)) {
        const r = toPhoto(page, { query, tier, today });
        if (r.photo && !firstOk) firstOk = r.photo;
        const ii = page.imageinfo?.[0] || {};
        console.log(`  ${r.photo ? 'OK ' : 'NO '} ${page.title}  ${r.reject || ''}\n      ${ii.mime} ${ii.width}x${ii.height} lic=${JSON.stringify(ii.extmetadata?.LicenseShortName?.value)} restr=${JSON.stringify(ii.extmetadata?.Restrictions?.value)}\n      url=${ii.url}\n      thumb=${ii.thumburl}`);
      }
    }
    // Checks that the thumbnail URLs the site builds actually load.
    if (firstOk) {
      const file = firstOk.path.split('/').pop();
      for (const prefix of THUMB_PREFIXES) {
        for (const w of [500, 960, 1280, 1920]) {
          const u = `${prefix}${firstOk.path}/${w}px-${file}`;
          try {
            const res = await fetch(u, { method: 'GET', headers: { 'User-Agent': USER_AGENT }, redirect: 'manual' });
            console.log(`thumb ${res.status} ${res.headers.get('content-type') || ''} ${res.headers.get('location') || ''} ${u}`);
            await res.body?.cancel();
          } catch (e) {
            console.log(`thumb error ${e.message} ${u}`);
          }
        }
      }
    }
    return;
  }
  if (flag('--verify')) {
    const { dropped, checked } = await verifyPhotos({ photos, client });
    console.log(`Verified ${checked} photos, dropped ${dropped}.`);
  }
  const { picked, missed, considered, error } = await pickPhotos({
    articles, photos, client, max, today, deadline: Date.now() + minutes * 60_000,
  });
  console.log(`\n${considered} article(s) needed a photo: ${picked.length} picked, ${missed} with no match. ${client.requests} API request(s).`);

  const after = serializePhotos(photos);
  if (after === before) {
    console.log('No changes to src/data/articlePhotos.js.');
  } else if (flag('--dry-run')) {
    console.log('Dry run: not writing src/data/articlePhotos.js.');
  } else {
    await writeFile(PHOTOS_PATH, after, 'utf8');
    console.log('Wrote src/data/articlePhotos.js.');
  }
  // A failed run still saves its picks above, then reports the failure.
  if (error) process.exit(1);
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch((err) => {
    console.error(`[pick-photos] ${err.stack || err.message || err}`);
    process.exit(1);
  });
}
