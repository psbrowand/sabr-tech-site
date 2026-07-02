// ─────────────────────────────────────────────────────────────────────────────
// CertPrepPage.jsx — Per-certification landing page at /practice/:slug
//
// Keyword-targeted, conversion-focused page for a single certification. Ranks
// for "<cert> practice test / practice questions / exam questions" searches
// and funnels high-intent visitors into a free trial. Content is data-driven
// from src/data/certPrep.js; SEO head + JSON-LD (Course + FAQPage) are set
// client-side here and prerendered statically by scripts/prerender.mjs.
// ─────────────────────────────────────────────────────────────────────────────

import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, ChevronRight, Shield, Clock, FileText,
  BarChart3, GraduationCap, ExternalLink, TerminalSquare, BookOpen,
  Layers, Sparkles, HelpCircle,
} from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { useSeo } from '../lib/useSeo';
import { track, EVENTS } from '../lib/analytics';
import { CERTS, CERTS_BY_SLUG, THEME, APP_ORIGIN, allFaqs } from '../data/certPrep';

const SITE = 'https://sabr-labs.com';

function metaFor(cert) {
  const labs = cert.labs ? ', plus hands-on labs' : '';
  return {
    title: `${cert.name} Practice Test — ${cert.pool} ${cert.code} Exam Questions | Sabr`,
    description: `${cert.name} (${cert.code}) practice tests and exam questions with full explanations, cited to the official objectives${labs}. ${cert.pool} questions, ${cert.flashcards} flashcards, timed exam simulation, and a 7-day free trial.`,
    canonical: `${SITE}/practice/${cert.slug}`,
  };
}

