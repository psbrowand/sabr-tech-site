// ─────────────────────────────────────────────────────────────────────────────
// scripts/prerender.mjs
//
// Post-build static prerender for the Vite SPA (runs via npm "postbuild").
//
// Problem: every route serves the same dist/index.html, so crawlers and
// social-preview scrapers see the homepage <title>/OG tags on every URL.
// Google renders JS eventually; Bing, LinkedIn, Slack, etc. mostly don't.
//
// Fix: for each route we copy dist/index.html, rewrite the <head> (title,
// description, canonical, Open Graph, Twitter, keywords), and write it to
// dist/<route>/index.html. Vercel checks the filesystem before applying
// the SPA rewrite, so these static files win for exact-path requests while
// client-side navigation continues to work untouched.
//
// Article routes additionally get NewsArticle JSON-LD and lose the
// SoftwareApplication block (marked with prerender:landing-only comments
// in index.html) — product pricing markup doesn't belong on news pages.
// ─────────────────────────────────────────────────────────────────────────────

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT     = join(__dirname, '..');
const DIST     = join(ROOT, 'dist');
const SITE_URL = 'https://sabr-labs.com';
const LOGO_URL = `${SITE_URL}/sabr-logo.png`;

const LANDING_ONLY_RE =
  /[ \t]*<!-- prerender:landing-only:start[\s\S]*?prerender:landing-only:end -->\n?/;

function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

// Replace the content="" of a <meta> identified by name= or property=.
function setMetaTag(html, attr, key, value) {
  const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`);
  if (!re.test(html)) {
    // Tag missing from template — insert before </head> instead of silently skipping.
    return html.replace('</head>', `    <meta ${attr}="${key}" content="${esc(value)}" />\n  </head>`);
  }
  return html.replace(re, `$1${esc(value)}$2`);
}

function renderHead(template, page) {
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`);
  html = setMetaTag(html, 'name', 'description', page.description);
  html = html.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
    `$1${esc(page.url)}$2`
  );

  html = setMetaTag(html, 'property', 'og:title',       page.title);
  html = setMetaTag(html, 'property', 'og:description', page.description);
  html = setMetaTag(html, 'property', 'og:type',        page.ogType || 'website');
  html = setMetaTag(html, 'property', 'og:url',         page.url);
  html = setMetaTag(html, 'property', 'og:image',       page.image || LOGO_URL);
  html = setMetaTag(html, 'name', 'twitter:title',       page.title);
  html = setMetaTag(html, 'name', 'twitter:description', page.description);
  html = setMetaTag(html, 'name', 'twitter:image',       page.image || LOGO_URL);

  if (page.keywords) html = setMetaTag(html, 'name', 'keywords', page.keywords);

  // Non-landing routes: drop the SoftwareApplication/pricing block.
  if (page.path !== '/') html = html.replace(LANDING_ONLY_RE, '');

  if (page.jsonLd) {
    const blocks = (Array.isArray(page.jsonLd) ? page.jsonLd : [page.jsonLd])
      .map((obj) =>
        `    <script type="application/ld+json">\n` +
        `    ${JSON.stringify(obj)}\n` +
        `    </script>\n`
      )
      .join('');
    html = html.replace('</head>', `${blocks}  </head>`);
  }

  return html;
}

function articleJsonLd(a) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: a.title,
    description: a.summary,
    image: [a.image],
    datePublished: a.publishedAt,
    dateModified: a.publishedAt,
    author: [{ '@type': 'Person', name: a.author }],
    publisher: {
      '@type': 'Organization',
      name: 'Sabr Learning Labs',
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    mainEntityOfPage: `${SITE_URL}/article/${a.slug}`,
    articleSection: a.category,
    keywords: (a.tags || []).join(', '),
  };
}

