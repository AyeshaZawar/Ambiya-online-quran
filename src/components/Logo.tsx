import React, { useState } from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'dark', 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const isLight = variant === 'light';
  const [imgError, setImgError] = useState(false);

  // Enlarged logo height mapping for high visibility and clear legibility
  const heightClass = size === 'sm' 
    ? 'h-11 sm:h-13 max-w-[260px] sm:max-w-[320px]' 
    : size === 'lg' 
    ? 'h-14 sm:h-16 md:h-18 max-w-[320px] sm:max-w-[380px]' 
    : 'h-16 sm:h-20 md:h-[76px] lg:h-[82px] max-w-[360px] sm:max-w-[460px] md:max-w-[540px]';

  // Use transparent light logo (white & gold) for dark backgrounds, and standard logo (emerald & gold) for light backgrounds
  const logoSrc = isLight ? '/images/logo-light.png' : '/images/logo.png';

  return (
    <div className={`flex items-center select-none max-w-full ${className}`}>
      {!imgError ? (
        <img
          src={logoSrc}
          alt="Adam to Muhammad Online Quran Academy"
          onError={() => setImgError(true)}
          className={`${heightClass} w-auto max-w-full object-contain transition-all shrink-0`}
        />
      ) : (
        /* Fallback if image fails to load */
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #b8a252 0%, #7d8036 45%, #103b2d 100%)',
            }}
          >
            <span className="text-white font-serif text-base font-bold">AM</span>
          </div>
          {showText && (
            <span 
              className={`font-serif tracking-tight font-semibold ${
                isLight ? 'text-white' : 'text-[#103b2d]'
              } ${
                size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl sm:text-2xl'
              }`}
            >
              Adam to Muhammad
            </span>
          )}
        </div>
      )}
    </div>
  );
};

