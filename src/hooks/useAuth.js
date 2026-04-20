// ─────────────────────────────────────────────────────────────────────────────
// useAuth — cross-subdomain session hook for the tech site.
//
// Reads the shared NextAuth session cookie on `.sabr-labs.com` by fetching
// `${APP_ORIGIN}/api/auth/session` with credentials. The learning app wraps
// that route with a CORS layer that allows https://sabr-labs.com (+ the
// other umbrella hosts) — see src/lib/umbrella-origins.ts in that repo.
//
// Returns:
//   user:    null while loading, { name, email, ... } when signed in,
//            or null when anonymous
//   loading: true until the first session fetch resolves
//   signOut: POSTs to /api/user/signout cross-origin and reloads the page
//   appOrigin: the resolved APP_ORIGIN for building Sign-in/Sign-up links
// ─────────────────────────────────────────────────────────────────────────────
import { useCallback, useEffect, useState } from 'react';

export const APP_ORIGIN =
  import.meta.env.VITE_APP_ORIGIN || 'https://app.sabr-labs.com';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch(`${APP_ORIGIN}/api/auth/session`, {
        credentials: 'include',
        cache: 'no-store',
      });
      if (!res.ok) {
        setUser(null);
      } else {
        const data = await res.json().catch(() => ({}));
        setUser(data?.user ?? null);
      }
    } catch {
      // Network error, blocked CORS, etc. — treat as anonymous.
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const signOut = useCallback(async () => {
    try {
      const callback = `${window.location.origin}/`;
      await fetch(
        `${APP_ORIGIN}/api/user/signout?callbackUrl=${encodeURIComponent(callback)}`,
        { method: 'POST', credentials: 'include' }
      );
    } catch {
      // Best effort — even if the POST fails, the reload below clears
      // in-memory state and the user will retry from the login page.
    }
    // Hard reload to pick up the now-cleared cookie on every subsequent
    // request. The tech site is a pure SPA so a reload also re-runs the
    // /api/auth/session fetch in useAuth.
    window.location.assign('/');
  }, []);

  return { user, loading, signOut, refetch, appOrigin: APP_ORIGIN };
}

/**
 * Build a URL on the learning app that, after auth, bounces the user back
 * to the current location on the tech site. Used by the Sign in / Sign up
 * buttons in the header.
 */
export function buildAuthReturnUrl(path /* '/login' | '/register' */) {
  const returnTo =
    typeof window === 'undefined'
      ? '/'
      : `${window.location.origin}${window.location.pathname}${window.location.search}`;
  return `${APP_ORIGIN}${path}?callbackUrl=${encodeURIComponent(returnTo)}`;
}
