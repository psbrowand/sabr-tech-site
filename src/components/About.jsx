import { MapPin, ArrowRight, Network } from 'lucide-react';
import FadeIn from './FadeIn';

// ─── About section statistics / key facts ──────────────────────────
// Update these when you have real numbers
const STATS = [
  { value: 'Local',    label: 'North Idaho & Eastern WA' },
  { value: '24 / 7',  label: 'Monitoring & Support' },
  { value: 'Full',    label: 'Lifecycle Management' },
  { value: 'End-to-End', label: 'From Design to Deploy' },
];

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Left: visual element ─────────────────────────────────── */}
          <FadeIn>
            <div className="relative">
              {/* Main card */}
              <div className="rounded-2xl border border-white/8 bg-navy-800 p-8 shadow-2xl">

                {/* Icon block */}
                <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                  <Network className="w-7 h-7 text-cyan-400" strokeWidth={1.5} />
                </div>

                <h3 className="text-lg font-bold text-slate-100 mb-2">
                  Built for the Inland Northwest
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  We're not a distant help desk. We're your local technology partner —
                  available when you need us, on-site when it matters.
                </p>

                {/* Location badge */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                  <MapPin className="w-4 h-4 text-cyan-500/60" />
                  <span>Serving North Idaho &amp; Eastern Washington</span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4">
                  {STATS.map(({ value, label }) => (
                    <div key={label} className="rounded-xl bg-navy-700/60 border border-white/5 p-4">
                      <p className="text-base font-bold text-cyan-400 mb-0.5">{value}</p>
                      <p className="text-xs text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </FadeIn>

          {/* ── Right: copy ──────────────────────────────────────────── */}
          <FadeIn delay={150}>
            {/* Section label */}
            <p className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-4">
              About Sabr Technologies
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 leading-tight mb-6">
              Your local technology partner
              <br />
              <span className="gradient-text">from day one.</span>
            </h2>

            {/* Main copy */}
            {/* ── Update this text to reflect current business details ── */}
            <div className="space-y-4 text-slate-400 leading-relaxed mb-8">
              <p>
                Sabr Technologies is a managed network services company rooted in the Inland
                Northwest. We work with local businesses, schools, and public-sector
                organizations to modernize aging infrastructure, improve connectivity, and
                deliver the kind of reliable, responsive support that large enterprises
                take for granted.
              </p>
              <p>
                Our team takes a full lifecycle approach — from initial assessment and
                network design through physical deployment and ongoing management — so
                you always know exactly who to call and what to expect.
              </p>
              <p>
                Whether you're operating on aging switches, struggling with unreliable Wi-Fi,
                or building out a new facility from scratch, we're here to help you operate
                with confidence and clarity.
              </p>
            </div>

            <a href="#services" className="btn-primary">
              Explore Our Services
              <ArrowRight className="w-4 h-4" />
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
