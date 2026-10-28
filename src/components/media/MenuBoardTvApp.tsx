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
} from 'lucide-react';

export const MenuBoardTvApp: React.FC = () => {
  const { venue, campaigns, products, tvScreens, activeScreenId, setActiveScreenId, formatPrice } =
    useApp();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [clockTime, setClockTime] = useState<string>('');

  const currentScreen =
    tvScreens.find((s) => s.id === activeScreenId) || tvScreens[0];

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
    const slideTimer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % Math.max(1, campaigns.length));
    }, (currentScreen.refreshSeconds || 15) * 1000);
    return () => clearInterval(slideTimer);
  }, [campaigns.length, currentScreen.refreshSeconds]);

  const displayedCampaign = campaigns[currentSlideIndex] || activeCampaign;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Top TV Bar: Venue Brand, Clock & Screen Switcher */}
      <header className="px-6 py-3.5 bg-neutral-950/90 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-1 rounded-xl bg-amber-500/10 border border-amber-500/20">
            {venue.logo || '🥩'}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-wider uppercase text-white">
                {venue.name}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-neutral-950">
                DIGITAL MENUBOARD TV
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">{venue.tagline}</p>
          </div>
        </div>

        {/* Screen Controller & Clock */}
        <div className="flex items-center gap-4">
          {/* Multi-screen selector (qradv.com/vid/101/screen-1) */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-xl text-xs">
            <span className="text-[10px] text-neutral-500 font-mono px-1">EKRAN:</span>
            {tvScreens.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveScreenId(s.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeScreenId === s.id
                    ? 'bg-amber-500 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {s.name.split('/')[0]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 font-mono text-base font-black text-amber-400 bg-neutral-900 px-3 py-1 rounded-xl border border-neutral-800">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{clockTime}</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800"
            title="Tam Ekran Yap"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main TV Screen Content (Split View / Hero Campaign Spotlight) */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Huge 1+1 Dynamic Campaign Hero Card (7 cols) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-between rounded-3xl overflow-hidden border border-amber-500/30 bg-neutral-900 shadow-2xl relative">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-neutral-950">
            <img
              src={displayedCampaign.bannerImage}
              alt=""
              className="w-full h-full object-cover transition-transform duration-1000 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />

            {/* Campaign Badge */}
            <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-600 text-white font-black text-sm tracking-widest shadow-2xl animate-pulse">
              <Gift className="w-4 h-4" />
              <span>{displayedCampaign.badgeText.tr}</span>
            </div>

            <div className="absolute bottom-4 left-5 right-5">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-lg">
                {displayedCampaign.title.tr}
              </h2>
              <p className="text-sm sm:text-base text-amber-300 font-bold mt-1 drop-shadow">
                {displayedCampaign.subtitle.tr}
              </p>
            </div>
          </div>

          {/* Campaign Details & Pricing Callout */}
          <div className="p-6 space-y-4 flex-1 flex flex-col justify-between bg-neutral-900">
            <p className="text-sm text-neutral-300 leading-relaxed">
              {displayedCampaign.description.tr}
            </p>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400 block font-semibold">
                  Masanızdaki QR Kodu Okutun:
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  İkinci Ürünü 0 ₺ Ücretsiz Seçin!
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-neutral-300">
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
          <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-5 space-y-3 flex-1">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs font-black tracking-widest uppercase text-amber-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                ŞEFİN TAVSİYELERİ & GÜNÜN MENÜSÜ
              </span>
              <span className="text-[11px] text-neutral-400">Canlı Fiyatlar</span>
            </div>

            <div className="space-y-2.5">
              {featuredProducts.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between gap-3"
                >
                  <img
                    src={p.image}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-white truncate">{p.name.tr}</h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-1">{p.description.tr}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {p.calories && (
                        <span className="text-[10px] text-neutral-400">{p.calories} kcal</span>
                      )}
                      {p.preparationTime && (
                        <span className="text-[10px] text-cyan-400">~{p.preparationTime} dk</span>
                      )}
                    </div>
                  </div>
                  <div className="font-black text-sm text-amber-400 shrink-0 font-mono">
                    {formatPrice(p.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Large Screen QR Code Box */}
          <div className="rounded-3xl bg-gradient-to-r from-neutral-900 to-neutral-950 border border-amber-500/30 p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
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

      {/* Bottom Continuous Scrolling News / Campaign Ticker Banner */}
      <footer className="bg-amber-500 text-neutral-950 font-black text-xs py-2 px-4 overflow-hidden shadow-2xl">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          <span>{currentScreen.tickerMessage}</span>
          <span>•</span>
          <span>🥩 1 ALANA 1 BEDAVA GURME BURGER FIRSATINI KAÇIRMAYIN!</span>
          <span>•</span>
          <span>🍹 HAPPY HOUR: 15:00 - 19:00 ARASI TÜM İÇECEKLERDE %50 İNDİRİM!</span>
          <span>•</span>
          <span>📱 AKILLI MENÜ: qradv.com/qr/{venue.slug}</span>
        </div>
      </footer>
    </div>
  );
};
