// ─────────────────────────────────────────────────────────────────────────────
// TermsPage.jsx — Terms of Service (/terms)
//
// Migrated from the SABR Learning Next.js app as part of the umbrella move.
// Stripe Checkout requires a link to this page during purchase. A lawyer
// review is still pending before v1.0.
// ─────────────────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-mono">Last updated: April 20, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Acceptance</h2>
          <p className="text-sm leading-relaxed">
            By creating an account or using SABR Learning (&quot;the
            Service&quot;), you agree to these Terms. If you don&apos;t agree,
            don&apos;t use the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Accounts</h2>
          <p className="text-sm leading-relaxed">
            You must provide accurate information, keep your password secure,
            and are responsible for all activity under your account. One
            account per person. Accounts may be suspended for abuse,
            fraudulent payment, or violations of these Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Subscriptions &amp; billing</h2>
          <p className="text-sm leading-relaxed">
            Paid plans are billed monthly in advance via Stripe. You may cancel
            at any time from the subscription page; cancellation takes effect
            at the end of the current billing period and you retain access
            until then. Refunds are handled per our{' '}
            <Link to="/refund" className="text-cyan-400 hover:text-cyan-300 underline">
              refund policy
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Content &amp; study materials</h2>
          <p className="text-sm leading-relaxed">
            Practice questions, flashcards, and study guides are for personal
            study only. You may not resell, redistribute, or publicly post
            them. We don&apos;t claim affiliation with any certification
            vendor, and passing our practice tests does not guarantee success
            on any official exam.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. User-submitted content</h2>
          <p className="text-sm leading-relaxed">
            Forum posts, support tickets, and activity-feed entries are your
            responsibility. By posting you grant us a non-exclusive license to
            display that content inside the Service. Don&apos;t post anything
            illegal, harassing, or that infringes someone else&apos;s rights.
            We may remove content or accounts that violate this at our
            discretion.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">6. Disclaimer</h2>
          <p className="text-sm leading-relaxed">
            The Service is provided &quot;as is&quot; without warranty of any
            kind. We do our best to keep the content accurate and the service
            available, but we don&apos;t guarantee it. To the maximum extent
            permitted by law, our liability is limited to the fees you paid in
            the 12 months preceding the claim.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">7. Changes</h2>
          <p className="text-sm leading-relaxed">
            We may update these Terms. Material changes will be announced by
            email or in-app. Continued use after the update means you accept
            the new Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">8. Governing law</h2>
          <p className="text-sm leading-relaxed">
            These Terms are governed by the laws of the State of Idaho, USA,
            without regard to conflict-of-law principles. Any dispute not
            resolved informally will be handled in the state or federal courts
            located in Kootenai County, Idaho.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">9. Contact</h2>
          <p className="text-sm leading-relaxed">
            Questions? Use the{' '}
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
