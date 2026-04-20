// ─────────────────────────────────────────────────────────────────────────────
// /api/newsletter-subscribe — Vercel serverless endpoint
//
// POST { email } → creates a contact in the configured Resend Audience.
//
// No Resend SDK — single REST call keeps the function cold-start tiny. Returns
// a generic success for both "new contact" and "already subscribed" so the
// client never needs to distinguish (Resend's duplicate behavior varies a bit
// by plan).
// ─────────────────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
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

  try {
    const resendRes = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      }
    );

    // Resend returns 200 for new, or an error for duplicate. Duplicates still
    // mean "subscribed" from the user's perspective, so fold them into success.
    if (resendRes.ok) return res.status(200).json({ ok: true });

    const errBody = await resendRes.json().catch(() => ({}));
    const message = typeof errBody.message === 'string' ? errBody.message : '';
    if (/already exists|duplicate/i.test(message)) {
      return res.status(200).json({ ok: true, alreadySubscribed: true });
    }

    console.error('[newsletter-subscribe] resend error', resendRes.status, errBody);
    return res.status(502).json({ error: 'We couldn\'t subscribe you right now. Please try again.' });
  } catch (err) {
    console.error('[newsletter-subscribe] exception', err);
    return res.status(502).json({ error: 'We couldn\'t subscribe you right now. Please try again.' });
  }
}
