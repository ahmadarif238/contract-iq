import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface CTASectionProps {
  onScrollToWorkspace: () => void;
  onOpenDemo: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  onScrollToWorkspace,
  onOpenDemo,
}) => {
  return (
    <section className="py-20 bg-neutral-900 text-white relative overflow-hidden dark:bg-black border-b border-neutral-800">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Autonomous Contract Intelligence
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
          Ready to eliminate contract review risk{' '}
          <span className="font-serif-title italic font-normal text-emerald-400">
            forever?
          </span>
        </h2>

        <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Join 140,000+ audited agreements. Audit your next commercial agreement in 4 seconds with zero data training risk.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={onScrollToWorkspace}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-neutral-950 text-sm font-bold hover:bg-neutral-100 transition-all shadow-md group cursor-pointer"
          >
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>Launch Live Agent Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-neutral-800 text-white text-sm font-semibold border border-neutral-700 hover:bg-neutral-750 transition-all cursor-pointer"
          >
            <span>Request Custom API Demo</span>
          </button>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SOC2 Type II Certified</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Data-Retention Vault</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>40+ Global Jurisdictions</span>
          </div>
        </div>
      </div>
    </section>
  );
};
