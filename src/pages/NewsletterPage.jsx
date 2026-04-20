// NewsletterPage.jsx — Dedicated newsletter landing page
import { Zap, Shield, Cpu, Bell, CheckCircle, TrendingUp, Clock, Users } from 'lucide-react';
import NewsletterSignup from '../components/newsletter/NewsletterSignup';

const benefits = [
  { icon: Shield, title: 'Breaking Cyber Alerts',    desc: 'Critical CVEs, active threats, and incident reports as they happen — never miss a critical patch cycle.' },
  { icon: Cpu,    title: 'AI & Tech Breakthroughs',  desc: 'The most significant model releases, research papers, and product launches — explained simply and clearly.' },
  { icon: Bell,   title: 'Daily Morning Briefing',    desc: 'One concise email every weekday before 8am. The five stories you actually need to know.' },
  { icon: TrendingUp, title: 'Curated & Ranked',     desc: 'We read hundreds of sources so you don\'t have to. Only what genuinely matters makes the cut.' },
  { icon: Clock,  title: '5-Minute Read',             desc: 'Designed to be read with your morning coffee. Dense with value, light on filler.' },
  { icon: Users,  title: 'Join 40,000+ Readers',      desc: 'Security professionals, engineers, executives, and curious minds trust our daily briefing.' },
];

const sampleIssues = [
  {
    date: 'Monday, Apr 14, 2026',
    items: [
      'OpenAI releases GPT-5 with 90% expert-level benchmark performance',
      'CISA Emergency Directive: Patch critical Windows NTLM zero-day within 48 hours',
      'SpaceX Starship completes first full orbital round-trip with both stage catches',
      'EU AI Act enforcement: first three fines totaling €47M issued',
      'NASA confirms Artemis IV crew and 2028 lunar landing date',
    ],
  },
];

export default function NewsletterPage() {
  return (
    <div className="container-site py-12">
      {/* Hero section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/30">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <div className="section-label justify-center mb-4">
          <Zap className="w-3.5 h-3.5" />
          Free Newsletter
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
          Your Daily<br />
          <span className="text-gradient-cyan">Cyber & Tech Intel</span>
        </h1>
        <p className="text-slate-400 text-xl leading-relaxed mb-8">
          Breaking cyber threats, AI breakthroughs, and major tech stories — curated and delivered every morning before 8am. Join 40,000+ professionals who trust Sabr for their daily briefing.
        </p>

        <div className="max-w-md mx-auto">
          <NewsletterSignup compact />
        </div>
      </div>

      <div className="section-divider mb-16" />

      {/* Benefits grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-10">Why Subscribe?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 hover-glow">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-base font-bold text-slate-200 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider mb-16" />

      {/* Sample issue */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-10">Sample Issue</h2>
        {sampleIssues.map(issue => (
          <div key={issue.date} className="max-w-2xl mx-auto card overflow-hidden">
            {/* Email header */}
            <div className="bg-gradient-to-br from-[#0d1321] to-[#111827] px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Sabr Daily Briefing</p>
                <p className="text-[11px] text-slate-600">{issue.date}</p>
              </div>
              <span className="ml-auto text-xs text-cyan-400 font-semibold">Today's Top Stories</span>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {issue.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-600 mt-5 pt-4 border-t border-white/[0.04]">
                + Threat of the day, CVE spotlight, and one longer analysis piece. Delivered daily, Monday–Friday.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <NewsletterSignup />
    </div>
  );
}
