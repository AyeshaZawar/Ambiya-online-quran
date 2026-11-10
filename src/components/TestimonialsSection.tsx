import React from 'react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        '"My children went from no Islamic education at all to confidently reading short surahs and learning the basics of prayer. The whole family is involved now."',
      author: 'Parent of Two Students',
      location: 'United Kingdom',
    },
    {
      quote:
        '"In a short time I\'ve learned to read fluently and memorized several short chapters. The tutors are patient and make learning genuinely enjoyable."',
      author: 'Adult Student',
      location: null,
    },
    {
      quote:
        '"Communication is excellent and the teaching style is kind and patient, especially with younger children. Highly recommended."',
      author: 'Parent of a Young Learner',
      location: null,
    },
  ];

  return (
    <section id="testimonials" className="py-16 md:py-20 border-t border-[#ece6dc]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <span className="text-[12px] sm:text-[13px] tracking-[0.16em] uppercase font-bold text-[#b28338] mb-3 block">
            Families Say
          </span>
          <h2 className="font-serif text-[34px] sm:text-[40px] leading-[1.2] text-[#11382b] font-normal tracking-[-0.01em]">
            What Our Students & Parents Tell Us
          </h2>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-7 sm:p-8 border border-[#eae5dc] shadow-xs flex flex-col justify-between"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
