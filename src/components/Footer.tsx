import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { ViewState } from './Navbar';

interface FooterProps {
  onOpenTrial: () => void;
  onNavigate: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenTrial,
  onNavigate,
}) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, view: ViewState) => {
    e.preventDefault();
    onNavigate(view);
  };

  return (
    <footer className="bg-[#092219] text-white pt-14 pb-12 transition-colors overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 12-Column Responsive Grid with dedicated space for logo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-14 items-start">
          {/* Column 1: Brand Info & Logo (Spans 5 columns on desktop, 2 on tablet) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="sm:col-span-2 lg:col-span-5 space-y-4 pr-0 lg:pr-6"
          >
            <div className="inline-block py-1 max-w-full overflow-hidden">
              <Logo variant="light" size="lg" />
            </div>
            <p className="text-[#9fb5a9] text-[14px] leading-relaxed max-w-sm">
              Online one-to-one Quran classes for kids and adults worldwide, taught with patience and care.
            </p>
          </motion.div>

          {/* Column 2: Explore */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-2"
          >
            <h3 className="text-white font-semibold text-[15px] mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-[14px] text-[#9fb5a9]">
              <li>
                <a 
                  href="#home" 
                  onClick={(e) => handleNavClick(e, 'home')}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#courses" 
                  onClick={(e) => handleNavClick(e, 'courses')}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  Courses
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Resources */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.18, ease: 'easeOut' }}
            className="lg:col-span-2"
          >
            <h3 className="text-white font-semibold text-[15px] mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5 text-[14px] text-[#9fb5a9]">
              <li>
                <a 
                  href="#pricing" 
                  onClick={(e) => handleNavClick(e, 'pricing')}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a 
                  href="#blog" 
                  onClick={(e) => handleNavClick(e, 'blog')}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  Blog Articles
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTrial}
                  className="hover:text-white transition-colors cursor-pointer text-left inline-block"
                >
                  Free Trial Week
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Contact */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
            className="sm:col-span-2 lg:col-span-3"
          >
            <h3 className="text-white font-semibold text-[15px] mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5 text-[14px] text-[#9fb5a9]">
              <li>Available worldwide, online</li>
              <li>
                <a 
                  href="#contact" 
                  onClick={(e) => handleNavClick(e, 'contact')}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  Contact Page
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTrial}
                  className="hover:text-white transition-colors cursor-pointer text-left underline underline-offset-4"
                >
                  Register for Free Trial
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
