import { Star, Quote } from 'lucide-react';
import FadeIn from './FadeIn';

// ─── Testimonial placeholders ──────────────────────────────────────
// Replace with real customer quotes. Remove this section if not ready.
// Fields: quote, name, title, org, stars (1–5)
const TESTIMONIALS = [
  {
    quote:  'Sabr Technologies completely transformed how we think about our network. Before, we had no real visibility — now we know immediately if something isn\'t right. The difference is night and day.',
    name:   'Operations Manager',
    title:  'Small Business',
    org:    'North Idaho',
    stars:  5,
  },
  {
    quote:  'The site survey alone saved us from a bad deployment. They found coverage gaps we never would have caught on our own. Installation was clean, professional, and done exactly as planned.',
    name:   'IT Coordinator',
    title:  'Local School District',
    org:    'Eastern Washington',
    stars:  5,
  },
  {
    quote:  'I finally feel like I have a real technology partner — not just a vendor. They explain things clearly, they respond quickly, and they\'ve been genuinely invested in making sure our network works.',
    name:   'Executive Director',
    title:  'Nonprofit Organization',
    org:    'Inland Northwest',
    stars:  5,
  },
];

function Stars({ count }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < count ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-cyan-500 mb-3">
              Client Feedback
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-50">
              What clients are saying.
            </h2>
          </div>
        </FadeIn>

        {/* Testimonial cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ quote, name, title, org, stars }, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="group h-full rounded-2xl border border-white/6 bg-navy-800 hover:border-cyan-500/15 transition-colors duration-300 p-6 flex flex-col">

                {/* Quote icon */}
                <Quote className="w-6 h-6 text-cyan-500/30 mb-4" />

                {/* Quote text */}
                <p className="text-sm text-slate-300 leading-relaxed flex-1 mb-6 italic">
                  "{quote}"
                </p>

                {/* Attribution */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{name}</p>
                    <p className="text-xs text-slate-500">{title} · {org}</p>
                  </div>
                  <Stars count={stars} />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Disclaimer for placeholder state */}
        {/* ─── Remove the note below once you have real testimonials ── */}
        <FadeIn delay={300}>
          <p className="mt-8 text-center text-xs text-slate-600">
            * Testimonials shown are representative placeholders. Replace with verified client quotes before launch.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
