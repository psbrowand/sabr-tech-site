// LandingPage.jsx — Marketing landing page at /
//
// Sections:
//   1. Hero — headline + primary/secondary CTAs
//   2. Trust bar — cert vendor logos
//   3. Features — 4 adaptive-learning differentiators
//   4. Cert showcase — Hero 6 launch certifications
//   5. Pricing — monthly/annual toggle with 3 tiers
//   6. Testimonials — placeholder cards (fill with real quotes post-launch)
//   7. Lead capture — newsletter signup via Resend
//
// Design: dark bg (#080c18), cyan accent (#00d4ff), Inter font, Tailwind
// Match: index.css design tokens — container-site, btn-primary, btn-ghost, card,
//        hover-glow, section-label, text-gradient-cyan, fade-in-up animation.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Target, BookOpen, Users, BarChart3,
  CheckCircle2, Star, ChevronRight, Shield, Zap,
} from 'lucide-react';
import FadeIn from '../components/FadeIn';
import NewsletterSignup from '../components/newsletter/NewsletterSignup';

const APP_ORIGIN = import.meta.env.VITE_APP_ORIGIN || 'https://app.sabr-labs.com';

// ── Trust bar ─────────────────────────────────────────────────────────────────
const VENDORS = [
  { name: 'CompTIA',     color: '#ef4444' },
  { name: 'Cisco',       color: '#1d7bb5' },
  { name: 'AWS',         color: '#f59e0b' },
  { name: 'Microsoft',   color: '#0ea5e9' },
  { name: 'Google Cloud',color: '#3b82f6' },
  { name: '(ISC)²',      color: '#818cf8' },
];

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Target,
    title: 'Adaptive practice that finds your gaps',
    desc: 'Every answer you submit rebuilds your next session. 70% targeted drill on weak topics, 30% coverage filling. No two sessions are the same.',
    accent: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
  },
  {
    icon: BookOpen,
    title: 'Flashcards + MCQs in one surface',
    desc: 'Spaced-repetition flashcards and timed practice exams share the same progress model. One subscription covers both — no switching between apps.',
    accent: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
    border: 'border-indigo-400/20',
  },
  {
    icon: Users,
    title: 'Built-in forum — no Discord required',
    desc: 'Per-cert discussion sections, moderated threads, and community Q&A baked into the app. The only mid-tier cert platform with its own forum.',
    accent: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
  {
    icon: BarChart3,
    title: 'Analytics that tell you what to fix',
    desc: 'Domain-level accuracy, regression alerts, streak data, and a single Exam Ready score. See exactly how close you are before booking the exam.',
    accent: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
  },
];

// ── Launch certifications ─────────────────────────────────────────────────────
const LAUNCH_CERTS = [
  { code: '220-1101', name: 'A+ Core 1',  questions: 100, vendor: 'CompTIA', accent: 'text-red-400',    border: 'border-red-400/20',    bg: 'bg-red-400/8' },
  { code: '220-1102', name: 'A+ Core 2',  questions: 100, vendor: 'CompTIA', accent: 'text-red-400',    border: 'border-red-400/20',    bg: 'bg-red-400/8' },
  { code: 'N10-009',  name: 'Network+',   questions: 100, vendor: 'CompTIA', accent: 'text-cyan-400',   border: 'border-cyan-400/20',   bg: 'bg-cyan-400/8' },
  { code: 'SY0-701',  name: 'Security+',  questions: 100, vendor: 'CompTIA', accent: 'text-emerald-400',border: 'border-emerald-400/20',bg: 'bg-emerald-400/8' },
  { code: 'CS0-003',  name: 'CySA+',      questions: 100, vendor: 'CompTIA', accent: 'text-violet-400', border: 'border-violet-400/20', bg: 'bg-violet-400/8' },
  { code: 'PT0-003',  name: 'PenTest+',   questions: 100, vendor: 'CompTIA', accent: 'text-orange-400', border: 'border-orange-400/20', bg: 'bg-orange-400/8' },
];

