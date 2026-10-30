// ─────────────────────────────────────────────────────────────────────────────
// ArticleBody.jsx — renders an article's body blocks (see lib/articleBody.js)
// ─────────────────────────────────────────────────────────────────────────────
import { parseBody, parseInline } from '../../lib/articleBody';

function Inline({ text }) {
  return parseInline(text).map((tok, i) => renderToken(tok, i));
}

function renderToken(tok, key) {
  if (tok.t === 'text')   return tok.v;
  if (tok.t === 'code')   return <code key={key}>{tok.v}</code>;
  if (tok.t === 'strong') return <strong key={key}>{tok.children.map(renderToken)}</strong>;
  return (
    <a key={key} href={tok.href} target="_blank" rel="noopener noreferrer">
      {tok.children.map(renderToken)}
    </a>
  );
}

function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return <h2><Inline text={block.text} /></h2>;
    case 'h3':
      return <h3><Inline text={block.text} /></h3>;
    case 'ul':
    case 'ol': {
      const List = block.type;
      return (
        <List>
          {block.items.map((item, i) => <li key={i}><Inline text={item} /></li>)}
        </List>
      );
    }
    case 'quote':
      return <blockquote><p><Inline text={block.text} /></p></blockquote>;
    default:
      return <p><Inline text={block.text} /></p>;
  }
}

export default function ArticleBody({ body }) {
  return (
    <div className="article-prose">
      {parseBody(body).map((block, i) => <Block key={i} block={block} />)}
    </div>
  );
}

export function KeyPoints({ points }) {
  if (!Array.isArray(points) || points.length === 0) return null;
  return (
    <aside className="article-keypoints" aria-label="Key points">
      <h2>Key points</h2>
      <ul>
        {points.map((p, i) => <li key={i}><Inline text={p} /></li>)}
      </ul>
    </aside>
  );
}
