// DemoLabPage.jsx — /try
//
// Top-of-funnel: a real, graded network lab anyone can run with NO signup.
// The whole pitch ("a real CLI simulator that grades you live, in your
// browser, no install") is something competitors can't demo — so we let
// visitors *feel* it before asking for an account. We iframe the engine's
// beginner warm-up lab and listen for its postMessage events; the moment
// the visitor completes it, we surface a conversion CTA.

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Terminal, CheckCircle2, Sparkles, Network, Cpu,
} from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { useSeo } from '../lib/useSeo';
import { track, EVENTS } from '../lib/analytics';

const APP_ORIGIN = import.meta.env.VITE_APP_ORIGIN || 'https://app.sabr-labs.com';
const ENGINE_ORIGIN = import.meta.env.VITE_LAB_ENGINE_ORIGIN || 'https://aruba-lab-simulator.vercel.app';
// Beginner warm-up: bring two switch ports up, verify the hosts can ping.
// Two objectives, ~8 minutes, no prior config knowledge required.
const DEMO_LAB_ID = 'aruba-aca-iface-revival-01';

export default function DemoLabPage() {
  useSeo({
    title: 'Try a Free Network Lab Online — No Signup, No Install | Sabr Learning Labs',
    description:
      'Run a real, graded network lab right now — no account, no download, no install. A full Cisco IOS / Aruba CX / Junos CLI simulator in your browser that checks your work live. Hands-on practice for CCNA, Aruba, Juniper, and CompTIA Network+.',
  });

  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(null); // { passing, total }
  const firedStart = useRef(false);

  useEffect(() => {
    track(EVENTS.DEMO_LAB_VIEW, {});
    const onMessage = (e) => {
      if (e.origin !== ENGINE_ORIGIN) return;
      const msg = e.data;
      if (!msg || msg.source !== 'sabr-lab') return;
      if (msg.type === 'lab.started' && !firedStart.current) {
        firedStart.current = true;
        track(EVENTS.DEMO_LAB_STARTED, {});
      } else if (msg.type === 'lab.objective') {
        setProgress({ passing: msg.passing ?? 0, total: msg.total ?? 0 });
      } else if (msg.type === 'lab.completed') {
        setCompleted(true);
        track(EVENTS.DEMO_LAB_COMPLETED, { score: msg.score ?? 0 });
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative pt-16 pb-10 sm:pt-20">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(0,212,255,0.10) 0%, transparent 60%)',
          }}
        />
        <div className="container-site relative">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <div className="section-label justify-center mb-5">
                <Terminal className="w-3.5 h-3.5" />
                Live demo — no account needed
              </div>
            </FadeIn>
            <FadeIn delay={80}>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.08] mb-5">
                Configure a real network.{' '}
                <span className="text-gradient-cyan">Right now.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={160}>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                This is a live Aruba CX switch — the same CLI, the same behavior as
                the real hardware — running entirely in your browser. The two host
                PCs can&rsquo;t reach each other yet. Bring the switch ports up and
                watch the objectives grade themselves. No download. No install. No
                signup.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── The lab ── */}
      <section className="pb-8">
        <div className="container-site">
          <FadeIn delay={120}>
            <div className="rounded-xl border border-cyan-400/20 overflow-hidden bg-[#0a0f1c] shadow-2xl shadow-cyan-500/5">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                <span className="ml-3 text-xs text-slate-500 font-mono">
                  Interface revival · Aruba CX 6300
                </span>
                {progress && progress.total > 0 && (
                  <span className="ml-auto text-xs font-mono text-cyan-400">
                    Objectives {progress.passing}/{progress.total}
                  </span>
                )}
              </div>
              <iframe
                src={`${ENGINE_ORIGIN}/?embed=1&lab=${encodeURIComponent(DEMO_LAB_ID)}`}
                title="Free network lab demo"
                className="w-full"
                style={{ height: 'min(72vh, 760px)', border: 0, display: 'block' }}
                allow="clipboard-write"
              />
            </div>
          </FadeIn>

          <FadeIn delay={160}>
            <p className="text-center text-xs text-slate-600 mt-3">
              Stuck? Double-click the switch to open its terminal, then type{' '}
              <code className="text-slate-400">configure</code>,{' '}
              <code className="text-slate-400">interface 1/1/1</code>,{' '}
              <code className="text-slate-400">no shutdown</code> — repeat for{' '}
              <code className="text-slate-400">1/1/2</code>.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Conversion CTA (always present; intensifies on completion) ── */}
      <section className="py-12 border-t border-white/[0.06]">
        <div className="container-site">
          {completed ? (
            <FadeIn>
              <div className="max-w-2xl mx-auto text-center rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] p-8">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <h2 className="text-2xl font-black text-white mb-2">
                  That&rsquo;s a real lab, completed.
                </h2>
                <p className="text-slate-400 mb-6">
                  You just did hands-on networking in your browser — graded live, no
                  install. There are 23 more graded labs across Cisco CCNA, Aruba, Juniper,
                  and CompTIA Network+, plus thousands of exam questions and flashcards.
                  Your free trial unlocks all of it.
                </p>
                <a
                  href={`${APP_ORIGIN}/register`}
                  onClick={() => track(EVENTS.DEMO_LAB_CTA_CLICK, { state: 'completed' })}
                  className="btn-primary text-base px-7 py-3 inline-flex"
                  target="_blank"
                  rel="noopener"
                >
                  Start your free trial
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </FadeIn>
          ) : (
            <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-5">
              {[
                { icon: Network, title: '24 graded labs', body: 'Cisco, Aruba, Juniper, and Network+ tracks — build, break, and fix real topologies.' },
                { icon: Cpu, title: 'Full CLI simulator', body: 'Real Aruba CX, Cisco IOS, and Junos command lines. Not multiple-choice — actual configuration.' },
                { icon: Sparkles, title: 'AI Lab Tutor', body: 'A Socratic tutor that sees your live lab and nudges you to the answer (Premium).' },
              ].map(({ icon: Icon, title, body }, i) => (
                <FadeIn key={title} delay={i * 70}>
                  <div className="card p-6 border border-white/[0.08] h-full">
                    <Icon className="w-5 h-5 text-cyan-400 mb-3" />
                    <h3 className="text-base font-bold text-white mb-1.5">{title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}

          {!completed && (
            <FadeIn delay={240}>
              <div className="text-center mt-8">
                <a
                  href={`${APP_ORIGIN}/register`}
                  onClick={() => track(EVENTS.DEMO_LAB_CTA_CLICK, { state: 'in_progress' })}
                  className="btn-primary text-base px-7 py-3 inline-flex"
                  target="_blank"
                  rel="noopener"
                >
                  Start your free trial
                  <ArrowRight className="w-4 h-4" />
                </a>
                <p className="mt-3 text-xs text-slate-600">
                  7-day free trial · no credit card to start ·{' '}
                  <Link to="/#labs" className="text-cyan-400 hover:text-cyan-300">
                    see all labs
                  </Link>
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}
