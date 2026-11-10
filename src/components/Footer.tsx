import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

interface FooterProps {
  onOpenTrial: () => void;
  onNavigateAbout?: () => void;
  onNavigateHome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenTrial,
  onNavigateAbout,
  onNavigateHome,
}) => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome();
      setTimeout(() => {
        const elem = document.querySelector(id);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      const elem = document.querySelector(id);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigateAbout) {
      onNavigateAbout();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#092219] text-white pt-14 pb-12 transition-colors overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 12-Column Responsive Grid with dedicated space for logo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-14 items-start">
          {/* Column 1: Brand Info & Logo (Spans 5 columns on desktop, 2 on tablet) */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="sm:col-span-2 lg:col-span-5 space-y-4 pr-0 lg:pr-6"
          >
            <div className="inline-block py-1 max-w-full overflow-hidden">
              <Logo variant="light" size="lg" />
            </div>
            <p className="text-[#9fb5a9] text-[14px] leading-relaxed max-w-sm">
              Online one-to-one Quran classes for kids and adults worldwide, taught with patience and care.
            </p>
          </motion.div>

          {/* Column 2: Explore (Spans 2 columns on desktop) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-2"
          >
            <h3 className="text-white font-semibold text-[15px] mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-[14px] text-[#9fb5a9]">
              <li>
                <a 
                  href="#about" 
                  onClick={handleAboutClick}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#how-we-teach" 
                  onClick={(e) => handleScroll(e, '#how-we-teach')}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  How We Teach
                </a>
              </li>
              <li>
                <a 
                  href="#testimonials" 
                  onClick={(e) => handleScroll(e, '#testimonials')}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  Testimonials
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Resources (Spans 2 columns on desktop) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: 0.25, ease: 'easeOut' }}
            className="lg:col-span-2"
          >
            <h3 className="text-white font-semibold text-[15px] mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5 text-[14px] text-[#9fb5a9]">
              <li>
                <a 
                  href="#articles" 
                  onClick={(e) => handleScroll(e, '#articles')}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  Articles
                </a>
              </li>
              <li>
                <a 
                  href="#fees" 
                  onClick={(e) => handleScroll(e, '#fees')}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  Fees
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTrial}
                  className="hover:text-white transition-colors cursor-pointer text-left inline-block"
                >
                  Free Trial
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Contact (Spans 3 columns on desktop) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: 0.35, ease: 'easeOut' }}
            className="sm:col-span-2 lg:col-span-3"
          >
            <h3 className="text-white font-semibold text-[15px] mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5 text-[14px] text-[#9fb5a9]">
              <li>Available worldwide, online</li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTrial}
                  className="hover:text-white transition-colors cursor-pointer text-left underline underline-offset-4"
                >
                  Register today
                </button>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Separator Line & Copyright */}
        <div className="border-t border-[#143628] pt-8 text-center">
          <p className="text-[#8ba699] text-[13px]">
            © Adam to Muhammad Online Quran Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

