import React from 'react';
import { Check, X, Sparkles, Minus } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const comparisonRows = [
    {
      feature: 'Contract Audit Turnaround Time',
      contractIQ: '< 4 Seconds (Instant)',
      lawFirm: '3 - 7 Business Days',
      genericLLM: '30 - 60 Seconds',
    },
    {
      feature: 'Cost per 20-Page Enterprise Agreement',
      contractIQ: 'Included in Plan (~$1.50)',
      lawFirm: '$1,800 - $4,500 billable',
      genericLLM: '$0.20 (High hallucination)',
    },
    {
      feature: 'Statutory Precedents & Delaware/GDPR Context',
      contractIQ: 'Tuned 40+ Jurisdictions',
      lawFirm: 'Jurisdiction Dependent',
      genericLLM: 'General Knowledge Only',
    },
    {
      feature: 'Instant Attorney-Grade Redlines with Diff',
      contractIQ: 'Yes (1-Click Apply)',
      lawFirm: 'Manual Track Changes',
      genericLLM: 'Raw text output only',
    },
    {
      feature: 'Counter-Party Negotiation Talking Points',
      contractIQ: 'Yes (Bespoke Arguments)',
      lawFirm: 'Separate Memo / Call',
      genericLLM: 'Inconsistent advice',
    },
    {
      feature: 'Zero-Data-Retention & SOC2 Security Vault',
      contractIQ: 'Guaranteed Zero-Retention',
      lawFirm: 'Email/File-share risk',
      genericLLM: 'Often trains on user data',
    },
    {
      feature: 'Post-Signature Deadline & SLA Extraction',
      contractIQ: 'Automatic Schedule Extraction',
      lawFirm: 'Extra billing required',
      genericLLM: 'Manual prompt required',
    },
  ];

  return (
    <section id="comparison" className="py-16 md:py-24 bg-[#F8F9FA] dark:bg-[#090A0C] border-b border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Competitive Benchmark
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
            Why legal teams choose ContractIQ over{' '}
            <span className="font-serif-title italic font-normal text-emerald-600 dark:text-emerald-400">
              traditional alternatives.
            </span>
          </h2>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-850">
                <th className="p-4 sm:p-5 font-bold text-neutral-900 dark:text-white text-sm w-2/5">
                  Capability & Evaluation Criteria
                </th>
                <th className="p-4 sm:p-5 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 text-sm border-x border-emerald-200 dark:border-emerald-900/60 w-1/5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>ContractIQ Agent</span>
                  </div>
                </th>
                <th className="p-4 sm:p-5 font-bold text-neutral-700 dark:text-neutral-300 w-1/5">
                  Traditional Law Firm
                </th>
                <th className="p-4 sm:p-5 font-bold text-neutral-700 dark:text-neutral-300 w-1/5">
                  Generic LLM / ChatGPT
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {comparisonRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-neutral-50/60 dark:hover:bg-neutral-850/40 transition-colors"
                >
                  <td className="p-4 sm:p-5 font-semibold text-neutral-900 dark:text-white">
                    {row.feature}
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/20 border-x border-emerald-200/60 dark:border-emerald-900/40">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{row.contractIQ}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-neutral-600 dark:text-neutral-400">
                    {row.lawFirm}
                  </td>
                  <td className="p-4 sm:p-5 text-neutral-600 dark:text-neutral-400">
                    {row.genericLLM}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
