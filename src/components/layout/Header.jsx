// ─────────────────────────────────────────────────────────────────────────────
// Header.jsx — Sticky top navigation bar
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Zap, LogIn, UserPlus, LayoutDashboard, LogOut, ChevronDown, Home, User, Settings } from 'lucide-react';
import SearchBar from '../ui/SearchBar';
import { useAuth, buildAuthReturnUrl, APP_ORIGIN } from '../../hooks/useAuth';
import { track, EVENTS } from '../../lib/analytics';

// Apex is now cert-prep marketing. "Home" is the marketing landing, the
// former /learning (certification guides) is surfaced as "Certifications"
// since that's what it actually is.
const navItems = [
  { label: 'Home',           href: '/' },
  { label: 'Pricing',        href: '/#pricing' },
  { label: 'News',           href: '/news' },
  { label: 'Certifications', href: '/learning' },
  { label: 'About',          href: '/about' },
  { label: 'Contact',        href: '/contact' },
];

// Active-state helper. React Router's NavLink only compares pathname, so
// two links with the same pathname but different hashes (e.g. "/" vs
// "/#pricing") were both lighting up on "/". We compare pathname AND
// hash so each nav item highlights only on its own destination.
function splitHref(href) {
  const i = href.indexOf('#');
  return i === -1 ? { pathname: href, hash: '' } : { pathname: href.slice(0, i), hash: href.slice(i) };
}
function isNavItemActive(href, location) {
  const target = splitHref(href);
  const currentHash = location.hash || '';
  return target.pathname === location.pathname && target.hash === currentHash;
}

export default function Header() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const { user, loading, signOut } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Close the signed-in user dropdown on outside click. Simpler than
  // listening for pointerdown on every node and scales fine with one
  // event handler.
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userMenuOpen]);

  // Add background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : user?.email
      ? user.email[0].toUpperCase()
      : '';

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
                <span className="text-cyan-400 font-semibold text-[10px] tracking-[0.2em] uppercase -mt-0.5">Learning Labs</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map(item => {
                const active = isNavItemActive(item.href, location);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      active
                        ? 'text-cyan-400 bg-cyan-400/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(v => !v)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
                aria-label="Toggle search"
              >
                {searchOpen ? <X className="w-[18px] h-[18px]" /> : <Search className="w-[18px] h-[18px]" />}
              </button>

              {/* Auth slot — renders nothing during the initial session
                  fetch to avoid a flash of "Sign in" for already-authed
                  users. After `loading` flips, shows either auth buttons
                  or the user dropdown. */}
              {!loading && !user && (
                <div className="hidden sm:flex items-center gap-2">
                  <a
                    href={buildAuthReturnUrl('/login')}
                    onClick={() => track(EVENTS.NAV_CTA_CLICK, { cta: 'sign_in' })}
                    className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors duration-200 inline-flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Sign in
                  </a>
                  <a
                    href={buildAuthReturnUrl('/register')}
                    onClick={() => track(EVENTS.NAV_CTA_CLICK, { cta: 'sign_up' })}
                    className="btn-primary text-xs px-4 py-2 gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Sign up
                  </a>
                </div>
              )}

              {!loading && user && (
                <div ref={userMenuRef} className="hidden sm:block relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-white/10 hover:border-cyan-400/40 hover:bg-white/5 transition-colors duration-200"
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                  >
                    <span className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 border border-cyan-400/25 text-cyan-300 text-[11px] font-bold flex items-center justify-center">
                      {initials || '?'}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 max-w-[10rem] truncate">
                      {user.name || user.email}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-xl border border-white/10 bg-[#0d1321] shadow-xl shadow-black/40 overflow-hidden z-50">
                      <div className="px-3 py-2.5 border-b border-white/[0.06]">
                        <p className="text-xs text-slate-200 font-semibold truncate">{user.name || 'Account'}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>
                      {/* Tech-site local nav first */}
                      <Link
                        to="/"
                        className="flex items-center gap-2 px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                      >
                        <Home className="w-3.5 h-3.5" />
                        Home page
                      </Link>
                      {/* Learning app quick links */}
                      <a
                        href={`${APP_ORIGIN}/dashboard`}
                        className="flex items-center gap-2 px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors duration-200 border-t border-white/[0.06]"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Learning Command Center
                      </a>
                      <a
                        href={`${APP_ORIGIN}/profile`}
                        className="flex items-center gap-2 px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                      >
                        <User className="w-3.5 h-3.5" />
                        Profile
                      </a>
                      <a
                        href={`${APP_ORIGIN}/settings`}
                        className="flex items-center gap-2 px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        Settings
                      </a>
                      <Link
                        to="/newsletter"
                        className="flex items-center gap-2 px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors duration-200 border-t border-white/[0.06]"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Newsletter
                      </Link>
                      <button
                        onClick={signOut}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors duration-200 border-t border-white/[0.06]"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}

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
              {navItems.map(item => {
                const active = isNavItemActive(item.href, location);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      active
                        ? 'text-cyan-400 bg-cyan-400/10'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                to="/newsletter"
                className="mt-2 btn-primary justify-center"
              >
                <Zap className="w-4 h-4" />
                Subscribe to Newsletter
              </Link>

              {/* Mobile auth affordances. Mirror the desktop header so a
                  user on a phone can sign in/up or jump to their
                  dashboard from the same menu. */}
              {!loading && !user && (
                <div className="mt-2 pt-2 border-t border-white/[0.06] flex flex-col gap-1">
                  <a
                    href={buildAuthReturnUrl('/login')}
                    className="px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign in
                  </a>
                  <a
                    href={buildAuthReturnUrl('/register')}
                    className="px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Create account
                  </a>
                </div>
              )}
              {!loading && user && (
                <div className="mt-2 pt-2 border-t border-white/[0.06] flex flex-col gap-1">
                  <div className="px-4 py-2">
                    <p className="text-xs text-slate-300 font-semibold truncate">{user.name || 'Account'}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/"
                    className="px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Home page
                  </Link>
                  <a
                    href={`${APP_ORIGIN}/dashboard`}
                    className="px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Learning Command Center
                  </a>
                  <a
                    href={`${APP_ORIGIN}/profile`}
                    className="px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </a>
                  <a
                    href={`${APP_ORIGIN}/settings`}
                    className="px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </a>
                  <button
                    onClick={signOut}
                    className="px-4 py-3 text-sm font-medium rounded-lg text-left text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Spacer so content starts below fixed header */}
      <div className="h-16" />
    </>
  );
}
