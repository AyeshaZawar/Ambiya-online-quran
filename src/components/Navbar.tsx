import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { Menu, X } from 'lucide-react';

export type ViewState = 'home' | 'about' | 'courses' | 'pricing' | 'blog' | 'contact';

interface NavbarProps {
  onOpenTrial: () => void;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenTrial,
  currentView = 'home',
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; view: ViewState }[] = [
    { label: 'Home', view: 'home' },
    { label: 'About', view: 'about' },
    { label: 'Courses', view: 'courses' },
    { label: 'Pricing', view: 'pricing' },
    { label: 'Blog', view: 'blog' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, view: ViewState) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(view);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigate('home');
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="sticky top-0 z-40 bg-white border-b border-[#ece8df]/80 transition-shadow"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-1.5 flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          href="#home" 
          onClick={handleLogoClick}
          className="hover:opacity-95 transition-opacity shrink-0 flex items-center"
          aria-label="Adam to Muhammad Online Quran Academy Homepage"
        >
          <Logo size="md" />
        </a>

        {/* Desktop Nav Links & Action */}
        <div className="hidden md:flex items-center gap-7 lg:gap-8">
          <nav className="flex items-center gap-5 lg:gap-7">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <a
                  key={link.label}
                  href={`#${link.view}`}
                  onClick={(e) => handleLinkClick(e, link.view)}
                  className={`text-[15px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'text-[#103b2d] font-bold border-b-2 border-[#b28338] pb-0.5' 
                      : 'text-[#2d3a33] hover:text-[#103b2d]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={onOpenTrial}
            className="px-5 py-2.5 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white text-[14px] font-medium transition-colors shadow-xs whitespace-nowrap cursor-pointer"
          >
            Free Trial
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-[#11382b] rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#ece8df] px-6 py-5 shadow-lg space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2.5">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <a
                  key={link.label}
                  href={`#${link.view}`}
                  onClick={(e) => handleLinkClick(e, link.view)}
                  className={`text-[15.5px] font-medium py-2 border-b border-stone-100 transition-colors cursor-pointer ${
                    isActive ? 'text-[#103b2d] font-bold' : 'text-[#2d3a33] hover:text-[#103b2d]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrial();
              }}
              className="w-full py-3.5 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white text-[15px] font-medium transition-colors text-center shadow-xs cursor-pointer"
            >
              Start Free Trial Week
            </button>
          </div>
        </div>
      )}
    </motion.header>
  );
};
