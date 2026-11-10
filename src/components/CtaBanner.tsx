import React from 'react';
import { motion } from 'motion/react';

interface CtaBannerProps {
  onOpenTrial: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenTrial }) => {
  return (
    <section className="bg-[#124133] py-16 md:py-20 text-center px-4 sm:px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Headline - Up to Down */}
        <motion.h2 
          initial={{ opacity: 0, y: -25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="font-serif text-[26px] xs:text-[30px] sm:text-[38px] text-white font-bold tracking-tight mb-3"
        >
          Begin Your Free Trial Today
        </motion.h2>

        {/* Subtitle - Fade in */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, delay: 0.15, ease: 'easeOut' }}
          className="text-[#d0ded6] text-[14.5px] sm:text-[16px] mb-7 sm:mb-8 font-normal max-w-xl"
        >
          No credit card needed — just register, schedule, and start learning.
        </motion.p>

        {/* Button - Scale & Fade */}
        <motion.button
          type="button"
          onClick={onOpenTrial}
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-[#225c48] hover:bg-[#2b6e58] text-white text-[15px] font-medium transition-all shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap text-center"
        >
          Register for Free Trial
        </motion.button>
      </div>
    </section>
  );
};
