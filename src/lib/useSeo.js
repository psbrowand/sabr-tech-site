import { useEffect } from 'react';

/**
 * Lightweight per-page SEO for the Vite SPA. Sets document.title, the meta
 * description, canonical link, and og:title/og:description on mount, and
 * restores nothing on unmount (the next page sets its own). Google renders
 * our JS, so updating these client-side is sufficient for indexing the
 * marketing/comparison pages distinctly.
 *
 *   useSeo({
 *     title: 'Browser Alternative to Boson NetSim — Sabr Learning Labs',
 *     description: '…',
 *     canonical: 'https://sabr-labs.com/compare/boson-netsim-alternative',
 *   });
 */
const SITE = 'https://sabr-labs.com';

function setMeta(selector, attr, value) {
  if (!value) return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, name] = selector.match(/\[(?:name|property)="(.+)"\]/) || [];
    if (selector.includes('property=')) el.setAttribute('property', name);
    else el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function useSeo({ title, description, canonical }) {
  useEffect(() => {
    if (title) document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);

    const href = canonical || (typeof window !== 'undefined' ? SITE + window.location.pathname : SITE);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }, [title, description, canonical]);
}
