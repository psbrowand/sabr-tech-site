// ─────────────────────────────────────────────────────────────────────────────
// src/lib/analytics.js
//
// Thin wrapper around Vercel Analytics' `track()`. Centralizes event names
// so we don't scatter string literals across the codebase and don't crash
// if analytics fails to load (ad blockers, local dev).
//
// Conversion funnel this unlocks on the apex site:
//   1. page view (/)            — Vercel Analytics autotracks
//   2. nav_cta_click            — Header "Sign up" clicked
//   3. hero_cta_click           — Hero "Start for free" clicked
//   4. cert_card_click          — A launch-cert card clicked
//   5. pricing_cta_click        — Tier "Start X" button clicked
//   6. bottom_cta_click         — Bottom-of-page "Create free account"
//
// The actual signup-complete event lives on the learning-app side
// (app.sabr-labs.com) and is tracked in that project's analytics — true
// cross-domain funnel stitching is an SAB-* follow-up.
// ─────────────────────────────────────────────────────────────────────────────

import { track as vercelTrack } from '@vercel/analytics';

export const EVENTS = {
  NAV_CTA_CLICK:     'nav_cta_click',
  HERO_CTA_CLICK:    'hero_cta_click',
  CERT_CARD_CLICK:   'cert_card_click',
  PRICING_CTA_CLICK: 'pricing_cta_click',
  BOTTOM_CTA_CLICK:  'bottom_cta_click',
  NEWSLETTER_SUBMIT: 'newsletter_submit',
};

// Vercel Analytics allows properties of type string | number | boolean | null.
// We coerce/drop anything outside that set to keep track() happy.
function sanitizeProps(props) {
  if (!props || typeof props !== 'object') return undefined;
  const out = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === null) out[k] = null;
    else if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') out[k] = v;
    else out[k] = String(v);
  }
  return out;
}

export function track(event, props) {
  try {
    vercelTrack(event, sanitizeProps(props));
  } catch {
    // Fail open — analytics must never break UX.
  }
}
