import React from 'react';
import { X, Clock, BookOpen } from 'lucide-react';
import { ArticleItem } from './ArticlesSection';

interface ArticleModalProps {
  article: ArticleItem | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e5dfd3] overflow-hidden transition-all max-h-[92vh] flex flex-col"
      >
        {/* Banner with Photography and dark emerald scrim */}
        <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-stone-900 flex items-end p-6 text-white shrink-0">
          <img
            src={article.image}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Measured gradient scrim for perfect contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

          <div className="relative z-10 w-full flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs text-white/95 bg-black/40 border border-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
              <Clock className="w-3.5 h-3.5 text-[#dfc588]" />
              {article.readTime}
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-[#dfc588] bg-black/40 border border-[#dfc588]/30 px-3 py-1 rounded-full backdrop-blur-xs">
              <BookOpen className="w-3.5 h-3.5" />
              Adam to Muhammad Reflections
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors cursor-pointer z-20 border border-white/20"
            aria-label="Close article"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#11382b] leading-tight">
            {article.title}
          </h2>

          <p className="text-base text-[#184c3c] font-medium italic border-l-2 border-[#b28338] pl-4 py-1 bg-[#FAF7F2] rounded-r-lg">
            {article.excerpt}
          </p>

          <div className="space-y-4 text-[15px] sm:text-[16px] leading-relaxed text-[#4f5953] pt-2">
            {article.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-6 border-t border-[#ece7de] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-xs text-[#7d8780]">
              Published by Adam to Muhammad Online Quran Academy Educational Team
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              Done Reading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
