import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, KitchenStation, OrderStatus } from '../../types';
import { AdisyonPrintModal } from './AdisyonPrintModal';
import { soundService } from '../../services/soundService';
import {
  ChefHat,
  Bell,
  Clock,
  Printer,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Utensils,
  MapPin,
  Flame,
  Wine,
  Sparkles,
  LogOut,
  User,
} from 'lucide-react';
import { PosStaffLogin } from '../auth/PosStaffLogin';

export const PosApp: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    updateOrderItemStatus,
    waiterCalls,
    resolveWaiterCall,
    venue,
    formatPrice,
    soundEnabled,
    setSoundEnabled,
    staffSession,
    logoutStaff,
  } = useApp();

  const [activeStation, setActiveStation] = useState<KitchenStation | 'all' | 'cashier'>('all');
  const [activeOrderTypeFilter, setActiveOrderTypeFilter] = useState<'all' | 'table' | 'delivery'>('all');
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);
  const [nowTime, setNowTime] = useState<number>(Date.now());

  // Update timer every 15s to refresh elapsed ticket times
  useEffect(() => {
    const timer = setInterval(() => setNowTime(Date.now()), 15000);
    return () => clearInterval(timer);
  }, []);

  // Enforce Staff PIN Auth Guard
  if (!staffSession || !staffSession.isAuthenticated) {
    return <PosStaffLogin />;
  }

  const activeWaiterCalls = waiterCalls.filter((c) => c.status === 'active');

  // Filter orders by station and order type
  const filteredOrders = orders.filter((order) => {
    // Status filter - keep active orders
    if (order.status === 'delivered' || order.status === 'cancelled') return false;

    // Order type filter
    if (activeOrderTypeFilter !== 'all' && order.type !== activeOrderTypeFilter) {
      return false;
    }

    // Station filter
    if (activeStation !== 'all' && activeStation !== 'cashier') {
      const hasItemForStation = order.items.some((it) => it.station === activeStation);
      if (!hasItemForStation) return false;
    }

    return true;
  });

  const getElapsedMinutes = (dateStr: string) => {
    const diffMs = nowTime - new Date(dateStr).getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  const stations = [
    { id: 'all', label: 'Tüm Mutfak & POS', icon: <ChefHat className="w-4 h-4" /> },
    { id: 'grill', label: 'Izgara Ustası', icon: <Flame className="w-4 h-4 text-orange-400" /> },
    { id: 'kitchen', label: 'Sıcak Mutfak & Pizza', icon: <Utensils className="w-4 h-4 text-amber-400" /> },
    { id: 'beverage', label: 'İçecek & Bar', icon: <Wine className="w-4 h-4 text-cyan-400" /> },
    { id: 'salad', label: 'Salata Reyonu', icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
    { id: 'meze', label: 'Meze Ustası', icon: <Utensils className="w-4 h-4 text-purple-400" /> },
    { id: 'cashier', label: 'Kasa & Garson', icon: <Printer className="w-4 h-4 text-blue-400" /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-3 sm:p-6 space-y-5">
      {/* POS & KDS Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-neutral-950 font-black text-xl shadow-lg">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white">
                Mutfak Yönetim Ekranı (KDS) & Garson POS
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CANLI SİSTEM
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Sesli sipariş uyarısı, istasyon yönlendirme, mutfak tamamlandı butonu ve adisyon fişi
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sound Test Button */}
          <button
            onClick={() => soundService.playNewOrderChime()}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-neutral-300 flex items-center gap-1.5 transition-colors"
            title="Mutfak ses sistemini test et"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Sesi Test Et</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              soundEnabled
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-neutral-800 border-neutral-700 text-neutral-500'
            }`}
          >
            {soundEnabled ? '🔔 Sesli Uyarı: Açık' : '🔕 Sesli Uyarı: Sessiz'}
          </button>

          {/* Table vs Delivery stats */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
            <span className="text-amber-400 font-bold">
              {orders.filter((o) => o.type === 'table' && o.status !== 'delivered').length} Masa
            </span>
            <span className="text-neutral-600">/</span>
            <span className="text-cyan-400 font-bold">
              {orders.filter((o) => o.type === 'delivery' && o.status !== 'delivered').length} Paket
            </span>
          </div>

          {/* Staff Identity Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-white">{staffSession.name}</span>
          </div>

          {/* Logout PIN */}
          <button
            onClick={logoutStaff}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>PIN Çıkış</span>
          </button>
        </div>
      </div>

      {/* ACTIVE WAITER CALLS ALERT BANNER */}
      {activeWaiterCalls.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 shadow-xl space-y-3 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-rose-400 animate-bounce" />
              <h3 className="font-black text-sm text-rose-200">
                Bekleyen Garson Çağrıları ({activeWaiterCalls.length})
              </h3>
            </div>
            <span className="text-xs text-rose-400 font-mono">Sesli Alarm Aktif</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {activeWaiterCalls.map((call) => (
              <div
                key={call.id}
                className="p-3 rounded-xl bg-neutral-900 border border-rose-500/40 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white">{call.tableNumber}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-rose-500/20 text-rose-300 uppercase">
                      {call.callType === 'bill'
                        ? 'Hesap İstendi'
                        : call.callType === 'water'
                        ? 'Su İstendi'
                        : call.callType === 'menu'
                        ? 'Menü İstendi'
                        : 'Garson Çağrısı'}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    {new Date(call.createdAt).toLocaleTimeString('tr-TR')}
                  </p>
                </div>

                <button
                  onClick={() => resolveWaiterCall(call.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-md transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Gidildi</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTER CONTROLS (Stations & Destination) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Stations Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {stations.map((st) => {
            const isActive = activeStation === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setActiveStation(st.id as KitchenStation | 'all' | 'cashier')}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-md'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                {st.icon}
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>

        {/* Order Destination Filter Tabs (Masa vs Paket) */}
        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setActiveOrderTypeFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeOrderTypeFilter === 'all'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Tüm Siparişler
          </button>
          <button
            onClick={() => setActiveOrderTypeFilter('table')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeOrderTypeFilter === 'table'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            🪑 Masaya Sipariş
          </button>
          <button
            onClick={() => setActiveOrderTypeFilter('delivery')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeOrderTypeFilter === 'delivery'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            🛵 Adrese Paket
          </button>
        </div>
      </div>

      {/* KDS KITCHEN TICKETS GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Bekleyen ve Hazırlanan Sipariş Fişleri ({filteredOrders.length})</span>
          <span>Biletler süreye göre otomatik renklenir (Yeşil &lt; 5dk, Sarı 5-15dk, Kırmızı &gt; 15dk)</span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-neutral-900 border border-neutral-800 p-8 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-neutral-100">Şu anda bekleyen sipariş yok</h3>
            <p className="text-xs text-neutral-400">
              Yeni bir sipariş geldiğinde zil ve görsel bilet uyarısı anında ekrana düşecektir.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => {
              const elapsed = getElapsedMinutes(order.createdAt);
              // Urgency color
              const timerColor =
                elapsed >= 15
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : elapsed >= 7
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

              return (
                <div
                  key={order.id}
                  className="rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl flex flex-col justify-between overflow-hidden"
                >
                  {/* Ticket Header */}
                  <div className="p-3.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-white">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                          order.type === 'table'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {order.type === 'table' ? `MASA ${order.tableNumber}` : 'PAKET TESLİMAT'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Timer */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${timerColor}`}
                      >
                        <Clock className="w-3 h-3" />
                        {elapsed} dk
                      </span>

                      {/* Print Adisyon */}
                      <button
                        onClick={() => setSelectedOrderForPrint(order)}
                        className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                        title="Adisyon Fişi Yazdır"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Customer / Destination Info */}
                  <div className="px-3.5 py-2 bg-neutral-900/80 border-b border-neutral-800/60 text-xs text-neutral-400 flex items-center justify-between">
                    <div>
                      <span className="text-neutral-200 font-bold">{order.customerName}</span>
                      <span className="text-[11px] text-neutral-500 ml-1.5">({order.customerPhone})</span>
                    </div>
                    <span className="font-mono text-amber-400 font-bold">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>

                  {/* Delivery address details if delivery order */}
                  {order.deliveryAddress && (
                    <div className="px-3.5 py-1.5 bg-cyan-950/20 border-b border-cyan-900/30 text-[11px] text-cyan-200 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <div className="line-clamp-2">
                        <span className="font-bold">{order.deliveryAddress.title}: </span>
                        {order.deliveryAddress.neighborhood} {order.deliveryAddress.street} No:
                        {order.deliveryAddress.buildingNo} Kat:{order.deliveryAddress.floor} D:
                        {order.deliveryAddress.apartmentNo} ({order.deliveryAddress.district})
                      </div>
                    </div>
                  )}

                  {/* Order General Note */}
                  {order.orderNote && (
                    <div className="px-3.5 py-1.5 bg-amber-950/20 border-b border-amber-900/30 text-[11px] text-amber-200 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">Not: {order.orderNote}</span>
                    </div>
                  )}

                  {/* Ticket Items (KDS items checklist) */}
                  <div className="p-3.5 space-y-2.5 flex-1">
                    {order.items.map((item) => {
                      const isItemDone = item.status === 'done';
                      return (
                        <div
                          key={item.id}
                          className={`p-2 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                            isItemDone
                              ? 'bg-neutral-950/60 border-neutral-800 opacity-60'
                              : 'bg-neutral-800/60 border-neutral-700/60'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-amber-400 text-xs">
                                {item.quantity}x
                              </span>
                              <span
                                className={`text-xs font-bold truncate ${
                                  isItemDone ? 'line-through text-neutral-400' : 'text-neutral-100'
                                }`}
                              >
                                {item.productName}
                              </span>
                              {item.isFreeCampaignItem && (
                                <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                  1+1 HEDİYE
                                </span>
                              )}
                            </div>

                            {/* Item specific note */}
                            {item.itemNote && (
                              <p className="text-[11px] text-amber-300 italic mt-0.5 pl-5">
                                • {item.itemNote}
                              </p>
                            )}

                            {/* Station tag */}
                            <span className="text-[10px] text-neutral-400 uppercase mt-0.5 inline-block pl-5">
                              İstasyon: {item.station}
                            </span>
                          </div>

                          {/* Toggle item done */}
                          <button
                            onClick={() =>
                              updateOrderItemStatus(
                                order.id,
                                item.id,
                                isItemDone ? 'pending' : 'done'
                              )
                            }
                            className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all shrink-0 ${
                              isItemDone
                                ? 'bg-emerald-600 text-white border-emerald-500'
                                : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white'
                            }`}
                            title="Bu kalemi hazır olarak işaretle"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ticket Footer Action Buttons */}
                  <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-2">
                    {/* Status badge */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-neutral-400">Durum:</span>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-xs font-bold text-neutral-200 focus:outline-none"
                      >
                        <option value="pending">Bekliyor</option>
                        <option value="preparing">Hazırlanıyor</option>
                        <option value="ready">Hazır</option>
                        <option value="delivered">Teslim Edildi</option>
                      </select>
                    </div>

                    {/* Complete Button (Mutfak Tamamlandı Butonu) */}
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all ${
                        order.status === 'ready'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{order.status === 'ready' ? 'Hazırlandı' : 'Tamamlandı'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Adisyon Print Modal */}
      {selectedOrderForPrint && (
        <AdisyonPrintModal
          order={selectedOrderForPrint}
          venue={venue}
          onClose={() => setSelectedOrderForPrint(null)}
        />
      )}
    </div>
  );
};
