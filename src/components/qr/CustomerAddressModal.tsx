import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SavedAddress } from '../../types';
import { MapPin, Plus, Trash2, Check, X, Building, Home, Briefcase } from 'lucide-react';

interface CustomerAddressModalProps {
  onClose: () => void;
  onSelectAddress?: (address: SavedAddress) => void;
}

export const CustomerAddressModal: React.FC<CustomerAddressModalProps> = ({
  onClose,
  onSelectAddress,
}) => {
  const { customer, addAddress, deleteAddress, updateCustomerProfile } = useApp();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [fullName, setFullName] = useState(customer.fullName || '');
  const [phone, setPhone] = useState(customer.phone || '');

  // New address form state
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('İstanbul');
  const [district, setDistrict] = useState('Beşiktaş');
  const [neighborhood, setNeighborhood] = useState('');
  const [street, setStreet] = useState('');
  const [buildingNo, setBuildingNo] = useState('');
  const [floor, setFloor] = useState('');
  const [apartmentNo, setApartmentNo] = useState('');
  const [directions, setDirections] = useState('');

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !neighborhood.trim() || !street.trim()) return;

    updateCustomerProfile(fullName, phone);

    addAddress({
      title: title.trim(),
      fullName: fullName.trim() || customer.fullName,
      phone: phone.trim() || customer.phone,
      city,
      district,
      neighborhood: neighborhood.trim(),
      street: street.trim(),
      buildingNo: buildingNo.trim(),
      floor: floor.trim(),
      apartmentNo: apartmentNo.trim(),
      addressDirections: directions.trim() || undefined,
      isDefault: customer.savedAddresses.length === 0,
    });

    setIsAddingNew(false);
    // Reset form
    setTitle('');
    setNeighborhood('');
    setStreet('');
    setBuildingNo('');
    setFloor('');
    setApartmentNo('');
    setDirections('');
  };

  const getAddressIcon = (titleStr: string) => {
    const lower = titleStr.toLowerCase();
    if (lower.includes('iş') || lower.includes('ofis') || lower.includes('şirket')) {
      return <Briefcase className="w-4 h-4 text-blue-400" />;
    }
    if (lower.includes('yazlık') || lower.includes('bina')) {
      return <Building className="w-4 h-4 text-emerald-400" />;
    }
    return <Home className="w-4 h-4 text-amber-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-5 text-neutral-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-100">Müdavim Müşteri Adreslerim</h3>
              <p className="text-xs text-neutral-400">Hızlı teslimat için kayıtlı adreslerinizi yönetin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 space-y-4 flex-1">
          {/* Customer Personal Details */}
          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
              Müdavim İletişim Bilgileri
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-0.5">Adınız Soyadınız</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ad Soyad"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-0.5">GSM Telefon</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XX XXX XX XX"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Saved Addresses List */}
          {!isAddingNew && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300">
                  Kayıtlı Adresler ({customer.savedAddresses.length})
                </span>
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yeni Adres Ekle</span>
                </button>
              </div>

              {customer.savedAddresses.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  Henüz kayıtlı bir adresiniz yok. Yukarıdaki butondan ekleyebilirsiniz.
                </div>
              ) : (
                customer.savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-3.5 rounded-xl bg-neutral-800/70 border border-neutral-700 hover:border-cyan-500/50 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-neutral-900 shrink-0">
                        {getAddressIcon(addr.title)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-neutral-100">{addr.title}</h4>
                          {addr.isDefault && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Varsayılan
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-300 mt-1 leading-snug">
                          {addr.neighborhood} {addr.street} No: {addr.buildingNo} Kat: {addr.floor} Daire: {addr.apartmentNo}
                        </p>
                        <p className="text-[11px] text-neutral-400">
                          {addr.district} / {addr.city}
                        </p>
                        {addr.addressDirections && (
                          <p className="text-[11px] text-amber-400/90 mt-1 italic">
                            Tarif: {addr.addressDirections}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      {onSelectAddress && (
                        <button
                          onClick={() => {
                            onSelectAddress(addr);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Seç</span>
                        </button>
                      )}
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="p-1 rounded text-neutral-500 hover:text-rose-400 self-end transition-colors"
                        title="Adresi Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* New Address Form */}
          {isAddingNew && (
            <form onSubmit={handleSaveNewAddress} className="space-y-3 p-3.5 bg-neutral-950 rounded-xl border border-neutral-700">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-xs font-bold text-cyan-400">Yeni Müdavim Adresi</span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  İptal
                </button>
              </div>

              <div>
                <label className="text-[11px] text-neutral-300 block mb-0.5">
                  Adres Başlığı (Örn: Evim, Ofis Maslak, Yazlık) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Evim Beşiktaş"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-neutral-300 block mb-0.5">İl</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-300 block mb-0.5">İlçe</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-neutral-300 block mb-0.5">Mahalle / Bölge *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Sinanpaşa Mah."
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-300 block mb-0.5">Cadde / Sokak *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Şair Nedim Cad."
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-neutral-300 block mb-0.5">Bina / Kapı No *</label>
                  <input
                    type="text"
                    required
                    placeholder="14"
                    value={buildingNo}
                    onChange={(e) => setBuildingNo(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-300 block mb-0.5">Kat</label>
                  <input
                    type="text"
                    placeholder="3"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-300 block mb-0.5">Daire No</label>
                  <input
                    type="text"
                    placeholder="7"
                    value={apartmentNo}
                    onChange={(e) => setApartmentNo(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-neutral-300 block mb-0.5">
                  Kurye İçin Adres Tarifi / Ekstra Not
                </label>
                <input
                  type="text"
                  placeholder="Örn: Parkın karşısındaki yeşil bina, zile basmayın bebek uyuyor"
                  value={directions}
                  onChange={(e) => setDirections(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-100 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-md mt-2 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Adresi Kaydet</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
