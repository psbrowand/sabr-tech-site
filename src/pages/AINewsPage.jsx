// AINewsPage.jsx — Dedicated "AI News" category page.
// Mirrors the structure of CyberSecurityPage but scoped to category === 'ai'.
import { Zap, Cpu, Brain, Sparkles } from 'lucide-react';
import { getByCategory } from '../data/articles';
import ArticleCard   from '../components/articles/ArticleCard';
import Sidebar       from '../components/sidebar/Sidebar';
import SectionHeader from '../components/ui/SectionHeader';

const aiTags = [
  'LLMs', 'Model Releases', 'Agents', 'Alignment', 'Regulation',
  'Open Source', 'Multimodal', 'Inference', 'Training', 'Research',
];

export default function AINewsPage() {
  const aiArticles = getByCategory('ai');
  const sorted = [...aiArticles].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );
  const [featured, ...rest] = sorted;

  return (
    <div>
      <div className="container-site py-8">
        {/* Page header */}
        <div className="relative rounded-2xl overflow-hidden mb-10 p-8 sm:p-12 bg-gradient-to-br from-[#0d1321] to-[#111827] border border-white/[0.06]">
          <div className="absolute inset-0 cyber-grid opacity-50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="section-label text-purple-400">
                  <span className="inline-block w-3 h-0.5 bg-purple-400 mr-1.5" />
                  Artificial Intelligence
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">AI News</h1>
              <p className="text-slate-400 max-w-xl">
                Model releases, research breakthroughs, regulation, and the ethics
                of machine intelligence — the complete AI beat in one place.
              </p>
            </div>
          </div>

          {/* Tag cloud */}
          <div className="relative mt-6 flex flex-wrap gap-2">
            {aiTags.map(tag => (
              <span
                key={tag}
                className="text-[11px] font-semibold text-purple-400/70 border border-purple-400/15 px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-10">
          <div>
            {featured && (
              <section className="mb-10">
                <SectionHeader
                  label="Featured"
                  title="Top AI Story"
                />
                <ArticleCard article={featured} variant="horizontal" className="!p-5" />
              </section>
            )}

            <SectionHeader
              label="All Coverage"
              title="AI & Machine Learning Stories"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map(a => (
                <ArticleCard key={a.id} article={a} variant="default" />
              ))}
            </div>

            {aiArticles.length === 0 && (
              <div className="text-center py-20 text-slate-600">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-semibold mb-1">No AI stories yet</p>
                <p className="text-sm">Check back soon — AI coverage is updated daily.</p>
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
    </div>
  );
}

// Keep unused-icon guard quiet if we later reorg.
void [Zap, Cpu];
