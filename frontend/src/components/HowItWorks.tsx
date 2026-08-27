import React from 'react';
import { Upload, Cpu, FileCheck, ArrowRight, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Upload,
      title: 'Ingest & OCR Extraction',
      description: 'Upload any contract in PDF, Word (.docx), or direct plain text. The agent parses clause hierarchies, definitions, and cross-referenced schedules.',
    },
    {
      num: '02',
      icon: Cpu,
      title: 'Neural Risk & Playbook Audit',
      description: 'The agent compares every clause against 50,000+ corporate precedents, statutory benchmarks, and your internal risk tolerance settings.',
    },
    {
      num: '03',
      icon: FileCheck,
      title: 'Autonomous Redline & Negotiation',
      description: 'Receive color-coded risk grades, attorney-grade redlines with strike-throughs, and persuasive counterparty talking points ready to copy.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F8F9FA] dark:bg-[#090A0C] border-b border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Autonomous Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
            How ContractIQ turns 4-hour legal reviews into{' '}
            <span className="font-serif-title italic font-normal text-emerald-600 dark:text-emerald-400">
              4-second decisions.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-sm">
                      <Icon className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
                    </div>
                    <span className="text-3xl font-serif-title italic text-neutral-300 dark:text-neutral-700 font-bold">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Sub-second automated execution</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
