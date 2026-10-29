import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Tv,
  QrCode,
  Sparkles,
  Maximize2,
  Clock,
  Flame,
  ArrowRight,
  Gift,
  Plus,
  Layers,
  X,
  Check,
  Star,
  Info,
} from 'lucide-react';
import { TVScreenConfig, TVScreenType } from '../../types';

export const MenuBoardTvApp: React.FC = () => {
  const {
    venue,
    campaigns,
    products,
    categories,
    allergens,
    tvScreens,
    activeScreenId,
    setActiveScreenId,
    addTvScreen,
    formatPrice,
  } = useApp();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [clockTime, setClockTime] = useState<string>('');
  const [isAddScreenModalOpen, setIsAddScreenModalOpen] = useState(false);

  // New Screen Form State
  const [newScreenName, setNewScreenName] = useState('');
  const [newScreenType, setNewScreenType] = useState<TVScreenType>('pure_menu');
  const [newSelectedCategories, setNewSelectedCategories] = useState<string[]>([
    'cat-burgers',
    'cat-steaks',
    'cat-pizzas',
  ]);

  const currentScreen: TVScreenConfig =
    tvScreens.find((s) => s.id === activeScreenId) || tvScreens[0] || {
      id: 'screen-1',
      name: 'Varsayılan TV',
      screenType: 'hybrid_campaign',
      layout: 'campaign_focus',
      headline: 'GÜNÜN FIRSATI',
      featuredCategoryIds: ['cat-burgers'],
      tickerMessage: '',
      refreshSeconds: 15,
      showQrCode: true,
    };

  const isPureMenu = currentScreen.screenType === 'pure_menu';

  const activeCampaign =
    campaigns.find((c) => c.id === currentScreen.activeCampaignId) || campaigns[0];

  // Rotate featured products or slides every 8 seconds
  const featuredProducts = products.filter((p) =>
    currentScreen.featuredCategoryIds.includes(p.categoryId)
  );

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(
        now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    if (isPureMenu) return; // Pure menu doesn't need rapid slide flipping
    const slideTimer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % Math.max(1, campaigns.length));
    }, (currentScreen.refreshSeconds || 15) * 1000);
    return () => clearInterval(slideTimer);
  }, [campaigns.length, currentScreen.refreshSeconds, isPureMenu]);

  const displayedCampaign = campaigns[currentSlideIndex] || activeCampaign;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleCreateScreen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScreenName.trim()) return;

    const created = addTvScreen({
      name: newScreenName.trim(),
      screenType: newScreenType,
      layout: newScreenType === 'pure_menu' ? 'split_menu' : 'campaign_focus',
      headline: newScreenName.trim(),
      featuredCategoryIds:
        newSelectedCategories.length > 0 ? newSelectedCategories : [categories[0]?.id || 'cat-burgers'],
      tickerMessage:
        newScreenType === 'pure_menu'
          ? ''
          : `🔥 ${venue.name} Özel Lezzetler Masanızda! • QR Kodu Okutun`,
      refreshSeconds: 25,
      showQrCode: newScreenType !== 'pure_menu',
    });

    setActiveScreenId(created.id);
    setIsAddScreenModalOpen(false);
    setNewScreenName('');
  };

  const toggleCategorySelection = (catId: string) => {
    setNewSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  // Filter categories to display on this pure menu screen
  const screenCategories = categories.filter((c) =>
    currentScreen.featuredCategoryIds.includes(c.id)
  );
  // Fallback to all categories if none configured
  const categoriesToRender = screenCategories.length > 0 ? screenCategories : categories.slice(0, 4);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between overflow-hidden select-none font-sans relative">
      {/* Slow Ambient Aurora Light Sweeps in Background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-amber-500/10 blur-[130px] pointer-events-none animate-tv-aurora" />
      <div
        className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-rose-600/10 blur-[140px] pointer-events-none animate-tv-aurora"
        style={{ animationDelay: '-11s' }}
      />
      <div
        className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-emerald-500/5 blur-[110px] pointer-events-none animate-tv-aurora"
        style={{ animationDelay: '-6s' }}
      />

      {/* Floating Minimal TV Screen Switcher Bar (Discreet, suitable for wall TVs) */}
      <div className="fixed top-3 right-4 z-50 flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-1.5 rounded-2xl shadow-2xl opacity-40 hover:opacity-100 transition-opacity">
        <span className="text-[10px] text-neutral-400 font-mono px-1 font-bold">EKRAN:</span>
        {tvScreens.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveScreenId(s.id)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              activeScreenId === s.id
                ? 'bg-amber-500 text-neutral-950 shadow-md font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {s.name.split('/')[0]}
            {s.screenType === 'pure_menu' && (
              <span className="ml-1 text-[9px] px-1 rounded bg-neutral-800 text-cyan-400">SAF MENÜ</span>
            )}
          </button>
        ))}

        <button
          onClick={() => setIsAddScreenModalOpen(true)}
          className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 transition-colors"
          title="Yeni TV Ekranı Ekle"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
          title="Tam Ekran"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* CASE 1: PURE MENU BOARD (ZERO BANNERS, ZERO HEADERS, ZERO TICKERS)        */}
      {/* ========================================================================= */}
      {isPureMenu ? (
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          {/* Brand Watermark / Minimal Venue Identifier */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-inner">
                {venue.logo || '🥩'}
              </span>
              <div>
                <h1 className="text-xl font-black uppercase tracking-wider text-white">
                  {venue.name}
                </h1>
                <p className="text-xs text-amber-400 font-semibold tracking-wide">
                  GURME MENÜ & SPESİYALLER
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 font-mono text-base font-bold text-neutral-300 bg-neutral-900 px-3.5 py-1.5 rounded-xl border border-neutral-800">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{clockTime}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Responsive Multi-Column Categories Grid */}
          <div
            className={`grid grid-cols-1 ${
              categoriesToRender.length === 1
                ? 'lg:grid-cols-1'
                : categoriesToRender.length === 2
                ? 'lg:grid-cols-2'
                : categoriesToRender.length === 3
                ? 'lg:grid-cols-3'
                : 'lg:grid-cols-4'
            } gap-6 items-stretch flex-1`}
          >
            {categoriesToRender.map((category) => {
              const categoryProducts = products.filter((p) => p.categoryId === category.id);
              // Find most popular / most ordered product in this category (or first one)
              const popularProduct =
                categoryProducts.find((p) => p.isPopular) || categoryProducts[0];
              const otherProducts = categoryProducts.filter((p) => p.id !== popularProduct?.id);

              return (
                <div
                  key={category.id}
                  className="rounded-3xl bg-neutral-900/90 border border-neutral-800/90 p-5 flex flex-col justify-between shadow-2xl relative animate-tv-card-glow backdrop-blur-sm"
                >
                  {/* Category Header */}
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{category.icon}</span>
                        <h2 className="text-base font-black tracking-wider text-amber-400 uppercase">
                          {category.name.tr}
                        </h2>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-neutral-400">
                        {categoryProducts.length} Çeşit
                      </span>
                    </div>

                    {/* ⭐ SPOTLIGHT: EN ÇOK SİPARİŞ EDİLEN / EN POPÜLER ÜRÜN (BÜYÜK RESİM & ALLERJEN) */}
                    {popularProduct && (
                      <div className="mb-4 rounded-2xl bg-neutral-950/90 border border-amber-500/40 p-3.5 space-y-3 relative overflow-hidden shadow-xl">
                        {/* Large Appetizing Picture */}
                        <div className="relative h-44 w-full rounded-xl overflow-hidden bg-neutral-900">
                          <img
                            src={popularProduct.image}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

                          {/* Most Ordered / Star Badge */}
                          <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-neutral-950 font-black text-[11px] shadow-lg">
                            <Star className="w-3 h-3 fill-neutral-950" />
                            <span>EN ÇOK SİPARİŞ EDİLEN</span>
                          </div>

                          {/* Big Price Tag overlay */}
                          <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-xl bg-neutral-950/90 border border-amber-500/50 backdrop-blur font-mono font-black text-amber-400 text-base shadow-2xl animate-tv-price">
                            {formatPrice(popularProduct.price)}
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3 className="font-extrabold text-sm text-white leading-snug">
                            {popularProduct.name.tr}
                          </h3>
                          <p className="text-[11px] text-neutral-300 mt-1 line-clamp-2 leading-relaxed">
                            {popularProduct.description.tr}
                          </p>
                        </div>

                        {/* Allergens, Prep Time & Calories Badges */}
                        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between flex-wrap gap-2 text-[10px]">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-neutral-400 font-semibold">Alerjenler:</span>
                            {popularProduct.allergens && popularProduct.allergens.length > 0 ? (
                              popularProduct.allergens.map((alg) => (
                                <span
                                  key={alg}
                                  className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium"
                                >
                                  {alg}
                                </span>
                              ))
                            ) : (
                              <span className="text-neutral-500 font-mono">-</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 font-mono text-neutral-400">
                            {popularProduct.preparationTime && (
                              <span className="text-cyan-400">~{popularProduct.preparationTime} dk</span>
                            )}
                            {popularProduct.calories && (
                              <span>{popularProduct.calories} kcal</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* OTHER PRODUCTS LIST IN THIS CATEGORY */}
                    <div className="space-y-2">
                      {otherProducts.map((p) => (
                        <div
                          key={p.id}
                          className="p-2.5 rounded-xl bg-neutral-950/60 hover:bg-neutral-950 border border-neutral-800/70 flex items-center justify-between gap-3 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-white truncate">{p.name.tr}</h4>
                            <p className="text-[10px] text-neutral-400 line-clamp-1">
                              {p.description.tr}
                            </p>
                            {p.allergens && p.allergens.length > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                {p.allergens.slice(0, 2).map((a) => (
                                  <span
                                    key={a}
                                    className="text-[9px] px-1 py-0.2 rounded bg-neutral-800 text-neutral-400"
                                  >
                                    {a}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="font-mono font-black text-xs text-amber-400 shrink-0">
                            {formatPrice(p.price)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* CASE 2: HYBRID CAMPAIGN SPOTLIGHT & LIVE TABLE QR SCANNER TV              */
        /* ========================================================================= */
        <>
          {/* Top TV Bar: Venue Brand, Clock & Screen Switcher */}
          <header className="relative z-10 px-6 py-3.5 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-inner">
                {venue.logo || '🥩'}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black tracking-wider uppercase text-white animate-tv-text">
                    {venue.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 tracking-wider shadow">
                    DIGITAL MENUBOARD TV
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-medium">{venue.tagline}</p>
              </div>
            </div>

            {/* Screen Controller & Clock */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-mono text-base font-black text-amber-400 bg-neutral-900/90 px-3.5 py-1.5 rounded-xl border border-neutral-800/80 shadow-inner">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{clockTime}</span>
              </div>
            </div>
          </header>

          {/* Main TV Screen Content (Split View / Hero Campaign Spotlight) */}
          <main className="relative z-10 flex-1 p-6 grid grid-cols-12 gap-6 items-stretch">
            {/* Left Column: Huge 1+1 Dynamic Campaign Hero Card (7 cols) with slow shimmer */}
            <div className="col-span-12 lg:col-span-7 flex flex-col justify-between rounded-3xl overflow-hidden border bg-neutral-900/90 shadow-2xl relative animate-tv-card-glow backdrop-blur-sm">
              <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-neutral-950">
                <img
                  src={displayedCampaign.bannerImage}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-1000 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-rose-500/10 pointer-events-none mix-blend-overlay" />

                {/* Campaign Badge */}
                <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 text-white font-black text-sm tracking-widest shadow-2xl animate-tv-price">
                  <Gift className="w-4 h-4" />
                  <span>{displayedCampaign.badgeText.tr}</span>
                </div>

                <div className="absolute bottom-5 left-6 right-6">
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-xl animate-tv-text">
                    {displayedCampaign.title.tr}
                  </h2>
                  <p className="text-sm sm:text-base text-amber-300 font-bold mt-1.5 drop-shadow">
                    {displayedCampaign.subtitle.tr}
                  </p>
                </div>
              </div>

              {/* Campaign Details & Pricing Callout */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between bg-neutral-900/95">
                <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                  {displayedCampaign.description.tr}
                </p>

                <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/90 flex items-center justify-between shadow-inner">
                  <div>
                    <span className="text-xs text-neutral-400 block font-semibold">
                      Masanızdaki QR Kodu Okutun:
                    </span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      İkinci Ürünü 0 ₺ Ücretsiz Seçin!
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      qradv.com/qr/{venue.slug}
                    </span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Menu Highlights + Live Table QR Scanner (5 cols) */}
            <div className="col-span-12 lg:col-span-5 flex flex-col justify-between gap-4">
              {/* Featured Dishes List */}
              <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800/90 p-5 space-y-3 flex-1 backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                  <span className="text-xs font-black tracking-widest uppercase text-amber-400 flex items-center gap-1.5 animate-tv-text">
                    <Flame className="w-4 h-4 text-orange-400" />
                    ŞEFİN TAVSİYELERİ & GÜNÜN MENÜSÜ
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">Canlı Fiyatlar</span>
                </div>

                <div className="space-y-2.5">
                  {featuredProducts.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-2xl bg-neutral-950/70 hover:bg-neutral-950 border border-neutral-800/80 flex items-center justify-between gap-3 transition-colors duration-300"
                    >
                      <img
                        src={p.image}
                        alt=""
                        className="w-14 h-14 rounded-xl object-cover shrink-0 shadow"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-white truncate">{p.name.tr}</h4>
                        <p className="text-[11px] text-neutral-400 line-clamp-1">{p.description.tr}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {p.calories && (
                            <span className="text-[10px] text-neutral-400">{p.calories} kcal</span>
                          )}
                          {p.preparationTime && (
                            <span className="text-[10px] text-cyan-400 font-mono">
                              ~{p.preparationTime} dk
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="font-black text-sm text-amber-400 shrink-0 font-mono animate-tv-price">
                        {formatPrice(p.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Large Screen QR Code Box */}
              <div className="rounded-3xl bg-gradient-to-r from-neutral-900/90 to-neutral-950 border border-amber-500/30 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider animate-tv-text">
                      TELEFONLA SİPARİŞ VERİN
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white">QR Kodu Kameranızla Okutun</h3>
                  <p className="text-[11px] text-neutral-400">
                    Garson beklemeden sipariş verin veya masanıza hesap isteyin
                  </p>
                  <p className="text-[10px] text-neutral-400 font-mono pt-1">
                    Wi-Fi: <span className="text-white font-bold">{venue.wifiName}</span> (Şifre:{' '}
                    <span className="text-amber-400 font-bold">{venue.wifiPassword}</span>)
                  </p>
                </div>

                {/* QR Mock graphic */}
                <div className="p-3 rounded-2xl bg-white text-black shrink-0 text-center shadow-2xl">
                  <QrCode className="w-20 h-20 text-neutral-950" />
                  <span className="text-[9px] font-mono font-black block mt-1 tracking-wider">
                    SCAN ME
                  </span>
                </div>
              </div>
            </div>
          </main>

          {/* Bottom Continuous Scrolling News / Campaign Ticker Banner with Smooth Slow Silk Glide */}
          <footer className="relative z-10 bg-amber-500 text-neutral-950 font-black text-xs py-2 px-4 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-12 whitespace-nowrap animate-marquee-slow">
              <span>{currentScreen.tickerMessage}</span>
              <span>•</span>
              <span>🥩 1 ALANA 1 BEDAVA GURME BURGER FIRSATINI KAÇIRMAYIN!</span>
              <span>•</span>
              <span>🍹 HAPPY HOUR: 15:00 - 19:00 ARASI TÜM İÇECEKLERDE %50 İNDİRİM!</span>
              <span>•</span>
              <span>📱 AKILLI MENÜ: qradv.com/qr/{venue.slug}</span>
              <span>•</span>
              <span>⚡ GARSON ÇAĞIR / HESAP İSTE / MASAYA SİPARİŞ VER</span>
            </div>
          </footer>
        </>
      )}

      {/* ========================================================================= */}
      {/* MODAL: YENİ TV EKRANI EKLEME PENCERESİ                                    */}
      {/* ========================================================================= */}
      {isAddScreenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base text-white">Yeni Digital Menuboard TV Ekranı</h3>
              </div>
              <button
                onClick={() => setIsAddScreenModalOpen(false)}
                className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateScreen} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Ekran Adı / Konumu
                </label>
                <input
                  type="text"
                  placeholder="Örn: Kasa Arkası Saf Menü Board 3"
                  value={newScreenName}
                  onChange={(e) => setNewScreenName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-amber-500 outline-none"
                />
              </div>

              {/* Screen Type Picker: Pure Menu vs Hybrid */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-2">
                  Ekran Modu / Tipi
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewScreenType('pure_menu')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      newScreenType === 'pure_menu'
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-amber-400">SAF MENÜ BOARD</span>
                      {newScreenType === 'pure_menu' && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-relaxed">
                      Sıfır banner, sıfır alt-üst yazı! Yalnızca kategori ve ürünler, en çok sipariş edilen ürün görseli, alerjen ve fiyatlar.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewScreenType('hybrid_campaign')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      newScreenType === 'hybrid_campaign'
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-white">HİBRİT / KAMPANYALI TV</span>
                      {newScreenType === 'hybrid_campaign' && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-relaxed">
                      1+1 Kampanya bannerı, saat, QR kod ve alt kayan duyuru bandı içeren televizyon yayını.
                    </p>
                  </button>
                </div>
              </div>

              {/* Categories Checklist */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Bu Ekranda Gösterilecek Kategoriler:
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 bg-neutral-950 rounded-xl border border-neutral-800">
                  {categories.map((c) => {
                    const isSelected = newSelectedCategories.includes(c.id);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => toggleCategorySelection(c.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold text-left flex items-center justify-between border transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                        }`}
                      >
                        <span className="truncate">
                          {c.icon} {c.name.tr}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddScreenModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-lg shadow-amber-500/20"
                >
                  Ekranı Oluştur ve Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
