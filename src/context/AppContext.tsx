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
  LanguageCode,
  CurrencyCode,
  KitchenStation,
  OrderStatus,
  PaymentMethod,
  OrderType,
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
  UI_TRANSLATIONS,
} from '../data/initialData';
import { soundService } from '../services/soundService';

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
  updateTvScreen: (id: string, config: Partial<TVScreenConfig>) => void;

  radioChannels: RadioChannel[];
  activeRadio: RadioChannel;
  setActiveRadio: (channel: RadioChannel) => void;
  isPlayingRadio: boolean;
  setIsPlayingRadio: (playing: boolean) => void;
  radioVolume: number;
  setRadioVolume: (vol: number) => void;

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation / Route state
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('qr');
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
  const [tvScreens, setTvScreens] = useState<TVScreenConfig[]>(INITIAL_TV_SCREENS);
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

  // Tables State
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

  const updateTvScreen = (id: string, config: Partial<TVScreenConfig>) => {
    setTvScreens((prev) => prev.map((s) => (s.id === id ? { ...s, ...config } : s)));
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
        updateTvScreen,
        radioChannels,
        activeRadio,
        setActiveRadio,
        isPlayingRadio,
        setIsPlayingRadio,
        radioVolume,
        setRadioVolume,
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
