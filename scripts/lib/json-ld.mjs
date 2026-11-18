// JSON.stringify leaves "<" alone, so a value containing "</script>" would end
// the tag early and let the rest run as HTML. Article text is LLM-written from
// web pages, so escape everything that can matter inside a <script> block
// (including the U+2028/U+2029 line separators).
const UNSAFE_RE = new RegExp(`[<>&${String.fromCharCode(0x2028, 0x2029)}]`, 'g');
const toUnicodeEscape = (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`;

export function jsonLdScript(obj) {
  const json = JSON.stringify(obj).replace(UNSAFE_RE, toUnicodeEscape);
  return `    <script type="application/ld+json">\n    ${json}\n    </script>\n`;
}
