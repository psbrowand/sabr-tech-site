// ─────────────────────────────────────────────────────────────────────────────
// AICompanionSection.jsx — Mid-page explainer for the three endpoints
// (quiz-me, explain-differently, why-wrong) + cited-vs-refused callout
// + under-promise block.
//
// SAB-100 / SAB-93.C1. Copy pending CEO belief-check.
// Every claim here traces to actual endpoint behavior in app.sabr-labs.com:
//   - quiz-me           → src/app/api/ai/quiz-me/route.ts
//   - explain-differently → src/app/api/ai/explain-differently/route.ts
//   - why-wrong         → src/app/api/ai/why-wrong/route.ts
// ─────────────────────────────────────────────────────────────────────────────
import {
  Sparkles,
  MessageSquareText,
  HelpCircle,
  FileCheck2,
  ShieldQuestion,
} from 'lucide-react';

const ENDPOINTS = [
  {
    id: 'quiz-me',
    icon: Sparkles,
    kicker: '“Quiz me on this.”',
    body:
      'Pick a certification and a domain. Ask for a batch of practice questions — up to ten at a time. The companion pulls from the sections of the official objective PDF that cover the domain, and builds the quiz from what’s on the exam, not from general web knowledge. If we haven’t ingested the objective for that domain yet, it tells you so.',
  },
  {
    id: 'explain-differently',
    icon: MessageSquareText,
    kicker: '“Explain that differently.”',
    body:
      'When a rationale doesn’t land, ask for it in simpler wording, as a single-sentence TL;DR, or as an analogy that connects the concept to something you already know. This is the one feature that rephrases rather than re-cites — it’s for the moment you understood the mechanism but the wording got in the way.',
  },
  {
    id: 'why-wrong',
    icon: HelpCircle,
    kicker: '“Why was I wrong?”',
    body:
      'After a multiple-choice miss, ask why the distractor you picked was wrong. The companion retrieves the paragraphs of the exam objective PDF that address your specific pick, and shows its work — which sections it used, what they say, why your choice contradicts them. If it can’t ground the explanation against the source material, it refuses to answer and sends you back to the reading.',
  },
];

const LIMITS = [
  'Reason about full PBQ performance-based scenarios — MCQs and their rationales only, for now.',
  'Answer questions outside the certification objectives you’re actively studying.',
  'Guarantee perfect correctness. If you spot an answer you think is wrong, flag it — we review flagged questions publicly on a timeline.',
];

function EndpointBlock({ icon: Icon, kicker, body, id }) {
  return (
    <article
      id={id}
      className="card p-6 sm:p-7 flex flex-col gap-4"
      aria-labelledby={`${id}-kicker`}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="w-9 h-9 rounded-lg flex items-center justify-center border"
          style={{
            background: 'rgba(var(--accent-rgb), 0.08)',
            borderColor: 'rgba(var(--accent-rgb), 0.25)',
          }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color: 'var(--accent)' }} />
        </span>
        <h3
          id={`${id}-kicker`}
          className="text-lg font-bold text-slate-50 leading-snug"
        >
          {kicker}
        </h3>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{body}</p>
    </article>
  );
}

export default function AICompanionSection() {
  return (
    <section
      id="ai-companion"
      aria-labelledby="ai-companion-heading"
      className="py-14 sm:py-16"
    >
      {/* Section heading */}
      <div className="mb-8 max-w-3xl">
        <div className="section-label mb-3">What it actually does</div>
        <h2
          id="ai-companion-heading"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-50 leading-tight"
        >
          Three specific questions a serious studier asks during prep.
        </h2>
        <p className="mt-4 text-base text-slate-400 leading-relaxed">
          Sabr’s AI companion is built to answer exactly those three — and
          nothing beyond them.
        </p>
      </div>

      {/* Three endpoint cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ENDPOINTS.map((e) => (
          <EndpointBlock key={e.id} {...e} />
        ))}
      </div>

      {/* Cited / refused callout */}
      <aside
        aria-labelledby="cited-callout-heading"
        className="mt-10 rounded-2xl border p-6 sm:p-8 flex flex-col sm:flex-row gap-5 sm:items-start"
        style={{
          background: 'rgba(var(--accent-rgb), 0.05)',
          borderColor: 'rgba(var(--accent-rgb), 0.20)',
        }}
      >
        <span
          aria-hidden="true"
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(var(--accent-rgb), 0.12)',
            border: '1px solid rgba(var(--accent-rgb), 0.25)',
          }}
        >
          <FileCheck2 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        </span>
        <div>
          <h3
            id="cited-callout-heading"
            className="text-lg sm:text-xl font-bold text-slate-50 leading-snug"
          >
            Cited, or not answered at all.
          </h3>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Every grounded response links to the exact section of the official
            CompTIA objective PDF it drew from. When retrieval confidence is
            too low, the companion refuses to write an answer. That’s the line
            between a study tool and an autocomplete.
          </p>
        </div>
      </aside>

      {/* Under-promise block — required by SAB-100 belief checkpoint #3 */}
      <div className="mt-6 rounded-2xl border border-white/[0.06] bg-[#0d1321] p-6 sm:p-7">
        <div className="flex items-center gap-2 mb-3">
          <ShieldQuestion
            className="w-4 h-4 text-slate-400"
            aria-hidden="true"
          />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
            What the companion can’t do yet
          </h3>
        </div>
        <ul className="space-y-2">
          {LIMITS.map((line) => (
            <li
              key={line}
              className="text-sm text-slate-400 leading-relaxed flex gap-2"
            >
              <span aria-hidden="true" className="text-slate-600 mt-0.5">–</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cert-scope footnote — specific names belong here, not in the hero.
          slate-400 (not 500) to stay at the WCAG-AA floor established by
          846fa75 for muted text on the page bg. */}
      <p className="mt-6 text-xs text-slate-400 leading-relaxed">
        Supported today on CompTIA Network+, Security+, and CySA+ — more
        certifications as we finish ingesting the official objectives.
      </p>
    </section>
  );
}
