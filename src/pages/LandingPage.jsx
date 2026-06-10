// LandingPage.jsx — Marketing landing page at /
//
// Sections:
//   1. Hero — headline + primary/secondary CTAs
//   2. Trust bar — cert vendor logos
//   3. Features — 4 adaptive-learning differentiators
//   3.5 Network Labs — simulator showcase (terminal mockup + objectives strip)
//   4. Cert showcase — Hero 6 launch certifications
//   5. Pricing — monthly/annual toggle, 3 tiers mirroring live Stripe Ladder M
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
  Network, TerminalSquare, Wrench, Sparkles,
} from 'lucide-react';
import FadeIn from '../components/FadeIn';
import NewsletterSignup from '../components/newsletter/NewsletterSignup';
import { track, EVENTS } from '../lib/analytics';

const APP_ORIGIN = import.meta.env.VITE_APP_ORIGIN || 'https://app.sabr-labs.com';

// ── Trust bar ─────────────────────────────────────────────────────────────────
const VENDORS = [
  { name: 'CompTIA',     color: '#ef4444' },
  { name: 'Cisco',       color: '#1d7bb5' },
  { name: 'HPE Aruba',   color: '#f6821f' },
  { name: 'Juniper',     color: '#84b135' },
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
  { code: '200-301',  name: 'CCNA',       questions: 100, vendor: 'Cisco',   accent: 'text-cyan-400',   border: 'border-cyan-400/20',   bg: 'bg-cyan-400/8' },
  { code: 'HPE6-A86', name: 'Aruba Switching Associate', questions: 100, vendor: 'HPE Aruba', accent: 'text-orange-400', border: 'border-orange-400/20', bg: 'bg-orange-400/8' },
  { code: 'JN0-106',  name: 'JNCIA-Junos', questions: 100, vendor: 'Juniper', accent: 'text-lime-400',  border: 'border-lime-400/20',  bg: 'bg-lime-400/8' },
  { code: '220-1201', name: 'A+ Core 1',  questions: 100, vendor: 'CompTIA', accent: 'text-red-400',    border: 'border-red-400/20',    bg: 'bg-red-400/8' },
  { code: '220-1202', name: 'A+ Core 2',  questions: 100, vendor: 'CompTIA', accent: 'text-red-400',    border: 'border-red-400/20',    bg: 'bg-red-400/8' },
  { code: 'N10-009',  name: 'Network+',   questions: 100, vendor: 'CompTIA', accent: 'text-cyan-400',   border: 'border-cyan-400/20',   bg: 'bg-cyan-400/8' },
  { code: 'SY0-701',  name: 'Security+',  questions: 100, vendor: 'CompTIA', accent: 'text-emerald-400',border: 'border-emerald-400/20',bg: 'bg-emerald-400/8' },
  { code: 'CS0-003',  name: 'CySA+',      questions: 100, vendor: 'CompTIA', accent: 'text-violet-400', border: 'border-violet-400/20', bg: 'bg-violet-400/8' },
  { code: 'PT0-003',  name: 'PenTest+',   questions: 100, vendor: 'CompTIA', accent: 'text-orange-400', border: 'border-orange-400/20', bg: 'bg-orange-400/8' },
];

// ── Pricing ───────────────────────────────────────────────────────────────────
// Prices mirror live Stripe (learning app: src/lib/tiers.ts — Ladder M).
// Annual = 10 × monthly (two months free ≈ 17% off). Every plan starts
// with a 7-day free trial; there is no permanent free tier.
const PRICING = [
  {
    name: 'Starter',
    monthlyPrice: 15,
    annualTotal: 150,
    desc: 'Everything you need to pass.',
    features: [
      'Unlimited practice questions',
      'Unlimited certifications tracked',
      'Full flashcards with spaced repetition',
      'Graded network labs (Aruba, Cisco, Network+)',
      '3 full practice exams / cert / month',
      'Timed exam-sim mode',
      'Community forum',
    ],
    cta: 'Start free trial',
    href: `${APP_ORIGIN}/register`,
    highlight: false,
    badge: null,
  },
  {
    name: 'Pro',
    monthlyPrice: 29,
    annualTotal: 290,
    desc: 'Add AI and deep analytics.',
    features: [
      'Everything in Starter',
      '10 full practice exams / cert / month',
      'AI study companion (why-wrong + explain)',
      'Advanced analytics + weak-area drill',
      'No ads',
    ],
    cta: 'Start free trial',
    href: `${APP_ORIGIN}/register`,
    highlight: true,
    badge: 'Most popular',
  },
  {
    name: 'Premium',
    monthlyPrice: 49,
    annualTotal: 490,
    desc: 'The full toolkit, no limits.',
    features: [
      'Everything in Pro',
      'Unlimited full practice exams',
      'Conversational AI tutor + AI Lab Tutor',
      'Network Sandbox — free-build simulator',
      'AI quiz builder (generative)',
      'Elite profile badge',
    ],
    cta: 'Start free trial',
    href: `${APP_ORIGIN}/register`,
    highlight: false,
    badge: null,
  },
];

