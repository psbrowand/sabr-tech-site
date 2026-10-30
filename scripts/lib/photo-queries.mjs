// ─────────────────────────────────────────────────────────────────────────────
// scripts/lib/photo-queries.mjs
//
// Turns an article into an ordered list of photo search phrases for
// scripts/pick-photos.mjs, which searches Wikimedia Commons. Most specific
// first:
//   1. the draft's own `photoQuery` (written by whoever wrote the article)
//   2. a well-known company or product named in the tags or title, mapped to
//      a phrase that finds real photos of it ("Tesla" → "tesla model 3")
//   3. the story's topic ("data center", "padlock", "rocket launch")
//   4. a broad fallback for the category
//
// Raw tags make poor searches (a CVE number or "Patch Now" finds nothing), so
// levels 2–4 use curated phrases. They name objects and places, not people:
// a cover showing an identifiable stranger next to a story about hackers
// would misrepresent them. Each level lists a few interchangeable phrases;
// the slug seed rotates which goes first, so two stories on the same topic
// don't start from the same search results.
// ─────────────────────────────────────────────────────────────────────────────

// Named companies and products with plenty of good photos on Commons.
export const ENTITY_QUERIES = [
  [/\bspacex\b|starship|falcon 9|falcon heavy/, ['falcon 9 launch', 'spacex starship', 'rocket launch']],
  [/starlink/, ['starlink satellite dish', 'satellite dish']],
  [/\bnasa\b|artemis/, ['space launch system', 'kennedy space center', 'rocket launch']],
  [/\btesla\b|robotaxi|cybercab/, ['tesla model 3', 'tesla model y', 'tesla supercharger']],
  [/waymo|autonomous driving|self-driving/, ['waymo self-driving car', 'autonomous car lidar']],
  [/iphone/, ['iphone', 'smartphone']],
  [/\bapple\b|macos|\bmac\b|ipad/, ['apple park', 'apple store', 'macbook']],
  [/android|pixel phone|samsung galaxy|smartphone/, ['android smartphone', 'smartphone']],
  [/\bnvidia\b|\bgpu/, ['nvidia graphics card', 'graphics processing unit', 'nvidia headquarters']],
  [/tsmc|semiconductor|wafer|foundry|\bchip|sk hynix|micron|\bdram\b|\bhbm\b|\bintel\b|\bamd\b|qualcomm|broadcom|samsung/, ['silicon wafer', 'integrated circuit die', 'microprocessor', 'printed circuit board', 'cleanroom semiconductor']],
  [/bitcoin|crypto|ethereum|binance|coinbase|stablecoin|defi|blockchain/, ['bitcoin coin', 'cryptocurrency', 'bitcoin atm', 'cryptocurrency mining']],
  [/polymarket|prediction market|kalshi/, ['stock ticker', 'trading floor']],
  [/\bmicrosoft\b|windows|azure|sharepoint|exchange server|outlook/, ['microsoft campus redmond', 'microsoft building', 'laptop computer']],
  [/\bgoogle\b|chrome\b|alphabet|gemini/, ['googleplex', 'google building', 'google data center']],
  [/\bamazon\b|\baws\b/, ['amazon spheres', 'amazon building', 'data center']],
  [/\bmeta\b|facebook|instagram|whatsapp/, ['meta headquarters menlo park', 'facebook headquarters', 'smartphone']],
  [/\bcisco\b|fortinet|palo alto|pan-os|check point|netscaler|citrix|sonicwall|juniper|sd-wan|\bvpn\b|firewall|router/, ['network switch', 'patch panel', 'ethernet cables', 'server rack']],
  [/wordpress|\bphp\b|website|web server/, ['web server', 'computer code']],
  [/linux/, ['linux terminal', 'tux penguin', 'computer code']],
  [/github|gitlab|\bnpm\b|pypi|open source|supply chain|package|devops|devsecops/, ['computer code', 'source code', 'programmer laptop']],
];

