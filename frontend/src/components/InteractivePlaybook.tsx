import React, { useState } from 'react';
import { BookOpen, Check, Sliders, Sparkles, Shield, AlertCircle } from 'lucide-react';

interface PlaybookRule {
  id: string;
  category: string;
  ruleTitle: string;
  standardPosition: string;
  fallbackPosition: string;
  enabled: boolean;
}

export const InteractivePlaybook: React.FC = () => {
  const [rules, setRules] = useState<PlaybookRule[]>([
    {
      id: 'rule-1',
      category: 'Liability',
      ruleTitle: 'Mutual Aggregate Liability Cap',
      standardPosition: 'Mutual cap equal to 12 months of fees paid or payable.',
      fallbackPosition: '2x total contract value (or $500k minimum insurance sublimit).',
      enabled: true,
    },
    {
      id: 'rule-2',
      category: 'Indemnification',
      ruleTitle: 'Reciprocal IP Infringement Defense',
      standardPosition: 'Vendor must defend and hold harmless Customer against all third-party patent/copyright claims.',
      fallbackPosition: 'Mutual defense with capped defense reimbursement costs.',
      enabled: true,
    },
    {
      id: 'rule-3',
      category: 'Data & Security',
      ruleTitle: '48-Hour Data Breach Notification SLA',
      standardPosition: 'Written notice within 48 hours of confirmed security incident.',
      fallbackPosition: '72 hours notice (strict statutory GDPR parity).',
      enabled: true,
    },
    {
      id: 'rule-4',
      category: 'Termination',
      ruleTitle: 'Termination for Convenience & 30-Day Cure',
      standardPosition: 'Both parties retain right to terminate for material breach after 30 days notice.',
      fallbackPosition: 'Immediate termination only for uncured insolvency or willful data breach.',
      enabled: true,
    },
  ]);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  return (
    <section id="playbook" className="py-16 md:py-24 bg-white dark:bg-[#090A0C] border-b border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Dynamic Playbook Configurator
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
              Enforce your corporate legal guidelines{' '}
              <span className="font-serif-title italic font-normal text-emerald-600 dark:text-emerald-400">
                automatically.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-3 font-normal">
              Toggle policy guardrails below to see how ContractIQ instantly adjusts risk scoring thresholds and auto-generates your company's preferred compromise language.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 self-start lg:self-auto">
            <span className="text-xs font-semibold px-3 py-1 text-neutral-600 dark:text-neutral-400">
              Active Rules: <strong className="text-emerald-600 dark:text-emerald-400">{rules.filter((r) => r.enabled).length}/{rules.length}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              onClick={() => toggleRule(rule.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer select-none ${
                rule.enabled
                  ? 'bg-neutral-50/90 dark:bg-[#111216] border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                  : 'bg-neutral-50/50 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-neutral-500 dark:text-neutral-400">
                    {rule.category}
                  </span>
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                    {rule.ruleTitle}
                  </h4>
                </div>

                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                    rule.enabled
                      ? 'bg-emerald-600 text-white'
                      : 'border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                  }`}
                >
                  {rule.enabled && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono-code">
                <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] font-sans font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                    Primary Standard Position:
                  </span>
                  <p className="text-neutral-800 dark:text-neutral-200 text-[11px]">
                    {rule.standardPosition}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-neutral-100/70 dark:bg-neutral-850/50 border border-neutral-200/60 dark:border-neutral-800/60">
                  <span className="text-[10px] font-sans font-bold text-neutral-500 block mb-0.5">
                    Fallback Compromise:
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-400 text-[11px]">
                    {rule.fallbackPosition}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
