import React from 'react';

interface FooterProps {
  onOpenTrial: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTrial }) => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const elem = document.querySelector(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#092219] text-white pt-14 pb-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Column 1: Brand Info */}
          <div>
            <h3 className="text-white font-semibold text-[16px] mb-4">
              Anbiya Online Quran
            </h3>
            <p className="text-[#9fb5a9] text-[14px] leading-relaxed">
              Quran courses for kids and adults, taught live, one-on-one.
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
                  onClick={(e) => handleScroll(e, '#about')}
                  className="hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="#how-we-teach" 
                  onClick={(e) => handleScroll(e, '#how-we-teach')}
                  className="hover:text-white transition-colors"
                >
                  How We Teach
                </a>
              </li>
              <li>
                <a 
                  href="#testimonials" 
                  onClick={(e) => handleScroll(e, '#testimonials')}
                  className="hover:text-white transition-colors"
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
                  className="hover:text-white transition-colors"
                >
                  Articles
                </a>
              </li>
              <li>
                <a 
                  href="#fees" 
                  onClick={(e) => handleScroll(e, '#fees')}
                  className="hover:text-white transition-colors"
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
            © Anbiya Online Quran. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