function certJsonLd(c, faqs) {
  const course = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${c.name} (${c.code}) Practice Test`,
    description: c.intro,
    provider: {
      '@type': 'Organization',
      name: 'Sabr Learning Labs',
      sameAs: SITE_URL,
    },
    about: `${c.name} certification exam preparation`,
    educationalLevel: c.exam.level,
    url: `${SITE_URL}/practice/${c.slug}`,
  };
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  // Multiple JSON-LD blocks are allowed; emit as an array.
  return [course, faqPage];
}

async function main() {
  const template = await readFile(join(DIST, 'index.html'), 'utf8');
  const { articles } = await import(pathToFileURL(join(ROOT, 'src', 'data', 'articles.js')).href);
  const { CERTS, allFaqs } = await import(pathToFileURL(join(ROOT, 'src', 'data', 'certPrep.js')).href);

  const DESC_NEWS =
    'Daily cyber, tech, and AI news written for working IT people: incidents, CVEs, vendor moves, and certification changes, with sources cited.';

  const staticPages = [
    {
      path: '/try',
      title: 'Try a Free Network Lab — No Signup | Sabr Learning Labs',
      description:
        'Run a real graded network simulator lab in your browser right now. Bring an interface back to life on an Aruba switch — free, no account required.',
    },
    {
      path: '/compare/boson-netsim-alternative',
      title: 'Boson NetSim Alternative — Multi-Vendor Network Labs in Your Browser | Sabr Learning Labs',
      description:
        'Comparing Boson NetSim and Sabr Learning Labs for cert prep? An honest, factual side-by-side: vendors covered, pricing model, what each subscription includes, and who each tool actually fits.',
    },
    {
      path: '/compare/packet-tracer-alternative',
      title: 'Cisco Packet Tracer Alternative — Graded Multi-Vendor Labs, No Install | Sabr Learning Labs',
      description:
        'Packet Tracer vs Sabr Learning Labs, honestly compared: install and account requirements, vendor coverage, lab grading, and when the free Cisco tool is genuinely the right call.',
    },
    {
      path: '/news',
      title: 'Cyber & Tech News | Sabr Learning Labs',
      description: DESC_NEWS,
    },
    {
      path: '/tech-news',
      title: 'Tech News | Sabr Learning Labs',
      description:
        'Product launches and industry moves that matter to IT professionals: what shipped, what changed, and what it means for the category.',
    },
    {
      path: '/ai-news',
      title: 'AI News | Sabr Learning Labs',
      description:
        'AI news without the hype: model releases, benchmarks in context, and what actually changes for people who build and run systems.',
    },
    {
      path: '/cyber-security',
      title: 'Cybersecurity News | Sabr Learning Labs',
      description:
        'Incidents, CVEs, patches, and threat activity, reported with the details practitioners need: affected versions, exploitation status, and fixes.',
    },
    {
      path: '/learning',
      title: 'IT Certification Guides & Study Advice | Sabr Learning Labs',
      description:
        'Honest, practical guidance on IT certifications: which certs are worth it, how hard the exams really are, and how to study for CompTIA, Cisco, Aruba, Juniper, and more.',
    },
    {
      path: '/about',
      title: 'About | Sabr Learning Labs',
      description:
        'Sabr Learning Labs builds adaptive IT certification prep: practice exams, flashcards, graded network simulator labs, and daily tech news.',
    },
    {
      path: '/contact',
      title: 'Contact | Sabr Learning Labs',
      description: 'Get in touch with Sabr Learning Labs: support, feedback, and editorial inquiries.',
    },
    {
      path: '/newsletter',
      title: 'Newsletter | Sabr Learning Labs',
      description: 'Get the day’s top cyber and tech stories plus certification news in one short daily email.',
    },
    {
      path: '/qod',
      title: 'Question of the Day | Sabr Learning Labs',
      description: 'A fresh certification practice question every day, with a full explanation of the right and wrong answers.',
    },
    {
      path: '/privacy',
      title: 'Privacy Policy | Sabr Learning Labs',
      description: 'How Sabr Learning Labs collects, uses, and protects your data.',
    },
    {
      path: '/terms',
      title: 'Terms of Service | Sabr Learning Labs',
      description: 'The terms that govern your use of Sabr Learning Labs.',
    },
    {
      path: '/refund',
      title: 'Refund Policy | Sabr Learning Labs',
      description: 'Sabr Learning Labs refund and cancellation policy.',
    },
  ].map((p) => ({ ...p, url: `${SITE_URL}${p.path}` }));

  const articlePages = articles
    .filter((a) => a && a.slug && a.title)
    .map((a) => ({
      path: `/article/${a.slug}`,
      url: `${SITE_URL}/article/${a.slug}`,
      title: `${a.title} | Sabr Cyber & Tech News`,
      description: a.summary,
      image: a.image,
      ogType: 'article',
      keywords: (a.tags || []).join(', '),
      jsonLd: articleJsonLd(a),
    }));

  // Per-cert practice-test landing pages (organic-search front door).
  const practiceIndex = {
    path: '/practice',
    url: `${SITE_URL}/practice`,
    title: 'IT Certification Practice Tests & Exam Questions | Sabr Learning Labs',
    description:
      'Free-trial practice tests for CompTIA, Cisco, AWS, Microsoft, Google Cloud, ISC2, Aruba, and Juniper certifications — exam-style questions with full explanations, flashcards, timed exam simulation, and hands-on labs.',
    keywords: 'IT certification practice test, practice exam questions, CompTIA, Cisco, AWS, Microsoft, Google Cloud practice tests',
  };
  const certPages = CERTS.map((c) => ({
    path: `/practice/${c.slug}`,
    url: `${SITE_URL}/practice/${c.slug}`,
    title: `${c.name} Practice Test — ${c.pool} ${c.code} Exam Questions | Sabr`,
    description:
      `${c.name} (${c.code}) practice tests and exam questions with full explanations, cited to the official objectives` +
      `${c.labs ? ', plus hands-on labs' : ''}. ${c.pool} questions, ${c.flashcards} flashcards, timed exam simulation, and a 7-day free trial.`,
    keywords: `${c.name} practice test, ${c.code} practice questions, ${c.name} exam questions, ${c.name} practice exam, ${c.vendor} certification`,
    jsonLd: certJsonLd(c, allFaqs(c)),
  }));

  const pages = [...staticPages, practiceIndex, ...certPages, ...articlePages];

  for (const page of pages) {
    const html  = renderHead(template, page);
    const parts = page.path.split('/').filter(Boolean);

    // Flat file (article/foo.html) — what Vercel's cleanUrls serves for
    // /article/foo. Directory index (article/foo/index.html) covers
    // trailing-slash requests and other static hosts.
    const flat = join(DIST, ...parts.slice(0, -1), `${parts[parts.length - 1]}.html`);
    await mkdir(dirname(flat), { recursive: true });
    await writeFile(flat, html, 'utf8');

    const outDir = join(DIST, ...parts);
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, 'index.html'), html, 'utf8');
  }

  console.log(`[prerender] wrote ${pages.length} routes (${articlePages.length} articles) → dist/`);
}

main().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
