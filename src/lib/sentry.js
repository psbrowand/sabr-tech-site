// ─────────────────────────────────────────────────────────────────────────────
// src/lib/sentry.js
//
// Browser error tracking for sabr-labs.com. Errors only: no tracing, no
// session replay, no profiling, so the bundle stays small and no visitor
// sessions are recorded.
//
// The DSN is public by design (every browser sees it). It defaults to the
// "sabr-labs.com marketing site" client key on the sabr-learning-labs Sentry
// project; a VITE_SENTRY_DSN build env var in Vercel overrides it. Only
// production builds report, and only errors from sabr-labs.com or *.vercel.app.
//
// Release and environment use the system env vars Vercel exposes to Vite
// builds (VITE_VERCEL_GIT_COMMIT_SHA, VITE_VERCEL_ENV) when available.
// ─────────────────────────────────────────────────────────────────────────────

import * as Sentry from '@sentry/react';

const DEFAULT_DSN =
  'https://ea05a0ae5b6c88515991838ae38872e6@o4511236936630272.ingest.us.sentry.io/4511236963762176';
const DSN = import.meta.env.VITE_SENTRY_DSN || DEFAULT_DSN;

// Vercel's env if the build exposes it, else judge by hostname: anything
// other than sabr-labs.com (e.g. a *.vercel.app preview) is not production.
function environment() {
  if (import.meta.env.VITE_VERCEL_ENV) return import.meta.env.VITE_VERCEL_ENV;
  return /(^|\.)sabr-labs\.com$/.test(window.location.hostname) ? 'production' : 'preview';
}

export function initSentry() {
  if (!DSN || !import.meta.env.PROD) return;

  const env = environment();

  try {
    Sentry.init({
      dsn: DSN,
      environment: env,
      release: import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA || undefined,
      // Default integrations only (global error handlers, breadcrumbs, dedupe,
      // inbound filters). No tracesSampleRate, so tracing stays fully off.
      sendDefaultPii: false,
      // Only report errors thrown by our own code. Browser extensions, the
      // Google Fonts/ads scripts and other third parties are dropped.
      allowUrls: [/^https?:\/\/(www\.)?sabr-labs\.com\//, /^https?:\/\/[^/]+\.vercel\.app\//],
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'Non-Error promise rejection captured',
      ],
      initialScope: { tags: { site: 'sabr-labs.com' } },
    });
  } catch {
    // Fail open: monitoring must never break the page.
    return;
  }

  // Preview-only test hook: /?sentry-test=1 throws an uncaught error so a
  // preview deploy can prove events reach Sentry. Inert in production.
  if (env !== 'production' && new URLSearchParams(window.location.search).has('sentry-test')) {
    setTimeout(() => {
      throw new Error('Sentry test error from sabr-labs.com preview');
    }, 0);
  }
}
