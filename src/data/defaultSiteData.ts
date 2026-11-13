import { SiteConfig, ThemePresetId } from '../types';

export interface ThemeTokens {
  id: ThemePresetId;
  label: string;
  description: string;
  isDark: boolean;
  pageBg: string;
  surfaceBg: string;
  surfaceMutedBg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentBg: string;
  accentHoverBg: string;
  accentText: string;
  accentSoftBg: string;
}

export const THEME_PRESETS: Record<ThemePresetId, ThemeTokens> = {
  'lavender-telang': {
    id: 'lavender-telang',
    label: 'Lavender Bunga Telang',
    description: 'Terinspirasi warna ungu-lavender menu resmi Tea Lang & bunga telang.',
    isDark: false,
    pageBg: '#F6F2FA',
    surfaceBg: '#FFFFFF',
    surfaceMutedBg: '#EFEAF6',
    border: '#E2D9EC',
    textPrimary: '#24142E',
    textSecondary: '#4B3A5A',
    textMuted: '#736482',
    accentBg: '#4E235B',
    accentHoverBg: '#3D1948',
    accentText: '#4E235B',
    accentSoftBg: '#EAE0F4',
  },
  'alabaster-plum': {
    id: 'alabaster-plum',
    label: 'Putih Bersih Minimalis',
    description: 'Latar terang bersih dengan aksen ungu kontainer yang tegas dan modern.',
    isDark: false,
    pageBg: '#FAF9FB',
    surfaceBg: '#FFFFFF',
    surfaceMutedBg: '#F3EFF6',
    border: '#E6E1EC',
    textPrimary: '#1E1526',
    textSecondary: '#4C4355',
    textMuted: '#766D80',
    accentBg: '#552563',
    accentHoverBg: '#411A4D',
    accentText: '#552563',
    accentSoftBg: '#F1EAF6',
  },
  'krem-kopi': {
    id: 'krem-kopi',
    label: 'Krem Hangat & Kopi',
    description: 'Nuansa krem hangat dari papan kayu bar dan biji kopi sangrai.',
    isDark: false,
    pageBg: '#F9F6F2',
    surfaceBg: '#FFFFFF',
    surfaceMutedBg: '#F2ECE4',
    border: '#E5DDD2',
    textPrimary: '#261C1A',
    textSecondary: '#544642',
    textMuted: '#7E6F6A',
    accentBg: '#4E235B',
    accentHoverBg: '#3D1948',
    accentText: '#4E235B',
    accentSoftBg: '#EFE6EA',
  },
  'plum-malam': {
    id: 'plum-malam',
    label: 'Ungu Kontainer Malam',
    description: 'Suasana sore hingga malam di mini bar dengan lampu gantung hangat.',
    isDark: true,
    pageBg: '#190F21',
    surfaceBg: '#23162D',
    surfaceMutedBg: '#2C1C38',
    border: '#3B284A',
    textPrimary: '#F7F3FB',
    textSecondary: '#D8CDE2',
    textMuted: '#A796B8',
    accentBg: '#C89E7C',
    accentHoverBg: '#B58966',
    accentText: '#DFB99B',
    accentSoftBg: '#322040',
  },
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  themePreset: 'lavender-telang',
  showBotanicalBackground: true,
  ownerPin: '',
  business: {
    brandName: 'Tea Lang & Mini Bar',
    tagline: 'Fresh Tea · Coffee · Good Mood',
    heroTitle: 'Seduhan Bunga Telang, Kopi Lokal & Suasana Hangat Container Mini Bar',
    heroSubtitle:
      'Tea Lang & Mini Bar menghadirkan konsep kedai kontainer ungu yang santai dan akrab. Dari kesegaran teh bunga telang khas kami, seduhan kopi lokal Sumawe, hingga racikan milk-based yang pas menemani waktu istirahat maupun kumpul bersama.',
    aboutHeading: 'Latar Belakang & Konsep Bisnis Kami',
    aboutIntro:
      'Berawal dari keinginan menghadirkan tempat singgah yang ringkas, estetik, dan ramah di kantong, Tea Lang & Mini Bar memadukan konsep kontainer modern dengan cita rasa minuman yang dibuat segar setiap pesanan.',
    pillars: [
      {
        id: 'p1',
        number: '01',
        title: 'Signature Bunga Telang & Teh Segar',
        body: 'Nama "Tea Lang" lahir dari perpaduan Tea dan Bunga Telang (Clitoria ternatea) yang memberi karakter warna ungu-biru alami serta rasa ringan yang menyegarkan.',
      },
      {
        id: 'p2',
        number: '02',
        title: 'Kopi Lokal Sumawe & Espresso Bar',
        body: 'Kami merawat tradisi seduhan Kopi Tubruk Sumawe yang autentik sekaligus menyajikan kreasi modern seperti Es Kopi Susu, Vietnam Drip, hingga Matcha Presso.',
      },
      {
        id: 'p3',
        number: '03',
        title: 'Konsep Container Mini Bar',
        body: 'Dirancang dengan kontainer ungu ikonik, jendela saji terbuka, bar stool nyaman, dan lampu gantung rooftop yang menghadirkan "Good Mood" dari pagi hingga malam.',
      },
    ],
    whatsappNumber: '6281234567890',
    address: 'Container Mini Bar Ungu — Jl. Raya Utama (Silakan sesuaikan alamat lengkap Anda di Mode Edit)',
    operatingHours: 'Setiap Hari · 10.00 – 22.00 WIB',
    instagramHandle: '@tealang.minibar',
    announcementText: 'Buka Setiap Hari · Pesan Online Langsung Terhubung ke WhatsApp Admin',
  },
  menu: [
    // TEA
    {
      id: 'tea-1',
      name: 'Ice Tea',
      category: 'Tea',
      price: 5000,
      description: 'Teh seduh segar klasik dengan es batu dingin yang melegakan dahaga.',
      available: true,
    },
    {
      id: 'tea-2',
      name: 'Lychee Tea',
      category: 'Tea',
      price: 8000,
      description: 'Perpaduan teh harum dengan sirup leci manis yang segar.',
      available: true,
    },
    {
      id: 'tea-3',
      name: 'Mango Tea',
      category: 'Tea',
      price: 8000,
      description: 'Kesegaran teh dengan aroma dan manis buah mangga tropis.',
      available: true,
    },
    {
      id: 'tea-4',
      name: 'Strawberry Tea',
      category: 'Tea',
      price: 8000,
      description: 'Teh dingin bercita rasa stroberi manis-asam yang ringan.',
      available: true,
    },
    {
      id: 'tea-5',
      name: 'Peach Tea',
      category: 'Tea',
      price: 8000,
      description: 'Seduhan teh pilihan berpadu lembut dengan ekstrak buah persik.',
      available: true,
    },
    {
      id: 'tea-6',
      name: 'Milk Tea',
      category: 'Tea',
      price: 10000,
      description: 'Teh seduh pekat dipadukan dengan susu creamy yang seimbang.',
      available: true,
    },
    {
      id: 'tea-7',
      name: 'Signature Tea Lang',
      category: 'Tea',
      price: 10000,
      description: 'Racikan khas bunga telang ungu-biru alami dengan sentuhan segar andalan mini bar.',
      featured: true,
      available: true,
    },

    // COFFEE
    {
      id: 'coffee-1',
      name: 'Americano',
      category: 'Coffee',
      price: 8000,
      description: 'Espresso murni dengan air dingin atau hangat untuk karakter kopi yang bersih.',
      available: true,
    },
    {
      id: 'coffee-2',
      name: 'Bonbon',
      category: 'Coffee',
      price: 8000,
      description: 'Perpaduan klasik espresso pekat dan lapisan susu kental manis.',
      available: true,
    },
    {
      id: 'coffee-3',
      name: 'Americano Peach',
      category: 'Coffee',
      price: 10000,
      description: 'Sensasi segar Americano berpadu dengan aroma buah persik yang unik.',
      available: true,
    },
    {
      id: 'coffee-4',
      name: 'Es Kopi Susu',
      category: 'Coffee',
      price: 10000,
      description: 'Favorit harian: espresso pilihan, susu segar, dan manis gula aren yang pas.',
      featured: true,
      available: true,
    },
    {
      id: 'coffee-5',
      name: 'Vietnam Drip',
      category: 'Coffee',
      price: 10000,
      description: 'Seduhan perlahan ala phin Vietnam dengan susu kental manis yang rich.',
      available: true,
    },
    {
      id: 'coffee-6',
      name: 'Kopi Cham',
      category: 'Coffee',
      price: 12000,
      description: 'Kombinasi unik antara kopi aromatik, teh pekat, dan susu creamy.',
      featured: true,
      available: true,
    },
    {
      id: 'coffee-7',
      name: 'Coco Latte',
      category: 'Coffee',
      price: 12000,
      description: 'Espresso lembut bertemu kesegaran kelapa dan susu yang gurih.',
      available: true,
    },
    {
      id: 'coffee-8',
      name: 'Matcha Presso',
      category: 'Coffee',
      price: 12000,
      description: 'Perpaduan dua karakter kuat: Japanese matcha earthy dan shot espresso.',
      available: true,
    },
    {
      id: 'coffee-9',
      name: 'Mocha',
      category: 'Coffee',
      price: 12000,
      description: 'Harmoni cokelat pekat, espresso, dan susu lembut.',
      available: true,
    },

    // LOCAL COFFEE
    {
      id: 'local-1',
      name: 'Kopi Tubruk Sumawe',
      category: 'Local Coffee',
      price: 5000,
      description: 'Seduhan kopi bubuk lokal Sumawe yang autentik, bold, dan beraroma kuat.',
      featured: true,
      available: true,
    },
    {
      id: 'local-2',
      name: 'Kopi Tubruk Susu',
      category: 'Local Coffee',
      price: 8000,
      description: 'Kopi tubruk tradisional Sumawe dengan tambahan susu manis yang lembut.',
      available: true,
    },

    // MILK BASED
    {
      id: 'milk-1',
      name: 'Funtastic Choco',
      category: 'Milk Based',
      price: 12000,
      description: 'Minuman cokelat creamy non-kopi dengan rasa manis yang pas dan nikmat.',
      available: true,
    },
    {
      id: 'milk-2',
      name: 'Japanese Matcha',
      category: 'Milk Based',
      price: 12000,
      description: 'Matcha Jepang otentik berpadu susu dingin yang halus dan menenangkan.',
      available: true,
    },
    {
      id: 'milk-3',
      name: 'Matcha Nagasaki',
      category: 'Milk Based',
      price: 15000,
      description: 'Racikan matcha spesial dengan profil rasa lebih rich dan tekstur lebih creamy.',
      featured: true,
      available: true,
    },
    {
      id: 'milk-4',
      name: 'Pink Choco',
      category: 'Milk Based',
      price: 15000,
      description: 'Paduan manis cokelat dan sentuhan beri merah muda yang lembut.',
      available: true,
    },
    {
      id: 'milk-5',
      name: 'Pinkberry Milk',
      category: 'Milk Based',
      price: 15000,
      description: 'Susu segar creamy dengan rasa beri pink yang manis dan menyegarkan.',
      available: true,
    },
  ],
  addOns: [
    {
      id: 'addon-ice',
      name: 'Extra Ice',
      price: 1000,
      available: true,
    },
    {
      id: 'addon-espresso',
      name: 'One Shot Espresso',
      price: 4000,
      available: true,
    },
  ],
};

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function formatShortK(amount: number): string {
  if (amount >= 1000 && amount % 1000 === 0) {
    return `${amount / 1000}K`;
  }
  return formatRupiah(amount);
}
