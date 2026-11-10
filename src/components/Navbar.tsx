import React, { useState } from 'react';
import { Logo } from './Logo';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenTrial: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTrial }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'How We Teach', href: '#how-we-teach' },
    { label: 'Articles', href: '#articles' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Fees', href: '#fees' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#ece8df]/80 transition-shadow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <a 
          href="#" 
          className="hover:opacity-95 transition-opacity"
          aria-label="Anbiya Online Quran Homepage"
        >
          <Logo />
        </a>

        {/* Desktop Nav Links & Action */}
        <div className="hidden md:flex items-center gap-9">
          <nav className="flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-[15px] font-medium text-[#2d3a33] hover:text-[#11382b] transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={onOpenTrial}
            className="px-5 py-2.5 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white text-[14px] font-medium transition-colors shadow-xs whitespace-nowrap"
          >
            Free Trial
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={onOpenTrial}
            className="px-3.5 py-1.5 rounded-md bg-[#184c3c] text-white text-xs font-medium"
          >
            Free Trial
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#11382b] rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#ece8df] px-6 py-5 shadow-lg space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-base font-medium text-[#2d3a33] hover:text-[#11382b] py-1 border-b border-stone-100"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTrial();
            }}
            className="w-full py-3 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] text-white text-sm font-medium transition-colors text-center"
          >
            Start Free Trial
          </button>
        </div>
      )}
    </header>
  );
};
