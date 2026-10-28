import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { exportProductsToXlsx, downloadSampleProductTemplate, parseXlsxFile } from '../../services/excelService';
import { Product } from '../../types';
import { FileSpreadsheet, Download, Upload, Check, AlertCircle, PlusCircle } from 'lucide-react';

export const XlsManager: React.FC = () => {
  const { products, setProducts, categories } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedPreview, setImportedPreview] = useState<Product[] | null>(null);
  const [importStatus, setImportStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setImportStatus('Dosya okunuyor ve çözümleniyor...');

    try {
      const parsed = await parseXlsxFile(file, categories);
      if (parsed.length === 0) {
        setErrorMsg('Dosyada geçerli ürün satırı bulunamadı. Lütfen şablonu inceleyin.');
        setImportedPreview(null);
      } else {
        setImportedPreview(parsed);
        setImportStatus(`${parsed.length} adet ürün başarıyla okundu. Aşağıdaki listeden onaylayabilirsiniz.`);
      }
    } catch {
      setErrorMsg('Excel dosyası çözümlenirken hata oluştu. Lütfen .xlsx veya .csv dosya formatı kullanın.');
      setImportedPreview(null);
    }
  };

  const handleConfirmImport = (mode: 'append' | 'replace') => {
    if (!importedPreview) return;

    if (mode === 'replace') {
      setProducts(importedPreview);
    } else {
      setProducts((prev) => [...prev, ...importedPreview]);
    }

    setImportStatus(
      `Başarılı! ${importedPreview.length} ürün kataloğunuza ${
        mode === 'replace' ? 'tüm ürünlerin yerine' : 'mevcut ürünlerin sonuna'
      } eklendi.`
    );
    setImportedPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Excel (.XLSX) ve CSV İle Toplu Ürün Aktarımı
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Yüzlerce ürünü, fiyatları, istasyonları ve alerjenleri saniyeler içinde içe/dışa aktarın
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Download Sample Template */}
          <button
            onClick={downloadSampleProductTemplate}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-bold text-neutral-200 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Örnek Excel Şablonu İndir</span>
          </button>

          {/* Export Catalog to XLSX */}
          <button
            onClick={() => exportProductsToXlsx(products, categories)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Kataloğu Excel Olarak İndir ({products.length} Ürün)</span>
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-4">
        <div className="max-w-md mx-auto space-y-2">
          <div className="w-12 h-12 rounded-full bg-neutral-800 text-emerald-400 mx-auto flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Excel veya CSV Dosyanızı Yükleyin</h3>
          <p className="text-xs text-neutral-400">
            Sütunlar: <span className="font-mono text-neutral-300">kategori_adi, urun_adi, fiyat_try, aciklama, istasyon, alerjenler, gorsel_url</span>
          </p>

          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="hidden"
            id="xlsx-upload-input"
          />

          <label
            htmlFor="xlsx-upload-input"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs cursor-pointer shadow-lg transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Bilgisayardan Dosya Seç (.xlsx / .csv)</span>
          </label>
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-neutral-950 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Preview Table of Imported Rows */}
      {importedPreview && (
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                İçe Aktarılacak Ürünler Önizlemesi ({importedPreview.length} adet)
              </h3>
              <p className="text-xs text-neutral-400">
                Lütfen verileri gözden geçirin ve nasıl aktarılacağını seçin:
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleConfirmImport('append')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Mevcut Menüye Ekle (+{importedPreview.length})</span>
              </button>
              <button
                onClick={() => handleConfirmImport('replace')}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-rose-300 font-bold text-xs border border-rose-500/30"
                title="Tüm mevcut ürünleri silip yerine sadece bu listedekileri koyar"
              >
                Kataloğu Sıfırla ve Değiştir
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-neutral-800 max-h-72">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-950 text-neutral-400 font-bold uppercase text-[10px] border-b border-neutral-800">
                <tr>
                  <th className="p-2.5">Görsel</th>
                  <th className="p-2.5">Ürün Adı</th>
                  <th className="p-2.5">Fiyat</th>
                  <th className="p-2.5">İstasyon</th>
                  <th className="p-2.5">Alerjenler</th>
                  <th className="p-2.5">Açıklama</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 bg-neutral-900/60">
                {importedPreview.map((item, idx) => (
                  <tr key={idx} className="hover:bg-neutral-800/50">
                    <td className="p-2.5">
                      <img
                        src={item.image}
                        alt=""
                        className="w-8 h-8 rounded object-cover bg-neutral-800"
                      />
                    </td>
                    <td className="p-2.5 font-bold text-white whitespace-nowrap">{item.name.tr}</td>
                    <td className="p-2.5 font-mono text-amber-400 font-bold whitespace-nowrap">
                      {item.price} ₺
                    </td>
                    <td className="p-2.5 whitespace-nowrap uppercase font-mono text-[10px] text-cyan-300">
                      {item.station}
                    </td>
                    <td className="p-2.5 text-[11px] text-rose-300 whitespace-nowrap">
                      {item.allergenIds.join(', ') || 'Yok'}
                    </td>
                    <td className="p-2.5 text-neutral-400 text-[11px] max-w-xs truncate">
                      {item.description.tr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
