// LearningPage.jsx — Certifications & Learning section
import { useState } from 'react';
import {
  BookOpen, Award, ExternalLink, GraduationCap, ChevronRight,
  Shield, Network, Server, ArrowRight, Target, CheckCircle2,
} from 'lucide-react';
import { articles } from '../data/articles';
import ArticleCard   from '../components/articles/ArticleCard';
import Sidebar       from '../components/sidebar/Sidebar';
import SectionHeader from '../components/ui/SectionHeader';
import NewsletterSignup from '../components/newsletter/NewsletterSignup';

const APP_ORIGIN = import.meta.env.VITE_APP_ORIGIN || 'https://app.sabr-labs.com';

// ── Sub-category filter definitions ──────────────────────────────────────────
const certFilters = [
  { id: null,       label: 'All',          tags: [] },
  { id: 'comptia',  label: 'CompTIA',      tags: ['CompTIA'] },
  { id: 'cisco',    label: 'Cisco',        tags: ['Cisco'] },
  { id: 'palo-alto',label: 'Palo Alto',    tags: ['Palo Alto Networks'] },
  { id: 'fortinet', label: 'Fortinet',     tags: ['Fortinet'] },
  { id: 'juniper',  label: 'Juniper',      tags: ['Juniper'] },
  { id: 'sans',     label: 'SANS / GIAC',  tags: ['SANS', 'GIAC'] },
  { id: 'google',   label: 'Google',       tags: ['Google'] },
];

// ── External training resources ───────────────────────────────────────────────
const resources = [
  {
    name: 'Cisco Learning Network',
    desc: 'Official Cisco study materials, community forums, and practice exams for all Cisco certifications.',
    href: 'https://learningnetwork.cisco.com',
    tag: 'Cisco',
    tagColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25',
  },
  {
    name: 'CompTIA',
    desc: 'Official CompTIA certification resources, CertMaster study tools, and exam vouchers for Security+, Network+, CySA+, and more.',
    href: 'https://www.comptia.org',
    tag: 'CompTIA',
    tagColor: 'text-red-400 bg-red-400/10 border-red-400/25',
  },
  {
    name: 'Udemy',
    desc: 'Affordable instructor-led video courses covering virtually every IT certification. Watch for frequent sales.',
    href: 'https://www.udemy.com',
    tag: 'Training',
    tagColor: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
  },
  {
    name: 'Coursera',
    desc: 'University and vendor-backed courses, including the Google Cybersecurity and IBM Security certificates.',
    href: 'https://www.coursera.org',
    tag: 'Training',
    tagColor: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
  },
  {
    name: 'CBT Nuggets',
    desc: 'High-quality video training for networking and security certs, particularly strong on Cisco and CompTIA tracks.',
    href: 'https://www.cbtnuggets.com',
    tag: 'Training',
    tagColor: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
  },
  {
    name: 'INE (formerly eLearnSecurity)',
    desc: 'Deep technical training for Cisco, networking, penetration testing, and security operations certifications.',
    href: 'https://ine.com',
    tag: 'Training',
    tagColor: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
  },
  {
    name: 'SANS Institute',
    desc: 'Premium security training and GIAC certifications. Industry gold-standard for hands-on security education.',
    href: 'https://www.sans.org',
    tag: 'SANS / GIAC',
    tagColor: 'text-purple-400 bg-purple-400/10 border-purple-400/25',
  },
  {
    name: 'Offensive Security (OffSec)',
    desc: 'Home of OSCP, OSCE, and the Kali Linux penetration testing distribution. The benchmark for offensive security credentials.',
    href: 'https://www.offsec.com',
    tag: 'Offensive Sec',
    tagColor: 'text-red-400 bg-red-400/10 border-red-400/25',
  },
];

// ── Career path cards ─────────────────────────────────────────────────────────
const careerPaths = [
  {
    icon: Shield,
    title: 'Security Operations',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
    steps: ['CompTIA Security+', 'CompTIA CySA+', 'SANS GCIH or GCIA', 'CISSP (optional)'],
  },
  {
    icon: Network,
    title: 'Network Engineering',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
    steps: ['CompTIA Network+', 'Cisco CCNA', 'CCNP Enterprise', 'CCIE (advanced)'],
  },
  {
    icon: Server,
    title: 'Network Security',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    steps: ['CompTIA Security+', 'Palo Alto PCNSA', 'PCNSE or NSE 4', 'CCNP Security'],
  },
  {
    icon: GraduationCap,
    title: 'Penetration Testing',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    steps: ['CompTIA PenTest+', 'eJPT (INE)', 'OSCP (OffSec)', 'SANS GPEN (advanced)'],
  },
];

