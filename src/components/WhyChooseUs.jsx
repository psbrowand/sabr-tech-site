import {
  MapPin, ShieldCheck, Activity, MessageSquare,
  Users, Zap,
} from 'lucide-react';
import FadeIn from './FadeIn';

// ─── Differentiators ───────────────────────────────────────────────
const REASONS = [
  {
    icon:  MapPin,
    title: 'Local & Responsive',
    desc:  "We're based in the Inland Northwest — not a call center. When something is wrong, we're reachable, accountable, and ready to dispatch on-site.",
  },
  {
    icon:  Zap,
    title: 'End-to-End Ownership',
    desc:  'One partner from design through ongoing management. No finger-pointing between vendors, no gaps in accountability.',
  },
  {
    icon:  Activity,
    title: 'Proactive, Not Reactive',
    desc:  'We\'re watching your network before you notice a problem — identifying issues early and resolving them before they affect your business.',
  },
  {
    icon:  ShieldCheck,
    title: 'Security-Forward Approach',
    desc:  'Security isn\'t an add-on. Every network we build and manage is designed with visibility, segmentation, and threat awareness from the start.',
  },
  {
    icon:  MessageSquare,
    title: 'Clear Communication',
    desc:  'No jargon, no runaround. We explain what\'s happening in plain language, keep you informed, and make sure you always know the status of your environment.',
  },
  {
    icon:  Users,
    title: 'Built for Small Organizations',
    desc:  'Enterprise-grade reliability shouldn\'t require an enterprise budget. We right-size our services to fit the actual needs — and budget — of local businesses and organizations.',
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 lg:py-32 bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-3">
              Why Sabr Technologies
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-5">
              The partner difference.
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Plenty of companies sell network equipment. We manage it, support it,
              and stand behind it — long after the project wraps up.
            </p>
          </div>
        </FadeIn>

        {/* Reasons grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map(({ icon: Icon, title, desc }, i) => (
            <FadeIn key={title} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-white/6 bg-navy-800 hover:border-cyan-500/20 hover:bg-navy-700/50 transition-all duration-300 p-6">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/8 border border-cyan-500/15 flex items-center justify-center mb-4 group-hover:bg-cyan-500/15 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-cyan-400" strokeWidth={1.75} />
                </div>
                <h3 className="text-sm font-bold text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
