import { Search, ClipboardList, PenTool, Package, Activity, HeartHandshake } from 'lucide-react';
import FadeIn from './FadeIn';

// ─── Process steps ─────────────────────────────────────────────────
// Edit labels, icons, and descriptions as the delivery process evolves.
const STEPS = [
  {
    icon:   Search,
    number: '01',
    label:  'Discover',
    desc:   'We start by listening. We take time to understand your business, your current environment, your pain points, and your goals before recommending anything.',
  },
  {
    icon:   ClipboardList,
    number: '02',
    label:  'Assess',
    desc:   'We evaluate your existing infrastructure — documenting what you have, identifying gaps, and establishing a clear baseline to work from.',
  },
  {
    icon:   PenTool,
    number: '03',
    label:  'Design',
    desc:   'We produce a right-sized network design that addresses your requirements, fits your budget, and is built to scale as your organization grows.',
  },
  {
    icon:   Package,
    number: '04',
    label:  'Deploy',
    desc:   'Our team handles the physical installation, configuration, and testing of every component — cleanly, professionally, and on schedule.',
  },
  {
    icon:   Activity,
    number: '05',
    label:  'Monitor',
    desc:   'Once live, we watch your environment 24/7 — tracking performance, detecting anomalies, and staying ahead of potential issues.',
  },
  {
    icon:   HeartHandshake,
    number: '06',
    label:  'Support',
    desc:   'Ongoing management, lifecycle planning, and a responsive team ready when you need them. This is where the partnership really begins.',
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 lg:py-32 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-3">
              Our Process
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-5">
              A clear path from
              <span className="gradient-text"> first call to full support.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Every engagement follows a structured process designed to eliminate
              uncertainty and deliver consistent, high-quality results.
            </p>
          </div>
        </FadeIn>

        {/* Steps — desktop: 3-column grid; mobile: vertical list */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map(({ icon: Icon, number, label, desc }, i) => (
            <FadeIn key={label} delay={i * 80}>
              <div className="group relative h-full rounded-2xl border border-white/6 bg-navy-800 hover:border-cyan-500/20 hover:bg-navy-700/40 transition-all duration-300 p-6">

                {/* Step number (decorative) */}
                <span className="absolute top-5 right-5 text-4xl font-black text-white/4 select-none leading-none">
                  {number}
                </span>

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-cyan-500/8 border border-cyan-500/15 flex items-center justify-center mb-5 group-hover:bg-cyan-500/15 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-cyan-400" strokeWidth={1.75} />
                </div>

                <h3 className="text-base font-bold text-slate-100 mb-2">{label}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
