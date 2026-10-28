export type CurrencyCode = 'TRY' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // relative to TRY base (1 TRY = 1.0)
}

export type LanguageCode = 'tr' | 'en' | 'de' | 'ru' | 'ar' | 'fr';

export interface Allergen {
  id: string;
  name: Record<LanguageCode, string>;
  icon: string;
  description: string;
  color: string;
}

export type KitchenStation = 'all' | 'kitchen' | 'grill' | 'beverage' | 'salad' | 'meze';

export interface ProductOption {
  name: Record<LanguageCode, string>;
  choices: {
    name: Record<LanguageCode, string>;
    priceDiff: number;
  }[];
}

export interface Product {
  id: string;
  categoryId: string;
  name: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  price: number; // base price in TRY
  image: string;
  station: KitchenStation;
  allergenIds: string[];
  isAvailable: boolean;
  isPopular?: boolean;
  calories?: number;
  preparationTime?: number; // minutes
  badge?: Record<LanguageCode, string>;
  options?: ProductOption[];
}

export interface Category {
  id: string;
  name: Record<LanguageCode, string>;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  stationDefault?: KitchenStation;
}

export type CampaignType = 'buy1_get1_free' | 'discount_percent' | 'combo_deal' | 'gift_item';

export interface Campaign {
  id: string;
  title: Record<LanguageCode, string>;
  subtitle: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  type: CampaignType;
  primaryProductId: string; // the product to trigger campaign
  companionProductIds?: string[]; // products allowed as free/discounted choice
  discountPercent?: number; // for discount_percent
  badgeText: Record<LanguageCode, string>;
  bannerImage: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  tagColor?: string;
  priceNote?: string;
}

export interface SavedAddress {
  id: string;
  title: string; // e.g. "Evim", "Ofis Levent"
  fullName: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string; // mahalle
  street: string; // sokak
  buildingNo: string; // bina / kapı no
  floor: string; // kat
  apartmentNo: string; // daire no
  addressDirections?: string; // adres tarifi
  isDefault?: boolean;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  phone: string;
  savedAddresses: SavedAddress[];
}

export type OrderType = 'table' | 'delivery' | 'takeaway';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type PaymentMethod = 'credit_card' | 'cash' | 'pos_at_door' | 'sodexo_multinet' | 'online_pay';

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>;
  itemNote?: string;
  isFreeCampaignItem?: boolean;
  appliedCampaignId?: string;
  customPrice?: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  itemNote?: string;
  station: KitchenStation;
  isFreeCampaignItem?: boolean;
  appliedCampaignTitle?: string;
  status: 'pending' | 'cooking' | 'done';
}

export interface Order {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  createdAt: string;
  tableNumber?: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: SavedAddress;
  items: OrderItem[];
  orderNote?: string;
  totalAmount: number;
  currency: CurrencyCode;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  preparedStations?: Record<KitchenStation, boolean>;
}

export interface WaiterCall {
  id: string;
  tableNumber: string;
  callType: 'waiter' | 'bill' | 'water' | 'menu';
  createdAt: string;
  status: 'active' | 'resolved';
  resolvedAt?: string;
  notes?: string;
}

export interface VenueSettings {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  geofenceRadiusMeters: number; // inside radius in meters
  currencyRates: Record<CurrencyCode, number>;
  activeCurrencies: CurrencyCode[];
  defaultCurrency: CurrencyCode;
  defaultLanguage: LanguageCode;
  supportedLanguages: LanguageCode[];
  minDeliveryAmount: number;
  deliveryFee: number;
  wifiName?: string;
  wifiPassword?: string;
  theme: 'midnight' | 'gold' | 'neon' | 'olive' | 'clean';
  flyerTheme: 'modern_dark' | 'bistro_vintage' | 'neon_punch' | 'minimal_white';
}

export interface TVScreenConfig {
  id: string;
  name: string;
  layout: 'campaign_focus' | 'split_menu' | 'ticker_board' | 'video_promo';
  headline: string;
  activeCampaignId?: string;
  featuredCategoryIds: string[];
  tickerMessage: string;
  refreshSeconds: number;
  showQrCode: boolean;
}

export interface RadioChannel {
  id: string;
  name: string;
  genre: string;
  description: string;
  isLive: boolean;
  streamUrl?: string;
  currentTrack: string;
  currentArtist: string;
}
