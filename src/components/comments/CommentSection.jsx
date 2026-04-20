// ─────────────────────────────────────────────────────────────────────────────
// CommentSection.jsx — Article comment form + list
//
// Backend integration points:
//   - handleSubmit: POST to your comments API (Supabase, Firebase, custom)
//   - mockComments: Replace with real fetched comments
//
// Anti-spam: add honeypot field, rate limiting, and CAPTCHA at the API layer.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { MessageCircle, ThumbsUp, Reply, User, Shield, Send, AlertCircle } from 'lucide-react';
import { formatDate } from '../ui/TimeAgo';

// Comments are loaded from the backend at runtime.
// TODO: fetch from your comments API keyed on articleSlug.
const mockComments = [];

// ── Comment Form ──────────────────────────────────────────────────────────────
function CommentForm({ onSubmit, replyTo = null, onCancel }) {
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [body, setBody]     = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  // Honeypot — must remain empty
  const [hp, setHp]         = useState('');

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email required.';
    if (body.trim().length < 10) e.body = 'Comment must be at least 10 characters.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hp) return; // honeypot triggered — silent discard

    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');

    // TODO: POST to your comments backend
    // await fetch('/api/comments', { method: 'POST', body: JSON.stringify({ name, email, body, replyTo }) });

    await new Promise(r => setTimeout(r, 700));
    onSubmit?.({ name: name.trim(), body: body.trim(), date: new Date().toISOString() });
    setName(''); setEmail(''); setBody('');
    setStatus('success');
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {replyTo && (
        <div className="flex items-center gap-2 text-xs text-cyan-400 mb-2">
          <Reply className="w-3.5 h-3.5" />
          Replying to <strong>{replyTo}</strong>
        </div>
      )}

      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        value={hp}
        onChange={e => setHp(e.target.value)}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 font-medium">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            className={`input-cyber ${errors.name ? 'border-red-500/50' : ''}`}
          />
          {errors.name && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 font-medium">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com (not displayed)"
            className={`input-cyber ${errors.email ? 'border-red-500/50' : ''}`}
          />
          {errors.email && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1.5 font-medium">
          Comment <span className="text-red-400">*</span>
        </label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Share your thoughts, analysis, or questions…"
          rows={4}
          className={`input-cyber resize-none ${errors.body ? 'border-red-500/50' : ''}`}
        />
        {errors.body && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.body}</p>}
        <p className="text-[11px] text-slate-700 mt-1">{body.length} / 2000 characters</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] text-slate-600 flex items-center gap-1">
          <Shield className="w-3 h-3" /> Your email won't be published. See our privacy policy.
        </p>
        <div className="flex gap-2 flex-shrink-0">
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-ghost text-xs py-2 px-4">Cancel</button>
          )}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary text-xs py-2 px-4"
          >
            {status === 'loading' ? 'Posting…' : 'Post Comment'}
            {status !== 'loading' && <Send className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {status === 'success' && (
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 text-sm text-cyan-400">
          ✓ Comment posted! It will appear shortly after moderation.
        </div>
      )}
    </form>
  );
}

// ── Single comment item ───────────────────────────────────────────────────────
function CommentItem({ comment, onLike }) {
  const [showReply, setShowReply] = useState(false);
  const [liked, setLiked]        = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes || 0);

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    setLikeCount(n => n + 1);
    onLike?.(comment.id);
  };

  return (
    <div className="flex gap-3 sm:gap-4">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center">
          <User className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-baseline gap-2 flex-wrap mb-2">
          <span className="font-semibold text-sm text-slate-200">{comment.name}</span>
          {comment.role && (
            <span className="text-[11px] text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 rounded">{comment.role}</span>
          )}
          <span className="text-xs text-slate-600 ml-auto">{formatDate(comment.date)}</span>
        </div>

        {/* Body */}
        <p className="text-sm text-slate-400 leading-relaxed mb-3">{comment.body}</p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
              liked ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-cyan-400' : ''}`} />
            {likeCount}
          </button>
          <button
            onClick={() => setShowReply(v => !v)}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-cyan-400 transition-colors duration-200"
          >
            <Reply className="w-3.5 h-3.5" />
            Reply
          </button>
        </div>

        {/* Nested replies */}
        {comment.replies?.length > 0 && (
          <div className="mt-4 pl-4 border-l-2 border-white/[0.07] space-y-4">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} />
            ))}
          </div>
        )}

        {/* Reply form */}
        {showReply && (
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <CommentForm replyTo={comment.name} onCancel={() => setShowReply(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main CommentSection export ────────────────────────────────────────────────
export default function CommentSection({ articleSlug }) {
  const [comments, setComments] = useState(mockComments);

  const handleNewComment = (comment) => {
    setComments(prev => [
      ...prev,
      { id: Date.now(), likes: 0, replies: [], role: null, ...comment },
    ]);
  };

  return (
    <section className="mt-14 pt-10 border-t border-white/[0.06]" id="comments">
      <h2 className="flex items-center gap-3 text-xl font-bold text-slate-100 mb-8">
        <MessageCircle className="w-5 h-5 text-cyan-400" />
        Discussion
        <span className="text-sm font-normal text-slate-600">({comments.length} comments)</span>
      </h2>

      {/* New comment form */}
      <div className="card p-6 mb-10">
        <h3 className="text-sm font-semibold text-slate-300 mb-5">Leave a Comment</h3>
        <CommentForm onSubmit={handleNewComment} />
      </div>

      {/* Comment list */}
      <div className="space-y-8">
        {comments.map(c => (
          <CommentItem key={c.id} comment={c} />
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12 text-slate-600">
          <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Be the first to comment on this story.</p>
        </div>
      )}
    </section>
  );
}
