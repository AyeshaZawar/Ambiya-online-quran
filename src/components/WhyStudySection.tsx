import React from 'react';
import { motion } from 'motion/react';
import { WhyStudyContentData } from '../types/cms';
import { FALLBACK_BOOTSTRAP_DATA } from '../data/fallbackData';

interface WhyStudySectionProps {
  onOpenTrial: () => void;
  content?: WhyStudyContentData;
}

export const WhyStudySection: React.FC<WhyStudySectionProps> = ({ onOpenTrial, content }) => {
  const fallbackData = FALLBACK_BOOTSTRAP_DATA.websiteContent.home_why_study;
  const data = content || fallbackData;
  const heading = data.heading !== undefined ? data.heading : fallbackData.heading;
  const paragraphs = data.paragraphs !== undefined ? data.paragraphs : fallbackData.paragraphs;
  const imageUrl = data.imageUrl !== undefined ? data.imageUrl : fallbackData.imageUrl;

  return (
    <section id="about" className="py-16 md:py-20 border-t border-[#ece6dc]/60 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column Content */}
          <div className={`${imageUrl ? 'lg:col-span-7' : 'lg:col-span-12 max-w-3xl'} flex flex-col items-start`}>
            {/* Tagline / Overline - Up to down */}
            <motion.span 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-[12px] sm:text-[13px] tracking-[0.16em] uppercase font-bold text-[#b28338] mb-3"
            >
              Why Study With Us
            </motion.span>

            {/* Main Headline - Editable/Removable by Admin */}
            {heading && (
              <motion.h2 
                initial={{ opacity: 0, y: -25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                className="font-serif text-[28px] xs:text-[32px] sm:text-[38px] md:text-[44px] leading-[1.2] text-[#11382b] font-normal tracking-[-0.01em] mb-5 sm:mb-6 text-balance"
              >
                {heading}
              </motion.h2>
            )}

            {paragraphs.map((paragraph, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, x: -35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.65, delay: 0.2 + idx * 0.15, ease: 'easeOut' }}
                className={`text-[15px] sm:text-[16px] leading-relaxed text-[#4f5953] font-normal ${
                  idx === paragraphs.length - 1 ? 'mb-7 sm:mb-8' : 'mb-4'
                }`}
              >
                {paragraph}
              </motion.p>
            ))}

            {/* CTA Button */}
            <motion.button
              type="button"
              onClick={onOpenTrial}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white text-[15px] font-medium transition-all shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap text-center hover:scale-[1.02] active:scale-[0.98]"
            >
              Begin Your Free Week
            </motion.button>
          </div>

          {/* Right Column Visual Card - Shown unless explicitly removed by admin */}
          {imageUrl && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <div 
                className="relative w-full max-w-[440px] aspect-square rounded-[28px] overflow-hidden shadow-xl border border-[#d8b56f]/30 transition-transform hover:scale-[1.01] group bg-stone-900"
                style={{
                  boxShadow: '0 20px 40px -15px rgba(27, 77, 63, 0.25)',
                }}
              >
                {/* Background Photography Asset - Student learning Quran from home */}
                <img
                  src={imageUrl}
                  alt="Student learning Quran from the comfort of home with online tutor"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle inner framing accent */}
                <div className="absolute inset-3 rounded-[22px] border border-white/20 pointer-events-none" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
