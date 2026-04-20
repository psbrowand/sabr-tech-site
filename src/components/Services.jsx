import {
  Network, Activity, ShieldCheck, Camera,
  Phone, Wifi, Wrench, ArrowRight,
} from 'lucide-react';
import FadeIn from './FadeIn';

// ─── Service definitions ───────────────────────────────────────────
// Add, remove, or edit services here. Each card auto-renders.
const SERVICES = [
  {
    icon:     Network,
    title:    'Fully Managed Network Services',
    desc:     'We take ownership of your entire network environment — firewalls, routing, switching, and wireless — and manage it end-to-end so your team never has to.',
    bullets:  [
      'Firewall management & lifecycle support',
      'Routing, switching, and segmentation',
      'Wireless infrastructure management',
      'Proactive change management & patching',
    ],
    featured: true,
  },
  {
    icon:    Activity,
    title:   '24/7 Monitoring & Alerting',
    desc:    'Issues don\'t wait for business hours. Our always-on monitoring platform watches your environment around the clock and escalates problems before they become outages.',
    bullets: [
      'Continuous uptime & performance monitoring',
      'Automated alerting & incident escalation',
      'Historical performance dashboards',
      'Bandwidth and utilization visibility',
    ],
  },
  {
    icon:    ShieldCheck,
    title:   'Security Visibility & Log Monitoring',
    desc:    'Gain enterprise-grade visibility into your network activity without the enterprise price tag. We correlate log data to surface anomalies and help you stay ahead of threats.',
    bullets: [
      'Centralized log collection & correlation',
      'Suspicious activity detection & alerting',
      'Compliance-friendly log retention',
      'Clear, actionable security reporting',
    ],
  },
  {
    icon:    Camera,
    title:   'Video Surveillance Network Support',
    desc:    'IP-based camera systems depend on a reliable, well-designed network. We design, deploy, and support the network infrastructure that keeps your surveillance system running.',
    bullets: [
      'Network design for IP camera environments',
      'PoE switching and bandwidth planning',
      'VLAN segmentation for camera traffic',
      'Ongoing network support for surveillance systems',
    ],
  },
  {
    icon:    Phone,
    title:   'VoIP & Business Communications Support',
    desc:    'Modern phone systems demand a quality-of-service-ready network. We configure and manage the infrastructure that keeps your business communications clear and reliable.',
    bullets: [
      'QoS configuration for voice traffic',
      'SIP-ready network environments',
      'Hosted or bring-your-own provider support',
      'Network readiness assessments for VoIP',
    ],
  },
  {
    icon:    Wifi,
    title:   'Wireless Site Surveys',
    desc:    'Poor Wi-Fi coverage is a productivity killer. Our professional site surveys identify dead zones, interference sources, and optimal access point placement before you invest.',
    bullets: [
      'Pre-deployment RF coverage planning',
      'Interference and spectrum analysis',
      'Post-deployment validation surveys',
      'Capacity and density planning',
    ],
  },
  {
    icon:    Wrench,
    title:   'Professional Services & Deployments',
    desc:    'Need a full network refresh? We handle everything from design and procurement coordination through physical installation and cutover — turnkey, on schedule.',
    bullets: [
      'Full network refresh / forklift upgrades',
      'Physical cabling and hardware installation',
      'Site staging, testing, and validation',
      'Documentation and knowledge transfer',
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 lg:py-32 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-3">
              What We Do
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-5">
              Everything your network needs,
              <br className="hidden sm:block" />
              <span className="gradient-text"> fully managed.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From day-to-day management to full-scale deployments, Sabr Technologies
              covers every layer of your network environment.
            </p>
          </div>
        </FadeIn>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(({ icon: Icon, title, desc, bullets, featured }, i) => (
            <FadeIn key={title} delay={i * 60}>
              <article
                className={`group relative h-full rounded-2xl border transition-all duration-300 p-6 card-glow cursor-default
                  ${featured
                    ? 'bg-gradient-to-br from-cyan-500/10 to-blue-600/5 border-cyan-500/25 shadow-lg shadow-cyan-500/5'
                    : 'bg-navy-800 border-white/6 hover:border-white/12'
                  }`}
              >
                {featured && (
                  <span className="absolute top-4 right-4 text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                    Core Service
                  </span>
                )}

                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5
                  ${featured
                    ? 'bg-cyan-500/20 border border-cyan-500/30'
                    : 'bg-navy-700 border border-white/8 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 transition-colors duration-300'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${featured ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400 transition-colors duration-300'}`}
                    strokeWidth={1.75}
                  />
                </div>

                <h3 className="text-base font-bold text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{desc}</p>

                {/* Feature bullets */}
                <ul className="space-y-1.5">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-slate-500">
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cyan-500/50 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            </FadeIn>
          ))}

          {/* CTA tile */}
          <FadeIn delay={SERVICES.length * 60}>
            <div className="rounded-2xl border border-dashed border-white/10 bg-navy-800/30 p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[220px]">
              <p className="text-sm font-semibold text-slate-300">
                Don't see what you need?
              </p>
              <p className="text-xs text-slate-500">
                Contact us — we'll discuss your environment and figure out the best path forward.
              </p>
              <a href="#contact" className="btn-primary text-xs px-5 py-2.5">
                Talk to Us
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
