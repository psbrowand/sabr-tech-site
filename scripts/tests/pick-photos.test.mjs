// Offline tests for scripts/pick-photos.mjs and src/lib/articlePhoto.js.
// Run: node scripts/tests/pick-photos.test.mjs   (no network; Commons is faked)
import assert from 'node:assert/strict';
import { writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  toPhoto, pickPhotos, verifyPhotos, serializePhotos, loadPhotos, makeClient, photoKey, needsPhoto,
} from '../pick-photos.mjs';
import { photoQueriesFor } from '../lib/photo-queries.mjs';
import { photoUrl, photoSrcSet, photoPage, PHOTO_WIDTHS } from '../../src/lib/articlePhoto.js';

let passed = 0;
async function test(name, fn) {
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { console.error(`  ✗ ${name}\n${err.stack}`); process.exitCode = 1; }
}

const TODAY = '2026-10-30';
const UP = 'https://upload.wikimedia.org/wikipedia/commons/';

// A fake Commons file page as the API returns it (formatversion=2).
function page(name, { index = 1, w = 4000, h = 2250, mime = 'image/jpeg', license = 'CC BY-SA 4.0',
  artist = '<a href="//commons.wikimedia.org/wiki/User:Jane">Jane Doe</a>', restrictions = '', desc = 'A rack of servers' } = {}) {
  const file = encodeURIComponent(name.replace(/ /g, '_'));
  const hash = (name.length % 16).toString(16) + '/' + (name.length % 16).toString(16) + 'c';
  return {
    title: `File:${name}`,
    index,
    imageinfo: [{
      url: `${UP}${hash}/${file}`,
      thumburl: `${UP}thumb/${hash}/${file}/1280px-${file}`,
      descriptionurl: `https://commons.wikimedia.org/wiki/File:${file}`,
      width: w, height: h, mime,
      extmetadata: {
        Artist: { value: artist },
        LicenseShortName: { value: license },
        LicenseUrl: { value: 'https://creativecommons.org/licenses/by-sa/4.0' },
        ImageDescription: { value: desc },
        Restrictions: { value: restrictions },
      },
    }],
  };
}

// Fake fetch: answers every search with `perQuery` distinct files named after
// the query and page offset, and records what was asked.
function fakeFetch({ perQuery = 3, failAfter = Infinity, existing = null } = {}) {
  const calls = [];
  const fn = async (url) => {
    const u = new URL(url);
    const p = Object.fromEntries(u.searchParams);
    calls.push(p);
    if (calls.length > failAfter) return { ok: false, status: 503, headers: { get: () => '0' }, json: async () => ({}) };
    if (p.titles) {
      const pages = p.titles.split('|').map((t) => (existing && !existing.has(t)
        ? { title: t, missing: true }
        : { title: t, imageinfo: [{ url: existing.get(t) }] }));
      return { ok: true, status: 200, headers: { get: () => null }, json: async () => ({ query: { pages } }) };
    }
    const q = p.gsrsearch.replace(/ (filetype:bitmap|incategory:Quality_images)$/, '');
    const tier = p.gsrsearch.includes('Quality_images') ? 'QI' : 'any';
    const off = Number(p.gsroffset);
    const pages = Array.from({ length: perQuery }, (_, i) => page(`${tier} ${q} ${off + i}.jpg`, { index: i + 1 }));
    return { ok: true, status: 200, headers: { get: () => null }, json: async () => ({ query: { pages } }) };
  };
  fn.calls = calls;
  return fn;
}

const quietClient = (f) => makeClient({ fetchImpl: f, gapMs: 0, log: () => {} });
const art = (slug, extra = {}) => ({
  slug, title: 'Ransomware gang hits hospital', tags: ['Ransomware'], category: 'cyber',
  publishedAt: '2026-10-29T08:00:00Z', ...extra,
});

console.log('pick-photos');

await test('accepts a good landscape CC BY-SA jpeg and builds the record', () => {
  const r = toPhoto(page('Server room 1.jpg'), { query: 'server room', tier: 'qi', today: TODAY });
  assert.ok(r.photo, r.reject);
  assert.equal(r.photo.author, 'Jane Doe');
  assert.equal(r.photo.license, 'CC BY-SA 4.0');
  assert.equal(r.photo.page, undefined, 'standard file page is derived, not stored');
  assert.equal(r.photo.at, TODAY);
});

