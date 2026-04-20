import { Zap, Mail, PhoneCall, MapPin, Linkedin, Twitter, Github, ArrowRight } from 'lucide-react';

// ─── Footer nav columns — add/remove sections as site grows ────────
const NAV_COLS = [
  {
    heading: 'Services',
    links: [
      { label: 'Managed Network Services', href: '#services' },
      { label: '24/7 Monitoring',          href: '#services' },
      { label: 'Security Visibility',      href: '#services' },
      { label: 'Video Surveillance',       href: '#services' },
      { label: 'VoIP Support',             href: '#services' },
      { label: 'Wireless Surveys',         href: '#services' },
      { label: 'Pro Services / Deploy',    href: '#services' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us',           href: '#about' },
      { label: 'Why Sabr Tech',      href: '#why-us' },
      { label: 'Our Process',        href: '#process' },
      { label: 'Public Sector',      href: '#sled' },
    ],
  },
  {
    heading: 'Get Started',
    links: [
      { label: 'Request a Consultation', href: '#contact' },
      { label: 'Request a Site Survey',  href: '#contact' },
      { label: 'Get a Quote',            href: '#contact' },
      { label: 'Contact Us',             href: '#contact' },
    ],
  },
];

// ─── Contact info — update before launch ──────────────────────────
const CONTACT = {
  email:      'contact@sabrtechnologies.com',
  phone:      '(208) 555-1234',
  serviceArea: 'North Idaho & Eastern Washington',
};

// ─── Social links — fill in real URLs or remove items before launch
const SOCIALS = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter,  href: '#', label: 'Twitter / X' },
];

// onOpenGame — callback passed from App.jsx to trigger the easter egg game
export default function Footer({ onOpenGame }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 border-t border-white/5">

      {/* ── Pre-footer CTA strip ──────────────────────────────────── */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-1">
                Ready to modernize your network?
              </h3>
              <p className="text-sm text-slate-400">
                Let's start with a free conversation about your environment.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a href="#contact" className="btn-ghost text-sm">
                Learn More
              </a>
              <a href="#contact" className="btn-primary text-sm">
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main footer ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            {/* Logo — replace with img tag when logo is ready */}
            <a href="#top" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-400" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-base text-slate-100">
                Sabr <span className="text-cyan-400">Technologies</span>
              </span>
            </a>

            {/* Brand statement */}
            <p className="text-sm text-slate-500 leading-relaxed mb-5 max-w-xs">
              Managed network infrastructure and professional services for businesses,
              schools, and organizations across North Idaho and Eastern Washington.
            </p>

            {/* Contact info */}
            <div className="space-y-2 mb-6">
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors">
                <Mail className="w-3.5 h-3.5" />
                {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phone.replace(/\D/g,'')}`} className="flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors">
                <PhoneCall className="w-3.5 h-3.5" />
                {CONTACT.phone}
              </a>
              <span className="flex items-center gap-2 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5" />
                {CONTACT.serviceArea}
              </span>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-white/8 bg-navy-800 hover:border-cyan-500/30 hover:text-cyan-400 text-slate-500 flex items-center justify-center transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map(({ heading, links }) => (
            <div key={heading} className="col-span-1">
              <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-4">
                {heading}
              </p>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-xs text-slate-500 hover:text-slate-200 transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © {year} Sabr Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* ── Add links to Privacy Policy / Terms before launch ── */}
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>

        {/* ── Easter egg — intentionally subtle ─────────────────────── */}
        {/* Hover to reveal the threat. Click to engage the firewall.   */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={onOpenGame}
            className="group flex items-center gap-2 text-[0.65rem] font-mono text-slate-800 hover:text-red-400 transition-all duration-300"
            title="Unauthorized access detected. Engage countermeasures."
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-40 group-hover:opacity-100 group-hover:animate-pulse transition-all" />
            <span className="group-hover:hidden tracking-widest">FIREWALL STATUS: IDLE</span>
            <span className="hidden group-hover:inline tracking-widest text-red-400">⚠ THREAT DETECTED — ENGAGE?</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-40 group-hover:opacity-100 group-hover:animate-pulse transition-all" />
          </button>
        </div>
      </div>
    </footer>
  );
}
