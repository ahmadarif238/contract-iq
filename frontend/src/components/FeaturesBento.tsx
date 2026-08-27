import React from 'react';
import {
  ShieldAlert,
  Sparkles,
  Scale,
  Globe,
  FileCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
} from 'lucide-react';

export const FeaturesBento: React.FC = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-white dark:bg-[#090A0C] border-b border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Sleek Editorial Styling */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Core Agent Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
            Engineered for corporate counsel, built for{' '}
            <span className="font-serif-title italic font-normal text-emerald-600 dark:text-emerald-400">
              maximum deal velocity.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mt-4 leading-relaxed font-normal">
            Eliminate 85% of routine contract review bottlenecks with autonomous legal agents trained on corporate litigation precedents, statutory codes, and market-standard compromise language.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-5">
          {/* Card 1: Risk Scoring Engine (Col span 7) */}
          <div className="lg:col-span-7 p-7 rounded-2xl bg-neutral-50/80 dark:bg-[#111216] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between group hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-2xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center mb-5 shadow-xs">
                <ShieldAlert className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Precision Risk Analysis
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1 mb-3">
                Autonomous Risk Scoring & Trap Detection
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                ContractIQ breaks contracts down into granular atomic clauses, scoring every sentence against historical dispute precedents, market-standard fee caps, and hidden unilateral indemnities.
              </p>
            </div>

            {/* Visual preview snippet inside card */}
            <div className="mt-6 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs font-mono-code">
              <div className="flex items-center justify-between text-[11px] font-sans pb-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="font-bold text-red-600 dark:text-red-400">🔴 Critical Trap Flagged</span>
                <span className="text-neutral-400">Section 5.2</span>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 text-[11px] line-clamp-2">
                "Vendor liability capped at 1 month of fees; Customer liability uncapped..."
              </p>
              <div className="flex items-center gap-2 pt-1 text-[10px] font-sans font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Auto-corrected to mutual 12-month trailing cap</span>
              </div>
            </div>
          </div>

          {/* Card 2: Instant Redlining (Col span 5) */}
          <div className="lg:col-span-5 p-7 rounded-2xl bg-neutral-50/80 dark:bg-[#111216] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between group hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-2xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center mb-5 shadow-xs">
                <Sparkles className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Autonomous Redlines
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1 mb-3">
                Bespoke Attorney Redlining & Talking Points
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                Generates exact replacement text formatted to standard legal conventions, along with persuasive bullet-point arguments to present to the counterparty.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              <span>Negotiation success rate: 94.8%</span>
              <ArrowRight className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          {/* Card 3: Multi-Jurisdiction (Col span 4) */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-neutral-50/80 dark:bg-[#111216] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="w-9 h-9 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center mb-4">
                <Globe className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                40+ Global Jurisdictions
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                Seamlessly accounts for statutory nuances in Delaware DGCL, California Labor Code § 2870, UK English Law, EU GDPR Article 28, and Singapore SG courts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 text-[11px] font-mono text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Auto-detects choice of law clauses</span>
            </div>
          </div>

          {/* Card 4: Playbook Engine (Col span 4) */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-neutral-50/80 dark:bg-[#111216] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="w-9 h-9 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center mb-4">
                <Layers className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                Custom Legal Playbook Tuning
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                Configure your organization's non-negotiable clauses (e.g. required 30-day notice, IP ownership locks, uncapped indemnity exclusions) in plain language.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 text-[11px] font-mono text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Zero hallucinations or rogue outputs</span>
            </div>
          </div>

          {/* Card 5: Enterprise Security (Col span 4) */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-neutral-50/80 dark:bg-[#111216] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="w-9 h-9 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center mb-4">
                <Lock className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                SOC2 & Zero-Data-Retention
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                Enterprise confidentiality guaranteed. Customer agreements are processed in isolated encrypted memory vaults and never used to train public models.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 text-[11px] font-mono text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>AES-256 • TLS 1.3 • HIPAA/GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
