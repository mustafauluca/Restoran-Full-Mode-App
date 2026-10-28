import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CreditCard, Droplets, BookOpen, X, CheckCircle2 } from 'lucide-react';

interface WaiterCallModalProps {
  onClose: () => void;
}

export const WaiterCallModal: React.FC<WaiterCallModalProps> = ({ onClose }) => {
  const { selectedTable, setSelectedTable, callWaiter } = useApp();

  const [callType, setCallType] = useState<'waiter' | 'bill' | 'water' | 'menu'>('waiter');
  const [isSuccess, setIsSuccess] = useState(false);

  const tables = [
    'Masa 1',
    'Masa 2',
    'Masa 3',
    'Masa 4',
    'Masa 5',
    'Masa 6',
    'Bahçe 1',
    'Bahçe 2',
    'Bahçe 3',
    'Teras 1',
    'Teras 2',
  ];

  const handleSendCall = () => {
    callWaiter(selectedTable, callType);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const options = [
    {
      type: 'waiter' as const,
      label: 'Garson Çağır',
      desc: 'Masanıza servis elemanı gelsin',
      icon: <Bell className="w-5 h-5 text-amber-400" />,
    },
    {
      type: 'bill' as const,
      label: 'Hesap İste',
      desc: 'Nakit veya POS cihazı ile hesap',
      icon: <CreditCard className="w-5 h-5 text-emerald-400" />,
    },
    {
      type: 'water' as const,
      label: 'Su Rica Et',
      desc: 'Soğuk su servisi talebi',
      icon: <Droplets className="w-5 h-5 text-cyan-400" />,
    },
    {
      type: 'menu' as const,
      label: 'Fiziksel Menü',
      desc: 'Basılı kağıt menü veya alerjen listesi',
      icon: <BookOpen className="w-5 h-5 text-purple-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-5 text-neutral-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-neutral-100">Çağrınız İletildi!</h3>
            <p className="text-xs text-neutral-400">
              {selectedTable} için garson ekranına ve POS paneline sesli bildirim ulaştırıldı. Kısa sürede masanızdayız.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-neutral-100">Masaya Garson Çağır</h3>
                <p className="text-xs text-neutral-400">Tek dokunuşla salon personeline anında bildirim gönderin</p>
              </div>
            </div>

            {/* Table Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Masa Numaranız:
              </label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-sm font-semibold text-neutral-100 focus:outline-none focus:border-amber-500"
              >
                {tables.map((tbl) => (
                  <option key={tbl} value={tbl}>
                    {tbl}
                  </option>
                ))}
              </select>
            </div>

            {/* Call Type Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-300">
                Çağrı Sebebi:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {options.map((opt) => {
                  const isSelected = callType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setCallType(opt.type)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/30'
                          : 'bg-neutral-800/80 border-neutral-700/80 hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {opt.icon}
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-amber-500 bg-amber-500' : 'border-neutral-600'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-xs text-neutral-100">{opt.label}</div>
                        <div className="text-[10px] text-neutral-400 leading-tight">{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSendCall}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              <Bell className="w-4 h-4" />
              <span>Çağrıyı Gönder ({selectedTable})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
