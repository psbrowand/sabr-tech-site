// ─────────────────────────────────────────────────────────────────────────────
// App.jsx — Sabr Cyber & Tech News
//
// React Router v6 setup. Add new pages by:
//   1. Creating src/pages/MyPage.jsx
//   2. Adding <Route path="/path" element={<MyPage />} /> below
//
// CMS integration: replace src/data/articles.js exports with async fetches
// from Supabase, Sanity, Strapi, or your custom backend API.
// ─────────────────────────────────────────────────────────────────────────────

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Header            from './components/layout/Header';
import Footer            from './components/layout/Footer';
import BreakingTicker    from './components/ui/BreakingTicker';

import HomePage          from './pages/HomePage';
import TechNewsPage      from './pages/TechNewsPage';
import CyberSecurityPage from './pages/CyberSecurityPage';
import ArticlePage       from './pages/ArticlePage';
import AboutPage         from './pages/AboutPage';
import ContactPage       from './pages/ContactPage';
import NewsletterPage    from './pages/NewsletterPage';
import SearchPage        from './pages/SearchPage';
import LearningPage      from './pages/LearningPage';
import AINewsPage        from './pages/AINewsPage';
import PrivacyPage       from './pages/PrivacyPage';
import TermsPage         from './pages/TermsPage';
import RefundPage        from './pages/RefundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
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

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#080c18]">
      <Header />
      {/* Breaking ticker sits directly below the header on every page.
          Self-hides (returns null) when no articles have breaking:true. */}
      <BreakingTicker />
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
          <Route path="/"               element={<HomePage />} />
          <Route path="/tech-news"      element={<TechNewsPage />} />
          <Route path="/ai-news"        element={<AINewsPage />} />
          <Route path="/cyber-security" element={<CyberSecurityPage />} />
          <Route path="/article/:slug"  element={<ArticlePage />} />
          <Route path="/about"          element={<AboutPage />} />
          <Route path="/contact"        element={<ContactPage />} />
          <Route path="/newsletter"     element={<NewsletterPage />} />
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
