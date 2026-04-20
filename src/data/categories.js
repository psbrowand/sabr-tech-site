// ─────────────────────────────────────────────────────────────────────────────
// data/categories.js
// Category definitions with display metadata
// ─────────────────────────────────────────────────────────────────────────────

export const categories = [
  {
    id: "tech",
    label: "Tech News",
    shortLabel: "Tech",
    slug: "/tech-news",
    color: "cyan",
    colorClass: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
    description: "The latest in technology, software, hardware, and the companies shaping our digital future.",
  },
  {
    id: "cyber",
    label: "Cyber Security",
    shortLabel: "Cyber",
    slug: "/cyber-security",
    color: "red",
    colorClass: "text-red-400 bg-red-400/10 border-red-400/30",
    description: "Breaking threats, vulnerability disclosures, incident reports, and defensive intelligence.",
  },
  {
    id: "ai",
    label: "AI News",
    shortLabel: "AI",
    slug: "/ai-news",
    color: "purple",
    colorClass: "text-purple-400 bg-purple-400/10 border-purple-400/30",
    description: "AI model releases, research breakthroughs, regulation, and the ethics of machine intelligence.",
  },
  {
    id: "space",
    label: "Space & Science",
    shortLabel: "Space",
    slug: "/tech-news?cat=space",
    color: "blue",
    colorClass: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    description: "Space exploration, launches, scientific discoveries, and the new space economy.",
  },
  {
    id: "learning",
    label: "Learning & Certifications",
    shortLabel: "Learning",
    slug: "/learning",
    color: "green",
    colorClass: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    description: "Certification guides, training news, study resources, and career development for cyber and networking professionals.",
  },
];

export const getCategoryById = (id) => categories.find(c => c.id === id);
