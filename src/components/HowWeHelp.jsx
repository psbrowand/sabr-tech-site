import { ArrowRight } from 'lucide-react';
import FadeIn from './FadeIn';

// ─── Problem → Solution pairs ──────────────────────────────────────
// Each item renders as a before/after row. Edit freely.
const PAIRS = [
  {
    problem:  'Aging switches and routers that are overdue for replacement',
    solution: 'Modern, properly sized infrastructure designed for your current and future needs',
  },
  {
    problem:  'Unreliable Wi-Fi with dead zones and constant complaints',
    solution: 'Professional wireless site surveys and properly deployed access point coverage',
  },
  {
    problem:  'No visibility — you find out about problems when users complain',
    solution: '24/7 proactive monitoring that surfaces issues before they become outages',
  },
  {
    problem:  'Limited or no internal IT staff to manage the network',
    solution: 'A fully managed service that handles day-to-day operations on your behalf',
  },
  {
    problem:  'Security concerns without the budget for a dedicated security team',
    solution: 'Security visibility, log monitoring, and a network built with segmentation from the start',
  },
  {
    problem:  'Vendors who disappear after installation',
    solution: 'An ongoing local partner invested in keeping your environment running well, month after month',
  },
];

export default function HowWeHelp() {
  return (
    <section className="py-24 lg:py-32 bg-navy-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-3">
              Common Challenges
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-5">
              Sound familiar?
              <span className="gradient-text"> We can help.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              These are the challenges we hear every day from local businesses and organizations.
              Each one has a clear, practical solution.
            </p>
          </div>
        </FadeIn>

        {/* Problem → Solution pairs */}
        <div className="space-y-4">
          {PAIRS.map(({ problem, solution }, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div className="grid sm:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-white/6">

                {/* Problem side */}
                <div className="bg-navy-800 p-5 flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <span className="text-red-400 text-xs font-bold leading-none">✕</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{problem}</p>
                </div>

                {/* Solution side */}
                <div className="bg-navy-700/40 border-t sm:border-t-0 sm:border-l border-white/6 p-5 flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center">
                    <ArrowRight className="w-2.5 h-2.5 text-cyan-400" />
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">{solution}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn delay={PAIRS.length * 60}>
          <div className="mt-12 text-center">
            <a href="#contact" className="btn-primary px-8 py-3.5">
              Let's Talk About Your Environment
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
