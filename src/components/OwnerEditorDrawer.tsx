import React, { useRef, useState } from 'react';
import { X, Plus, Trash2, Download, Upload, RotateCcw, Lock, Check } from 'lucide-react';
import { AddOnItem, SiteConfig, ThemePresetId } from '../types';
import { THEME_PRESETS, ThemeTokens, formatRupiah } from '../data/defaultSiteData';

interface OwnerEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onUpdateConfig: (next: SiteConfig) => void;
  onResetDefault: () => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  theme: ThemeTokens;
}

type EditorTab = 'business' | 'appearance' | 'addons' | 'backup';

export const OwnerEditorDrawer: React.FC<OwnerEditorDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onResetDefault,
  isEditMode,
  onToggleEditMode,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('business');
  const [newAddOnName, setNewAddOnName] = useState('');
  const [newAddOnPrice, setNewAddOnPrice] = useState('3000');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const updateBusiness = (patch: Partial<SiteConfig['business']>) => {
    onUpdateConfig({
      ...config,
      business: { ...config.business, ...patch },
    });
  };

  const updatePillar = (id: string, field: 'title' | 'body', value: string) => {
    onUpdateConfig({
      ...config,
      business: {
        ...config.business,
        pillars: config.business.pillars.map((p) =>
          p.id === id ? { ...p, [field]: value } : p
        ),
      },
    });
  };

  const handleAddAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddOnName.trim()) return;
    const item: AddOnItem = {
      id: `addon-${Date.now()}`,
      name: newAddOnName.trim(),
      price: Math.max(0, Number(newAddOnPrice) || 0),
      available: true,
    };
    onUpdateConfig({
      ...config,
      addOns: [...config.addOns, item],
    });
    setNewAddOnName('');
    setNewAddOnPrice('3000');
  };

  const handleDeleteAddon = (id: string) => {
    onUpdateConfig({
      ...config,
      addOns: config.addOns.filter((a) => a.id !== id),
    });
  };

  const handleToggleAddon = (id: string) => {
    onUpdateConfig({
      ...config,
      addOns: config.addOns.map((a) =>
        a.id === id ? { ...a, available: !a.available } : a
      ),
    });
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tealang-minibar-config.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    setImportSuccess(false);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed.business || !Array.isArray(parsed.menu)) {
          setImportError('Format file JSON tidak sesuai dengan struktur website Tea Lang.');
          return;
        }
        onUpdateConfig(parsed as SiteConfig);
        setImportSuccess(true);
      } catch {
        setImportError('Gagal membaca file JSON. Pastikan file valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="owner-editor-title"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-xl flex-col border-l shadow-2xl"
        style={{
          backgroundColor: theme.surfaceBg,
          borderColor: theme.border,
          color: theme.textPrimary,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: theme.border }}
        >
          <div>
            <h2 id="owner-editor-title" className="font-display text-xl font-bold">
              Editor Website Pemilik
            </h2>
            <p className="text-xs" style={{ color: theme.textMuted }}>
              Semua perubahan tersimpan otomatis di browser Anda
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border cursor-pointer"
            style={{ borderColor: theme.border, color: theme.textMuted }}
            aria-label="Tutup editor website"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mode Edit Menu Shortcut */}
        <div
          className="flex items-center justify-between gap-3 border-b px-5 py-3"
          style={{
            backgroundColor: theme.surfaceMutedBg,
            borderColor: theme.border,
          }}
        >
          <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
            Ingin tambah, edit harga, atau hapus item menu?
          </span>
          <button
            type="button"
            onClick={() => {
              if (!isEditMode) onToggleEditMode();
              onClose();
            }}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            style={{
              backgroundColor: theme.accentBg,
              color: theme.isDark ? '#190F21' : '#FFFFFF',
            }}
          >
            {isEditMode ? 'Kembali ke Halaman Menu' : 'Aktifkan Edit Menu'}
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 border-b px-5 pt-3"
          style={{ borderColor: theme.border }}
        >
          {(
            [
              { id: 'business', label: 'Bisnis & WA' },
              { id: 'appearance', label: 'Background' },
              { id: 'addons', label: 'Tambahan (Add-On)' },
              { id: 'backup', label: 'Backup & PIN' },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="border-b-2 px-3 pb-2.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer sm:text-sm"
                style={{
                  borderColor: active ? theme.accentText : 'transparent',
                  color: active ? theme.textPrimary : theme.textMuted,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {activeTab === 'business' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                  Nomor WhatsApp Admin (Penerima Pesanan)
                </label>
                <input
                  type="text"
                  value={config.business.whatsappNumber}
                  onChange={(e) => updateBusiness({ whatsappNumber: e.target.value })}
                  placeholder="Contoh: 6281234567890"
                  className="mt-1.5 w-full rounded-lg border px-3 py-2 font-mono text-sm"
                  style={{
                    backgroundColor: theme.surfaceBg,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                />
                <p className="mt-1 text-xs" style={{ color: theme.textMuted }}>
                  Gunakan format 628... atau 08... — pesanan online akan otomatis dikirim ke nomor ini.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                    Nama Bisnis
                  </label>
                  <input
                    type="text"
                    value={config.business.brandName}
                    onChange={(e) => updateBusiness({ brandName: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      backgroundColor: theme.surfaceBg,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={config.business.tagline}
                    onChange={(e) => updateBusiness({ tagline: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      backgroundColor: theme.surfaceBg,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                  Judul Utama (Hero)
                </label>
                <input
                  type="text"
                  value={config.business.heroTitle}
                  onChange={(e) => updateBusiness({ heroTitle: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
                  style={{
                    backgroundColor: theme.surfaceBg,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                  Penjelasan Bisnis (Hero)
                </label>
                <textarea
                  rows={3}
                  value={config.business.heroSubtitle}
                  onChange={(e) => updateBusiness({ heroSubtitle: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
                  style={{
                    backgroundColor: theme.surfaceBg,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                  Pengantar Latar Belakang Bisnis
                </label>
                <textarea
                  rows={3}
                  value={config.business.aboutIntro}
                  onChange={(e) => updateBusiness({ aboutIntro: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
                  style={{
                    backgroundColor: theme.surfaceBg,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                />
              </div>

              <div className="space-y-3 border-t pt-4" style={{ borderColor: theme.border }}>
                <span className="block text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>
                  3 Pilar Cerita Bisnis
                </span>
                {config.business.pillars.map((pillar) => (
                  <div
                    key={pillar.id}
                    className="rounded-xl border p-3 space-y-2"
                    style={{ borderColor: theme.border, backgroundColor: theme.surfaceMutedBg }}
                  >
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => updatePillar(pillar.id, 'title', e.target.value)}
                      className="w-full rounded-lg border px-2.5 py-1.5 text-sm font-semibold"
                      style={{
                        backgroundColor: theme.surfaceBg,
                        borderColor: theme.border,
                        color: theme.textPrimary,
                      }}
                    />
                    <textarea
                      rows={2}
                      value={pillar.body}
                      onChange={(e) => updatePillar(pillar.id, 'body', e.target.value)}
                      className="w-full rounded-lg border px-2.5 py-1.5 text-xs"
                      style={{
                        backgroundColor: theme.surfaceBg,
                        borderColor: theme.border,
                        color: theme.textPrimary,
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4" style={{ borderColor: theme.border }}>
                <div>
                  <label className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                    Alamat Lokasi
                  </label>
                  <input
                    type="text"
                    value={config.business.address}
                    onChange={(e) => updateBusiness({ address: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      backgroundColor: theme.surfaceBg,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                      Jam Buka
                    </label>
                    <input
                      type="text"
                      value={config.business.operatingHours}
                      onChange={(e) => updateBusiness({ operatingHours: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
                      style={{
                        backgroundColor: theme.surfaceBg,
                        borderColor: theme.border,
                        color: theme.textPrimary,
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                      Akun Instagram / Sosial Media
                    </label>
                    <input
                      type="text"
                      value={config.business.instagramHandle}
                      onChange={(e) => updateBusiness({ instagramHandle: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
                      style={{
                        backgroundColor: theme.surfaceBg,
                        borderColor: theme.border,
                        color: theme.textPrimary,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold">Pilih Nuansa Latar Belakang Website</h3>
                <p className="mt-1 text-xs" style={{ color: theme.textMuted }}>
                  Seluruh pilihan warna dirancang dari logo kontainer ungu dan menu bunga telang.
                </p>

                <div className="mt-3 grid grid-cols-1 gap-3">
                  {(Object.keys(THEME_PRESETS) as ThemePresetId[]).map((presetId) => {
                    const preset = THEME_PRESETS[presetId];
                    const selected = config.themePreset === presetId;

                    return (
                      <button
                        key={presetId}
                        type="button"
                        onClick={() =>
                          onUpdateConfig({ ...config, themePreset: presetId })
                        }
                        className="flex items-center justify-between gap-4 rounded-xl border p-4 text-left transition-colors cursor-pointer"
                        style={{
                          backgroundColor: selected
                            ? theme.accentSoftBg
                            : theme.surfaceBg,
                          borderColor: selected ? theme.accentText : theme.border,
                        }}
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className="h-10 w-10 shrink-0 rounded-lg border"
                            style={{
                              backgroundColor: preset.pageBg,
                              borderColor: preset.accentBg,
                              boxShadow: `inset 0 0 0 4px ${preset.accentBg}`,
                            }}
                          />
                          <div>
                            <div className="text-sm font-semibold">{preset.label}</div>
                            <div className="text-xs" style={{ color: theme.textMuted }}>
                              {preset.description}
                            </div>
                          </div>
                        </div>
                        {selected && (
                          <Check className="h-5 w-5 shrink-0" style={{ color: theme.accentText }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                className="rounded-xl border p-4"
                style={{ borderColor: theme.border, backgroundColor: theme.surfaceMutedBg }}
              >
                <label className="flex cursor-pointer items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold">
                      Ornamen Latar Bunga Telang & Biji Kopi
                    </div>
                    <div className="text-xs" style={{ color: theme.textMuted }}>
                      Menampilkan siluet lembut bunga telang dan biji kopi di sudut layar
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.showBotanicalBackground}
                    onChange={(e) =>
                      onUpdateConfig({
                        ...config,
                        showBotanicalBackground: e.target.checked,
                      })
                    }
                    className="h-5 w-5 accent-[#4E235B]"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'addons' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold">Kelola Tambahan (Add Ons)</h3>
                <p className="mt-1 text-xs" style={{ color: theme.textMuted }}>
                  Tambahan ini akan muncul saat pelanggan memilih minuman.
                </p>
              </div>

              <div className="space-y-2.5">
                {config.addOns.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between rounded-xl border px-3.5 py-3"
                    style={{
                      backgroundColor: theme.surfaceMutedBg,
                      borderColor: theme.border,
                    }}
                  >
                    <div>
                      <div className="text-sm font-semibold">{addon.name}</div>
                      <div className="font-mono text-xs tabular-nums" style={{ color: theme.textMuted }}>
                        {formatRupiah(addon.price)} · {addon.available ? 'Aktif' : 'Nonaktif'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleAddon(addon.id)}
                        className="rounded-lg border px-2.5 py-1 text-xs font-medium cursor-pointer"
                        style={{
                          backgroundColor: theme.surfaceBg,
                          borderColor: theme.border,
                        }}
                      >
                        {addon.available ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddon(addon.id)}
                        className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 cursor-pointer"
                        aria-label={`Hapus ${addon.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleAddAddon}
                className="rounded-xl border p-4 space-y-3"
                style={{ borderColor: theme.border }}
              >
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>
                  Tambah Add-On Baru
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <input
                    type="text"
                    required
                    value={newAddOnName}
                    onChange={(e) => setNewAddOnName(e.target.value)}
                    placeholder="Nama (mis: Oat Milk)"
                    className="sm:col-span-2 rounded-lg border px-3 py-2 text-sm"
                    style={{
                      backgroundColor: theme.surfaceBg,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                  />
                  <input
                    type="number"
                    min={0}
                    step={500}
                    required
                    value={newAddOnPrice}
                    onChange={(e) => setNewAddOnPrice(e.target.value)}
                    placeholder="Harga (Rp)"
                    className="rounded-lg border px-3 py-2 font-mono text-sm"
                    style={{
                      backgroundColor: theme.surfaceBg,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer"
                  style={{
                    backgroundColor: theme.accentBg,
                    color: theme.isDark ? '#190F21' : '#FFFFFF',
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Add-On</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-5">
              <div
                className="rounded-xl border p-4 space-y-3"
                style={{ borderColor: theme.border, backgroundColor: theme.surfaceMutedBg }}
              >
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Lock className="h-4 w-4" style={{ color: theme.accentText }} />
                  <span>Keamanan PIN Mode Edit (Opsional)</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                  Isi PIN (misal 4–6 angka) jika Anda ingin mengunci Mode Edit saat website dibuka oleh pelanggan. Kosongkan jika ingin bebas diedit langsung.
                </p>
                <input
                  type="password"
                  value={config.ownerPin}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, ownerPin: e.target.value.trim() })
                  }
                  placeholder="Kosongkan = tanpa PIN"
                  className="w-full rounded-lg border px-3 py-2 font-mono text-sm"
                  style={{
                    backgroundColor: theme.surfaceBg,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold">Ekspor & Impor Data Website</h3>
                <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
                  Simpan file cadangan menu dan profil bisnis Anda dalam format JSON, atau muat ulang di perangkat lain.
                </p>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-semibold cursor-pointer"
                    style={{
                      backgroundColor: theme.surfaceBg,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                  >
                    <Download className="h-4 w-4" />
                    <span>Unduh Cadangan (.json)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-semibold cursor-pointer"
                    style={{
                      backgroundColor: theme.surfaceBg,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                  >
                    <Upload className="h-4 w-4" />
                    <span>Impor Cadangan (.json)</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </div>

                {importError && (
                  <p className="text-xs text-red-600">{importError}</p>
                )}
                {importSuccess && (
                  <p className="text-xs text-emerald-600">
                    Data website berhasil dimuat dari file cadangan.
                  </p>
                )}
              </div>

              <div className="border-t pt-5" style={{ borderColor: theme.border }}>
                <h3 className="text-sm font-bold text-red-600">Reset ke Pengaturan Awal</h3>
                <p className="mt-1 text-xs" style={{ color: theme.textMuted }}>
                  Mengembalikan seluruh menu, harga, dan teks bisnis ke setelan bawaan Tea Lang & Mini Bar.
                </p>
                <button
                  type="button"
                  onClick={onResetDefault}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Semua ke Default</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end border-t px-5 py-3.5"
          style={{ borderColor: theme.border }}
        >
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-5 py-2 text-sm font-semibold cursor-pointer"
            style={{
              backgroundColor: theme.accentBg,
              color: theme.isDark ? '#190F21' : '#FFFFFF',
            }}
          >
            Selesai & Tutup
          </button>
        </div>
      </aside>
    </div>
  );
};
