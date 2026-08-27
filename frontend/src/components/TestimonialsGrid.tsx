import React from 'react';
import { CASE_STUDIES } from '../data/siteData';
import { Star, CheckCircle2, Quote } from 'lucide-react';

export const TestimonialsGrid: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-[#090A0C] border-b border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Social Proof & Case Studies
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
            Trusted by modern General Counsels, CFOs, and{' '}
            <span className="font-serif-title italic font-normal text-emerald-600 dark:text-emerald-400">
              dealmakers.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              className="p-7 rounded-2xl bg-neutral-50/80 dark:bg-[#111216] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between shadow-2xs group hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                    {study.logoText}
                  </span>
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    <span>{study.metrics.value}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 italic leading-relaxed mb-6 font-normal">
                  "{study.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-neutral-200/80 dark:border-neutral-800">
                <img
                  src={study.avatarUrl}
                  alt={study.author}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      {study.author}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
                    {study.role}, {study.company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
