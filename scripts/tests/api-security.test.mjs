// Offline security tests for the api/ functions (no network; fetch is faked).
// Run: node scripts/tests/api-security.test.mjs
import assert from 'node:assert/strict';

let passed = 0;
async function test(name, fn) {
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { console.error(`  ✗ ${name}\n${err.stack}`); process.exitCode = 1; }
}

function mockRes() {
  const res = { statusCode: 200, headers: {}, body: undefined };
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (b) => { res.body = b; return res; };
  res.send = (b) => { res.body = b; return res; };
  res.setHeader = (k, v) => { res.headers[k.toLowerCase()] = v; };
  return res;
}

let ipSeq = 0;
function mockReq({ method = 'POST', body = {}, headers = {}, url = '/', ip } = {}) {
  return {
    method, body, url,
    headers: { 'x-forwarded-for': ip || `10.0.0.${++ipSeq}`, ...headers },
  };
}

const realFetch = globalThis.fetch;
let fetchCalls = [];
function fakeFetch(response = { ok: true, status: 200, json: async () => ({}) }) {
  fetchCalls = [];
  globalThis.fetch = async (url, init) => {
    fetchCalls.push({ url: String(url), init, body: init?.body ? JSON.parse(init.body) : undefined });
    return { text: async () => '', ...response };
  };
}

process.env.RESEND_API_KEY = 'test-resend';
process.env.BEEHIIV_API_KEY = 'test-beehiiv';
process.env.BEEHIIV_PUBLICATION_ID = 'pub_test';

const { default: contact } = await import('../../api/contact.mjs');
const { default: subscribe } = await import('../../api/newsletter-subscribe.mjs');
const cron = await import('../../api/cron/daily-briefing.mjs');
const { createRateLimiter, clientIp } = await import('../../api/_lib/abuse.mjs');
const { jsonLdScript } = await import('../lib/json-ld.mjs');
const LS = String.fromCharCode(0x2028);
const { safeHref } = await import('../../src/lib/safeHref.js');

console.log('cron /api/cron/daily-briefing');

await test('rejects every request when CRON_SECRET is unset (fails closed)', async () => {
  delete process.env.CRON_SECRET;
  fakeFetch();
  const res = mockRes();
  await cron.default(mockReq({ method: 'GET', url: '/api/cron/daily-briefing?dryRun=1' }), res);
  assert.equal(res.statusCode, 401);
  assert.equal(fetchCalls.length, 0);
});

await test('rejects a wrong or missing bearer token', async () => {
  process.env.CRON_SECRET = 's3cret-value-for-tests';
  for (const authorization of [undefined, 'Bearer nope', 's3cret-value-for-tests', 'Bearer s3cret-value-for-tests ']) {
    const res = mockRes();
    await cron.default(mockReq({ method: 'GET', headers: authorization ? { authorization } : {} }), res);
    assert.equal(res.statusCode, 401, `authorization=${authorization}`);
  }
});

await test('accepts the correct token (dry run sends nothing)', async () => {
  process.env.CRON_SECRET = 's3cret-value-for-tests';
  fakeFetch();
  const res = mockRes();
  await cron.default(mockReq({
    method: 'GET', url: '/api/cron/daily-briefing?dryRun=1',
    headers: { authorization: 'Bearer s3cret-value-for-tests' },
  }), res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.dryRun, true);
  assert.equal(fetchCalls.length, 0);
});

await test('only GET is allowed', async () => {
  const res = mockRes();
  await cron.default(mockReq({ method: 'POST', headers: { authorization: 'Bearer s3cret-value-for-tests' } }), res);
  assert.equal(res.statusCode, 405);
});

await test('upstream errors are not echoed to the caller', async () => {
  process.env.CRON_SECRET = 's3cret-value-for-tests';
  fakeFetch({ ok: false, status: 500, text: async () => 'internal detail /var/task/secret-path' });
  const res = mockRes();
  const origErr = console.error; console.error = () => {};
  try {
    await cron.default(mockReq({ method: 'GET', headers: { authorization: 'Bearer s3cret-value-for-tests' } }), res);
  } finally { console.error = origErr; }
  assert.equal(res.statusCode, 500);
  assert.doesNotMatch(JSON.stringify(res.body), /internal detail|secret-path|Beehiiv/);
});

await test('email HTML escapes article fields', () => {
  const evil = '<img src=x onerror=alert(1)>"\'&';
  const html = cron.buildHtml({
    topNews: [{ slug: 'a', title: evil, summary: evil, category: evil }],
    certPick: { slug: 'b', title: evil, summary: evil },
    dateLabel: evil,
  });
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;&quot;&#39;&amp;/);
});

console.log('newsletter /api/newsletter-subscribe');

