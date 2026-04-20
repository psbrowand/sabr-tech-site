import { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';

// ─── Navigation links — update labels/hrefs as the site expands ──────
const NAV_LINKS = [
  { label: 'About',         href: '#about' },
  { label: 'Services',      href: '#services' },
  { label: 'Why Us',        href: '#why-us' },
  { label: 'Public Sector', href: '#sled' },
  { label: 'Our Process',   href: '#process' },
  { label: 'Contact',       href: '#contact' },
];

export default function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  // Add blur/border backdrop once user scrolls down
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on nav-link click
  const handleNavClick = () => setMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-950/90 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* ── Logo ─────────────────────────────────────────────── */}
          {/* Replace the text logo with an <img> tag when a logo file is ready */}
          <a href="#top" className="flex items-center gap-2 group" aria-label="Sabr Technologies — Home">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-cyan-500/15 border border-cyan-500/30 group-hover:bg-cyan-500/25 transition-colors duration-200">
              <Zap className="w-4 h-4 text-cyan-400" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-100 group-hover:text-cyan-400 transition-colors duration-200">
              Sabr <span className="text-cyan-400">Technologies</span>
            </span>
          </a>

          {/* ── Desktop nav links ─────────────────────────────────── */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded-md transition-all duration-150"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* ── Desktop CTA ───────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="#contact" className="btn-ghost text-xs px-4 py-2">
              Request a Quote
            </a>
            <a href="#contact" className="btn-primary text-xs px-4 py-2">
              Get Started
            </a>
          </div>

          {/* ── Mobile hamburger ──────────────────────────────────── */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Mobile menu drawer ────────────────────────────────────── */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-screen opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <ul className="flex flex-col gap-1 pt-2 border-t border-white/5">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={handleNavClick}
                  className="block px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-white/5 rounded-md transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="pt-2 flex flex-col gap-2">
              <a href="#contact" onClick={handleNavClick} className="btn-ghost justify-center">
                Request a Quote
              </a>
              <a href="#contact" onClick={handleNavClick} className="btn-primary justify-center">
                Get Started
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
