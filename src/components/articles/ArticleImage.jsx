// ─────────────────────────────────────────────────────────────────────────────
// ArticleImage.jsx — The image shown for an article on cards and pages
//
// In order: the article's own `image`; its Wikimedia Commons photo
// (lib/articlePhoto.js); otherwise its generated cover (lib/articleCover.js),
// which is unique per article. If a hotlinked photo ever fails to load, the
// generated cover takes its place.
// ─────────────────────────────────────────────────────────────────────────────
import { useMemo, useState } from 'react';
import { articleCoverDataUri } from '../../lib/articleCover';
import { photoFor, photoUrl, photoSrcSet } from '../../lib/articlePhoto';

export default function ArticleImage({
  article, label = false, alt, className = '', loading = 'lazy', sizes = '(min-width: 1024px) 33vw, 100vw',
}) {
  const [failed, setFailed] = useState(false);
  const photo = failed ? null : photoFor(article);
  const cover = useMemo(() => articleCoverDataUri(article, { label }), [article, label]);

  if (article.image && !failed) {
    return (
      <img src={article.image} alt={alt ?? article.title} className={className} loading={loading}
        decoding="async" onError={() => setFailed(true)} />
    );
  }
  if (photo) {
    return (
      <img
        src={photoUrl(photo, 960)}
        srcSet={photoSrcSet(photo)}
        sizes={sizes}
        alt={alt ?? photo.alt ?? article.title}
        className={className}
        loading={loading}
        decoding="async"
        referrerPolicy="strict-origin-when-cross-origin"
        onError={() => setFailed(true)}
      />
    );
  }
  return <img src={cover} alt={alt ?? article.title} className={className} loading={loading} decoding="async" />;
}
