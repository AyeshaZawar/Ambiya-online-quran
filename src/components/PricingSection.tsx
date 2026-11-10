import React from 'react';

interface PricingSectionProps {
  onOpenTrial: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenTrial }) => {
  return (
    <section id="fees" className="pt-16 pb-20 md:pt-20 md:pb-24 border-t border-[#ece6dc]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Overline */}
          <span className="text-[12px] sm:text-[13px] tracking-[0.16em] uppercase font-bold text-[#b28338] mb-3 block">
            Simple Pricing
          </span>

          {/* Headline */}
          <h2 className="font-serif text-[34px] sm:text-[40px] leading-[1.2] text-[#11382b] font-normal tracking-[-0.01em] mb-6">
            Affordable Plans for Every Family
          </h2>

          {/* Description */}
          <p className="text-[16px] leading-relaxed text-[#4f5953] font-normal">
            Start with a completely free trial week — no card required. After your trial, choose a flexible monthly plan based on how many sessions per week fit your schedule. Contact us for current rates and to find the right plan for your family.
          </p>
        </div>
      </div>
    </section>
  );
};
