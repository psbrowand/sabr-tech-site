// AboutPage.jsx — About Sabr Cyber & Tech News
import { Shield, Cpu, Globe, User, Target, Eye, Zap, Award, BookOpen } from 'lucide-react';
import NewsletterSignup from '../components/newsletter/NewsletterSignup';

const values = [
  {
    icon: Eye,
    title: 'Editorial Independence',
    desc: 'Reporting is never influenced by advertisers or commercial interests. Every story is called as it is.',
  },
  {
    icon: Target,
    title: 'Sourced & Transparent',
    desc: 'Every factual claim links to a primary source — official advisories, vendor newsrooms, or credible reporting.',
  },
  {
    icon: Shield,
    title: 'Practitioner Perspective',
    desc: "Cyber coverage written from the inside — what threats actually mean for defenders, not just the headline.",
  },
  {
    icon: Zap,
    title: 'Speed Without Sacrifice',
    desc: 'Breaking news fast. Context and analysis follow. Speculation is never published as fact.',
  },
];

export default function AboutPage() {
  return (
    <div className="container-site py-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-cyan-500/25">
          <Shield className="w-8 h-8 text-white" strokeWidth={2} />
        </div>
        <div className="section-label justify-center mb-4">
          <span className="inline-block w-4 h-0.5 bg-cyan-400" />
          About Us
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-6">
          The Pulse of<br />
          <span className="text-gradient-cyan">Tech & Cyber</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Sabr Cyber & Tech News is an independent digital publication covering cybersecurity, technology, artificial intelligence, and space. It exists to give professionals and enthusiasts accurate, sourced, and genuinely useful coverage of the stories that matter.
        </p>
      </div>

      {/* Mission */}
      <div className="section-divider mb-16" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <div className="section-label mb-4">
            <Globe className="w-3.5 h-3.5" />
            The Mission
          </div>
          <h2 className="text-3xl font-black text-white mb-5">Informed Readers Make Better Decisions</h2>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>
              The technology and security landscape moves faster than anyone can fully track on their own. New vulnerabilities drop daily. AI capabilities shift weekly. Threat actors adapt continuously. Sabr exists to cut through that noise and surface what actually matters.
            </p>
            <p>
              Good tech journalism isn't just about being first — it's about being right, being clear, and answering the question readers are actually asking: <em>"So what does this mean for me?"</em> That's the standard every story on this site is held to.
            </p>
            <p>
              The Learning section reflects a specific conviction: certifications and structured education remain one of the most reliable paths into cybersecurity and networking careers, and there isn't enough honest, practical guidance out there for people navigating those paths.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 content-start">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5 hover-glow">
              <div className="w-9 h-9 rounded-lg bg-cyan-400/10 flex items-center justify-center mb-3">
                <Icon className="w-4.5 h-4.5 text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-200 mb-2">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage areas */}
      <div className="section-divider mb-16" />

      <div className="mb-16">
        <div className="section-label mb-4">
          <Cpu className="w-3.5 h-3.5" />
          What We Cover
        </div>
        <h2 className="text-2xl font-bold text-white mb-8">Coverage Areas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { cat: 'cyber',    label: 'Cyber Security',          items: ['Threat Intelligence', 'Vulnerability Disclosures', 'Nation-State Activity', 'Incident Reports', 'CISA Advisories', 'Dark Web Intel'] },
            { cat: 'ai',       label: 'AI & Machine Learning',   items: ['Model Releases', 'Research Breakthroughs', 'AI Safety & Policy', 'Enterprise AI', 'Open Source AI', 'AI Regulation'] },
            { cat: 'tech',     label: 'Technology',              items: ['Big Tech (Google, Microsoft, Apple, Meta)', 'Semiconductor News', 'Cloud & Infrastructure', 'Consumer Technology', 'Startups & VC', 'Policy & Regulation'] },
            { cat: 'space',    label: 'Space & Science',         items: ['SpaceX & Launch News', 'NASA Missions', 'Commercial Space', 'Astronomy', 'Defense & Satellites', 'New Space Economy'] },
            { cat: 'learning', label: 'Learning & Certs',        items: ['Certification Guides', 'Exam Reviews', 'Training News', 'Career Advice', 'Study Resources', 'Vendor Cert Updates'] },
          ].map(({ cat, label, items }) => (
            <div key={cat} className="card p-5 hover-glow">
              <CategoryBadgeInline cat={cat} />
              <h3 className="text-sm font-bold text-slate-200 mt-3 mb-3">{label}</h3>
              <ul className="space-y-1.5">
                {items.map(item => (
                  <li key={item} className="text-xs text-slate-500 flex items-start gap-1.5">
                    <span className="text-cyan-500 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Author */}
      <div className="section-divider mb-16" />

      <div className="mb-16">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-cyan-400" />
          <span className="section-label">The Author</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-8">Who Writes This</h2>
        <div className="card p-8 hover-glow max-w-2xl">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-black text-2xl shadow-xl shadow-cyan-500/20">
              SB
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Sam Browand</h3>
              <p className="text-sm text-cyan-400 font-medium mb-4">Founder · Lead Editor · Lead Author</p>
              <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                <p>
                  Sam Browand is the founder and sole author of Sabr Cyber & Tech News. With a background spanning network infrastructure, cybersecurity operations, and IT management, Sam brings a hands-on practitioner's perspective to every story published on this site.
                </p>
                <p>
                  His work focuses on making complex security and technology topics accessible without dumbing them down — whether that's breaking down a new critical vulnerability, analyzing a major AI release, or writing an honest guide to a certification path. The Learning section in particular reflects years of personal experience navigating vendor certifications, studying for exams, and helping others do the same.
                </p>
                <p>
                  Sabr Cyber & Tech News was built to be the kind of publication Sam wished existed when he was starting out — technical enough to be useful, clear enough to be readable, and honest enough to be trusted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial policy + disclosure */}
      <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-6 mb-16">
        <div className="flex items-start gap-4">
          <Award className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-2">Editorial Policy & Source Disclosure</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              All articles on Sabr Cyber & Tech News are original editorial writing. No article is paid placement, sponsored content, or AI-generated without human review and editing. Every article includes a Sources section citing the primary references used — official vendor advisories, government publications, and credible news outlets. These citations are provided for transparency and reader verification, not as affiliate or partner links. Security vulnerability coverage follows responsible disclosure principles.
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <NewsletterSignup />
    </div>
  );
}

// Inline helper to avoid import
function CategoryBadgeInline({ cat }) {
  const map = {
    cyber:    'text-red-400     bg-red-400/10     border-red-400/25     Cyber Security',
    ai:       'text-purple-400  bg-purple-400/10  border-purple-400/25  AI & ML',
    tech:     'text-cyan-400    bg-cyan-400/10    border-cyan-400/25    Technology',
    space:    'text-blue-400    bg-blue-400/10    border-blue-400/25    Space',
    learning: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25 Learning',
  };
  const parts = (map[cat] || 'text-slate-400 bg-slate-400/10 border-slate-400/25 General').split(/\s+/);
  const label = parts.slice(3).join(' ');
  const cls   = parts.slice(0, 3).join(' ');
  return (
    <span className={`inline-flex text-xs font-semibold uppercase tracking-wide rounded-md border px-2.5 py-1 ${cls}`}>
      {label}
    </span>
  );
}
