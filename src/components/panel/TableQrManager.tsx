import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, Plus, Trash2, Printer, ExternalLink, Sparkles, Check } from 'lucide-react';

export const TableQrManager: React.FC = () => {
  const { venue, tables, addTable, deleteTable, setSelectedTable, setCurrentRoute } = useApp();

  const [newTableName, setNewTableName] = useState('');
  const [selectedTableForPrint, setSelectedTableForPrint] = useState<string | null>(null);

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;
    addTable(newTableName.trim());
    setNewTableName('');
  };

  const handleOpenTableMenu = (tblName: string) => {
    setSelectedTable(tblName);
    setCurrentRoute('qr');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Masa Yönetimi & Masa Bazlı QR Kod Üretici
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Her masa için özel kodlu QR üretin, masa üstü pleksi kartları yazdırın veya anında simüle edin
            </p>
          </div>
        </div>

        {/* Add Table Form */}
        <form onSubmit={handleAddTable} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Örn: VIP Masa 1, Teras 4..."
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center gap-1 transition-colors shadow-md shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Masa Ekle</span>
          </button>
        </form>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {tables.map((tbl) => {
          const tableQrLink = `https://qradv.com/qr/${venue.slug}?table=${encodeURIComponent(tbl)}`;

          return (
            <div
              key={tbl}
              className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-base text-white">{tbl}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AKTİF MASA
                </span>
              </div>

              {/* QR Mock graphic box */}
              <div className="p-3 bg-white text-black rounded-xl text-center space-y-1 shadow-inner">
                <QrCode className="w-24 h-24 mx-auto text-neutral-950" />
                <span className="font-mono text-[9px] font-bold block truncate text-neutral-700">
                  {tbl} QR KODU
                </span>
              </div>

              {/* Link */}
              <p className="font-mono text-[10px] text-neutral-400 truncate">
                {tableQrLink}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800">
                <button
                  onClick={() => handleOpenTableMenu(tbl)}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Bu masanın menüsünü aç"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test Et</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedTableForPrint(tbl)}
                    className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors"
                    title="Masa Çadır Kartı / QR Yazdır"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteTable(tbl)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                    title="Masayı Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable Table Tent Card Modal */}
      {selectedTableForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-5 text-neutral-100 flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="font-bold text-xs text-neutral-300">
                Masa Çadır Kartı (Pleksi Baskı Hazır)
              </span>
              <button
                onClick={() => setSelectedTableForPrint(null)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Kapat
              </button>
            </div>

            {/* Printable Card Area */}
            <div className="p-6 bg-white text-black rounded-2xl shadow-2xl text-center space-y-3 font-sans print:m-0 print:p-0">
              <div className="text-3xl">{venue.logo || '🥩'}</div>
              <h2 className="text-base font-black tracking-wider uppercase">{venue.name}</h2>
              <div className="inline-block px-3 py-1 rounded-full bg-neutral-950 text-white font-black text-xs">
                {selectedTableForPrint}
              </div>

              <div className="p-2 border-2 border-dashed border-gray-400 rounded-xl inline-block my-2">
                <QrCode className="w-36 h-36 mx-auto text-black" />
              </div>

              <p className="text-xs font-black text-gray-900 uppercase">
                MENÜYÜ İNCELE & SİPARİŞ VER
              </p>
              <p className="text-[10px] text-gray-600">
                Kameranızı açarak QR kodu okutun. 1+1 kampanyalarını kaçırmayın!
              </p>

              {venue.wifiName && (
                <div className="pt-2 border-t border-gray-300 text-[10px] text-gray-700 font-mono">
                  <span>Wi-Fi: {venue.wifiName}</span> • <span>Şifre: {venue.wifiPassword}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır / PDF Olarak Kaydet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
