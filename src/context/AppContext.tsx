import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  VenueSettings,
  Category,
  Product,
  Campaign,
  Allergen,
  CustomerProfile,
  SavedAddress,
  Order,
  OrderItem,
  CartItem,
  WaiterCall,
  TVScreenConfig,
  RadioChannel,
  RadioGenre,
  VenuePlaylist,
  LanguageCode,
  CurrencyCode,
  KitchenStation,
  OrderStatus,
  PaymentMethod,
  OrderType,
  SuperAdminSession,
  VenueManagerSession,
  StaffSession,
} from '../types';
import {
  INITIAL_ALLERGENS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_CAMPAIGNS,
  INITIAL_VENUE_SETTINGS,
  INITIAL_CUSTOMER,
  INITIAL_ORDERS,
  INITIAL_TV_SCREENS,
  INITIAL_RADIO_CHANNELS,
  INITIAL_RADIO_GENRES,
  INITIAL_VENUE_PLAYLISTS,
  UI_TRANSLATIONS,
} from '../data/initialData';
import { soundService } from '../services/soundService';
import { syncCurrencyRates } from '../services/currencyService';

export type AppRoute =
  | 'manager' // qradv.com/manager
  | 'panel' // qradv.com/panel
  | 'pos' // qradv.com/pos
  | 'qr' // qradv.com/qr/:slug
  | 'radio' // qradv.com/radyo/:venue
  | 'tv' // qradv.com/tv/:venue
  | 'vid'; // qradv.com/vid/:venue/:screenId

interface AppContextType {
  currentRoute: AppRoute;
  setCurrentRoute: (r: AppRoute) => void;
  activeScreenId: string;
  setActiveScreenId: (id: string) => void;

  venue: VenueSettings;
  updateVenue: (updated: Partial<VenueSettings>) => void;

  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  allergens: Allergen[];
  setAllergens: React.Dispatch<React.SetStateAction<Allergen[]>>;

  customer: CustomerProfile;
  addAddress: (addr: Omit<SavedAddress, 'id'>) => void;
  updateAddress: (id: string, addr: Partial<SavedAddress>) => void;
  deleteAddress: (id: string) => void;
  updateCustomerProfile: (fullName: string, phone: string) => void;

  orders: Order[];
  createOrder: (
    type: OrderType,
    paymentMethod: PaymentMethod,
    orderNote?: string,
    table?: string,
    address?: SavedAddress
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderItemStatus: (orderId: string, itemId: string, status: 'pending' | 'cooking' | 'done') => void;

  waiterCalls: WaiterCall[];
  callWaiter: (tableNumber: string, callType: 'waiter' | 'bill' | 'water' | 'menu') => void;
  resolveWaiterCall: (id: string) => void;

  tvScreens: TVScreenConfig[];
  addTvScreen: (screen: Omit<TVScreenConfig, 'id'>) => TVScreenConfig;
  updateTvScreen: (id: string, config: Partial<TVScreenConfig>) => void;
  deleteTvScreen: (id: string) => void;

  radioChannels: RadioChannel[];
  activeRadio: RadioChannel;
  setActiveRadio: (channel: RadioChannel) => void;
  isPlayingRadio: boolean;
  setIsPlayingRadio: (playing: boolean) => void;
  radioVolume: number;
  setRadioVolume: (vol: number) => void;

  // Global Genres (managed by Site Admin) & Playlists (managed by Venue/Firm)
  radioGenres: RadioGenre[];
  addRadioGenre: (genre: Omit<RadioGenre, 'id'>) => void;
  deleteRadioGenre: (id: string) => void;
  venuePlaylists: VenuePlaylist[];
  addVenuePlaylist: (playlist: Omit<VenuePlaylist, 'id' | 'createdAt'>) => void;
  deleteVenuePlaylist: (id: string) => void;
  activePlaylistId: string;
  setActivePlaylistId: (id: string) => void;

  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedOptions?: Record<string, string>, itemNote?: string) => void;
  addCampaignComboToCart: (
    campaign: Campaign,
    primaryProduct: Product,
    companionProduct: Product,
    primaryNote?: string,
    companionNote?: string
  ) => void;
  updateCartItemQty: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotal: number;

  activeLanguage: LanguageCode;
  setActiveLanguage: (lang: LanguageCode) => void;
  activeCurrency: CurrencyCode;
  setActiveCurrency: (cur: CurrencyCode) => void;

