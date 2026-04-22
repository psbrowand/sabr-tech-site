// ─────────────────────────────────────────────────────────────────────────────
// QodPage — public Question-of-the-Day.
//
// One rotating question per UTC day across the five most-popular certs.
// Served by the learning app at GET /api/public/qod (CORS-allowlisted for
// sabr-labs.com). No auth required — this page is a top-of-funnel hook;
// answering nudges the visitor to create an account to keep a streak.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { APP_ORIGIN } from '../hooks/useAuth';

export default function QodPage() {
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${APP_ORIGIN}/api/public/qod`, { credentials: 'omit' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => setToday(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function submit() {
    if (!selected || !today) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${APP_ORIGIN}/api/public/qod/check`, {
        method: 'POST',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: today.questionId,
          selected,
          answerHash: today.answerHash,
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Submission failed');
      else setResult(data);
    } catch {
      setError('Network error — try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="container-site py-16 text-center text-slate-400">
        Loading today's question…
      </div>
    );
  }
  if (error || !today) {
    return (
      <div className="container-site py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">No question ready</h1>
        <p className="text-slate-400">{error || 'Check back tomorrow.'}</p>
      </div>
    );
  }

  const options = [
    ['A', today.options.A],
    ['B', today.options.B],
    ['C', today.options.C],
    ['D', today.options.D],
  ];

  return (
    <div className="container-site py-12 max-w-2xl">
      <div className="section-label mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        Question of the Day · {today.certName}
      </div>
      <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-2">
        {today.topicTitle}
      </h1>
      <p className="text-slate-400 text-sm mb-8">
        Free daily IT cert question. Pick your answer below — no account
        needed. Make it a habit?{' '}
        <a
          href={`${APP_ORIGIN}/signup?source=qod`}
          className="text-cyan-400 hover:underline"
        >
          Create a free Sabr account
        </a>{' '}
        and we'll tailor tomorrow's to your weakest topic.
      </p>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
        <p className="text-base leading-relaxed text-slate-200 whitespace-pre-wrap">
          {today.question}
        </p>

        <div className="space-y-2">
          {options.map(([letter, text]) => {
            const isSelected = selected === letter;
            const isCorrect = result && result.correctOption === letter;
            const isWrongPick = result && isSelected && !isCorrect;
            return (
              <button
                key={letter}
                type="button"
                disabled={!!result || submitting}
                onClick={() => setSelected(letter)}
                className={
                  'w-full text-left rounded-lg border p-3 transition ' +
                  (result
                    ? isCorrect
                      ? 'border-emerald-500/60 bg-emerald-500/10 text-white'
                      : isWrongPick
                      ? 'border-rose-500/60 bg-rose-500/10 text-white'
                      : 'border-slate-800 text-slate-400'
                    : isSelected
                    ? 'border-cyan-500 bg-cyan-500/10 text-white'
                    : 'border-slate-800 hover:border-cyan-500/60 text-slate-200')
                }
              >
                <span className="font-semibold mr-2">{letter}.</span>
                {text}
              </button>
            );
          })}
        </div>

        {!result ? (
          <button
            type="button"
            onClick={submit}
            disabled={!selected || submitting}
            className="btn-primary disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit answer'}
          </button>
        ) : (
          <div
            className={
              'rounded-lg border p-4 ' +
              (result.correct
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-rose-500/50 bg-rose-500/5')
            }
          >
            <p className="font-semibold text-white mb-1 flex items-center gap-2">
              {result.correct ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Correct.
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" /> Not quite — the
                  answer is {result.correctOption}.
                </>
              )}
            </p>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">
              {result.explanation}
            </p>
            <a
              href={`${APP_ORIGIN}/signup?source=qod`}
              className="btn-primary mt-4 inline-block"
            >
              Get tomorrow's tailored to your weakest topic →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
