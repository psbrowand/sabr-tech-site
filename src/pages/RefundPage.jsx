// ─────────────────────────────────────────────────────────────────────────────
// RefundPage.jsx — Refund Policy (/refund)
//
// Migrated from the SABR Learning Next.js app. Linked from Terms §3 and from
// Stripe Checkout. A lawyer review is still pending before v1.0.
// ─────────────────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const APP_ORIGIN = import.meta.env.VITE_APP_ORIGIN || 'https://app.sabr-labs.com';

export default function RefundPage() {
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
            Refund Policy
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-mono">Last updated: April 20, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. How subscriptions work</h2>
          <p className="text-sm leading-relaxed">
            SABR Learning runs on month-to-month subscriptions billed in
            advance via Stripe. You can cancel at any time from your{' '}
            <a
              href={`${APP_ORIGIN}/settings`}
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              account settings
            </a>
            . Cancelling stops the next renewal — you keep access until the end
            of the billing period you&apos;ve already paid for.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Our default policy</h2>
          <p className="text-sm leading-relaxed">
            We generally don&apos;t issue refunds for time already elapsed on a
            subscription. That&apos;s because you had continuous access to the
            Service during that period, and because cancelling is a one-click
            action you can do at any time.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. When we do issue refunds</h2>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>
              <strong className="text-slate-200">Duplicate or accidental charges:</strong>{' '}
              full refund.
            </li>
            <li>
              <strong className="text-slate-200">Unauthorized charges:</strong>{' '}
              full refund, and we&apos;ll help you secure your account.
            </li>
            <li>
              <strong className="text-slate-200">Service unavailable:</strong>{' '}
              if a significant outage or bug blocked you from using the
              Service, tell us — we&apos;ll pro-rate or refund as appropriate.
            </li>
            <li>
              <strong className="text-slate-200">Charged after cancellation:</strong>{' '}
              if you cancelled but were billed for the next period, full refund.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. How to request a refund</h2>
          <p className="text-sm leading-relaxed">
            Open a ticket via the{' '}
            <Link to="/contact" className="text-cyan-400 hover:text-cyan-300 underline">
              contact form
            </Link>{' '}
            and include the date of the charge and the email on the account.
            We aim to respond within two business days. Approved refunds post
            back to the original payment method within 5–10 business days
            (Stripe&apos;s standard timing).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Chargebacks</h2>
          <p className="text-sm leading-relaxed">
            Please talk to us before filing a chargeback with your bank —
            it&apos;s almost always faster to resolve directly, and filing a
            chargeback without contacting us may result in the associated
            account being suspended until the dispute is resolved.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">6. Annual / promo plans</h2>
          <p className="text-sm leading-relaxed">
            We may run annual or discounted promotional plans from time to
            time. Those are priced on the assumption they&apos;re
            non-refundable past the first 7 days — the specific refund window
            will be shown at checkout and in the receipt. Otherwise the policy
            above applies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">7. Contact</h2>
          <p className="text-sm leading-relaxed">
            Questions about a charge? Open a ticket via the{' '}
            <Link to="/contact" className="text-cyan-400 hover:text-cyan-300 underline">
              contact form
            </Link>{' '}
            and we&apos;ll sort it out. You can also write to us at:
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
