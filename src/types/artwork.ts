export type ArtworkStatus = 'disponible' | 'reserve' | 'vendu';

export type ArtworkCategory =
  | 'Série Sahel'
  | 'Abstractions Africaines'
  | 'Lueurs & Or'
  | 'Portraits & Mémoires'
  | 'Rituels Contemporains'
  | string;

export type FrameOption = 'Sans cadre' | 'Caisse américaine noire' | 'Caisse américaine chêne naturel' | 'Caisse américaine dorée';

export interface Artwork {
  id: string;
  title: string;
  technique: string; // e.g. "Huile et pigments naturels sur toile de lin"
  dimensions: string; // e.g. "120 x 100 cm"
  year: number;
  category: ArtworkCategory;
  priceEUR: number;
  priceFCFA: number;
  imageUrl: string;
  secondaryImages?: string[];
  status: ArtworkStatus;
  isFeatured?: boolean;
  description: string;
  inspiration?: string;
  inventoryNumber: string; // e.g. "BAN-2026-004"
  certificateIncluded: boolean;
  weightKg?: number;
  location?: string; // e.g. "Atelier Banora, Dakar"
  createdAt: string;
}

export interface OrderItem {
  artworkId: string;
  title: string;
  priceEUR: number;
  priceFCFA: number;
  imageUrl: string;
  frame: FrameOption;
  frameCostEUR: number;
  frameCostFCFA: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryCountry: string;
  paymentMethod: 'carte' | 'virement' | 'mobile_money' | 'galerie';
  currency: 'EUR' | 'XOF';
  items: OrderItem[];
  totalEUR: number;
  totalFCFA: number;
  status: 'en_attente' | 'confirmee' | 'en_cours_expedition' | 'livree' | 'annulee';
  notes?: string;
}

export interface ClientInquiry {
  id: string;
  date: string;
  artworkId?: string;
  artworkTitle?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isCommission: boolean;
  status: 'nouveau' | 'repondu' | 'archive';
  photoUrl?: string;
  photoName?: string;
}

export interface ArtistProfile {
  name: string;
  title: string;
  bio: string;
  philosophy: string;
  avatarUrl: string;
  studioImageUrl?: string;
  studioAddress: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  exhibitions: {
    year: number;
    title: string;
    gallery: string;
    location: string;
  }[];
}

export interface Testimonial {
  id: string;
  authorName: string;
  roleOrCity: string;
  artworkAcquired?: string;
  rating: number;
  date: string;
  content: string;
  verifiedPurchase: boolean;
  avatarUrl?: string;
}
