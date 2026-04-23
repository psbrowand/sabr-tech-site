// ─────────────────────────────────────────────────────────────────────────────
// App.jsx — Sabr Learning Labs (apex marketing site)
//
// Route model:
//   "/"       → LandingPage (cert-prep marketing — the product front door)
//   "/news"   → HomePage (the cyber/tech/AI news magazine, now a subsection)
//   Other /tech-news, /cyber-security, /ai-news category pages unchanged.
//
// The news engine (Paperclip cron → articles.js) still runs; we're just
// demoting the magazine off the homepage and putting cert-prep first.
// ─────────────────────────────────────────────────────────────────────────────

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Header            from './components/layout/Header';
import Footer            from './components/layout/Footer';
import BreakingTicker    from './components/ui/BreakingTicker';

import HomePage          from './pages/HomePage';
import LandingPage       from './pages/LandingPage';
import TechNewsPage      from './pages/TechNewsPage';
import CyberSecurityPage from './pages/CyberSecurityPage';
import ArticlePage       from './pages/ArticlePage';
import AboutPage         from './pages/AboutPage';
import ContactPage       from './pages/ContactPage';
import NewsletterPage    from './pages/NewsletterPage';
import QodPage           from './pages/QodPage';
import SearchPage        from './pages/SearchPage';
import LearningPage      from './pages/LearningPage';
import AINewsPage        from './pages/AINewsPage';
import PrivacyPage       from './pages/PrivacyPage';
import TermsPage         from './pages/TermsPage';
import RefundPage        from './pages/RefundPage';

// Scroll-on-navigation handler. Hash takes precedence — if the URL carries
// a fragment (e.g. /#pricing) we scroll to that element instead of the top.
// Waits one rAF so the target section is in the DOM when we look for it.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, '');
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo({ top: 0, behavior: 'instant' });
      });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

function NotFoundPage() {
  return (
    <div className="container-site py-32 text-center">
      <p className="text-9xl font-black text-white/[0.03] mb-4 select-none">404</p>
      <h1 className="text-3xl font-bold text-slate-300 mb-4">Page Not Found</h1>
      <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary">Back to Home</a>
    </div>
  );
}

// Routes where the news BreakingTicker belongs. On the cert-prep marketing
// front door (/, /landing) and on pure marketing/utility pages, the ticker
// reads as off-brand "news site" chrome — hide it there. Inside the news
// magazine it's still relevant context.
const TICKER_ROUTES = new Set([
  '/news',
  '/tech-news',
  '/ai-news',
  '/cyber-security',
]);

function Layout({ children }) {
  const { pathname } = useLocation();
  const showTicker = TICKER_ROUTES.has(pathname) || pathname.startsWith('/article/');
  return (
    <div className="min-h-screen flex flex-col bg-[#080c18]">
      <Header />
      {showTicker && <BreakingTicker />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* Apex = marketing. News magazine moved to /news. /landing kept
              as an alias for any legacy inbound links. */}
          <Route path="/"               element={<LandingPage />} />
          <Route path="/landing"        element={<LandingPage />} />
          <Route path="/news"           element={<HomePage />} />
          <Route path="/tech-news"      element={<TechNewsPage />} />
          <Route path="/ai-news"        element={<AINewsPage />} />
          <Route path="/cyber-security" element={<CyberSecurityPage />} />
          <Route path="/article/:slug"  element={<ArticlePage />} />
          <Route path="/about"          element={<AboutPage />} />
          <Route path="/contact"        element={<ContactPage />} />
          <Route path="/newsletter"     element={<NewsletterPage />} />
          <Route path="/qod"            element={<QodPage />} />
          <Route path="/search"         element={<SearchPage />} />
          <Route path="/learning"       element={<LearningPage />} />
          <Route path="/privacy"        element={<PrivacyPage />} />
          <Route path="/terms"          element={<TermsPage />} />
          <Route path="/refund"         element={<RefundPage />} />
          <Route path="*"               element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
