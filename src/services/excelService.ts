import * as XLSX from 'xlsx';
import { Product, Category, KitchenStation } from '../types';

export interface XlsProductRow {
  kategori_id: string;
  kategori_adi: string;
  urun_adi: string;
  fiyat_try: number;
  aciklama: string;
  istasyon: string; // 'grill' | 'kitchen' | 'beverage' | 'salad' | 'meze'
  alerjenler: string; // comma separated: gluten,lactose,egg
  gorsel_url?: string;
  kalori?: number;
  hazirlama_suresi_dk?: number;
}

export function exportProductsToXlsx(products: Product[], categories: Category[]): void {
  const catMap = new Map(categories.map((c) => [c.id, c.name.tr]));

  const data: XlsProductRow[] = products.map((p) => ({
    kategori_id: p.categoryId,
    kategori_adi: catMap.get(p.categoryId) || p.categoryId,
    urun_adi: p.name.tr,
    fiyat_try: p.price,
    aciklama: p.description.tr,
    istasyon: p.station,
    alerjenler: p.allergenIds.join(', '),
    gorsel_url: p.image,
    kalori: p.calories || 0,
    hazirlama_suresi_dk: p.preparationTime || 10,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ürünler');

  XLSX.writeFile(workbook, `QRAdv_Urun_Listesi_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function downloadSampleProductTemplate(): void {
  const sampleData: XlsProductRow[] = [
    {
      kategori_id: 'cat-burgers',
      kategori_adi: 'Gurme Burgerler',
      urun_adi: 'Örnek Klasik Çizburger',
      fiyat_try: 290,
      aciklama: 'Karamelize soğan, turşu, çedar peyniri ve özel burger sosu',
      istasyon: 'grill',
      alerjenler: 'gluten, lactose',
      gorsel_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      kalori: 650,
      hazirlama_suresi_dk: 12,
    },
    {
      kategori_id: 'cat-beverages',
      kategori_adi: 'İçecekler & Kokteyller',
      urun_adi: 'Ev Yapımı Naneli Limonata',
      fiyat_try: 95,
      aciklama: 'Taze sıkılmış limon suyu, nane yaprakları ve bal ile tatlandırılmış',
      istasyon: 'beverage',
      alerjenler: 'vegan, vegetarian',
      gorsel_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      kalori: 110,
      hazirlama_suresi_dk: 3,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Urun_Sablonu');

  XLSX.writeFile(workbook, 'QRAdv_Urun_Ekleme_Sablonu.xlsx');
}

export async function parseXlsxFile(file: File, categories: Category[]): Promise<Product[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

  const importedProducts: Product[] = [];
  const defaultCategoryId = categories[0]?.id || 'cat-burgers';

  rows.forEach((row, index) => {
    // Flexible header mapping (supporting Turkish or English headers)
    const nameStr = String(row['urun_adi'] || row['Urun Adi'] || row['name'] || row['Ürün Adı'] || '').trim();
    if (!nameStr) return; // skip empty rows

    const price = Number(row['fiyat_try'] || row['Fiyat'] || row['price'] || row['Fiyat (TRY)'] || 0);
    const desc = String(row['aciklama'] || row['Aciklama'] || row['description'] || row['Açıklama'] || '').trim();
    let catId = String(row['kategori_id'] || row['kategori'] || row['category_id'] || '').trim();
    const catName = String(row['kategori_adi'] || row['Kategori Adı'] || '').trim();

    // Check if category name matches an existing category
    if (!catId && catName) {
      const match = categories.find((c) => c.name.tr.toLowerCase() === catName.toLowerCase());
      if (match) catId = match.id;
    }
    if (!catId) catId = defaultCategoryId;

    let station = String(row['istasyon'] || row['station'] || 'kitchen').toLowerCase().trim() as KitchenStation;
    if (!['grill', 'kitchen', 'beverage', 'salad', 'meze'].includes(station)) {
      station = 'kitchen';
    }

    const allergensRaw = String(row['alerjenler'] || row['allergens'] || '').trim();
    const allergenIds = allergensRaw
      ? allergensRaw.split(/[,;\s]+/).map((s) => s.trim().toLowerCase()).filter(Boolean)
      : [];

    const image = String(
      row['gorsel_url'] ||
      row['image'] ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    );

    const calories = Number(row['kalori'] || row['calories'] || 0) || undefined;
    const prepTime = Number(row['hazirlama_suresi_dk'] || row['prep_time'] || 10) || 10;

    importedProducts.push({
      id: `prod-imp-${Date.now()}-${index}`,
      categoryId: catId,
      name: {
        tr: nameStr,
        en: nameStr,
        de: nameStr,
        ru: nameStr,
        ar: nameStr,
        fr: nameStr,
      },
      description: {
        tr: desc || nameStr,
        en: desc || nameStr,
        de: desc || nameStr,
        ru: desc || nameStr,
        ar: desc || nameStr,
        fr: desc || nameStr,
      },
      price: price > 0 ? price : 100,
      image,
      station,
      allergenIds,
      isAvailable: true,
      calories,
      preparationTime: prepTime,
    });
  });

  return importedProducts;
}
