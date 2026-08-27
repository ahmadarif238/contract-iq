import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

interface AnnouncementBarProps {
  onOpenDemo: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenDemo }) => {
  return (
    <div className="bg-neutral-900 text-white text-xs py-2 px-4 border-b border-neutral-800 transition-colors dark:bg-black dark:border-neutral-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left release note */}
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium text-[11px] border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            v2.8 Deep Neural Audit
          </span>
          <span className="text-neutral-300 font-medium">
            ContractIQ Autonomous Legal Agent is now live across 40+ global jurisdictions.
          </span>
          <button
            onClick={onOpenDemo}
            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors ml-1"
          >
            Book live walkthrough
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Right status badge */}
        <div className="hidden md:flex items-center gap-3 text-neutral-400 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-neutral-300">Agent Fleet Operational (99.99%)</span>
          </div>
          <span className="text-neutral-600">•</span>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>SOC2 Type II • Zero-Data-Retention</span>
          </div>
        </div>
      </div>
    </div>
  );
};
