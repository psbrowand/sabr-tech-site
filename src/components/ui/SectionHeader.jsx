// SectionHeader.jsx — Consistent section headings with accent line and optional link
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionHeader({ label, title, viewAllHref, viewAllLabel = 'View All', dark = false }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        {label && (
          <p className="section-label mb-1.5">
            <span className="inline-block w-4 h-0.5 bg-cyan-400 mr-1.5" />
            {label}
          </p>
        )}
        <h2 className={`text-xl sm:text-2xl font-bold ${dark ? 'text-white' : 'text-slate-100'}`}>
          {title}
        </h2>
      </div>

      {viewAllHref && (
        <Link
          to={viewAllHref}
          className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200 group flex-shrink-0 ml-4"
        >
          {viewAllLabel}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
        </Link>
      )}
    </div>
  );
}
