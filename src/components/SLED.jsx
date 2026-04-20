import { GraduationCap, Landmark, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import FadeIn from './FadeIn';

// ─── SLED audience cards ────────────────────────────────────────────
const AUDIENCES = [
  {
    icon:  GraduationCap,
    label: 'K–12 Schools',
    desc:  'Reliable, secure connectivity for students, staff, and administrators — built to support modern learning environments.',
  },
  {
    icon:  BookOpen,
    label: 'Libraries',
    desc:  'Public-facing Wi-Fi, staff networks, and infrastructure that keeps community resources accessible and dependable.',
  },
  {
    icon:  Landmark,
    label: 'Local Government',
    desc:  'Network environments that meet the operational and security requirements of municipal offices, departments, and facilities.',
  },
];

// ─── What Sabr can help with in SLED contexts ──────────────────────
const CAPABILITIES = [
  'Infrastructure assessments and planning',
  'Network design for modernization projects',
  'Physical deployment and installation support',
  'Ongoing managed services and monitoring',
  'Budget-conscious phased implementation',
  'Connectivity improvement planning',
];

export default function SLED() {
  return (
    <section id="sled" className="py-24 lg:py-32 bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-3">
              Schools · Libraries · Local Government
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-5">
              Supporting the public sector
              <br className="hidden sm:block" />
              <span className="gradient-text"> in our own backyard.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Public-sector organizations deserve modern, reliable networks — and the
              budget challenges that come with public funding require a partner who
              understands how to plan and prioritize carefully.
            </p>
          </div>
        </FadeIn>

        {/* Audience cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {AUDIENCES.map(({ icon: Icon, label, desc }, i) => (
            <FadeIn key={label} delay={i * 80}>
              <div className="h-full rounded-2xl border border-white/6 bg-navy-800 hover:border-cyan-500/20 transition-colors duration-300 p-6">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-cyan-400" strokeWidth={1.75} />
                </div>
                <h3 className="text-sm font-bold text-slate-100 mb-2">{label}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Main info block */}
        <FadeIn delay={240}>
          <div className="rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-10 items-start">

              {/* Left: copy */}
              <div>
                <h3 className="text-xl font-bold text-slate-100 mb-4">
                  Infrastructure modernization &amp; funding awareness
                </h3>
                <div className="space-y-4 text-slate-400 text-sm leading-relaxed mb-6">
                  <p>
                    Many public-sector organizations in the Inland Northwest are operating on
                    network infrastructure that is well past its useful life. Modernizing that
                    infrastructure — upgrading switching, improving wireless coverage, and building
                    in proper security visibility — can dramatically improve day-to-day operations
                    for staff and the communities they serve.
                  </p>
                  <p>
                    Sabr Technologies is prepared to support organizations pursuing infrastructure
                    projects where programs like <strong className="text-slate-300">E-Rate</strong> or
                    similar federal and state funding initiatives may play a role in covering costs.
                    We work with your team to understand your goals, assess your current environment,
                    and plan a practical path forward.
                  </p>
                </div>

                {/* ─── E-Rate disclaimer — DO NOT strengthen this claim ─── */}
                {/* Current language is intentionally conservative ────────── */}
                <div className="rounded-lg bg-navy-800/80 border border-white/8 p-4 text-xs text-slate-500 leading-relaxed">
                  <strong className="text-slate-400">Note:</strong>{' '}
                  Sabr Technologies is not an authorized E-Rate service provider and does not
                  submit E-Rate applications on behalf of applicants. Organizations pursuing
                  E-Rate or similar program funding should work with a qualified consultant or
                  service provider approved under the applicable program. We are happy to
                  support your infrastructure planning regardless of funding source.
                </div>
              </div>

              {/* Right: capability list */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-4">
                  How We Can Help
                </p>
                <ul className="space-y-3">
                  {CAPABILITIES.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <a href="#contact" className="btn-primary text-sm">
                    Start a Conversation
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