await test('rejects graphics, people, restricted, non-free and odd files', () => {
  const opts = { query: 'q', tier: 'qi', today: TODAY };
  const cases = [
    [page('Logo of acme.jpg'), 'subject words'],
    [page('Portrait of a CEO.jpg'), 'subject words'],
    [page('Rack.jpg', { desc: 'Two men standing next to a rack' }), 'subject words'],
    [page('Rack.jpg', { mime: 'image/png' }), 'not a jpeg'],
    [page('Rack.jpg', { w: 1200, h: 675 }), 'too small'],
    [page('Rack.jpg', { w: 2000, h: 3000 }), 'not landscape'],
    [page('Rack.jpg', { restrictions: 'personality' }), 'restricted (personality)'],
    [page('Rack.jpg', { license: 'CC BY-NC 2.0' }), 'license "CC BY-NC 2.0"'],
    [page('Rack.jpg', { license: 'GFDL' }), 'license "GFDL"'],
    [page('Rack.jpg', { artist: '' }), 'no author for attribution'],
  ];
  for (const [pg, reason] of cases) assert.equal(toPhoto(pg, opts).reject, reason, pg.title);
  const odd = page('Rack.jpg');
  odd.imageinfo[0].thumburl = odd.imageinfo[0].thumburl.replace('1280px-', 'lossy-page1-1280px-');
  assert.equal(toPhoto(odd, opts).reject, 'odd thumbnail url');
  // Unrated photos need 2000px; public domain needs no author.
  assert.equal(toPhoto(page('Rack.jpg', { w: 1800, h: 1000 }), { ...opts, tier: 'any' }).reject, 'too small');
  assert.ok(toPhoto(page('Rack.jpg', { artist: '', license: 'Public domain' }), opts).photo);
});

await test('queries go from specific to broad and are stable per slug', () => {
  const a = { slug: 'nvidia-earnings', title: 'Nvidia beats estimates', tags: ['Nvidia', 'Earnings'], category: 'tech' };
  const q = photoQueriesFor(a);
  assert.ok(q.indexOf('nvidia graphics card') < q.indexOf('nasdaq marketsite'), q.join(' / '));
  assert.deepEqual(photoQueriesFor(a), q);
  const own = photoQueriesFor({ ...a, photoQuery: ['GPU die shot'] });
  assert.equal(own[0], 'gpu die shot');
  assert.ok(photoQueriesFor({ slug: 'x', title: 'CVE-2026-1 patch now', tags: ['CVE'], category: 'cyber' }).length >= 4);
});

await test('never gives two articles the same photo, and skips used ones', async () => {
  const f = fakeFetch({ perQuery: 2 });
  const articles = Array.from({ length: 12 }, (_, i) => art(`story-${i}`, { publishedAt: `2026-10-${10 + i}T00:00:00Z` }));
  const photos = { 'old-story': toPhoto(page('QI padlock 0.jpg'), { query: 'padlock', tier: 'qi', today: TODAY }).photo };
  articles.push(art('old-story'));
  const res = await pickPhotos({ articles, photos, client: quietClient(f), today: TODAY, log: () => {} });
  assert.equal(res.picked.length, 12);
  const keys = Object.values(photos).map(photoKey);
  assert.equal(new Set(keys).size, keys.length, 'all photos unique');
  assert.equal(photos['story-11'].q, photoQueriesFor(articles[11])[0], 'newest article gets the best match');
  assert.ok(f.calls.every((c) => c.maxlag === '5' && c.gsrlimit === '50'));
});

await test('respects explicit images, recent misses and the run cap', async () => {
  const f = fakeFetch({ perQuery: 0 });
  const photos = { recent: { none: '2026-10-25' }, stale: { none: '2026-10-01' } };
  const articles = [art('has-image', { image: 'https://example.com/a.jpg' }), art('recent'), art('stale'), art('fresh')];
  assert.equal(needsPhoto(articles[0], undefined, TODAY), false);
  const res = await pickPhotos({ articles, photos, client: quietClient(f), today: TODAY, log: () => {}, max: 1 });
  assert.equal(res.considered, 1);
  assert.equal(photos.recent.none, '2026-10-25');
  assert.ok(photos.stale.none === TODAY || photos.fresh?.none === TODAY);
});

