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
7. **Check every weekday against its date.** Before writing "on Wednesday" or similar, work out the day from the date in UTC (`date -u -d 2026-10-29 +%A`). If a source gives only a weekday, convert it to a date first. A wrong weekday has already slipped into published stories.

### Workflow

Per article, in order:

1. Pick the story. Use WebSearch / WebFetch to gather the facts (CVE numbers, names, dates, quotes). **Summarize each fetched page to a few bullets in your own notes and drop the raw body.**
2. Draft the article per `ARTICLE_STYLE_GUIDE.md`: short paragraphs, subheads and lists where the story has sections or parallel items, 2-4 `keyPoints`, opinion where earned.
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
  "keyPoints": [                             // 2-4 one-line takeaways, shown in a "Key points" box
    "What happened, in one line.",
    "Who's affected / what it means.",
    "What to do."
  ],
  "body": [                                  // one block per entry; see "Body format" below
    "Lede paragraph: what happened.",
    "Short paragraph, 1-3 sentences.",
    "## Specific subhead",
    "- List item\n- List item\n- List item",
    "..."
  ],
  "category": "cyber",                       // one of: tech | cyber | ai | space | learning
  "tags": ["Tag1", "Tag2"],
  "author": "Sam Browand",
  "publishedAt": "2026-04-21T08:00:00Z",     // ISO 8601
  "photoQuery": ["server rack", "padlock"],   // optional, 1-4 photo search phrases (see Images below)
                                             // no "image": a unique photo is picked automatically (see Images below)
  "featured": false,                         // optional
  "trending": false,                         // optional
  "breaking": false,                         // optional
  "readingTime": 5,                          // optional — script computes from word count if omitted
  "sources": [                               // optional but strongly encouraged
    { "name": "CISA KEV", "desc": "Authoritative list of CVEs under active exploitation", "url": "https://www.cisa.gov/known-exploited-vulnerabilities-catalog" }
  ]
}
```

### Body format

Articles render like a real news site, not a wall of text. Each `body` entry is one block:

| Entry | Renders as |
|---|---|
| `"Plain text."` | a paragraph (one line, no `\n`) |
| `"## Subhead"` | a section subhead (`### ` for a minor one) |
| `"- item\n- item"` | a bulleted list (every line starts `- `) |
| `"1. step\n2. step"` | a numbered list |
| `"> Quoted words."` | a pull quote |

Inline anywhere: `**bold**`, `` `code` ``, `[link text](https://...)`. The first entry must be a paragraph (the lede). Read "Formatting the body" in `ARTICLE_STYLE_GUIDE.md` for when to use each. `add-articles.mjs` rejects malformed blocks (unbalanced `**`, a list mixed into a paragraph, a subhead first or last, non-https links) and prints non-fatal notes for style misses (no `keyPoints`, a 90+ word paragraph, 6+ paragraphs with no subhead). Fix the notes too.

The script **auto-assigns `id`** (next integer after the current max). Do not include an `id` in drafts.

### Images

**Leave `image` out of drafts.** Every article gets a real photo picked automatically from Wikimedia Commons, never one another article uses, with a credit line under it on the article page. Until a photo is picked (or when nothing good matches), the article shows its unique generated cover (`src/lib/articleCover.js`), so nothing ever looks broken.

How it works: after each push to `main` that changes `src/data/articles.js`, and hourly, the GitHub Action `.github/workflows/article-photos.yml` runs `scripts/pick-photos.mjs`. It searches Commons (Quality Images first), keeps only free-licensed (CC0, public domain, CC BY, CC BY-SA), landscape, high-resolution JPEG photos with no people or graphics, and commits the picks to `src/data/articlePhotos.js`. That redeploys the site within a minute or two of publishing. Cloud sessions can't reach Commons, so never run the picker yourself and **never edit `src/data/articlePhotos.js`**; only the Action writes it.

**Add `photoQuery` to every draft**: 1-4 short search phrases for the photo you'd want, most specific first. They are the biggest lever on photo quality.

- Name concrete, photographable things: `"electrical substation"`, `"nvidia graphics card"`, `"falcon 9 launch"`, `"server rack"`, `"padlock"`, `"united states capitol"`.
- Never people (no CEOs, no "hacker", no names): a stranger's face next to a breach story misrepresents them, and the picker rejects people photos anyway.
- Skip abstractions Commons can't photograph (`"cybersecurity"`, `"zero-day"`, `"AI"`). Picture what a photographer would actually shoot.
- Without `photoQuery`, the picker falls back to phrases built from the tags and title, so good tags still matter: put the most specific topic tag first (`Ransomware`, `Semiconductors`, `SpaceX`, `CompTIA`). The first tag also labels the generated cover.

Only add `image` for a real photo of this specific story that you can verify exists and that no other article uses. `add-articles.mjs` rejects an image already used by another article or already picked from Commons. Do **not** copy an Unsplash or other stock URL from anywhere.

### If the script refuses

Validation errors print to stderr with the offending draft's filename. Common causes:

- **Slug already exists** → pick a different slug, or the story was already covered.
- **Slug not URL-safe** → lowercase, digits, hyphens only. No spaces, no punctuation.
- **`body` too short** → minimum 2 non-empty paragraphs (subheads and lists don't count).
- **Body formatting problems** → the message names the `body[N]` entry and what's wrong; see Body format above.
- **Bad category** → must be `tech | cyber | ai | space | learning`.
- **Bad `publishedAt`** → must be a parseable ISO date string.

Fix the draft file and re-run. The script is idempotent: duplicates are skipped with a warning, not errors, so re-running after a partial insert is safe.

## Sister projects & boundaries

- `sabr-labs.com` → this repo (tech news)
- `app.sabr-labs.com` → `sabr-learning-labs` repo (cert training)
- `discussions.sabr-labs.com` → also `sabr-learning-labs` (forum)

Don't reach across repos. If a change needs to happen in both, do them in separate sessions.
