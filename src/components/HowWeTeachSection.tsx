import React from 'react';

export const HowWeTeachSection: React.FC = () => {
  const cards = [
    {
      badgeType: 'text',
      badgeContent: '1:1',
      title: 'One-on-One Sessions',
      description: 'Each student gets individual attention, so lessons move at exactly the right pace.',
    },
    {
      badgeType: 'play',
      title: 'Live Video Classes',
      description: 'Real-time lessons over video call let tutors correct pronunciation as you read.',
    },
    {
      badgeType: 'book',
      title: 'Structured Materials',
      description: 'Text, audio, and short practice exercises reinforce every lesson between classes.',
    },
    {
      badgeType: 'chart',
      title: 'Progress Tracking',
      description: 'A simple learning system keeps you and your tutor aligned on what\'s next.',
    },
  ];

  return (
    <section id="how-we-teach" className="py-16 md:py-20 border-t border-[#ece6dc]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <span className="text-[12px] sm:text-[13px] tracking-[0.16em] uppercase font-bold text-[#b28338] mb-3 block">
            Our Approach
          </span>
          <h2 className="font-serif text-[34px] sm:text-[40px] leading-[1.2] text-[#11382b] font-normal tracking-[-0.01em]">
            How We Teach
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-7 border border-[#eae5dc] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Badge Icon */}
                <div className="w-12 h-10 rounded-lg bg-[#e6f3ed] flex items-center justify-center mb-6 text-[#184c3c]">
                  {card.badgeType === 'text' && (
                    <span className="font-bold text-[14px] text-[#184c3c]">{card.badgeContent}</span>
                  )}
                  {card.badgeType === 'play' && (
                    <svg className="w-5 h-5 fill-current text-[#184c3c]" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                  {card.badgeType === 'book' && (
                    <svg className="w-5 h-5 text-[#184c3c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  )}
                  {card.badgeType === 'chart' && (
                    <div className="flex items-end gap-1 h-4">
                      <span className="w-1.5 h-2.5 bg-[#428169] rounded-xs"></span>
                      <span className="w-1.5 h-4 bg-[#184c3c] rounded-xs"></span>
                      <span className="w-1.5 h-3 bg-[#b28338] rounded-xs"></span>
                    </div>
                  )}
                </div>

                {/* Card Title */}
                <h3 className="font-serif text-[18px] font-bold text-[#11382b] mb-2.5 tracking-tight">
                  {card.title}
                </h3>

                {/* Card Description */}
                <p className="text-[14px] leading-relaxed text-[#4f5953] font-normal">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