export default function CertPrepPage() {
  const { slug } = useParams();
  const cert = CERTS_BY_SLUG[slug];

  // useSeo must run every render (hooks rule) — call it with safe values,
  // then bail to 404 for an unknown slug.
  const meta = cert ? metaFor(cert) : {};
  useSeo(meta);

  if (!cert) return <Navigate to="/practice" replace />;

  const t = THEME[cert.theme] || THEME.cisco;
  const regHref = `${APP_ORIGIN}/register?source=cert_${cert.slug}`;

  // Related certs: same vendor first, then fill to 3 with others.
  const related = [
    ...CERTS.filter((c) => c.vendor === cert.vendor && c.slug !== cert.slug),
    ...CERTS.filter((c) => c.vendor !== cert.vendor),
  ].slice(0, 3);

  const included = [
    { icon: FileText, title: `${cert.pool} practice questions`, desc: 'Scenario-based, four options, every one cited to the official exam objectives with a full explanation of why each answer is right or wrong.' },
    { icon: Clock, title: 'Timed exam simulation', desc: `Full-length practice exams that mirror the real ${cert.code} timing and objective weighting, plus an untimed study mode.` },
    { icon: Layers, title: `${cert.flashcards} flashcards`, desc: 'Spaced-repetition flashcards that share one progress model with your practice tests — study and test in one place.' },
    { icon: BarChart3, title: 'Weak-area analytics', desc: 'Domain-level accuracy, regression alerts, and a single Exam Ready score so you know exactly what to fix before you book.' },
    ...(cert.labs
      ? [{ icon: TerminalSquare, title: 'Hands-on graded labs', desc: 'Configure real devices in a browser network simulator with objectives that grade themselves live — no downloads or VMs.' }]
      : [{ icon: Sparkles, title: 'AI study companion', desc: 'On Pro and Premium, an AI companion explains why you missed a question and coaches your next step (available across the catalog).' }]),
    { icon: BookOpen, title: 'One subscription, every cert', desc: 'Your plan covers this certification and every other in the catalog — no per-cert upsells, ever.' },
  ];

  return (
    <div className="overflow-x-hidden">

      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="container-site pt-6">
        <ol className="flex items-center gap-2 text-xs text-slate-500">
          <li><Link to="/" className="hover:text-slate-300">Home</Link></li>
          <li><ChevronRight className="w-3 h-3" /></li>
          <li><Link to="/practice" className="hover:text-slate-300">Practice Tests</Link></li>
          <li><ChevronRight className="w-3 h-3" /></li>
          <li className="text-slate-300 font-medium">{cert.name}</li>
        </ol>
      </nav>

      {/* ── HERO ── */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{ background: 'radial-gradient(ellipse 60% 45% at 50% -10%, rgba(0,212,255,0.08) 0%, transparent 60%)' }}
        />
        <div className="container-site relative">
          <div className="max-w-3xl">
            <FadeIn>
              <div className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest ${t.accent} mb-4`}>
                <span className={`w-7 h-7 rounded-lg ${t.bg} flex items-center justify-center`}>
                  <Shield className="w-3.5 h-3.5" />
                </span>
                {cert.vendor} · {cert.code}
              </div>
            </FadeIn>
            <FadeIn delay={80}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] mb-4">
                {cert.name} Practice Test <span className="text-gradient-cyan">&amp; Exam Questions</span>
              </h1>
            </FadeIn>
            <FadeIn delay={140}>
              <p className="text-lg text-slate-400 leading-relaxed mb-6">{cert.tagline}</p>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={regHref}
                  onClick={() => track(EVENTS.PRICING_CTA_CLICK, { cta: 'cert_free_trial', cert_code: cert.code })}
                  className="btn-primary text-base px-6 py-3"
                  target="_blank"
                  rel="noopener"
                >
                  Start your free trial
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link to="/try" className="btn-ghost text-base px-6 py-3">
                  Try a lab free — no signup
                </Link>
              </div>
              <p className="mt-3 text-xs text-slate-600">7-day free trial · one subscription covers every cert · cancel anytime.</p>
            </FadeIn>

            {/* stat chips */}
            <FadeIn delay={260}>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { v: cert.pool, l: 'Practice questions' },
                  { v: cert.flashcards, l: 'Flashcards' },
                  { v: cert.exam.questions, l: 'On the real exam' },
                  ...(cert.labs ? [{ v: 'Yes', l: 'Hands-on labs' }] : []),
                ].map(({ v, l }) => (
                  <div key={l} className={`card px-4 py-3 border ${t.border}`}>
                    <p className="text-lg font-black text-white leading-none">{v}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{l}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── INTRO + EXAM FACTS ── */}
      <section className="py-12 border-t border-white/[0.06]">
        <div className="container-site grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10">
          <FadeIn>
            <div>
              <div className="section-label mb-3"><GraduationCap className="w-3.5 h-3.5" /> About the exam</div>
              <h2 className="text-2xl font-black text-white mb-4">What is the {cert.name} ({cert.code})?</h2>
              <p className="text-slate-400 leading-relaxed">{cert.intro}</p>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className={`card p-6 border ${t.border}`}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4">Exam at a glance</p>
              <dl className="space-y-3 text-sm">
                {[
                  ['Questions', cert.exam.questions],
                  ['Duration', cert.exam.duration],
                  ['Format', cert.exam.format],
                  ['Level', cert.exam.level],
                  ['Renewal', cert.exam.renewal],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-4 border-b border-white/[0.05] pb-3 last:border-0 last:pb-0">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="text-slate-200 font-medium text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={cert.official}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300"
              >
                Official {cert.vendor} exam page
                <ExternalLink className="w-3 h-3" />
              </a>
              <p className="mt-3 text-[11px] text-slate-600 leading-relaxed">
                Exam fees and passing scores vary by region and can change — confirm current details on the official page.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── DOMAIN BREAKDOWN ── */}
      <section className="py-12 border-t border-white/[0.06]">
        <div className="container-site">
          <FadeIn>
            <div className="section-label mb-3"><Layers className="w-3.5 h-3.5" /> Exam domains</div>
            <h2 className="text-2xl font-black text-white mb-2">What the {cert.code} covers</h2>
            <p className="text-slate-400 mb-8 max-w-2xl text-sm">
              Our practice pool is weighted to the official blueprint, so your study time matches where the exam spends its points.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-4xl">
            {cert.domains.map((d, i) => (
              <FadeIn key={d.name} delay={i * 40}>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-300 font-medium">{d.name}</span>
                    {typeof d.weight === 'number' && (
                      <span className={`text-xs font-bold ${t.accent}`}>{d.weight}%</span>
                    )}
                  </div>
                  {typeof d.weight === 'number' ? (
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className={`h-full rounded-full ${t.bar}`} style={{ width: `${d.weight}%` }} />
                    </div>
                  ) : (
                    <div className="h-px bg-white/[0.06]" />
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="py-12 border-t border-white/[0.06]">
        <div className="container-site">
          <FadeIn>
            <div className="section-label mb-3"><CheckCircle2 className="w-3.5 h-3.5" /> What you get</div>
            <h2 className="text-2xl font-black text-white mb-8">Everything you need to pass {cert.name}</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {included.map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 50}>
                <div className={`card p-5 border ${t.border} hover-glow h-full`}>
                  <div className={`w-9 h-9 rounded-lg ${t.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-4.5 h-4.5 ${t.accent}`} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-12 border-t border-white/[0.06]">
        <div className="container-site max-w-3xl">
          <FadeIn>
            <div className="section-label mb-3"><HelpCircle className="w-3.5 h-3.5" /> FAQ</div>
            <h2 className="text-2xl font-black text-white mb-8">{cert.name} — common questions</h2>
          </FadeIn>
          <div className="space-y-4">
            {allFaqs(cert).map(({ q, a }, i) => (
              <FadeIn key={q} delay={i * 40}>
                <details className="card p-5 border border-white/[0.08] group">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="text-sm font-semibold text-slate-200 pr-4">{q}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 group-open:rotate-90" />
                  </summary>
                  <p className="text-sm text-slate-400 leading-relaxed mt-3">{a}</p>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED CERTS ── */}
      <section className="py-12 border-t border-white/[0.06]">
        <div className="container-site">
          <FadeIn>
            <h2 className="text-xl font-black text-white mb-6">Related certifications</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((rc, i) => {
              const rt = THEME[rc.theme] || THEME.cisco;
              return (
                <FadeIn key={rc.slug} delay={i * 50}>
                  <Link to={`/practice/${rc.slug}`} className={`card p-5 border ${rt.border} hover-glow flex flex-col gap-2 group`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${rt.accent}`}>{rc.vendor} · {rc.code}</p>
                    <h3 className="text-sm font-bold text-white group-hover:text-slate-100">{rc.name}</h3>
                    <p className="text-xs text-slate-500">{rc.pool} questions · {rc.flashcards} flashcards</p>
                    <span className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${rt.accent} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      View practice test <ChevronRight className="w-3 h-3" />
                    </span>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
          <FadeIn delay={200}>
            <p className="mt-6 text-sm text-slate-500">
              <Link to="/practice" className="text-cyan-400 hover:text-cyan-300">See all practice tests →</Link>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-16 border-t border-white/[0.06]">
        <div className="container-site text-center">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Ready to pass {cert.name}?</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm">
              Start a 7-day free trial and take your first {cert.code} practice exam today — one subscription covers every cert in the catalog.
            </p>
            <a
              href={regHref}
              onClick={() => track(EVENTS.BOTTOM_CTA_CLICK, { cta: 'cert_free_trial', cert_code: cert.code })}
              className="btn-primary text-base px-7 py-3 inline-flex"
              target="_blank"
              rel="noopener"
            >
              Start your free trial
              <ArrowRight className="w-4 h-4" />
            </a>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
