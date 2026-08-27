import React, { useState, useEffect } from 'react';
import { Search, X, ShieldAlert, Sparkles, FileText, ArrowRight, Zap } from 'lucide-react';
import { SAMPLE_CONTRACTS } from '../data/sampleContracts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContract: (contractId: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectContract,
  onScrollToSection,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredContracts = SAMPLE_CONTRACTS.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase()) ||
      c.badge.toLowerCase().includes(query.toLowerCase())
  );

  const quickNav = [
    { label: 'Live AI Audit Studio', id: 'agent-workspace', desc: 'Scan agreements and generate redlines' },
    { label: 'Core Capabilities (Bento)', id: 'features', desc: 'Risk scoring, redlining, jurisdiction engine' },
    { label: 'Legal Playbook Engine', id: 'playbook', desc: 'Configure company policy thresholds' },
    { label: 'Competitive Comparison', id: 'comparison', desc: 'ContractIQ vs Law Firms vs Generic LLM' },
    { label: 'Pricing & Plans', id: 'pricing', desc: 'Starter, Counsel Pro, Enterprise Fleet' },
    { label: 'Frequently Answered Questions', id: 'faq', desc: 'Security, accuracy, and SOC2' },
  ].filter((item) => item.label.toLowerCase().includes(query.toLowerCase()) || item.desc.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contracts, clauses, features, or sections (e.g. 'Indemnity', 'Pricing')..."
            autoFocus
            className="flex-1 bg-transparent border-none text-sm text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs"
          >
            <kbd className="font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-300 dark:border-neutral-700">
              ESC
            </kbd>
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-4 text-xs">
          {/* Contracts Section */}
          {filteredContracts.length > 0 && (
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 px-2 block mb-1.5">
                Pre-Loaded Agreements
              </span>
              <div className="space-y-1">
                {filteredContracts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectContract(c.id);
                      onScrollToSection('agent-workspace');
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <span className="font-bold text-neutral-900 dark:text-white block">
                          {c.title}
                        </span>
                        <span className="text-[11px] text-neutral-500 line-clamp-1">
                          {c.badge} • {c.category}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Section */}
          {quickNav.length > 0 && (
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 px-2 block mb-1.5">
                Quick Navigation
              </span>
              <div className="space-y-1">
                {quickNav.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onScrollToSection(item.id);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Zap className="w-4 h-4 text-neutral-400 group-hover:text-emerald-500" />
                      <div>
                        <span className="font-bold text-neutral-900 dark:text-white block">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredContracts.length === 0 && quickNav.length === 0 && (
            <div className="py-8 text-center text-neutral-500 text-xs">
              No results found for "{query}". Try "SaaS", "Indemnity", or "Pricing".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
