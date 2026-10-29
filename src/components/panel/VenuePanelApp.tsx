import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CampaignManager } from './CampaignManager';
import { FlyerStudio } from './FlyerStudio';
import { XlsManager } from './XlsManager';
import { ProductAndMenuManager } from './ProductAndMenuManager';
import { VenueSettingsTab } from './VenueSettingsTab';
import { TableQrManager } from './TableQrManager';
import { PhpMysqlArchitectureModal } from './PhpMysqlArchitectureModal';
import {
  Sparkles,
  FileSpreadsheet,
  FileText,
  UtensilsCrossed,
  Settings,
  Database,
  ExternalLink,
  QrCode,
} from 'lucide-react';

import { VenueManagerLogin } from '../auth/VenueManagerLogin';
import { LogOut, User } from 'lucide-react';

export const VenuePanelApp: React.FC = () => {
  const { venue, setCurrentRoute, venueManagerSession, logoutVenueManager } = useApp();

  const [activeTab, setActiveTab] = useState<
    'campaigns' | 'flyer' | 'xls' | 'menu' | 'tables' | 'settings'
  >('campaigns');

  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  // Dedicated Venue Manager Gate
  if (!venueManagerSession.isAuthenticated) {
    return <VenueManagerLogin />;
  }

  const tabs = [
    {
      id: 'campaigns' as const,
      label: 'Dinamik Kampanyalar (1+1)',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'tables' as const,
      label: 'Masa & QR Kodları',
      icon: <QrCode className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'flyer' as const,
      label: 'PDF Flyer Üretici',
      icon: <FileText className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'xls' as const,
      label: 'XLS / Excel Aktarımı',
      icon: <FileSpreadsheet className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'menu' as const,
      label: 'Menü & Ürünler & Alerjenler',
      icon: <UtensilsCrossed className="w-4 h-4 text-rose-400" />,
    },
    {
      id: 'settings' as const,
      label: 'Restoran & Para Birimleri',
      icon: <Settings className="w-4 h-4 text-purple-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-3 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            {venue.logo || '🥩'}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white">{venue.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                MEKAN SAHİBİ PANELİ
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              URL: <span className="font-mono text-neutral-300">qradv.com/panel</span> • Slug: <span className="font-mono text-amber-400">{venue.slug}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Open customer QR menu in new simulated view */}
          <button
            onClick={() => setCurrentRoute('qr')}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Canlı QR Menüyü Aç</span>
          </button>

          {/* Logged in Manager Info */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-white">{venueManagerSession.email}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={logoutVenueManager}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-neutral-800 pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-md font-black'
                  : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'campaigns' && <CampaignManager />}
        {activeTab === 'tables' && <TableQrManager />}
        {activeTab === 'flyer' && <FlyerStudio />}
        {activeTab === 'xls' && <XlsManager />}
        {activeTab === 'menu' && <ProductAndMenuManager />}
        {activeTab === 'settings' && <VenueSettingsTab />}
      </div>

      {/* PHP & MySQL Architecture Modal */}
      <PhpMysqlArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </div>
  );
};
