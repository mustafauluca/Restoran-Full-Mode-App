import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateFlyerPdf } from '../../services/pdfService';
import { Download, Sparkles, Check, Eye, QrCode } from 'lucide-react';

export const FlyerStudio: React.FC = () => {
  const { venue, campaigns, products, categories } = useApp();

  const [selectedTheme, setSelectedTheme] = useState<
    'modern_dark' | 'bistro_vintage' | 'neon_punch' | 'minimal_white'
  >('modern_dark');

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    campaigns[0]?.id || ''
  );

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    products.slice(0, 6).map((p) => p.id)
  );

  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];
  const featuredProducts = products.filter((p) => selectedProductIds.includes(p.id));

  const handleDownloadPdf = () => {
    generateFlyerPdf({
      theme: selectedTheme,
      featuredCampaign: activeCampaign,
      featuredProducts: featuredProducts.slice(0, 6),
      venue,
      categories,
      qrUrl: `https://qradv.com/qr/${venue.slug}`,
    });
  };

  const toggleProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      if (selectedProductIds.length > 2) {
        setSelectedProductIds(selectedProductIds.filter((p) => p !== id));
      }
    } else {
      if (selectedProductIds.length < 6) {
        setSelectedProductIds([...selectedProductIds, id]);
      }
    }
  };

  const themes = [
    {
      id: 'modern_dark' as const,
      name: 'Modern Dark Gold',
      desc: 'Zarif koyu arkaplan, altın sarısı başlıklar ve kırmızı kampanya rozeti',
      bgClass: 'bg-neutral-900 border-amber-500/50 text-white',
    },
    {
      id: 'bistro_vintage' as const,
      name: 'Rustic Bistro Vintage',
      desc: 'Sıcak bej ve kahverengi tonları, geleneksel restoran atmosferi',
      bgClass: 'bg-[#faf6ee] border-[#b45309]/50 text-neutral-900',
    },
    {
      id: 'neon_punch' as const,
      name: 'Neon Street & Cyber Diner',
      desc: 'Genç ve dinamik, mor-pembe neon vurgular ve yüksek kontrast',
      bgClass: 'bg-[#0f0b1e] border-pink-500/50 text-white',
    },
    {
      id: 'minimal_white' as const,
      name: 'Minimal Clean White',
      desc: 'Baskı dostu beyaz arkaplan, yüksek okunabilirlik ve şık tipografi',
      bgClass: 'bg-white border-neutral-300 text-neutral-950',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Otomatik Menü & 1+1 Kampanya PDF Flyer Üretici
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Masa üstü broşürü, paket servis el ilanı ve sosyal medya için tek tıkla yüksek çözünürlüklü A4 PDF oluşturun
          </p>
        </div>

        <button
          onClick={handleDownloadPdf}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl transition-all shrink-0"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>A4 Flyer PDF İndir</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (left 5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Theme Selector */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              1. Flyer Tasarım Teması
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {themes.map((th) => {
                const isSelected = selectedTheme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => setSelectedTheme(th.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'ring-2 ring-amber-500 border-amber-500 shadow-md'
                        : 'border-neutral-800 hover:border-neutral-700'
                    } ${th.bgClass}`}
                  >
                    <div className="flex items-center justify-between font-black text-xs mb-1">
                      <span>{th.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <p className="text-[10px] opacity-80 leading-snug">{th.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Campaign Selector */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2.5">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              2. Öne Çıkarılacak Dinamik Kampanya
            </h3>
            <div className="space-y-2">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  onClick={() => setSelectedCampaignId(camp.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    selectedCampaignId === camp.id
                      ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={camp.bannerImage}
                      alt={camp.title.tr}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs truncate">{camp.title.tr}</p>
                      <p className="text-[11px] text-amber-300 font-medium truncate">
                        {camp.badgeText.tr}
                      </p>
                    </div>
                  </div>
                  {selectedCampaignId === camp.id && (
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Featured Dishes Selector (max 6) */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                3. Broşürde Yer Alacak Ürünler ({selectedProductIds.length}/6)
              </h3>
              <span className="text-[11px] text-neutral-400">En fazla 6 lezzet</span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto no-scrollbar">
              {products.map((p) => {
                const isSelected = selectedProductIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className={`p-2 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-neutral-800 border-amber-500/80 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 opacity-60'
                    }`}
                  >
                    <img
                      src={p.image}
                      alt={p.name.tr}
                      className="w-7 h-7 rounded object-cover shrink-0"
                    />
                    <span className="truncate flex-1 font-semibold text-[11px]">{p.name.tr}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Flyer Preview Mockup (right 7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
            <span className="flex items-center gap-1.5 font-bold text-neutral-200">
              <Eye className="w-4 h-4 text-cyan-400" />
              Canlı Broşür (A4) Görsel Önizleme
            </span>
            <span>Baskıya hazır 300 DPI PDF formatında dışa aktarılır</span>
          </div>

          {/* Visual A4 Aspect Ratio Container */}
          <div
            className={`rounded-2xl border p-6 sm:p-8 shadow-2xl space-y-6 transition-all ${
              selectedTheme === 'modern_dark'
                ? 'bg-[#0f1117] border-neutral-700 text-white'
                : selectedTheme === 'bistro_vintage'
                ? 'bg-[#faf6ee] border-[#b45309]/30 text-neutral-900'
                : selectedTheme === 'neon_punch'
                ? 'bg-[#0a0a0f] border-pink-500/30 text-white'
                : 'bg-white border-neutral-300 text-neutral-950'
            }`}
          >
            {/* Header of Flyer */}
            <div className="flex items-start justify-between border-b pb-4 border-current/20">
              <div>
                <span className="text-3xl">{venue.logo || '🥩'}</span>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider mt-1">
                  {venue.name}
                </h1>
                <p className="text-xs opacity-75">{venue.tagline}</p>
                <p className="text-[11px] opacity-65 mt-1">
                  Tel: {venue.phone} • {venue.address}
                </p>
              </div>

              {/* QR Code Graphic Mock */}
              <div className="text-center p-2 rounded-xl border border-current/20 bg-current/5 shrink-0">
                <QrCode className="w-14 h-14 mx-auto opacity-90" />
                <span className="text-[9px] font-bold block mt-1">MENÜYÜ TARA</span>
                <span className="text-[8px] opacity-70 block">Masa & Paket Sipariş</span>
              </div>
            </div>

            {/* Campaign Highlight Hero */}
            {activeCampaign && (
              <div className="relative rounded-2xl overflow-hidden border border-current/20 bg-current/5 p-4 sm:p-5">
                <div className="inline-block px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs uppercase tracking-wider mb-2 shadow">
                  {activeCampaign.badgeText.tr}
                </div>
                <h3 className="text-lg sm:text-xl font-black">{activeCampaign.title.tr}</h3>
                <p className="text-xs sm:text-sm font-semibold opacity-90 text-amber-500 mt-1">
                  {activeCampaign.subtitle.tr}
                </p>
                <p className="text-xs opacity-75 mt-2">
                  1 Alana 1 Bedava fırsatı hem restoranda masada hem de adrese paket serviste geçerlidir!
                </p>
              </div>
            )}

            {/* 6 Featured Items Grid */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider mb-3 opacity-90">
                GURME LEZZETLER & ŞEFİN İMZA MENÜSÜ
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featuredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl border border-current/15 bg-current/5 flex items-center gap-2.5"
                  >
                    <img
                      src={p.image}
                      alt={p.name.tr}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs truncate">{p.name.tr}</span>
                        <span className="font-black text-xs text-amber-500 ml-1 shrink-0">
                          {p.price} ₺
                        </span>
                      </div>
                      <p className="text-[10px] opacity-70 line-clamp-1 mt-0.5">
                        {p.description.tr}
                      </p>
                      <div className="text-[9px] text-rose-500 font-semibold mt-1">
                        {p.allergenIds.length ? `Alerjen: ${p.allergenIds.join(', ')}` : 'Alerjensiz'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t pt-3 border-current/20 flex flex-wrap items-center justify-between text-[11px] opacity-75">
              <span>Masadaki QR Kodu Telefonunuzla Okutarak Hemen Sipariş Verin</span>
              <span className="font-mono">qradv.com/qr/{venue.slug}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
