// ─────────────────────────────────────────────────────────────────────────────
// AIHero.jsx — Apex homepage AI-first hero (SAB-100 / SAB-93.C1)
//
// Draft status: copy pending CEO belief-check on SAB-100. Currently shipping
// Option B (citation-forward) as the safe default closest to the ticket's own
// framing example. If the CEO picks Option A (refusal-forward) or C (show-its-
// work), only HEADLINE/SUB strings change.
// ─────────────────────────────────────────────────────────────────────────────
import { ArrowRight, FileCheck2, ShieldQuestion } from 'lucide-react';

// Headline / sub / supporting — isolated so CEO edits do not touch layout.
const HEADLINE_LINE_1 = 'An AI study companion';
const HEADLINE_LINE_2 = 'that cites every answer.';

const SUB =
  'It quizzes you on the domains you need, rewords an explanation that didn’t land, and shows you why your pick was wrong. Every response links back to the section of the official exam objectives it came from.';

const SUPPORTING =
  'Built for working learners preparing for CompTIA Net+, Security+, and CySA+ — more certifications as we finish ingesting them.';

export default function AIHero() {
  return (
    <section
      id="ai-hero"
      aria-labelledby="ai-hero-heading"
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d1321] px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20"
    >
      {/* Ambient, purely decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[480px] rounded-full blur-3xl"
        style={{ background: 'rgba(var(--accent-rgb), 0.05)' }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
        {/* Copy column */}
        <div>
          <div className="section-label mb-5">AI Study Companion</div>

          <h1
            id="ai-hero-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-50 leading-[1.1]"
          >
            {HEADLINE_LINE_1}
            <br className="hidden sm:block" />
            <span className="text-gradient-cyan">{HEADLINE_LINE_2}</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            {SUB}
          </p>

          <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-2xl">
            {SUPPORTING}
          </p>

          {/* CTAs — both resolve safely. No pricing claims. */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#ai-companion" className="btn-primary">
              See how it works
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="https://app.sabr-labs.com/"
              className="btn-ghost"
              rel="noopener"
            >
              Open the study app
            </a>
          </div>
        </div>

        {/* Visual column — placeholder card for Designer to replace with
            the 30-second demo loop (Lottie / MP4 / animated SVG). Keeps
            the hero visually balanced without claiming behavior we haven't
            yet shipped visuals for. */}
        <figure
          className="relative rounded-2xl border border-white/[0.08] bg-[#111827] p-5 shadow-2xl"
          aria-label="Example of a cited AI answer"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Example: why-wrong
            </span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <FileCheck2 className="w-3.5 h-3.5" aria-hidden="true" />
              Grounded
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            You picked <span className="font-mono text-slate-100">B. NAT overload</span>.
            That’s wrong here because the scenario specifies <em>a single public
            IP mapped to a single private host</em>, which is static NAT — not
            address translation at scale.
          </p>

          <div className="rounded-lg bg-[#0d1321] border border-white/[0.04] px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
              Source
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              CompTIA Network+ N10-009 Exam Objectives · Section 2.2 — IP
              Addressing (NAT variants).
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center gap-2 text-xs text-slate-500">
            <ShieldQuestion className="w-3.5 h-3.5" aria-hidden="true" />
            <span>If the companion can’t ground its answer, it refuses instead.</span>
          </div>

          <figcaption className="sr-only">
            Illustrative mock of a why-wrong response citing the official
            CompTIA Network+ objective PDF.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
