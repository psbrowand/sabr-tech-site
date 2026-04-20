# Sabr Cyber & Tech News — Article Style Guide

This is the drafting guide for every article published on Sabr Cyber & Tech News. It exists for two reasons: keep the writing human, and keep it recognizable as *ours* — one voice across all 365 days a year.

If you're a Claude Code routine generating a daily article, read this top to bottom before you write anything. If something in this guide conflicts with a generic instinct to sound "professional," trust the guide.

---

## 1. Who we are writing for

A working tech person. Could be a SOC analyst, a network engineer, a dev, an IT manager, a student studying for Security+. They're smart, pressed for time, and have read a thousand tech articles that all sound the same. They do not need jargon explained to them, but they do appreciate when we call out what actually matters.

Not for: executives who want takeaway bullets. Not for: absolute beginners. We respect the reader's literacy.

## 2. The voice in two words

**Direct. Grounded.**

Like a coworker who knows the subject telling you what happened over coffee. Not a press release. Not a white paper. Not a LinkedIn thought-leadership post.

Specifically:

- **First-person plural sparingly** — "We're watching..." is fine once in a while. Don't start every article with it.
- **Contractions are fine and welcome** — "it's", "you'll", "that's". Refusing contractions is one of the fastest tells of AI writing.
- **Opinion is allowed** when it's earned. If a vendor's response is weak, we can say it reads like deflection. If a milestone is overhyped, we can say so. We are not neutral stenographers.
- **No hedging sludge.** Cut phrases like "it remains to be seen," "time will tell," "only time can tell," "the jury is still out."
- **No "landscape"-speak.** Forbidden words and phrases: *landscape, ecosystem, leverage (as a verb), unleash, game-changer, revolutionize, paradigm, cutting-edge, state-of-the-art, in today's digital world, the world of [X], at the end of the day.*

## 3. Structure — escape the five-paragraph trap

The single worst signal of AI writing in our current article set is that every article has exactly five paragraphs, each doing the same job. Break this.

**Target: 4–8 paragraphs, variable.** Some stories are three paragraphs. Some are eight. A breaking cyber incident might be tight and fast. A policy explainer might need room to breathe. Let the story dictate.

**Vary paragraph length.** Mix short punchy ones (1–2 sentences) with longer ones (4–5 sentences). A one-sentence paragraph lands hard — use it when you want emphasis.

**What each article needs (not necessarily in order):**

- The news itself — what happened, when, who's involved
- The technical detail that makes it real — the specific CVE, the protocol, the chip, the dollar figure
- Context — why it matters, what came before it
- A skeptical beat — where the official narrative is thin, or what's being left out
- What to watch for next — but only if there's something concrete, not filler

**Do NOT force every beat into every article.** If there's no skeptical angle, don't manufacture one. If the "what's next" is generic, cut it.

## 4. Sentence rhythm

Vary sentence length aggressively. AI defaults to sentences of uniform medium length; humans don't.

Write like this sometimes. Then write a longer sentence that lets the reader settle in, carries two or three clauses, maybe turns a corner. Then short again.

**Cut the em dashes.** They're a signature tell. Currently our articles use them three or four times per paragraph. In a rewrite, allow yourself one per article, maybe two. Use parentheses, commas, or a period and new sentence instead.

**Avoid the "—" construction entirely when it's being used to insert an appositive.** Instead of "OpenAI — the San Francisco-based AI lab — released...", just say "OpenAI released..." Readers know what OpenAI is.

## 5. The stats problem

Our current articles are packed with numbers that feel generated: 89.7%, 72%, $1.2 trillion. Real reporting cites numbers, too — but real numbers have texture.

**Rules for numbers in articles:**

- Round when rounding helps the reader. "Nearly 90%" reads like a person. "89.7%" reads like a machine unless it's the actual reported figure.
- When you use a precise number, name where it came from. "According to Microsoft's own disclosure..." or "the CVSS score sits at 9.8."
- Don't stack four stats in one paragraph. One or two specific numbers land; four blur into noise.
- Never invent numbers to sound authoritative. If you don't have a real figure, describe the shape of it: "a small fraction," "most of," "a majority."

## 6. Quotes and attribution

When you quote someone, make sure the quote does work. A quote that says "this is a historic milestone" is filler. A quote that reveals something — a tradeoff, a disagreement, a concrete plan — earns its place.

- Prefer paraphrase for routine statements. Quote when the exact words matter.
- Attribution format: name on first reference with title; last name only after.
- If a company issued a statement, say "the company said" — don't pretend a spokesperson gave an exclusive quote.
- No dramatic closing quotes. Ending with a CEO saying "We are going to Mars" is the hackiest AI move in the deck. Stop.

## 7. Openers — the first sentence is doing 40% of the work

Ban the following openers:

- "[Company] announced today that..." (every article in the current set does this)
- "In a landmark development..."
- "In what researchers are calling..."

Better openers:

- Lead with the thing that actually happened, stripped of ceremony. *"A Russian state-sponsored group spent the weekend inside NATO networks using a Windows flaw Microsoft had never seen before."*
- Lead with the number that matters. *"Two point four million downloads. That's how long it took for 230 malicious npm packages to ship before anyone caught on."*
- Lead with the human detail. *"The finance director had been on the phone with the CEO for four minutes when she authorized the wire. The CEO had not been on the phone."*
- Lead with the stakes. *"Every CISO in the country read the SolarWinds verdict this week and thought about their own Slack history."*

