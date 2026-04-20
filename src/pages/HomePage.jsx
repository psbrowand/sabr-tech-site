// ─────────────────────────────────────────────────────────────────────────────
// HomePage.jsx — Main landing page with hero, trending, category sections
// ─────────────────────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Cpu, Rocket, Zap, ArrowRight, ChevronRight, BookOpen } from 'lucide-react';

import {
  getFeatured, getTrending, getLatest, getByCategory,
} from '../data/articles';

import HeroCard          from '../components/articles/HeroCard';
import ArticleCard       from '../components/articles/ArticleCard';
import Sidebar           from '../components/sidebar/Sidebar';
import SectionHeader     from '../components/ui/SectionHeader';
import CategoryBadge     from '../components/ui/CategoryBadge';
import NewsletterSignup  from '../components/newsletter/NewsletterSignup';

// ── Trending strip (horizontal scroll on mobile) ──────────────────────────────
function TrendingStrip() {
  const trending = getTrending().slice(0, 6);

  return (
    <section className="py-6">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Trending Now</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
        {trending.map((a, i) => (
          <Link
            key={a.id}
            to={`/article/${a.slug}`}
            className="flex-shrink-0 sm:flex-shrink flex items-center gap-3 bg-[#111827] border border-white/[0.06] rounded-xl px-4 py-3 hover:border-amber-400/25 hover:bg-[#131d2e] transition-all duration-200 group max-w-xs sm:max-w-none"
          >
            <span className="text-xl font-black text-slate-800 leading-none w-5 text-center flex-shrink-0">{i + 1}</span>
            <div className="min-w-0">
              <CategoryBadge category={a.category} size="xs" asLink={false} />
              <p className="text-xs font-semibold text-slate-300 group-hover:text-white mt-1 line-clamp-1 transition-colors duration-200">
                {a.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Category section row ──────────────────────────────────────────────────────
function CategorySection({ categoryId, icon: Icon, color, label, viewAllHref, limit = 3 }) {
  const articles = getByCategory(categoryId).slice(0, limit);

  return (
    <section className="py-8">
      <SectionHeader
        label={label}
        title={label}
        viewAllHref={viewAllHref}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map(a => (
          <ArticleCard key={a.id} article={a} variant="default" />
        ))}
      </div>
    </section>
  );
}

// ── AI Spotlight section ──────────────────────────────────────────────────────
function AISpotlight() {
  const aiArticles = getByCategory('ai').slice(0, 3);
  if (!aiArticles.length) return null;

  const [main, ...rest] = aiArticles;

  return (
    <section className="py-8">
      <SectionHeader
        label="Artificial Intelligence"
        title="AI & Machine Learning"
        viewAllHref="/tech-news?cat=ai"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Large featured on left */}
        <Link
          to={`/article/${main.slug}`}
          className="lg:col-span-2 card hover-glow overflow-hidden group flex flex-col"
        >
          <div className="relative aspect-video overflow-hidden bg-slate-800">
            <img
              src={main.image}
              alt={main.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/90 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <CategoryBadge category={main.category} size="xs" asLink={false} />
              <h3 className="text-lg font-bold text-white mt-2 line-clamp-2 leading-snug group-hover:text-cyan-50 transition-colors duration-200">
                {main.title}
              </h3>
            </div>
          </div>
        </Link>

        {/* Stack on right */}
        <div className="flex flex-col gap-4">
          {rest.map(a => (
            <ArticleCard key={a.id} article={a} variant="horizontal" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Space section compact ─────────────────────────────────────────────────────
function SpaceSection() {
  const articles = getByCategory('space').slice(0, 3);

  return (
    <section className="py-8">
      <SectionHeader
        label="Space & Science"
        title="Space Exploration"
        viewAllHref="/tech-news?cat=space"
      />
      <div className="space-y-3">
        {articles.map(a => (
          <ArticleCard key={a.id} article={a} variant="horizontal" />
        ))}
      </div>
    </section>
  );
}

// ── Learning spotlight section ────────────────────────────────────────────────
function LearningSpotlight() {
  const learningArticles = getByCategory('learning').slice(0, 3);
  if (!learningArticles.length) return null;

  return (
    <section className="py-8">
      <SectionHeader
        label="Certification Guides"
        title="Learning &amp; Certifications"
        viewAllHref="/learning"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {learningArticles.map(a => (
          <ArticleCard key={a.id} article={a} variant="default" />
        ))}
      </div>
      <div className="mt-5 flex justify-center">
        <Link
          to="/learning"
          className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200"
        >
          <BookOpen className="w-4 h-4" />
          View all certification guides
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}

// ── Category nav pills ────────────────────────────────────────────────────────
function CategoryNav() {
  const cats = [
    { id: 'tech',     label: 'Tech',       href: '/tech-news',          icon: Cpu,      color: 'text-cyan-400' },
    { id: 'cyber',    label: 'Cyber',      href: '/cyber-security',     icon: Shield,   color: 'text-red-400' },
    { id: 'ai',       label: 'AI',         href: '/tech-news?cat=ai',   icon: Zap,      color: 'text-purple-400' },
    { id: 'space',    label: 'Space',      href: '/tech-news?cat=space',icon: Rocket,   color: 'text-blue-400' },
    { id: 'learning', label: 'Learning',   href: '/learning',            icon: BookOpen, color: 'text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 py-6">
      {cats.map(({ id, label, href, icon: Icon, color }) => (
        <Link
          key={id}
          to={href}
          className="card hover-glow flex items-center gap-3 p-4 group"
        >
          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors duration-200">
            <Icon className={`w-4.5 h-4.5 ${color}`} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{label}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">Latest stories</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-700 ml-auto group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-200" />
        </Link>
      ))}
    </div>
  );
}

// ── Main HomePage ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const featured = getFeatured();
  const hero     = featured[0] || getLatest(1)[0];
  const latestTech  = getByCategory('tech').slice(0, 3);
  const latestCyber = getByCategory('cyber').slice(0, 4);
  const latest6     = getLatest(6);

  return (
    <div>
      <div className="container-site py-6">
        {/* Hero */}
        <section className="mb-6">
          <HeroCard article={hero} />
        </section>

        {/* Trending strip */}
        <div className="section-divider mb-2" />
        <TrendingStrip />
        <div className="section-divider" />

        {/* Category nav */}
        <CategoryNav />
        <div className="section-divider" />

        {/* Main content + Sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-10 mt-2">
          <div>
            {/* Latest Tech News */}
            <section className="py-8">
              <SectionHeader
                label="Technology"
                title="Latest Tech News"
                viewAllHref="/tech-news"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {latestTech.map(a => (
                  <ArticleCard key={a.id} article={a} variant="default" />
                ))}
              </div>
            </section>

            <div className="section-divider" />

            {/* Breaking Cyber Security */}
            <section className="py-8">
              <SectionHeader
                label="Threat Intelligence"
                title="Breaking Cyber Security News"
                viewAllHref="/cyber-security"
              />
              <div className="space-y-4">
                {latestCyber.map(a => (
                  <ArticleCard key={a.id} article={a} variant="horizontal" />
                ))}
              </div>
            </section>

            <div className="section-divider" />

            {/* AI Spotlight */}
            <AISpotlight />

            <div className="section-divider" />

            {/* Newsletter inline */}
            <div className="py-8">
              <NewsletterSignup />
            </div>

            <div className="section-divider" />

            {/* Learning spotlight */}
            <LearningSpotlight />

            <div className="section-divider" />

            {/* Space section */}
            <SpaceSection />

            <div className="section-divider" />

            {/* Latest 6 articles grid */}
            <section className="py-8">
              <SectionHeader
                label="All News"
                title="More Stories"
                viewAllHref="/tech-news"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {latest6.slice(3).map(a => (
                  <ArticleCard key={a.id} article={a} variant="default" />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="hidden xl:block">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
