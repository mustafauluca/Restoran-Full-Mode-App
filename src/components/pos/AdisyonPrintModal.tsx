import React from 'react';
import { Order, VenueSettings } from '../../types';
import { Printer, X } from 'lucide-react';

interface AdisyonPrintModalProps {
  order: Order;
  venue: VenueSettings;
  onClose: () => void;
}

export const AdisyonPrintModal: React.FC<AdisyonPrintModalProps> = ({ order, venue, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-5 text-neutral-100 flex flex-col">
        {/* Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-neutral-100">Adisyon / Termal Fiş Önizleme</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Yazdır</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Container (Styled like 80mm roll paper) */}
        <div className="my-4 p-5 bg-white text-black font-mono text-xs rounded-xl shadow-inner max-h-[70vh] overflow-y-auto print:m-0 print:p-0 print:shadow-none print:w-full">
          {/* Header */}
          <div className="text-center space-y-1 border-b-2 border-dashed border-gray-400 pb-3">
            <div className="text-2xl">{venue.logo || '🥩'}</div>
            <h2 className="text-base font-black tracking-wider uppercase">{venue.name}</h2>
            <p className="text-[10px] text-gray-700">{venue.address}</p>
            <p className="text-[10px] text-gray-700">Tel: {venue.phone}</p>
            <div className="inline-block mt-1 px-2 py-0.5 border border-black font-bold text-xs">
              {order.type === 'table' ? `MASA SİPARİŞİ: ${order.tableNumber}` : 'ADRESE PAKET SERVİS'}
            </div>
          </div>

          {/* Ticket metadata */}
          <div className="py-2 border-b border-dashed border-gray-300 text-[11px] space-y-0.5">
            <div className="flex justify-between">
              <span>FİŞ NO:</span>
              <span className="font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>TARİH & SAAT:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span>MÜŞTERİ:</span>
              <span className="font-bold">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>GSM TEL:</span>
              <span>{order.customerPhone}</span>
            </div>

            {order.deliveryAddress && (
              <div className="pt-1 mt-1 border-t border-gray-200">
                <p className="font-bold">TESLİMAT ADRESİ:</p>
                <p className="text-[10px]">
                  {order.deliveryAddress.neighborhood} {order.deliveryAddress.street} No:{order.deliveryAddress.buildingNo} Kat:{order.deliveryAddress.floor} D:{order.deliveryAddress.apartmentNo}
                </p>
                <p className="text-[10px]">{order.deliveryAddress.district} / {order.deliveryAddress.city}</p>
                {order.deliveryAddress.addressDirections && (
                  <p className="text-[10px] italic text-gray-700">Tarif: {order.deliveryAddress.addressDirections}</p>
                )}
              </div>
            )}
          </div>

          {/* Order Items Table */}
          <div className="py-3 border-b-2 border-dashed border-gray-400 space-y-2">
            <div className="flex justify-between font-bold text-[11px] border-b border-gray-300 pb-1">
              <span className="w-8">ADET</span>
              <span className="flex-1">ÜRÜN / AÇIKLAMA</span>
              <span className="w-16 text-right">TUTAR</span>
            </div>

            {order.items.map((it) => (
              <div key={it.id} className="space-y-0.5">
                <div className="flex justify-between items-start text-[11px]">
                  <span className="w-8 font-bold">{it.quantity}x</span>
                  <span className="flex-1 font-semibold pr-2">
                    {it.productName}
                    {it.isFreeCampaignItem && (
                      <span className="block text-[9px] font-black text-gray-800">
                        * [1+1 KAMPANYA HEDİYESİ - 0 TL]
                      </span>
                    )}
                  </span>
                  <span className="w-16 text-right font-bold">
                    {it.price === 0 ? '0 ₺' : `${it.price * it.quantity} ₺`}
                  </span>
                </div>
                {it.itemNote && (
                  <p className="text-[10px] italic text-gray-600 pl-8">
                    Not: {it.itemNote}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Order Note */}
          {order.orderNote && (
            <div className="py-2 border-b border-dashed border-gray-300 text-[10px]">
              <span className="font-bold">SİPARİŞ GENEL NOTU:</span>
              <p className="italic text-gray-800">{order.orderNote}</p>
            </div>
          )}

          {/* Totals */}
          <div className="py-2 space-y-1 text-xs">
            <div className="flex justify-between text-gray-700">
              <span>ARA TOPLAM:</span>
              <span>{order.totalAmount} ₺</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>KDV (%10 DAHİL):</span>
              <span>{(order.totalAmount * 0.1).toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between text-base font-black border-t-2 border-black pt-1">
              <span>TOPLAM TUTAR:</span>
              <span>{order.totalAmount} ₺</span>
            </div>
            <div className="flex justify-between text-[11px] pt-1">
              <span>ÖDEME YOLU:</span>
              <span className="font-bold uppercase">{order.paymentMethod.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Barcode mock and footer */}
          <div className="text-center pt-3 border-t border-dashed border-gray-400 space-y-1">
            <div className="font-mono text-xs tracking-widest font-black">
              ||||| | |||| |||| ||| ||||||| | ||||
            </div>
            <p className="text-[9px] text-gray-600 font-bold">AFİYET OLSUN! TEKRAR BEKLERİZ.</p>
            <p className="text-[8px] text-gray-500">QRAdv Akıllı Restoran ve KDS Sistemleri</p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-neutral-400">
          ESC/POS 80mm ve 58mm termal yazıcılarla doğrudan uyumludur.
        </div>
      </div>
    </div>
  );
};
