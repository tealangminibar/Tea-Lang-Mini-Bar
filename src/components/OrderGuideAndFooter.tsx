import React from 'react';
import { MapPin, Clock, Phone, PenLine } from 'lucide-react';
import { BusinessInfo } from '../types';
import { ThemeTokens } from '../data/defaultSiteData';
import { normalizeWhatsAppNumber } from './CartDrawer';

interface OrderGuideAndFooterProps {
  business: BusinessInfo;
  onOpenEditorDrawer: () => void;
  theme: ThemeTokens;
}

export const OrderGuideAndFooter: React.FC<OrderGuideAndFooterProps> = ({
  business,
  onOpenEditorDrawer,
  theme,
}) => {
  const cleanWa = normalizeWhatsAppNumber(business.whatsappNumber);

  return (
    <>
      {/* How to Order + Store Location & Contact */}
      <section
        id="cara-pesan"
        className="relative z-10 border-t py-14 sm:py-20"
        style={{ borderColor: theme.border }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* 3-Step Order Flow */}
            <div className="lg:col-span-7">
              <h2
                className="font-display text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ color: theme.textPrimary }}
              >
                Cara Pemesanan Online
              </h2>
              <p className="mt-2 text-sm sm:text-base" style={{ color: theme.textSecondary }}>
                Pesan lebih praktis tanpa antre—minuman diracik segar begitu pesanan diterima admin.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div
                  className="rounded-xl border p-5"
                  style={{
                    backgroundColor: theme.surfaceBg,
                    borderColor: theme.border,
                  }}
                >
                  <div className="font-mono text-sm font-bold" style={{ color: theme.accentText }}>
                    01. Pilih Menu
                  </div>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                    Klik tombol Pesan pada minuman Tea, Coffee, atau Milk Based favorit Anda dan pilih Add Ons bila perlu.
                  </p>
                </div>

                <div
                  className="rounded-xl border p-5"
                  style={{
                    backgroundColor: theme.surfaceBg,
                    borderColor: theme.border,
                  }}
                >
                  <div className="font-mono text-sm font-bold" style={{ color: theme.accentText }}>
                    02. Isi Data
                  </div>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                    Buka Keranjang, masukkan nama pemesan, pilih Ambil di Mini Bar atau Pesan Antar, serta metode bayar.
                  </p>
                </div>

                <div
                  className="rounded-xl border p-5"
                  style={{
                    backgroundColor: theme.surfaceBg,
                    borderColor: theme.border,
                  }}
                >
                  <div className="font-mono text-sm font-bold" style={{ color: theme.accentText }}>
                    03. Kirim WhatsApp
                  </div>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                    Tekan tombol Pesan via WhatsApp Admin. Rincian pesanan dan total harga otomatis terisi rapi.
                  </p>
                </div>
              </div>
            </div>

            {/* Store Info & Direct Contact */}
            <div id="lokasi" className="lg:col-span-5">
              <div
                className="h-full rounded-2xl border p-6"
                style={{
                  backgroundColor: theme.surfaceBg,
                  borderColor: theme.border,
                }}
              >
                <h2
                  className="font-display text-xl font-bold"
                  style={{ color: theme.textPrimary }}
                >
                  Lokasi & Kontak Admin
                </h2>

                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: theme.accentText }} aria-hidden="true" />
                    <div>
                      <div className="font-semibold" style={{ color: theme.textPrimary }}>
                        Alamat Mini Bar
                      </div>
                      <p className="mt-0.5 leading-relaxed" style={{ color: theme.textSecondary }}>
                        {business.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0" style={{ color: theme.accentText }} aria-hidden="true" />
                    <div>
                      <div className="font-semibold" style={{ color: theme.textPrimary }}>
                        Jam Operasional
                      </div>
                      <p className="mt-0.5" style={{ color: theme.textSecondary }}>
                        {business.operatingHours}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0" style={{ color: theme.accentText }} aria-hidden="true" />
                    <div>
                      <div className="font-semibold" style={{ color: theme.textPrimary }}>
                        WhatsApp Admin Pemesanan
                      </div>
                      <p className="mt-0.5 font-mono text-xs sm:text-sm" style={{ color: theme.textSecondary }}>
                        +{cleanWa}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t pt-5" style={{ borderColor: theme.border }}>
                  <a
                    href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(`Halo Admin ${business.brandName}, saya ingin bertanya mengenai menu.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: theme.accentBg,
                      color: theme.isDark ? '#190F21' : '#FFFFFF',
                    }}
                  >
                    Chat WhatsApp Admin
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer
        className="relative z-10 border-t py-8"
        style={{
          backgroundColor: theme.surfaceBg,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <div className="font-display text-base font-bold" style={{ color: theme.textPrimary }}>
              {business.brandName}
            </div>
            <p className="mt-0.5 text-xs" style={{ color: theme.textMuted }}>
              {business.tagline} · {business.instagramHandle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenEditorDrawer}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold cursor-pointer"
              style={{
                borderColor: theme.border,
                color: theme.textPrimary,
                backgroundColor: theme.surfaceMutedBg,
              }}
            >
              <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Kelola & Edit Website</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};
