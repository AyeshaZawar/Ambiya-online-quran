import React from 'react';
import { motion } from 'motion/react';
import { BlogItem } from '../types/cms';
import { FALLBACK_BOOTSTRAP_DATA } from '../data/fallbackData';

export interface ArticleItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  gradient: string;
  readTime: string;
  content: string[];
}

export function blogToArticleItem(blog: BlogItem): ArticleItem {
  return {
    id: blog._id || blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    image: blog.featuredImage,
    gradient: blog.gradient,
    readTime: blog.readTime,
    content: blog.content,
  };
}

interface ArticlesSectionProps {
  onSelectArticle: (article: ArticleItem) => void;
  blogs?: BlogItem[];
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  onSelectArticle,
  blogs,
}) => {
  const sourceBlogs = blogs !== undefined ? blogs : FALLBACK_BOOTSTRAP_DATA.blogs;
  const articles = sourceBlogs.map(blogToArticleItem);

  return (
    <section id="articles" className="py-16 md:py-20 border-t border-[#ece6dc]/60 overflow-hidden">
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
            From the Blog
          </span>
          <h2 className="font-serif text-[34px] sm:text-[40px] leading-[1.2] text-[#11382b] font-normal tracking-[-0.01em]">
            Articles & Reflections
          </h2>
        </motion.div>

        {articles.length === 0 ? (
          <p className="text-[15px] text-[#55635c]">No published articles at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <motion.article
                key={article.id}
                onClick={() => onSelectArticle(article)}
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.65, delay: 0.15 + (idx % 3) * 0.15, ease: 'easeOut' }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="bg-white rounded-2xl overflow-hidden border border-[#eae5dc] shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between cursor-pointer"
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
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
