// ─────────────────────────────────────────────────────────────────────────────
// Footer.jsx — Site footer with links, newsletter CTA, and social placeholders
// ─────────────────────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Rss, Zap, Mail, ArrowRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const APP_ORIGIN = import.meta.env.VITE_APP_ORIGIN || 'https://app.sabr-labs.com';

const footerLinks = {
  'News': [
    { label: 'Tech News',       href: '/tech-news' },
    { label: 'Cyber Security',  href: '/cyber-security' },
    { label: 'AI & Machine Learning', href: '/tech-news?cat=ai' },
    { label: 'Space & Science', href: '/tech-news?cat=space' },
    { label: 'Learning & Certs', href: '/learning' },
  ],
  'Services': [
    { label: 'SABR Learning',  href: APP_ORIGIN, external: true },
    { label: 'Discussions',    href: 'https://discussions.sabr-labs.com', external: true },
  ],
  'Company': [
    { label: 'About Us',   href: '/about' },
    { label: 'Contact',    href: '/contact' },
    { label: 'Newsletter', href: '/newsletter' },
  ],
  'Legal': [
    { label: 'Privacy Policy',    href: '/privacy' },
    { label: 'Terms of Service',  href: '/terms' },
    { label: 'Refund Policy',     href: '/refund' },
  ],
};

const socialLinks = [
  { icon: Twitter,  label: 'Twitter / X', href: '#' },
  { icon: Linkedin, label: 'LinkedIn',     href: '#' },
  { icon: Github,   label: 'GitHub',       href: '#' },
  { icon: Rss,      label: 'RSS Feed',     href: '#' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Subscription failed (${res.status}).`);
      }
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#080c18] border-t border-white/[0.06] mt-16">

      {/* Newsletter CTA band */}
      <div className="border-b border-white/[0.06]">
        <div className="container-site py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="section-label mb-2">
                <Zap className="w-3.5 h-3.5" />
                Daily Intel
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Stay Ahead of the Threat</h3>
              <p className="text-slate-400 text-sm max-w-md">
                Breaking cyber alerts, AI breakthroughs, and major tech stories — delivered every morning. No noise.
              </p>
            </div>

            <div className="w-full lg:w-auto lg:min-w-[400px]">
              {submitted ? (
                <div className="flex items-center gap-3 text-cyan-400 font-medium bg-cyan-400/10 border border-cyan-400/20 rounded-xl px-6 py-4">
                  <span className="text-2xl">✓</span>
                  <div>
                    <p className="font-semibold">You're subscribed!</p>
                    <p className="text-sm text-slate-400">First issue lands tomorrow morning.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="input-cyber pl-10"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex-shrink-0"
                  >
                    {submitting ? 'Subscribing…' : 'Subscribe'}
                    {!submitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              )}
              {error && (
                <p className="text-xs text-red-400 mt-2 text-center lg:text-left">{error}</p>
              )}
              <p className="text-xs text-slate-600 mt-2 text-center lg:text-left">
                Free forever. Unsubscribe anytime. No spam.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="container-site py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg shadow-cyan-500/25 ring-1 ring-white/10">
                <img
                  src="/sabr-logo.png"
                  alt=""
                  className="w-full h-full object-cover"
                  width={40}
                  height={40}
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-black text-lg tracking-tight">SABR</span>
                <span className="text-cyan-400 font-semibold text-[11px] tracking-[0.2em] uppercase -mt-0.5">Cyber & Tech News</span>
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
              Trusted coverage of cybersecurity threats, emerging technology, AI developments, and the stories shaping our digital world. Part of the SABR umbrella — alongside{' '}
              <a
                href={APP_ORIGIN}
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                SABR Learning
              </a>
              .
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="text-sm text-slate-500 hover:text-cyan-400 transition-colors duration-200 inline-flex items-center gap-1"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-slate-500 hover:text-cyan-400 transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04]">
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Copyright + brand-positioning tagline. The tagline sits inline at md+ */}
          {/* with a middle-dot separator; below md, flex-wrap stacks the tagline */}
          {/* under the copyright and the separator hides. Per SPEC-TICKET-001. */}
          <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-x-3 gap-y-1 text-slate-400 text-sm">
            <span>© {new Date().getFullYear()} Sabr Cyber & Tech News. All rights reserved.</span>
            <span aria-hidden="true" className="hidden md:inline">·</span>
            <span className="whitespace-nowrap">Independent coverage. No sponsors.</span>
          </div>
          <div className="flex items-center gap-1 text-slate-700 text-xs">
            <span>Built with</span>
            <span className="text-cyan-600 mx-0.5">♦</span>
            <span>React + Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
