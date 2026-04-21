#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// scripts/add-articles.mjs
//
// Splices one or more new articles into src/data/articles.js.
//
// Purpose: during the daily-news routine, Claude drafts each article as a
// small JSON file. This script reads those drafts, assigns IDs, validates,
// and inserts them at the top of the articles array — so the model never
// has to emit a giant Edit tool call against articles.js (which was causing
// "Stream idle timeout" failures mid-routine).
//
// Usage:
//   node scripts/add-articles.mjs <path>
//
//   <path> may be:
//     • a .json file containing a single article OBJECT
//     • a .json file containing an ARRAY of article objects
//     • a directory — every *.json file inside will be read in name order
//
// Example:
//   node scripts/add-articles.mjs scripts/drafts/2026-04-21/
//
// Exit codes: 0 on success, 1 on validation or I/O failure.
// ─────────────────────────────────────────────────────────────────────────────

import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');
const ARTICLES_PATH = join(REPO_ROOT, 'src', 'data', 'articles.js');

const VALID_CATEGORIES = new Set(['tech', 'cyber', 'ai', 'space', 'learning']);

const REQUIRED_FIELDS = [
  'slug',
  'title',
  'summary',
  'body',
  'category',
  'tags',
  'author',
  'publishedAt',
];

// ── CLI ──────────────────────────────────────────────────────────────────────

const [, , inputArg] = process.argv;
if (!inputArg) {
  fail('Usage: node scripts/add-articles.mjs <file-or-dir>');
}

// ── Main ─────────────────────────────────────────────────────────────────────

try {
  const drafts = await loadDrafts(inputArg);
  if (drafts.length === 0) fail(`No article drafts found at: ${inputArg}`);

  const current = await readFile(ARTICLES_PATH, 'utf8');
  const { maxId, existingSlugs } = scanArticles(current);

  const prepared = [];
  let nextId = maxId + 1;
  for (const [i, draft] of drafts.entries()) {
    const label = draft.__sourceLabel || `draft #${i + 1}`;
    delete draft.__sourceLabel;

    validate(draft, label);

    if (existingSlugs.has(draft.slug)) {
      console.warn(`[add-articles] skipping ${label}: slug already exists ("${draft.slug}")`);
      continue;
    }
    existingSlugs.add(draft.slug);

    const article = normalize(draft, nextId++);
    prepared.push({ label, article });
  }

  if (prepared.length === 0) {
    console.log('[add-articles] nothing to insert (all drafts were duplicates).');
    process.exit(0);
  }

  const insertion = prepared
    .map(({ article }) => '  ' + serializeObject(article, 1) + ',')
    .join('\n');

  const marker = 'export const articles = [\n';
  const idx = current.indexOf(marker);
  if (idx === -1) fail(`Could not find "${marker.trim()}" in articles.js`);
  const insertAt = idx + marker.length;

  const next = current.slice(0, insertAt) + insertion + '\n' + current.slice(insertAt);
  await writeFile(ARTICLES_PATH, next, 'utf8');

  console.log(`[add-articles] inserted ${prepared.length} article${prepared.length === 1 ? '' : 's'}:`);
  for (const { label, article } of prepared) {
    console.log(`  • id=${article.id} slug="${article.slug}"  ← ${label}`);
  }
} catch (err) {
  fail(err.message || String(err));
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function loadDrafts(input) {
  const abs = resolve(input);
  const info = await stat(abs);
  const drafts = [];

  if (info.isDirectory()) {
    const entries = (await readdir(abs))
      .filter((n) => n.endsWith('.json'))
      .sort();
    for (const name of entries) {
      const full = join(abs, name);
      const parsed = JSON.parse(await readFile(full, 'utf8'));
      pushParsed(drafts, parsed, name);
    }
  } else {
    const parsed = JSON.parse(await readFile(abs, 'utf8'));
    pushParsed(drafts, parsed, input);
  }

  return drafts;
}

function pushParsed(out, parsed, sourceLabel) {
  if (Array.isArray(parsed)) {
    parsed.forEach((a, i) => {
      a.__sourceLabel = `${sourceLabel}[${i}]`;
      out.push(a);
    });
  } else if (parsed && typeof parsed === 'object') {
    parsed.__sourceLabel = sourceLabel;
    out.push(parsed);
  } else {
    fail(`${sourceLabel}: expected an object or array of objects`);
  }
}

function scanArticles(src) {
  let maxId = 0;
  const idRe = /^\s*id:\s*(\d+)/gm;
  let m;
  while ((m = idRe.exec(src)) !== null) {
    const n = Number(m[1]);
    if (n > maxId) maxId = n;
  }
  const existingSlugs = new Set();
  const slugRe = /^\s*slug:\s*["']([^"']+)["']/gm;
  while ((m = slugRe.exec(src)) !== null) {
    existingSlugs.add(m[1]);
  }
  return { maxId, existingSlugs };
}

function validate(a, label) {
  for (const field of REQUIRED_FIELDS) {
    if (a[field] === undefined || a[field] === null || a[field] === '') {
      fail(`${label}: missing required field "${field}"`);
    }
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug)) {
    fail(`${label}: slug "${a.slug}" is not URL-safe (lowercase, digits, hyphens only)`);
  }
  if (!Array.isArray(a.body) || a.body.length < 2 || !a.body.every((p) => typeof p === 'string' && p.trim())) {
    fail(`${label}: "body" must be an array of at least 2 non-empty strings`);
  }
  if (!VALID_CATEGORIES.has(a.category)) {
    fail(`${label}: category "${a.category}" must be one of ${[...VALID_CATEGORIES].join(', ')}`);
  }
  if (!Array.isArray(a.tags) || a.tags.length === 0) {
    fail(`${label}: "tags" must be a non-empty array of strings`);
  }
  if (Number.isNaN(Date.parse(a.publishedAt))) {
    fail(`${label}: publishedAt "${a.publishedAt}" is not a parseable ISO date`);
  }
  if (a.sources !== undefined) {
    if (!Array.isArray(a.sources)) fail(`${label}: "sources" must be an array if present`);
    a.sources.forEach((s, i) => {
      if (!s || typeof s !== 'object') fail(`${label}: sources[${i}] must be an object`);
      for (const k of ['name', 'desc', 'url']) {
        if (!s[k] || typeof s[k] !== 'string') fail(`${label}: sources[${i}].${k} is required`);
      }
    });
  }
}

