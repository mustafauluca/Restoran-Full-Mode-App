import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SavedAddress, PaymentMethod } from '../../types';
import { CustomerAddressModal } from './CustomerAddressModal';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MapPin,
  UtensilsCrossed,
  CreditCard,
  Banknote,
  Check,
  ShoppingBag,
  Sparkles,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    updateCartItemQty,
    removeFromCart,
    clearCart,
    cartTotal,
    venue,
    formatPrice,
    isInsideRestaurant,
    selectedTable,
    setSelectedTable,
    customer,
    createOrder,
    activeLanguage,
    computedDeliveryFee,
    checkOrderQuota,
  } = useApp();

  const [orderNote, setOrderNote] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | undefined>(
    customer.savedAddresses[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [lastOrderNum, setLastOrderNum] = useState('');

  if (!isOpen) return null;

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

  const deliveryFee = isInsideRestaurant ? 0 : computedDeliveryFee;
  const grandTotal = cartTotal + deliveryFee;
  const quotaResult = checkOrderQuota(isInsideRestaurant ? 'table' : 'delivery');
  const isFreeDeliveryEligible = !isInsideRestaurant && venue.freeDeliveryThreshold > 0 && cartTotal >= venue.freeDeliveryThreshold;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    if (!isInsideRestaurant && !selectedAddress) {
      setShowAddressModal(true);
      return;
    }

    const newOrder = createOrder(
      isInsideRestaurant ? 'table' : 'delivery',
      paymentMethod,
      orderNote || undefined,
      isInsideRestaurant ? selectedTable : undefined,
      !isInsideRestaurant ? selectedAddress : undefined
    );

    setLastOrderNum(newOrder.orderNumber);
    setIsOrderSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 text-neutral-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-neutral-100">Sepetiniz</h3>
                <p className="text-xs text-neutral-400">
                  {cart.length} çeşit ürün • {isInsideRestaurant ? 'Masaya Sipariş' : 'Adrese Paket Teslimat'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && !isOrderSubmitted && (
                <button
                  onClick={clearCart}
                  className="text-xs text-neutral-400 hover:text-rose-400 px-2 py-1 rounded transition-colors"
                  title="Sepeti Boşalt"
                >
                  Boşalt
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Success Screen after submission */}
          {isOrderSubmitted ? (
            <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Sipariş No: {lastOrderNum}
                </span>
                <h3 className="text-xl font-black text-white mt-2">Siparişiniz Alındı!</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                  {isInsideRestaurant
                    ? `${selectedTable} masanız için sipariş mutfak ve bar ekranlarına sesli olarak iletildi. Afiyet olsun!`
                    : `Siparişiniz kurye ve mutfak ekibine iletildi. Ortalama 25-35 dk içinde adresinizde olacaktır.`}
                </p>
              </div>

              <div className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left text-xs space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Hedef:</span>
                  <span className="font-bold text-neutral-200">
                    {isInsideRestaurant ? selectedTable : selectedAddress?.title}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Ödeme:</span>
                  <span className="font-bold text-neutral-200 capitalize">
                    {paymentMethod.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400 border-t border-neutral-800 pt-2 font-black text-sm">
                  <span>Toplam:</span>
                  <span className="text-amber-400">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsOrderSubmitted(false);
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-colors"
              >
                Menüye Geri Dön
              </button>
            </div>
          ) : (
            <>
              {/* Order Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <UtensilsCrossed className="w-12 h-12 text-neutral-600 mx-auto stroke-1" />
                    <p className="text-sm text-neutral-400">Sepetinizde ürün bulunmuyor.</p>
                    <p className="text-xs text-neutral-500">
                      Menüden 1+1 kampanyalarını veya favori lezzetlerinizi ekleyebilirsiniz.
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className={`p-3 rounded-xl border transition-all ${
                        item.isFreeCampaignItem
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : 'bg-neutral-800/60 border-neutral-700/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name[activeLanguage] || item.product.name.tr}
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-xs text-neutral-100 truncate">
                              {item.product.name[activeLanguage] || item.product.name.tr}
                            </h4>
                            {item.isFreeCampaignItem && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-black bg-emerald-500 text-neutral-950">
                                <Sparkles className="w-2.5 h-2.5" />
                                1+1 HEDİYE
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs font-bold">
                              {item.isFreeCampaignItem ? (
                                <span className="text-emerald-400 font-black">0 ₺ (BEDAVA)</span>
                              ) : (
                                <span className="text-amber-400">
                                  {formatPrice(
                                    item.customPrice !== undefined ? item.customPrice : item.product.price
                                  )}
                                </span>
                              )}
                            </div>

                            {/* Quantity controls */}
                            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-lg p-0.5">
                              <button
                                onClick={() => updateCartItemQty(item.cartItemId, -1)}
                                className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
                              >
                                {item.quantity === 1 ? (
                                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                ) : (
                                  <Minus className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <span className="text-xs font-bold px-1 text-neutral-200">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartItemQty(item.cartItemId, 1)}
                                className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Per-Item Custom Note */}
                          <div className="mt-2 pt-2 border-t border-neutral-700/50">
                            <input
                              type="text"
                              value={item.itemNote || ''}
                              onChange={(e) => {
                                item.itemNote = e.target.value;
                              }}
                              placeholder="Ürün notu: Örn: Az tuzlu, soğansız, sosu bol..."
                              className="w-full text-[11px] px-2 py-1 rounded bg-neutral-950/80 border border-neutral-700/60 text-neutral-300 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Overall Order Note */}
                {cart.length > 0 && (
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      Genel Sipariş Notu / Açıklaması:
                    </label>
                    <textarea
                      rows={2}
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Mutfak ve kurye için özel notunuz (Örn: Çatal bıçak olsun, zile basmayın)..."
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>

              {/* Delivery / Table Settings & Checkout Footer */}
              {cart.length > 0 && (
                <div className="p-4 border-t border-neutral-800 bg-neutral-950 space-y-3 shrink-0">
                  {/* Location Context Option */}
                  {isInsideRestaurant ? (
                    /* Table Selection for Inside Restaurant */
                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="text-[11px] font-bold text-emerald-300">Restorandasınız (Masaya Sipariş)</p>
                          <p className="text-[10px] text-neutral-400">Garson masanıza getirecektir</p>
                        </div>
                      </div>
                      <select
                        value={selectedTable}
                        onChange={(e) => setSelectedTable(e.target.value)}
                        className="px-2 py-1 rounded bg-neutral-900 border border-emerald-500/50 text-xs font-bold text-emerald-200 focus:outline-none"
                      >
                        {tables.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    /* Delivery Address for Outside Restaurant */
                    <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-cyan-400" />
                          <span className="text-[11px] font-bold text-cyan-300">
                            Teslimat Adresi: {selectedAddress?.title || 'Adres Seçilmedi'}
                          </span>
                        </div>
                        <button
                          onClick={() => setShowAddressModal(true)}
                          className="text-[11px] font-bold text-cyan-400 underline hover:text-cyan-300"
                        >
                          Değiştir / Yeni Ekle
                        </button>
                      </div>

                      {selectedAddress ? (
                        <p className="text-[11px] text-neutral-300 truncate">
                          {selectedAddress.neighborhood} {selectedAddress.street} No:{selectedAddress.buildingNo} D:{selectedAddress.apartmentNo} ({selectedAddress.district})
                        </p>
                      ) : (
                        <p className="text-[11px] text-rose-400 font-medium">
                          Lütfen bir teslimat adresi seçin veya ekleyin.
                        </p>
                      )}

                      {/* Quota Error / Warning */}
                      {!quotaResult.valid && (
                        <div className="flex items-start gap-1.5 p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                          <span>{quotaResult.reason}</span>
                        </div>
                      )}

                      {/* Free Delivery Threshold Incentive */}
                      {!isInsideRestaurant && venue.freeDeliveryThreshold > 0 && (
                        <div className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                          isFreeDeliveryEligible
                            ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-300'
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-300'
                        }`}>
                          {isFreeDeliveryEligible ? (
                            <span>🎉 Tebrikler! {formatPrice(venue.freeDeliveryThreshold)} üzeri kurye ÜCRETSİZ!</span>
                          ) : (
                            <span>
                              🚀 {formatPrice(venue.freeDeliveryThreshold - cartTotal)} daha ekleyin, <strong className="text-emerald-400">Kurye 0 ₺</strong> olsun!
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payment Method Selector */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-neutral-400 font-semibold block">Ödeme Yolu:</span>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('credit_card')}
                        className={`p-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                          paymentMethod === 'credit_card'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Kredi Kartı</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('pos_at_door')}
                        className={`p-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                          paymentMethod === 'pos_at_door'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Kapıda / Masada POS</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                          paymentMethod === 'cash'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <Banknote className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Nakit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('sodexo_multinet')}
                        className={`p-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                          paymentMethod === 'sodexo_multinet'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Sodexo / Multinet</span>
                      </button>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1 text-xs border-t border-neutral-800/80 pt-2">
                    <div className="flex justify-between text-neutral-400">
                      <span>Ara Toplam:</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    {!isInsideRestaurant && (
                      <div className="flex justify-between text-neutral-400">
                        <span>Kurye Teslimatı:</span>
                        <span>{deliveryFee === 0 ? <strong className="text-emerald-400">Ücretsiz (0 ₺)</strong> : formatPrice(deliveryFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-black text-neutral-100 pt-1 border-t border-neutral-800">
                      <span>Ödenecek Tutar:</span>
                      <span className="text-amber-400">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  {/* Submit Order Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={!quotaResult.valid || (!isInsideRestaurant && !selectedAddress)}
                    className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
                      quotaResult.valid && (isInsideRestaurant || selectedAddress)
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 cursor-pointer'
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>
                      {isInsideRestaurant
                        ? `Masaya Sipariş Ver (${selectedTable})`
                        : `Adrese Siparişi Onayla`}
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Address Management Modal */}
      {showAddressModal && (
        <CustomerAddressModal
          onClose={() => setShowAddressModal(false)}
          onSelectAddress={(addr) => setSelectedAddress(addr)}
        />
      )}
    </div>
  );
};
