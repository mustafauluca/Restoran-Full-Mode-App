import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Flame, Clock, Plus, Minus, Check, AlertTriangle } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, formatPrice, allergens, activeLanguage } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [itemNote, setItemNote] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  // Allergens in this product
  const productAllergens = allergens.filter((a) => product.allergenIds.includes(a.id));

  const handleAdd = () => {
    addToCart(product, quantity, undefined, itemNote || undefined);
    setIsAdded(true);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl text-neutral-100 flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-neutral-950/70 text-neutral-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-56 sm:h-64 w-full bg-neutral-950">
          <img
            src={product.image}
            alt={product.name[activeLanguage] || product.name.tr}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/30" />

          {product.badge && (
            <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[11px] shadow-md">
              {product.badge[activeLanguage] || product.badge.tr}
            </div>
          )}

          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div className="flex items-center gap-2 text-xs">
              {product.calories && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-md text-amber-400 font-semibold border border-neutral-700">
                  <Flame className="w-3.5 h-3.5" />
                  {product.calories} kcal
                </span>
              )}
              {product.preparationTime && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-md text-cyan-400 font-semibold border border-neutral-700">
                  <Clock className="w-3.5 h-3.5" />
                  ~{product.preparationTime} dk
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 flex-1">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                {product.name[activeLanguage] || product.name.tr}
              </h2>
              <span className="text-lg font-black text-amber-400 whitespace-nowrap">
                {formatPrice(product.price)}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
              {product.description[activeLanguage] || product.description.tr}
            </p>
          </div>

          {/* Allergens & Dietary Badges */}
          {productAllergens.length > 0 && (
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Alerjen & Diyet Bilgisi:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {productAllergens.map((alg) => (
                  <span
                    key={alg.id}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${alg.color}`}
                    title={alg.description}
                  >
                    <span>{alg.icon}</span>
                    <span>{alg.name[activeLanguage] || alg.name.tr}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Special Instruction Note */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Ürün Açıklaması / Özel Pişirme Notu:
            </label>
            <input
              type="text"
              value={itemNote}
              onChange={(e) => setItemNote(e.target.value)}
              placeholder="Örn: Az tuzlu, ekmek kızarmış olsun, soğansız..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Footer with quantity and add to cart */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-xl p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm px-2 text-neutral-100">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5" />
                <span>Sepete Eklendi!</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>Sepete Ekle • {formatPrice(totalPrice)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
