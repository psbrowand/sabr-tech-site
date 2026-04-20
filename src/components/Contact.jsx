import { useState } from 'react';
import { Mail, PhoneCall, MapPin, Send, ArrowRight, CheckCircle } from 'lucide-react';
import FadeIn from './FadeIn';

// ─── Contact info — update before launch ──────────────────────────
const CONTACT_INFO = {
  email:      'contact@sabrtechnologies.com',  // ← update
  phone:      '(208) 555-1234',                // ← update
  serviceArea: 'North Idaho & Eastern Washington',
};

// ─── Service options for the dropdown ─────────────────────────────
const SERVICE_OPTIONS = [
  'Fully Managed Network Services',
  '24/7 Monitoring & Alerting',
  'Security Visibility / Log Monitoring',
  'Video Surveillance Network Support',
  'VoIP / Business Communications Support',
  'Wireless Site Survey',
  'Professional Services / Deployment',
  'Other / Not Sure Yet',
];

const INITIAL_FORM = {
  name:    '',
  org:     '',
  email:   '',
  phone:   '',
  service: '',
  message: '',
  type:    'consultation', // consultation | quote | survey
};

export default function Contact() {
  const [form,      setForm]      = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [sending,   setSending]   = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ─── Form submission handler ──────────────────────────────────────
  // Replace the mock below with your actual form handler / API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // TODO: wire up to your backend, Formspree, or other service
    await new Promise((r) => setTimeout(r, 1000)); // mock delay
    setSubmitted(true);
    setSending(false);
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-3">
              Get in Touch
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-4">
              Let's modernize your network.
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Tell us about your environment and what you're looking for. We'll be in
              touch within one business day.
            </p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* ── Left: contact info ───────────────────────────────────── */}
          <FadeIn className="lg:col-span-2">
            <div className="space-y-6">

              {/* Quick CTA buttons */}
              <div className="space-y-3">
                {[
                  { label: 'Request a Consultation', type: 'consultation' },
                  { label: 'Request a Site Survey',  type: 'survey' },
                  { label: 'Get a Quote',             type: 'quote' },
                ].map(({ label, type }) => (
                  <button
                    key={type}
                    onClick={() => setForm((p) => ({ ...p, type }))}
                    className={`w-full flex items-center justify-between gap-2 px-5 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200
                      ${form.type === type
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                        : 'bg-navy-800 border-white/8 text-slate-300 hover:border-white/15'
                      }`}
                  >
                    {label}
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </button>
                ))}
              </div>

              {/* Contact details */}
              <div className="rounded-2xl border border-white/6 bg-navy-800 p-6 space-y-4">
                <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-5">
                  Contact Details
                </p>

                {/* ── Update email/phone/area before launch ── */}
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-3 text-sm text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  {CONTACT_INFO.email}
                </a>

                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-3 text-sm text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <PhoneCall className="w-4 h-4 text-cyan-400" />
                  </div>
                  {CONTACT_INFO.phone}
                </a>

                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                  </div>
                  {CONTACT_INFO.serviceArea}
                </div>
              </div>

              {/* Response promise */}
              <p className="text-xs text-slate-600 text-center px-4">
                We respond to all inquiries within one business day.
                No pressure, no hard sell — just a real conversation.
              </p>
            </div>
          </FadeIn>

          {/* ── Right: form ───────────────────────────────────────────── */}
          <FadeIn delay={150} className="lg:col-span-3">
            <div className="rounded-2xl border border-white/6 bg-navy-800 p-6 lg:p-8">
              {submitted ? (
                /* Success state */
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100">Message received!</h3>
                  <p className="text-sm text-slate-400 max-w-xs">
                    Thank you for reaching out. We'll be in touch within one business day.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm(INITIAL_FORM); }}
                    className="btn-ghost text-xs mt-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-medium text-slate-400 mb-1.5">
                        Your Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="name" name="name" type="text" required
                        placeholder="Jane Smith"
                        value={form.name} onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="org" className="block text-xs font-medium text-slate-400 mb-1.5">
                        Organization
                      </label>
                      <input
                        id="org" name="org" type="text"
                        placeholder="Acme Corp / City of Coeur d'Alene"
                        value={form.org} onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-1.5">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="email" name="email" type="email" required
                        placeholder="jane@example.com"
                        value={form.email} onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium text-slate-400 mb-1.5">
                        Phone
                      </label>
                      <input
                        id="phone" name="phone" type="tel"
                        placeholder="(208) 555-0000"
                        value={form.phone} onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="service" className="block text-xs font-medium text-slate-400 mb-1.5">
                      Service of Interest
                    </label>
                    <select
                      id="service" name="service"
                      value={form.service} onChange={handleChange}
                      className="form-input appearance-none bg-navy-800"
                    >
                      <option value="">Select a service…</option>
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-xs font-medium text-slate-400 mb-1.5">
                      Tell us about your environment <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="message" name="message" required rows={5}
                      placeholder="Briefly describe your current setup, main pain points, or what you're hoping to accomplish…"
                      value={form.message} onChange={handleChange}
                      className="form-input resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
