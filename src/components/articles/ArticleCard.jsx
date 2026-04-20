// ─────────────────────────────────────────────────────────────────────────────
// ArticleCard.jsx — Reusable card for listing articles
// Variants: 'default' | 'horizontal' | 'compact' | 'featured'
// ─────────────────────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { Clock, User, TrendingUp, AlertTriangle, Flame } from 'lucide-react';
import CategoryBadge from '../ui/CategoryBadge';
import TimeAgo from '../ui/TimeAgo';

export default function ArticleCard({ article, variant = 'default', className = '' }) {
  const { slug, title, summary, image, author, publishedAt, readingTime, category, trending, breaking, featured } = article;
  const href = `/article/${slug}`;

  if (variant === 'compact') {
    return (
      <Link to={href} className="flex items-start gap-3 group py-3 border-b border-white/[0.05] last:border-0">
        <div className="flex-shrink-0 w-16 h-14 rounded-lg overflow-hidden bg-slate-800">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <CategoryBadge category={category} size="xs" asLink={false} />
          <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 mt-1 line-clamp-2 leading-snug transition-colors duration-200">
            {title}
          </h4>
          <p className="text-[11px] text-slate-600 mt-1">
            <TimeAgo date={publishedAt} />
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link to={href} className="card hover-glow flex gap-4 p-4 group overflow-hidden">
        <div className="flex-shrink-0 w-32 sm:w-40 h-24 rounded-lg overflow-hidden bg-slate-800">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <CategoryBadge category={category} size="xs" asLink={false} />
            {breaking && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-wide">
                <AlertTriangle className="w-2.5 h-2.5" /> Breaking
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors duration-200 line-clamp-2 leading-snug mb-1">
            {title}
          </h3>
          <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-auto">
            <span className="flex items-center gap-1"><User className="w-3 h-3" />{author}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{readingTime}m</span>
            <TimeAgo date={publishedAt} />
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link to={href} className={`card hover-glow overflow-hidden group flex flex-col ${className}`}>
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-slate-800 flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-transparent to-transparent" />

        {/* Badges over image */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <CategoryBadge category={category} size="xs" asLink={false} />
          {breaking && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-red-600 px-1.5 py-0.5 rounded uppercase tracking-wide pulse-red">
              <span className="live-dot scale-75" /> Breaking
            </span>
          )}
          {trending && !breaking && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/25 px-1.5 py-0.5 rounded uppercase tracking-wide">
              <TrendingUp className="w-2.5 h-2.5" /> Trending
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors duration-200 line-clamp-3 leading-snug mb-2">
          {title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3 flex-1">
          {summary}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-slate-600 border-t border-white/[0.05] pt-3 mt-auto">
          <span className="flex items-center gap-1 truncate">
            <User className="w-3 h-3 flex-shrink-0" />{author}
          </span>
          <span className="flex items-center gap-1 flex-shrink-0">
            <Clock className="w-3 h-3" />{readingTime}m
          </span>
          <TimeAgo date={publishedAt} className="flex-shrink-0 ml-auto" />
        </div>
      </div>
    </Link>
  );
}
