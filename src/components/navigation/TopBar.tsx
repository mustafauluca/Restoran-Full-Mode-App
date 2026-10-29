/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  ExternalLink,
  ChevronUp,
  X,
  ShieldCheck,
  Store,
  KeyRound,
  Download,
  Database,
  Coins,
  Check,
} from 'lucide-react';
import { PhpMysqlArchitectureModal } from '../panel/PhpMysqlArchitectureModal';

export const TopBar: React.FC = () => {
  const {
    currentRoute,
    setCurrentRoute,
    venue,
    activeScreenId,
    orders,
    waiterCalls,
    superAdminSession,
    venueManagerSession,
    staffSession,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

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

  const portals = [
    {
      route: 'qr' as AppRoute,
      url: `qradv.com/qr/${venue.slug}`,
      title: 'Müşteri QR Menü',
      sub: 'Müşteri görünümü (Ayrı, izole, menü & sipariş)',
      icon: <QrCode className="w-5 h-5 text-amber-400" />,
      badge: 'Müşteri',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      status: 'Açık / Girişsiz',
    },
    {
      route: 'panel' as AppRoute,
      url: 'qradv.com/panel',
      title: 'Firma & Restoran Yöneticisi',
      sub: 'Masa ekleme, sepet kotaları, menü, kampanyalar',
      icon: <Store className="w-5 h-5 text-cyan-400" />,
      badge: 'Müdür Paneli',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      status: venueManagerSession.isAuthenticated ? 'Giriş Yapıldı' : 'Yönetici Girişi Gerekli',
    },
    {
      route: 'pos' as AppRoute,
      url: 'qradv.com/pos',
      title: 'Mekan Çalışanları & KDS',
      sub: 'Garson, Kasa, Mutfak, Izgara, İçecek, Salata, Meze',
      icon: <ChefHat className="w-5 h-5 text-rose-400" />,
      badge: 'Personel POS',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      status: staffSession?.isAuthenticated ? `${staffSession.name}` : '4 Haneli PIN Gerekli',
      alertCount: activePendingOrders + activeWaiterCalls,
    },
    {
      route: 'manager' as AppRoute,
      url: 'qradv.com/manager',
      title: 'Site Süper Yöneticisi',
      sub: 'Platform sahibi, tüm restoranlar, 6s kur servisi',
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      badge: 'Root Super Admin',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      status: superAdminSession.isAuthenticated ? 'Super Admin Aktif' : 'Root Girişi Gerekli',
    },
    {
      route: 'tv' as AppRoute,
      url: `qradv.com/tv/${venue.slug.replace('_ana-menu', '')}_tv`,
      title: 'Menuboard TV Yayını',
      sub: 'Akıllı ekranlar ve dijital pano yayını',
      icon: <Tv className="w-5 h-5 text-blue-400" />,
      badge: 'TV Menuboard',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      status: 'Canlı Ekran',
    },
    {
      route: 'radio' as AppRoute,
      url: `qradv.com/radyo/${venue.slug.replace('_ana-menu', '')}_radio`,
      title: 'Mekan Canlı Radyo',
      sub: 'Arka plan müzik akışı ve anons sistemi',
      icon: <Radio className="w-5 h-5 text-emerald-400" />,
      badge: 'Radyo Yayını',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      status: 'Kesintisiz Müzik',
    },
  ];

  return (
    <>
      {/* Sleek Floating Portal Switcher Badge (Bottom Right) */}
      <aside aria-label="Portal Simülatörü" className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="group px-3.5 py-2 rounded-2xl bg-neutral-900/95 hover:bg-neutral-800 text-neutral-100 border border-neutral-700/80 shadow-2xl backdrop-blur-md flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer ring-1 ring-white/10"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="text-left">
            <span className="text-[10px] text-neutral-400 block font-mono">Simüle URL / Portal</span>
            <span className="text-xs font-mono font-bold text-amber-400 group-hover:text-amber-300">
              {getSimulatedUrl()}
            </span>
          </div>
          <div className="p-1.5 rounded-xl bg-neutral-800 text-neutral-300 group-hover:text-white transition-colors">
            <ChevronUp className="w-3.5 h-3.5" />
          </div>
        </button>
      </aside>

      {/* Portal Switcher Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">QRAdv Modüler Portal Yönlendiricisi</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    İzole Girişler
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Müşteri, Restoran Müdürü, POS & KDS Çalışanı ve Süper Admin için ayrı ve bağımsız portallar
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Portals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {portals.map((p) => {
                const isCurrent = currentRoute === p.route;
                return (
                  <button
                    key={p.route}
                    type="button"
                    onClick={() => {
                      setCurrentRoute(p.route);
                      setIsOpen(false);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isCurrent
                        ? 'bg-neutral-800/90 border-amber-500 ring-2 ring-amber-500/40 shadow-lg'
                        : 'bg-neutral-950 hover:bg-neutral-800/50 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                          {p.icon}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{p.title}</span>
                            {isCurrent && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            )}
                          </h4>
                          <span className="text-[10px] font-mono text-amber-400/90">{p.url}</span>
                        </div>
                      </div>

                      {p.alertCount && p.alertCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                          {p.alertCount} Uyarı
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${p.badgeColor}`}>
                          {p.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/60">
                      <span className="line-clamp-1">{p.sub}</span>
                      <span className="text-neutral-500 font-mono text-[10px] shrink-0 ml-2">
                        {p.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Demo Helper & Hostinger Package */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-white font-bold block">Hostinger Hazır Kurulum Dosyaları:</span>
                <p className="text-[11px] text-neutral-400">
                  PHP + MySQL şeması, Apache .htaccess ve hazır derlenmiş public_html arşivi mevcuttur.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsArchitectureModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-amber-400" />
                  <span>PHP & SQL Mimarisi</span>
                </button>

                <a
                  href="/hostinger_hazir_kurulum_public_html.zip"
                  download="hostinger_hazir_kurulum_public_html.zip"
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ZIP İndir</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Architecture Modal */}
      <PhpMysqlArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </>
  );
};
