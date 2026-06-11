// ComparePage.jsx — /compare/:competitor comparison landing pages.
//
// Targets high-intent searches ("Boson NetSim alternative", "Packet Tracer
// alternative"). Legal guardrails (nominative fair use): every claim about
// the competitor is factual and verifiable against their own site, no
// competitor logos, and an explicit non-affiliation disclaimer at the
// bottom. Facts verified June 2026 — re-check vendor pricing when editing.

import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, XCircle, MinusCircle, Terminal, Scale,
} from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { useSeo } from '../lib/useSeo';
import { track, EVENTS } from '../lib/analytics';

const APP_ORIGIN = import.meta.env.VITE_APP_ORIGIN || 'https://app.sabr-labs.com';

// cell values: true (yes), false (no), or a string (nuanced answer)
const COMPETITORS = {
  'boson-netsim': {
    name: 'Boson NetSim',
    title: 'Boson NetSim Alternative — Multi-Vendor Network Labs in Your Browser',
    description:
      'Comparing Boson NetSim and Sabr Learning Labs for cert prep? An honest, factual side-by-side: vendors covered, pricing model, what each subscription includes, and who each tool actually fits.',
    intro: [
      'Boson NetSim is one of the most established Cisco exam simulators around, and it earned that reputation: deep, exam-aligned Cisco labs with real grading. If you\'re comparing it with Sabr Learning Labs, the honest answer is that the two tools overlap on graded Cisco practice and differ on almost everything around it.',
      'The short version: NetSim goes deep on Cisco, one licensed exam track at a time. Sabr goes wide — graded simulator labs for Cisco, Aruba, and Juniper plus full exam prep (practice exams, flashcards, performance-based questions) across 17 certifications, in one subscription.',
    ],
    rows: [
      { feature: 'Runs in the browser, no install', them: true, us: true },
      { feature: 'Graded, exam-aligned labs', them: true, us: true },
      { feature: 'Cisco CCNA lab coverage', them: 'Deep — full 200-301 domain coverage', us: 'Core topics: VLANs, trunking, OSPF, routing, more' },
      { feature: 'Aruba (HPE) labs', them: false, us: true },
      { feature: 'Juniper Junos labs', them: false, us: true },
      { feature: 'Practice exams included', them: 'Sold separately (ExSim-Max)', us: true },
      { feature: 'Flashcards with spaced repetition', them: false, us: true },
      { feature: 'Performance-based questions (PBQs)', them: false, us: true },
      { feature: 'AI study companion', them: false, us: 'Pro and Premium plans' },
      { feature: 'Pricing model', them: '$179/yr or $59/3mo per exam track (CCNA, as of June 2026)', us: 'From $15/mo — every cert, labs + exams + flashcards included' },
      { feature: 'Try it without an account', them: 'See boson.com for current demo options', us: 'Yes — free demo lab, no signup' },
    ],
    honest: {
      heading: 'When NetSim is the better choice',
      points: [
        'You\'re on an all-Cisco track and plan to continue past CCNA into CCNP. Boson\'s Cisco catalog goes deeper than ours and has years of refinement behind it.',
        'You want labs mapped one-to-one against every bullet of the official Cisco exam blueprint. That\'s Boson\'s specialty.',
        'You already own ExSim-Max practice exams and want labs from the same vendor.',
      ],
    },
    closing:
      'If you\'re Cisco-only and going deep, buy NetSim and don\'t look back. If you want one subscription that covers CCNA alongside Aruba, Juniper, CompTIA, and cloud certs — with the practice exams and flashcards already included — that\'s the gap Sabr was built to fill.',
    disclaimer:
      'Boson®, NetSim®, and ExSim-Max® are trademarks of Boson Software, LLC. Cisco® and CCNA® are trademarks of Cisco Systems, Inc. Sabr Learning Labs is not affiliated with, sponsored by, or endorsed by Boson Software or Cisco Systems. Competitor details verified against boson.com in June 2026 and may change; always confirm current pricing on the vendor\'s site.',
  },

  'packet-tracer': {
    name: 'Cisco Packet Tracer',
    title: 'Cisco Packet Tracer Alternative — Graded Multi-Vendor Labs, No Install',
    description:
      'Packet Tracer vs Sabr Learning Labs, honestly compared: install and account requirements, vendor coverage, lab grading, and when the free Cisco tool is genuinely the right call.',
    intro: [
      'Cisco Packet Tracer is free, hugely capable, and the default network simulator for a generation of CCNA students. If it fits your situation, use it — this page is an honest comparison, not a takedown.',
      'The real differences: Packet Tracer is a desktop application that requires a Cisco Networking Academy account, it simulates Cisco devices, and it\'s an open sandbox — you build and explore, but standalone use doesn\'t grade you against exam objectives. Sabr\'s labs run in the browser with nothing to install, cover Aruba and Juniper as well as Cisco, and every lab checks your work live against pass/fail objectives.',
    ],
    rows: [
      { feature: 'Price', them: 'Free', us: 'Free demo lab; full library from $15/mo' },
      { feature: 'Runs in the browser, no install', them: 'No — desktop app for Windows, macOS, Linux', us: true },
      { feature: 'Account required to start', them: 'Yes — Cisco NetAcad account + course enrollment to download', us: 'No — demo lab runs without signup' },
      { feature: 'Cisco device simulation', them: 'Extensive — large device catalog incl. IoT', us: 'Cisco IOS CLI for CCNA-level topics' },
      { feature: 'Aruba (HPE) labs', them: false, us: true },
      { feature: 'Juniper Junos labs', them: false, us: true },
      { feature: 'Live grading against exam objectives', them: 'In NetAcad courses; standalone use is ungraded sandbox', us: 'Every lab, graded live' },
      { feature: 'Practice exams, flashcards, PBQs', them: false, us: true },
      { feature: 'Free-build sandbox mode', them: true, us: 'Premium plan' },
    ],
    honest: {
      heading: 'When Packet Tracer is the better choice',
      points: [
        'Your budget is zero and your target is Cisco-only. Packet Tracer is genuinely free and genuinely good.',
        'You want to build large, exploratory topologies with a huge device catalog, including wireless and IoT gear.',
        'You\'re enrolled in a NetAcad course — Packet Tracer activities are woven directly into the curriculum.',
      ],
    },
    closing:
      'Packet Tracer teaches you to build networks. Graded labs teach you to fix and verify them under exam conditions — and if your cert path includes Aruba, Juniper, or CompTIA alongside Cisco, a Cisco-only simulator can\'t follow you there. Try the free lab below and feel the difference; it costs nothing and there\'s no signup.',
    disclaimer:
      'Cisco®, Packet Tracer®, CCNA®, and Cisco Networking Academy® are trademarks of Cisco Systems, Inc. Sabr Learning Labs is not affiliated with, sponsored by, or endorsed by Cisco Systems. Competitor details verified against netacad.com in June 2026 and may change; always confirm current details on the vendor\'s site.',
  },
};