function normalize(a, id) {
  const body = a.body;
  const words = body.join(' ').split(/\s+/).filter(Boolean).length;
  const readingTime = typeof a.readingTime === 'number' && a.readingTime > 0
    ? a.readingTime
    : Math.max(3, Math.ceil(words / 200));

  // Emit keys in the same order the existing file uses.
  const out = {
    id,
    slug: a.slug,
    title: a.title,
    summary: a.summary,
    body,
    category: a.category,
    tags: a.tags,
    image: a.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    author: a.author,
    publishedAt: a.publishedAt,
    readingTime,
    featured: Boolean(a.featured),
    trending: Boolean(a.trending),
    breaking: Boolean(a.breaking),
  };
  if (a.sources) out.sources = a.sources;
  return out;
}

// ── Serializer ───────────────────────────────────────────────────────────────
// Emits JS object-literal syntax matching the existing articles.js style:
// unquoted keys (when safe), double-quoted strings, inline short arrays,
// multi-line long arrays, 2-space indent, trailing commas.

function serializeObject(obj, indent) {
  const pad = '  '.repeat(indent);
  const padInner = '  '.repeat(indent + 1);
  const keys = Object.keys(obj);
  if (keys.length === 0) return '{}';
  const lines = keys.map((k) => {
    const keyTok = /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
    return `${padInner}${keyTok}: ${serializeValue(obj[k], indent + 1)}`;
  });
  return '{\n' + lines.join(',\n') + ',\n' + pad + '}';
}

function serializeValue(v, indent) {
  const pad = '  '.repeat(indent);
  const padInner = '  '.repeat(indent + 1);
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'boolean' || typeof v === 'number') return String(v);
  if (typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    const allStrings = v.every((x) => typeof x === 'string');
    const inlineLen = allStrings ? v.reduce((n, x) => n + x.length, 0) + v.length * 4 : Infinity;
    if (allStrings && inlineLen < 80) {
      return '[' + v.map((x) => JSON.stringify(x)).join(', ') + ']';
    }
    const items = v.map((x) => padInner + serializeValue(x, indent + 1));
    return '[\n' + items.join(',\n') + ',\n' + pad + ']';
  }
  if (typeof v === 'object') return serializeObject(v, indent);
  return 'null';
}

function fail(msg) {
  console.error(`[add-articles] ${msg}`);
  process.exit(1);
}
