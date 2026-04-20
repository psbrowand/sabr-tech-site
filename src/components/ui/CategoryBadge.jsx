// CategoryBadge.jsx — Pill badge for article categories
import { Link } from 'react-router-dom';
import { getCategoryById } from '../../data/categories';

const categoryMeta = {
  tech:     { label: 'Tech',     classes: 'text-cyan-400    bg-cyan-400/10    border-cyan-400/25',    href: '/tech-news' },
  cyber:    { label: 'Cyber',    classes: 'text-red-400     bg-red-400/10     border-red-400/25',     href: '/cyber-security' },
  ai:       { label: 'AI',       classes: 'text-purple-400  bg-purple-400/10  border-purple-400/25',  href: '/tech-news?cat=ai' },
  space:    { label: 'Space',    classes: 'text-blue-400    bg-blue-400/10    border-blue-400/25',    href: '/tech-news?cat=space' },
  learning: { label: 'Learning', classes: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25', href: '/learning' },
};

export default function CategoryBadge({ category, size = 'sm', asLink = true }) {
  const meta = categoryMeta[category] || {
    label: category,
    classes: 'text-slate-400 bg-slate-400/10 border-slate-400/25',
    href: '/',
  };

  const sizeClasses = size === 'xs'
    ? 'text-[10px] px-2 py-0.5'
    : size === 'sm'
    ? 'text-xs px-2.5 py-1'
    : 'text-sm px-3 py-1.5';

  const cls = `inline-flex items-center font-semibold tracking-wide uppercase rounded-md border ${meta.classes} ${sizeClasses} transition-opacity duration-200`;

  if (asLink) {
    return (
      <Link to={meta.href} className={`${cls} hover:opacity-80`} onClick={e => e.stopPropagation()}>
        {meta.label}
      </Link>
    );
  }

  return <span className={cls}>{meta.label}</span>;
}
