// ─────────────────────────────────────────────────────────────────────────────
// /api/newsletter-subscribe — Vercel serverless endpoint
//
// POST { email, source? } → creates a subscription on the configured Beehiiv
// publication. We send { email, reactivate_existing: true, send_welcome_email:
// true, utm_source: source ?? "sabr-labs.com" } so re-subscribes after a prior
// unsubscribe work without an error.
//
// No Beehiiv SDK — a single REST call keeps cold starts tiny.
//
// Migration note: this endpoint previously wrote to a Resend Audience. The
// cutover to Beehiiv happened with the newsletter plan; Resend still powers
// transactional email for the rest of the site.
// ─────────────────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !publicationId) {
    return res.status(500).json({ error: 'Newsletter is not configured yet.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body.' });
    }
  }
  body = body ?? {};

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Please enter a valid email.' });
  }

  // Free-form source tag so we can see in Beehiiv where signups came from
  // (footer, sidebar, /newsletter page, learning-app signup). Defaults to a
  // generic value to avoid blank UTMs.
  const rawSource = typeof body.source === 'string' ? body.source.trim().slice(0, 40) : '';
  const source = rawSource || 'sabr-labs.com';

  try {
    const beehiivRes = await fetch(
      `https://api.beehiiv.com/v2/publications/${encodeURIComponent(publicationId)}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: source,
          // Beehiiv supports referral tracking; leave blank for now.
        }),
      }
    );

    if (beehiivRes.ok) return res.status(200).json({ ok: true });

    // Beehiiv returns a duplicate error for already-subscribed contacts. Fold
    // that into a success — from the user's perspective they're subscribed.
    const errBody = await beehiivRes.json().catch(() => ({}));
    const message =
      (errBody && typeof errBody.message === 'string' && errBody.message) ||
      (errBody && typeof errBody.error === 'string' && errBody.error) ||
      '';
    if (/already|exist|duplicate/i.test(message)) {
      return res.status(200).json({ ok: true, alreadySubscribed: true });
    }

    console.error('[newsletter-subscribe] beehiiv error', beehiivRes.status, errBody);
    return res
      .status(502)
      .json({ error: "We couldn't subscribe you right now. Please try again." });
  } catch (err) {
    console.error('[newsletter-subscribe] exception', err);
    return res
      .status(502)
      .json({ error: "We couldn't subscribe you right now. Please try again." });
  }
}
