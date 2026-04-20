// ─────────────────────────────────────────────────────────────────────────────
// ArticlePage.jsx — Individual article detail page
// ─────────────────────────────────────────────────────────────────────────────
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Clock, User, Calendar, Tag, Share2, Twitter, Linkedin, Link2,
  AlertTriangle, TrendingUp, ChevronLeft, BookOpen, ExternalLink,
} from 'lucide-react';

import { articles, getRelated } from '../data/articles';
import { formatDate }           from '../components/ui/TimeAgo';
import CategoryBadge            from '../components/ui/CategoryBadge';
import RelatedArticles          from '../components/articles/RelatedArticles';
import CommentSection           from '../components/comments/CommentSection';
import NewsletterSignup         from '../components/newsletter/NewsletterSignup';
import ArticleCard              from '../components/articles/ArticleCard';

// ── Share buttons ─────────────────────────────────────────────────────────────
function ShareButtons({ title, url }) {
  const encoded = encodeURIComponent(url);
  const text    = encodeURIComponent(title);

  const copyLink = () => {
    navigator.clipboard.writeText(url).catch(() => {});
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 mr-1 flex items-center gap-1">
        <Share2 className="w-3.5 h-3.5" /> Share
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-500 hover:text-sky-400 hover:border-sky-400/30 transition-all duration-200"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-3.5 h-3.5" />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encoded}&title=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-500 hover:text-blue-400 hover:border-blue-400/30 transition-all duration-200"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-3.5 h-3.5" />
      </a>
      <button
        onClick={copyLink}
        className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-200"
        aria-label="Copy link"
      >
        <Link2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Pull quote ────────────────────────────────────────────────────────────────
function PullQuote({ text }) {
  return (
    <blockquote className="my-8 relative pl-6 border-l-4 border-cyan-500 bg-cyan-500/5 rounded-r-xl pr-6 py-5">
      <div className="absolute top-3 left-2 text-4xl text-cyan-500/30 font-black leading-none select-none">"</div>
      <p className="text-slate-200 text-base sm:text-lg font-medium leading-relaxed italic">
        {text}
      </p>
    </blockquote>
  );
}

// ── Main ArticlePage ──────────────────────────────────────────────────────────
export default function ArticlePage() {
  const { slug } = useParams();
  const navigate  = useNavigate();

  const article = articles.find(a => a.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="container-site py-24 text-center">
        <h1 className="text-3xl font-bold text-slate-300 mb-4">Article Not Found</h1>
        <p className="text-slate-500 mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const related = getRelated(article, 3);
  const url     = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <article className="container-site py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-400 mb-8 transition-colors duration-200 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
        {/* Main article column */}
        <div>
          {/* Category + flags */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <CategoryBadge category={article.category} size="sm" />
            {article.breaking && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5" /> Breaking
              </span>
            )}
            {article.trending && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wide">
                <TrendingUp className="w-3.5 h-3.5" /> Trending
              </span>
            )}
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
            {article.title}
          </h1>

          {/* Summary / subheadline */}
          <p className="text-lg text-slate-400 leading-relaxed mb-6 border-l-2 border-cyan-500/40 pl-4">
            {article.summary}
          </p>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-4 pb-6 mb-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-medium text-slate-300">{article.author}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(article.publishedAt)}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTime} min read
            </div>
            <div className="ml-auto">
              <ShareButtons title={article.title} url={url} />
            </div>
          </div>

          {/* Featured image */}
          <div className="rounded-xl overflow-hidden aspect-video mb-8 bg-slate-800">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article body */}
          <div className="article-prose">
            {article.body.map((para, i) => (
              <div key={i}>
                <p>{para}</p>
                {/* Insert pull quote after 2nd paragraph */}
                {i === 1 && article.body.length > 3 && (
                  <PullQuote text={para.split('.')[0] + '.'} />
                )}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/[0.06]">
            <Tag className="w-3.5 h-3.5 text-slate-600 mt-1 flex-shrink-0" />
            {article.tags.map(tag => (
              <Link
                key={tag}
                to={`/search?q=${encodeURIComponent(tag)}`}
                className="text-xs text-slate-500 bg-white/5 border border-white/[0.06] px-3 py-1.5 rounded-full hover:text-cyan-400 hover:border-cyan-400/20 transition-all duration-200"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Sources / References */}
          {article.sources?.length > 0 && (
            <div className="mt-10 pt-8 border-t border-white/[0.06]">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Sources &amp; References
              </h2>
              <ol className="space-y-3">
                {article.sources.map((src, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-xs text-slate-700 font-mono mt-0.5 w-5 flex-shrink-0">[{i + 1}]</span>
                    <div className="min-w-0">
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200 break-all"
                      >
                        {src.name}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                      {src.desc && (
                        <span className="text-slate-500 ml-1">— {src.desc}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-[11px] text-slate-700 leading-relaxed border-t border-white/[0.04] pt-4">
                All articles on Sabr Cyber &amp; Tech News are original editorial writing. Sources are cited for reader transparency and verification — not as affiliate or partner links.
              </p>
            </div>
          )}

          {/* Bottom share */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
            <div className="text-sm text-slate-500">Found this useful? Share it.</div>
            <ShareButtons title={article.title} url={url} />
          </div>

          {/* Newsletter inline CTA */}
          <div className="mt-10">
            <NewsletterSignup inline />
          </div>

          {/* Comments */}
          <CommentSection articleSlug={article.slug} />

          {/* Related articles */}
          <RelatedArticles articles={related} />
        </div>

        {/* Right column — sticky article info */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            {/* Article info card */}
            <div className="card p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Article Info</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-slate-600 text-xs mb-0.5">Author</dt>
                  <dd className="text-slate-300 font-medium">{article.author}</dd>
                </div>
                <div>
                  <dt className="text-slate-600 text-xs mb-0.5">Published</dt>
                  <dd className="text-slate-300">{formatDate(article.publishedAt)}</dd>
                </div>
                <div>
                  <dt className="text-slate-600 text-xs mb-0.5">Reading time</dt>
                  <dd className="text-slate-300">{article.readingTime} minutes</dd>
                </div>
                <div>
                  <dt className="text-slate-600 text-xs mb-0.5">Category</dt>
                  <dd className="mt-1"><CategoryBadge category={article.category} size="xs" /></dd>
                </div>
              </dl>
            </div>

            {/* Related compact */}
            {related.length > 0 && (
              <div className="card p-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Related</h3>
                <div className="space-y-0">
                  {related.map(a => (
                    <ArticleCard key={a.id} article={a} variant="compact" />
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="card p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Share</h3>
              <ShareButtons title={article.title} url={url} />
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
