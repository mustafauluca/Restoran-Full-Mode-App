import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  UtensilsCrossed,
  MapPin,
  X,
  Sparkles,
} from 'lucide-react';

export const OrderTrackingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { activeTrackedOrder, orders, formatPrice } = useApp();

  if (!activeTrackedOrder) return null;

  // Find updated state from global orders array
  const currentOrder = orders.find((o) => o.id === activeTrackedOrder.id) || activeTrackedOrder;

  const steps = [
    {
      id: 'pending',
      title: 'Sipariş İletildi',
      desc: 'Mutfak onayladı',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      id: 'preparing',
      title: 'Mutfakta Hazırlanıyor',
      desc: 'Şef ve istasyonlar hazırlıyor',
      icon: <ChefHat className="w-5 h-5" />,
    },
    {
      id: 'ready',
      title: currentOrder.type === 'table' ? 'Masaya Geliyor' : 'Kuryede',
      desc: currentOrder.type === 'table' ? `${currentOrder.tableNumber} masanıza servis ediliyor` : 'Adresinize doğru yolda',
      icon: <UtensilsCrossed className="w-5 h-5" />,
    },
    {
      id: 'delivered',
      title: 'Afiyet Olsun!',
      desc: 'Sipariş tamamlandı',
      icon: <Sparkles className="w-5 h-5" />,
    },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(currentOrder.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-5 sm:p-6 text-neutral-100 flex flex-col space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-amber-400 text-sm">
                {currentOrder.orderNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                {currentOrder.type === 'table' ? currentOrder.tableNumber : 'Adrese Paket'}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">Canlı Sipariş Takip Ekranı</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Stepper */}
        <div className="grid grid-cols-4 gap-2 text-center py-2 relative">
          {steps.map((st, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={st.id} className="flex flex-col items-center space-y-1.5 relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCurrent
                      ? 'border-amber-400 bg-amber-500 text-neutral-950 font-black shadow-lg scale-110 animate-bounce'
                      : isCompleted
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-400'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-600'
                  }`}
                >
                  {st.icon}
                </div>
                <span
                  className={`text-[11px] font-bold leading-tight ${
                    isCurrent
                      ? 'text-amber-400'
                      : isCompleted
                      ? 'text-neutral-200'
                      : 'text-neutral-500'
                  }`}
                >
                  {st.title}
                </span>
                <span className="text-[9px] text-neutral-400 line-clamp-1">{st.desc}</span>
              </div>
            );
          })}
        </div>

        {/* Order Details Accordion / List */}
        <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-neutral-400 pb-1.5 border-b border-neutral-800">
            <span>Sipariş Kalemleri ({currentOrder.items.length})</span>
            <span className="font-mono text-amber-400 font-bold">
              {formatPrice(currentOrder.totalAmount)}
            </span>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
            {currentOrder.items.map((it) => (
              <div key={it.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-bold text-amber-400">{it.quantity}x</span>
                  <span className="truncate text-neutral-200">{it.productName}</span>
                  {it.isFreeCampaignItem && (
                    <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-300 font-bold shrink-0">
                      1+1 HEDİYE
                    </span>
                  )}
                </div>
                <span className="font-mono font-semibold text-neutral-400 shrink-0">
                  {it.price === 0 ? '0 ₺' : `${it.price * it.quantity} ₺`}
                </span>
              </div>
            ))}
          </div>

          {currentOrder.orderNote && (
            <p className="text-[11px] italic text-neutral-400 pt-1 border-t border-neutral-800/80">
              Not: {currentOrder.orderNote}
            </p>
          )}
        </div>

        {/* Bottom Status Message */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
          <Clock className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            {currentStepIdx === 0
              ? 'Siparişiniz sıraya alındı, mutfak onaylıyor.'
              : currentStepIdx === 1
              ? 'Yemeğiniz taze hazırlanıyor, ortalama 8-12 dakika içinde hazır olacaktır.'
              : currentStepIdx === 2
              ? 'Siparişiniz hazırlandı, servis personeli masanıza yönlendirildi!'
              : 'Afiyet olsun! Hesabı masadan tek tuşla isteyebilirsiniz.'}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs transition-colors"
        >
          Pencereyi Kapat (Menüye Dön)
        </button>
      </div>
    </div>
  );
};
