import React from 'react';
import { useApp, AppRoute } from '../../context/AppContext';
import {
  Globe,
  Radio,
  Tv,
  LayoutGrid,
  ChefHat,
  QrCode,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  MapPin,
  ExternalLink,
  Coins,
  Download,
} from 'lucide-react';
import { LanguageCode, CurrencyCode } from '../../types';

export const TopBar: React.FC = () => {
  const {
    currentRoute,
    setCurrentRoute,
    venue,
    activeScreenId,
    setActiveScreenId,
    isInsideRestaurant,
    setIsInsideRestaurant,
    soundEnabled,
    setSoundEnabled,
    activeLanguage,
    setActiveLanguage,
    activeCurrency,
    setActiveCurrency,
    orders,
    waiterCalls,
    detectRealGpsLocation,
    gpsDetecting,
    realGpsDistance,
  } = useApp();

  const activePendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'preparing').length;
  const activeWaiterCalls = waiterCalls.filter((c) => c.status === 'active').length;

  const getSimulatedUrl = () => {
    switch (currentRoute) {
      case 'manager':
        return 'qradv.com/manager';
      case 'panel':
        return 'qradv.com/panel';
      case 'pos':
        return 'qradv.com/pos';
      case 'qr':
        return `qradv.com/qr/${venue.slug}`;
      case 'radio':
        return `qradv.com/radyo/${venue.slug.replace('_ana-menu', '')}_radio`;
      case 'tv':
        return `qradv.com/tv/${venue.slug.replace('_ana-menu', '')}_tv`;
      case 'vid':
        return `qradv.com/vid/${venue.id.replace('venue-', '')}/${activeScreenId}`;
      default:
        return 'qradv.com';
    }
  };

  const navItems: { route: AppRoute; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      route: 'qr',
      label: 'QR Menü (Müşteri)',
      icon: <QrCode className="w-4 h-4" />,
    },
    {
      route: 'pos',
      label: 'POS & Mutfak KDS',
      icon: <ChefHat className="w-4 h-4" />,
      badge: activePendingOrders + activeWaiterCalls,
      badgeColor: 'bg-rose-500 animate-pulse',
    },
    {
      route: 'panel',
      label: 'Mekan Paneli',
      icon: <SlidersHorizontal className="w-4 h-4" />,
    },
    {
      route: 'manager',
      label: 'Firma / Platform Admin',
      icon: <LayoutGrid className="w-4 h-4" />,
    },
    {
      route: 'tv',
      label: 'Menuboard TV',
      icon: <Tv className="w-4 h-4" />,
    },
    {
      route: 'radio',
      label: 'Mekan Radyosu',
      icon: <Radio className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 text-neutral-200">
      {/* Top Address & Geofence Simulator Bar */}
      <div className="px-3 sm:px-6 py-1.5 bg-neutral-950/80 border-b border-neutral-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Virtual URL display */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[11px] border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            LIVE LINK:
          </span>
          <span className="font-mono text-neutral-300 select-all font-medium flex items-center gap-1">
            https://{getSimulatedUrl()}
            <ExternalLink className="w-3 h-3 text-neutral-500" />
          </span>
        </div>

        {/* Global Geofencing & Simulation Toggles */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Location Simulator */}
          <div className="flex items-center gap-1.5 bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-700/60">
            <MapPin className={`w-3.5 h-3.5 ${isInsideRestaurant ? 'text-emerald-400' : 'text-cyan-400'}`} />
            <span className="text-[11px] text-neutral-400 font-medium hidden sm:inline">Konum:</span>
            <button
              onClick={() => setIsInsideRestaurant(true)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                isInsideRestaurant
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Restoran içindesiniz: Masaya sipariş ve garson çağırma butonları aktiftir"
            >
              Restoranda (Masa)
            </button>
            <span className="text-neutral-600">|</span>
            <button
              onClick={() => setIsInsideRestaurant(false)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                !isInsideRestaurant
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Restoran dışındasınız: Adrese teslimat ve müdavim adresleri aktiftir"
            >
              Dışarıda (Adrese Paket)
            </button>
            <span className="text-neutral-600">|</span>
            <button
              onClick={detectRealGpsLocation}
              disabled={gpsDetecting}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 hover:bg-neutral-700 text-amber-300 flex items-center gap-1 transition-colors border border-neutral-700"
              title="Tarayıcı GPS koordinatınız ile restoran arası gerçek mesafeyi ölçer"
            >
              <span>
                {gpsDetecting
                  ? 'GPS Aranıyor...'
                  : realGpsDistance !== null
                  ? `🛰️ Mesafe: ${realGpsDistance > 1000 ? (realGpsDistance / 1000).toFixed(1) + 'km' : realGpsDistance + 'm'}`
                  : '🛰️ GPS Tara'}
              </span>
            </button>
          </div>

          {/* Sound Alarm Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
              soundEnabled
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-neutral-800 border-neutral-700 text-neutral-500'
            }`}
            title="POS ve Mutfak sesli bildirim uyarısı"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden md:inline text-[11px]">Sesli Uyarı</span>
          </button>

          {/* Direct Download Hostinger Zip Package */}
          <a
            href="/hostinger_hazir_kurulum_public_html.zip"
            download="hostinger_hazir_kurulum_public_html.zip"
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] flex items-center gap-1.5 shadow-md transition-all"
            title="Hostinger public_html içine doğrudan yüklenecek hazır derlenmiş paketi (.zip) indir"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Hostinger Paketi (.ZIP)</span>
          </a>

          {/* Multi-Currency Fast Switcher */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-700/60 rounded-lg px-2 py-1">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            {(['TRY', 'USD', 'EUR', 'GBP'] as CurrencyCode[]).map((cur) => (
              <button
                key={cur}
                onClick={() => setActiveCurrency(cur)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                  activeCurrency === cur
                    ? 'bg-amber-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cur === 'TRY' ? '₺ TL' : cur === 'USD' ? '$' : cur === 'EUR' ? '€' : '£'}
              </button>
            ))}
          </div>

          {/* Multi-Language Fast Switcher */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-700/60 rounded-lg px-2 py-1">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            {(['tr', 'en', 'de', 'ru', 'ar', 'fr'] as LanguageCode[]).map((lng) => (
              <button
                key={lng}
                onClick={() => setActiveLanguage(lng)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                  activeLanguage === lng
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {lng}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Portal Navigation Tabs */}
      <div className="px-3 sm:px-6 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-3 border-r border-neutral-800">
            <span className="text-xl">🥩</span>
            <div className="leading-tight">
              <h1 className="font-bold text-sm text-neutral-100 flex items-center gap-1.5">
                QRAdv <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500 text-neutral-950 font-black">OMNI</span>
              </h1>
              <p className="text-[10px] text-neutral-400 hidden lg:block">{venue.name}</p>
            </div>
          </div>

          {/* Route Tabs */}
          <nav className="flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => setCurrentRoute(item.route)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all relative ${
                    isActive
                      ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                      : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white ${
                        item.badgeColor || 'bg-rose-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Custom Screen video simulator */}
            <button
              onClick={() => {
                setCurrentRoute('vid');
                setActiveScreenId('screen-1');
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                currentRoute === 'vid'
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:bg-neutral-800'
              }`}
              title="Özel Ekran Video Kontrolü (/vid/101/screen-1)"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>/vid/101</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