// ── Testimonials ─────────────────────────────────────────────────────────────
// Real quotes from real students, not stock content. Add entries as they
// come in — the section auto-switches layout between a centered single-
// card (sparse but deliberate) and a 3-column grid (at 3+ entries).
const TESTIMONIALS = [
  {
    quote: "By far the greatest way to gauge my readiness for a Cert Exam I've seen.",
    name:  'Brandon',
    cert:  'CCNA',
  },
  {
    quote: 'Helped me to get a solid start to my career in Cybersecurity!',
    name:  'Alex',
    cert:  'CompTIA Security+',
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
                <Network className="w-3.5 h-3.5" />
                New — hands-on network labs, right in your browser
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
                Adaptive practice, spaced-repetition flashcards, hands-on network labs
                in a real CLI simulator, and a built-in community forum — all in one
                subscription. Study smarter, not longer.
              </p>
            </FadeIn>

            <FadeIn delay={240}>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`${APP_ORIGIN}/register`}
                  onClick={() => track(EVENTS.HERO_CTA_CLICK, { cta: 'start_free_trial' })}
                  className="btn-primary text-base px-6 py-3"
                  target="_blank"
                  rel="noopener"
                >
                  Start your free trial
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  to="/try"
                  onClick={() => track(EVENTS.HERO_CTA_CLICK, { cta: 'try_free_lab' })}
                  className="btn-ghost text-base px-6 py-3"
                >
                  Try a lab free — no signup
                </Link>
              </div>
              <p className="mt-4 text-xs text-slate-600">
                7-day free trial on every plan. Cancel anytime.
              </p>
            </FadeIn>
          </div>

          {/* stat strip */}
          <FadeIn delay={320}>
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { value: '6',    label: 'Launch certs'   },
                { value: '100+', label: 'Questions each' },
                { value: '21',   label: 'Hands-on labs'  },
                { value: '7-day',label: 'Free trial'     },
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
                Built different from the rest.
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

        </div>
      </section>

      {/* ── 3.5 NETWORK LABS ── */}
      <section id="labs" className="py-20 sm:py-24 border-t border-white/[0.06] scroll-mt-20 relative overflow-hidden">
        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 40% at 80% 20%, rgba(0,212,255,0.07) 0%, transparent 60%)',
          }}
        />
        <div className="container-site relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* copy */}
            <div>
              <FadeIn>
                <div className="section-label mb-4">
                  <TerminalSquare className="w-3.5 h-3.5" />
                  Network Labs — new
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                  Don&rsquo;t just memorize networks.{' '}
                  <span className="text-gradient-cyan">Build them.</span>
                </h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  21 graded, hands-on labs in a full network simulator that runs
                  entirely in your browser — real Aruba CX and Cisco IOS command
                  lines, live topology views, and objectives that check themselves
                  the moment your config works. No downloads, no VMs, no
                  Windows-only desktop apps.
                </p>
              </FadeIn>

              <FadeIn delay={100}>
                <ul className="space-y-3.5 mb-8">
                  {[
                    {
                      icon: CheckCircle2,
                      accent: 'text-emerald-400',
                      text: 'Graded objectives — ping works, trunk carries the VLAN, OSPF reaches Full — checked live against the simulation as you type.',
                    },
                    {
                      icon: Wrench,
                      accent: 'text-amber-400',
                      text: 'Help-desk troubleshooting scenarios for CCNA, Network+, and Aruba tracks: find the planted fault, fix it, watch the objectives flip green.',
                    },
                    {
                      icon: Sparkles,
                      accent: 'text-cyan-400',
                      text: 'Premium adds the open Network Sandbox — free-build with every device — and an AI Lab Tutor that sees your live lab and coaches without spoiling the answer.',
                    },
                  ].map(({ icon: Icon, accent, text }) => (
                    <li key={text} className="flex items-start gap-3">
                      <Icon className={`w-4 h-4 mt-1 flex-shrink-0 ${accent}`} />
                      <span className="text-sm text-slate-400 leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>

              <FadeIn delay={180}>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`${APP_ORIGIN}/network-labs`}
                    onClick={() => track(EVENTS.LABS_CTA_CLICK, { cta: 'explore_labs' })}
                    className="btn-primary px-6 py-3"
                    target="_blank"
                    rel="noopener"
                  >
                    Explore Network Labs
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={`${APP_ORIGIN}/register`}
                    onClick={() => track(EVENTS.LABS_CTA_CLICK, { cta: 'labs_free_trial' })}
                    className="btn-ghost px-6 py-3"
                    target="_blank"
                    rel="noopener"
                  >
                    Try a lab free
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* terminal mockup */}
            <FadeIn delay={140}>
              <div className="card border border-cyan-400/20 overflow-hidden shadow-2xl shadow-cyan-500/5">
                {/* window chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                  <span className="ml-3 text-xs text-slate-500 font-mono">sw1 — Aruba CX 6300M</span>
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-cyan-400">Live lab</span>
                </div>
                {/* terminal body */}
                <div className="p-5 font-mono text-[13px] leading-relaxed bg-[#0a0f1c]">
                  <p className="text-slate-500">sw1# configure</p>
                  <p className="text-slate-500">sw1(config)# interface 1/1/8</p>
                  <p className="text-slate-300">sw1(config-if)# vlan trunk allowed 10,20</p>
                  <p className="text-slate-300">
                    sw1(config-if)# <span className="animate-pulse text-cyan-400">▍</span>
                  </p>
                </div>
                {/* objectives strip */}
                <div className="px-5 py-4 border-t border-white/[0.06] bg-white/[0.02] space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">
                    Objectives — graded live
                  </p>
                  {[
                    { ok: true,  text: 'Trunk carries VLAN 10 across the link' },
                    { ok: true,  text: 'h1 can ping h3 (10.0.10.20)' },
                    { ok: false, text: 'h1 cannot reach VLAN 20 (isolation)' },
                  ].map(({ ok, text }) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                        ok ? 'bg-emerald-400/15 text-emerald-400' : 'bg-white/[0.06] text-slate-600'
                      }`}>
                        {ok ? '✓' : '·'}
                      </span>
                      <span className={`text-xs ${ok ? 'text-slate-300' : 'text-slate-500'}`}>{text}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500">2 of 3 passing</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      Score updates live
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ── 4. CERT SHOWCASE ── */}
      <section id="certifications" className="py-20 sm:py-24 border-t border-white/[0.06] scroll-mt-20">
        <div className="container-site">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="section-label justify-center mb-4">
                <BookOpen className="w-3.5 h-3.5" />
                Launch catalog
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Cisco, Aruba, Juniper + the CompTIA core six.
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                100+ curated MCQs and 120+ flashcards each, cited to the official
                exam objectives — and the networking certs pair with graded labs
                in the simulator. 16 certifications active, more shipping monthly.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LAUNCH_CERTS.map(({ code, name, questions, vendor, accent, border, bg }, i) => (
              <FadeIn key={code} delay={i * 50}>
                <a
                  href={`${APP_ORIGIN}/register`}
                  onClick={() => track(EVENTS.CERT_CARD_CLICK, { cert_code: code, cert_name: name, vendor })}
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
      <section id="pricing" className="py-20 sm:py-24 border-t border-white/[0.06] scroll-mt-20">
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
                    Save 17%
                  </span>
                </button>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {PRICING.map(({ name, monthlyPrice, annualTotal, desc, features, cta, href, highlight, badge }, i) => {
              const displayPrice = annual ? annualTotal : monthlyPrice;
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
                        <span className="text-slate-500 text-sm mb-1">{annual ? '/ yr' : '/ mo'}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {annual ? 'Two months free vs monthly' : `or $${annualTotal} / yr (two months free)`}
                      </p>
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
                      onClick={() => track(EVENTS.PRICING_CTA_CLICK, { tier: name, billing: annual ? 'annual' : 'monthly', price_usd: displayPrice })}
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
              Every plan starts with a 7-day free trial — cancel anytime before it
              ends and you won&rsquo;t be charged.
              <Link to="/refund" className="ml-1.5 text-slate-500 hover:text-slate-400 underline underline-offset-2">
                Refund policy
              </Link>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── 6. TESTIMONIALS ── */}
      <section className="py-20 sm:py-24 border-t border-white/[0.06]">
        <div className="container-site max-w-5xl">
          <FadeIn>
            <div className="text-center mb-10">
              <div className="section-label justify-center mb-4">
                <Star className="w-3.5 h-3.5" />
                What students say
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Early students, real words.
              </h2>
            </div>
          </FadeIn>

          {/* Layout scales with quote count so we never leave an empty grid
              slot: 1 → centered, 2 → 2-col, 3+ → 3-col. */}
          <div
            className={
              TESTIMONIALS.length === 1
                ? 'max-w-2xl mx-auto'
                : TESTIMONIALS.length === 2
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-5'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
            }
          >
            {TESTIMONIALS.map(({ quote, name, cert }, i) => (
              <FadeIn key={`${name}-${cert}`} delay={i * 80}>
                <figure className="card p-8 border border-white/[0.08] hover-glow flex flex-col gap-5 h-full">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-slate-200 leading-relaxed flex-1">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                  <figcaption>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{cert}</p>
                  </figcaption>
                </figure>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={280}>
            <p className="text-center mt-8 text-xs text-slate-600">
              Passed with us? <Link to="/contact" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">Tell us your story</Link> &mdash; we&rsquo;d love to feature you.
            </p>
          </FadeIn>
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
              7-day free trial on every plan. Your first practice session — or
              your first network lab — is four clicks away.
            </p>
            <a
              href={`${APP_ORIGIN}/register`}
              onClick={() => track(EVENTS.BOTTOM_CTA_CLICK, { cta: 'start_free_trial' })}
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
