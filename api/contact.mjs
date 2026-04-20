// ─────────────────────────────────────────────────────────────────────────────
// /api/contact — Vercel serverless endpoint
//
// POST { name, email, subject, message } → delivers the submission to
// CONTACT_EMAIL_TO via Resend transactional email. Replies go direct to the
// visitor's address via the Reply-To header.
// ─────────────────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO || 'contact@sabr-labs.com';
  const from = process.env.CONTACT_EMAIL_FROM || 'SABR Contact <contact@sabr-labs.com>';
  if (!apiKey) {
    return res.status(500).json({ error: 'Contact form is not configured yet.' });
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

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 200) : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 254) : '';
  const subject = typeof body.subject === 'string' ? body.subject.trim().slice(0, 200) : '';
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 10_000) : '';

  if (!name || !EMAIL_RE.test(email) || !message) {
    return res.status(400).json({ error: 'Name, a valid email, and a message are required.' });
  }

  const subjectLine = subject
    ? `[sabr-labs.com] ${subject}`
    : `[sabr-labs.com] Contact form submission from ${name}`;

  const text = [
    `From: ${name} <${email}>`,
    subject ? `Subject: ${subject}` : null,
    '',
    message,
  ].filter(Boolean).join('\n');

  const html = `
    <div style="font-family: -apple-system, 'Segoe UI', sans-serif; max-width: 560px;">
      <p style="margin: 0 0 8px; color: #334155; font-size: 13px;">
        <strong>From:</strong> ${escape(name)} &lt;${escape(email)}&gt;
      </p>
      ${subject ? `<p style="margin: 0 0 8px; color: #334155; font-size: 13px;"><strong>Subject:</strong> ${escape(subject)}</p>` : ''}
      <hr style="margin: 16px 0; border: none; border-top: 1px solid #e5e7eb;" />
      <div style="white-space: pre-wrap; font-size: 14px; color: #0f172a; line-height: 1.55;">
        ${escape(message)}
      </div>
    </div>
  `;

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: subjectLine,
        text,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.json().catch(() => ({}));
      console.error('[contact] resend error', resendRes.status, errBody);
      return res.status(502).json({ error: 'We couldn\'t deliver your message right now. Please try again.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[contact] exception', err);
    return res.status(502).json({ error: 'We couldn\'t deliver your message right now. Please try again.' });
  }
}
