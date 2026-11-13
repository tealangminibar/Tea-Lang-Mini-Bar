export type MenuCategory = 'Tea' | 'Coffee' | 'Local Coffee' | 'Milk Based';

export type ThemePresetId = 'lavender-telang' | 'alabaster-plum' | 'krem-kopi' | 'plum-malam';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number; // in IDR (e.g. 10000)
  description: string;
  featured?: boolean;
  available: boolean;
}

export interface AddOnItem {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface StoryPillar {
  id: string;
  number: string;
  title: string;
  body: string;
}

export interface BusinessInfo {
  brandName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutHeading: string;
  aboutIntro: string;
  pillars: StoryPillar[];
  whatsappNumber: string; // e.g. 6281234567890
  address: string;
  operatingHours: string;
  instagramHandle: string;
  announcementText: string;
}

export interface SiteConfig {
  business: BusinessInfo;
  menu: MenuItem[];
  addOns: AddOnItem[];
  themePreset: ThemePresetId;
  showBotanicalBackground: boolean;
  ownerPin: string; // optional PIN (empty = no lock)
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  selectedAddOns: AddOnItem[];
  quantity: number;
  temperature: 'Dingin (Ice)' | 'Hangat (Hot)';
  note: string;
}

export interface OrderCustomerDetails {
  customerName: string;
  customerPhone: string;
  orderType: 'Ambil di Mini Bar (Pickup)' | 'Pesan Antar (Delivery)';
  deliveryAddress: string;
  paymentMethod: 'Tunai di Kasir' | 'QRIS' | 'Transfer Bank';
  generalNote: string;
}
