import React, { useState } from 'react';
import { AuditedClause } from '../types';
import { X, Copy, Check, ShieldAlert, Sparkles, Scale, BookOpen, AlertTriangle } from 'lucide-react';

interface ClauseDetailModalProps {
  clause: AuditedClause | null;
  onClose: () => void;
}

export const ClauseDetailModal: React.FC<ClauseDetailModalProps> = ({ clause, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!clause) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  clause.riskLevel === 'critical'
                    ? 'bg-red-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {clause.riskLevel} Risk
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                Category: {clause.category}
              </span>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              {clause.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Original Text */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono font-bold uppercase text-red-600 dark:text-red-400">
            Original Clause Language:
          </span>
          <div className="p-3 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-xs font-mono-code text-red-950 dark:text-red-200">
            {clause.originalText}
          </div>
        </div>

        {/* Issue Breakdown */}
        <div className="space-y-1.5 text-xs">
          <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Legal Analysis & Identified Trap:
          </span>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-neutral-850 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
            {clause.issueDescription}
          </p>
        </div>

        {/* Proposed Redline */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
              ContractIQ Proposed Redline:
            </span>
            <button
              onClick={() => handleCopy(clause.recommendedRedline)}
              className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1"
            >
              {copied ? (
                <span className="text-emerald-600">Copied!</span>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Redline</span>
                </>
              )}
            </button>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs font-mono-code text-emerald-950 dark:text-emerald-200 font-medium">
            {clause.recommendedRedline}
          </div>
        </div>

        {/* Negotiation Script & Market Precedent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-1">
            <span className="font-bold text-neutral-900 dark:text-white block">
              Negotiation Talking Point:
            </span>
            <p className="text-neutral-600 dark:text-neutral-400 italic text-[11px]">
              "{clause.counterPartyTalkingPoint || 'Propose market-standard mutual reciprocity and reference standard corporate insurance sublimits.'}"
            </p>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-1">
            <span className="font-bold text-neutral-900 dark:text-white block">
              Market Precedent Rate:
            </span>
            <p className="text-neutral-600 dark:text-neutral-400 text-[11px]">
              91.4% of Fortune 500 tech enterprise MSAs enforce mutual liability caps and reciprocal intellectual property defense.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
