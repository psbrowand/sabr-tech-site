// ─────────────────────────────────────────────────────────────────────────────
// ArticleImage.jsx — The image shown for an article on cards and pages
//
// Uses the article's own `image` when it has one; otherwise renders its
// generated cover (lib/articleCover.js), which is unique per article.
// ─────────────────────────────────────────────────────────────────────────────
import { useMemo } from 'react';
import { articleCoverDataUri } from '../../lib/articleCover';

export default function ArticleImage({ article, label = false, alt, className = '', loading = 'lazy' }) {
  const src = useMemo(
    () => article.image || articleCoverDataUri(article, { label }),
    [article, label],
  );
  return <img src={src} alt={alt ?? article.title} className={className} loading={loading} decoding="async" />;
}