await test('never reactivates unsubscribed addresses', async () => {
  fakeFetch();
  const res = mockRes();
  await subscribe(mockReq({ body: { email: 'reader@example.com' } }), res);
  assert.equal(res.statusCode, 200);
  assert.equal(fetchCalls.length, 1);
  assert.equal(fetchCalls[0].body.reactivate_existing, false);
});

await test('does not reveal whether an address is already subscribed', async () => {
  fakeFetch({ ok: false, status: 400, json: async () => ({ message: 'Email already exists' }) });
  const res = mockRes();
  await subscribe(mockReq({ body: { email: 'reader@example.com' } }), res);
  assert.deepEqual(res.body, { ok: true });
});

await test('honeypot submissions are dropped silently', async () => {
  fakeFetch();
  const res = mockRes();
  const origWarn = console.warn; console.warn = () => {};
  try { await subscribe(mockReq({ body: { email: 'bot@example.com', company: 'Acme' } }), res); }
  finally { console.warn = origWarn; }
  assert.equal(res.statusCode, 200);
  assert.equal(fetchCalls.length, 0);
});

await test('rate-limits a single IP after 5 attempts in 10 minutes', async () => {
  fakeFetch();
  const statuses = [];
  const origWarn = console.warn; console.warn = () => {};
  try {
    for (let i = 0; i < 7; i++) {
      const res = mockRes();
      await subscribe(mockReq({ body: { email: `r${i}@example.com` }, ip: '203.0.113.7' }), res);
      statuses.push(res.statusCode);
    }
  } finally { console.warn = origWarn; }
  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429, 429]);
  assert.equal(fetchCalls.length, 5);
});

console.log('contact /api/contact');

await test('honeypot submissions are dropped silently', async () => {
  fakeFetch();
  const res = mockRes();
  const origWarn = console.warn; console.warn = () => {};
  try {
    await contact(mockReq({ body: { name: 'x', email: 'x@example.com', message: 'hi', company: 'Acme' } }), res);
  } finally { console.warn = origWarn; }
  assert.equal(res.statusCode, 200);
  assert.equal(fetchCalls.length, 0);
});

await test('rate-limits a single IP after 5 messages in 10 minutes', async () => {
  fakeFetch();
  const statuses = [];
  const origWarn = console.warn; console.warn = () => {};
  try {
    for (let i = 0; i < 6; i++) {
      const res = mockRes();
      await contact(mockReq({ body: { name: 'x', email: 'x@example.com', message: 'hi' }, ip: '198.51.100.9' }), res);
      statuses.push(res.statusCode);
    }
  } finally { console.warn = origWarn; }
  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429]);
});

await test('recipient is fixed and visitor HTML is escaped', async () => {
  fakeFetch();
  const res = mockRes();
  await contact(mockReq({ body: { name: '<b>n</b>', email: 'x@example.com', message: '<script>alert(1)</script>' } }), res);
  assert.equal(res.statusCode, 200);
  const sent = fetchCalls[0].body;
  assert.deepEqual(sent.to, ['contact@sabr-labs.com']);
  assert.doesNotMatch(sent.html, /<script>|<b>n<\/b>/);
});

console.log('abuse helpers');

await test('limiter window slides', () => {
  const allow = createRateLimiter({ limit: 2, windowMs: 1000 });
  assert.equal(allow('k', 0), true);
  assert.equal(allow('k', 10), true);
  assert.equal(allow('k', 20), false);
  assert.equal(allow('k', 1001), true);
});

await test('client IP is the first x-forwarded-for hop', () => {
  assert.equal(clientIp({ headers: { 'x-forwarded-for': '1.2.3.4, 10.0.0.1' } }), '1.2.3.4');
});

console.log('content escaping');

await test('JSON-LD cannot break out of its <script> tag', () => {
  const tag = jsonLdScript({ headline: '</script><script>alert(1)</script>', x: LS + '&' });
  assert.equal(tag.match(/<\/script>/gi).length, 1);
  assert.doesNotMatch(tag, /<script>alert/);
  assert.deepEqual(JSON.parse(tag.replace(/^\s*<script[^>]*>|<\/script>\s*$/g, '')), {
    headline: '</script><script>alert(1)</script>', x: LS + '&',
  });
});

await test('source links only allow https', () => {
  assert.equal(safeHref('https://example.com/a'), 'https://example.com/a');
  for (const bad of ['javascript:alert(1)', ' JavaScript:alert(1)', 'data:text/html,x', 'http://example.com', '//evil.example', '']) {
    assert.equal(safeHref(bad), undefined, bad);
  }
});

globalThis.fetch = realFetch;
console.log(`\n${passed} passed`);
