// BreakingTicker.jsx — Scrolling breaking news banner
import { Link } from 'react-router-dom';
import { getBreaking } from '../../data/articles';
import { AlertTriangle } from 'lucide-react';

export default function BreakingTicker() {
  const breaking = getBreaking();
  if (!breaking.length) return null;

  // Duplicate items so the ticker loops seamlessly
  const items = [...breaking, ...breaking, ...breaking, ...breaking];

  return (
    <div className="bg-red-600/10 border-y border-red-500/20 py-2 overflow-hidden ticker-pause relative z-40">
      <div className="flex items-center">
        {/* Static label */}
        <div className="flex-shrink-0 flex items-center gap-2 px-4 bg-red-600 h-8 mr-4 z-10">
          <span className="live-dot" />
          <span className="text-white text-xs font-bold tracking-widest uppercase">Breaking</span>
        </div>

        {/* Scrolling ticker */}
        <div className="flex overflow-hidden">
          <div className="flex gap-0 ticker-animate whitespace-nowrap">
            {items.map((article, i) => (
              <span key={`${article.id}-${i}`} className="inline-flex items-center">
                <Link
                  to={`/article/${article.slug}`}
                  className="text-slate-200 hover:text-red-400 text-xs font-medium transition-colors duration-200"
                >
                  <AlertTriangle className="inline w-3 h-3 text-red-400 mr-1 -mt-0.5" />
                  {article.title}
                </Link>
                <span className="mx-8 text-red-500/50">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
