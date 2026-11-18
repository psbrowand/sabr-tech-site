// Shared abuse controls for the public form endpoints. The `_lib` folder name
// keeps Vercel from deploying this file as its own function.
//
// The limiter is in-memory, so it only holds within one warm instance. It
// slows a single-source burst; the durable control is a Vercel Firewall
// rate-limit rule (MANUAL_ACTIONS.md).

export const HONEYPOT_FIELD = 'company';

export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd || '').split(',')[0].trim();
  return first || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

export function honeypotTripped(body) {
  const v = body?.[HONEYPOT_FIELD];
  return typeof v === 'string' ? v.trim() !== '' : v != null;
}

export function createRateLimiter({ limit, windowMs, maxKeys = 5000 }) {
  const hits = new Map();
  return function allow(key, now = Date.now()) {
    const cutoff = now - windowMs;
    const recent = (hits.get(key) || []).filter((t) => t > cutoff);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.delete(key);
    hits.set(key, recent);
    if (hits.size > maxKeys) hits.delete(hits.keys().next().value);
    return true;
  };
}

export function logAbuse(route, reason, req) {
  console.warn(`[abuse] ${route} ${reason} ip=${clientIp(req)} ua=${String(req.headers['user-agent'] || '').slice(0, 120)}`);
}
