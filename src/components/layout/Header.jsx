// ─────────────────────────────────────────────────────────────────────────────
// Header.jsx — Sticky top navigation bar
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Search, Zap } from 'lucide-react';
import SearchBar from '../ui/SearchBar';

const navItems = [
  { label: 'Tech News',      href: '/tech-news' },
  { label: 'Cyber Security', href: '/cyber-security' },
  { label: 'Learning',       href: '/learning' },
  { label: 'About',          href: '/about' },
  { label: 'Contact',        href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  // Add background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#080c18]/95 backdrop-blur-md shadow-lg shadow-black/40 border-b border-white/[0.06]'
            : 'bg-[#080c18]/80 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16">

            {/* Logo — bitmap mark (sword + "S" glyph) in a 10x10 tile with
                pulsing dot, per design_handoff_news_template README §1. */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg shadow-cyan-500/30 ring-1 ring-white/10">
                  <img
                    src="/sabr-logo.png"
                    alt=""
                    className="w-full h-full object-cover"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-black text-base tracking-tight">SABR</span>
                <span className="text-cyan-400 font-semibold text-[10px] tracking-[0.2em] uppercase -mt-0.5">Cyber & Tech</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map(item => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-cyan-400 bg-cyan-400/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(v => !v)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
                aria-label="Toggle search"
              >
                {searchOpen ? <X className="w-4.5 h-4.5" /> : <Search className="w-4.5 h-4.5" />}
              </button>

              {/* Newsletter CTA */}
              <Link
                to="/newsletter"
                className="hidden sm:flex btn-primary text-xs px-4 py-2 gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                Subscribe
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search dropdown */}
          {searchOpen && (
            <div className="py-3 border-t border-white/[0.06] animate-fade-in">
              <SearchBar
                placeholder="Search articles, CVEs, companies…"
                onClose={() => setSearchOpen(false)}
              />
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0d1321] border-t border-white/[0.06] animate-fade-in">
            <nav className="container-site py-4 flex flex-col gap-1">
              {navItems.map(item => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    `px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-cyan-400 bg-cyan-400/10'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/newsletter"
                className="mt-2 btn-primary justify-center"
              >
                <Zap className="w-4 h-4" />
                Subscribe to Newsletter
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer so content starts below fixed header */}
      <div className="h-16" />
    </>
  );
}
