// TimeAgo.jsx — Relative time display
export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function timeAgo(isoString) {
  const now = new Date();
  const then = new Date(isoString);
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(isoString);
}

export default function TimeAgo({ date, className = '' }) {
  return (
    <time dateTime={date} className={className} title={formatDate(date)}>
      {timeAgo(date)}
    </time>
  );
}
