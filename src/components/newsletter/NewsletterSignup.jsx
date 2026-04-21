// ─────────────────────────────────────────────────────────────────────────────
// NewsletterSignup.jsx — Email capture component
//
// Props:
//   compact  — slim card version for sidebar
//   inline   — flat version for embedding in article body
//   (default) — full hero banner version
//
// Wires the submit to /api/newsletter-subscribe (a Vercel serverless
// function backed by Resend Audiences). The endpoint handles validation,
// rate-limiting, and duplicate-signup idempotency on the server.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Mail, ArrowRight, Zap, Shield, Bell, Cpu } from 'lucide-react';

const perks = [
  { icon: Shield, text: 'Breaking cyber alerts' },
  { icon: Cpu, text: 'AI breakthroughs' },
  { icon: Bell, text: 'Major tech news' },
];

export default function NewsletterSignup({ compact = false, inline = false }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus('loading');
    setErrorMessage('');

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
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  // ── Compact (sidebar) version ─────────────────────────────────────────────
  if (compact) {
    return (
      <div className="card p-5 border-cyan-500/10">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">Daily Briefing</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Cyber alerts, AI news & tech headlines every morning. Free.
        </p>

        {status === 'success' ? (
          <div className="text-center py-2">
            <p className="text-cyan-400 font-semibold text-sm">✓ Subscribed!</p>
            <p className="text-slate-500 text-xs mt-1">See you tomorrow morning.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="input-cyber text-xs py-2.5"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full btn-primary justify-center text-xs py-2.5"
            >
              {status === 'loading' ? 'Subscribing…' : 'Get Free Briefing'}
              {status !== 'loading' && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>
        )}
        <p className="text-[11px] text-slate-700 text-center mt-2">No spam. Unsubscribe anytime.</p>
      </div>
    );
  }

  // ── Inline (end-of-article) version ──────────────────────────────────────
  if (inline) {
    return (
      <div className="rounded-xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="flex-1 text-center sm:text-left">
            <div className="section-label mb-2">
              <Zap className="w-3.5 h-3.5" />
              Stay Informed
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Never Miss a Breaking Story</h3>
            <p className="text-sm text-slate-400">
              Daily digest of the biggest tech & cyber news, curated for professionals.
            </p>
          </div>
          <div className="w-full sm:w-72 flex-shrink-0">
            {status === 'success' ? (
              <div className="text-center py-3">
                <p className="text-cyan-400 font-bold text-base">✓ You're in!</p>
                <p className="text-slate-500 text-xs mt-1">First issue lands tomorrow.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="input-cyber"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full btn-primary justify-center"
                >
                  {status === 'loading' ? 'Subscribing…' : 'Subscribe Free'}
                  {status !== 'loading' && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Full hero banner version ──────────────────────────────────────────────
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1321] via-[#111827] to-[#0d1321] border border-white/[0.07] p-8 sm:p-12 text-center">
      {/* Background glow */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" />

      <div className="relative">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-cyan-500/25">
          <Mail className="w-6 h-6 text-white" />
        </div>

        {/* Heading */}
        <div className="section-label justify-center mb-3">
          <Zap className="w-3.5 h-3.5" />
          Free Newsletter
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Your Daily Intel<br />
          <span className="text-gradient-cyan">Briefing Awaits</span>
        </h2>
        <p className="text-slate-400 text-base max-w-lg mx-auto mb-6">
          Breaking cyber threats, AI breakthroughs, and the biggest tech stories —
          curated by AI and delivered before 5 AM Eastern, every day.
        </p>

        {/* Perks */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {perks.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-6 h-6 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                <Icon className="w-3 h-3 text-cyan-400" />
              </div>
              {text}
            </div>
          ))}
        </div>

        {/* Form */}
        {status === 'success' ? (
          <div className="max-w-sm mx-auto py-4">
            <div className="flex items-center justify-center gap-3 text-cyan-400">
              <span className="text-3xl">✓</span>
              <div className="text-left">
                <p className="font-bold text-lg">You're subscribed!</p>
                <p className="text-sm text-slate-400">First issue arriving tomorrow morning.</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
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
              disabled={status === 'loading'}
              className="btn-primary flex-shrink-0 justify-center"
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe Free'}
              {status !== 'loading' && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        {status === 'error' && errorMessage && (
          <p className="text-xs text-red-400 mt-4">{errorMessage}</p>
        )}

        <p className="text-xs text-slate-600 mt-4">
          Free forever · No spam · Unsubscribe in one click
        </p>
      </div>
    </section>
  );
}
