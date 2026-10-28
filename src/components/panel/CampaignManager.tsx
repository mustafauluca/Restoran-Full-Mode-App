import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Campaign, CampaignType } from '../../types';
import { Sparkles, Plus, Trash2, Edit2, Check, X, Gift } from 'lucide-react';

export const CampaignManager: React.FC = () => {
  const { campaigns, setCampaigns, products, formatPrice } = useApp();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // Form State
  const [titleTr, setTitleTr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [subtitleTr, setSubtitleTr] = useState('');
  const [badgeTextTr, setBadgeTextTr] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [campType, setCampType] = useState<CampaignType>('buy1_get1_free');
  const [primaryProductId, setPrimaryProductId] = useState<string>(products[0]?.id || '');
  const [companionProductIds, setCompanionProductIds] = useState<string[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(50);
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-12-31');

  const openNewForm = () => {
    setTitleTr('');
    setTitleEn('');
    setSubtitleTr('');
    setBadgeTextTr('🔥 1 ALANA 1 BEDAVA');
    setBannerImage(
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80'
    );
    setCampType('buy1_get1_free');
    setPrimaryProductId(products[0]?.id || '');
    setCompanionProductIds(products.slice(1, 3).map((p) => p.id));
    setDiscountPercent(50);
    setEditingCampaign(null);
    setIsEditing(true);
  };

  const openEditForm = (camp: Campaign) => {
    setTitleTr(camp.title.tr);
    setTitleEn(camp.title.en);
    setSubtitleTr(camp.subtitle.tr);
    setBadgeTextTr(camp.badgeText.tr);
    setBannerImage(camp.bannerImage);
    setCampType(camp.type);
    setPrimaryProductId(camp.primaryProductId);
    setCompanionProductIds(camp.companionProductIds || []);
    setDiscountPercent(camp.discountPercent || 50);
    setStartDate(camp.startDate);
    setEndDate(camp.endDate);
    setEditingCampaign(camp);
    setIsEditing(true);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleTr.trim() || !primaryProductId) return;

    const newCampaign: Campaign = {
      id: editingCampaign ? editingCampaign.id : `camp-${Date.now()}`,
      title: {
        tr: titleTr,
        en: titleEn || titleTr,
        de: titleTr,
        ru: titleTr,
        ar: titleTr,
        fr: titleTr,
      },
      subtitle: {
        tr: subtitleTr,
        en: subtitleTr,
        de: subtitleTr,
        ru: subtitleTr,
        ar: subtitleTr,
        fr: subtitleTr,
      },
      description: {
        tr: `${titleTr} - ${subtitleTr}`,
        en: `${titleEn || titleTr} - ${subtitleTr}`,
        de: subtitleTr,
        ru: subtitleTr,
        ar: subtitleTr,
        fr: subtitleTr,
      },
      type: campType,
      primaryProductId,
      companionProductIds,
      discountPercent: campType === 'discount_percent' ? discountPercent : undefined,
      badgeText: {
        tr: badgeTextTr || 'KAMPANYA',
        en: badgeTextTr || 'CAMPAIGN',
        de: badgeTextTr || 'AKTION',
        ru: badgeTextTr || 'АКЦИЯ',
        ar: badgeTextTr || 'عرض',
        fr: badgeTextTr || 'OFFRE',
      },
      bannerImage,
      isActive: true,
      startDate,
      endDate,
    };

    if (editingCampaign) {
      setCampaigns((prev) => prev.map((c) => (c.id === editingCampaign.id ? newCampaign : c)));
    } else {
      setCampaigns((prev) => [newCampaign, ...prev]);
    }

    setIsEditing(false);
  };

  const toggleCampaignActive = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleCompanionProduct = (prodId: string) => {
    if (companionProductIds.includes(prodId)) {
      setCompanionProductIds(companionProductIds.filter((id) => id !== prodId));
    } else {
      setCompanionProductIds([...companionProductIds, prodId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Dinamik Kampanya Yönetim Merkezi (1+1 & İndirim Motoru)
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Restoranınız için 1 Alana 1 Bedava, Happy Hour ve kombo promosyonlarını yönetin
            </p>
          </div>
        </div>

        <button
          onClick={openNewForm}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center gap-1.5 transition-colors shadow-md shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Yeni Kampanya Oluştur</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((camp) => {
          const primaryProduct = products.find((p) => p.id === camp.primaryProductId);
          const companions = products.filter((p) => camp.companionProductIds?.includes(p.id));

          return (
            <div
              key={camp.id}
              className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                camp.isActive
                  ? 'bg-neutral-900 border-amber-500/40 shadow-lg'
                  : 'bg-neutral-900/50 border-neutral-800 opacity-60'
              }`}
            >
              <div>
                {/* Banner Thumbnail */}
                <div className="relative h-40 w-full bg-neutral-950 overflow-hidden">
                  <img
                    src={camp.bannerImage}
                    alt={camp.title.tr}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/40" />

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-600 text-white font-black text-[11px] shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{camp.badgeText.tr}</span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <button
                      onClick={() => toggleCampaignActive(camp.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                        camp.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                      }`}
                    >
                      {camp.isActive ? 'YAYINDA' : 'PASİF'}
                    </button>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3">
                    <h3 className="font-black text-sm text-white drop-shadow truncate">
                      {camp.title.tr}
                    </h3>
                    <p className="text-xs text-amber-300 drop-shadow truncate">
                      {camp.subtitle.tr}
                    </p>
                  </div>
                </div>

                {/* Campaign Configuration Details */}
                <div className="p-4 space-y-2.5 text-xs text-neutral-300">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Kampanya Tipi:</span>
                    <span className="font-bold text-amber-400 uppercase">
                      {camp.type === 'buy1_get1_free' ? '1 Alana 1 Bedava (Hediye)' : '% İndirim'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Tetikleyici Ana Ürün:</span>
                    <span className="font-bold text-neutral-100">
                      {primaryProduct ? `${primaryProduct.name.tr} (${formatPrice(primaryProduct.price)})` : 'Seçilmedi'}
                    </span>
                  </div>

                  {camp.type === 'buy1_get1_free' && (
                    <div>
                      <span className="text-neutral-400 block mb-1">
                        Hediye Edilebilecek 0 ₺ Ürünler ({companions.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {companions.map((c) => (
                          <span
                            key={c.id}
                            className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium"
                          >
                            🎁 {c.name.tr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-neutral-800 text-[11px] text-neutral-400">
                    <span>Geçerlilik:</span>
                    <span>
                      {camp.startDate} - {camp.endDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditForm(camp)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Düzenle</span>
                </button>
                <button
                  onClick={() => deleteCampaign(camp.id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                  title="Kampanyayı Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Create / Edit Modal Form */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-5 text-neutral-100 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-base text-neutral-100">
                {editingCampaign ? 'Kampanyayı Düzenle' : 'Yeni Dinamik Kampanya Oluştur'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="py-4 space-y-4 flex-1 text-xs">
              {/* Campaign Type */}
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Kampanya Modeli:</label>
                <select
                  value={campType}
                  onChange={(e) => setCampType(e.target.value as CampaignType)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none focus:border-amber-500 font-semibold"
                >
                  <option value="buy1_get1_free">
                    🍔 1 Alana 1 Bedava (Buy 1 Get 1 Free - Hediye Seçmeli)
                  </option>
                  <option value="discount_percent">⚡ Yüzde (%) İndirim Kampanyası</option>
                  <option value="combo_deal">🍱 Menü Yanında Hediye İkram</option>
                </select>
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    Kampanya Başlığı (Türkçe) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 1 ALANA 1 BEDAVA BURGER FESTİVALİ!"
                    value={titleTr}
                    onChange={(e) => setTitleTr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    Rozet / Badge Metni *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 🔥 1 ALANA 1 BEDAVA"
                    value={badgeTextTr}
                    onChange={(e) => setBadgeTextTr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  Alt Başlık / Kampanya Özeti *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Trüflü Smash Burger Alana, Çıtır Tavuk Burger Anında 0 ₺ Hediye!"
                  value={subtitleTr}
                  onChange={(e) => setSubtitleTr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Banner Image URL */}
              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  Görsel Banner URL (Yüksek Çözünürlüklü) *
                </label>
                <input
                  type="url"
                  required
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                />
              </div>

              {/* Trigger Primary Product */}
              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  Tetikleyici Ürün (Satın Alındığında Kampanyayı Başlatan Ürün) *
                </label>
                <select
                  value={primaryProductId}
                  onChange={(e) => setPrimaryProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none focus:border-amber-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name.tr} - {p.price} ₺
                    </option>
                  ))}
                </select>
              </div>

              {/* Companion Free Choices (for 1+1) */}
              {campType === 'buy1_get1_free' && (
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    Müşterinin Ücretsiz Seçebileceği Hediye Ürünler (Birden çok seçilebilir):
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto no-scrollbar p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                    {products.map((p) => {
                      const isSelected = companionProductIds.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => toggleCompanionProduct(p.id)}
                          className={`p-2 rounded-lg border cursor-pointer flex items-center justify-between gap-1 text-[11px] ${
                            isSelected
                              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                          }`}
                        >
                          <span className="truncate">{p.name.tr}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Başlangıç Tarihi</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Bitiş Tarihi</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black shadow-lg"
                >
                  Kampanyayı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
