import React from 'react';

interface CtaBannerProps {
  onOpenTrial: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenTrial }) => {
  return (
    <section className="bg-[#124133] py-16 md:py-20 text-center px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="font-serif text-[26px] xs:text-[30px] sm:text-[38px] text-white font-bold tracking-tight mb-3">
          Begin Your Free Trial Today
        </h2>

        <p className="text-[#d0ded6] text-[14.5px] sm:text-[16px] mb-7 sm:mb-8 font-normal max-w-xl">
          No credit card needed — just register, schedule, and start learning.
        </p>

        <button
          type="button"
          onClick={onOpenTrial}
          className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-[#225c48] hover:bg-[#2b6e58] text-white text-[15px] font-medium transition-all shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap text-center"
        >
          Register for Free Trial
        </button>
      </div>
    </section>
  );
};
