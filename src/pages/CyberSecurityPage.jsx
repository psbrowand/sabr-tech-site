// CyberSecurityPage.jsx — Cyber Security category page
import { Shield, AlertTriangle, Lock, Eye } from 'lucide-react';
import { getByCategory, getBreaking } from '../data/articles';
import ArticleCard   from '../components/articles/ArticleCard';
import Sidebar       from '../components/sidebar/Sidebar';
import SectionHeader from '../components/ui/SectionHeader';

const threatTags = ['APT', 'Ransomware', 'Zero-Day', 'Phishing', 'Nation-State', 'Vulnerability', 'Malware', 'Supply Chain', 'Critical Infrastructure'];

export default function CyberSecurityPage() {
  const cyberArticles = getByCategory('cyber');
  const breaking      = getBreaking();

  return (
    <div>
      <div className="container-site py-8">
        {/* Page header */}
        <div className="relative rounded-2xl overflow-hidden mb-10 p-8 sm:p-12 bg-gradient-to-br from-[#0d1321] to-[#111827] border border-white/[0.06]">
          {/* Background grid */}
          <div className="absolute inset-0 cyber-grid opacity-50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="section-label text-red-400">
                  <span className="inline-block w-3 h-0.5 bg-red-400 mr-1.5" />
                  Threat Intelligence
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Cyber Security News</h1>
              <p className="text-slate-400 max-w-xl">
                Breaking threat alerts, vulnerability disclosures, incident reports, nation-state activity, and defensive intelligence for security professionals.
              </p>
            </div>
          </div>

          {/* Tag cloud */}
          <div className="relative mt-6 flex flex-wrap gap-2">
            {threatTags.map(tag => (
              <span
                key={tag}
                className="text-[11px] font-semibold text-red-400/70 border border-red-400/15 px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-10">
          <div>
            {/* Breaking / Active threats */}
            {breaking.length > 0 && (
              <section className="mb-10">
                <SectionHeader
                  label="Active Threats"
                  title="Breaking Alerts"
                />
                <div className="space-y-4">
                  {breaking.map(a => (
                    <ArticleCard key={a.id} article={a} variant="horizontal" />
                  ))}
                </div>
              </section>
            )}

            {/* All cyber articles grid */}
            <SectionHeader
              label="All Coverage"
              title="Cyber Security Stories"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cyberArticles.map(a => (
                <ArticleCard key={a.id} article={a} variant="default" />
              ))}
            </div>

            {cyberArticles.length === 0 && (
              <div className="text-center py-20 text-slate-600">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-semibold mb-1">No incidents currently reported</p>
                <p className="text-sm">Check back soon — we monitor threats 24/7.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden xl:block">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
