// ArticleProductCTA — the conversion bridge from a news/learning article into
// the product. Buyer-intent articles (esp. "is X cert worth it") previously
// dead-ended with only competitor/free-resource links; this turns that
// attention into a free-trial / free-lab path.
//
// Cert detection is keyword-based off the article title + tags. Networking
// certs lead with the free LAB (the differentiator nobody else can demo);
// everything else leads with the free trial. Falls back to a generic pitch
// for non-learning news so every article has at least a soft tie.

import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Sparkles } from 'lucide-react';
import { track, EVENTS } from '../../lib/analytics';

const APP_ORIGIN = import.meta.env.VITE_APP_ORIGIN || 'https://app.sabr-labs.com';

// Ordered: first match wins. `lab: true` means we sell a hands-on lab for it
// (lead with the demo). Keywords are matched against lowercased title+tags.
const CERT_MATCHERS = [
  { cert: 'CCNA',        lab: true,  kw: ['ccna', '200-301'] },
  { cert: 'Aruba',       lab: true,  kw: ['aruba', 'hpe6-a85', 'hpe6-a86', 'aos-cx'] },
  { cert: 'JNCIA-Junos', lab: true,  kw: ['juniper', 'jncia', 'jn0-106', 'junos'] },
  { cert: 'Network+',    lab: true,  kw: ['network+', 'n10-009'] },
  { cert: 'Security+',   lab: false, kw: ['security+', 'sy0-701'] },
  { cert: 'A+',          lab: false, kw: ['comptia a+', 'a+ core', '220-1201', '220-1202'] },
  { cert: 'CySA+',       lab: false, kw: ['cysa', 'cs0-003', 'cs0-004'] },
  { cert: 'PenTest+',    lab: false, kw: ['pentest+', 'pt0-003'] },
  { cert: 'CISSP',       lab: false, kw: ['cissp'] },
  { cert: 'AWS',         lab: false, kw: ['saa-c03', 'dva-c02', 'solutions architect', 'aws certified'] },
  { cert: 'Azure',       lab: false, kw: ['az-104', 'azure administrator'] },
  { cert: 'Google Cloud',lab: false, kw: ['gcp', 'associate cloud engineer', 'google cloud'] },
  { cert: 'ISC2 CC',     lab: false, kw: ['isc2 cc', 'certified in cybersecurity'] },
];

function detectCert(article) {
  const hay = `${article.title} ${(article.tags || []).join(' ')}`.toLowerCase();
  return CERT_MATCHERS.find((m) => m.kw.some((k) => hay.includes(k))) || null;
}

export default function ArticleProductCTA({ article }) {
  const match = detectCert(article);
  const isLearning = article.category === 'learning';

  // Headline + body adapt to how relevant the product is to the article.
  const heading = match
    ? `Ready to pass the ${match.cert}?`
    : isLearning
      ? 'Studying for an IT certification?'
      : 'Prepping for an IT certification?';

  const body = match
    ? `Practice questions, spaced-repetition flashcards${match.lab ? ', and hands-on labs in a real CLI simulator' : ''} for the ${match.cert} — one subscription covers every cert. Start with a 7-day free trial.`
    : 'Sabr Learning has adaptive practice questions, flashcards, and hands-on network labs for CompTIA, Cisco, Aruba, AWS, Azure, and more — one subscription, 7-day free trial.';

  // Networking certs lead with the lab demo (the thing competitors can't show);
  // others lead with the trial.
  const labFirst = Boolean(match && match.lab);

  const fire = (cta) => track(EVENTS.ARTICLE_CTA_CLICK, { slug: article.slug, cert: match?.cert ?? 'none', cta });

  const TrialButton = (
    <a
      href={`${APP_ORIGIN}/subscription`}
      onClick={() => fire('trial')}
      className="btn-primary inline-flex items-center gap-2"
    >
      <Sparkles className="w-4 h-4" /> Start a free trial <ArrowRight className="w-4 h-4" />
    </a>
  );

  const LabButton = (
    <Link
      to="/try"
      onClick={() => fire('lab')}
      className={labFirst
        ? 'btn-primary inline-flex items-center gap-2'
        : 'inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200'}
    >
      <Terminal className="w-4 h-4" /> Try a lab free — no signup
    </Link>
  );

  return (
    <aside className="mt-10 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.08] to-indigo-500/[0.05] p-6 sm:p-8">
      <h2 className="text-xl font-bold text-white mb-2">{heading}</h2>
      <p className="text-slate-400 leading-relaxed mb-5 max-w-2xl">{body}</p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {labFirst ? <>{LabButton}{TrialButton}</> : <>{TrialButton}{LabButton}</>}
      </div>
    </aside>
  );
}