// Story topics, ordered most specific first.
export const TOPIC_QUERIES = [
  [/ransomware|extortion|qilin|lockbit|akira/, ['padlock', 'chain and padlock', 'locked door', 'computer keyboard']],
  [/phishing|social engineering|smishing|vishing|clickfix|\bbec\b|email security/, ['fishing hook', 'email inbox', 'computer keyboard', 'telephone']],
  [/infostealer|malware|trojan|botnet|backdoor|\brat\b|worm|spyware|wiper|rootkit/, ['computer code', 'trojan horse', 'hard disk drive', 'computer virus']],
  [/breach|leak|exposed|stolen data|data theft|shinyhunters|identity theft|records/, ['server room', 'hard disk drive', 'data center', 'filing cabinet']],
  [/credential|password|authentication|\bmfa\b|identity|active directory|\bsso\b|okta|passkey|oauth/, ['keys', 'security key', 'fingerprint', 'padlock']],
  [/\bot security|\bics\b|scada|critical infrastructure|energy|power grid|utility|manufacturing|water/, ['electrical substation', 'power plant', 'control room', 'factory', 'power lines']],
  [/healthcare|hospital/, ['hospital corridor', 'hospital']],
  [/privacy|surveillance|tracking|biometric|facial recognition/, ['surveillance camera', 'cctv camera', 'security camera']],
  [/zero-day|\brce\b|remote code|\bcve\b|vulnerab|exploit|patch|kev|privilege escalation|injection|bypass|ssrf/, ['computer code', 'server rack', 'padlock', 'computer keyboard', 'data center']],
  [/incident|threat intel|\bfbi\b|cisa|advisory|nation-state|\bapt\b|espionage|law enforcement/, ['security operations center', 'j. edgar hoover building', 'control room', 'server room']],
  [/data center|capex|ai infrastructure|inference|hyperscal|server/, ['data center', 'server room', 'server rack']],
  [/\bagent|automation|\bmcp\b|robot/, ['robot', 'industrial robot', 'humanoid robot']],
  [/quantum/, ['quantum computer', 'dilution refrigerator']],
  [/earnings|\bipo\b|funding|valuation|stock|nasdaq|revenue|acquisition|acquire|\bm&a\b|venture capital|markets|layoff/, ['nasdaq marketsite', 'new york stock exchange', 'stock ticker', 'wall street']],
  [/regulation|policy|\blaw\b|lawsuit|court|antitrust|government|congress|\beu\b|ftc|\bsec\b|export control|\bban\b/, ['united states capitol', 'supreme court building', 'gavel', 'european parliament']],
  [/rocket|launch|booster|orbit|blue origin|\besa\b|isro/, ['rocket launch', 'launch pad']],
  [/satellite|kuiper/, ['satellite', 'satellite dish']],
  [/telescope|webb|hubble|asteroid|mars|moon|lunar|planet|astronom/, ['telescope', 'milky way', 'moon', 'observatory']],
  [/certification|exam|comptia|\bccnp|\bccna|isc2|cissp|security\+|study guide|career/, ['library study', 'books', 'laptop notebook', 'classroom computers']],
  [/browser|web security/, ['laptop computer', 'computer screen']],
  [/cloud|saas/, ['data center', 'server room']],
  [/\bai\b|machine learning|benchmark|neural|llm|model|openai|anthropic|claude|deepseek|chatgpt/, ['data center', 'graphics processing unit', 'robot', 'server room', 'supercomputer']],
  [/windows|linux|macos|software|developer|code/, ['computer code', 'programmer laptop', 'computer keyboard']],
];

export const CATEGORY_QUERIES = {
  cyber: ['server room', 'padlock', 'computer keyboard', 'network cables'],
  ai: ['data center', 'supercomputer', 'robot'],
  tech: ['printed circuit board', 'computer', 'data center'],
  space: ['rocket launch', 'milky way', 'earth from space'],
  learning: ['library study', 'books', 'laptop notebook'],
};

// Same FNV-1a seed the generated covers use, so results are stable per slug.
export function seedOf(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rotate(list, seed) {
  if (list.length < 2) return list.slice();
  const k = seed % list.length;
  return list.slice(k).concat(list.slice(0, k));
}

export function cleanQuery(q) {
  return String(q).toLowerCase().replace(/["]/g, '').replace(/\s+/g, ' ').trim();
}

// The ordered, de-duplicated list of search phrases for an article.
export function photoQueriesFor(article) {
  const seed = seedOf(article.slug || article.title || '');
  const haystack = [...(article.tags || []), article.title || ''].join(' | ').toLowerCase();
  const out = [];
  const add = (q) => {
    const c = cleanQuery(q);
    if (c && c.length <= 80 && !out.includes(c)) out.push(c);
  };

  const own = Array.isArray(article.photoQuery)
    ? article.photoQuery
    : article.photoQuery ? [article.photoQuery] : [];
  own.slice(0, 4).forEach(add);

  // At most two matching entity rules and two topic rules, so a story about
  // "Nvidia earnings" tries chips before generic market shots.
  for (const rules of [ENTITY_QUERIES, TOPIC_QUERIES]) {
    let matched = 0;
    for (const [re, phrases] of rules) {
      if (matched >= 2) break;
      if (re.test(haystack)) {
        rotate(phrases, seed).forEach(add);
        matched++;
      }
    }
  }

  rotate(CATEGORY_QUERIES[article.category] || CATEGORY_QUERIES.tech, seed).forEach(add);
  return out;
}