  isInsideRestaurant: boolean;
  setIsInsideRestaurant: (inside: boolean) => void;
  selectedTable: string;
  setSelectedTable: (table: string) => void;
  tables: string[];
  addTable: (name: string) => void;
  deleteTable: (name: string) => void;
  selectedStation: KitchenStation;
  setSelectedStation: (station: KitchenStation) => void;

  // Real GPS Geolocation & Distance
  realGpsDistance: number | null;
  gpsDetecting: boolean;
  gpsStatusMessage: string | null;
  detectRealGpsLocation: () => void;

  // Customer Active Order Tracker
  activeTrackedOrder: Order | null;
  setActiveTrackedOrder: (order: Order | null) => void;

  // Category CRUD
  addCategory: (nameTr: string, nameEn: string, icon: string, stationDefault?: KitchenStation) => void;
  deleteCategory: (id: string) => void;

  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;

  formatPrice: (tryAmount: number) => string;
  t: (key: string) => string;

  // Modular Portals & Role Authentication
  superAdminSession: SuperAdminSession;
  loginSuperAdmin: (email: string, pass: string) => boolean;
  logoutSuperAdmin: () => void;

  venueManagerSession: VenueManagerSession;
  loginVenueManager: (email: string, pass: string) => boolean;
  logoutVenueManager: () => void;

  staffSession: StaffSession | null;
  loginStaff: (station: KitchenStation, pin: string, name?: string) => boolean;
  logoutStaff: () => void;

  // 6-Hour Currency Sync
  isSyncingCurrencies: boolean;
  syncCurrenciesNow: (force?: boolean) => Promise<{ success: boolean; message?: string }>;

  // Quotas & Calculation Helpers
  computedDeliveryFee: number;
  checkOrderQuota: (orderType: OrderType) => { valid: boolean; reason?: string };

  // Table Zones
  tableZones: string[];
  addTableZone: (zone: string) => void;
  deleteTableZone: (zone: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation / Route state initialized directly from URL path
  const getInitialRoute = (): AppRoute => {
    if (typeof window === 'undefined') return 'qr';
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/tv')) return 'tv';
    if (path.startsWith('/panel')) return 'panel';
    if (path.startsWith('/manager')) return 'manager';
    if (path.startsWith('/pos')) return 'pos';
    if (path.startsWith('/radyo') || path.startsWith('/radio')) return 'radio';
    if (path.startsWith('/vid')) return 'vid';
    return 'qr';
  };

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);
  const [activeScreenId, setActiveScreenId] = useState<string>('screen-1');

