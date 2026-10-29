/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Coins,
  MapPin,
  Wifi,
  Check,
  RefreshCw,
  Clock,
  Layers,
  ShoppingBag,
  Plus,
  Trash2,
  Power,
  Store,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { formatSyncDate, getNextScheduledSync } from '../../services/currencyService';

export const VenueSettingsTab: React.FC = () => {
  const {
    venue,
    updateVenue,
    tables,
    addTable,
    deleteTable,
    tableZones,
    addTableZone,
    deleteTableZone,
    isSyncingCurrencies,
    syncCurrenciesNow,
  } = useApp();

  // General settings state
  const [name, setName] = useState(venue.name);
  const [tagline, setTagline] = useState(venue.tagline);
  const [phone, setPhone] = useState(venue.phone);
  const [email, setEmail] = useState(venue.email);
  const [address, setAddress] = useState(venue.address);
  const [workingHours, setWorkingHours] = useState(venue.workingHours || '10:00 - 02:00');
  const [isOrderingOpen, setIsOrderingOpen] = useState(venue.isOrderingOpen ?? true);

  // Cart & Quota limits
  const [minDelivery, setMinDelivery] = useState(venue.minDeliveryAmount);
  const [deliveryFee, setDeliveryFee] = useState(venue.deliveryFee);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(
    venue.freeDeliveryThreshold ?? 750
  );
  const [minTableOrder, setMinTableOrder] = useState(venue.minTableOrderAmount ?? 0);
  const [maxCartAmount, setMaxCartAmount] = useState(venue.maxCartAmount ?? 15000);

  // Currency rates & sync
  const [rateUsd, setRateUsd] = useState(venue.currencyRates.USD);
  const [rateEur, setRateEur] = useState(venue.currencyRates.EUR);
  const [rateGbp, setRateGbp] = useState(venue.currencyRates.GBP);
  const [currencyAutoSync, setCurrencyAutoSync] = useState(venue.currencyAutoSync ?? true);
  const [currencySyncMsg, setCurrencySyncMsg] = useState<string | null>(null);

  // Geofence & Location
  const [geofenceRadius, setGeofenceRadius] = useState(venue.geofenceRadiusMeters);
  const [lat, setLat] = useState(venue.coordinates.lat);
  const [lng, setLng] = useState(venue.coordinates.lng);

  // Wi-Fi & Theme
  const [wifiName, setWifiName] = useState(venue.wifiName || '');
  const [wifiPassword, setWifiPassword] = useState(venue.wifiPassword || '');
  const [theme, setTheme] = useState(venue.theme);

  // Quick Table & Zone inputs
  const [newTableName, setNewTableName] = useState('');
  const [newZoneName, setNewZoneName] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleManualCurrencySync = async () => {
    setCurrencySyncMsg('TCMB ve uluslararası piyasalardan canlı kurlar alınıyor...');
    const res = await syncCurrenciesNow(true);
    if (res.success) {
      setRateUsd(venue.currencyRates.USD);
      setRateEur(venue.currencyRates.EUR);
      setRateGbp(venue.currencyRates.GBP);
      setCurrencySyncMsg(res.message || 'Kurlar başarıyla güncellendi!');
    } else {
      setCurrencySyncMsg('Kur senkronizasyonu hatası: ' + (res.message || 'Bilinmeyen hata'));
    }
    setTimeout(() => setCurrencySyncMsg(null), 4000);
  };

  const handleAddTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;
    addTable(newTableName.trim());
    setNewTableName('');
  };

  const handleAddZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;
    addTableZone(newZoneName.trim());
    setNewZoneName('');
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateVenue({
      name,
      tagline,
      phone,
      email,
      address,
      workingHours,
      isOrderingOpen,
      minDeliveryAmount: Number(minDelivery),
      deliveryFee: Number(deliveryFee),
      freeDeliveryThreshold: Number(freeDeliveryThreshold),
      minTableOrderAmount: Number(minTableOrder),
      maxCartAmount: Number(maxCartAmount),
      geofenceRadiusMeters: Number(geofenceRadius),
      coordinates: { lat: Number(lat), lng: Number(lng) },
      wifiName,
      wifiPassword,
      theme,
      currencyAutoSync,
      currencyRates: {
        TRY: 1.0,
        USD: Number(rateUsd),
        EUR: Number(rateEur),
        GBP: Number(rateGbp),
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Sticky Header with Save Button */}
      <div className="sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-neutral-900/95 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Restoran Manager Kontrol Merkezi</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isOrderingOpen ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                {isOrderingOpen ? 'Siparişler Açık' : 'Siparişler Kapalı'}
              </span>
            </h2>
            <p className="text-xs text-neutral-400">
              Masa ekleme, sepet ve ücret kotaları, çalışma saatleri, Wi-Fi ve 6 saatlik kur senkronu
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveAll}
          type="button"
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-neutral-950" />
              <span>Tüm Ayarlar Kaydedildi!</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Ayarları Kaydet</span>
            </>
          )}
        </button>
      </div>

      {/* 1. SEPET KOTALARI VE ÜCRET LİMİTLERİ (KULLANICI TALEBİ) */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-amber-500/30 space-y-4 shadow-lg shadow-amber-500/5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>Sepet Kotaları & Ücret Kural Motoru</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                  Müşteri Kuralları
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Adrese teslimat ve masa siparişleri için alt/üst sepet sınırları, kurye bedeli ve ücretsiz kurye eşiği
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {/* Min Delivery Amount */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
            <label className="text-[11px] font-bold text-amber-400 block uppercase tracking-wider">
              Min. Paket Servis Tutarı (₺)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="5"
                value={minDelivery}
                onChange={(e) => setMinDelivery(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-amber-400 font-mono text-base font-bold focus:outline-none focus:border-amber-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 font-mono">
                TRY
              </span>
            </div>
            <p className="text-[10px] text-neutral-500">
              Bu tutarın altındaki paket siparişler sepette engellenir.
            </p>
          </div>

          {/* Delivery Fee */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-200 block uppercase tracking-wider">
              Kurye / Teslimat Ücreti (₺)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="5"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 font-mono text-base font-bold focus:outline-none focus:border-amber-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 font-mono">
                TRY
              </span>
            </div>
            <p className="text-[10px] text-neutral-500">
              Paket siparişlerde adisyona eklenen teslimat bedeli.
            </p>
          </div>

          {/* Free Delivery Threshold */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-emerald-900/50 space-y-1.5">
            <label className="text-[11px] font-bold text-emerald-400 block uppercase tracking-wider">
              Ücretsiz Teslimat Eşiği (₺)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="50"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-emerald-400 font-mono text-base font-bold focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-500 font-mono">
                0 ₺ Kurye
              </span>
            </div>
            <p className="text-[10px] text-emerald-400/80">
              {freeDeliveryThreshold} ₺ ve üzerine kurye ücreti sıfırlanır (0 ₺).
            </p>
          </div>

          {/* Table Min Order */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-300 block uppercase tracking-wider">
              Masada Min. Sipariş / Kuver (₺)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="10"
                value={minTableOrder}
                onChange={(e) => setMinTableOrder(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 font-mono text-base font-bold focus:outline-none focus:border-amber-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 font-mono">
                TRY
              </span>
            </div>
            <p className="text-[10px] text-neutral-500">
              0 ise sınır uygulanmaz; masada açılış kuveri olarak da kullanılabilir.
            </p>
          </div>

          {/* Max Cart Limit */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-300 block uppercase tracking-wider">
              Maksimum Tek Sipariş Kotası (₺)
            </label>
            <div className="relative">
              <input
                type="number"
                min="500"
                step="500"
                value={maxCartAmount}
                onChange={(e) => setMaxCartAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 font-mono text-base font-bold focus:outline-none focus:border-amber-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 font-mono">
                TRY
              </span>
            </div>
            <p className="text-[10px] text-neutral-500">
              Tek seferde dolandırıcılık veya dev sipariş koruması üst limiti.
            </p>
          </div>

          {/* Ordering Switcher */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[11px] font-bold text-neutral-300 block uppercase tracking-wider">
                Canlı Sipariş Kabul Durumu
              </span>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                Acil durumlarda veya yoğun saatlerde siparişleri tek tuşla dondurun.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOrderingOpen(!isOrderingOpen)}
              className={`w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isOrderingOpen
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isOrderingOpen ? 'SİPARİŞLER AKTİF (AÇIK)' : 'SİPARİŞ ALIMI DURDURULDU'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. DÖVİZ KURLARI VE 6 SAATLİK GÜVENİLİR GÜNCELLEME (KULLANICI TALEBİ) */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <span>Çoklu Para Birimi & 6 Saatte Bir Otomatik Kur Senkronu</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono">
                  TCMB / FX API
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                USD, EUR, GBP, TRY kurları güvenilir finans kaynağından 6 saatte bir güncellenir ve veritabanına işlenir.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSyncingCurrencies}
            onClick={handleManualCurrencySync}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCurrencies ? 'animate-spin' : ''}`} />
            <span>{isSyncingCurrencies ? 'Güncelleniyor...' : 'Kurları Şimdi Güncelle'}</span>
          </button>
        </div>

        {currencySyncMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{currencySyncMsg}</span>
          </div>
        )}

        {/* Currency Rates Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-[11px] font-bold text-amber-300 block mb-1">₺ TRY (Ana Baz Para)</span>
            <input
              type="text"
              disabled
              value="1.0000 ₺ (Referans)"
              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-400 font-mono text-xs"
            />
            <span className="text-[10px] text-neutral-500 block mt-1">Türkiye Cumhuriyet Merkez Bankası</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-[11px] font-bold text-emerald-300 block mb-1">$ USD Çarpanı</span>
            <input
              type="number"
              step="0.0001"
              value={rateUsd}
              onChange={(e) => setRateUsd(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-neutral-400 block mt-1">
              1 $ = <strong className="text-white">{(1 / (rateUsd || 0.029)).toFixed(2)} TL</strong>
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-[11px] font-bold text-blue-300 block mb-1">€ EUR Çarpanı</span>
            <input
              type="number"
              step="0.0001"
              value={rateEur}
              onChange={(e) => setRateEur(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-blue-300 font-mono text-xs focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-neutral-400 block mt-1">
              1 € = <strong className="text-white">{(1 / (rateEur || 0.027)).toFixed(2)} TL</strong>
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-[11px] font-bold text-purple-300 block mb-1">£ GBP Çarpanı</span>
            <input
              type="number"
              step="0.0001"
              value={rateGbp}
              onChange={(e) => setRateGbp(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-purple-300 font-mono text-xs focus:outline-none focus:border-purple-500"
            />
            <span className="text-[10px] text-neutral-400 block mt-1">
              1 £ = <strong className="text-white">{(1 / (rateGbp || 0.023)).toFixed(2)} TL</strong>
            </span>
          </div>
        </div>

        {/* Sync Metadata Banner */}
        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-400 gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Son Senkronizasyon:{' '}
              <strong className="text-neutral-200">
                {formatSyncDate(venue.currencyLastSyncedAt || new Date().toISOString())}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>
              Sonraki 6 Saatlik Kontrol:{' '}
              <strong className="text-emerald-400">
                {getNextScheduledSync(venue.currencyLastSyncedAt || new Date().toISOString())}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* 3. MASA EKLEME & BÖLGE YÖNETİMİ (KULLANICI TALEBİ) */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wider">
              Masa Ekleme & Mekan Bölge Yönetimi (Salon, Bahçe, Teras, VIP)
            </h3>
            <p className="text-xs text-neutral-400">
              Müşterilerin QR menüde göreceği ve garson çağıracağı masaları ve restoran alanlarını yönetin
            </p>
          </div>
        </div>

        {/* Table Addition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Yeni Masa Ekle</h4>
            <form onSubmit={handleAddTableSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Örn: Masa 12 veya Bahçe 5"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ekle</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pt-2">
              {tables.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => deleteTable(t)}
                    className="text-neutral-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Zones Addition */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bölge & Alan Ekle</h4>
            <form onSubmit={handleAddZoneSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Örn: Kış Bahçesi, Çatı Katı"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ekle</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pt-2">
              {tableZones.map((z) => (
                <span
                  key={z}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-cyan-800/50 text-xs text-cyan-300"
                >
                  <span>{z}</span>
                  <button
                    type="button"
                    onClick={() => deleteTableZone(z)}
                    className="text-neutral-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. GENEL BİLGİLER VE ÇALIŞMA SAATLERİ */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider">
          Genel Restoran Bilgileri & Çalışma Saatleri
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-[11px] font-bold text-neutral-400 block mb-1">Mekan / Firma Adı</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 font-bold"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-400 block mb-1">Slogan & Konsept</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-200"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-400 block mb-1">Çalışma Saatleri</label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder="Örn: 10:00 - 02:00"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-400 block mb-1">Telefon Numarası</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-400 block mb-1">E-Posta Adresi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-200"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-400 block mb-1">Fiziksel Adres</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-200"
            />
          </div>
        </div>
      </div>

      {/* 5. GPS, COĞRAFİ SINIR & WI-FI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GPS Geofence */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              GPS Koordinatı & İç Mekan Yarıçapı
            </h4>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Enlem (Lat)</label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-neutral-200 font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Boylam (Lng)</label>
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-neutral-200 font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Yarıçap (Metre)</label>
              <input
                type="number"
                value={geofenceRadius}
                onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-neutral-200 font-mono text-xs"
              />
            </div>
          </div>
          <p className="text-[10px] text-neutral-500">
            Müşteri bu yarıçap içinde ise sistem "Masaya Sipariş & Garson Çağır" modunu otomatik sunar.
          </p>
        </div>

        {/* Wi-Fi Details */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Mekan Wi-Fi (Flyer & Menü İçin)
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Wi-Fi Ağ Adı (SSID)</label>
              <input
                type="text"
                value={wifiName}
                onChange={(e) => setWifiName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Wi-Fi Şifresi</label>
              <input
                type="text"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-neutral-200 font-mono text-xs"
              />
            </div>
          </div>
          <p className="text-[10px] text-neutral-500">
            PDF flyer ve QR menü üstünde müşterilerin tek tıkla bağlanabileceği bilgilerdir.
          </p>
        </div>
      </div>
    </div>
  );
};