// ── Pricing ───────────────────────────────────────────────────────────────────
const PRICING = [
  {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    annualNote: null,
    desc: 'Get started with no card required.',
    features: [
      '25 questions per day',
      'Flashcard preview (read-only)',
      'Access to 2 certifications',
      'Community forum access',
    ],
    cta: 'Get started free',
    href: `${APP_ORIGIN}/register`,
    highlight: false,
    badge: null,
  },
  {
    name: 'Pro',
    monthlyPrice: 15,
    annualPrice: 10,
    annualNote: '$120 / yr',
    desc: 'Everything you need to pass your next cert.',
    features: [
      'Unlimited questions',
      'Full flashcard tracking + SRS',
      'All 6 launch certifications',
      'Adaptive practice mode',
      'Progress analytics',
      'Community forum (badge)',
    ],
    cta: 'Start free',
    href: `${APP_ORIGIN}/register`,
    highlight: true,
    badge: 'Most popular',
  },
  {
    name: 'Premium',
    monthlyPrice: 22,
    annualPrice: 15,
    annualNote: '$180 / yr',
    desc: 'For serious cert chasers and teams.',
    features: [
      'Everything in Pro',
      'AI study companion',
      'Performance-based questions',
      'Exam Ready score',
      'Early access to new certs',
      'Priority support',
    ],
    cta: 'Start free',
    href: `${APP_ORIGIN}/register`,
    highlight: false,
    badge: null,
  },
];

