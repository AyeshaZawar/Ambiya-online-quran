import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', className = '', size = 'md' }) => {
  const isLight = variant === 'light';
  
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Golden-olive spherical emblem matching reference logo */}
      <div 
        className="relative shrink-0 rounded-full flex items-center justify-center shadow-sm overflow-hidden"
        style={{
          width: size === 'sm' ? 32 : size === 'lg' ? 44 : 38,
          height: size === 'sm' ? 32 : size === 'lg' ? 44 : 38,
          background: 'radial-gradient(circle at 35% 30%, #b8a252 0%, #7d8036 45%, #3d5635 80%, #203e29 100%)',
          boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.4), 0 2px 5px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Subtle inner luster highlight */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.35) 0%, transparent 60%)',
          }}
        />
        {/* Elegant minimal crescent & star or script accent watermark */}
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 text-white/80 drop-shadow-sm opacity-90"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" fill="currentColor" fillOpacity="0.25" />
          <path d="M19 4v4" />
          <path d="M21 6h-4" />
        </svg>
      </div>

      <span 
        className={`font-serif tracking-tight whitespace-nowrap font-medium ${
          isLight ? 'text-white' : 'text-[#11382b]'
        } ${
          size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-[22px]'
        }`}
      >
        Anbiya Online Quran
      </span>
    </div>
  );
};
