import React, { useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, Check, X, Eye, EyeOff } from 'lucide-react';
import { AddOnItem, MenuCategory, MenuItem } from '../types';
import { ThemeTokens, formatRupiah, formatShortK } from '../data/defaultSiteData';

interface MenuSectionProps {
  menu: MenuItem[];
  addOns: AddOnItem[];
  isEditMode: boolean;
  onAddToCart: (
    item: MenuItem,
    selectedAddOns: AddOnItem[],
    temperature: 'Dingin (Ice)' | 'Hangat (Hot)',
    quantity: number,
    note: string
  ) => void;
  onSaveMenuItem: (item: MenuItem, isNew: boolean) => void;
  onDeleteMenuItem: (id: string) => void;
  onToggleAvailability: (id: string) => void;
  theme: ThemeTokens;
}

const CATEGORIES: Array<'Semua' | MenuCategory> = [
  'Semua',
  'Tea',
  'Coffee',
  'Local Coffee',
  'Milk Based',
];

export const MenuSection: React.FC<MenuSectionProps> = ({
  menu,
  addOns,
  isEditMode,
  onAddToCart,
  onSaveMenuItem,
  onDeleteMenuItem,
  onToggleAvailability,
  theme,
}) => {
  const [activeCategory, setActiveCategory] = useState<'Semua' | MenuCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Customization modal before adding to cart
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [temperature, setTemperature] = useState<'Dingin (Ice)' | 'Hangat (Hot)'>('Dingin (Ice)');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  // Inline / modal editor for a menu item
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const matchesCategory =
        activeCategory === 'Semua' || item.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [menu, activeCategory, searchQuery]);

  const openCustomizeModal = (item: MenuItem) => {
    setCustomizingItem(item);
    setSelectedAddOnIds([]);
    setTemperature('Dingin (Ice)');
    setQuantity(1);
    setNote('');
  };

  const handleConfirmAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customizingItem) return;
    const chosenAddOns = addOns.filter((a) => selectedAddOnIds.includes(a.id));
    onAddToCart(customizingItem, chosenAddOns, temperature, quantity, note.trim());
    setCustomizingItem(null);
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const openNewItemModal = () => {
    setIsCreatingNew(true);
    setEditingItem({
      id: `menu-${Date.now()}`,
      name: '',
      category: activeCategory === 'Semua' ? 'Tea' : activeCategory,
      price: 10000,
      description: '',
      featured: false,
      available: true,
    });
  };

  const openEditItemModal = (item: MenuItem) => {
    setIsCreatingNew(false);
    setEditingItem({ ...item });
  };

  const handleSubmitEditMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name.trim()) return;
    onSaveMenuItem(
      {
        ...editingItem,
        name: editingItem.name.trim(),
        description:
          editingItem.description.trim() ||
          `Minuman segar pilihan dari kategori ${editingItem.category}.`,
        price: Math.max(0, Number(editingItem.price) || 0),
      },
      isCreatingNew
    );
    setEditingItem(null);
  };

  const activeAddOns = addOns.filter((a) => a.available);

  const customSubtotal = useMemo(() => {
    if (!customizingItem) return 0;
    const addOnTotal = activeAddOns
      .filter((a) => selectedAddOnIds.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0);
    return (customizingItem.price + addOnTotal) * quantity;
  }, [customizingItem, activeAddOns, selectedAddOnIds, quantity]);

  return (
    <section
      id="menu"
      className="relative z-10 border-t py-14 sm:py-20"
      style={{ borderColor: theme.border }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Heading + Edit Mode Add CTA */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              className="font-display text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ color: theme.textPrimary }}
            >
              Daftar Menu & Pemesanan Online
            </h2>
            <p className="mt-2 max-w-2xl text-sm sm:text-base" style={{ color: theme.textSecondary }}>
              Pilih kategori minuman favorit Anda, tambahkan topping atau ekstra espresso sesuai selera, lalu kirim pesanan langsung ke WhatsApp admin.
            </p>
          </div>

          {isEditMode && (
            <button
              type="button"
              onClick={openNewItemModal}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              style={{
                backgroundColor: theme.accentBg,
                color: theme.isDark ? '#190F21' : '#FFFFFF',
              }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Tambah Menu Baru</span>
            </button>
          )}
        </div>

        {/* Category Filter Tabs + Search Input */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div
            role="tablist"
            aria-label="Filter kategori menu"
            className="flex flex-wrap items-center gap-1.5 rounded-xl border p-1.5"
            style={{
              backgroundColor: theme.surfaceMutedBg,
              borderColor: theme.border,
            }}
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className="rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer sm:text-sm"
                  style={{
                    backgroundColor: isActive ? theme.surfaceBg : 'transparent',
                    color: isActive ? theme.textPrimary : theme.textMuted,
                    boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
              style={{ color: theme.textMuted }}
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari minuman (contoh: Matcha)..."
              aria-label="Cari menu minuman"
              className="w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm focus-visible:outline-2 focus-visible:outline-offset-1"
              style={{
                backgroundColor: theme.surfaceBg,
                borderColor: theme.border,
                color: theme.textPrimary,
              }}
            />
          </div>
        </div>

        {/* Add-ons summary bar */}
        {activeAddOns.length > 0 && (
          <div
            className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border px-4 py-3 text-xs sm:text-sm"
            style={{
              backgroundColor: theme.surfaceBg,
              borderColor: theme.border,
              color: theme.textSecondary,
            }}
          >
            <span className="font-semibold" style={{ color: theme.textPrimary }}>
              Tambahan (Add Ons) tersedia saat memesan:
            </span>
            {activeAddOns.map((addon, idx) => (
              <React.Fragment key={addon.id}>
                {idx > 0 && <span aria-hidden="true">·</span>}
                <span>
                  {addon.name}{' '}
                  <span className="font-mono font-medium tabular-nums">
                    (+{formatShortK(addon.price)})
                  </span>
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Menu Grid */}
        {filteredMenu.length === 0 ? (
          <div
            className="mt-8 rounded-2xl border p-10 text-center"
            style={{
              backgroundColor: theme.surfaceBg,
              borderColor: theme.border,
            }}
          >
            <p className="text-base font-semibold" style={{ color: theme.textPrimary }}>
              Menu tidak ditemukan
            </p>
            <p className="mt-1 text-sm" style={{ color: theme.textMuted }}>
              Coba kata kunci lain atau pilih kategori Semua.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMenu.map((item) => (
              <article
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border p-5 transition-transform duration-150 hover:-translate-y-0.5"
                style={{
                  backgroundColor: theme.surfaceBg,
                  borderColor: theme.border,
                  opacity: item.available ? 1 : 0.65,
                }}
              >
                <div>
                  {/* Quiet metadata row (Zero-pill discipline) */}
                  <div
                    className="flex items-center justify-between gap-2 text-xs font-medium"
                    style={{ color: theme.textMuted }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{item.category}</span>
                      {item.featured && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span style={{ color: theme.accentText }}>Favorit</span>
                        </>
                      )}
                      {!item.available && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-red-600 dark:text-red-400">Habis</span>
                        </>
                      )}
                    </div>
                    <span className="font-mono tabular-nums">
                      {formatShortK(item.price)}
                    </span>
                  </div>

                  <h3
                    className="mt-2 font-display text-lg font-semibold leading-snug"
                    style={{ color: theme.textPrimary }}
                  >
                    {item.name}
                  </h3>

                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: theme.textSecondary }}
                  >
                    {item.description}
                  </p>
                </div>

                <div
                  className="mt-5 flex items-center justify-between gap-3 border-t pt-4"
                  style={{ borderColor: theme.border }}
                >
                  <span
                    className="font-mono text-base font-semibold tabular-nums"
                    style={{ color: theme.textPrimary }}
                  >
                    {formatRupiah(item.price)}
                  </span>

                  <div className="flex items-center gap-2">
                    {isEditMode ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onToggleAvailability(item.id)}
                          title={item.available ? 'Tandai Habis' : 'Tandai Tersedia'}
                          aria-label={item.available ? 'Tandai Habis' : 'Tandai Tersedia'}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors cursor-pointer"
                          style={{
                            borderColor: theme.border,
                            color: theme.textSecondary,
                          }}
                        >
                          {item.available ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditItemModal(item)}
                          title="Edit menu"
                          aria-label={`Edit ${item.name}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors cursor-pointer"
                          style={{
                            borderColor: theme.border,
                            color: theme.textPrimary,
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteMenuItem(item.id)}
                          title="Hapus menu"
                          aria-label={`Hapus ${item.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={!item.available}
                        onClick={() => openCustomizeModal(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-transform duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer sm:text-sm"
                        style={{
                          backgroundColor: theme.accentBg,
                          color: theme.isDark ? '#190F21' : '#FFFFFF',
                        }}
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{item.available ? 'Pesan' : 'Habis'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Customize Drink & Add-On Modal */}
      {customizingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          onClick={() => setCustomizingItem(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="customize-title"
        >
          <form
            onSubmit={handleConfirmAddToCart}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border p-6 shadow-xl"
            style={{
              backgroundColor: theme.surfaceBg,
              borderColor: theme.border,
              color: theme.textPrimary,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium" style={{ color: theme.textMuted }}>
                  {customizingItem.category}
                </p>
                <h3 id="customize-title" className="mt-0.5 font-display text-xl font-bold">
                  {customizingItem.name}
                </h3>
                <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>
                  {customizingItem.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCustomizingItem(null)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border cursor-pointer"
                style={{ borderColor: theme.border, color: theme.textMuted }}
                aria-label="Tutup pilihan minuman"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Temperature Option */}
            <div className="mt-5">
              <label className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                Penyajian
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(['Dingin (Ice)', 'Hangat (Hot)'] as const).map((temp) => {
                  const selected = temperature === temp;
                  return (
                    <button
                      key={temp}
                      type="button"
                      onClick={() => setTemperature(temp)}
                      className="rounded-lg border px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer"
                      style={{
                        backgroundColor: selected ? theme.accentSoftBg : theme.surfaceMutedBg,
                        borderColor: selected ? theme.accentText : theme.border,
                        color: selected ? theme.accentText : theme.textSecondary,
                      }}
                    >
                      {temp}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add-ons */}
            {activeAddOns.length > 0 && (
              <div className="mt-5">
                <span className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                  Tambahan (Add Ons)
                </span>
                <div className="mt-2 space-y-2">
                  {activeAddOns.map((addon) => {
                    const checked = selectedAddOnIds.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        className="flex cursor-pointer items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm"
                        style={{
                          backgroundColor: checked ? theme.accentSoftBg : theme.surfaceBg,
                          borderColor: checked ? theme.accentText : theme.border,
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAddOn(addon.id)}
                            className="h-4 w-4 accent-[#4E235B]"
                          />
                          <span className="font-medium">{addon.name}</span>
                        </div>
                        <span className="font-mono text-xs font-semibold tabular-nums">
                          +{formatRupiah(addon.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Note */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                  Jumlah
                </label>
                <div
                  className="mt-2 flex items-center justify-between rounded-lg border px-2 py-1.5"
                  style={{ borderColor: theme.border }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-7 w-7 rounded font-semibold cursor-pointer"
                    aria-label="Kurangi jumlah"
                  >
                    −
                  </button>
                  <span className="font-mono text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="h-7 w-7 rounded font-semibold cursor-pointer"
                    aria-label="Tambah jumlah"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="drink-note"
                  className="block text-xs font-semibold"
                  style={{ color: theme.textSecondary }}
                >
                  Catatan (opsional)
                </label>
                <input
                  id="drink-note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Contoh: Less sugar, es sedikit"
                  className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
                  style={{
                    backgroundColor: theme.surfaceBg,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 border-t pt-4" style={{ borderColor: theme.border }}>
              <div>
                <span className="block text-xs" style={{ color: theme.textMuted }}>
                  Subtotal
                </span>
                <span className="font-mono text-lg font-bold tabular-nums">
                  {formatRupiah(customSubtotal)}
                </span>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                style={{
                  backgroundColor: theme.accentBg,
                  color: theme.isDark ? '#190F21' : '#FFFFFF',
                }}
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>Tambah ke Keranjang</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create / Edit Menu Item Modal */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          onClick={() => setEditingItem(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-menu-title"
        >
          <form
            onSubmit={handleSubmitEditMenu}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border p-6 shadow-xl"
            style={{
              backgroundColor: theme.surfaceBg,
              borderColor: theme.border,
              color: theme.textPrimary,
            }}
          >
            <div className="flex items-center justify-between">
              <h3 id="edit-menu-title" className="font-display text-xl font-bold">
                {isCreatingNew ? 'Tambah Menu Baru' : 'Edit Detail Menu'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border cursor-pointer"
                style={{ borderColor: theme.border, color: theme.textMuted }}
                aria-label="Tutup form menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                  Nama Minuman
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Contoh: Signature Tea Lang"
                  className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
                  style={{
                    backgroundColor: theme.surfaceBg,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                    Kategori
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value as MenuCategory,
                      })
                    }
                    className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      backgroundColor: theme.surfaceBg,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                  >
                    <option value="Tea">Tea</option>
                    <option value="Coffee">Coffee</option>
                    <option value="Local Coffee">Local Coffee</option>
                    <option value="Milk Based">Milk Based</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    required
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        price: Number(e.target.value),
                      })
                    }
                    className="mt-1.5 w-full rounded-lg border px-3 py-2 font-mono text-sm tabular-nums"
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
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  placeholder="Jelaskan cita rasa atau bahan minuman ini..."
                  className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
                  style={{
                    backgroundColor: theme.surfaceBg,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(editingItem.featured)}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, featured: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#4E235B]"
                  />
                  <span>Tandai Favorit</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editingItem.available}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, available: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#4E235B]"
                  />
                  <span>Tersedia (Ready)</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5 border-t pt-4" style={{ borderColor: theme.border }}>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="rounded-lg border px-4 py-2 text-sm font-medium cursor-pointer"
                style={{ borderColor: theme.border, color: theme.textSecondary }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-lg px-5 py-2 text-sm font-semibold cursor-pointer"
                style={{
                  backgroundColor: theme.accentBg,
                  color: theme.isDark ? '#190F21' : '#FFFFFF',
                }}
              >
                Simpan Menu
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};