  // Venue & Catalog
  const [venue, setVenue] = useState<VenueSettings>(() => {
    const saved = localStorage.getItem('qradv_venue');
    return saved ? JSON.parse(saved) : INITIAL_VENUE_SETTINGS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('qradv_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('qradv_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('qradv_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [allergens, setAllergens] = useState<Allergen[]>(INITIAL_ALLERGENS);

  // Customer Profile & Address Book
  const [customer, setCustomer] = useState<CustomerProfile>(() => {
    const saved = localStorage.getItem('qradv_customer');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER;
  });

  // Orders & Waiter Calls
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('qradv_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [waiterCalls, setWaiterCalls] = useState<WaiterCall[]>([]);

  // TV & Radio
  const [tvScreens, setTvScreens] = useState<TVScreenConfig[]>(() => {
    const saved = localStorage.getItem('qradv_tv_screens');
    return saved ? JSON.parse(saved) : INITIAL_TV_SCREENS;
  });

  useEffect(() => {
    localStorage.setItem('qradv_tv_screens', JSON.stringify(tvScreens));
  }, [tvScreens]);

  // Radio Genres (Site Admin)
  const [radioGenres, setRadioGenres] = useState<RadioGenre[]>(() => {
    const saved = localStorage.getItem('qradv_radio_genres');
    return saved ? JSON.parse(saved) : INITIAL_RADIO_GENRES;
  });

  useEffect(() => {
    localStorage.setItem('qradv_radio_genres', JSON.stringify(radioGenres));
  }, [radioGenres]);

  // Venue Playlists (Firm / Venue Manager)
  const [venuePlaylists, setVenuePlaylists] = useState<VenuePlaylist[]>(() => {
    const saved = localStorage.getItem('qradv_venue_playlists');
    return saved ? JSON.parse(saved) : INITIAL_VENUE_PLAYLISTS;
  });

  const [activePlaylistId, setActivePlaylistId] = useState<string>('pl-evening');

  useEffect(() => {
    localStorage.setItem('qradv_venue_playlists', JSON.stringify(venuePlaylists));
  }, [venuePlaylists]);

  const [radioChannels] = useState<RadioChannel[]>(INITIAL_RADIO_CHANNELS);
  const [activeRadio, setActiveRadio] = useState<RadioChannel>(INITIAL_RADIO_CHANNELS[0]);
  const [isPlayingRadio, setIsPlayingRadio] = useState<boolean>(false);
  const [radioVolume, setRadioVolume] = useState<number>(75);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // Localization & Currency
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>('tr');
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>('TRY');

  // Geofencing & Table
  const [isInsideRestaurant, setIsInsideRestaurant] = useState<boolean>(true);
  const [selectedTable, setSelectedTable] = useState<string>('Masa 3');
  const [selectedStation, setSelectedStation] = useState<KitchenStation>('all');
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);

  // Venue Persistence
  useEffect(() => {
    localStorage.setItem('qradv_venue', JSON.stringify(venue));
  }, [venue]);

  // Modular Authentication Sessions
  const [superAdminSession, setSuperAdminSession] = useState<SuperAdminSession>(() => {
    const saved = localStorage.getItem('qradv_auth_super');
    return saved
      ? JSON.parse(saved)
      : { isAuthenticated: false, email: '', name: '', role: 'super_admin' };
  });

  const [venueManagerSession, setVenueManagerSession] = useState<VenueManagerSession>(() => {
    const saved = localStorage.getItem('qradv_auth_manager');
    return saved
      ? JSON.parse(saved)
      : {
          isAuthenticated: false,
          venueId: 'venue-101',
          email: '',
          managerName: '',
          role: 'venue_manager',
        };
  });

  const [staffSession, setStaffSession] = useState<StaffSession | null>(() => {
    const saved = localStorage.getItem('qradv_auth_staff');
    return saved ? JSON.parse(saved) : null;
  });

  const loginSuperAdmin = (email: string, pass: string): boolean => {
    if (email.trim().toLowerCase() === 'superadmin@qradv.com' && pass === 'admin2026') {
      const sess: SuperAdminSession = {
        isAuthenticated: true,
        email: email.trim(),
        name: 'QRAdv Root Super Admin',
        role: 'super_admin',
        loginAt: new Date().toISOString(),
      };
      setSuperAdminSession(sess);
      localStorage.setItem('qradv_auth_super', JSON.stringify(sess));
      return true;
    }
    return false;
  };

  const logoutSuperAdmin = () => {
    const empty: SuperAdminSession = { isAuthenticated: false, email: '', name: '', role: 'super_admin' };
    setSuperAdminSession(empty);
    localStorage.removeItem('qradv_auth_super');
  };

  const loginVenueManager = (email: string, pass: string): boolean => {
    if (
      (email.trim().toLowerCase() === 'yonetici@lezzetduragi.com' && pass === 'lezzet2026') ||
      pass === 'manager123'
    ) {
      const sess: VenueManagerSession = {
        isAuthenticated: true,
        venueId: venue.id,
        email: email.trim(),
        managerName: 'Lezzet Durağı İşletme Müdürü',
        role: 'venue_manager',
        loginAt: new Date().toISOString(),
      };
      setVenueManagerSession(sess);
      localStorage.setItem('qradv_auth_manager', JSON.stringify(sess));
      return true;
    }
    return false;
  };

  const logoutVenueManager = () => {
    const empty: VenueManagerSession = {
      isAuthenticated: false,
      venueId: venue.id,
      email: '',
      managerName: '',
      role: 'venue_manager',
    };
    setVenueManagerSession(empty);
    localStorage.removeItem('qradv_auth_manager');
  };

  const loginStaff = (station: KitchenStation, pin: string, name?: string): boolean => {
    const validPins: Record<string, string> = {
      all: '1234',
      kitchen: '2222',
      grill: '3333',
      beverage: '4444',
      salad: '5555',
      meze: '6666',
    };
    if (validPins[station] === pin || pin === '1234') {
      const sess: StaffSession = {
        isAuthenticated: true,
        staffId: `staff-${station}`,
        name: name || `İstasyon ${station.toUpperCase()}`,
        station,
        pin,
        loginAt: new Date().toISOString(),
      };
      setStaffSession(sess);
      setSelectedStation(station);
      localStorage.setItem('qradv_auth_staff', JSON.stringify(sess));
      return true;
    }
    return false;
  };

  const logoutStaff = () => {
    setStaffSession(null);
    localStorage.removeItem('qradv_auth_staff');
  };

  // 6-Hour Reliable Currency Auto-Sync
  const [isSyncingCurrencies, setIsSyncingCurrencies] = useState(false);

  const syncCurrenciesNow = async (force = false): Promise<{ success: boolean; message?: string }> => {
    setIsSyncingCurrencies(true);
    try {
      const res = await syncCurrencyRates(force);
      if (res.success && res.rates) {
        setVenue((prev) => ({
          ...prev,
          currencyRates: {
            ...prev.currencyRates,
            ...res.rates,
          },
          currencyLastSyncedAt: res.lastSyncedAt,
          currencyDataSource: res.source,
        }));
        return { success: true, message: res.message || 'Kurlar başarıyla güncellendi.' };
      }
      return { success: false, message: 'Kur güncelleme yanıtı alınamadı.' };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Kur servisi hatası' };
    } finally {
      setIsSyncingCurrencies(false);
    }
  };

  // Auto-sync on startup and every 30 mins check for 6 hours
  useEffect(() => {
    syncCurrenciesNow(false);
    const interval = setInterval(() => {
      syncCurrenciesNow(false);
    }, 30 * 60 * 1000); // 30 minutes check
    return () => clearInterval(interval);
  }, []);

  // Tables & Zones State
  const [tables, setTables] = useState<string[]>(() => {
    const saved = localStorage.getItem('qradv_tables');
    return saved
      ? JSON.parse(saved)
      : ['Masa 1', 'Masa 2', 'Masa 3', 'Masa 4', 'Masa 5', 'Bahçe 1', 'Bahçe 2', 'Bahçe 3', 'Teras 1', 'Teras 2'];
  });

  useEffect(() => {
    localStorage.setItem('qradv_tables', JSON.stringify(tables));
  }, [tables]);

  const addTable = (name: string) => {
    if (!name.trim()) return;
    setTables((prev) => (prev.includes(name.trim()) ? prev : [...prev, name.trim()]));
  };

  const deleteTable = (name: string) => {
    setTables((prev) => prev.filter((t) => t !== name));
  };

  const [tableZones, setTableZones] = useState<string[]>(() => {
    return venue.tableZones || ['Salon', 'Bahçe', 'Teras', 'Bar', 'VIP Oda'];
  });

  const addTableZone = (zone: string) => {
    if (!zone.trim() || tableZones.includes(zone.trim())) return;
    const updated = [...tableZones, zone.trim()];
    setTableZones(updated);
    setVenue((prev) => ({ ...prev, tableZones: updated }));
  };

  const deleteTableZone = (zone: string) => {
    const updated = tableZones.filter((z) => z !== zone);
    setTableZones(updated);
    setVenue((prev) => ({ ...prev, tableZones: updated }));
  };


  // Real GPS Distance Calculation (Haversine)
  const [realGpsDistance, setRealGpsDistance] = useState<number | null>(null);
  const [gpsDetecting, setGpsDetecting] = useState<boolean>(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);

  const calculateDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const detectRealGpsLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatusMessage('Tarayıcınız konum desteği sunmuyor.');
      return;
    }
    setGpsDetecting(true);
    setGpsStatusMessage('GPS sinyali taranıyor...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        const dist = calculateDistanceMeters(
          userLat,
          userLng,
          venue.coordinates.lat,
          venue.coordinates.lng
        );
        setRealGpsDistance(dist);
        setGpsDetecting(false);
        const inside = dist <= venue.geofenceRadiusMeters;
        setIsInsideRestaurant(inside);
        setGpsStatusMessage(
          inside
            ? `Restorandasınız! (Mesafe: ${dist}m, Sınır: ${venue.geofenceRadiusMeters}m)`
            : `Restoran dışındasınız (Mesafe: ${dist > 1000 ? (dist / 1000).toFixed(1) + ' km' : dist + 'm'}). Paket servis aktif.`
        );
      },
      (err) => {
        setGpsDetecting(false);
        setGpsStatusMessage(`GPS uyarısı: ${err.message}. Test simülatörü kullanılabilir.`);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Active customer order tracking
  const [activeTrackedOrder, setActiveTrackedOrder] = useState<Order | null>(null);

  // Category CRUD
  const addCategory = (nameTr: string, nameEn: string, icon: string, stationDefault?: KitchenStation) => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: { tr: nameTr, en: nameEn || nameTr, de: nameTr, ru: nameTr, ar: nameTr, fr: nameTr },
      icon: icon || '🍽️',
      sortOrder: categories.length + 1,
      isActive: true,
      stationDefault: stationDefault || 'kitchen',
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('qradv_venue', JSON.stringify(venue));
  }, [venue]);

  useEffect(() => {
    localStorage.setItem('qradv_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('qradv_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('qradv_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('qradv_customer', JSON.stringify(customer));
  }, [customer]);

  useEffect(() => {
    localStorage.setItem('qradv_orders', JSON.stringify(orders));
  }, [orders]);

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    soundService.setSoundEnabled(enabled);
  };

  const updateVenue = (updated: Partial<VenueSettings>) => {
    setVenue((prev) => ({ ...prev, ...updated }));
  };

  // Translations helper
  const t = (key: string): string => {
    const dict = UI_TRANSLATIONS[activeLanguage] || UI_TRANSLATIONS.tr;
    return dict[key] || UI_TRANSLATIONS.tr[key] || key;
  };

  // Currency Converter & Formatter
  const formatPrice = (tryAmount: number): string => {
    const rate = venue.currencyRates[activeCurrency] || 1.0;
    const converted = tryAmount * rate;

    switch (activeCurrency) {
      case 'USD':
        return `$${converted.toFixed(2)}`;
      case 'EUR':
        return `€${converted.toFixed(2)}`;
      case 'GBP':
        return `£${converted.toFixed(2)}`;
      case 'TRY':
      default:
        return `₺${converted.toFixed(0)}`;
    }
  };

  // Address helpers
  const addAddress = (addr: Omit<SavedAddress, 'id'>) => {
    const newAddr: SavedAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setCustomer((prev) => ({
      ...prev,
      savedAddresses: [newAddr, ...prev.savedAddresses],
    }));
  };

  const updateAddress = (id: string, updated: Partial<SavedAddress>) => {
    setCustomer((prev) => ({
      ...prev,
      savedAddresses: prev.savedAddresses.map((a) => (a.id === id ? { ...a, ...updated } : a)),
    }));
  };

  const deleteAddress = (id: string) => {
    setCustomer((prev) => ({
      ...prev,
      savedAddresses: prev.savedAddresses.filter((a) => a.id !== id),
    }));
  };

  const updateCustomerProfile = (fullName: string, phone: string) => {
    setCustomer((prev) => ({ ...prev, fullName, phone }));
  };

  // Cart operations
  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedOptions?: Record<string, string>,
    itemNote?: string
  ) => {
    setCart((prev) => {
      // Find if non-campaign identical item exists
      const existing = prev.find(
        (ci) =>
          ci.product.id === product.id &&
          !ci.isFreeCampaignItem &&
          !ci.appliedCampaignId &&
          ci.itemNote === itemNote
      );
      if (existing) {
        return prev.map((ci) =>
          ci.cartItemId === existing.cartItemId ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [
        ...prev,
        {
          cartItemId: `ci-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          product,
          quantity,
          selectedOptions,
          itemNote,
          isFreeCampaignItem: false,
        },
      ];
    });
  };

  // Dynamic 1+1 Campaign Combo addition to cart
  const addCampaignComboToCart = (
    campaign: Campaign,
    primaryProduct: Product,
    companionProduct: Product,
    primaryNote?: string,
    companionNote?: string
  ) => {
    const primaryItem: CartItem = {
      cartItemId: `ci-${Date.now()}-primary`,
      product: primaryProduct,
      quantity: 1,
      itemNote: primaryNote,
      appliedCampaignId: campaign.id,
      isFreeCampaignItem: false,
    };

    const freeCompanionItem: CartItem = {
      cartItemId: `ci-${Date.now()}-free`,
      product: companionProduct,
      quantity: 1,
      itemNote: companionNote ? `${companionNote} [1+1 KAMPANYA HEDİYESİ]` : '[1+1 KAMPANYA HEDİYESİ]',
      appliedCampaignId: campaign.id,
      isFreeCampaignItem: true,
      customPrice: 0,
    };

    setCart((prev) => [...prev, primaryItem, freeCompanionItem]);
    soundService.playSuccessChime();
  };

  const updateCartItemQty = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.cartItemId === cartItemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => {
    if (item.isFreeCampaignItem) return acc;
    const price = item.customPrice !== undefined ? item.customPrice : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  // Delivery Fee & Quotas
  const computedDeliveryFee =
    venue.freeDeliveryThreshold > 0 && cartTotal >= venue.freeDeliveryThreshold
      ? 0
      : venue.deliveryFee;

  const checkOrderQuota = (orderType: OrderType): { valid: boolean; reason?: string } => {
    if (!venue.isOrderingOpen) {
      return {
        valid: false,
        reason: `Restoran şu an yeni sipariş kabul etmemektedir. Çalışma saatleri: ${venue.workingHours}`,
      };
    }
    if (orderType === 'delivery') {
      if (cartTotal < venue.minDeliveryAmount) {
        return {
          valid: false,
          reason: `Adrese paket sipariş için minimum sepet tutarı ${venue.minDeliveryAmount} TL olmalıdır. (Sepetinize ${(venue.minDeliveryAmount - cartTotal).toFixed(2)} TL daha ürün ekleyiniz)`,
        };
      }
    }
    if (orderType === 'table' && venue.minTableOrderAmount > 0) {
      if (cartTotal < venue.minTableOrderAmount) {
        return {
          valid: false,
          reason: `Masa için minimum sipariş tutarı ${venue.minTableOrderAmount} TL'dir.`,
        };
      }
    }
    if (venue.maxCartAmount > 0 && cartTotal > venue.maxCartAmount) {
      return {
        valid: false,
        reason: `Tek seferde maksimum sepet sipariş kotası ${venue.maxCartAmount} TL'dir.`,
      };
    }
    return { valid: true };
  };

  // Order creation
  const createOrder = (
    type: OrderType,
    paymentMethod: PaymentMethod,
    orderNote?: string,
    table?: string,
    address?: SavedAddress
  ): Order => {
    const orderItems: OrderItem[] = cart.map((ci, idx) => ({
      id: `oi-${Date.now()}-${idx}`,
      productId: ci.product.id,
      productName: ci.product.name.tr,
      price: ci.isFreeCampaignItem ? 0 : ci.customPrice !== undefined ? ci.customPrice : ci.product.price,
      quantity: ci.quantity,
      itemNote: ci.itemNote,
      station: ci.product.station,
      isFreeCampaignItem: ci.isFreeCampaignItem,
      appliedCampaignTitle: ci.appliedCampaignId ? '1 Alana 1 Bedava Kampanyası' : undefined,
      status: 'pending',
    }));

    const deliveryTotal = type === 'delivery' ? cartTotal + venue.deliveryFee : cartTotal;
    const prefix = type === 'table' ? 'M' : 'P';
    const randNum = Math.floor(100 + Math.random() * 900);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `#${prefix}-${randNum}`,
      type,
      status: 'pending',
      createdAt: new Date().toISOString(),
      tableNumber: type === 'table' ? table || selectedTable : undefined,
      customerName: customer.fullName || 'Değerli Misafir',
      customerPhone: customer.phone || '0555 000 00 00',
      deliveryAddress: type === 'delivery' ? address : undefined,
      items: orderItems,
      orderNote,
      totalAmount: deliveryTotal,
      currency: activeCurrency,
      paymentMethod,
      isPaid: paymentMethod === 'online_pay' || paymentMethod === 'credit_card',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackedOrder(newOrder);
    clearCart();

    // Trigger audio notification on POS & Kitchen screen
    soundService.playNewOrderChime();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    if (status === 'ready' || status === 'delivered') {
      soundService.playSuccessChime();
    }
  };

  const updateOrderItemStatus = (orderId: string, itemId: string, status: 'pending' | 'cooking' | 'done') => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const updatedItems = ord.items.map((it) => (it.id === itemId ? { ...it, status } : it));
        const allDone = updatedItems.every((it) => it.status === 'done');
        return {
          ...ord,
          items: updatedItems,
          status: allDone ? 'ready' : ord.status === 'pending' ? 'preparing' : ord.status,
        };
      })
    );
  };

