import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { ArticleItem, ARTICLES_DATA } from './ArticlesSection';

interface BlogPageProps {
  onSelectArticle: (article: ArticleItem) => void;
  onNavigateHome: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onSelectArticle, onNavigateHome }) => {
  return (
    <div className="bg-[#FAF7F2] text-[#2D3732] min-h-screen overflow-hidden">
      {/* Breadcrumb Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-b border-[#e8e2d5] bg-[#FAF7F2]/90 backdrop-blur-xs sticky top-16 z-30"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#103b2d] hover:text-[#b28338] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>

          <div className="text-[13px] text-[#78857f] hidden sm:flex items-center gap-2 font-medium">
            <span onClick={onNavigateHome} className="hover:text-[#103b2d] cursor-pointer transition-colors">
              Home
            </span>
            <span>/</span>
            <span className="text-[#103b2d] font-semibold">Blog</span>
          </div>
        </div>
      </motion.div>

      {/* Header Section */}
      <section className="pt-12 sm:pt-16 pb-12 sm:pb-16 border-b border-[#ede7dc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-[12px] font-semibold tracking-widest uppercase text-[#b28338] mb-3 block"
          >
            From the Blog
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-serif text-[34px] sm:text-[44px] text-[#11382b] font-normal tracking-[-0.01em] mb-5 leading-tight"
          >
            Articles & Reflections
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[16px] sm:text-[17px] text-[#4f5953] leading-relaxed max-w-2xl mx-auto"
          >
            Practical insights on learning the Holy Quran, developing daily prayer habits, and understanding sacred traditions.
          </motion.p>
        </div>
      </section>

      {/* 3 Articles Grid */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTICLES_DATA.map((article, idx) => (
              <motion.article
                key={article.id}
                onClick={() => onSelectArticle(article)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: 'easeOut' }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl overflow-hidden border border-[#eae5dc] shadow-xs hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Photo Header */}
                  <div className="w-full aspect-[16/10] relative flex items-center justify-center overflow-hidden bg-stone-100">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div 
                      className="absolute inset-0 opacity-40 group-hover:opacity-20 transition-opacity"
                      style={{ background: article.gradient }}
                    />
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center border border-white/20">
                      <BookOpen className="w-4 h-4 text-[#dfc588]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-7">
                    <div className="flex items-center gap-2 text-xs text-[#7d8b84] mb-3">
                      <Clock className="w-3.5 h-3.5 text-[#b28338]" />
                      <span>{article.readTime}</span>
                    </div>

                    <h2 className="font-serif text-[19px] sm:text-[20px] font-bold text-[#11382b] mb-3 leading-snug group-hover:text-[#184c3c] transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-[14px] leading-relaxed text-[#4f5953] font-normal">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Bottom link */}
                <div className="px-7 pb-7 pt-1">
                  <span className="text-[14px] font-medium text-[#184c3c] group-hover:text-[#b28338] transition-colors inline-flex items-center gap-1.5">
                    Read complete article <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