await test('keeps earlier picks when the API starts failing mid-run', async () => {
  const f = fakeFetch({ perQuery: 3, failAfter: 1 });
  const articles = [art('a', { publishedAt: '2026-10-29T00:00:00Z' }), art('b', { publishedAt: '2026-10-28T00:00:00Z' }),
    art('c', { publishedAt: '2026-10-27T00:00:00Z' }), art('d', { publishedAt: '2026-10-26T00:00:00Z' })];
  const photos = {};
  const client = makeClient({ fetchImpl: f, gapMs: 0, log: () => {}, backoffMs: 0 });
  // Make retries instant for the test.
  const realSetTimeout = globalThis.setTimeout;
  globalThis.setTimeout = (fn) => realSetTimeout(fn, 0);
  try {
    const res = await pickPhotos({ articles, photos, client, today: TODAY, log: () => {} });
    assert.ok(res.error, 'reports the failure');
    assert.ok(res.picked.length >= 1, 'saved what it had');
    assert.ok(!Object.values(photos).some((p) => p.none), 'failure is not recorded as "no match"');
  } finally {
    globalThis.setTimeout = realSetTimeout;
  }
});

await test('waits and retries when Commons search says it is too busy', async () => {
  let n = 0;
  const busyOnce = async (url) => {
    n++;
    if (n === 1) return { ok: true, status: 200, headers: { get: () => null }, json: async () => ({ error: { code: 'cirrussearch-too-busy-error', info: 'busy' } }) };
    return fakeFetch({ perQuery: 1 })(url);
  };
  const photos = {};
  const res = await pickPhotos({ articles: [art('busy')], photos, client: makeClient({ fetchImpl: busyOnce, gapMs: 0, log: () => {}, backoffMs: 0 }), today: TODAY, log: () => {} });
  assert.equal(res.error, null);
  assert.equal(res.picked.length, 1);
  assert.ok(n >= 2);
});

await test('fails instead of marking misses when nothing fits anywhere', async () => {
  const photos = {};
  const articles = Array.from({ length: 25 }, (_, i) => art(`none-${i}`));
  const res = await pickPhotos({ articles, photos, client: quietClient(fakeFetch({ perQuery: 0 })), today: TODAY, log: () => {} });
  assert.ok(res.error);
  assert.deepEqual(photos, {});
});

await test('verify drops photos whose file is gone or changed', async () => {
  const keep = toPhoto(page('Keep me.jpg'), { query: 'q', tier: 'qi', today: TODAY }).photo;
  const gone = toPhoto(page('Gone now.jpg'), { query: 'q', tier: 'qi', today: TODAY }).photo;
  const moved = toPhoto(page('Moved file.jpg'), { query: 'q', tier: 'qi', today: TODAY }).photo;
  const photos = { keep, gone, moved, miss: { none: TODAY } };
  const existing = new Map([
    ['File:Keep_me.jpg', `${UP}${keep.path}`],
    ['File:Moved_file.jpg', `${UP}0/00/Other.jpg`],
  ]);
  const res = await verifyPhotos({ photos, client: quietClient(fakeFetch({ existing })), log: () => {} });
  assert.equal(res.dropped, 2);
  assert.deepEqual(Object.keys(photos).sort(), ['keep', 'miss']);
});

await test('serialized file round-trips and is sorted', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'photos-'));
  const p = toPhoto(page('Round "trip" é.jpg'), { query: 'q', tier: 'qi', today: TODAY }).photo;
  const file = join(dir, 'p.js');
  await writeFile(file, serializePhotos({ zeta: p, alpha: { none: TODAY } }));
  const back = await loadPhotos(file);
  assert.deepEqual(back, { alpha: { none: TODAY }, zeta: p });
  assert.deepEqual(await loadPhotos(join(dir, 'missing.js')), {});
});

console.log('articlePhoto');

await test('builds only standard widths below the original', () => {
  const p = toPhoto(page('Wide shot.jpg', { w: 1700, h: 1000 }), { query: 'q', tier: 'qi', today: TODAY }).photo;
  const set = photoSrcSet(p);
  assert.match(set, /500px-Wide_shot\.jpg 500w, .*960w, .*1280w$/);
  assert.doesNotMatch(set, /1920/);
  assert.match(photoUrl(p, 1280), /\/thumb\/.+\/1280px-Wide_shot\.jpg$/);
  assert.match(photoUrl(p, 5000), /1280px-/);
  for (const m of set.matchAll(/(\d+)px-/g)) assert.ok(PHOTO_WIDTHS.includes(Number(m[1])));
  assert.equal(photoPage(p), 'https://commons.wikimedia.org/wiki/File:Wide_shot.jpg');
});

console.log(`\n${passed} passed${process.exitCode ? ', some FAILED' : ''}`);
