// ─────────────────────────────────────────────────────────────────────────────
// lib/articleBody.js
//
// Turns an article's `body` (array of strings) into display blocks. Shared by
// the article page (React), the RSS generator and add-articles validation, so
// all three read the format the same way. Plain JS only: Node imports it too.
//
// Body format (each array entry is one block):
//   "Plain text."                 → paragraph
//   "## Subhead"                  → section subhead (### for a minor one)
//   "- item\n- item"              → bulleted list (every line starts "- ")
//   "1. item\n2. item"            → numbered list
//   "> Quoted words."             → pull quote (a real quote, used sparingly)
// Inline, inside any block:
//   **bold**   `code`   [link text](https://example.com)
//
// Older articles are plain paragraphs. Two things make them easier to read
// without editing them: long paragraphs are split at sentence boundaries,
// and familiar lead-ins ("What to do now:") are shown in bold.
// ─────────────────────────────────────────────────────────────────────────────

const HEADING_RE = /^(#{2,3})\s+(\S.*)$/;
const UL_LINE_RE = /^[-*]\s+(\S.*)$/;
const OL_LINE_RE = /^\d+[.)]\s+(\S.*)$/;
const QUOTE_RE   = /^>\s?(.*)$/;

// Split a paragraph only when it's long enough to read as a wall.
const SPLIT_MIN_WORDS     = 75;
const SPLIT_MIN_SENTENCES = 4;

// Lead-ins that work as run-in subheads ("What to do now: ..."). Kept to a
// short list so ordinary sentences with a colon stay as they are.
const LEAD_IN_RE = new RegExp(
  '^(?:' + [
    "What (?:to do|you should do|admins should do|defenders should do|to watch|this means|it means|it does|changes|(?:'|’)s in it|(?:'|’)s in|we know|we don(?:'|’)t know|is still unknown)\\b[^:.!?]{0,40}",
    'If you (?:run|use|manage|own|hold|have|are)\\b[^:.!?]{0,40}',
    'Patch plan', 'Order of operations', '(?:The )?[Bb]ottom line',
    'One (?:warning|caution|catch|caveat)', 'A (?:caution|caveat)\\b[^:.!?]{0,20}',
    'Who(?:(?:\'|’)s| is) affected', 'Affected (?:versions|products)',
    'Fixed versions', 'Workarounds?', 'Mitigations?', 'Timeline',
  ].join('|') + ')(?=:\\s)',
);

const ABBREVIATIONS = new Set([
  'mr', 'mrs', 'ms', 'dr', 'st', 'sr', 'jr', 'vs', 'etc', 'inc', 'corp', 'ltd',
  'co', 'no', 'gen', 'rev', 'fig', 'approx', 'jan', 'feb', 'mar', 'apr', 'jun',
  'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec', 'e.g', 'i.e', 'u.s', 'u.k',
  'e.u', 'u.n',
]);

// ── Blocks ───────────────────────────────────────────────────────────────────

// Classify one body string without any display tweaks.
export function classifyBlock(raw) {
  const text  = String(raw).trim();
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const heading = lines.length === 1 && HEADING_RE.exec(text);
  if (heading) return { type: heading[1].length === 2 ? 'h2' : 'h3', text: heading[2].trim() };

  if (lines.length > 0 && lines.every((l) => UL_LINE_RE.test(l))) {
    return { type: 'ul', items: lines.map((l) => UL_LINE_RE.exec(l)[1].trim()) };
  }
  if (lines.length > 0 && lines.every((l) => OL_LINE_RE.test(l))) {
    return { type: 'ol', items: lines.map((l) => OL_LINE_RE.exec(l)[1].trim()) };
  }
  if (lines.length > 0 && lines.every((l) => QUOTE_RE.test(l))) {
    return { type: 'quote', text: lines.map((l) => QUOTE_RE.exec(l)[1].trim()).join(' ') };
  }
  return { type: 'p', text: lines.join(' ') };
}

// Blocks ready to display: long paragraphs split, lead-ins bolded.
export function parseBody(body, { split = true } = {}) {
  const list   = Array.isArray(body) ? body : [String(body || '')];
  const blocks = [];
  for (const raw of list) {
    if (typeof raw !== 'string' || !raw.trim()) continue;
    const block = classifyBlock(raw);
    if (block.type !== 'p') {
      blocks.push(block);
      continue;
    }
    const text   = boldLeadIn(block.text);
    const chunks = split ? splitParagraph(text) : [text];
    for (const chunk of chunks) blocks.push({ type: 'p', text: chunk });
  }
  return blocks;
}

function boldLeadIn(text) {
  if (text.includes('**')) return text;
  const m = LEAD_IN_RE.exec(text);
  if (!m) return text;
  return `**${m[0]}:**${text.slice(m[0].length + 1)}`;
}

// ── Sentence splitting ───────────────────────────────────────────────────────

export function wordCount(text) {
  return String(text).split(/\s+/).filter(Boolean).length;
}

