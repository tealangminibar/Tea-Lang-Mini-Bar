import React, { useEffect, useMemo, useState } from 'react';
import { Check, Lock, PenLine, ShoppingBag, X } from 'lucide-react';
import {
  DEFAULT_SITE_CONFIG,
  THEME_PRESETS,
  formatShortK,
} from './data/defaultSiteData';
import { AddOnItem, CartItem, MenuItem, SiteConfig } from './types';
import { BotanicalBackdrop } from './components/BotanicalBackdrop';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { MenuSection } from './components/MenuSection';
import { OrderGuideAndFooter } from './components/OrderGuideAndFooter';
import { CartDrawer } from './components/CartDrawer';
import { OwnerEditorDrawer } from './components/OwnerEditorDrawer';

const STORAGE_KEY = 'tealang_minibar_site_config_v1';

function loadInitialConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_CONFIG;
    const parsed = JSON.parse(raw) as Partial<SiteConfig>;
    return {
      ...DEFAULT_SITE_CONFIG,
      ...parsed,
      business: {
        ...DEFAULT_SITE_CONFIG.business,
        ...(parsed.business || {}),
      },
      menu: Array.isArray(parsed.menu) ? parsed.menu : DEFAULT_SITE_CONFIG.menu,
      addOns: Array.isArray(parsed.addOns) ? parsed.addOns : DEFAULT_SITE_CONFIG.addOns,
    };
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(loadInitialConfig);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditorDrawerOpen, setIsEditorDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Optional PIN challenge when ownerPin is configured
  const [pinPromptTarget, setPinPromptTarget] = useState<'editMode' | 'drawer' | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Ignore storage quota issues
    }
  }, [config]);

  const theme = THEME_PRESETS[config.themePreset] || THEME_PRESETS['lavender-telang'];

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const minPriceLabel = useMemo(() => {
    const availablePrices = config.menu
      .filter((m) => m.available)
      .map((m) => m.price);
    if (availablePrices.length === 0) return '5K';
    return formatShortK(Math.min(...availablePrices));
  }, [config.menu]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  const requestEditAccess = (target: 'editMode' | 'drawer') => {
    if (isEditMode) {
      if (target === 'editMode') setIsEditMode(false);
      else setIsEditorDrawerOpen(true);
      return;
    }

    if (config.ownerPin) {
      setPinPromptTarget(target);
      setPinInput('');
      setPinError(false);
      return;
    }

    if (target === 'editMode') setIsEditMode(true);
    else {
      setIsEditMode(true);
      setIsEditorDrawerOpen(true);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === config.ownerPin) {
      const target = pinPromptTarget;
      setPinPromptTarget(null);
      setIsEditMode(true);
      if (target === 'drawer') {
        setIsEditorDrawerOpen(true);
      }
    } else {
      setPinError(true);
    }
  };

  const handleAddToCart = (
    menuItem: MenuItem,
    selectedAddOns: AddOnItem[],
    temperature: 'Dingin (Ice)' | 'Hangat (Hot)',
    quantity: number,
    note: string
  ) => {
    const addOnKey = selectedAddOns
      .map((a) => a.id)
      .sort()
      .join(',');
    const cartKey = `${menuItem.id}__${temperature}__${addOnKey}__${note}`;

    setCart((prev) => {
      const existing = prev.find((c) => c.cartItemId === cartKey);
      if (existing) {
        return prev.map((c) =>
          c.cartItemId === cartKey ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [
        ...prev,
        {
          cartItemId: cartKey,
          menuItem,
          selectedAddOns,
          temperature,
          quantity,
          note,
        },
      ];
    });

    showToast(`${menuItem.name} ditambahkan ke keranjang`);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.cartItemId === cartItemId ? { ...c, quantity: c.quantity + delta } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((c) => c.cartItemId !== cartItemId));
  };

  const handleSaveMenuItem = (item: MenuItem, isNew: boolean) => {
    setConfig((prev) => ({
      ...prev,
      menu: isNew
        ? [item, ...prev.menu]
        : prev.menu.map((m) => (m.id === item.id ? item : m)),
    }));
    showToast(isNew ? `Menu "${item.name}" ditambahkan` : `Menu "${item.name}" diperbarui`);
  };

  const handleDeleteMenuItem = (id: string) => {
    const target = config.menu.find((m) => m.id === id);
    setConfig((prev) => ({
      ...prev,
      menu: prev.menu.filter((m) => m.id !== id),
    }));
    if (target) showToast(`Menu "${target.name}" dihapus`);
  };

  const handleToggleAvailability = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      menu: prev.menu.map((m) =>
        m.id === id ? { ...m, available: !m.available } : m
      ),
    }));
  };

  const handleResetDefault = () => {
    setConfig(DEFAULT_SITE_CONFIG);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Website dikembalikan ke setelan awal');
  };

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{
        backgroundColor: theme.pageBg,
        color: theme.textPrimary,
      }}
    >
      <BotanicalBackdrop visible={config.showBotanicalBackground} theme={theme} />

      <Navbar
        brandName={config.business.brandName}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        theme={theme}
      />

      {/* Active Edit Mode Toolbar */}
      {isEditMode && (
        <div
          className="relative z-30 border-b px-4 py-2.5 sm:px-6"
          style={{
            backgroundColor: theme.accentSoftBg,
            borderColor: theme.border,
          }}
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium sm:text-sm">
              <PenLine className="h-4 w-4 shrink-0" style={{ color: theme.accentText }} />
              <span>
                <strong>Mode Edit Aktif:</strong> Anda dapat langsung mengubah menu di bawah atau membuka Pengaturan Website.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditorDrawerOpen(true)}
                className="rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer"
                style={{
                  backgroundColor: theme.surfaceBg,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                }}
              >
                Edit Bisnis, WA & Background
              </button>
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer"
                style={{
                  backgroundColor: theme.accentBg,
                  color: theme.isDark ? '#190F21' : '#FFFFFF',
                }}
              >
                <Check className="h-3.5 w-3.5" />
                <span>Selesai Edit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main>
        <HeroSection
          business={config.business}
          menuCount={config.menu.length}
          minPriceLabel={minPriceLabel}
          isEditMode={isEditMode}
          onToggleEditMode={() => requestEditAccess('editMode')}
          onOpenEditorDrawer={() => requestEditAccess('drawer')}
          theme={theme}
        />

        <AboutSection business={config.business} theme={theme} />

        <MenuSection
          menu={config.menu}
          addOns={config.addOns}
          isEditMode={isEditMode}
          onAddToCart={handleAddToCart}
          onSaveMenuItem={handleSaveMenuItem}
          onDeleteMenuItem={handleDeleteMenuItem}
          onToggleAvailability={handleToggleAvailability}
          theme={theme}
        />

        <OrderGuideAndFooter
          business={config.business}
          onOpenEditorDrawer={() => requestEditAccess('drawer')}
          theme={theme}
        />
      </main>

      {/* Mobile floating cart action bar when items exist */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed right-4 bottom-4 left-4 z-30 md:hidden">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold shadow-lg cursor-pointer"
            style={{
              backgroundColor: theme.accentBg,
              color: theme.isDark ? '#190F21' : '#FFFFFF',
            }}
          >
            <span className="inline-flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Lihat Keranjang ({cartCount} item)</span>
            </span>
            <span>Pesan WhatsApp →</span>
          </button>
        </div>
      )}

      {/* Toast feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 bottom-20 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg md:bottom-5"
          style={{
            backgroundColor: theme.surfaceBg,
            borderColor: theme.border,
            color: theme.textPrimary,
          }}
        >
          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
          {cartCount > 0 && !isCartOpen && (
            <button
              type="button"
              onClick={() => {
                setToastMessage(null);
                setIsCartOpen(true);
              }}
              className="ml-1 font-semibold underline underline-offset-2 cursor-pointer"
              style={{ color: theme.accentText }}
            >
              Buka Keranjang
            </button>
          )}
        </div>
      )}

      {/* Owner PIN Modal */}
      {pinPromptTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          onClick={() => setPinPromptTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pin-title"
        >
          <form
            onSubmit={handlePinSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border p-6 shadow-xl"
            style={{
              backgroundColor: theme.surfaceBg,
              borderColor: theme.border,
              color: theme.textPrimary,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" style={{ color: theme.accentText }} />
                <h3 id="pin-title" className="font-display text-lg font-bold">
                  Masukkan PIN Pemilik
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPinPromptTarget(null)}
                className="rounded-lg p-1 cursor-pointer"
                aria-label="Tutup dialog PIN"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-xs" style={{ color: theme.textMuted }}>
              Masukkan PIN untuk membuka akses edit website.
            </p>
            <input
              type="password"
              autoFocus
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="PIN Pemilik"
              className="mt-4 w-full rounded-lg border px-3 py-2.5 font-mono text-sm"
              style={{
                backgroundColor: theme.surfaceBg,
                borderColor: pinError ? '#DC2626' : theme.border,
                color: theme.textPrimary,
              }}
            />
            {pinError && (
              <p className="mt-1.5 text-xs text-red-600">PIN salah. Silakan coba lagi.</p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPinPromptTarget(null)}
                className="rounded-lg border px-4 py-2 text-xs font-medium cursor-pointer"
                style={{ borderColor: theme.border }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer"
                style={{
                  backgroundColor: theme.accentBg,
                  color: theme.isDark ? '#190F21' : '#FFFFFF',
                }}
              >
                Buka Mode Edit
              </button>
            </div>
          </form>
        </div>
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCart([])}
        whatsappNumber={config.business.whatsappNumber}
        brandName={config.business.brandName}
        theme={theme}
      />

      <OwnerEditorDrawer
        isOpen={isEditorDrawerOpen}
        onClose={() => setIsEditorDrawerOpen(false)}
        config={config}
        onUpdateConfig={setConfig}
        onResetDefault={handleResetDefault}
        isEditMode={isEditMode}
        onToggleEditMode={() => requestEditAccess('editMode')}
        theme={theme}
      />
    </div>
  );
}
