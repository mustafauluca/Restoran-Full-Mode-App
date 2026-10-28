import React, { useState } from 'react';
import { Campaign, Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Check, Gift, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CampaignModalProps {
  campaign: Campaign;
  onClose: () => void;
}

export const CampaignModal: React.FC<CampaignModalProps> = ({ campaign, onClose }) => {
  const { products, addCampaignComboToCart, formatPrice, activeLanguage } = useApp();

  const primaryProduct = products.find((p) => p.id === campaign.primaryProductId) || products[0];

  // Companion products available as free choice
  const companionProducts = products.filter(
    (p) => campaign.companionProductIds?.includes(p.id) || p.id === primaryProduct.id
  );

  const [selectedCompanionId, setSelectedCompanionId] = useState<string>(
    companionProducts[0]?.id || primaryProduct.id
  );
  const [primaryNote, setPrimaryNote] = useState<string>('');
  const [companionNote, setCompanionNote] = useState<string>('');
  const [isClaimed, setIsClaimed] = useState<boolean>(false);

  const selectedCompanion = products.find((p) => p.id === selectedCompanionId) || companionProducts[0];

  const handleClaim = () => {
    if (!selectedCompanion) return;

    addCampaignComboToCart(
      campaign,
      primaryProduct,
      selectedCompanion,
      primaryNote || undefined,
      companionNote || undefined
    );

    setIsClaimed(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#EF4444', '#10B981'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-neutral-900 border border-amber-500/30 rounded-2xl shadow-2xl text-neutral-100 flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-neutral-950/70 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Visual Banner */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-neutral-950">
          <img
            src={campaign.bannerImage}
            alt={campaign.title[activeLanguage] || campaign.title.tr}
            className="w-full h-full object-cover brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />

          {/* Badge */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs tracking-wider shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{campaign.badgeText[activeLanguage] || campaign.badgeText.tr}</span>
          </div>

          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
              {campaign.title[activeLanguage] || campaign.title.tr}
            </h2>
            <p className="text-xs sm:text-sm text-amber-300 font-medium mt-1">
              {campaign.subtitle[activeLanguage] || campaign.subtitle.tr}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 flex-1">
          {/* Step 1: Primary Item Info */}
          <div className="p-3.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-2">
              <span className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center text-[11px] font-black">
                  1
                </span>
                Ana Ürün (Satın Alınan)
              </span>
              <span className="text-base text-neutral-100">{formatPrice(primaryProduct.price)}</span>
            </div>

            <div className="flex gap-3 items-center">
              <img
                src={primaryProduct.image}
                alt={primaryProduct.name[activeLanguage] || primaryProduct.name.tr}
                className="w-16 h-16 rounded-lg object-cover border border-neutral-700"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-neutral-100 truncate">
                  {primaryProduct.name[activeLanguage] || primaryProduct.name.tr}
                </h4>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {primaryProduct.description[activeLanguage] || primaryProduct.description.tr}
                </p>
              </div>
            </div>

            <div className="mt-2.5">
              <input
                type="text"
                placeholder="Bu ürüne özel not (Örn: Orta pişmiş, ekstra karamelize soğan)..."
                value={primaryNote}
                onChange={(e) => setPrimaryNote(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-700 focus:border-amber-500 focus:outline-none text-neutral-200"
              />
            </div>
          </div>

          {/* Step 2: Pick Free Companion Item (1+1 Gift Selector) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center text-[11px] font-black">
                  2
                </span>
                Hediye Ürününüzü Seçin (0 ₺ Bedava!)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                %100 ÜCRETSİZ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {companionProducts.map((comp) => {
                const isSelected = comp.id === selectedCompanionId;
                return (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedCompanionId(comp.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'bg-neutral-800/60 border-neutral-700/60 hover:border-neutral-500'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={comp.image}
                        alt={comp.name[activeLanguage] || comp.name.tr}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-xs text-neutral-100 truncate">
                            {comp.name[activeLanguage] || comp.name.tr}
                          </h5>
                          {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="line-through text-neutral-500 text-[11px]">
                            {formatPrice(comp.price)}
                          </span>
                          <span className="text-xs font-black text-emerald-400">0 ₺ HEDİYE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-2.5">
              <input
                type="text"
                placeholder="Hediye ürüne özel not (Örn: Soslar ayrı gelsin)..."
                value={companionNote}
                onChange={(e) => setCompanionNote(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-700 focus:border-emerald-500 focus:outline-none text-neutral-200"
              />
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
            <div>
              <p className="text-neutral-400 font-medium">1+1 Kampanya Paketi Toplamı:</p>
              <p className="text-[11px] text-emerald-400 font-medium">
                {selectedCompanion?.name.tr} için {formatPrice(selectedCompanion?.price || 0)} tasarruf ettiniz!
              </p>
            </div>
            <div className="text-right">
              <span className="line-through text-neutral-500 text-xs mr-2">
                {formatPrice((primaryProduct?.price || 0) + (selectedCompanion?.price || 0))}
              </span>
              <span className="text-lg font-black text-amber-400">
                {formatPrice(primaryProduct?.price || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
          >
            Vazgeç
          </button>

          <button
            onClick={handleClaim}
            disabled={isClaimed}
            className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              isClaimed
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black'
            }`}
          >
            {isClaimed ? (
              <>
                <Check className="w-5 h-5 text-white animate-bounce" />
                <span>1+1 Kampanyası Sepete Eklendi!</span>
              </>
            ) : (
              <>
                <Gift className="w-5 h-5" />
                <span>1+1 Kampanyasını Sepetime Ekle</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
