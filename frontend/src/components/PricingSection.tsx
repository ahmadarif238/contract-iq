import React, { useState } from 'react';
import { PRICING_TIERS } from '../data/siteData';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface PricingProps {
  onSelectPlan: (planId: string) => void;
}

export const PricingSection: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [annualBilling, setAnnualBilling] = useState(true);

  return (
    <section id="pricing" className="py-16 md:py-24 bg-[#F8F9FA] dark:bg-[#090A0C] border-b border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
            Predictable pricing for solo founders to{' '}
            <span className="font-serif-title italic font-normal text-emerald-600 dark:text-emerald-400">
              enterprise legal fleets.
            </span>
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto font-normal">
            No unpredictable hourly billing. Get unlimited automated reviews, custom playbook rules, and multi-turn AI negotiation support.
          </p>

          {/* Billing Switch */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                !annualBilling
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Monthly Billing
            </button>

            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                annualBilling
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500 text-white font-bold">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {PRICING_TIERS.map((tier) => {
            const price = annualBilling ? tier.priceAnnual : tier.priceMonthly;

            return (
              <div
                key={tier.id}
                className={`p-7 rounded-2xl flex flex-col justify-between transition-all ${
                  tier.popular
                    ? 'bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-white shadow-lg relative'
                    : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-mono uppercase font-bold tracking-wider shadow-xs">
                    ★ Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {tier.name}
                    </h3>
                    {tier.badge && !tier.popular && (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 font-normal min-h-[36px]">
                    {tier.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-4xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white">
                      ${price}
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">/ month</span>
                    {annualBilling && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium ml-2">
                        (billed annually)
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 text-xs mb-8">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectPlan(tier.id)}
                  className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                    tier.popular
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