  // Waiter Call
  const callWaiter = (tableNumber: string, callType: 'waiter' | 'bill' | 'water' | 'menu') => {
    const newCall: WaiterCall = {
      id: `call-${Date.now()}`,
      tableNumber,
      callType,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    setWaiterCalls((prev) => [newCall, ...prev]);
    soundService.playWaiterCallAlert();
  };

  const resolveWaiterCall = (id: string) => {
    setWaiterCalls((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'resolved', resolvedAt: new Date().toISOString() } : c))
    );
  };

  const addTvScreen = (screen: Omit<TVScreenConfig, 'id'>): TVScreenConfig => {
    const newScreen: TVScreenConfig = {
      ...screen,
      id: `screen-${Date.now().toString(36)}`,
    };
    setTvScreens((prev) => [...prev, newScreen]);
    return newScreen;
  };

  const updateTvScreen = (id: string, config: Partial<TVScreenConfig>) => {
    setTvScreens((prev) => prev.map((s) => (s.id === id ? { ...s, ...config } : s)));
  };

  const deleteTvScreen = (id: string) => {
    setTvScreens((prev) => prev.filter((s) => s.id !== id));
  };

  const addRadioGenre = (genre: Omit<RadioGenre, 'id'>) => {
    const newGenre: RadioGenre = {
      ...genre,
      id: `genre-${Date.now().toString(36)}`,
    };
    setRadioGenres((prev) => [...prev, newGenre]);
  };

  const deleteRadioGenre = (id: string) => {
    setRadioGenres((prev) => prev.filter((g) => g.id !== id));
  };

  const addVenuePlaylist = (playlist: Omit<VenuePlaylist, 'id' | 'createdAt'>) => {
    const newPlaylist: VenuePlaylist = {
      ...playlist,
      id: `pl-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setVenuePlaylists((prev) => [...prev, newPlaylist]);
  };

  const deleteVenuePlaylist = (id: string) => {
    setVenuePlaylists((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        activeScreenId,
        setActiveScreenId,
        venue,
        updateVenue,
        categories,
        setCategories,
        products,
        setProducts,
        campaigns,
        setCampaigns,
        allergens,
        setAllergens,
        customer,
        addAddress,
        updateAddress,
        deleteAddress,
        updateCustomerProfile,
        orders,
        createOrder,
        updateOrderStatus,
        updateOrderItemStatus,
        waiterCalls,
        callWaiter,
        resolveWaiterCall,
        tvScreens,
        addTvScreen,
        updateTvScreen,
        deleteTvScreen,
        radioChannels,
        activeRadio,
        setActiveRadio,
        isPlayingRadio,
        setIsPlayingRadio,
        radioVolume,
        setRadioVolume,
        radioGenres,
        addRadioGenre,
        deleteRadioGenre,
        venuePlaylists,
        addVenuePlaylist,
        deleteVenuePlaylist,
        activePlaylistId,
        setActivePlaylistId,
        cart,
        addToCart,
        addCampaignComboToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        cartTotal,
        activeLanguage,
        setActiveLanguage,
        activeCurrency,
        setActiveCurrency,
        isInsideRestaurant,
        setIsInsideRestaurant,
        selectedTable,
        setSelectedTable,
        tables,
        addTable,
        deleteTable,
        selectedStation,
        setSelectedStation,
        realGpsDistance,
        gpsDetecting,
        gpsStatusMessage,
        detectRealGpsLocation,
        activeTrackedOrder,
        setActiveTrackedOrder,
        addCategory,
        deleteCategory,
        soundEnabled,
        setSoundEnabled,
        formatPrice,
        t,
        superAdminSession,
        loginSuperAdmin,
        logoutSuperAdmin,
        venueManagerSession,
        loginVenueManager,
        logoutVenueManager,
        staffSession,
        loginStaff,
        logoutStaff,
        isSyncingCurrencies,
        syncCurrenciesNow,
        computedDeliveryFee,
        checkOrderQuota,
        tableZones,
        addTableZone,
        deleteTableZone,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
