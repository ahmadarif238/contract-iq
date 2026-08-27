import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  FileCheck,
  Layers,
  Scale,
  CheckCircle2,
} from 'lucide-react';

interface HeroSectionProps {
  onScrollToWorkspace: () => void;
  onSelectSampleContract: (contractId: string) => void;
  onOpenDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToWorkspace,
  onSelectSampleContract,
  onOpenDemo,
}) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-18 md:pb-22 overflow-hidden border-b border-neutral-200/80 dark:border-neutral-800">
      {/* Subtle architectural background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Sleek Interface Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#111216] border border-neutral-200 dark:border-neutral-800 shadow-2xs text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-700 dark:text-emerald-400 font-mono uppercase tracking-wider text-[10px]">
              AI Agent v2.4 Now Live
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="text-neutral-600 dark:text-neutral-400">Autonomous Legal Risk Redlining</span>
          </div>

          {/* Sleek Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.06]">
            Legal Intelligence{' '}
            <span className="block font-serif-title italic font-normal text-neutral-800 dark:text-neutral-200">
              Without the Overhead.
            </span>
          </h1>

          {/* Refined Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Upload your MSAs, NDAs, and SLAs. Our agent identifies high-risk clauses, detects hidden liabilities, and suggests optimal legal phrasing in seconds, not hours.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onScrollToWorkspace}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-md group cursor-pointer"
              id="hero-launch-workspace-btn"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              <span>Launch Live Contract Audit</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all shadow-xs cursor-pointer"
              id="hero-book-demo-btn"
            >
              <span>Book Enterprise Demo</span>
            </button>
          </div>

          {/* Quick-load Sample Pills */}
          <div className="pt-4 flex flex-col items-center gap-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Or test drive with pre-loaded enterprise agreements:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => {
                  onSelectSampleContract('saas-msa');
                  onScrollToWorkspace();
                }}
                className="px-3 py-1 text-xs rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>Cloud SaaS MSA</span>
              </button>

              <button
                onClick={() => {
                  onSelectSampleContract('mutual-nda');
                  onScrollToWorkspace();
                }}
                className="px-3 py-1 text-xs rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Mutual NDA & Non-Solicit</span>
              </button>

              <button
                onClick={() => {
                  onSelectSampleContract('executive-employment');
                  onScrollToWorkspace();
                }}
                className="px-3 py-1 text-xs rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>Executive Employment</span>
              </button>

              <button
                onClick={() => {
                  onSelectSampleContract('vendor-sow');
                  onScrollToWorkspace();
                }}
                className="px-3 py-1 text-xs rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Vendor SOW & SLA</span>
              </button>
            </div>
          </div>

          {/* Social Proof & Metrics Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-neutral-200/80 dark:border-neutral-800 text-left">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white">
                98.2%
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
                Accuracy Rate
              </div>
            </div>

            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white">
                &lt; 30s
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
                Review Time
              </div>
            </div>

            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white">
                $420k+
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
                Avg. Legal Fees Saved
              </div>
            </div>

            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white">
                100%
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
                Private & SOC2 Certified
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
