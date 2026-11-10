import React from 'react';

export interface ArticleItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  gradient: string;
  readTime: string;
  content: string[];
}

export const ARTICLES_DATA: ArticleItem[] = [
  {
    id: 'adult-beginner',
    title: 'Starting Your Quran Journey as an Adult Beginner',
    excerpt: 'As an adult, he was learning how to read the Quran — practical encouragement for anyone beginning their journey.',
    image: '/src/assets/images/adult_man_quran_study_1793997584250.jpg',
    gradient: 'linear-gradient(135deg, rgba(164, 130, 57, 0.85) 0%, rgba(93, 117, 67, 0.8) 50%, rgba(30, 73, 58, 0.9) 100%)',
    readTime: '4 min read',
    content: [
      'As an adult, he was learning how to read the Quran — sitting with humility, determination, and an open heart. Many adult learners carry an unspoken hesitation, assuming that if they did not master Quranic reading in their youth, the chance has passed. In truth, adult students make profound and disciplined progress because they approach every lesson with sincere intention and mature focus.',
      'Our adult curriculum starts from foundational Arabic letters (Noorani Qaida) with dedicated, zero-judgment tutors. Through personalized one-on-one sessions, correct Tajweed pronunciation and fluent reading become second nature in a matter of weeks.',
      'Remember the comforting words of the Prophet (peace be upon him): "The one who recites the Quran and stammers in it, finding it difficult, will have a double reward." It is never too late to begin your sacred journey.',
    ],
  },
  {
    id: 'prayer-daily-life',
    title: 'Why Prayer Remains Central to Daily Life',
    excerpt: 'A short reflection on how regular prayer shapes mindfulness and connection.',
    image: '/src/assets/images/prayer_daily_life_1793993793621.jpg',
    gradient: 'linear-gradient(135deg, rgba(151, 125, 59, 0.85) 0%, rgba(79, 106, 68, 0.8) 50%, rgba(25, 68, 54, 0.9) 100%)',
    readTime: '5 min read',
    content: [
      'In a world characterized by relentless speed and continuous digital distraction, the five daily prayers function as divine anchors. Rather than an interruption to your day, prayer is the spiritual recalibration around which everything else aligns.',
      'When you learn to recite the verses of the Quran with correct Tajweed and deliberate cadence, the prayer transforms from a routine duty into a living, tranquil conversation with your Creator. The stillness of Sujood (prostration) provides emotional restoration that modern wellness trends continually strive to replicate.',
      'Through structured Quranic learning, each verse you utter in Salah gains deeper resonance, anchoring both heart and mind in quiet confidence.',
    ],
  },
  {
    id: 'understanding-eid',
    title: 'Understanding Eid al-Adha',
    excerpt: 'The story and traditions behind the Festival of Sacrifice, explained simply.',
    image: '/src/assets/images/eid_al_adha_1793993793790.jpg',
    gradient: 'linear-gradient(135deg, rgba(171, 138, 63, 0.85) 0%, rgba(96, 121, 71, 0.8) 50%, rgba(30, 76, 61, 0.9) 100%)',
    readTime: '4 min read',
    content: [
      'Eid al-Adha, the Festival of Sacrifice, honors the enduring devotion of Prophet Ibrahim (peace be upon him) and marks the culmination of the annual Hajj pilgrimage. Beyond the festive greetings and family gatherings lies a timeless lesson in trust, surrender, and communal compassion.',
      'The act of Qurbani symbolizes relinquishing ego, attachments, and selfishness in pursuit of higher virtue. The distribution of meat to relatives, neighbors, and particularly those in poverty reinforces social solidarity and shared abundance.',
      'Teaching our children these narratives directly from authentic Quranic accounts helps root their identity in gratitude, generosity, and faith.',
    ],
  },
];

interface ArticlesSectionProps {
  onSelectArticle: (article: ArticleItem) => void;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ onSelectArticle }) => {
  return (
    <section id="articles" className="py-16 md:py-20 border-t border-[#ece6dc]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <span className="text-[12px] sm:text-[13px] tracking-[0.16em] uppercase font-bold text-[#b28338] mb-3 block">
            From the Blog
          </span>
          <h2 className="font-serif text-[34px] sm:text-[40px] leading-[1.2] text-[#11382b] font-normal tracking-[-0.01em]">
            Articles & Reflections
          </h2>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES_DATA.map((article) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="bg-white rounded-2xl overflow-hidden border border-[#eae5dc] shadow-xs hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Header Image Area with photography and refined overlay */}
                <div className="w-full aspect-[16/10] relative flex items-center justify-center overflow-hidden bg-stone-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle warm tint overlay */}
                  <div 
                    className="absolute inset-0 opacity-40 group-hover:opacity-20 transition-opacity"
                    style={{ background: article.gradient }}
                  />
                  
                  {/* Subtle Quranic geometric aesthetic accent */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center border border-white/20">
                    <svg className="w-4 h-4 text-[#dfc588]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-7">
                  <h3 className="font-serif text-[18px] sm:text-[19px] font-bold text-[#11382b] mb-3 leading-snug group-hover:text-[#184c3c] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[#4f5953] font-normal">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Bottom Link Area: Turns golden on hover per instructions */}
              <div className="px-7 pb-7 pt-1">
                <span className="text-[14px] font-medium text-[#184c3c] group-hover:text-[#b28338] transition-colors inline-flex items-center gap-1.5">
                  Read more <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
