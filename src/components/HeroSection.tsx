import React from 'react';

interface HeroSectionProps {
  onOpenTrial: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenTrial }) => {
  const steps = [
    'Register for your free trial class.',
    'Choose a day and time that fits your schedule.',
    'Begin a full week of free trial lessons.',
  ];

  return (
    <section 
      className="pt-12 pb-20 md:pt-16 md:pb-24 transition-colors"
      style={{
        background: 'radial-gradient(ellipse at 12% 20%, #f8f1e4 0%, #fcf9f3 55%, #f6eee0 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column Content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Tagline / Overline */}
            <span className="text-[12px] sm:text-[13px] tracking-[0.16em] uppercase font-bold text-[#b28338] mb-3 sm:mb-4">
              Online Quran Classes for Kids & Adults
            </span>

            {/* Main Headline */}
            <h1 className="font-serif text-[30px] xs:text-[34px] sm:text-[44px] md:text-[52px] lg:text-[56px] leading-[1.16] text-[#11382b] font-normal tracking-[-0.01em] mb-5 sm:mb-6 text-balance">
              Learn the Quran with Tajweed, from the Comfort of Home
            </h1>

            {/* Subtitle */}
            <p className="text-[15px] sm:text-[17px] leading-relaxed text-[#4f5953] max-w-xl mb-7 sm:mb-8 font-normal">
              One-on-one lessons with qualified, patient tutors — flexible scheduling for students of every age and level, anywhere in the world.
            </p>

            {/* Numbered Steps */}
            <div className="space-y-3.5 sm:space-y-4 mb-8 sm:mb-9 w-full max-w-lg">
              {steps.map((stepText, idx) => (
                <div key={idx} className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-7 h-7 rounded-full bg-[#11382b] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {idx + 1}
                  </div>
                  <span className="text-[14.5px] sm:text-[15.5px] font-medium text-[#25332c]">
                    {stepText}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 pt-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenTrial}
                className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white text-[15px] font-medium transition-all shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap text-center"
              >
                Start Free Trial
              </button>
              <span className="text-[13px] sm:text-[13.5px] text-[#6b756f] font-normal text-center sm:text-left">
                No credit card or payment required
              </span>
            </div>
          </div>

          {/* Right Column Visual Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div 
              className="relative w-full max-w-[440px] aspect-square rounded-[28px] overflow-hidden shadow-xl border border-[#d8b56f]/30 transition-transform hover:scale-[1.01] group bg-stone-900"
              style={{
                boxShadow: '0 20px 40px -15px rgba(17, 56, 43, 0.25)',
              }}
            >
              {/* Background Photography Asset - Unobstructed & Professional */}
              <img
                src="/images/hero_quran_academy.jpg"
                alt="Online Quran study session with open Quran and tajweed lessons"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Subtle inner framing accent */}
              <div className="absolute inset-3 rounded-[22px] border border-white/20 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
