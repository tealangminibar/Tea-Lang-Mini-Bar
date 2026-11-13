import React, { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { BusinessInfo } from '../types';
import { ThemeTokens } from '../data/defaultSiteData';

interface AboutSectionProps {
  business: BusinessInfo;
  theme: ThemeTokens;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ business, theme }) => {
  const [menuImgError, setMenuImgError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <section
      id="tentang"
      className="relative z-10 border-t py-14 sm:py-20"
      style={{ borderColor: theme.border }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: Story & 3 Pillars */}
          <div className="lg:col-span-7">
            <h2
              className="font-display text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ color: theme.textPrimary }}
            >
              {business.aboutHeading}
            </h2>
            <p
              className="mt-4 max-w-2xl text-base leading-relaxed"
              style={{ color: theme.textSecondary }}
            >
              {business.aboutIntro}
            </p>

            <div className="mt-8 space-y-6">
              {business.pillars.map((pillar) => (
                <div
                  key={pillar.id}
                  className="border-t pt-5"
                  style={{ borderColor: theme.border }}
                >
                  <h3
                    className="text-base font-semibold sm:text-lg"
                    style={{ color: theme.textPrimary }}
                  >
                    <span
                      className="mr-2 font-mono text-sm font-semibold tabular-nums"
                      style={{ color: theme.accentText }}
                    >
                      {pillar.number}.
                    </span>
                    {pillar.title}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed sm:text-[15px]"
                    style={{ color: theme.textSecondary }}
                  >
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Official Menu Poster Reference */}
          <div className="lg:col-span-5">
            <div
              className="rounded-2xl border p-5 sm:p-6"
              style={{
                backgroundColor: theme.surfaceBg,
                borderColor: theme.border,
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: theme.textPrimary }}
                  >
                    Referensi Daftar Menu Resmi
                  </h3>
                  <p className="mt-0.5 text-xs" style={{ color: theme.textMuted }}>
                    Nuansa ungu lavender & bunga telang
                  </p>
                </div>
                {!menuImgError && (
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                    style={{
                      borderColor: theme.border,
                      color: theme.textPrimary,
                      backgroundColor: theme.surfaceMutedBg,
                    }}
                  >
                    <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Perbesar</span>
                  </button>
                )}
              </div>

              <div
                className="mt-4 overflow-hidden rounded-xl border"
                style={{ borderColor: theme.border }}
              >
                {!menuImgError ? (
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2"
                    aria-label="Perbesar gambar daftar menu resmi Tea Lang & Mini Bar"
                  >
                    <img
                      src="/assets/aistudio/MENU_FIX_WATERMARK_3231f210.png"
                      alt="Daftar menu resmi Tea Lang & Mini Bar dengan bingkai bunga telang dan biji kopi"
                      referrerPolicy="no-referrer"
                      onError={() => setMenuImgError(true)}
                      className="h-auto w-full object-cover transition-transform duration-300 hover:scale-[1.01]"
                    />
                  </button>
                ) : (
                  <div
                    className="flex aspect-[3/4] flex-col items-center justify-center p-6 text-center"
                    style={{ backgroundColor: theme.surfaceMutedBg }}
                  >
                    <span className="font-display text-lg font-semibold" style={{ color: theme.accentText }}>
                      Tea Lang & Mini Bar
                    </span>
                    <span className="mt-1 text-xs" style={{ color: theme.textMuted }}>
                      Tea · Coffee · Local Coffee · Milk Based · Add Ons
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && !menuImgError && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau Daftar Menu Resmi"
        >
          <div
            className="relative max-h-[90vh] max-w-2xl overflow-auto rounded-2xl border p-2 shadow-2xl"
            style={{
              backgroundColor: theme.surfaceBg,
              borderColor: theme.border,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
              aria-label="Tutup pratinjau"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src="/assets/aistudio/MENU_FIX_WATERMARK_3231f210.png"
              alt="Daftar menu resmi Tea Lang & Mini Bar ukuran penuh"
              referrerPolicy="no-referrer"
              className="h-auto w-full rounded-xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};
