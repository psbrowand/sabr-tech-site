// ─────────────────────────────────────────────────────────────────────────────
// PhotoCredit.jsx — Credit line for an article's Wikimedia Commons photo.
//
// Commons licenses (CC BY, CC BY-SA) require the author, the license and a
// link to the source wherever the photo is shown large. Renders nothing for
// generated covers.
// ─────────────────────────────────────────────────────────────────────────────
import { photoFor, photoPage } from '../../lib/articlePhoto';

const linkClass = 'underline decoration-slate-700 underline-offset-2 hover:text-cyan-400 transition-colors';

export default function PhotoCredit({ article, className = '' }) {
  const p = photoFor(article);
  if (!p) return null;
  const pd = /^(cc0|public domain|pd\b|pdm)/i.test(p.license);
  return (
    <p className={`text-[11px] text-slate-600 leading-snug ${className}`}>
      Photo:{' '}
      <a href={photoPage(p)} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {p.author}
      </a>
      {' / Wikimedia Commons, '}
      {p.licenseUrl ? (
        <a href={p.licenseUrl} target="_blank" rel="noopener noreferrer license" className={linkClass}>
          {pd ? 'public domain' : p.license}
        </a>
      ) : (
        pd ? 'public domain' : p.license
      )}
    </p>
  );
}
