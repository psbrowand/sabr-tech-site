// ─────────────────────────────────────────────────────────────────────────────
// PrivacyPage.jsx — Privacy Policy (/privacy)
//
// Migrated from the SABR Learning Next.js app as part of the umbrella move.
// Published on the umbrella origin because that's where Stripe Checkout's
// privacy link and anyone researching the product before signing up will
// land. A lawyer review is still pending before v1.0 — keep this page in
// sync with actual data flows (cookie banner, analytics consent, sub-
// processors).
// ─────────────────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="container-site py-12">
      <div className="max-w-3xl mx-auto space-y-6 text-slate-300">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to SABR
        </Link>

        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-mono">Last updated: April 20, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. What we collect</h2>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>
              <strong className="text-slate-200">Account info:</strong> email,
              display name, hashed password.
            </li>
            <li>
              <strong className="text-slate-200">Study data:</strong> certs
              you&apos;re tracking, topic progress, practice scores, flashcard
              status, notes.
            </li>
            <li>
              <strong className="text-slate-200">Billing info:</strong> Stripe
              handles card numbers; we only store your Stripe customer ID,
              subscription status, and price ID.
            </li>
            <li>
              <strong className="text-slate-200">Newsletter subscribers:</strong>{' '}
              email address and, optionally, a display name — managed by Resend
              on our behalf.
            </li>
            <li>
              <strong className="text-slate-200">Operational data:</strong>{' '}
              server logs (IP, user agent, request timestamps) for debugging
              and abuse prevention.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. How we use it</h2>
          <p className="text-sm leading-relaxed">
            We use your data to run the Service, keep your account secure,
            process payments, send transactional email (verification codes,
            password resets, subscription receipts), deliver the newsletter if
            you subscribed, and improve the product. We do not sell your data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Third parties</h2>
          <p className="text-sm">We use these sub-processors to operate:</p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Stripe (payments)</li>
            <li>Resend (transactional email + newsletter broadcasts)</li>
            <li>
              Vercel (hosting, and — only if you accept cookies —
              privacy-friendly analytics and performance metrics)
            </li>
            <li>Turso (managed database)</li>
            <li>Upstash (rate-limit counters)</li>
            <li>
              OpenAI / Anthropic (AI study-plan and tutor features; prompts
              and responses are processed but not used to train their models)
            </li>
            <li>
              Google AdSense (display advertising on the Free and Starter
              plans only — see §6 below; Pro and Premium users never receive
              AdSense tags)
            </li>
          </ul>
          <p className="text-sm leading-relaxed">
            Each is contractually bound to process data only on our behalf.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Your rights</h2>
          <p className="text-sm leading-relaxed">
            You can view and edit most of your data from your profile in the
            app. For deletion, or if you&apos;re covered by GDPR/CCPA and want
            to exercise a right (access, portability, erasure), reach us via
            the{' '}
            <Link to="/contact" className="text-cyan-400 hover:text-cyan-300 underline">
              contact form
            </Link>
            . We&apos;ll respond within 30 days.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Cookies</h2>
          <p className="text-sm leading-relaxed">
            We use a first-party cookie to keep you signed in to the app
            (NextAuth session). If you click <strong className="text-slate-200">Accept</strong>{' '}
            on the cookie banner, we also load Vercel Analytics, Speed
            Insights, and — on the Free and Starter plans — Google AdSense.
            Each drops cookies to measure aggregate usage or to serve relevant
            ads. If you click <strong className="text-slate-200">Reject</strong>, or dismiss
            the banner, no analytics or ad cookies are set; we fall back to
            non-personalized house ads on the Free plan and no third-party ads
            on Starter. We implement Google Consent Mode v2 so your choice is
            signaled to Google on every request.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">6. Advertising</h2>
          <p className="text-sm leading-relaxed">
            SABR Learning is funded primarily by subscriptions. To keep the
            Free plan genuinely free we also serve display advertising to
            Free-plan users via Google AdSense. Starter-plan users see only
            our own (non-tracking) upsell prompts. Pro and Premium plans are
            fully ad-free; no AdSense script is ever loaded for those
            accounts. Study sessions — practice questions, flashcards, and
            exams — are ad-free on every plan.
          </p>
          <p className="text-sm leading-relaxed">
            Google may use cookies or similar identifiers to personalize the
            ads you see, based on your prior visits to this and other sites,
            subject to your consent choice above. You can manage or opt out of
            Google&apos;s personalized advertising at any time at{' '}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              adssettings.google.com
            </a>
            , and review Google&apos;s own advertising policies at{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              policies.google.com/technologies/ads
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">7. Retention</h2>
          <p className="text-sm leading-relaxed">
            We keep account data until you delete your account. Billing records
            are kept as long as required by law (generally 7 years). Server
            logs are rotated after 30 days.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">8. Contact</h2>
          <p className="text-sm leading-relaxed">
            Questions? Reach us via the{' '}
            <Link to="/contact" className="text-cyan-400 hover:text-cyan-300 underline">
              contact form
            </Link>
            , or write to us at:
          </p>
          <p className="text-sm font-mono text-slate-400">
            Sabr Learning
            <br />
            310 Emerald Dr
            <br />
            Kellogg, ID 83837, USA
          </p>
        </section>
      </div>
    </div>
  );
}
