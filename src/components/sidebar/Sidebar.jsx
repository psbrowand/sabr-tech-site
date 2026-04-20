// ─────────────────────────────────────────────────────────────────────────────
// Sidebar.jsx — Right-column sidebar with Most Read, Breaking Alerts, Recent
// ─────────────────────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { TrendingUp, AlertTriangle, Clock, Zap, ExternalLink } from 'lucide-react';
import { getMostRead, getBreaking, getLatest } from '../../data/articles';
import CategoryBadge from '../ui/CategoryBadge';
import TimeAgo from '../ui/TimeAgo';
import NewsletterSignup from '../newsletter/NewsletterSignup';

// ── Most Read ─────────────────────────────────────────────────────────────────
function MostRead() {
  const articles = getMostRead();
  return (
    <div className="card p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-100 mb-4 pb-3 border-b border-white/[0.06]">
        <TrendingUp className="w-4 h-4 text-cyan-400" /> Most Read
      </h3>
      <ol className="space-y-0">
        {articles.map((a, i) => (
          <li key={a.id}>
            <Link to={`/article/${a.slug}`} className="flex gap-3 py-3 group border-b border-white/[0.04] last:border-0">
              <span className="flex-shrink-0 text-2xl font-black text-slate-800 leading-none w-6 text-center mt-0.5">
                {i + 1}
              </span>
              <div className="min-w-0">
                <CategoryBadge category={a.category} size="xs" asLink={false} />
                <p className="text-xs font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors duration-200 line-clamp-2 mt-1 leading-snug">
                  {a.title}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ── Breaking Alerts ───────────────────────────────────────────────────────────
function BreakingAlerts() {
  const alerts = getBreaking();
  if (!alerts.length) return null;

  return (
    <div className="card border-red-500/20 p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-red-400 mb-4 pb-3 border-b border-red-500/10">
        <AlertTriangle className="w-4 h-4" /> Breaking Alerts
      </h3>
      <div className="space-y-3">
        {alerts.map(a => (
          <Link
            key={a.id}
            to={`/article/${a.slug}`}
            className="block group p-3 rounded-lg bg-red-500/5 border border-red-500/10 hover:border-red-500/25 transition-all duration-200"
          >
            <CategoryBadge category={a.category} size="xs" asLink={false} />
            <p className="text-xs font-semibold text-slate-200 group-hover:text-red-300 mt-1.5 line-clamp-2 leading-snug transition-colors duration-200">
              {a.title}
            </p>
            <TimeAgo date={a.publishedAt} className="text-[11px] text-slate-600 mt-1.5 block" />
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Recent Posts ──────────────────────────────────────────────────────────────
function RecentPosts() {
  const articles = getLatest(5);
  return (
    <div className="card p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-100 mb-4 pb-3 border-b border-white/[0.06]">
        <Clock className="w-4 h-4 text-cyan-400" /> Recent Posts
      </h3>
      <div className="space-y-0">
        {articles.map(a => (
          <Link
            key={a.id}
            to={`/article/${a.slug}`}
            className="flex gap-3 py-3 group border-b border-white/[0.04] last:border-0"
          >
            <div className="flex-shrink-0 w-14 h-12 rounded-lg overflow-hidden bg-slate-800">
              <img
                src={a.image}
                alt={a.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors duration-200 line-clamp-2 leading-snug">
                {a.title}
              </p>
              <TimeAgo date={a.publishedAt} className="text-[11px] text-slate-600 mt-1 block" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Ad / Promo placeholder ────────────────────────────────────────────────────
function PromoBanner() {
  return (
    <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 p-5 text-center">
      <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
      <p className="text-xs font-bold text-slate-200 mb-1">Cyber Threat Intel</p>
      <p className="text-[11px] text-slate-500 mb-4">
        Get daily threat briefings and CVE alerts straight to your inbox.
      </p>
      <Link to="/newsletter" className="btn-primary text-xs py-2 justify-center w-full">
        Subscribe Free
      </Link>
    </div>
  );
}

// ── Main Sidebar export ───────────────────────────────────────────────────────
export default function Sidebar() {
  return (
    <aside className="space-y-6">
      <BreakingAlerts />
      <MostRead />
      <NewsletterSignup compact />
      <RecentPosts />
      <PromoBanner />
    </aside>
  );
}
