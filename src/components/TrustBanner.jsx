import { ShieldCheck, Activity, MapPin, Clock } from 'lucide-react';
import FadeIn from './FadeIn';

// ─── Trust pillars ─────────────────────────────────────────────────
const PILLARS = [
  {
    icon:  ShieldCheck,
    label: 'Secure',
    desc:  'Security-first by design',
  },
  {
    icon:  Activity,
    label: 'Proactive',
    desc:  '24/7 monitoring & alerting',
  },
  {
    icon:  Clock,
    label: 'Reliable',
    desc:  'Built for always-on operations',
  },
  {
    icon:  MapPin,
    label: 'Local',
    desc:  'Based in the Inland Northwest',
  },
];

export default function TrustBanner() {
  return (
    <div className="relative bg-navy-900 border-y border-white/5">
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-white/5">
            {PILLARS.map(({ icon: Icon, label, desc }, i) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-3 lg:px-8 first:pl-0 last:pr-0 text-center sm:text-left"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-cyan-400" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      <div className="section-divider absolute bottom-0 left-0 right-0" />
    </div>
  );
}
