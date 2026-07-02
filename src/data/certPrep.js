// ─────────────────────────────────────────────────────────────────────────────
// certPrep.js — Per-certification landing-page data (SEO + conversion).
//
// One entry per ACTIVE certification in the learning app. Each drives a
// static, keyword-targeted page at /practice/:slug — the pages that rank for
// "<cert> practice test / practice questions / exam questions" searches and
// funnel that high-intent traffic into a free trial.
//
// Facts policy: exam length / format / level are stable and safe to state.
// Fees and passing scores vary by region and change over time, so we point
// to the official vendor page instead of hard-coding those. Question-pool
// counts use "N+" rounded down from the live seed so they never go stale as
// pools grow. Domain names/weights come from the official exam blueprints.
//
// Keep in sync with the learning app's ACTIVE_CERT_CODES + exam-specs.ts.
// ─────────────────────────────────────────────────────────────────────────────

export const APP_ORIGIN =
  import.meta?.env?.VITE_APP_ORIGIN || 'https://app.sabr-labs.com';

// Vendor theming — Tailwind class fragments resolved in CertPrepPage.
export const THEME = {
  comptia:   { accent: 'text-red-400',     border: 'border-red-400/20',     bg: 'bg-red-400/10',     bar: 'bg-red-400/70' },
  cisco:     { accent: 'text-cyan-400',    border: 'border-cyan-400/20',    bg: 'bg-cyan-400/10',    bar: 'bg-cyan-400/70' },
  aruba:     { accent: 'text-orange-400',  border: 'border-orange-400/20',  bg: 'bg-orange-400/10',  bar: 'bg-orange-400/70' },
  juniper:   { accent: 'text-lime-400',    border: 'border-lime-400/20',    bg: 'bg-lime-400/10',    bar: 'bg-lime-400/70' },
  aws:       { accent: 'text-amber-400',   border: 'border-amber-400/20',   bg: 'bg-amber-400/10',   bar: 'bg-amber-400/70' },
  microsoft: { accent: 'text-sky-400',     border: 'border-sky-400/20',     bg: 'bg-sky-400/10',     bar: 'bg-sky-400/70' },
  google:    { accent: 'text-blue-400',    border: 'border-blue-400/20',    bg: 'bg-blue-400/10',    bar: 'bg-blue-400/70' },
  isc2:      { accent: 'text-indigo-400',  border: 'border-indigo-400/20',  bg: 'bg-indigo-400/10',  bar: 'bg-indigo-400/70' },
};

// Shared, product-level FAQs appended to every cert's own FAQs. Exported so
// the page component and the static prerenderer render the SAME list — the
// FAQPage structured data must match the visible on-page FAQ.
export function sharedFaqs(cert) {
  return [
    {
      q: `Are these ${cert.name} practice questions like the real exam?`,
      a: `They are written to mirror the style, difficulty, and objective weighting of the real ${cert.code} exam — scenario-based, four options, every one cited to the official objectives with a full explanation of why each answer is right or wrong. You can run them timed as an exam simulation or untimed as study.`,
    },
    {
      q: 'Is there a free trial?',
      a: 'Yes — every plan starts with a 7-day free trial and you can cancel anytime before it ends without being charged. You can also try a hands-on network lab with no signup at all on our free demo.',
    },
  ];
}

export function allFaqs(cert) {
  return [...cert.faqs, ...sharedFaqs(cert)];
}