// ── Testimonial placeholders ──────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: 'The adaptive mode figured out which Security+ domains I was weakest in after about 40 questions and wouldn\'t let me skip them. Passed on the first attempt.',
    name: 'Review coming post-launch',
    cert: 'CompTIA Security+',
  },
  {
    quote: 'Having flashcards and practice exams in the same app with shared progress tracking is something I didn\'t know I needed until I tried it.',
    name: 'Review coming post-launch',
    cert: 'CompTIA Network+',
  },
  {
    quote: 'The built-in forum is the sleeper feature. Found an answer to a CySA+ question I\'d been stuck on in under 10 minutes.',
    name: 'Review coming post-launch',
    cert: 'CompTIA CySA+',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="overflow-x-hidden">

      {/* ── 1. HERO ── */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(0,212,255,0.10) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 90% 80%, rgba(99,102,241,0.07) 0%, transparent 60%)',
          }}
        />

        <div className="container-site relative">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <div className="section-label justify-center mb-6">
                <Shield className="w-3.5 h-3.5" />
                Now in early access — 6 CompTIA certifications
              </div>
            </FadeIn>

            <FadeIn delay={80}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-6">
                Get exam-ready{' '}
                <span className="text-gradient-cyan">faster</span>.
              </h1>
            </FadeIn>

            <FadeIn delay={160}>
              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
                Adaptive practice, spaced-repetition flashcards, and a built-in community
                forum — all in one subscription. Study smarter, not longer.
              </p>
            </FadeIn>

            <FadeIn delay={240}>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`${APP_ORIGIN}/register`}
                  className="btn-primary text-base px-6 py-3"
                  target="_blank"
                  rel="noopener"
                >
                  Start for free
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link to="/learning" className="btn-ghost text-base px-6 py-3">
                  Explore certifications
                </Link>
              </div>
              <p className="mt-4 text-xs text-slate-600">
                No credit card required. Free plan available.
              </p>
            </FadeIn>
          </div>

          {/* stat strip */}
          <FadeIn delay={320}>
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { value: '6',    label: 'Launch certs'  },
                { value: '100+', label: 'Questions each' },
                { value: '120+', label: 'Flashcards each'},
                { value: '$0',   label: 'To start'       },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 2. VENDOR TRUST BAR ── */}
      <section className="border-y border-white/[0.06] py-8">
        <div className="container-site">
          <p className="text-center text-xs text-slate-600 uppercase tracking-widest font-semibold mb-6">
            Certifications from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {VENDORS.map(({ name, color }) => (
              <span
                key={name}
                className="text-sm font-bold tracking-wide transition-opacity duration-200"
                style={{ color, opacity: 0.7 }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURES ── */}
      <section className="py-20 sm:py-24">
        <div className="container-site">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="section-label justify-center mb-4">
                <Zap className="w-3.5 h-3.5" />
                Why Sabr
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Built different from Pocket Prep.
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                No off-topic questions. No one-size-fits-all drills. No scattered tools.
                One subscription that adapts to your weak spots.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, accent, bg, border }, i) => (
              <FadeIn key={title} delay={i * 60}>
                <div className={`card p-6 border ${border} hover-glow h-full`}>
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${accent}`} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* competition comparison strip */}
          <FadeIn delay={280}>
            <div className="mt-10 rounded-2xl border border-white/[0.06] bg-[#0d1321] overflow-hidden">
              <div className="grid grid-cols-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-white/[0.06] px-4 py-3">
                <span className="text-left">Feature</span>
                <span>Pocket Prep</span>
                <span>MeasureUp</span>
                <span className="text-cyan-400">Sabr</span>
              </div>
              {[
                ['Adaptive practice',      false, true,  true ],
                ['Flashcards + MCQs',      true,  false, true ],
                ['Built-in forum',         false, false, true ],
                ['Performance questions',  false, true,  true ],
                ['Single subscription',    true,  false, true ],
                ['Questions cited by source', false, true,  true ],
              ].map(([label, pocket, measure, sabr]) => (
                <div
                  key={label}
                  className="grid grid-cols-4 text-center text-xs px-4 py-3 border-b border-white/[0.04] last:border-0"
                >
                  <span className="text-left text-slate-400">{label}</span>
                  <span>{pocket  ? '✓' : <span className="text-slate-700">—</span>}</span>
                  <span>{measure ? '✓' : <span className="text-slate-700">—</span>}</span>
                  <span className="text-cyan-400 font-bold">{sabr ? '✓' : '—'}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 4. CERT SHOWCASE ── */}
      <section className="py-20 sm:py-24 border-t border-white/[0.06]">
        <div className="container-site">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="section-label justify-center mb-4">
                <BookOpen className="w-3.5 h-3.5" />
                Launch catalog
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                6 fully-polished certifications at launch.
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                100 curated MCQs + 120 flashcards each. More certifications shipping
                monthly — browse the full catalog in the app.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LAUNCH_CERTS.map(({ code, name, questions, vendor, accent, border, bg }, i) => (
              <FadeIn key={code} delay={i * 50}>
                <a
                  href={`${APP_ORIGIN}/register`}
                  target="_blank"
                  rel="noopener"
                  className={`card p-5 border ${border} hover-glow flex flex-col gap-3 group`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${accent} mb-1`}>
                        {vendor} · {code}
                      </p>
                      <h3 className="text-base font-bold text-white group-hover:text-slate-100">
                        {name}
                      </h3>
                    </div>
                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                      <Shield className={`w-4 h-4 ${accent}`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{questions}+ questions</span>
                    <span>·</span>
                    <span>120+ flashcards</span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                    Start studying
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={320}>
            <p className="text-center mt-6 text-sm text-slate-600">
              More certifications added every month.{' '}
              <Link to="/learning" className="text-cyan-400 hover:text-cyan-300">
                See the full roadmap →
              </Link>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── 5. PRICING ── */}
      <section className="py-20 sm:py-24 border-t border-white/[0.06]">
        <div className="container-site">
          <FadeIn>
            <div className="text-center mb-10">
              <div className="section-label justify-center mb-4">
                <Star className="w-3.5 h-3.5" />
                Pricing
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Simple, honest pricing.
              </h2>
              <p className="text-slate-400 mb-6">
                One subscription covers every certification. No per-cert upsells.
              </p>

              {/* billing toggle */}
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#0d1321] px-2 py-1.5">
                <button
                  onClick={() => setAnnual(false)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    !annual ? 'bg-white text-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setAnnual(true)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    annual ? 'bg-white text-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Annual
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors duration-200 ${
                    annual ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    Save 33%
                  </span>
                </button>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {PRICING.map(({ name, monthlyPrice, annualPrice, annualNote, desc, features, cta, href, highlight, badge }, i) => {
              const displayPrice = annual ? annualPrice : monthlyPrice;
              return (
                <FadeIn key={name} delay={i * 80}>
                  <div className={`card p-6 border flex flex-col h-full relative ${
                    highlight
                      ? 'border-cyan-400/40 bg-gradient-to-b from-cyan-400/5 to-transparent'
                      : 'border-white/[0.08]'
                  }`}>
                    {badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-cyan-400 text-black text-[10px] font-black uppercase tracking-wide px-3 py-1 rounded-full whitespace-nowrap">
                          {badge}
                        </span>
                      </div>
                    )}

                    <div className="mb-5">
                      <h3 className="text-base font-bold text-white mb-1">{name}</h3>
                      <p className="text-xs text-slate-500 mb-4">{desc}</p>
                      <div className="flex items-end gap-1.5">
                        <span className="text-4xl font-black text-white">
                          ${displayPrice}
                        </span>
                        {displayPrice > 0 && (
                          <span className="text-slate-500 text-sm mb-1">/ mo</span>
                        )}
                      </div>
                      {annual && annualNote && (
                        <p className="text-xs text-slate-600 mt-1">Billed {annualNote}</p>
                      )}
                    </div>

                    <ul className="space-y-2.5 mb-6 flex-1">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${highlight ? 'text-cyan-400' : 'text-emerald-400'}`} />
                          <span className="text-xs text-slate-400">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={href}
                      target="_blank"
                      rel="noopener"
                      className={`text-center text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 ${
                        highlight
                          ? 'bg-[#00d4ff] text-black hover:bg-cyan-300'
                          : 'btn-ghost w-full justify-center'
                      }`}
                    >
                      {cta}
                    </a>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn delay={280}>
            <p className="text-center mt-6 text-xs text-slate-600">
              All plans include a 7-day money-back guarantee.
              <Link to="/refund" className="ml-1.5 text-slate-500 hover:text-slate-400 underline underline-offset-2">
                Refund policy
              </Link>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── 6. TESTIMONIALS ── */}
      <section className="py-20 sm:py-24 border-t border-white/[0.06]">
        <div className="container-site">
          <FadeIn>
            <div className="text-center mb-10">
              <div className="section-label justify-center mb-4">
                <Star className="w-3.5 h-3.5" />
                What students say
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Real results, real people.
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ quote, name, cert }, i) => (
              <FadeIn key={cert} delay={i * 80}>
                <div className="card p-6 border border-white/[0.08] hover-glow flex flex-col gap-4 h-full">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed flex-1 italic">
                    &ldquo;{quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">{name}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{cert}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. LEAD CAPTURE / NEWSLETTER ── */}
      <section className="py-20 sm:py-24 border-t border-white/[0.06]">
        <div className="container-site max-w-2xl">
          <FadeIn>
            <div className="text-center mb-8">
              <div className="section-label justify-center mb-4">
                <BookOpen className="w-3.5 h-3.5" />
                Stay in the loop
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                Cert-exam updates in your inbox.
              </h2>
              <p className="text-slate-400 text-sm">
                Exam-code changes, new cert launches, and weekly study tips.
                No spam — unsubscribe anytime.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <NewsletterSignup />
          </FadeIn>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-16 border-t border-white/[0.06]">
        <div className="container-site text-center">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
              Ready to start?
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm">
              Free plan. No credit card. Your first practice session is four clicks away.
            </p>
            <a
              href={`${APP_ORIGIN}/register`}
              className="btn-primary text-base px-7 py-3 inline-flex"
              target="_blank"
              rel="noopener"
            >
              Create free account
              <ArrowRight className="w-4 h-4" />
            </a>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
