import React from 'react';
import { ThemeTokens } from '../data/defaultSiteData';

interface BotanicalBackdropProps {
  visible: boolean;
  theme: ThemeTokens;
}

export const BotanicalBackdrop: React.FC<BotanicalBackdropProps> = ({ visible, theme }) => {
  if (!visible) return null;

  const petalColor = theme.isDark ? '#6D5499' : '#3F48B5';
  const leafColor = theme.isDark ? '#3F6B4E' : '#4C7A47';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Subtle radial atmosphere echoing the lavender-plum palette */}
      <div
        className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full blur-3xl opacity-25"
        style={{
          background: theme.isDark
            ? 'radial-gradient(circle, #552563 0%, transparent 70%)'
            : 'radial-gradient(circle, #C8B5E8 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/3 -right-32 h-[520px] w-[520px] rounded-full blur-3xl opacity-20"
        style={{
          background: theme.isDark
            ? 'radial-gradient(circle, #3B429F 0%, transparent 70%)'
            : 'radial-gradient(circle, #D9C9EE 0%, transparent 70%)',
        }}
      />

      {/* Top-left subtle butterfly pea flower & leaf motif */}
      <svg
        className="absolute -top-6 -left-6 h-56 w-56 opacity-[0.09]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M40 70 C20 35, 65 15, 85 50 C105 18, 145 45, 115 80 C145 105, 100 140, 75 110 C50 138, 15 105, 40 70 Z"
          fill={petalColor}
        />
        <ellipse cx="77" cy="78" rx="14" ry="11" fill="#EAE6DF" opacity="0.7" />
        <path d="M120 120 C145 105, 175 125, 165 150 C140 160, 115 142, 120 120 Z" fill={leafColor} />
        <path d="M25 135 C50 125, 72 145, 58 168 C35 170, 18 152, 25 135 Z" fill={leafColor} />
      </svg>

      {/* Bottom-right subtle butterfly pea & roasted coffee bean motif */}
      <svg
        className="absolute -bottom-8 -right-8 h-64 w-64 opacity-[0.09]"
        viewBox="0 0 220 220"
        fill="none"
      >
        <path
          d="M125 90 C105 55, 150 35, 170 70 C190 38, 225 65, 195 100 C225 125, 180 160, 155 130 C130 158, 95 125, 125 90 Z"
          fill={petalColor}
        />
        <ellipse cx="158" cy="98" rx="14" ry="11" fill="#EAE6DF" opacity="0.7" />
        <path d="M60 150 C85 135, 115 155, 105 180 C80 190, 55 172, 60 150 Z" fill={leafColor} />
        <ellipse cx="75" cy="110" rx="13" ry="9" transform="rotate(-25 75 110)" fill="#6D462C" />
        <ellipse cx="110" cy="175" rx="12" ry="8" transform="rotate(20 110 175)" fill="#6D462C" />
      </svg>
    </div>
  );
};
