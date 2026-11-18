// React 18 still renders javascript: URLs in href, and article data is
// LLM-written, so outbound links are limited to https.
export function safeHref(url) {
  return typeof url === 'string' && /^https:\/\/[^\s/]/i.test(url.trim()) ? url.trim() : undefined;
}
