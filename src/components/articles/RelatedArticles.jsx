// RelatedArticles.jsx — Related articles row shown at bottom of article page
import ArticleCard from './ArticleCard';
import SectionHeader from '../ui/SectionHeader';

export default function RelatedArticles({ articles }) {
  if (!articles || !articles.length) return null;

  return (
    <section className="mt-14 pt-10 border-t border-white/[0.06]">
      <SectionHeader label="Continue Reading" title="Related Stories" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map(a => (
          <ArticleCard key={a.id} article={a} variant="default" />
        ))}
      </div>
    </section>
  );
}
