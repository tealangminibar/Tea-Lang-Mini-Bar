import React, { useState } from 'react';
import { ArrowDown, PenLine, Check } from 'lucide-react';
import { BusinessInfo } from '../types';
import { ThemeTokens } from '../data/defaultSiteData';

interface HeroSectionProps {
  business: BusinessInfo;
  menuCount: number;
  minPriceLabel: string;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onOpenEditorDrawer: () => void;
  theme: ThemeTokens;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  business,
  menuCount,
  minPriceLabel,
  isEditMode,
  onToggleEditMode,
  onOpenEditorDrawer,
  theme,
}) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <section id="beranda" className="relative z-10 pt-8 pb-12 sm:pt-12 sm:pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left column: Clear business explanation & primary CTAs */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <p
              className="text-xs font-semibold tracking-wider uppercase sm:text-sm"
              style={{ color: theme.accentText }}
            >
              {business.tagline}
            </p>

            <h1
              className="mt-3 font-display font-bold tracking-tight leading-[1.12]"
              style={{
                fontSize: 'clamp(2.15rem, 3.8vw, 3.35rem)',
                color: theme.textPrimary,
              }}
            >
              {business.heroTitle}
            </h1>

            <p
              className="mt-5 max-w-2xl text-base leading-relaxed sm:text-[17px]"
              style={{ color: theme.textSecondary }}
            >
              {business.heroSubtitle}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#menu"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold whitespace-nowrap shrink-0 transition-transform duration-150 active:scale-[0.98]"
                style={{
                  backgroundColor: theme.accentBg,
                  color: theme.isDark ? '#190F21' : '#FFFFFF',
                }}
              >
                <span>Lihat Menu & Pesan</span>
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={onToggleEditMode}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                style={{
                  backgroundColor: isEditMode ? theme.accentSoftBg : theme.surfaceBg,
                  borderColor: isEditMode ? theme.accentText : theme.border,
                  color: isEditMode ? theme.accentText : theme.textPrimary,
                }}
              >
                {isEditMode ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    <span>Selesai Edit</span>
                  </>
                ) : (
                  <>
                    <PenLine className="h-4 w-4" aria-hidden="true" />
                    <span>Edit Website</span>
                  </>
                )}
              </button>

              {isEditMode && (
                <button
                  type="button"
                  onClick={onOpenEditorDrawer}
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                  style={{
                    backgroundColor: theme.surfaceBg,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                >
                  <span>Panel Pengaturan Lengkap</span>
                </button>
              )}
            </div>

            <div
              className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm"
              style={{ color: theme.textMuted }}
            >
              <span>{business.operatingHours}</span>
              <span aria-hidden="true">·</span>
              <span>Pemesanan Langsung WhatsApp</span>
              <span aria-hidden="true">·</span>
              <span>{business.instagramHandle}</span>
            </div>
          </div>

          {/* Right column: Official Logo & Container Showcase */}
          <div className="lg:col-span-5">
            <div
              className="flex h-full flex-col items-center justify-center rounded-2xl border p-6 sm:p-8"
              style={{
                backgroundColor: theme.surfaceBg,
                borderColor: theme.border,
              }}
            >
              {!logoError ? (
                <div className="relative flex w-full max-w-[340px] items-center justify-center overflow-hidden rounded-full border p-2"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: '#FCF8F5',
                  }}
                >
                  <img
                    src="/assets/aistudio/Logo_FIX_490f7c7f.png"
                    alt="Logo resmi Tea Lang & Mini Bar berupa kedai kontainer ungu dengan lampu gantung rooftop"
                    referrerPolicy="no-referrer"
                    onError={() => setLogoError(true)}
                    className="h-auto w-full rounded-full object-contain"
                  />
                </div>
              ) : (
                <div
                  className="flex h-64 w-64 flex-col items-center justify-center rounded-full border text-center p-6"
                  style={{
                    backgroundColor: theme.surfaceMutedBg,
                    borderColor: theme.border,
                  }}
                >
                  <span className="font-display text-2xl font-bold" style={{ color: theme.accentText }}>
                    {business.brandName}
                  </span>
                  <span className="mt-2 text-xs" style={{ color: theme.textMuted }}>
                    {business.tagline}
                  </span>
                </div>
              )}

              <p
                className="mt-5 text-center text-xs leading-relaxed sm:text-sm"
                style={{ color: theme.textMuted }}
              >
                Identitas kedai kontainer ungu dengan jendela saji terbuka, lampu rooftop hangat, dan racikan minuman segar setiap hari.
              </p>
            </div>
          </div>
        </div>

        {/* Full-width 4-column facts strip */}
        <div
          className="mt-8 grid grid-cols-2 gap-4 rounded-xl border p-4 sm:grid-cols-4 sm:p-5"
          style={{
            backgroundColor: theme.surfaceBg,
            borderColor: theme.border,
          }}
        >
          <div className="px-2">
            <div className="text-xs" style={{ color: theme.textMuted }}>
              Koleksi Minuman
            </div>
            <div className="mt-1 font-mono text-lg font-semibold tabular-nums" style={{ color: theme.textPrimary }}>
              {menuCount} Menu
            </div>
          </div>
          <div className="px-2">
            <div className="text-xs" style={{ color: theme.textMuted }}>
              Harga Bersahabat
            </div>
            <div className="mt-1 font-mono text-lg font-semibold tabular-nums" style={{ color: theme.textPrimary }}>
              Mulai {minPriceLabel}
            </div>
          </div>
          <div className="px-2">
            <div className="text-xs" style={{ color: theme.textMuted }}>
              Kategori Utama
            </div>
            <div className="mt-1 text-base font-semibold" style={{ color: theme.textPrimary }}>
              Tea, Coffee & Milk
            </div>
          </div>
          <div className="px-2">
            <div className="text-xs" style={{ color: theme.textMuted }}>
              Sistem Order
            </div>
            <div className="mt-1 text-base font-semibold" style={{ color: theme.textPrimary }}>
              WhatsApp Langsung
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
