# Agent instructions — sabr-tech-site

This file is read by Claude Code and similar agents. Follow it verbatim.

## Daily news routine — how to publish articles

You are running the **"Sabr daily news"** routine. Your job is to research the day's top cyber & tech news and publish 5–6 new articles to this site.

### Rules (read first, no exceptions)

1. **Never `Edit` `src/data/articles.js` directly.** Every past failure of this routine has been a "Stream idle timeout" mid-Edit, because a single Edit with 5–6 full article bodies is too large for the stream to hold. We solved it with a splice script — use it.
2. **Draft each article as its own small JSON file** under `scripts/drafts/YYYY-MM-DD/NN-slug.json`. One article per file. Write them with the `Write` tool. If any single `Write` times out, only that one article is lost — the others persist.
3. **Run `node scripts/add-articles.mjs scripts/drafts/YYYY-MM-DD/`** once all drafts are written. The script validates, assigns IDs, computes reading time, and splices everything into `articles.js` in a single atomic write.
4. **Read `ARTICLE_STYLE_GUIDE.md` before you write anything.** The voice is direct and grounded. Avoid the forbidden words/phrases listed there. Vary paragraph length. Don't hedge.
5. **Trim WebFetch output aggressively.** After each research fetch, extract the 3–5 facts you need and discard the raw HTML before moving on. Holding multiple full page bodies in context slows token generation and makes stream timeouts more likely.
6. **Don't commit the drafts directory.** `scripts/drafts/` is gitignored — it's staging only. After a successful run, `git status` should show only `src/data/articles.js` as modified.

### Workflow

Per article, in order:

1. Pick the story. Use WebSearch / WebFetch to gather the facts (CVE numbers, names, dates, quotes). **Summarize each fetched page to a few bullets in your own notes and drop the raw body.**
2. Draft the article in prose per `ARTICLE_STYLE_GUIDE.md` — 4–8 paragraphs, varied lengths, opinion where earned.
3. `Write` to `scripts/drafts/YYYY-MM-DD/NN-slug.json` (where `NN` is a zero-padded ordinal — `01`, `02`, etc. — so the script inserts them in your intended order).
4. Move to the next article. **Do not** hold all drafted articles in memory to write in a batch; write each one the moment it's ready.

Once all drafts are on disk:

```bash
node scripts/add-articles.mjs scripts/drafts/2026-04-21/
```

Then verify with `git diff src/data/articles.js` and `git status`, then commit with a message like `content: daily news 2026-04-21 (6 articles)`.

### Article JSON schema (per draft file)

```jsonc
{
  "slug": "kebab-case-unique",              // lowercase, digits, hyphens only; must not collide with an existing slug
  "title": "Headline",
  "summary": "One-sentence subhead for cards.",
  "body": [                                  // array of paragraph strings, minimum 2
    "Paragraph one.",
    "Paragraph two.",
    "..."
  ],
  "category": "cyber",                       // one of: tech | cyber | ai | space | learning
  "tags": ["Tag1", "Tag2"],
  "author": "Sam Browand",
  "publishedAt": "2026-04-21T08:00:00Z",     // ISO 8601
  "image": "https://images.unsplash.com/...?w=1200&q=80",   // optional — script supplies a default
  "featured": false,                         // optional
  "trending": false,                         // optional
  "breaking": false,                         // optional
  "readingTime": 5,                          // optional — script computes from word count if omitted
  "sources": [                               // optional but strongly encouraged
    { "name": "CISA KEV", "desc": "Authoritative list of CVEs under active exploitation", "url": "https://www.cisa.gov/known-exploited-vulnerabilities-catalog" }
  ]
}
```

The script **auto-assigns `id`** (next integer after the current max). Do not include an `id` in drafts.

### If the script refuses

Validation errors print to stderr with the offending draft's filename. Common causes:

- **Slug already exists** → pick a different slug, or the story was already covered.
- **Slug not URL-safe** → lowercase, digits, hyphens only. No spaces, no punctuation.
- **`body` too short** → minimum 2 non-empty paragraphs.
- **Bad category** → must be `tech | cyber | ai | space | learning`.
- **Bad `publishedAt`** → must be a parseable ISO date string.

Fix the draft file and re-run. The script is idempotent: duplicates are skipped with a warning, not errors, so re-running after a partial insert is safe.

## Sister projects & boundaries

- `sabr-labs.com` → this repo (tech news)
- `app.sabr-labs.com` → `sabr-learning-labs` repo (cert training)
- `discussions.sabr-labs.com` → also `sabr-learning-labs` (forum)

Don't reach across repos. If a change needs to happen in both, do them in separate sessions.
