import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';

// ─── Hero trust bullets — shown below the CTAs ───────────────────────
const BULLETS = [
  'Fully Managed Networking',
  '24/7 Monitoring & Alerting',
  'Local Deployment & Support',
  'Security Visibility & Log Monitoring',
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center hero-bg overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Ambient glow orbs (purely decorative) ──────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-cyan-500/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-48 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 flex flex-col lg:flex-row items-center gap-16">

        {/* ── Left column: copy ──────────────────────────────────────── */}
        <div className="flex-1 text-center lg:text-left">

          {/* Eyebrow label */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-slow" />
            North Idaho &amp; Eastern Washington
          </div>

          {/* Main headline */}
          {/* ── Update headline copy here ── */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-50 leading-[1.08] mb-6 animate-fade-up">
            Modern Networks.{' '}
            <br className="hidden sm:block" />
            <span className="gradient-text">Local Support.</span>
            <br />
            Peace&nbsp;of&nbsp;Mind.
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
            Sabr Technologies designs, deploys, and manages enterprise-grade network
            infrastructure for businesses, schools, and organizations across North Idaho
            and Eastern Washington — so you can focus on what you do best.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10 animate-fade-up" style={{ animationDelay: '200ms' }}>
            {/* ── Update href targets / link to form fields as needed ── */}
            <a href="#contact" className="btn-primary text-sm px-7 py-3.5">
              Request a Consultation
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#contact" className="btn-ghost text-sm px-6 py-3.5">
              Get a Quote
            </a>
            <a href="#contact" className="btn-ghost text-sm px-6 py-3.5">
              Schedule a Site Survey
            </a>
          </div>

          {/* Trust bullets */}
          <ul className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 animate-fade-up" style={{ animationDelay: '300ms' }}>
            {BULLETS.map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-sm text-slate-400">
                <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right column: visual card ───────────────────────────────── */}
        <div className="flex-shrink-0 w-full max-w-sm lg:max-w-md xl:max-w-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="relative rounded-2xl border border-white/8 bg-navy-800/60 backdrop-blur-sm p-6 shadow-2xl">

            {/* Card header */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Network Health</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
                All Systems Nominal
              </span>
            </div>

            {/* Mock status rows */}
            {[
              { label: 'Core Switching',         status: 'Healthy',    color: 'text-emerald-400', bar: 'bg-emerald-500', pct: '98%' },
              { label: 'Firewall / Edge',         status: 'Healthy',    color: 'text-emerald-400', bar: 'bg-emerald-500', pct: '100%' },
              { label: 'Wireless Infrastructure', status: 'Healthy',    color: 'text-emerald-400', bar: 'bg-cyan-500',    pct: '94%' },
              { label: 'Security Monitoring',     status: 'Active',     color: 'text-cyan-400',    bar: 'bg-cyan-500',    pct: '100%' },
              { label: 'WAN / Internet Link',     status: 'Healthy',    color: 'text-emerald-400', bar: 'bg-emerald-500', pct: '97%' },
            ].map(({ label, status, color, bar, pct }) => (
              <div key={label} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-300">{label}</span>
                  <span className={`text-xs font-medium ${color}`}>{status}</span>
                </div>
                <div className="h-1.5 w-full bg-navy-700 rounded-full overflow-hidden">
                  <div className={`h-full ${bar} rounded-full`} style={{ width: pct }} />
                </div>
              </div>
            ))}

            {/* Alert row */}
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-500">Last checked</span>
              <span className="text-xs text-slate-400">Just now · 24/7 Monitoring Active</span>
            </div>

            {/* Decorative glow border on card */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-cyan-500/10" />
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1 text-slate-600">
        <ChevronRight className="w-4 h-4 rotate-90 animate-bounce" />
      </div>
    </section>
  );
}
