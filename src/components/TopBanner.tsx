import React from 'react';
import { motion } from 'motion/react';

interface TopBannerProps {
  onOpenTrial: () => void;
}

export const TopBanner: React.FC<TopBannerProps> = ({ onOpenTrial }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-[#103b2d] text-white text-[13px] sm:text-[13.5px] py-2 px-4 sm:px-8 border-b border-[#184a3b]/40"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 font-normal text-[#d6e3dc]">
        <span>Trusted by families in 20+ countries</span>
        <div className="flex items-center gap-1.5">
          <span>No credit card required for your free trial —</span>
          <button 
            type="button"
            onClick={onOpenTrial}
            className="text-[#d8ad63] font-semibold hover:underline cursor-pointer transition-colors"
          >
            Start now
          </button>
        </div>
      </div>
    </motion.div>
  );
};
