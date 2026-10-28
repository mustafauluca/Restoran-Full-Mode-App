import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutGrid,
  Building2,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Plus,
  Tv,
  Radio,
  ExternalLink,
} from 'lucide-react';

export const SuperManagerApp: React.FC = () => {
  const { venue, orders, setCurrentRoute } = useApp();

  const [activeFirms] = useState([
    {
      id: 'firm-101',
      name: venue.name,
      slug: venue.slug,
      package: 'Enterprise Unlimited',
      screensCount: 3,
      tablesCount: 24,
      monthlyRevenue: '₺428,500',
      status: 'Active',
      city: 'İstanbul / Beşiktaş',
    },
    {
      id: 'firm-102',
      name: 'Bosphorus Seafood & Fish',
      slug: 'bosphorus-balik',
      package: 'Pro Multi-Branch',
      screensCount: 2,
      tablesCount: 18,
      monthlyRevenue: '₺312,000',
      status: 'Active',
      city: 'İstanbul / Bebek',
    },
    {
      id: 'firm-103',
      name: 'Moda Artisanal Bakery & Cafe',
      slug: 'moda-artisan-cafe',
      package: 'Standard Plus',
      screensCount: 1,
      tablesCount: 12,
      monthlyRevenue: '₺165,000',
      status: 'Active',
      city: 'İstanbul / Kadıköy',
    },
  ]);

  const paymentGateways = [
    { name: 'ParamPOS & PayTR (Kredi Kartı)', status: 'Online & Aktif', testPing: '18ms' },
    { name: 'Iyzico 3D Secure Checkout', status: 'Online & Aktif', testPing: '24ms' },
    { name: 'Sodexo / Pluxee Online Entegrasyonu', status: 'Online & Aktif', testPing: '32ms' },
    { name: 'Multinet & Metropol Yemek Kartı', status: 'Online & Aktif', testPing: '29ms' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-6 space-y-6">
      {/* Platform Super Admin Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white">
                QRAdv Platform & Firma Yönetim Merkezi (Super Admin)
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                qradv.com/manager
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Tüm restoran firmaları, lisanslar, menuboard TV yayınları, radyo kanalları ve ödeme altyapıları
            </p>
          </div>
        </div>

        <button className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center gap-1.5 transition-colors shadow-md shrink-0">
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Yeni Firma / Restoran Ekle</span>
        </button>
      </div>

      {/* High Level KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Kayıtlı Restoran</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">48 Firma</div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
            +6 bu ay yeni katıldı
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Canlı TV Menuboard</span>
            <Tv className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">142 Ekran</div>
          <span className="text-[11px] text-cyan-400 font-semibold mt-1 inline-block">
            /vid/ & /tv/ aktif yayında
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Bugünkü QR Sipariş</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{orders.length + 184} Adet</div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
            ₺124,850 ciro hacmi
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Mekan Radyosu</span>
            <Radio className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">96 Hoparlör</div>
          <span className="text-[11px] text-purple-400 font-semibold mt-1 inline-block">
            Kesintisiz telifli yayın
          </span>
        </div>
      </div>

      {/* Firms List Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Yönetilen Restoran Firmaları</h2>
          <span className="text-xs text-neutral-400">Aktif Sözleşmeler & Lisanslar</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 font-bold uppercase text-[10px] border-b border-neutral-800">
              <tr>
                <th className="p-3">Firma Adı & Lokasyon</th>
                <th className="p-3">URL Slug</th>
                <th className="p-3">Lisans Paketi</th>
                <th className="p-3">Masa / Ekran</th>
                <th className="p-3">Aylık Hacim</th>
                <th className="p-3">Durum</th>
                <th className="p-3 text-right">Erişim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 bg-neutral-900/60">
              {activeFirms.map((f) => (
                <tr key={f.id} className="hover:bg-neutral-800/40">
                  <td className="p-3">
                    <div className="font-bold text-white text-xs">{f.name}</div>
                    <div className="text-[10px] text-neutral-500">{f.city}</div>
                  </td>
                  <td className="p-3 font-mono text-amber-400 text-[11px]">qradv.com/qr/{f.slug}</td>
                  <td className="p-3 text-neutral-300 font-medium">{f.package}</td>
                  <td className="p-3 text-neutral-400 font-mono text-[11px]">
                    {f.tablesCount} Masa / {f.screensCount} TV
                  </td>
                  <td className="p-3 font-bold text-emerald-400">{f.monthlyRevenue}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {f.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setCurrentRoute('panel')}
                      className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Yönet</span>
                      <ExternalLink className="w-3 h-3 text-neutral-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Gateway Integrations Overview */}
      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-white">
            Ödeme Entegrasyonları ve Kart Gateway Durumu
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {paymentGateways.map((gw, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-200">{gw.name}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-semibold">{gw.status}</span>
                <span className="text-neutral-500 font-mono">{gw.testPing}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
