import React from 'react';

interface WhyStudySectionProps {
  onOpenTrial: () => void;
}

export const WhyStudySection: React.FC<WhyStudySectionProps> = ({ onOpenTrial }) => {
  return (
    <section id="about" className="py-16 md:py-20 border-t border-[#ece6dc]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column Content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Tagline / Overline */}
            <span className="text-[12px] sm:text-[13px] tracking-[0.16em] uppercase font-bold text-[#b28338] mb-3">
              Why Study With Us
            </span>

            {/* Main Headline */}
            <h2 className="font-serif text-[28px] xs:text-[32px] sm:text-[38px] md:text-[44px] leading-[1.2] text-[#11382b] font-normal tracking-[-0.01em] mb-5 sm:mb-6 text-balance">
              A Quran School Built Around Your Schedule
            </h2>

            {/* Paragraph 1 */}
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#4f5953] mb-4 font-normal">
              Our tutors guide students of every background through clear, structured lessons in Quran reading, tajweed, and memorization — all from the comfort of home.
            </p>

            {/* Paragraph 2 */}
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#4f5953] mb-7 sm:mb-8 font-normal">
              Whether your child is just starting with the Qaida or you're an adult returning to the Quran after years away, our curriculum adapts to where you are and helps you build steady, lasting progress.
            </p>

            {/* CTA Button */}
            <button
              type="button"
              onClick={onOpenTrial}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white text-[15px] font-medium transition-all shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap text-center"
            >
              Begin Your Free Week
            </button>
          </div>

          {/* Right Column Visual Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div 
              className="relative w-full max-w-[440px] aspect-square rounded-[28px] overflow-hidden shadow-xl border border-[#d8b56f]/30 transition-transform hover:scale-[1.01] group bg-stone-900"
              style={{
                boxShadow: '0 20px 40px -15px rgba(27, 77, 63, 0.25)',
              }}
            >
              {/* Background Photography Asset - Student learning Quran from home */}
              <img
                src="/images/student_home_learning.jpg"
                alt="Student learning Quran from the comfort of home with online tutor"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Subtle inner framing accent */}
              <div className="absolute inset-3 rounded-[22px] border border-white/20 pointer-events-none" />

              {/* 
                Qualified Text commented out as requested:
                <div className="relative z-20 space-y-1.5 text-center">
                  <p className="font-serif text-[24px] sm:text-[28px] font-medium text-[#f5dfa2] tracking-wide leading-snug drop-shadow-md">
                    Qualified Tutors
                  </p>
                  <p className="font-serif text-[24px] sm:text-[28px] font-medium text-[#f5dfa2] tracking-wide leading-snug drop-shadow-md">
                    Flexible Hours
                  </p>
                </div>
              */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
