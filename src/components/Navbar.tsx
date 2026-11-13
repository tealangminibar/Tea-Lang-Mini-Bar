import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { ThemeTokens } from '../data/defaultSiteData';

interface NavbarProps {
  brandName: string;
  cartCount: number;
  onOpenCart: () => void;
  theme: ThemeTokens;
}

export const Navbar: React.FC<NavbarProps> = ({
  brandName,
  cartCount,
  onOpenCart,
  theme,
}) => {
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-200"
      style={{
        backgroundColor: theme.isDark ? 'rgba(25, 15, 33, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        borderColor: theme.border,
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        {/* Zone 1: Single-line brand wordmark */}
        <a
          href="#beranda"
          className="font-display text-lg font-semibold tracking-tight whitespace-nowrap shrink-0 transition-opacity hover:opacity-80 sm:text-xl"
          style={{ color: theme.textPrimary }}
        >
          {brandName}
        </a>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
          style={{ color: theme.textSecondary }}
        >
          <a
            href="#tentang"
            className="whitespace-nowrap shrink-0 hover:underline underline-offset-4 transition-colors"
          >
            Tentang
          </a>
          <a
            href="#menu"
            className="whitespace-nowrap shrink-0 hover:underline underline-offset-4 transition-colors"
          >
            Menu
          </a>
          <a
            href="#cara-pesan"
            className="whitespace-nowrap shrink-0 hover:underline underline-offset-4 transition-colors"
          >
            Cara Pesan
          </a>
          <a
            href="#lokasi"
            className="whitespace-nowrap shrink-0 hover:underline underline-offset-4 transition-colors"
          >
            Lokasi
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-transform duration-150 active:scale-[0.98] cursor-pointer"
            style={{
              backgroundColor: theme.accentBg,
              color: theme.isDark ? '#190F21' : '#FFFFFF',
            }}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span>Keranjang</span>
            <span className="font-mono tabular-nums text-xs opacity-90">({cartCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
