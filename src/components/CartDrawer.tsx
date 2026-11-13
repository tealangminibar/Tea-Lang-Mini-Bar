import React, { useMemo, useState } from 'react';
import { X, Trash2, Copy, Check, MessageCircle, ShoppingBag } from 'lucide-react';
import { CartItem, OrderCustomerDetails } from '../types';
import { ThemeTokens, formatRupiah } from '../data/defaultSiteData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  whatsappNumber: string;
  brandName: string;
  theme: ThemeTokens;
}

export function normalizeWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('62')) return digits;
  return `62${digits}`;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  whatsappNumber,
  brandName,
  theme,
}) => {
  const [customer, setCustomer] = useState<OrderCustomerDetails>({
    customerName: '',
    customerPhone: '',
    orderType: 'Ambil di Mini Bar (Pickup)',
    deliveryAddress: '',
    paymentMethod: 'QRIS',
    generalNote: '',
  });
  const [copied, setCopied] = useState(false);
  const [orderSubmittedCode, setOrderSubmittedCode] = useState<string | null>(null);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const addOnsSum = item.selectedAddOns.reduce((a, b) => a + b.price, 0);
      return sum + (item.menuItem.price + addOnsSum) * item.quantity;
    }, 0);
  }, [cart]);

  const orderCode = useMemo(() => {
    return orderSubmittedCode || `TL-${String(Date.now()).slice(-4)}`;
  }, [orderSubmittedCode]);

  const whatsappMessage = useMemo(() => {
    const lines: string[] = [
      `Halo Admin *${brandName}*! Saya ingin memesan:`,
      `Kode Pesanan: *#${orderCode}*`,
      '',
      '*Detail Pesanan:*',
    ];

    cart.forEach((item, index) => {
      const addOnTotal = item.selectedAddOns.reduce((s, a) => s + a.price, 0);
      const lineTotal = (item.menuItem.price + addOnTotal) * item.quantity;
      lines.push(
        `${index + 1}. ${item.menuItem.name} (${item.temperature}) x${item.quantity} = ${formatRupiah(lineTotal)}`
      );
      if (item.selectedAddOns.length > 0) {
        lines.push(
          `   + Tambahan: ${item.selectedAddOns.map((a) => a.name).join(', ')}`
        );
      }
      if (item.note) {
        lines.push(`   + Catatan: ${item.note}`);
      }
    });

    lines.push('');
    lines.push(`*Total Pembayaran: ${formatRupiah(subtotal)}*`);
    lines.push('');
    lines.push('*Data Pemesan:*');
    lines.push(`Nama: ${customer.customerName.trim() || '-'}`);
    if (customer.customerPhone.trim()) {
      lines.push(`No. HP/WA: ${customer.customerPhone.trim()}`);
    }
    lines.push(`Tipe Pesanan: ${customer.orderType}`);
    if (
      customer.orderType === 'Pesan Antar (Delivery)' &&
      customer.deliveryAddress.trim()
    ) {
      lines.push(`Alamat Antar: ${customer.deliveryAddress.trim()}`);
    }
    lines.push(`Pembayaran: ${customer.paymentMethod}`);
    if (customer.generalNote.trim()) {
      lines.push(`Catatan Umum: ${customer.generalNote.trim()}`);
    }
    lines.push('');
    lines.push('Terima kasih!');

    return lines.join('\n');
  }, [brandName, cart, customer, orderCode, subtotal]);

  const cleanWaPhone = normalizeWhatsAppNumber(whatsappNumber);
  const waHref = cleanWaPhone
    ? `https://wa.me/${cleanWaPhone}?text=${encodeURIComponent(whatsappMessage)}`
    : '#';

  const isFormValid =
    cart.length > 0 &&
    customer.customerName.trim().length > 0 &&
    (customer.orderType !== 'Pesan Antar (Delivery)' ||
      customer.deliveryAddress.trim().length > 0);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-lg flex-col border-l shadow-2xl"
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
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5" style={{ color: theme.accentText }} aria-hidden="true" />
            <h2 id="cart-drawer-title" className="font-display text-xl font-bold">
              Keranjang Pesanan
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border cursor-pointer"
            style={{ borderColor: theme.border, color: theme.textMuted }}
            aria-label="Tutup keranjang"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {cart.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <ShoppingBag
                className="h-10 w-10 opacity-30"
                style={{ color: theme.textMuted }}
                aria-hidden="true"
              />
              <p className="mt-3 text-base font-semibold">Keranjang masih kosong</p>
              <p className="mt-1 max-w-xs text-sm" style={{ color: theme.textMuted }}>
                Pilih minuman favorit Anda dari daftar menu untuk mulai memesan ke WhatsApp admin.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Itemized List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textMuted }}>
                    Item Dipilih ({cart.reduce((s, c) => s + c.quantity, 0)})
                  </span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-xs font-medium text-red-600 hover:underline cursor-pointer"
                  >
                    Kosongkan
                  </button>
                </div>

                {cart.map((item) => {
                  const unitAddOns = item.selectedAddOns.reduce((s, a) => s + a.price, 0);
                  const lineTotal = (item.menuItem.price + unitAddOns) * item.quantity;

                  return (
                    <div
                      key={item.cartItemId}
                      className="rounded-xl border p-3.5"
                      style={{
                        backgroundColor: theme.surfaceMutedBg,
                        borderColor: theme.border,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold">{item.menuItem.name}</div>
                          <div className="mt-0.5 text-xs" style={{ color: theme.textMuted }}>
                            {item.temperature}
                            {item.selectedAddOns.length > 0 &&
                              ` · + ${item.selectedAddOns.map((a) => a.name).join(', ')}`}
                          </div>
                          {item.note && (
                            <div className="mt-1 text-xs italic" style={{ color: theme.textSecondary }}>
                              Catatan: "{item.note}"
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartItemId)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          aria-label={`Hapus ${item.menuItem.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div
                          className="inline-flex items-center rounded-lg border px-1.5 py-0.5"
                          style={{
                            backgroundColor: theme.surfaceBg,
                            borderColor: theme.border,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                            className="h-7 w-7 font-semibold cursor-pointer"
                            aria-label="Kurangi"
                          >
                            −
                          </button>
                          <span className="w-7 text-center font-mono text-sm font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                            className="h-7 w-7 font-semibold cursor-pointer"
                            aria-label="Tambah"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-mono text-sm font-bold tabular-nums">
                          {formatRupiah(lineTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Customer Details Form */}
              <div className="space-y-4 border-t pt-5" style={{ borderColor: theme.border }}>
                <h3 className="text-sm font-bold">Data Pemesan</h3>

                <div>
                  <label htmlFor="cust-name" className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                    Nama Pemesan *
                  </label>
                  <input
                    id="cust-name"
                    type="text"
                    required
                    value={customer.customerName}
                    onChange={(e) =>
                      setCustomer({ ...customer, customerName: e.target.value })
                    }
                    placeholder="Masukkan nama Anda"
                    className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      backgroundColor: theme.surfaceBg,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="cust-phone" className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                    No. WhatsApp Pemesan (opsional)
                  </label>
                  <input
                    id="cust-phone"
                    type="tel"
                    value={customer.customerPhone}
                    onChange={(e) =>
                      setCustomer({ ...customer, customerPhone: e.target.value })
                    }
                    placeholder="Contoh: 08123456789"
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
                    <label htmlFor="order-type" className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                      Metode Pengambilan
                    </label>
                    <select
                      id="order-type"
                      value={customer.orderType}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          orderType: e.target.value as OrderCustomerDetails['orderType'],
                        })
                      }
                      className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
                      style={{
                        backgroundColor: theme.surfaceBg,
                        borderColor: theme.border,
                        color: theme.textPrimary,
                      }}
                    >
                      <option value="Ambil di Mini Bar (Pickup)">Ambil di Mini Bar (Pickup)</option>
                      <option value="Pesan Antar (Delivery)">Pesan Antar (Delivery)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="payment-method" className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                      Pembayaran
                    </label>
                    <select
                      id="payment-method"
                      value={customer.paymentMethod}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          paymentMethod: e.target.value as OrderCustomerDetails['paymentMethod'],
                        })
                      }
                      className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
                      style={{
                        backgroundColor: theme.surfaceBg,
                        borderColor: theme.border,
                        color: theme.textPrimary,
                      }}
                    >
                      <option value="QRIS">QRIS</option>
                      <option value="Tunai di Kasir">Tunai di Kasir</option>
                      <option value="Transfer Bank">Transfer Bank</option>
                    </select>
                  </div>
                </div>

                {customer.orderType === 'Pesan Antar (Delivery)' && (
                  <div>
                    <label htmlFor="cust-address" className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                      Alamat Pengantaran Lengkap *
                    </label>
                    <textarea
                      id="cust-address"
                      rows={2}
                      required
                      value={customer.deliveryAddress}
                      onChange={(e) =>
                        setCustomer({ ...customer, deliveryAddress: e.target.value })
                      }
                      placeholder="Masukkan alamat lengkap & patokan lokasi"
                      className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
                      style={{
                        backgroundColor: theme.surfaceBg,
                        borderColor: theme.border,
                        color: theme.textPrimary,
                      }}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="general-note" className="block text-xs font-semibold" style={{ color: theme.textSecondary }}>
                    Catatan Tambahan
                  </label>
                  <input
                    id="general-note"
                    type="text"
                    value={customer.generalNote}
                    onChange={(e) =>
                      setCustomer({ ...customer, generalNote: e.target.value })
                    }
                    placeholder="Contoh: Diambil jam 16.30"
                    className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      backgroundColor: theme.surfaceBg,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                  />
                </div>

                {orderSubmittedCode && (
                  <div
                    className="rounded-xl border p-3.5 text-xs leading-relaxed"
                    style={{
                      backgroundColor: theme.accentSoftBg,
                      borderColor: theme.accentText,
                      color: theme.textPrimary,
                    }}
                  >
                    <strong>Pesanan #{orderSubmittedCode} siap dikirim!</strong> Jika WhatsApp tidak terbuka otomatis, klik tombol "Salin Format Pesanan" di bawah dan kirim ke nomor admin ({cleanWaPhone}).
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && (
          <div
            className="border-t px-5 py-4 space-y-3"
            style={{
              backgroundColor: theme.surfaceBg,
              borderColor: theme.border,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                Total Pesanan
              </span>
              <span className="font-mono text-xl font-bold tabular-nums">
                {formatRupiah(subtotal)}
              </span>
            </div>

            {!isFormValid && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Mohon isi Nama Pemesan{customer.orderType === 'Pesan Antar (Delivery)' ? ' dan Alamat Pengantaran' : ''} sebelum mengirim ke WhatsApp.
              </p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <a
                href={isFormValid ? waHref : undefined}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!isFormValid) {
                    e.preventDefault();
                    return;
                  }
                  setOrderSubmittedCode(orderCode);
                }}
                aria-disabled={!isFormValid}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-opacity ${
                  isFormValid
                    ? 'cursor-pointer hover:opacity-95'
                    : 'cursor-not-allowed opacity-50'
                }`}
                style={{
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                }}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Pesan via WhatsApp Admin</span>
              </a>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border px-3.5 py-3 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                style={{
                  borderColor: theme.border,
                  color: theme.textPrimary,
                }}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    <span>Salin Teks</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
