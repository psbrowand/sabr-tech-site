// TechNewsPage.jsx — All Tech News category page with optional sub-category filter
import { useSearchParams } from 'react-router-dom';
import { Cpu, Zap, Rocket, Filter } from 'lucide-react';
import { getByCategory, articles } from '../data/articles';
import ArticleCard    from '../components/articles/ArticleCard';
import Sidebar        from '../components/sidebar/Sidebar';
import SectionHeader  from '../components/ui/SectionHeader';
import CategoryBadge  from '../components/ui/CategoryBadge';

const subCats = [
  { id: null,    label: 'All Tech',  icon: Cpu    },
  { id: 'ai',   label: 'AI & ML',   icon: Zap    },
  { id: 'space', label: 'Space',    icon: Rocket  },
];

export default function TechNewsPage() {
  const [params] = useSearchParams();
  const cat = params.get('cat') || null;

  // Filter: 'ai' and 'space' are sub-categories; 'tech' is the base
  const filtered = cat
    ? articles.filter(a => a.category === cat)
    : articles.filter(a => ['tech', 'ai', 'space'].includes(a.category));

  const sorted = [...filtered].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const [featured, ...rest] = sorted;

  const pageTitle = cat === 'ai' ? 'AI & Machine Learning' : cat === 'space' ? 'Space & Science' : 'Tech News';

  return (
    <div className="container-site py-8">
      {/* Page header */}
      <div className="mb-8 pb-8 border-b border-white/[0.06]">
        <div className="section-label mb-2">
          <Cpu className="w-3.5 h-3.5" />
          Coverage
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">{pageTitle}</h1>
        <p className="text-slate-400 max-w-xl">
          The latest technology news, AI breakthroughs, space launches, and coverage of the companies shaping our digital future.
        </p>

        {/* Sub-category pills */}
        <div className="flex flex-wrap gap-2 mt-5">
          {subCats.map(({ id, label, icon: Icon }) => {
            const isActive = cat === id;
            const href = id ? `/tech-news?cat=${id}` : '/tech-news';
            return (
              <a
                key={label}
                href={href}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500 border-cyan-500 text-black'
                    : 'border-white/10 text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-10">
        <div>
          {/* Featured large card */}
          {featured && (
            <div className="mb-8">
              <ArticleCard article={featured} variant="horizontal" className="!p-5" />
            </div>
          )}

          {/* Article grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map(a => (
              <ArticleCard key={a.id} article={a} variant="default" />
            ))}
          </div>

          {rest.length === 0 && (
            <div className="text-center py-20 text-slate-600">
              <Cpu className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-semibold mb-1">No articles found</p>
              <p className="text-sm">Check back soon — new stories are published daily.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden xl:block">
          <div className="sticky top-24">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
