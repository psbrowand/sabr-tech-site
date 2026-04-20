// ContactPage.jsx — Contact form and information
import { useState } from 'react';
import { Mail, Shield, AlertTriangle, MessageSquare, Send, Globe, Twitter, Linkedin, CheckCircle } from 'lucide-react';

const contactTypes = [
  { value: 'tips',      label: 'News Tips / Story Tip',        icon: AlertTriangle },
  { value: 'security',  label: 'Security Vulnerability Report', icon: Shield },
  { value: 'press',     label: 'Press & Media Inquiry',         icon: Globe },
  { value: 'feedback',  label: 'Feedback / Corrections',        icon: MessageSquare },
  { value: 'other',     label: 'General Contact',               icon: Mail },
];

export default function ContactPage() {
  const [form, setForm]     = useState({ type: '', name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.type)    e.type    = 'Please select a contact type.';
    if (!form.name.trim())  e.name = 'Name is required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required.';
    if (!form.subject.trim()) e.subject = 'Subject is required.';
    if (form.message.trim().length < 20) e.message = 'Message must be at least 20 characters.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');

    // TODO: POST to backend — e.g. a serverless function, Formspree, EmailJS, etc.
    // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(form) });

    await new Promise(r => setTimeout(r, 900));
    setStatus('success');
  };

  return (
    <div className="container-site py-12">
      {/* Header */}
      <div className="max-w-2xl mb-12">
        <div className="section-label mb-3">
          <Mail className="w-3.5 h-3.5" />
          Contact
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Get in Touch</h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Have a story tip, a vulnerability to report, or want to connect? Fill out the form below and we'll respond within one business day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        {/* Form */}
        <div>
          {status === 'success' ? (
            <div className="card p-10 text-center">
              <CheckCircle className="w-14 h-14 text-cyan-400 mx-auto mb-5" />
              <h2 className="text-2xl font-bold text-white mb-3">Message Sent</h2>
              <p className="text-slate-400 mb-6">
                Thanks for reaching out. We'll respond to <strong className="text-slate-200">{form.email}</strong> within one business day.
              </p>
              <button
                onClick={() => { setStatus('idle'); setForm({ type: '', name: '', email: '', subject: '', message: '' }); }}
                className="btn-ghost"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-6" noValidate>
              {/* Contact type */}
              <div>
                <label className="block text-xs text-slate-400 mb-2 font-medium">
                  Type of Inquiry <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {contactTypes.map(({ value, label, icon: Icon }) => (
                    <label
                      key={value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        form.type === value
                          ? 'border-cyan-500/50 bg-cyan-500/5 text-cyan-400'
                          : 'border-white/[0.06] hover:border-white/20 text-slate-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={value}
                        checked={form.type === value}
                        onChange={e => update('type', e.target.value)}
                        className="sr-only"
                      />
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs font-medium">{label}</span>
                    </label>
                  ))}
                </div>
                {errors.type && <p className="text-xs text-red-400 mt-1.5">{errors.type}</p>}
              </div>

              {/* Name + Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Name <span className="text-red-400">*</span></label>
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" className={`input-cyber ${errors.name ? 'border-red-500/40' : ''}`} />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email <span className="text-red-400">*</span></label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" className={`input-cyber ${errors.email ? 'border-red-500/40' : ''}`} />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Subject <span className="text-red-400">*</span></label>
                <input type="text" value={form.subject} onChange={e => update('subject', e.target.value)} placeholder="Brief subject line" className={`input-cyber ${errors.subject ? 'border-red-500/40' : ''}`} />
                {errors.subject && <p className="text-xs text-red-400 mt-1">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Message <span className="text-red-400">*</span></label>
                <textarea
                  value={form.message}
                  onChange={e => update('message', e.target.value)}
                  placeholder="Tell us what's on your mind…"
                  rows={6}
                  className={`input-cyber resize-none ${errors.message ? 'border-red-500/40' : ''}`}
                />
                {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
              </div>

              {/* Security disclosure notice */}
              {form.type === 'security' && (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-400/80">
                  <strong className="text-amber-400">Security Disclosure:</strong> For responsible vulnerability disclosure, please include: affected vendor/product, CVE if assigned, proof-of-concept details, and your PGP key if you'd like an encrypted response. We follow a 30-day disclosure timeline by default.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full justify-center"
              >
                {status === 'loading' ? 'Sending…' : 'Send Message'}
                {status !== 'loading' && <Send className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>

        {/* Info column */}
        <aside className="space-y-5">
          <div className="card p-5">
            <h3 className="text-sm font-bold text-slate-200 mb-4">Direct Contact</h3>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-xs text-slate-600 mb-0.5">Editorial Tips</dt>
                <dd className="text-cyan-400">tips@sabrcybertech.com</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-600 mb-0.5">Security Disclosures</dt>
                <dd className="text-cyan-400">security@sabrcybertech.com</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-600 mb-0.5">Press & Partnerships</dt>
                <dd className="text-cyan-400">press@sabrcybertech.com</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-600 mb-0.5">Response Time</dt>
                <dd className="text-slate-400">Within 1 business day</dd>
              </div>
            </dl>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold text-slate-200 mb-4">Follow Us</h3>
            <div className="space-y-2">
              {[
                { icon: Twitter, label: '@SabrCyberTech', platform: 'Twitter / X', href: '#' },
                { icon: Linkedin, label: 'Sabr Cyber & Tech', platform: 'LinkedIn', href: '#' },
              ].map(({ icon: Icon, label, platform, href }) => (
                <a
                  key={platform}
                  href={href}
                  className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] hover:border-cyan-500/20 transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  <div>
                    <p className="text-xs font-medium text-slate-300">{platform}</p>
                    <p className="text-[11px] text-slate-600">{label}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-5">
            <Shield className="w-6 h-6 text-cyan-400 mb-3" />
            <h3 className="text-sm font-bold text-slate-200 mb-2">Confidential Tips</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              For anonymous source protection, we support encrypted communication via Signal. Contact us first to establish a secure channel before sharing sensitive materials.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
