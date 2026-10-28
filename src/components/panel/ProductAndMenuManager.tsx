import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, KitchenStation } from '../../types';
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  Check,
  X,
  AlertTriangle,
  Flame,
  Clock,
  Sliders,
} from 'lucide-react';

export const ProductAndMenuManager: React.FC = () => {
  const { products, setProducts, categories, allergens, formatPrice, addCategory, deleteCategory } =
    useApp();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Category modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatNameTr, setNewCatNameTr] = useState('');
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🍽️');
  const [newCatStation, setNewCatStation] = useState<KitchenStation>('kitchen');

  // Form states
  const [nameTr, setNameTr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descTr, setDescTr] = useState('');
  const [price, setPrice] = useState(150);
  const [image, setImage] = useState('');
  const [station, setStation] = useState<KitchenStation>('kitchen');
  const [catId, setCatId] = useState(categories[0]?.id || '');
  const [allergenIds, setAllergenIds] = useState<string[]>([]);
  const [calories, setCalories] = useState<number>(500);
  const [prepTime, setPrepTime] = useState<number>(10);

  const openNewModal = () => {
    setNameTr('');
    setNameEn('');
    setDescTr('');
    setPrice(220);
    setImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
    setStation('kitchen');
    setCatId(categories[0]?.id || '');
    setAllergenIds([]);
    setCalories(500);
    setPrepTime(10);
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setNameTr(p.name.tr);
    setNameEn(p.name.en);
    setDescTr(p.description.tr);
    setPrice(p.price);
    setImage(p.image);
    setStation(p.station);
    setCatId(p.categoryId);
    setAllergenIds(p.allergenIds);
    setCalories(p.calories || 0);
    setPrepTime(p.preparationTime || 10);
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameTr.trim() || price <= 0) return;

    const newProd: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      categoryId: catId,
      name: {
        tr: nameTr,
        en: nameEn || nameTr,
        de: nameTr,
        ru: nameTr,
        ar: nameTr,
        fr: nameTr,
      },
      description: {
        tr: descTr || nameTr,
        en: descTr || nameTr,
        de: descTr || nameTr,
        ru: descTr || nameTr,
        ar: descTr || nameTr,
        fr: descTr || nameTr,
      },
      price,
      image,
      station,
      allergenIds,
      isAvailable: editingProduct ? editingProduct.isAvailable : true,
      calories: calories || undefined,
      preparationTime: prepTime || undefined,
    };

    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? newProd : p)));
    } else {
      setProducts((prev) => [newProd, ...prev]);
    }

    setIsModalOpen(false);
  };

  const toggleAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isAvailable: !p.isAvailable } : p))
    );
  };

  const handleInlinePriceChange = (id: string, newPrice: number) => {
    if (newPrice < 0) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleAllergen = (aId: string) => {
    if (allergenIds.includes(aId)) {
      setAllergenIds(allergenIds.filter((id) => id !== aId));
    } else {
      setAllergenIds([...allergenIds, aId]);
    }
  };

  // Filter
  const filteredProducts = products.filter((p) => {
    if (selectedCat !== 'all' && p.categoryId !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.tr.toLowerCase().includes(q) || p.description.tr.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            Menü, Ürün & Alerjen Yönetimi
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Hızlı fiyat güncelleme, stok durumu, mutfak istasyonları ve 14 resmi gıda alerjeni
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-1.5 transition-colors border border-neutral-700 shrink-0"
          >
            <span>📁</span>
            <span>Kategori Ekle / Yönet</span>
          </button>

          <button
            onClick={openNewModal}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center gap-1.5 transition-colors shadow-md shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Yeni Ürün Ekle</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ürün adı veya malzeme ara..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-200 focus:outline-none"
        >
          <option value="all">Tüm Kategoriler ({products.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.tr}
            </option>
          ))}
        </select>
      </div>

      {/* Products List (Responsive cards on mobile, table on desktop) */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] font-bold border-b border-neutral-800">
              <tr>
                <th className="p-3">Görsel</th>
                <th className="p-3">Ürün & Kategori</th>
                <th className="p-3">Fiyat (TRY)</th>
                <th className="p-3">İstasyon</th>
                <th className="p-3">Alerjenler</th>
                <th className="p-3">Stok Durumu</th>
                <th className="p-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 bg-neutral-900/60">
              {filteredProducts.map((p) => {
                const category = categories.find((c) => c.id === p.categoryId);
                const productAllergens = allergens.filter((a) => p.allergenIds.includes(a.id));

                return (
                  <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-3">
                      <img
                        src={p.image}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-700 shrink-0"
                      />
                    </td>

                    <td className="p-3 max-w-xs">
                      <div className="font-bold text-white text-xs">{p.name.tr}</div>
                      <div className="text-[10px] text-amber-400 font-medium">
                        {category?.name.tr}
                      </div>
                      <div className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        {p.description.tr}
                      </div>
                    </td>

                    {/* Inline Fast Price Editor */}
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span className="text-neutral-500 font-bold">₺</span>
                        <input
                          type="number"
                          value={p.price}
                          onChange={(e) =>
                            handleInlinePriceChange(p.id, Number(e.target.value))
                          }
                          className="w-20 px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-700 font-mono font-bold text-amber-400 text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </td>

                    {/* Kitchen Station */}
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-cyan-300 font-mono text-[10px] uppercase font-bold border border-neutral-700">
                        {p.station}
                      </span>
                    </td>

                    {/* Allergens badges */}
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {productAllergens.length === 0 ? (
                          <span className="text-[10px] text-neutral-500">Alerjen yok</span>
                        ) : (
                          productAllergens.map((alg) => (
                            <span
                              key={alg.id}
                              className={`text-[9px] px-1.5 py-0.2 rounded border ${alg.color}`}
                              title={alg.description}
                            >
                              {alg.icon} {alg.name.tr}
                            </span>
                          ))
                        )}
                      </div>
                    </td>

                    {/* Stock Status toggle */}
                    <td className="p-3">
                      <button
                        onClick={() => toggleAvailability(p.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                          p.isAvailable
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {p.isAvailable ? 'STOKTA (AKTİF)' : 'TÜKENDİ'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                          title="Ürünü Düzenle"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                          title="Ürünü Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-5 text-neutral-100 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-base text-neutral-100">
                {editingProduct ? 'Ürünü Güncelle' : 'Yeni Menü Ürünü Ekle'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="py-4 space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Ürün Adı (TR) *</label>
                  <input
                    type="text"
                    required
                    value={nameTr}
                    onChange={(e) => setNameTr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Ürün Adı (EN)</label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="İngilizce Adı"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Açıklama / Malzemeler (TR)</label>
                <textarea
                  rows={2}
                  value={descTr}
                  onChange={(e) => setDescTr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Fiyat (TRY) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none focus:border-amber-500 font-bold font-mono text-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Kategori *</label>
                  <select
                    value={catId}
                    onChange={(e) => setCatId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name.tr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Mutfak İstasyonu *</label>
                  <select
                    value={station}
                    onChange={(e) => setStation(e.target.value as KitchenStation)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none"
                  >
                    <option value="grill">🥩 Izgara</option>
                    <option value="kitchen">🍳 Sıcak Mutfak</option>
                    <option value="beverage">🍹 İçecek & Bar</option>
                    <option value="salad">🥗 Salata</option>
                    <option value="meze">🧆 Meze</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Kalori (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    Hazırlama Süresi (dakika)
                  </label>
                  <input
                    type="number"
                    value={prepTime}
                    onChange={(e) => setPrepTime(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Görsel URL</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none font-mono text-[11px]"
                />
              </div>

              {/* 14 Allergen Checkbox Toggles */}
              <div>
                <label className="block text-neutral-300 font-bold mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Alerjen & Diyet Seçimi (14 Standart):</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800 max-h-44 overflow-y-auto no-scrollbar">
                  {allergens.map((alg) => {
                    const isChecked = allergenIds.includes(alg.id);
                    return (
                      <div
                        key={alg.id}
                        onClick={() => toggleAllergen(alg.id)}
                        className={`p-1.5 rounded-lg border cursor-pointer flex items-center justify-between text-[11px] transition-colors ${
                          isChecked
                            ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <span className="flex items-center gap-1 truncate">
                          <span>{alg.icon}</span>
                          <span className="truncate">{alg.name.tr}</span>
                        </span>
                        {isChecked && <Check className="w-3 h-3 text-amber-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black shadow-lg"
                >
                  {editingProduct ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-5 text-neutral-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-sm text-white">Menü Kategorisi Ekle & Yönet</h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of current categories */}
            <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar p-2 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Mevcut Kategoriler:</span>
              {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-1.5 rounded-lg bg-neutral-900 text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-neutral-200">
                    <span>{c.icon}</span>
                    <span>{c.name.tr}</span>
                  </span>
                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="text-neutral-500 hover:text-rose-400 p-1"
                    title="Kategoriyi Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCatNameTr.trim()) return;
                addCategory(newCatNameTr.trim(), newCatNameEn.trim(), newCatIcon, newCatStation);
                setNewCatNameTr('');
                setNewCatNameEn('');
                setIsCategoryModalOpen(false);
              }}
              className="space-y-3 text-xs pt-2 border-t border-neutral-800"
            >
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Yeni Kategori Adı (TR) *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Gurme Dürümler & Kebaplar"
                  value={newCatNameTr}
                  onChange={(e) => setNewCatNameTr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Kategori Adı (EN)</label>
                <input
                  type="text"
                  placeholder="Örn: Gourmet Wraps"
                  value={newCatNameEn}
                  onChange={(e) => setNewCatNameEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Simge / Emoji</label>
                  <select
                    value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none"
                  >
                    <option value="🍔">🍔 Burger</option>
                    <option value="🥩">🥩 Et / Steak</option>
                    <option value="🍕">🍕 Pizza</option>
                    <option value="🌮">🌮 Taco / Dürüm</option>
                    <option value="🥗">🥗 Salata</option>
                    <option value="🧆">🧆 Meze</option>
                    <option value="🍹">🍹 İçecek</option>
                    <option value="🍰">🍰 Tatlı</option>
                    <option value="☕">☕ Kahve</option>
                    <option value="🍳">🍳 Kahvaltı</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Varsayılan İstasyon</label>
                  <select
                    value={newCatStation}
                    onChange={(e) => setNewCatStation(e.target.value as KitchenStation)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 focus:outline-none"
                  >
                    <option value="grill">🥩 Izgara</option>
                    <option value="kitchen">🍳 Sıcak Mutfak</option>
                    <option value="beverage">🍹 İçecek / Bar</option>
                    <option value="salad">🥗 Salata</option>
                    <option value="meze">🧆 Meze</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Kategoriyi Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