// ── Main LearningPage ─────────────────────────────────────────────────────────
export default function LearningPage() {
  const [activeFilter, setActiveFilter] = useState(null);

  const learningArticles = articles.filter(a => a.category === 'learning');

  const filtered = activeFilter === null
    ? learningArticles
    : learningArticles.filter(a => {
        const filterTags = certFilters.find(f => f.id === activeFilter)?.tags || [];
        return a.tags.some(t => filterTags.includes(t));
      });

  const sorted = [...filtered].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const [featured, ...rest] = sorted;

  return (
    <div className="container-site py-8">

      {/* ── SABR Learning product CTA — the umbrella's cert-prep service ── */}
      <section className="mb-10 rounded-2xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-[#0b1120] via-[#0d1321] to-[#111827] relative">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 20% 0%, rgba(0,212,255,0.12), transparent 60%), radial-gradient(ellipse 40% 40% at 90% 100%, rgba(99,102,241,0.08), transparent 60%)',
          }}
        />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 p-6 sm:p-10">
          <div>
            <div className="section-label mb-3">
              <Target className="w-3.5 h-3.5" />
              Study with SABR Learning
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4 leading-tight">
              Pass your next IT cert on the first try.
            </h2>
            <p className="text-slate-300 max-w-xl mb-6 leading-relaxed">
              Adaptive practice tests, spaced-repetition flashcards, and AI-guided
              study plans for CompTIA, Cisco, Microsoft, AWS, and more. Launching
              with six fully-polished CompTIA certifications and a growing
              catalogue.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`${APP_ORIGIN}/register`}
                className="btn-primary"
                target="_blank"
                rel="noopener"
              >
                Start free
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={APP_ORIGIN}
                className="btn-ghost"
                target="_blank"
                rel="noopener"
              >
                Explore the app
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-center">
            {[
              'Adaptive difficulty — questions scale to your level',
              'Spaced-repetition flashcards with confidence tracking',
              'Realistic timed exams with performance analytics',
              'AI study plan tuned to your weak topics',
            ].map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">{line}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Page header */}
      <div className="mb-8 pb-8 border-b border-white/[0.06]">
        <div className="section-label mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          Certification Guides
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Learning &amp; Certifications
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Honest, practitioner-written guides to cybersecurity and networking certifications — from first-timer CompTIA paths to advanced CCIE and GIAC tracks. Know what the cert is actually worth before you pay for it.
        </p>

        {/* Cert vendor filter pills */}
        <div className="flex flex-wrap gap-2 mt-5">
          {certFilters.map(({ id, label }) => {
            const isActive = activeFilter === id;
            return (
              <button
                key={label}
                onClick={() => setActiveFilter(id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 border-emerald-500 text-black'
                    : 'border-white/10 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-10">
        <div>

          {/* Featured article */}
          {featured && (
            <div className="mb-8">
              <ArticleCard article={featured} variant="horizontal" className="!p-5" />
            </div>
          )}

          {/* Article grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {rest.map(a => (
                <ArticleCard key={a.id} article={a} variant="default" />
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-600 mb-12">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-semibold mb-1">No guides for this filter yet</p>
              <p className="text-sm">New certification guides are added regularly — check back soon.</p>
            </div>
          )}

          {/* ── Career Path Roadmaps ── */}
          <div className="section-divider mb-10" />

          <div className="mb-12">
            <SectionHeader
              label="Career Paths"
              title="Where Do You Want to Go?"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {careerPaths.map(({ icon: Icon, title, color, bg, border, steps }) => (
                <div key={title} className={`card p-5 border ${border} hover-glow`}>
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-4.5 h-4.5 ${color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 mb-3">{title}</h3>
                  <ol className="space-y-2">
                    {steps.map((step, i) => (
                      <li key={step} className="flex items-center gap-2.5 text-xs text-slate-400">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${bg} ${color}`}>
                          {i + 1}
                        </span>
                        {step}
                        {i < steps.length - 1 && (
                          <ChevronRight className="w-3 h-3 text-slate-700 ml-auto" />
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {/* ── Learning Resources ── */}
          <div className="section-divider mb-10" />

          <div className="mb-12">
            <SectionHeader
              label="External Resources"
              title="Where to Study"
            />
            <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 mb-6 flex items-start gap-3">
              <Award className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                The links below point to external training providers. They are <strong className="text-slate-300">not affiliate or partner links</strong> — no commission is earned from any referrals. These are listed purely as a convenience for readers navigating the cert prep ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resources.map(({ name, desc, href, tag, tagColor }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-5 hover-glow flex flex-col gap-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors duration-200">
                      {name}
                    </h3>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 flex-shrink-0 mt-0.5 transition-colors duration-200" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  <span className={`inline-flex self-start text-[10px] font-semibold uppercase tracking-wide rounded-md border px-2 py-0.5 ${tagColor}`}>
                    {tag}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="section-divider mb-10" />
          <NewsletterSignup />
        </div>

        {/* Sidebar */}
        <div className="hidden xl:block">
          <div className="sticky top-24">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
