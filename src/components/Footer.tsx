import React from 'react';
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
    <footer className="bg-[#092219] text-white pt-14 pb-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="inline-block py-1">
              <Logo variant="light" size="lg" />
            </div>
            <p className="text-[#9fb5a9] text-[14px] leading-relaxed">
              Online one-to-one Quran classes for kids and adults worldwide, taught with patience and care.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="text-white font-semibold text-[15px] mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-[14px] text-[#9fb5a9]">
              <li>
                <a 
                  href="#about" 
                  onClick={handleAboutClick}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#how-we-teach" 
                  onClick={(e) => handleScroll(e, '#how-we-teach')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How We Teach
                </a>
              </li>
              <li>
                <a 
                  href="#testimonials" 
                  onClick={(e) => handleScroll(e, '#testimonials')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-white font-semibold text-[15px] mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5 text-[14px] text-[#9fb5a9]">
              <li>
                <a 
                  href="#articles" 
                  onClick={(e) => handleScroll(e, '#articles')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Articles
                </a>
              </li>
              <li>
                <a 
                  href="#fees" 
                  onClick={(e) => handleScroll(e, '#fees')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Fees
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTrial}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Free Trial
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
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
          </div>
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

