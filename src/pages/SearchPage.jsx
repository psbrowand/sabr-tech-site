// SearchPage.jsx — Search results page
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { searchArticles } from '../data/articles';
import ArticleCard  from '../components/articles/ArticleCard';
import SearchBar    from '../components/ui/SearchBar';
import CategoryBadge from '../components/ui/CategoryBadge';

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const results = query ? searchArticles(query) : [];

  return (
    <div className="container-site py-10">
      {/* Search header */}
      <div className="mb-8">
        <div className="section-label mb-3">
          <Search className="w-3.5 h-3.5" />
          Search
        </div>
        <h1 className="text-3xl font-black text-white mb-6">
          {query ? (
            <>Results for <span className="text-gradient-cyan">"{query}"</span></>
          ) : (
            'Search Stories'
          )}
        </h1>
        <div className="max-w-xl">
          <SearchBar />
        </div>
      </div>

      {/* Results count */}
      {query && (
        <p className="text-sm text-slate-500 mb-6">
          {results.length === 0
            ? 'No results found.'
            : `Found ${results.length} article${results.length !== 1 ? 's' : ''}`}
        </p>
      )}

      {/* Results grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {results.map(a => (
            <ArticleCard key={a.id} article={a} variant="default" />
          ))}
        </div>
      )}

      {/* No results */}
      {query && results.length === 0 && (
        <div className="text-center py-20 text-slate-600">
          <Search className="w-14 h-14 mx-auto mb-5 opacity-20" />
          <h2 className="text-xl font-bold text-slate-400 mb-2">No results for "{query}"</h2>
          <p className="text-sm mb-8 max-w-sm mx-auto">
            Try a different search term, or browse by category below.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['tech', 'cyber', 'ai', 'space'].map(cat => (
              <CategoryBadge key={cat} category={cat} size="sm" />
            ))}
          </div>
        </div>
      )}

      {/* Empty state — no query */}
      {!query && (
        <div className="text-center py-20 text-slate-600">
          <Search className="w-14 h-14 mx-auto mb-5 opacity-20" />
          <h2 className="text-xl font-bold text-slate-400 mb-2">What are you looking for?</h2>
          <p className="text-sm mb-8">Search articles by title, topic, company, CVE, or keyword.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['CVE', 'OpenAI', 'Ransomware', 'Starship', 'Microsoft', 'Apple', 'Zero-Day', 'NASA'].map(tag => (
              <Link
                key={tag}
                to={`/search?q=${encodeURIComponent(tag)}`}
                className="text-xs font-medium text-slate-400 bg-white/5 border border-white/[0.08] px-4 py-2 rounded-full hover:text-cyan-400 hover:border-cyan-400/20 transition-all duration-200"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
