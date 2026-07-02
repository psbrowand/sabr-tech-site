// ─────────────────────────────────────────────────────────────────────────────
// PracticeIndexPage.jsx — /practice
//
// Hub page linking every per-cert practice-test page. Targets the broad
// "IT certification practice tests" query and distributes internal link
// equity to the individual /practice/:slug pages.
// ─────────────────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Shield, BookOpen, TerminalSquare } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { useSeo } from '../lib/useSeo';
import { CERTS_BY_VENDOR, THEME, APP_ORIGIN } from '../data/certPrep';

// Vendor display order — highest search volume first.
const VENDOR_ORDER = ['CompTIA', 'Cisco', 'AWS', 'Microsoft', 'Google Cloud', 'ISC2', 'HPE Aruba', 'Juniper'];

export default function PracticeIndexPage() {
  useSeo({
    title: 'IT Certification Practice Tests & Exam Questions | Sabr Learning Labs',
    description: 'Free-trial practice tests for CompTIA, Cisco, AWS, Microsoft, Google Cloud, ISC2, Aruba, and Juniper certifications — exam-style questions with full explanations, flashcards, timed exam simulation, and hands-on labs.',
    canonical: 'https://sabr-labs.com/practice',
  });

  const vendors = VENDOR_ORDER.filter((v) => CERTS_BY_VENDOR[v]);

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative py-14 sm:py-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{ background: 'radial-gradient(ellipse 60% 45% at 50% -10%, rgba(0,212,255,0.10) 0%, transparent 60%)' }}
        />
        <div className="container-site relative text-center max-w-3xl mx-auto">
          <FadeIn>
            <div className="section-label justify-center mb-4"><BookOpen className="w-3.5 h-3.5" /> Practice tests</div>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1] mb-5">
              IT certification <span className="text-gradient-cyan">practice tests</span>
            </h1>
          </FadeIn>
          <FadeIn delay={140}>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              Exam-style questions with full explanations, spaced-repetition flashcards, timed
              exam simulation, and hands-on network labs — for {Object.values(CERTS_BY_VENDOR).flat().length}+
              certifications across CompTIA, Cisco, AWS, Microsoft, Google Cloud, ISC2, Aruba, and Juniper.
              One subscription covers them all.
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href={`${APP_ORIGIN}/register?source=practice_index`} className="btn-primary text-base px-6 py-3" target="_blank" rel="noopener">
                Start your free trial <ArrowRight className="w-4 h-4" />
              </a>
              <Link to="/try" className="btn-ghost text-base px-6 py-3">Try a lab free — no signup</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CERT GRID BY VENDOR ── */}
      {vendors.map((vendor, vi) => (
        <section key={vendor} className={vi === 0 ? 'pb-6' : 'py-6'}>
          <div className="container-site">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">{vendor}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CERTS_BY_VENDOR[vendor].map((c, i) => {
                const t = THEME[c.theme] || THEME.cisco;
                return (
                  <FadeIn key={c.slug} delay={i * 40}>
                    <Link to={`/practice/${c.slug}`} className={`card p-5 border ${t.border} hover-glow flex flex-col gap-3 group h-full`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${t.accent} mb-1`}>{c.vendor} · {c.code}</p>
                          <h3 className="text-base font-bold text-white group-hover:text-slate-100">{c.name}</h3>
                        </div>
                        <div className={`w-8 h-8 rounded-lg ${t.bg} flex items-center justify-center flex-shrink-0`}>
                          <Shield className={`w-4 h-4 ${t.accent}`} />
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{c.tagline}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-auto pt-1">
                        <span>{c.pool} questions</span>
                        <span>·</span>
                        <span>{c.flashcards} cards</span>
                        {c.labs && (
                          <>
                            <span>·</span>
                            <span className={`inline-flex items-center gap-1 ${t.accent}`}><TerminalSquare className="w-3 h-3" /> Labs</span>
                          </>
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${t.accent} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        View practice test <ChevronRight className="w-3 h-3" />
                      </span>
                    </Link>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* ── BOTTOM CTA ── */}
      <section className="py-16 mt-6 border-t border-white/[0.06]">
        <div className="container-site text-center">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">One subscription. Every cert.</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm">
              7-day free trial on every plan. Pick your cert and take your first practice exam today.
            </p>
            <a href={`${APP_ORIGIN}/register?source=practice_index_bottom`} className="btn-primary text-base px-7 py-3 inline-flex" target="_blank" rel="noopener">
              Start your free trial <ArrowRight className="w-4 h-4" />
            </a>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
