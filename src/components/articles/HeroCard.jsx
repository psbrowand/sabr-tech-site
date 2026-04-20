// ─────────────────────────────────────────────────────────────────────────────
// HeroCard.jsx — Full-width hero for the featured/top article on the homepage
// ─────────────────────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { Clock, User, ArrowRight, TrendingUp } from 'lucide-react';
import CategoryBadge from '../ui/CategoryBadge';
import TimeAgo from '../ui/TimeAgo';

export default function HeroCard({ article }) {
  if (!article) return null;
  const { slug, title, summary, image, author, publishedAt, readingTime, category } = article;

  return (
    <Link
      to={`/article/${slug}`}
      className="relative block rounded-2xl overflow-hidden group aspect-[16/8] min-h-[360px] sm:min-h-[480px]"
    >
      {/* Background image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Layered gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080c18] via-[#080c18]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080c18]/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
        {/* Top badge row */}
        <div className="flex items-center gap-3 mb-4">
          <CategoryBadge category={category} size="sm" asLink={false} />
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <TrendingUp className="w-3 h-3" /> Top Story
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3 max-w-3xl group-hover:text-cyan-50 transition-colors duration-300 [text-shadow:0_2px_20px_rgba(0,0,0,0.8)]">
          {title}
        </h1>

        {/* Summary */}
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mb-5 line-clamp-2 leading-relaxed [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
          {summary}
        </p>

        {/* Meta + CTA row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> {author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {readingTime} min read
            </span>
            <TimeAgo date={publishedAt} />
          </div>

          <span className="inline-flex items-center gap-2 text-cyan-400 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
            Read Full Story <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Subtle glow border on hover */}
      <div className="absolute inset-0 rounded-2xl border border-white/5 group-hover:border-cyan-500/20 transition-colors duration-500 pointer-events-none" />
    </Link>
  );
}
