import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenTrial: () => void;
  currentView?: 'home' | 'about';
  onNavigateAbout?: () => void;
  onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenTrial,
  currentView = 'home',
  onNavigateAbout,
  onNavigateHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about', isAbout: true },
    { label: 'How We Teach', href: '#how-we-teach', isAbout: false },
    { label: 'Articles', href: '#articles', isAbout: false },
    { label: 'Testimonials', href: '#testimonials', isAbout: false },
    { label: 'Fees', href: '#fees', isAbout: false },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (link.isAbout) {
      if (onNavigateAbout) {
        onNavigateAbout();
      }
      return;
    }

    if (currentView === 'about' && onNavigateHome) {
      onNavigateHome();
      // Allow view switch to render then scroll
      setTimeout(() => {
        const targetElement = document.querySelector(link.href);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      const targetElement = document.querySelector(link.href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-40 bg-white border-b border-[#ece8df]/80 transition-shadow"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-1.5 flex items-center justify-between">
        {/* Brand */}
        <a 
          href="#" 
          onClick={handleLogoClick}
          className="hover:opacity-95 transition-opacity shrink-0 flex items-center"
          aria-label="Adam to Muhammad Online Quran Academy Homepage"
        >
          <Logo size="md" />
        </a>

        {/* Desktop Nav Links & Action */}
        <div className="hidden md:flex items-center gap-9">
          <nav className="flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = link.isAbout && currentView === 'about';
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`text-[15px] font-medium transition-colors whitespace-nowrap ${
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
        <div className="md:hidden bg-white border-b border-[#ece8df] px-6 py-5 shadow-lg space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = link.isAbout && currentView === 'about';
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`text-[15.5px] font-medium py-2 border-b border-stone-100 transition-colors ${
                    isActive ? 'text-[#103b2d] font-bold' : 'text-[#2d3a33] hover:text-[#103b2d]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrial();
              }}
              className="w-full py-3.5 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white text-[15px] font-medium transition-colors text-center shadow-xs cursor-pointer"
            >
              Free Trial
            </button>
          </div>
        </div>
      )}
    </motion.header>
  );
};