function Cell({ value }) {
  if (value === true)  return <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" aria-label="Yes" />;
  if (value === false) return <XCircle className="w-5 h-5 text-slate-600 mx-auto" aria-label="No" />;
  return (
    <span className="text-xs text-slate-400 leading-snug inline-flex items-start gap-1.5">
      <MinusCircle className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
      {value}
    </span>
  );
}

export default function ComparePage({ competitor }) {
  const c = COMPETITORS[competitor];

  useSeo({
    title: `${c.title} | Sabr Learning Labs`,
    description: c.description,
  });

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative pt-16 pb-10 sm:pt-20">
        <div className="container-site max-w-4xl">
          <FadeIn>
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-cyan-400 uppercase tracking-widest">
              <Scale className="w-4 h-4" /> Honest comparison
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              Sabr Learning Labs vs {c.name}
            </h1>
            {c.intro.map((p, i) => (
              <p key={i} className="text-slate-400 leading-relaxed mb-4 text-base sm:text-lg">{p}</p>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section className="pb-12">
        <div className="container-site max-w-4xl">
          <FadeIn>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest w-[44%]">Feature</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">{c.name}</th>
                    <th className="py-4 px-4 text-xs font-bold text-cyan-400 uppercase tracking-widest text-center">Sabr</th>
                  </tr>
                </thead>
                <tbody>
                  {c.rows.map((row) => (
                    <tr key={row.feature} className="border-b border-white/[0.04] last:border-0">
                      <td className="py-3.5 px-4 text-slate-300 font-medium">{row.feature}</td>
                      <td className="py-3.5 px-4 text-center align-middle"><Cell value={row.them} /></td>
                      <td className="py-3.5 px-4 text-center align-middle"><Cell value={row.us} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Honesty section ── */}
      <section className="pb-12">
        <div className="container-site max-w-4xl">
          <FadeIn>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">{c.honest.heading}</h2>
            <ul className="space-y-3 mb-8">
              {c.honest.points.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-400 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-slate-500 mt-1 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="text-slate-400 leading-relaxed text-base sm:text-lg">{c.closing}</p>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-16">
        <div className="container-site max-w-4xl">
          <FadeIn>
            <div className="card p-8 sm:p-10 text-center bg-gradient-to-br from-cyan-500/[0.07] to-indigo-500/[0.05]">
              <Terminal className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">Judge it in five minutes, not five paragraphs</h2>
              <p className="text-slate-400 mb-7 max-w-xl mx-auto">
                Run a real graded lab in your browser right now. No account, no install, no card.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/try"
                  onClick={() => track(EVENTS.COMPARE_CTA_CLICK, { competitor })}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Try a free lab <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={`${APP_ORIGIN}/register`}
                  className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200"
                >
                  or start a 7-day free trial
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Legal disclaimer ── */}
      <section className="pb-14">
        <div className="container-site max-w-4xl">
          <p className="text-[11px] text-slate-600 leading-relaxed border-t border-white/[0.05] pt-5">
            {c.disclaimer}
          </p>
        </div>
      </section>
    </div>
  );
}