export function splitSentences(text) {
  const sentences = [];
  const boundary  = /([.!?])(["”’)]?)\s+(?=["“(]?[A-Z0-9])/g;
  let start = 0;
  let m;
  while ((m = boundary.exec(text)) !== null) {
    const end = m.index + m[1].length + m[2].length;
    if (!isRealBoundary(text, start, m.index, end)) continue;
    sentences.push(text.slice(start, end).trim());
    start = boundary.lastIndex;
  }
  const rest = text.slice(start).trim();
  if (rest) sentences.push(rest);
  return sentences;
}

function isRealBoundary(text, sentenceStart, dotIndex, end) {
  if (text[dotIndex] === '.') {
    const word = /([A-Za-z.]+)$/.exec(text.slice(sentenceStart, dotIndex));
    if (word) {
      const w = word[1].toLowerCase();
      if (ABBREVIATIONS.has(w) || /^[a-z]$/.test(w) || /^([a-z]\.)+[a-z]$/.test(w)) return false;
    }
  }
  // Never split inside quotes, parentheses, code or link text.
  const before = text.slice(0, end);
  if (((before.match(/"/g) || []).length) % 2 === 1) return false;
  if ((before.match(/“/g) || []).length > (before.match(/”/g) || []).length) return false;
  if ((before.match(/\(/g) || []).length > (before.match(/\)/g) || []).length) return false;
  if ((before.match(/\[/g) || []).length > (before.match(/\]/g) || []).length) return false;
  if (((before.match(/`/g) || []).length) % 2 === 1) return false;
  if (((before.match(/\*\*/g) || []).length) % 2 === 1) return false;
  return true;
}

// Long paragraph → 2 or 3 shorter ones, cut at the sentence boundaries that
// best balance the word count.
export function splitParagraph(text) {
  const words = wordCount(text);
  if (words < SPLIT_MIN_WORDS) return [text];
  const sentences = splitSentences(text);
  if (sentences.length < SPLIT_MIN_SENTENCES) return [text];

  const parts  = sentences.length >= 6 && words >= 120 ? 3 : 2;
  const counts = sentences.map(wordCount);
  const chunks = [];
  let from = 0;
  let done = 0;
  for (let p = 1; p < parts; p++) {
    const target = (words * p) / parts;
    // Leave at least one sentence for every remaining chunk.
    const lastCut = sentences.length - (parts - p);
    let best = from + 1;
    let bestGap = Infinity;
    let running = done;
    for (let i = from; i < lastCut; i++) {
      running += counts[i];
      const gap = Math.abs(running - target);
      if (gap < bestGap) { bestGap = gap; best = i + 1; }
    }
    chunks.push(sentences.slice(from, best).join(' '));
    done += counts.slice(from, best).reduce((a, b) => a + b, 0);
    from = best;
  }
  chunks.push(sentences.slice(from).join(' '));
  return chunks;
}

// ── Inline ───────────────────────────────────────────────────────────────────

// Tokens: { t: 'text', v } | { t: 'code', v } | { t: 'strong', children }
//       | { t: 'link', href, children }
export function parseInline(text) {
  const tokens = [];
  const re = /`([^`]+)`|\*\*(.+?)\*\*|\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) tokens.push({ t: 'text', v: text.slice(last, m.index) });
    if (m[1] !== undefined)      tokens.push({ t: 'code', v: m[1] });
    else if (m[2] !== undefined) tokens.push({ t: 'strong', children: parseInline(m[2]) });
    else                         tokens.push({ t: 'link', href: m[4], children: parseInline(m[3]) });
    last = re.lastIndex;
  }
  if (last < text.length) tokens.push({ t: 'text', v: text.slice(last) });
  return tokens;
}

export function inlineToPlain(text) {
  return parseInline(text).map(function plain(tok) {
    if (tok.t === 'text' || tok.t === 'code') return tok.v;
    return tok.children.map(plain).join('');
  }).join('');
}

// ── HTML (RSS) ───────────────────────────────────────────────────────────────

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function inlineToHtml(text) {
  return parseInline(text).map(function html(tok) {
    if (tok.t === 'text')   return escapeHtml(tok.v);
    if (tok.t === 'code')   return `<code>${escapeHtml(tok.v)}</code>`;
    if (tok.t === 'strong') return `<strong>${tok.children.map(html).join('')}</strong>`;
    return `<a href="${escapeHtml(tok.href)}">${tok.children.map(html).join('')}</a>`;
  }).join('');
}

export function bodyToHtml(body) {
  return parseBody(body).map((b) => {
    if (b.type === 'h2' || b.type === 'h3') return `<${b.type}>${inlineToHtml(b.text)}</${b.type}>`;
    if (b.type === 'ul' || b.type === 'ol') {
      return `<${b.type}>${b.items.map((i) => `<li>${inlineToHtml(i)}</li>`).join('')}</${b.type}>`;
    }
    if (b.type === 'quote') return `<blockquote><p>${inlineToHtml(b.text)}</p></blockquote>`;
    return `<p>${inlineToHtml(b.text)}</p>`;
  }).join('\n');
}

// Plain text of the whole body, for word counts.
export function bodyToPlain(body) {
  return parseBody(body, { split: false }).map((b) =>
    b.items ? b.items.map(inlineToPlain).join(' ') : inlineToPlain(b.text),
  ).join(' ');
}

// ── Validation (add-articles) ────────────────────────────────────────────────

// Returns { errors, warnings } for a draft's body and keyPoints. Errors are
// things that would render wrong; warnings are style nudges.
export function checkBody(body, keyPoints) {
  const errors   = [];
  const warnings = [];
  if (!Array.isArray(body)) return { errors: ['"body" must be an array'], warnings };

  const blocks = body.map((raw, i) => ({ i, raw: String(raw), block: classifyBlock(raw) }));

  blocks.forEach(({ i, raw, block }) => {
    const where = `body[${i}]`;
    const lines = raw.trim().split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (block.type === 'p' && lines.length > 1) {
      if (lines.some((l) => UL_LINE_RE.test(l) || OL_LINE_RE.test(l) || QUOTE_RE.test(l) || HEADING_RE.test(l))) {
        errors.push(`${where}: mixes list, quote or subhead lines with plain text. Put each in its own body entry, and start every line of a list with "- ".`);
      } else {
        errors.push(`${where}: a paragraph must be one line. Use a separate body entry for each paragraph.`);
      }
    }
    if (/^#\s/.test(raw.trim()) || /^#{4,}\s/.test(raw.trim())) {
      errors.push(`${where}: use "## " for a subhead (or "### " for a minor one).`);
    }
    if (block.type === 'h2' || block.type === 'h3') {
      if (block.text.length > 70) errors.push(`${where}: subhead is over 70 characters.`);
      if (/[.:]$/.test(block.text)) errors.push(`${where}: subhead should not end with a period or colon.`);
    }
    if ((block.type === 'ul' || block.type === 'ol') && block.items.length < 2) {
      errors.push(`${where}: a list needs at least 2 items (or write it as a sentence).`);
    }
    const texts = block.items || [block.text];
    for (const t of texts) {
      if (((t.match(/\*\*/g) || []).length) % 2 === 1) errors.push(`${where}: unbalanced ** (bold markers must come in pairs).`);
      if (((t.match(/`/g) || []).length) % 2 === 1) errors.push(`${where}: unbalanced \` (code markers must come in pairs).`);
      const links = t.match(/\[[^\]]*\]\([^)]*\)/g) || [];
      for (const l of links) {
        if (!/^\[[^\]]+\]\(https:\/\/[^\s)]+\)$/.test(l)) errors.push(`${where}: link ${l} must be [text](https://...).`);
      }
    }
  });

  const first = blocks[0]?.block;
  if (first && first.type !== 'p') errors.push('body[0]: the article must open with a paragraph (the lede), not a subhead, list or quote.');
  const last = blocks[blocks.length - 1]?.block;
  if (last && (last.type === 'h2' || last.type === 'h3')) errors.push(`body[${blocks.length - 1}]: the article can't end on a subhead.`);
  blocks.forEach(({ i, block }, idx) => {
    const next = blocks[idx + 1]?.block;
    if ((block.type === 'h2' || block.type === 'h3') && next && (next.type === 'h2' || next.type === 'h3')) {
      errors.push(`body[${i}]: two subheads in a row.`);
    }
  });

  const paragraphs = blocks.filter((b) => b.block.type === 'p');
  if (paragraphs.length < 2) errors.push('body must have at least 2 paragraphs (subheads and lists don\'t count).');
  if (blocks.filter((b) => b.block.type === 'quote').length > 1) warnings.push('more than one pull quote; keep it to one.');
  const longest = Math.max(0, ...paragraphs.map((b) => wordCount(b.block.text)));
  if (longest > 90) warnings.push(`a paragraph runs ${longest} words; keep paragraphs to about 2-3 sentences (under ~70 words).`);
  const headings = blocks.filter((b) => b.block.type === 'h2').length;
  if (paragraphs.length >= 6 && headings === 0) warnings.push('6+ paragraphs and no "## " subhead; add one or two to break the story into sections.');

  if (keyPoints !== undefined) {
    if (!Array.isArray(keyPoints) || keyPoints.length < 2 || keyPoints.length > 4
        || !keyPoints.every((k) => typeof k === 'string' && k.trim())) {
      errors.push('"keyPoints" must be an array of 2-4 non-empty strings if present.');
    } else {
      keyPoints.forEach((k, i) => {
        if (k.length > 200) errors.push(`keyPoints[${i}] is over 200 characters; keep each to one short sentence.`);
        if (/\n/.test(k)) errors.push(`keyPoints[${i}] must be one line.`);
        if (((k.match(/\*\*/g) || []).length) % 2 === 1) errors.push(`keyPoints[${i}]: unbalanced **.`);
      });
    }
  } else {
    warnings.push('no "keyPoints"; add 2-4 one-line takeaways so readers can scan the story.');
  }
  return { errors, warnings };
}
