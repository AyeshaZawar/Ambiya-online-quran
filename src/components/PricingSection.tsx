import React from 'react';
import { motion } from 'motion/react';

interface PricingSectionProps {
  onOpenTrial: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenTrial }) => {
  return (
    <section id="fees" className="pt-16 pb-20 md:pt-20 md:pb-24 border-t border-[#ece6dc]/60 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Overline - Up to down */}
          <motion.span 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-[12px] sm:text-[13px] tracking-[0.16em] uppercase font-bold text-[#b28338] mb-3 block"
          >
            Simple Pricing
          </motion.span>

          {/* Headline - Up to down */}
          <motion.h2 
            initial={{ opacity: 0, y: -25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="font-serif text-[34px] sm:text-[40px] leading-[1.2] text-[#11382b] font-normal tracking-[-0.01em] mb-6"
          >
            Affordable Plans for Every Family
          </motion.h2>

          {/* Description - Left to Right */}
          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: 0.25, ease: 'easeOut' }}
            className="text-[16px] leading-relaxed text-[#4f5953] font-normal"
          >
            Start with a completely free trial week — no card required. After your trial, choose a flexible monthly plan based on how many sessions per week fit your schedule. Contact us for current rates and to find the right plan for your family.
          </motion.p>
        </div>
      </div>
    </section>
  );
};
