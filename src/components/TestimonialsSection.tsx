import React from 'react';
import { motion } from 'motion/react';
import { TestimonialItem } from '../types/cms';
import { FALLBACK_BOOTSTRAP_DATA } from '../data/fallbackData';

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const items =
    testimonials !== undefined ? testimonials : FALLBACK_BOOTSTRAP_DATA.testimonials;

  return (
    <section id="testimonials" className="py-16 md:py-20 border-t border-[#ece6dc]/60 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Up to Down */}
        <motion.div 
          initial={{ opacity: 0, y: -25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mb-10 sm:mb-12"
        >
          <span className="text-[12px] sm:text-[13px] tracking-[0.16em] uppercase font-bold text-[#b28338] mb-3 block">
            Families Say
          </span>
          <h2 className="font-serif text-[34px] sm:text-[40px] leading-[1.2] text-[#11382b] font-normal tracking-[-0.01em]">
            What Our Students & Parents Tell Us
          </h2>
        </motion.div>

        {/* Testimonials Grid - Left to Right Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, idx) => (
            <motion.div
              key={item._id || idx}
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, delay: 0.15 + (idx % 3) * 0.15, ease: 'easeOut' }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-7 sm:p-8 border border-[#eae5dc] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <p className="italic text-[15px] sm:text-[15.5px] leading-relaxed text-[#333e38] mb-8 font-normal">
                {item.quote}
              </p>

              <div>
                <h3 className="font-bold text-[15px] text-[#11382b]">
                  {item.author}
                </h3>
                {item.location && (
                  <p className="text-[13px] text-[#717b75] mt-1 font-normal">
                    {item.location}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
