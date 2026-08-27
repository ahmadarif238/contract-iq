import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#F8F9FA] dark:bg-[#090A0C] text-neutral-900 dark:text-white pt-16 pb-12 border-t border-neutral-200/80 dark:border-neutral-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-neutral-200 dark:border-neutral-800">
          {/* Col 1: Brand & Newsletter (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold tracking-tighter">
                <span className="font-serif-title text-lg italic font-bold">C</span>
                <span className="text-xs font-mono font-black text-emerald-400 dark:text-emerald-600 ml-[-2px]">IQ</span>
              </div>
              <span className="font-bold tracking-tight text-base">
                Contract<span className="font-serif-title italic font-normal text-emerald-600 dark:text-emerald-400">IQ</span>
              </span>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm font-normal">
              Autonomous legal intelligence and contract risk auditing engine designed for corporate counsel, finance leaders, and fast-moving executive dealmakers.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="block font-bold text-neutral-900 dark:text-white mb-1.5">
                Subscribe to The Modern Counsel Dispatch
              </span>
              <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter work email..."
                  required
                  className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold hover:bg-neutral-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </form>
              {subscribed && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block font-medium">
                  ✓ Subscribed! You'll receive our monthly contract risk breakdown.
                </span>
              )}
            </div>
          </div>

          {/* Col 2: Product (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-bold text-neutral-900 dark:text-white uppercase font-mono text-[11px] tracking-wider block">
              Capabilities
            </span>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><a href="#agent-workspace" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Risk Scoring Engine</a></li>
              <li><a href="#agent-workspace" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Instant Redline Generator</a></li>
              <li><a href="#agent-workspace" className="hover:text-neutral-900 dark:hover:text-white transition-colors">AI Negotiation Copilot</a></li>
              <li><a href="#playbook" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Playbook Enforcement</a></li>
              <li><a href="#agent-workspace" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Obligation Tracker</a></li>
            </ul>
          </div>

          {/* Col 3: Jurisdictions (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="font-bold text-neutral-900 dark:text-white uppercase font-mono text-[11px] tracking-wider block">
              Supported Frameworks
            </span>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><span>US Corporate (Delaware DGCL)</span></li>
              <li><span>California (CCPA & Labor Code §2870)</span></li>
              <li><span>UK & English Common Law</span></li>
              <li><span>European Union (GDPR Article 28)</span></li>
              <li><span>Singapore International Commercial Law</span></li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-bold text-neutral-900 dark:text-white uppercase font-mono text-[11px] tracking-wider block">
              Security & Privacy
            </span>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> SOC2 Type II</span></li>
              <li><span>Zero Data Retention</span></li>
              <li><span>AES-256 Vault Encryption</span></li>
              <li><span>HIPAA & DPA Available</span></li>
              <li><span>Custom Private VPC</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Agent Infrastructure 99.99% Operational</span>
          </div>

          <div className="flex items-center gap-6">
            <span>© 2026 ContractIQ Inc. All rights reserved.</span>
            <span>Built with Sada Theme precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
