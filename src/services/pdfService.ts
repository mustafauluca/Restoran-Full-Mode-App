import jsPDF from 'jspdf';
import { Campaign, Product, VenueSettings, Category } from '../types';

export interface FlyerOptions {
  theme: 'modern_dark' | 'bistro_vintage' | 'neon_punch' | 'minimal_white';
  headline?: string;
  subheadline?: string;
  featuredCampaign?: Campaign;
  featuredProducts: Product[];
  venue: VenueSettings;
  categories: Category[];
  qrUrl: string;
}

export function generateFlyerPdf(options: FlyerOptions): void {
  const { theme, venue, featuredCampaign, featuredProducts, qrUrl } = options;
  // A4 dimensions in mm: 210 x 297
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;

  // Theme palettes
  const palettes = {
    modern_dark: {
      bg: [15, 17, 23],
      headerBg: [24, 28, 38],
      cardBg: [28, 32, 45],
      accent: [245, 158, 11], // amber-500
      accentRed: [239, 68, 68], // red-500
      textPrimary: [255, 255, 255],
      textSecondary: [156, 163, 175],
      badgeBg: [239, 68, 68],
      badgeText: [255, 255, 255],
    },
    bistro_vintage: {
      bg: [250, 246, 238],
      headerBg: [45, 26, 17],
      cardBg: [255, 255, 255],
      accent: [180, 83, 9], // warm amber/brown
      accentRed: [185, 28, 28],
      textPrimary: [40, 25, 20],
      textSecondary: [100, 80, 70],
      badgeBg: [185, 28, 28],
      badgeText: [255, 255, 255],
    },
    neon_punch: {
      bg: [10, 10, 15],
      headerBg: [20, 15, 35],
      cardBg: [25, 20, 42],
      accent: [236, 72, 153], // pink
      accentRed: [168, 85, 247], // purple
      textPrimary: [255, 255, 255],
      textSecondary: [200, 200, 220],
      badgeBg: [236, 72, 153],
      badgeText: [255, 255, 255],
    },
    minimal_white: {
      bg: [255, 255, 255],
      headerBg: [245, 245, 245],
      cardBg: [250, 250, 250],
      accent: [0, 0, 0],
      accentRed: [220, 38, 38],
      textPrimary: [17, 24, 39],
      textSecondary: [75, 85, 99],
      badgeBg: [220, 38, 38],
      badgeText: [255, 255, 255],
    },
  };

  const pal = palettes[theme] || palettes.modern_dark;

  // Background
  doc.setFillColor(pal.bg[0], pal.bg[1], pal.bg[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Decorative Header Banner
  doc.setFillColor(pal.headerBg[0], pal.headerBg[1], pal.headerBg[2]);
  doc.rect(0, 0, pageWidth, 48, 'F');

  // Accent Line
  doc.setFillColor(pal.accent[0], pal.accent[1], pal.accent[2]);
  doc.rect(0, 47, pageWidth, 1.5, 'F');

  // Restaurant Brand & Tagline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(pal.textPrimary[0], pal.textPrimary[1], pal.textPrimary[2]);
  doc.text(venue.name.toUpperCase(), 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(pal.textSecondary[0], pal.textSecondary[1], pal.textSecondary[2]);
  doc.text(venue.tagline, 14, 26);
  doc.text(`Tel: ${venue.phone}  |  ${venue.address.slice(0, 50)}...`, 14, 33);
  doc.text(`Wi-Fi: ${venue.wifiName || 'Mevcut'}  (Şifre: ${venue.wifiPassword || 'Misafir'})`, 14, 40);

  // Big QR Code Box on Header right
  doc.setFillColor(pal.cardBg[0], pal.cardBg[1], pal.cardBg[2]);
  doc.roundedRect(pageWidth - 48, 8, 36, 32, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(pal.accent[0], pal.accent[1], pal.accent[2]);
  doc.text('MENUYU TARA', pageWidth - 44, 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(pal.textSecondary[0], pal.textSecondary[1], pal.textSecondary[2]);
  doc.text('Masa & Adrese Siparis', pageWidth - 46, 20);
  doc.text('qradv.com/qr', pageWidth - 42, 26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(pal.textPrimary[0], pal.textPrimary[1], pal.textPrimary[2]);
  doc.text('[ QR KOD ]', pageWidth - 39, 34);

  let currentY = 56;

  // DYNAMIC CAMPAIGN SECTION (Big Visual Card)
  if (featuredCampaign && featuredCampaign.isActive) {
    doc.setFillColor(pal.cardBg[0], pal.cardBg[1], pal.cardBg[2]);
    doc.roundedRect(14, currentY, pageWidth - 28, 48, 3, 3, 'F');

    // Campaign Badge
    doc.setFillColor(pal.badgeBg[0], pal.badgeBg[1], pal.badgeBg[2]);
    doc.roundedRect(18, currentY + 6, 52, 8, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(pal.badgeText[0], pal.badgeText[1], pal.badgeText[2]);
    doc.text(featuredCampaign.badgeText.tr, 22, currentY + 11.5);

    // Campaign Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(pal.textPrimary[0], pal.textPrimary[1], pal.textPrimary[2]);
    doc.text(featuredCampaign.title.tr.slice(0, 45), 18, currentY + 22);

    // Subtitle & Details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(pal.accent[0], pal.accent[1], pal.accent[2]);
    doc.text(featuredCampaign.subtitle.tr.slice(0, 75), 18, currentY + 29);

    doc.setFontSize(8);
    doc.setTextColor(pal.textSecondary[0], pal.textSecondary[1], pal.textSecondary[2]);
    doc.text('Siparisinizde es deger veya hediyeli urun 0 TL! Masada ve Paket Serviste gecerlidir.', 18, currentY + 36);
    doc.text(`Gecerlilik: ${featuredCampaign.startDate} / ${featuredCampaign.endDate}`, 18, currentY + 42);

    currentY += 56;
  }

  // FEATURED MENU HIGHLIGHTS SECTION
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(pal.accent[0], pal.accent[1], pal.accent[2]);
  doc.text('GURME LEZZETLER & SEFIN SECIMI', 14, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(pal.textSecondary[0], pal.textSecondary[1], pal.textSecondary[2]);
  doc.text('Taze malzemeler, ozel marinasyon ve hijyen standartlari ile hazirlanir.', 14, currentY + 5);

  currentY += 11;

  // Grid of products (2 columns)
  const items = featuredProducts.slice(0, 6);
  const colWidth = (pageWidth - 34) / 2;

  items.forEach((p, idx) => {
    const isColRight = idx % 2 === 1;
    const x = isColRight ? 14 + colWidth + 6 : 14;
    const y = currentY + Math.floor(idx / 2) * 26;

    // Card background
    doc.setFillColor(pal.cardBg[0], pal.cardBg[1], pal.cardBg[2]);
    doc.roundedRect(x, y, colWidth, 23, 2, 2, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(pal.textPrimary[0], pal.textPrimary[1], pal.textPrimary[2]);
    doc.text(p.name.tr.slice(0, 28), x + 4, y + 6);

    // Price
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(pal.accent[0], pal.accent[1], pal.accent[2]);
    doc.text(`${p.price} TL`, x + colWidth - 18, y + 6);

    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(pal.textSecondary[0], pal.textSecondary[1], pal.textSecondary[2]);
    const shortDesc = p.description.tr.slice(0, 55) + '...';
    doc.text(shortDesc, x + 4, y + 12);

    // Badges / Allergens
    doc.setFontSize(6.5);
    doc.setTextColor(pal.accentRed[0], pal.accentRed[1], pal.accentRed[2]);
    const allergensStr = p.allergenIds.length ? `Alerjen: ${p.allergenIds.slice(0, 3).join(', ')}` : 'Alerjen icermez';
    doc.text(allergensStr, x + 4, y + 18);

    if (p.calories) {
      doc.setTextColor(pal.textSecondary[0], pal.textSecondary[1], pal.textSecondary[2]);
      doc.text(`${p.calories} kcal`, x + colWidth - 18, y + 18);
    }
  });

  currentY += Math.ceil(items.length / 2) * 26 + 6;

  // BOTTOM BANNER / HOW TO ORDER
  doc.setFillColor(pal.headerBg[0], pal.headerBg[1], pal.headerBg[2]);
  doc.roundedRect(14, pageHeight - 34, pageWidth - 28, 24, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(pal.textPrimary[0], pal.textPrimary[1], pal.textPrimary[2]);
  doc.text('NASIL SIPARIS VERILIR?', 20, pageHeight - 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(pal.textSecondary[0], pal.textSecondary[1], pal.textSecondary[2]);
  doc.text('1. Masanizdaki QR kodu telefon kameranizla okutun.', 20, pageHeight - 18);
  doc.text('2. 1+1 Kampanyasini secin, sepete ekleyin ve garson cagirmadan aninda siparis verin!', 20, pageHeight - 13);
  doc.text(`Online Menü: ${qrUrl}`, pageWidth - 90, pageHeight - 18);
  doc.text('Powered by QRAdv Omni OS', pageWidth - 65, pageHeight - 13);

  // Save PDF file
  const fileName = `QRAdv_Flyer_${venue.slug}_${theme}.pdf`;
  doc.save(fileName);
}
