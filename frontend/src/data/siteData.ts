import { PricingTier, CaseStudy, FAQItem } from '../types';

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter Agent',
    description: 'Essential AI contract scanning and risk flagging for founders, creators, and small businesses.',
    priceMonthly: 49,
    priceAnnual: 39,
    badge: 'Fast Setup',
    features: [
      'Up to 30 Contract Audits / month',
      'Instant Risk Scoring & Letter Grades',
      'One-Click Redlining & Counter Proposals',
      'Plain-English Executive Summaries',
      'Export to PDF & Markdown',
      'Standard Email Support',
    ],
    ctaText: 'Start Free 14-Day Trial',
  },
  {
    id: 'pro',
    name: 'Legal Counsel Pro',
    description: 'Autonomous legal copilot with multi-jurisdiction compliance and interactive clause editing for growing teams.',
    priceMonthly: 149,
    priceAnnual: 119,
    popular: true,
    badge: 'Most Popular',
    features: [
      'Unlimited Contract Audits & Deep Scans',
      'Real-time Multi-Turn AI Legal Negotiation Chat',
      '40+ Global Jurisdictions (US, UK, EU, SG, APAC)',
      'Custom Internal Playbook & Risk Appetite Engine',
      'Side-by-Side Redline Diff with Talking Points',
      'Post-Signature Obligation & Milestone Tracker',
      'SOC2 Type II & Zero-Data-Retention Vault',
      'Priority 24/7 Attorney-Assisted Support',
    ],
    ctaText: 'Get Started with Pro',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Fleet',
    description: 'Tailored AI agent fleet with custom ERP/CLM connectors, bespoke playbook fine-tuning, and dedicated SLA.',
    priceMonthly: 499,
    priceAnnual: 399,
    badge: 'Custom Architecture',
    features: [
      'Everything in Counsel Pro',
      'Unlimited Seats & Autonomous Agent Fleet',
      'Bespoke Company Legal Playbook Tuning',
      'Direct Salesforce, Ironclad, DocuSign, Slack Sync',
      'Dedicated Private Cloud / On-Prem VPC Deployment',
      'Custom Gemini Fine-Tuned Model Weights',
      'Custom DPA, BAA & 99.99% Uptime SLA',
      'Dedicated Legal AI Solutions Architect',
    ],
    ctaText: 'Schedule Enterprise Demo',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'study-1',
    company: 'Fintech Velocity',
    logoText: 'VELOCITY PAY',
    industry: 'Payments & Banking SaaS',
    metrics: { label: 'Review Velocity', value: '8.4x Faster' },
    quote: 'ContractIQ cut our MSA negotiation cycle from 18 days down to under 36 hours. The AI caught an uncapped indemnity clause that would have exposed us to $2.4M in potential third-party patent litigation.',
    author: 'Eleanor Vance',
    role: 'General Counsel & VP Legal',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'study-2',
    company: 'HyperScale Cloud',
    logoText: 'HYPERSCALE',
    industry: 'Enterprise Infrastructure',
    metrics: { label: 'Outside Counsel Cost', value: '$340k Saved' },
    quote: 'We uploaded over 400 vendor contracts during our Series C audit. ContractIQ categorized every renewal trap, SLA gap, and liability anomaly in a single afternoon. It is genuinely like having 10 elite senior associates on call 24/7.',
    author: 'Marcus Chen',
    role: 'Chief Financial Officer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'study-3',
    company: 'Aether BioTech',
    logoText: 'AETHER BIO',
    industry: 'Life Sciences & Patents',
    metrics: { label: 'Risk Detection Rate', value: '99.4% Accuracy' },
    quote: 'The precision on IP ownership, grant-backs, and trade secret carveouts is astonishing. It provides not just the redline, but the exact counterparty talking points and statutory justification.',
    author: 'Dr. Sarah Al-Mansoor',
    role: 'Head of Business Development',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How accurate is ContractIQ compared to a traditional attorney review?',
    answer: 'ContractIQ is built on Gemini 3.7 advanced reasoning models tuned with extensive corporate legal taxonomies, UCC provisions, DGCL statutes, GDPR/CCPA regulations, and thousands of market-standard agreements. In benchmark tests, ContractIQ identifies 99.2% of non-standard commercial risk traps and drafts attorney-grade redlines in seconds.',
    category: 'Accuracy & Performance',
  },
  {
    question: 'Is my confidential contract data secure and protected?',
    answer: 'Yes. We enforce enterprise-grade security with AES-256 encryption at rest and TLS 1.3 in transit. We maintain a strict Zero-Data-Retention policy where your proprietary contract texts and sensitive corporate data are never used to train public foundation models.',
    category: 'Security & Privacy',
  },
  {
    question: 'Can ContractIQ enforce our company’s internal legal playbook?',
    answer: 'Absolutely. You can customize your risk appetite (Startup-Friendly, Balanced, or Ultra-Strict) and define required clauses (such as mandatory Delaware governing law, mutual 12-month liability caps, 30-day breach notice, or 100% IP assignment) directly in your settings.',
    category: 'Customization',
  },
  {
    question: 'Which file formats and jurisdictions are supported?',
    answer: 'ContractIQ accepts direct text pasting, PDF files, Microsoft Word (.docx), and plain text documents. It supports 40+ legal jurisdictions including United States (Delaware, New York, California, Texas, Federal), United Kingdom (English Law), European Union (Civil & Common Law frameworks), Canada, Australia, and Singapore.',
    category: 'Technical Specifications',
  },
  {
    question: 'Can I chat with the AI Agent about specific contract terms?',
    answer: 'Yes! ContractIQ features an interactive conversational copilot. You can ask questions like "What are my termination penalties under Section 7?", "Draft a compromise indemnity clause", or "What happens if we miss the renewal deadline?" and receive instant, legally grounded guidance.',
    category: 'Features',
  },
];
