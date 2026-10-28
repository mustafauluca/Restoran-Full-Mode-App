import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Coins, MapPin, Wifi, Check, Palette } from 'lucide-react';
import { CurrencyCode } from '../../types';

export const VenueSettingsTab: React.FC = () => {
  const { venue, updateVenue } = useApp();

  const [name, setName] = useState(venue.name);
  const [tagline, setTagline] = useState(venue.tagline);
  const [phone, setPhone] = useState(venue.phone);
  const [email, setEmail] = useState(venue.email);
  const [address, setAddress] = useState(venue.address);
  const [minDelivery, setMinDelivery] = useState(venue.minDeliveryAmount);
  const [deliveryFee, setDeliveryFee] = useState(venue.deliveryFee);
  const [geofenceRadius, setGeofenceRadius] = useState(venue.geofenceRadiusMeters);
  const [lat, setLat] = useState(venue.coordinates.lat);
  const [lng, setLng] = useState(venue.coordinates.lng);
  const [wifiName, setWifiName] = useState(venue.wifiName || '');
  const [wifiPassword, setWifiPassword] = useState(venue.wifiPassword || '');
  const [rateUsd, setRateUsd] = useState(venue.currencyRates.USD);
  const [rateEur, setRateEur] = useState(venue.currencyRates.EUR);
  const [rateGbp, setRateGbp] = useState(venue.currencyRates.GBP);
  const [theme, setTheme] = useState(venue.theme);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateVenue({
      name,
      tagline,
      phone,
      email,
      address,
      minDeliveryAmount: minDelivery,
      deliveryFee,
      geofenceRadiusMeters: geofenceRadius,
      coordinates: { lat, lng },
      wifiName,
      wifiPassword,
      theme,
      currencyRates: {
        TRY: 1.0,
        USD: rateUsd,
        EUR: rateEur,
        GBP: rateGbp,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white">
            Mekan, Çoklu Para Birimi & Lokasyon Ayarları
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            USD, EUR, TL, POUND kurları, coğrafi sınır (Geofencing), paket servis limitleri ve Wi-Fi
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-neutral-950" />
              <span>Kaydedildi!</span>
            </>
          ) : (
            <span>Ayarları Kaydet</span>
          )}
        </button>
      </div>

      {/* Multi-Currency Rates Setting */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Çoklu Para Birimi ve Kur Çevirici (USD, EUR, TL, POUND)
            </h3>
            <p className="text-[11px] text-neutral-400">
              Menüde ve adisyonda tüm fiyatlar TL baz alınarak bu oranlara göre anlık çevrilir (1 TL = X Döviz)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-[11px] font-bold text-amber-300 block mb-1">₺ TRY (Ana Para)</span>
            <input
              type="text"
              disabled
              value="1.00 (Baz Para)"
              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-400 font-mono text-xs"
            />
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-[11px] font-bold text-emerald-300 block mb-1">$ USD Çarpanı</span>
            <input
              type="number"
              step="0.0001"
              value={rateUsd}
              onChange={(e) => setRateUsd(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 font-mono text-xs focus:outline-none focus:border-amber-500"
            />
            <span className="text-[10px] text-neutral-500 block mt-1">
              ~{(1 / rateUsd).toFixed(2)} TL / $
            </span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-[11px] font-bold text-blue-300 block mb-1">€ EUR Çarpanı</span>
            <input
              type="number"
              step="0.0001"
              value={rateEur}
              onChange={(e) => setRateEur(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 font-mono text-xs focus:outline-none focus:border-amber-500"
            />
            <span className="text-[10px] text-neutral-500 block mt-1">
              ~{(1 / rateEur).toFixed(2)} TL / €
            </span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-[11px] font-bold text-purple-300 block mb-1">£ GBP Çarpanı</span>
            <input
              type="number"
              step="0.0001"
              value={rateGbp}
              onChange={(e) => setRateGbp(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 font-mono text-xs focus:outline-none focus:border-amber-500"
            />
            <span className="text-[10px] text-neutral-500 block mt-1">
              ~{(1 / rateGbp).toFixed(2)} TL / £
            </span>
          </div>
        </div>
      </div>

      {/* Geofence & Location */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Restoran GPS Koordinatları ve Coğrafi Sınır (Geofencing)
            </h3>
            <p className="text-[11px] text-neutral-400">
              Müşteri bu koordinatın belirlenen yarıçapı içindeyse sistem otomatik olarak "Masaya Sipariş" ve "Garson Çağır" modunu açar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">Enlem (Latitude)</label>
            <input
              type="number"
              step="0.0001"
              value={lat}
              onChange={(e) => setLat(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 font-mono text-xs text-neutral-200"
            />
          </div>
          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">Boylam (Longitude)</label>
            <input
              type="number"
              step="0.0001"
              value={lng}
              onChange={(e) => setLng(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 font-mono text-xs text-neutral-200"
            />
          </div>
          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">
              İç Mekan Yarıçapı (Metre)
            </label>
            <input
              type="number"
              value={geofenceRadius}
              onChange={(e) => setGeofenceRadius(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 font-mono text-xs text-neutral-200"
            />
          </div>
        </div>
      </div>

      {/* Delivery Limits & Wi-Fi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Delivery Limits */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Paket Servis & Kurye Limitleri
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Min. Sipariş Tutarı</label>
              <input
                type="number"
                value={minDelivery}
                onChange={(e) => setMinDelivery(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-xs font-bold font-mono text-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Kurye Teslimat Ücreti</label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-xs font-bold font-mono text-neutral-200"
              />
            </div>
          </div>
        </div>

        {/* Wi-Fi Details */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Mekan Wi-Fi Bilgileri (Flyer & Menü İçin)
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Wi-Fi Ağ Adı (SSID)</label>
              <input
                type="text"
                value={wifiName}
                onChange={(e) => setWifiName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-xs text-neutral-200"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Wi-Fi Şifresi</label>
              <input
                type="text"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-xs text-neutral-200 font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