export const CERTS = [
  // ── CompTIA ────────────────────────────────────────────────────────────────
  {
    slug: 'a-plus-core-1',
    code: '220-1201',
    name: 'CompTIA A+ Core 1',
    vendor: 'CompTIA',
    theme: 'comptia',
    pool: '100+', flashcards: '120+', labs: false,
    exam: { questions: 'Max 90', duration: '90 minutes', format: 'Multiple choice + performance-based', level: 'Entry-level', renewal: '3-year (CE)' },
    official: 'https://www.comptia.org/certifications/a',
    tagline: 'Hardware, networking, mobile, virtualization & troubleshooting.',
    intro:
      'CompTIA A+ Core 1 (220-1201) is the first of the two exams every entry-level IT support and help-desk technician needs. It covers mobile devices, networking, hardware, virtualization and cloud, and hardware/network troubleshooting. Our practice tests drill each domain at exam weighting so you walk in knowing the material cold.',
    domains: [
      { name: 'Mobile Devices', weight: 13 },
      { name: 'Networking', weight: 23 },
      { name: 'Hardware', weight: 25 },
      { name: 'Virtualization & Cloud Computing', weight: 11 },
      { name: 'Hardware & Network Troubleshooting', weight: 28 },
    ],
    faqs: [
      { q: 'How hard is the A+ Core 1 exam?', a: 'A+ is entry-level, but it is broad — Core 1 spans hardware, networking, mobile, and troubleshooting, and includes performance-based questions. Most candidates study 4–8 weeks. Consistent practice testing is the fastest way to find and close your weak spots.' },
      { q: 'Do I need both A+ exams?', a: 'Yes. The CompTIA A+ certification requires passing both Core 1 (220-1201) and Core 2 (220-1202). We provide full practice pools for each.' },
    ],
  },
  {
    slug: 'a-plus-core-2',
    code: '220-1202',
    name: 'CompTIA A+ Core 2',
    vendor: 'CompTIA',
    theme: 'comptia',
    pool: '140+', flashcards: '120+', labs: false,
    exam: { questions: 'Max 90', duration: '90 minutes', format: 'Multiple choice + performance-based', level: 'Entry-level', renewal: '3-year (CE)' },
    official: 'https://www.comptia.org/certifications/a',
    tagline: 'Operating systems, security, software troubleshooting & procedures.',
    intro:
      'CompTIA A+ Core 2 (220-1202) is the second A+ exam, focused on operating systems, security, software troubleshooting, and operational procedures. Our question pool covers Windows, macOS, Linux, and mobile OS tasks plus the security and best-practice content that trips up so many candidates.',
    domains: [
      { name: 'Operating Systems', weight: 28 },
      { name: 'Security', weight: 28 },
      { name: 'Software Troubleshooting', weight: 23 },
      { name: 'Operational Procedures', weight: 21 },
    ],
    faqs: [
      { q: 'What is the difference between A+ Core 1 and Core 2?', a: 'Core 1 (220-1201) covers hardware, networking, mobile, and virtualization. Core 2 (220-1202) covers operating systems, security, software troubleshooting, and operational procedures. You need both to earn the A+.' },
      { q: 'Is Core 2 harder than Core 1?', a: 'Many candidates find Core 2 more procedural — lots of Windows tools, security concepts, and best-practice steps. Targeted practice on the Security and Operating Systems domains pays off the most.' },
    ],
  },
  {
    slug: 'network-plus',
    code: 'N10-009',
    name: 'CompTIA Network+',
    vendor: 'CompTIA',
    theme: 'comptia',
    pool: '100+', flashcards: '120+', labs: true,
    exam: { questions: 'Max 90', duration: '90 minutes', format: 'Multiple choice + performance-based', level: 'Entry / Associate', renewal: '3-year (CE)' },
    official: 'https://www.comptia.org/certifications/network',
    tagline: 'The vendor-neutral networking foundation — and it pairs with real labs.',
    intro:
      'CompTIA Network+ (N10-009) is the vendor-neutral networking certification that opens the door to network technician and administrator roles. It covers networking fundamentals, implementations, operations, security, and troubleshooting. On Sabr, Network+ is one of the certs that pairs with hands-on graded labs in our browser network simulator — so you practice the concepts and configure them for real.',
    domains: [
      { name: 'Networking Fundamentals', weight: 23 },
      { name: 'Network Implementations', weight: 20 },
      { name: 'Network Operations', weight: 19 },
      { name: 'Network Security', weight: 14 },
      { name: 'Network Troubleshooting', weight: 24 },
    ],
    faqs: [
      { q: 'Is Network+ worth it?', a: 'Network+ is one of the most widely requested entry-level networking certs and a common stepping stone to Cisco CCNA. It proves vendor-neutral fundamentals that every network role builds on.' },
      { q: 'Does Sabr have Network+ labs?', a: 'Yes. Network+ is one of the tracks in our browser-based network simulator, with graded troubleshooting scenarios where you find the planted fault and fix it — no downloads or VMs required.' },
    ],
  },
  {
    slug: 'security-plus',
    code: 'SY0-701',
    name: 'CompTIA Security+',
    vendor: 'CompTIA',
    theme: 'comptia',
    pool: '500+', flashcards: '200+', labs: false,
    exam: { questions: 'Max 90', duration: '90 minutes', format: 'Multiple choice + performance-based', level: 'Entry / Associate', renewal: '3-year (CE)' },
    official: 'https://www.comptia.org/certifications/security',
    tagline: 'The industry-standard entry point to a cybersecurity career.',
    intro:
      'CompTIA Security+ (SY0-701) is the baseline cybersecurity certification employers ask for by name, and it satisfies the U.S. DoD 8570/8140 baseline. It covers general security concepts, threats and mitigations, security architecture, security operations, and program management. Our Security+ pool is our deepest — 500+ questions with full explanations — so you can take exam after exam without repeats.',
    domains: [
      { name: 'General Security Concepts', weight: 12 },
      { name: 'Threats, Vulnerabilities & Mitigations', weight: 22 },
      { name: 'Security Architecture', weight: 18 },
      { name: 'Security Operations', weight: 28 },
      { name: 'Security Program Management & Oversight', weight: 20 },
    ],
    faqs: [
      { q: 'How many practice questions do you have for Security+?', a: 'Security+ is our deepest pool — over 500 practice questions plus 200+ flashcards, all cited to the SY0-701 objectives. That is enough to run many full timed exams without seeing the same question twice.' },
      { q: 'Is Security+ hard?', a: 'Security+ is entry-level but broad, and the performance-based questions catch people off guard. Most candidates study 6–8 weeks. High-volume practice testing against the real objective weights is the most reliable way to pass.' },
    ],
  },
  {
    slug: 'cysa-plus',
    code: 'CS0-003',
    name: 'CompTIA CySA+',
    vendor: 'CompTIA',
    theme: 'comptia',
    pool: '100+', flashcards: '120+', labs: false,
    exam: { questions: 'Max 85', duration: '165 minutes', format: 'Multiple choice + performance-based', level: 'Intermediate', renewal: '3-year (CE)' },
    official: 'https://www.comptia.org/certifications/cybersecurity-analyst',
    tagline: 'The analyst-level, behavioral-analytics security certification.',
    intro:
      'CompTIA CySA+ (CS0-003) is an intermediate, analyst-focused security certification built around security operations, vulnerability management, incident response, and reporting. It is a strong next step after Security+ for SOC analyst and threat-detection roles. Our practice tests emphasize the log-analysis and scenario interpretation the real exam is known for.',
    domains: [
      { name: 'Security Operations', weight: 33 },
      { name: 'Vulnerability Management', weight: 30 },
      { name: 'Incident Response & Management', weight: 20 },
      { name: 'Reporting & Communication', weight: 17 },
    ],
    faqs: [
      { q: 'Should I take Security+ before CySA+?', a: 'It is not required, but Security+ builds the foundation CySA+ assumes. CySA+ is more analyst-focused, with heavier emphasis on interpreting data and responding to incidents.' },
      { q: 'Is CySA+ multiple choice only?', a: 'No — like other CompTIA exams it mixes multiple-choice with performance-based questions, so hands-on familiarity with analyst workflows matters. Our practice mirrors that scenario style.' },
    ],
  },
  {
    slug: 'pentest-plus',
    code: 'PT0-003',
    name: 'CompTIA PenTest+',
    vendor: 'CompTIA',
    theme: 'comptia',
    pool: '100+', flashcards: '120+', labs: false,
    exam: { questions: 'Max 85', duration: '165 minutes', format: 'Multiple choice + performance-based', level: 'Intermediate', renewal: '3-year (CE)' },
    official: 'https://www.comptia.org/certifications/pentest',
    tagline: 'The hands-on penetration-testing and vulnerability-assessment cert.',
    intro:
      'CompTIA PenTest+ (PT0-003) validates the skills to plan and scope an assessment, perform reconnaissance and vulnerability analysis, and report findings responsibly. It is an intermediate offensive-security credential covering the full engagement lifecycle. Our practice pool follows the official objective weighting across all five domains.',
    domains: [
      { name: 'Engagement Management', weight: 13 },
      { name: 'Reconnaissance & Enumeration', weight: 21 },
      { name: 'Vulnerability Discovery & Analysis', weight: 17 },
      { name: 'Attacks & Exploits', weight: 35 },
      { name: 'Post-exploitation & Lateral Movement', weight: 14 },
    ],
    faqs: [
      { q: 'How is PenTest+ different from CySA+?', a: 'CySA+ is defensive/analyst-focused; PenTest+ is offensive, covering how assessments are scoped, executed, and reported. Many security professionals earn both to show they understand both sides.' },
      { q: 'What experience does PenTest+ assume?', a: 'CompTIA recommends Network+ and Security+ (or equivalent knowledge) plus some hands-on security experience. It is an intermediate exam, so foundational networking and security are assumed.' },
    ],
  },
  // ── Cisco ────────────────────────────────────────────────────────────────
  {
    slug: 'ccna',
    code: '200-301',
    name: 'Cisco CCNA',
    vendor: 'Cisco',
    theme: 'cisco',
    pool: '180+', flashcards: '120+', labs: true,
    exam: { questions: '~100', duration: '120 minutes', format: 'Multiple choice + simlets', level: 'Associate', renewal: '3-year' },
    official: 'https://learningnetwork.cisco.com/s/ccna',
    tagline: 'The associate networking cert — with a real IOS lab simulator.',
    intro:
      'The Cisco CCNA (200-301) is the industry-standard associate networking certification, covering network fundamentals, access, IP connectivity, IP services, security fundamentals, and automation. On Sabr, CCNA is backed by both a deep question pool and hands-on graded labs in a browser-based Cisco IOS simulator — configure VLANs, trunks, OSPF, and more, and watch the objectives grade themselves live.',
    domains: [
      { name: 'Network Fundamentals', weight: 20 },
      { name: 'Network Access', weight: 20 },
      { name: 'IP Connectivity', weight: 25 },
      { name: 'IP Services', weight: 10 },
      { name: 'Security Fundamentals', weight: 15 },
      { name: 'Automation & Programmability', weight: 10 },
    ],
    faqs: [
      { q: 'Can I practice real Cisco IOS commands?', a: 'Yes. CCNA is a full track in our browser network simulator with graded labs — you type real IOS configuration and the objectives check themselves against the live simulation. No Packet Tracer install or VM needed.' },
      { q: 'How long does it take to study for the CCNA?', a: 'Most candidates spend 2–4 months depending on background. Pairing question practice with hands-on labs is the most effective way to prepare, because the exam tests configuration and troubleshooting, not just recall.' },
    ],
  },
  // ── HPE Aruba ────────────────────────────────────────────────────────────
  {
    slug: 'aruba-aca-campus-access',
    code: 'HPE6-A85',
    name: 'Aruba ACA – Campus Access',
    vendor: 'HPE Aruba',
    theme: 'aruba',
    pool: '100+', flashcards: '120+', labs: true,
    exam: { questions: '60', duration: '90 minutes', format: 'Multiple choice', level: 'Associate', renewal: '3-year' },
    official: 'https://certification-learning.hpe.com/tr/datacard/exam/HPE6-A85',
    tagline: 'Aruba CX switching, WLAN, routing & security — with CX labs.',
    intro:
      'The HPE Aruba Networking Certified Associate – Campus Access (HPE6-A85) validates skills across Aruba CX switching, WLAN, routing, security, and campus resiliency. It is the flagship Aruba associate credential. On Sabr it pairs with hands-on Aruba CX labs in our simulator, so you practice AOS-CX configuration alongside the question bank.',
    domains: [
      { name: 'Networking Foundations' },
      { name: 'Aruba CX Switching' },
      { name: 'Routing Essentials' },
      { name: 'Resiliency & Virtualization (VSX/VSF/LAG)' },
      { name: 'WLAN Fundamentals' },
      { name: 'Security & Access Control' },
      { name: 'Operations & Troubleshooting' },
    ],
    faqs: [
      { q: 'Does Sabr have Aruba CX labs?', a: 'Yes. The Aruba tracks include graded labs in our browser simulator with real AOS-CX command-line configuration — VLANs, trunks, VSX/VSF, and routing — checked live against the simulation.' },
      { q: 'Who is the Aruba Campus Access cert for?', a: 'It is aimed at network professionals working with Aruba campus infrastructure — switching, wireless, and access. It is the associate-level entry point into the HPE Aruba certification track.' },
    ],
  },
  {
    slug: 'aruba-aca-switching',
    code: 'HPE6-A86',
    name: 'Aruba ACA – Switching',
    vendor: 'HPE Aruba',
    theme: 'aruba',
    pool: '110+', flashcards: '120+', labs: true,
    exam: { questions: '60', duration: '90 minutes', format: 'Multiple choice', level: 'Associate', renewal: '3-year' },
    official: 'https://certification-learning.hpe.com/tr/datacard/exam/HPE6-A86',
    tagline: 'AOS-CX switching, VLANs, STP, VSF stacking & routing.',
    intro:
      'The HPE Aruba Networking Certified Associate – Switching (HPE6-A86) focuses on AOS-CX installation and configuration, VLANs and spanning tree, link aggregation, VSF stacking, and routing on CX switches. Our practice pool follows the official exam weighting, and the cert pairs with hands-on Aruba CX labs in the Sabr simulator.',
    domains: [
      { name: 'Networking & Architecture Foundations' },
      { name: 'AOS-CX Installation & Configuration' },
      { name: 'VLANs, STP & Link Aggregation' },
      { name: 'Stacking & Resiliency (VSF)' },
      { name: 'Routing on AOS-CX' },
      { name: 'Management, Monitoring & Troubleshooting' },
    ],
    faqs: [
      { q: 'How is the Switching cert different from Campus Access?', a: 'Switching (HPE6-A86) concentrates on AOS-CX switching, VLANs, stacking, and routing. Campus Access (HPE6-A85) is broader, adding WLAN and campus access/security. Both are associate-level Aruba credentials.' },
      { q: 'Can I practice AOS-CX configuration?', a: 'Yes — the Aruba tracks in our simulator include graded switching labs where you configure AOS-CX for real and the objectives verify your work live.' },
    ],
  },
  // ── Juniper ────────────────────────────────────────────────────────────
  {
    slug: 'jncia-junos',
    code: 'JN0-106',
    name: 'Juniper JNCIA-Junos',
    vendor: 'Juniper',
    theme: 'juniper',
    pool: '110+', flashcards: '120+', labs: true,
    exam: { questions: '65', duration: '90 minutes', format: 'Multiple choice', level: 'Associate', renewal: '3-year' },
    official: 'https://www.juniper.net/us/en/training/certification/tracks/junos/jncia-junos.html',
    tagline: 'Junos OS fundamentals, CLI, configuration & routing.',
    intro:
      'The Juniper JNCIA-Junos (JN0-106) is the associate-level entry point into the Juniper certification program, covering networking fundamentals, Junos OS architecture, the CLI and J-Web, initial configuration, monitoring, and routing. Sabr pairs it with hands-on Junos labs so you practice configuration mode, commits, and rollback for real.',
    domains: [
      { name: 'Networking Fundamentals' },
      { name: 'Junos OS Architecture' },
      { name: 'Junos CLI & J-Web' },
      { name: 'Initial Configuration' },
      { name: 'Operational Monitoring & Maintenance' },
      { name: 'Routing, Policy & Firewall Filters' },
    ],
    faqs: [
      { q: 'Is JNCIA-Junos a good first Juniper cert?', a: 'Yes — JNCIA-Junos is the foundational associate credential for the entire Juniper track. It proves you can navigate Junos, configure devices, and understand routing fundamentals.' },
      { q: 'Do you have Junos labs?', a: 'Yes. The Juniper track in our simulator includes graded Junos labs — interface configuration, static routing, and OSPF — with live objective checking.' },
    ],
  },
  // ── AWS ────────────────────────────────────────────────────────────────
  {
    slug: 'aws-solutions-architect-associate',
    code: 'SAA-C03',
    name: 'AWS Solutions Architect Associate',
    vendor: 'AWS',
    theme: 'aws',
    pool: '100+', flashcards: '120+', labs: false,
    exam: { questions: '65', duration: '130 minutes', format: 'Multiple choice / multiple response', level: 'Associate', renewal: '3-year' },
    official: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
    tagline: 'The most popular AWS associate cert — design on AWS.',
    intro:
      'The AWS Certified Solutions Architect – Associate (SAA-C03) is the most sought-after AWS associate certification, validating the ability to design resilient, high-performing, secure, and cost-optimized architectures on AWS. Our practice tests follow the four exam domains at official weighting with scenario questions in the AWS style.',
    domains: [
      { name: 'Design Resilient Architectures', weight: 26 },
      { name: 'Design High-Performing Architectures', weight: 24 },
      { name: 'Design Secure Architectures', weight: 30 },
      { name: 'Design Cost-Optimized Architectures', weight: 20 },
    ],
    faqs: [
      { q: 'Is SAA-C03 hard?', a: 'It is an associate exam, but the scenario questions require you to weigh trade-offs across AWS services rather than recall facts. Most candidates study 1–3 months. Practice on scenario-style questions is essential.' },
      { q: 'Do I need hands-on AWS experience?', a: 'AWS recommends around a year of hands-on experience, but strong candidates pass with focused study. Our explanations teach the "why" behind each design choice, not just the answer.' },
    ],
  },
  {
    slug: 'aws-developer-associate',
    code: 'DVA-C02',
    name: 'AWS Developer Associate',
    vendor: 'AWS',
    theme: 'aws',
    pool: '100+', flashcards: '120+', labs: false,
    exam: { questions: '65', duration: '130 minutes', format: 'Multiple choice / multiple response', level: 'Associate', renewal: '3-year' },
    official: 'https://aws.amazon.com/certification/certified-developer-associate/',
    tagline: 'Build, deploy, and debug applications on AWS.',
    intro:
      'The AWS Certified Developer – Associate (DVA-C02) validates skills in developing, deploying, and debugging cloud applications on AWS. It covers development with AWS services, security, deployment and CI/CD, and troubleshooting and optimization. Our pool mirrors the official domain weighting with developer-focused scenarios.',
    domains: [
      { name: 'Development with AWS Services', weight: 32 },
      { name: 'Security', weight: 26 },
      { name: 'Deployment', weight: 24 },
      { name: 'Troubleshooting & Optimization', weight: 18 },
    ],
    faqs: [
      { q: 'Should I take Solutions Architect or Developer first?', a: 'Both are associate-level. Solutions Architect is broader and more popular; Developer is a better fit if you write code against AWS services daily. Many people earn both.' },
      { q: 'What does the Developer exam focus on?', a: 'It leans into SDKs, serverless (Lambda, API Gateway, DynamoDB), CI/CD, IAM for applications, and debugging — more code-and-deploy than architecture.' },
    ],
  },
  // ── Microsoft ────────────────────────────────────────────────────────────
  {
    slug: 'azure-administrator',
    code: 'AZ-104',
    name: 'Microsoft Azure Administrator',
    vendor: 'Microsoft',
    theme: 'microsoft',
    pool: '100+', flashcards: '120+', labs: false,
    exam: { questions: '40–60', duration: '~100 minutes', format: 'Multiple choice, case studies', level: 'Associate', renewal: 'Annual (free)' },
    official: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/',
    tagline: 'Manage identities, storage, compute & networking in Azure.',
    intro:
      'The Microsoft Certified: Azure Administrator Associate (AZ-104) validates the skills to manage Azure identities and governance, storage, compute, virtual networking, and monitoring. It is one of the most in-demand Azure certifications for cloud operations roles. Our practice tests cover all five skill areas at exam weighting.',
    domains: [
      { name: 'Manage Azure Identities & Governance', weight: 22 },
      { name: 'Implement & Manage Storage', weight: 17 },
      { name: 'Deploy & Manage Azure Compute Resources', weight: 23 },
      { name: 'Configure & Manage Virtual Networking', weight: 22 },
      { name: 'Monitor & Maintain Azure Resources', weight: 16 },
    ],
    faqs: [
      { q: 'Is AZ-104 an entry-level Azure cert?', a: 'AZ-104 is associate-level and assumes some hands-on Azure experience. AZ-900 (Fundamentals) is the true entry point; AZ-104 is the next step for administrators.' },
      { q: 'Does the AZ-104 have case studies?', a: 'Yes — Microsoft associate exams can include case studies and drag-and-drop items alongside standard multiple choice. Our scenario questions build the reasoning those items test.' },
    ],
  },
  // ── Google Cloud ────────────────────────────────────────────────────────
  {
    slug: 'google-cloud-engineer',
    code: 'ACE',
    name: 'Google Associate Cloud Engineer',
    vendor: 'Google Cloud',
    theme: 'google',
    pool: '100+', flashcards: '120+', labs: false,
    exam: { questions: '50–60', duration: '120 minutes', format: 'Multiple choice / multiple select', level: 'Associate', renewal: '3-year' },
    official: 'https://cloud.google.com/learn/certification/cloud-engineer',
    tagline: 'Deploy and operate solutions on Google Cloud.',
    intro:
      'The Google Cloud Associate Cloud Engineer (ACE) validates the ability to set up, deploy, and operate solutions on Google Cloud, and to manage access and security. It is the foundational GCP certification for cloud engineers. Our practice tests cover all five exam sections with Google-style scenario questions.',
    domains: [
      { name: 'Setting Up a Cloud Solution Environment' },
      { name: 'Planning & Configuring a Cloud Solution' },
      { name: 'Deploying & Implementing a Cloud Solution' },
      { name: 'Ensuring Successful Operation' },
      { name: 'Configuring Access & Security' },
    ],
    faqs: [
      { q: 'Is the Associate Cloud Engineer a good first GCP cert?', a: 'Yes — ACE is the standard entry point into Google Cloud certifications and a prerequisite mindset for the Professional-level exams. It emphasizes practical console and gcloud operations.' },
      { q: 'How much gcloud command-line knowledge do I need?', a: 'A fair amount — the exam expects familiarity with gcloud, the console, and core services. Our explanations reinforce the command and console workflow behind each answer.' },
    ],
  },
  // ── ISC2 ────────────────────────────────────────────────────────────────
  {
    slug: 'isc2-cc',
    code: 'CC',
    name: 'ISC2 Certified in Cybersecurity',
    vendor: 'ISC2',
    theme: 'isc2',
    pool: '100+', flashcards: '120+', labs: false,
    exam: { questions: '100', duration: '120 minutes', format: 'Multiple choice', level: 'Entry-level', renewal: 'Annual (CPE)' },
    official: 'https://www.isc2.org/certifications/cc',
    tagline: 'The free, entry-level cybersecurity certification from ISC2.',
    intro:
      'ISC2 Certified in Cybersecurity (CC) is a genuinely entry-level security certification from the organization behind the CISSP, designed to open the door to a cybersecurity career with no experience required. It covers security principles, business continuity and incident response, access controls, network security, and security operations.',
    domains: [
      { name: 'Security Principles', weight: 26 },
      { name: 'Business Continuity, DR & Incident Response', weight: 10 },
      { name: 'Access Controls Concepts', weight: 22 },
      { name: 'Network Security', weight: 24 },
      { name: 'Security Operations', weight: 18 },
    ],
    faqs: [
      { q: 'Is ISC2 CC really free?', a: 'ISC2 has offered free exam and training through its One Million Certified in Cybersecurity program; availability can change, so check the official ISC2 page. Either way, CC is designed for people with no prior security experience.' },
      { q: 'CC or Security+ first?', a: 'CC is lighter and more concept-focused; Security+ is broader and more widely requested by employers. CC is a gentle on-ramp; many people then go on to Security+.' },
    ],
  },
  {
    slug: 'cissp',
    code: 'CISSP',
    name: 'ISC2 CISSP',
    vendor: 'ISC2',
    theme: 'isc2',
    pool: '120+', flashcards: '120+', labs: false,
    exam: { questions: '100–150 (CAT)', duration: '3 hours', format: 'Computerized adaptive testing', level: 'Advanced / Expert', renewal: '3-year (CPE)' },
    official: 'https://www.isc2.org/certifications/cissp',
    tagline: 'The gold-standard senior security certification.',
    intro:
      'The ISC2 CISSP is the world’s most recognized advanced security certification, validating expertise across eight domains of the Common Body of Knowledge. It targets experienced security practitioners, managers, and leaders and typically requires five years of paid experience to fully certify. Our practice tests span all eight CBK domains at official weighting.',
    domains: [
      { name: 'Security & Risk Management', weight: 16 },
      { name: 'Asset Security', weight: 10 },
      { name: 'Security Architecture & Engineering', weight: 13 },
      { name: 'Communication & Network Security', weight: 13 },
      { name: 'Identity & Access Management', weight: 13 },
      { name: 'Security Assessment & Testing', weight: 12 },
      { name: 'Security Operations', weight: 13 },
      { name: 'Software Development Security', weight: 10 },
    ],
    faqs: [
      { q: 'How hard is the CISSP?', a: 'The CISSP is a senior-level exam that tests breadth across eight domains and a "manager’s mindset" — choosing the best answer, not just a correct one. Most candidates study for months. High-volume domain-weighted practice is essential.' },
      { q: 'Do I need five years of experience?', a: 'To fully certify, yes — five years of cumulative paid experience across two or more domains (some substitutions apply). You can pass the exam first and become an Associate of ISC2 while you accrue the experience.' },
    ],
  },
  {
    slug: 'sc-900',
    code: 'SC-900',
    name: 'Microsoft SC-900',
    vendor: 'Microsoft',
    theme: 'microsoft',
    pool: '180+', flashcards: '120+', labs: false,
    exam: { questions: '40–60', duration: '~60 minutes', format: 'Multiple choice', level: 'Fundamentals', renewal: 'Does not expire' },
    official: 'https://learn.microsoft.com/en-us/credentials/certifications/security-compliance-and-identity-fundamentals/',
    tagline: 'Security, compliance & identity fundamentals for Microsoft.',
    intro:
      'Microsoft SC-900 (Security, Compliance, and Identity Fundamentals) is a fundamentals-level certification covering core security, compliance, and identity concepts and the Microsoft solutions that deliver them — Entra, Microsoft security, and compliance tooling. It is an excellent entry point for anyone starting in the Microsoft security ecosystem.',
    domains: [
      { name: 'Concepts of Security, Compliance & Identity', weight: 12 },
      { name: 'Capabilities of Microsoft Entra', weight: 28 },
      { name: 'Capabilities of Microsoft Security Solutions', weight: 37 },
      { name: 'Capabilities of Microsoft Compliance Solutions', weight: 23 },
    ],
    faqs: [
      { q: 'Is SC-900 worth it for beginners?', a: 'Yes — SC-900 is fundamentals-level with no prerequisites and is a clean introduction to security, compliance, and identity in the Microsoft cloud. It pairs well with AZ-900 for a broad Microsoft foundation.' },
      { q: 'Does SC-900 expire?', a: 'Microsoft fundamentals certifications do not expire, unlike the role-based associate and expert certifications which renew annually.' },
    ],
  },
];

export const CERTS_BY_SLUG = Object.fromEntries(CERTS.map((c) => [c.slug, c]));

// Marketing-friendly grouping for the index/nav.
export const CERTS_BY_VENDOR = CERTS.reduce((acc, c) => {
  (acc[c.vendor] ||= []).push(c);
  return acc;
}, {});
