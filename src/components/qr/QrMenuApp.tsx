import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Campaign } from '../../types';
import { CampaignModal } from './CampaignModal';
import { CartDrawer } from './CartDrawer';
import { WaiterCallModal } from './WaiterCallModal';
import { ProductDetailModal } from './ProductDetailModal';
import { OrderTrackingModal } from './OrderTrackingModal';
import {
  Search,
  Sparkles,
  ShoppingBag,
  Bell,
  MapPin,
  Plus,
  Flame,
  Clock,
  Filter,
  Info,
  Gift,
  CheckCircle2,
} from 'lucide-react';

export const QrMenuApp: React.FC = () => {
  const {
    venue,
    categories,
    products,
    campaigns,
    allergens,
    cart,
    cartTotal,
    formatPrice,
    isInsideRestaurant,
    selectedTable,
    addToCart,
    activeLanguage,
    activeTrackedOrder,
  } = useApp();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAllergenFilter, setSelectedAllergenFilter] = useState<string>('all');

  // Modals
  const [activeCampaignModal, setActiveCampaignModal] = useState<Campaign | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWaiterCallOpen, setIsWaiterCallOpen] = useState<boolean>(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState<boolean>(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Active 1+1 campaign
  const primaryCampaign = campaigns.find((c) => c.isActive && c.type === 'buy1_get1_free') || campaigns[0];

  // Filtering products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategoryId !== 'all' && p.categoryId !== selectedCategoryId) {
        return false;
      }
      // Allergen / Diet filter
      if (selectedAllergenFilter !== 'all') {
        if (selectedAllergenFilter === 'vegan' && !p.allergenIds.includes('vegan')) return false;
        if (selectedAllergenFilter === 'vegetarian' && !p.allergenIds.includes('vegetarian')) return false;
        if (selectedAllergenFilter === 'no-gluten' && p.allergenIds.includes('gluten')) return false;
        if (selectedAllergenFilter === 'no-dairy' && p.allergenIds.includes('lactose')) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = (p.name[activeLanguage] || p.name.tr).toLowerCase().includes(query);
        const descMatch = (p.description[activeLanguage] || p.description.tr).toLowerCase().includes(query);
        return nameMatch || descMatch;
      }
      return true;
    });
  }, [products, selectedCategoryId, selectedAllergenFilter, searchQuery, activeLanguage]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-28">
      {/* Venue Header Banner */}
      <div className="relative bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-2xl shadow-lg shrink-0">
              {venue.logo || '🥩'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">{venue.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  QR MENÜ
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{venue.tagline}</p>
            </div>
          </div>

          {/* Location Status Pill */}
          <div className="flex items-center gap-2">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                isInsideRestaurant
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {isInsideRestaurant
                  ? `Restorandasınız: ${selectedTable}`
                  : 'Dışarıdasınız: Adrese Teslimat'}
              </span>
            </div>

            {/* Active order tracking button */}
            {activeTrackedOrder && (
              <button
                onClick={() => setIsOrderTrackingOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow-md animate-pulse"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sipariş {activeTrackedOrder.orderNumber} (Canlı Takip)</span>
              </button>
            )}

            {isInsideRestaurant && (
              <button
                onClick={() => setIsWaiterCallOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors shadow-sm"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Garson Çağır</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4 space-y-6">
        {/* Dynamic 1+1 Campaign Hero Card */}
        {primaryCampaign && (
          <div
            onClick={() => setActiveCampaignModal(primaryCampaign)}
            className="group relative rounded-2xl overflow-hidden cursor-pointer border border-amber-500/40 bg-neutral-900 shadow-xl transition-all hover:border-amber-400 hover:shadow-amber-500/10"
          >
            <div className="relative h-44 sm:h-52 w-full overflow-hidden">
              <img
                src={primaryCampaign.bannerImage}
                alt="1+1 Kampanyası"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

              {/* Badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs tracking-wider shadow-lg">
                <Gift className="w-3.5 h-3.5 animate-bounce" />
                <span>{primaryCampaign.badgeText[activeLanguage] || primaryCampaign.badgeText.tr}</span>
              </div>

              {/* Content overlay */}
              <div className="absolute inset-y-0 left-0 p-4 sm:p-6 flex flex-col justify-center max-w-lg">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
                  {primaryCampaign.title[activeLanguage] || primaryCampaign.title.tr}
                </h2>
                <p className="text-xs sm:text-sm text-amber-300 font-semibold mt-1 drop-shadow">
                  {primaryCampaign.subtitle[activeLanguage] || primaryCampaign.subtitle.tr}
                </p>

                <div className="mt-3 inline-flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-neutral-950 font-black text-xs shadow-md transition-all group-hover:bg-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fırsatı Yakala & 0 ₺ Ürünü Seç</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Dietary/Allergen Filters Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Yemek, burger, pizza, içecek veya alerjen ara..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 shadow-inner"
            />
          </div>

          {/* Allergen & Dietary Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3 text-amber-400" />
              Filtre:
            </span>
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'no-gluten', label: '🌾 Glutensiz' },
              { id: 'vegetarian', label: '🥗 Vejetaryen' },
              { id: 'vegan', label: '🥬 Vegan' },
              { id: 'no-dairy', label: '🥛 Süt / Laktozsuz' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedAllergenFilter(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedAllergenFilter === f.id
                    ? 'bg-amber-500 text-neutral-950 border-amber-500 font-bold shadow-sm'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Categories Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedCategoryId('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                selectedCategoryId === 'all'
                  ? 'bg-neutral-100 text-neutral-950 border-neutral-100 shadow-md'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              <span>🍽️</span>
              <span>Tüm Kategoriler ({products.length})</span>
            </button>

            {categories
              .filter((c) => c.isActive)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-md'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name[activeLanguage] || cat.name.tr}</span>
                    <span className="opacity-70 text-[10px]">({count})</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-neutral-100">
              {selectedCategoryId === 'all'
                ? 'Tüm Ürünler'
                : categories.find((c) => c.id === selectedCategoryId)?.name[activeLanguage] || 'Ürünler'}
            </h3>
            <span className="text-xs text-neutral-400">{filteredProducts.length} lezzet listelendi</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-neutral-900 border border-neutral-800 p-6 space-y-2">
              <Info className="w-8 h-8 text-neutral-500 mx-auto" />
              <p className="text-sm font-semibold text-neutral-300">Aramanıza uygun ürün bulunamadı</p>
              <p className="text-xs text-neutral-500">Lütfen filtreleri sıfırlayarak tekrar deneyin.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedAllergenFilter('all');
                  setSelectedCategoryId('all');
                }}
                className="mt-2 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-amber-400"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredProducts.map((product) => {
                const productAllergens = allergens.filter((a) => product.allergenIds.includes(a.id));

                return (
                  <div
                    key={product.id}
                    className="group rounded-2xl bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 overflow-hidden flex flex-col justify-between transition-all hover:shadow-lg"
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => setDetailProduct(product)}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative h-44 w-full bg-neutral-950 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name[activeLanguage] || product.name.tr}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />

                        {product.badge && (
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[10px] shadow-md">
                            {product.badge[activeLanguage] || product.badge.tr}
                          </div>
                        )}

                        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-neutral-300">
                          {product.calories && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-amber-300 font-medium">
                              <Flame className="w-3 h-3 text-amber-400" />
                              {product.calories} kcal
                            </span>
                          )}
                          {product.preparationTime && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-cyan-300 font-medium">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              {product.preparationTime} dk
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-3.5 space-y-1.5">
                        <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                          {product.name[activeLanguage] || product.name.tr}
                        </h4>
                        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                          {product.description[activeLanguage] || product.description.tr}
                        </p>

                        {/* Allergens mini preview */}
                        {productAllergens.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {productAllergens.slice(0, 3).map((a) => (
                              <span
                                key={a.id}
                                className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 flex items-center gap-1"
                                title={a.name[activeLanguage] || a.name.tr}
                              >
                                <span>{a.icon}</span>
                                <span>{a.name[activeLanguage] || a.name.tr}</span>
                              </span>
                            ))}
                            {productAllergens.length > 3 && (
                              <span className="text-[10px] text-neutral-500">
                                +{productAllergens.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price and Add button */}
                    <div className="p-3.5 pt-0 flex items-center justify-between gap-2 border-t border-neutral-800/60 mt-1">
                      <span className="font-black text-base text-amber-400">
                        {formatPrice(product.price)}
                      </span>

                      <button
                        onClick={() => addToCart(product, 1)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors shadow-md"
                        title={isInsideRestaurant ? 'Masaya Sipariş İçin Ekle' : 'Adrese Sipariş İçin Ekle'}
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Sepete At</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Bar for Quick Cart & Waiter Call */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 p-3">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          {/* Garson Çağır (inside venue) */}
          {isInsideRestaurant && (
            <button
              onClick={() => setIsWaiterCallOpen(true)}
              className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 font-bold text-xs flex flex-col items-center justify-center shrink-0 min-w-[70px] shadow-sm transition-colors"
            >
              <Bell className="w-4 h-4 mb-0.5" />
              <span>Garson</span>
            </button>
          )}

          {/* Cart Bar */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-sm flex items-center justify-between shadow-xl transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-md">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </div>
              <span>
                {cart.length === 0 ? 'Sepetiniz Boş' : `${cart.length} Kalem Sipariş`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base font-black">
                {formatPrice(cartTotal)}
              </span>
              <span className="text-xs bg-neutral-950/20 px-2 py-0.5 rounded-lg">
                {isInsideRestaurant ? 'Masaya Gönder' : 'Adrese Gönder'} &rarr;
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Modals */}
      {activeCampaignModal && (
        <CampaignModal
          campaign={activeCampaignModal}
          onClose={() => setActiveCampaignModal(null)}
        />
      )}

      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
        />
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {isWaiterCallOpen && <WaiterCallModal onClose={() => setIsWaiterCallOpen(false)} />}

      {isOrderTrackingOpen && (
        <OrderTrackingModal onClose={() => setIsOrderTrackingOpen(false)} />
      )}
    </div>
  );
};
