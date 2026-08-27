export interface AuditedClause {
  id: string;
  title: string;
  category: string;
  riskLevel: 'critical' | 'moderate' | 'favorable' | 'neutral';
  originalText: string;
  issueDescription: string;
  recommendedRedline: string;
  counterPartyTalkingPoint?: string;
  legalRationale?: string;
  appliedRedline?: boolean;
}

export interface ObligationDeadline {
  obligation: string;
  timeframe: string;
  consequence?: string;
}

export interface ContractAudit {
  overallScore: number;
  riskGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
  criticalRisksCount: number;
  moderateRisksCount: number;
  favorableTermsCount: number;
  financialExposureEstimate?: string;
  negotiationAdvantage?: string;
  keyClauses: AuditedClause[];
  missingStandardClauses: string[];
  keyObligationDeadlines?: ObligationDeadline[];
}

export interface SampleContract {
  id: string;
  title: string;
  category: string;
  type: string;
  defaultParty: string;
  description: string;
  badge: string;
  riskCount: number;
  text: string;
  initialAudit?: ContractAudit;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  badge?: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
}

export interface CaseStudy {
  id: string;
  company: string;
  logoText: string;
  industry: string;
  metrics: { label: string; value: string };
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