## 8. Closers — stop landing the plane the same way

Never end with:

- A CEO quote that's meant to sound profound
- "Only time will tell how this develops."
- "The industry will be watching closely."
- "Stay tuned."

Better endings:

- A concrete next step the reader should take (if it's a security story)
- A pointed observation about what this changes
- A question worth sitting with — but only if it's a real question, not rhetorical filler
- Nothing. Just stop. Some articles don't need a big ending.

## 9. Category-specific notes

**Cyber** — Lead with the incident or the CVE, not the context. Readers in this category want the details: affected versions, IOC signals, patch availability, who did it. Be specific about attribution confidence ("assessed to be," "attributed by [firm] to," "claimed by"). Don't overstate attribution.

**AI** — Skepticism is a feature. The AI beat is drowning in hype and every other publication is posting marketing copy. When a model announces a benchmark win, say so, but also say what the benchmark actually measures and what it doesn't. When a "breakthrough" is really a product release, name it.

**Tech** — Product launches and industry moves. Keep it crisp. The reader doesn't need the full company history. They need: what shipped, what's different, what it means for the category.

**Space** — Space is one of the few beats where a little awe is allowed. If SpaceX catches both stages or JWST spots a biosignature candidate, that's a genuine marvel. Don't drown it in technical flattening. But also don't get breathless — the tone is "holy crap, look at this" from someone who knows the engineering, not "BREAKING: HUMANITY REACHES FOR THE STARS."

**Learning** — The learning articles in our current set are actually the strongest example of voice. Direct, opinionated, practical. Keep this approach for all learning/certification content. Answer the reader's real question ("is this worth it? how hard is it? what should I study?") without dancing.

## 10. Article schema (for the data layer)

Every article is an object in `src/data/articles.js` with:

```js
{
  id: <next sequential integer>,
  slug: "kebab-case-url-slug",
  title: "Headline — ideally under 80 chars, conversational not clickbait",
  summary: "One sentence subhead that actually tells you something, not a tease.",
  body: [
    "Paragraph 1 string.",
    "Paragraph 2 string.",
    // 4–8 paragraphs total, variable length
  ],
  category: "tech" | "cyber" | "ai" | "space" | "learning",
  tags: ["3–6 relevant tags"],
  image: "https://images.unsplash.com/<id>?w=1200&q=80", // or CDN URL
  author: "Sam Browand", // unless a guest byline
  publishedAt: "2026-MM-DDTHH:MM:SSZ", // ISO UTC
  readingTime: <1–2 min per paragraph, rounded>,
  featured: <true only for the day's top story>,
  trending: <true for ~3–4 recent stories>,
  breaking: <true only for active-incident cyber or major industry news>,
  sources: [
    { name: "Source name", desc: "One-line what it is", url: "https://..." },
    // 3–5 real, clickable sources
  ],
}
```

**Headline rules:**
- Under ~80 characters
- Specific > clever. "CISA Warns of Active Ivanti VPN Exploitation" > "Security Alert Rocks Enterprise Networks."
- No colon-subtitle-colon-subtitle stacking
- No "Here's Why..." or "You Won't Believe..." constructions

**Summary rules:**
- One sentence. If you need two, the first one isn't doing enough work.
- Tell the reader what the article says. Don't tease.
- Avoid the em-dash summary construction ("Feature X — does Y thing — for users in Z category").

**Sources:**
- Minimum 3, maximum 5.
- Primary sources first (the vendor's own advisory, the official filing, the researcher's blog post).
- No link farms, no "related article" links on other sites padding the list.

## 11. Daily routine checklist

When a Claude Code routine drafts a new article, run this checklist before adding it to `articles.js`:

1. **Paragraph count:** 4–8, not 5.
2. **Em-dash count:** no more than 2 in the entire body.
3. **Opener:** does not start with "[Company] announced today."
4. **Closer:** does not end with a quote trying to sound profound.
5. **Stats:** round numbers where rounding is more honest; cite a source for precise ones.
6. **Voice check:** read the article aloud. If any sentence sounds like a consultant wrote it, rewrite the sentence.
7. **Forbidden words scan:** grep for *landscape, ecosystem, game-changer, leverage, paradigm, cutting-edge, revolutionize, unleash.* Remove all hits.
8. **Uniqueness:** does this article say something other outlets didn't already say yesterday? If no, either find the angle or skip it.
9. **Sources:** 3–5, all real URLs, primary sources first.
10. **Schema fields:** id is the next integer, slug is unique, publishedAt is ISO UTC, category is one of the five valid values.

## 12. What to avoid, condensed

- No five-paragraph default structure
- No em dashes as punctuation habit
- No "landscape / ecosystem / paradigm" vocabulary
- No suspiciously precise stats without a source
- No balanced-counterpoint-for-its-own-sake in paragraph 4
- No dramatic closing CEO quotes
- No "only time will tell" / "stay tuned" / "the industry is watching"
- No [Company] announced today that... openers
- No uniform sentence length
- No stenography — if there's an angle, take it

## 13. What good looks like

A Sabr article should feel like a short read from a tech publication you actually trust — Stratechery, The Pragmatic Engineer, Krebs, SemiAnalysis — written by someone who has opinions, isn't padding for word count, and respects the reader's time.

If a reader finishes the article and thinks "I learned something specific and it didn't feel like marketing," we did it right. If they think "another tech-news summary," we didn't.
