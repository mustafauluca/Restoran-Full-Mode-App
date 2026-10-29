# QR Adv Enterprise - Hostinger Modüler PHP Kurulum Kılavuzu

Bu kılavuz, projenin **Hostinger Paylaşımlı Hosting (hPanel / cPanel)** veya **VPS / Cloud** sunucularda çalışan saf modüler PHP mimarisi ile kurulması için hazırlanmıştır.

---

## 1. Modüler Klasör Yapısı (Standart PHP Mimarisi)

Tüm dosyalar `public_html` dizini altına standart ve düzenli şekilde yerleştirilmiştir:

```text
public_html/
├── .htaccess                      # Temiz URL yönlendirmeleri (qradv.com/qr, /panel, /pos, /tv, /radyo)
├── index.php                      # Ana Ön Kontrolör (Front Controller)
├── schema.sql                     # 10 tablolu eksiksiz MySQL veritabanı şeması
├── app/
│   ├── core/                      # Genel Çekirdek İşlemler
│   │   ├── Database.php           # PDO MySQL güvenli veritabanı sınıfı
│   │   ├── Router.php             # Hızlı rota yönlendirici (Regex URL dispatcher)
│   │   ├── Session.php            # Güvenli oturum yönetimi (CSRF & XSS korumalı)
│   │   ├── Auth.php               # Süper Admin, Mekan Sahibi & POS PIN yetkilendirme
│   │   └── Helpers.php            # Çeviriler, para formatı, 6 saatlik TCMB kur senkronu
│   ├── languages/                 # Çoklu Dil Destekleri
│   │   ├── tr.php                 # Türkçe dil sözlüğü
│   │   ├── en.php                 # İngilizce dil sözlüğü
│   │   ├── de.php                 # Almanca dil sözlüğü
│   │   ├── ru.php                 # Rusça dil sözlüğü
│   │   └── ar.php                 # Arapça dil sözlüğü (RTL uyumlu)
│   ├── views/                     # Genel Arayüz & Görünümler
│   │   ├── layouts/
│   │   │   ├── header.php         # Standart Tailwind & FontAwesome başlığı
│   │   │   ├── footer.php         # Sayfa altı ve telif hakları
│   │   │   └── 404.php            # 404 Sayfa Bulunamadı arayüzü
│   ├── modules/                   # Ayrı Ayrı Modüller
│   │   ├── qr_menu/index.php      # Müşteri Akıllı QR Menü (1+1 Kampanya, GPS Masa/Adres ayrımı)
│   │   ├── panel/index.php        # Mekan Sahibi Paneli (Sepet Kotaları, Kur Ayarları, Masa Yönetimi)
│   │   ├── manager/index.php      # Sistem Süper Yöneticisi (Tüm mekanlar & SaaS yönetimi)
│   │   ├── pos_kds/index.php      # Dokunmatik POS, Garson, Kasa & Mutfak Ekranı (Tamamla Butonu)
│   │   ├── tv_board/index.php     # Menuboard TV Yayını (Yumuşak Işık Sweep & Drift Animasyonları)
│   │   └── radio/index.php        # Mekan Radyo Yayını (Web Audio & Jingle Player)
│   └── integrations/              # Dış Entegrasyonlar
│       ├── payment/               # Ödeme Entegrasyonları (Iyzico, PayTR, Stripe)
│       ├── shipping/              # Kurye & Paket Servis Mesafe ve Kota Motoru
│       └── storage/               # Depolama Motoru (Yerel Media veya AWS S3 / Cloudflare R2)
├── venues/                        # Her Mekanın Kendi Özel Klasörü
│   ├── lezzet-duragi/             # Mekana özel klasör
│   │   ├── config.json            # Mekan ayarları, sepet kotaları, masalar, TV ayarları
│   │   └── menu.json              # Ürünler, 1+1 kampanyalar, alerjenler, hazırlık süreleri
│   └── exchange_rates.json        # 6 Saatte bir güncellenen TCMB / ECB kur önbelleği
├── media/                         # Görsel ve Medya Klasörü
│   ├── uploads/                   # Yüklenen dosyalar
│   ├── products/                  # Ürün fotoğrafları
│   ├── banners/                   # Kampanya banner görselleri
│   └── logos/                     # Mekan logoları
└── radio/                         # Mekan Müzik ve Ses Dosyaları
    ├── sarkilar/                  # Arka plan lounge ve chillout müzikleri (playlist.txt)
    ├── jingle/                    # Mekan giriş ve karşılama jingle'ları (jingles.txt)
    ├── reklam/                    # 1 Alana 1 Bedava ve indirim sesli reklamları (reklamlar.txt)
    └── anonslar/                  # Mutfak sipariş hazır ve kurye çağrı sesleri (anonslar.txt)
```

---

## 2. Kurulum Adımları (Hostinger hPanel)

### Adım 1: ZIP Dosyasını İndirin ve Yükleyin
1. Projenizdeki `hostinger_hazir_kurulum_public_html.zip` dosyasını bilgisayarınıza indirin.
2. Hostinger hPanel -> **Dosyalar (Files) -> Dosya Yöneticisi (File Manager)** bölümüne gidin.
3. `public_html` klasörüne girin.
4. Üstteki **Yükle (Upload)** butonuna basıp `hostinger_hazir_kurulum_public_html.zip` dosyasını seçin.
5. ZIP dosyasına sağ tıklayıp **Buraya Çıkart (Extract)** deyin.

### Adım 2: MySQL Veritabanını Oluşturun
1. Hostinger hPanel -> **Veritabanları (Databases) -> MySQL Veritabanları** bölümüne gidin.
2. Yeni veritabanı oluşturun:
   - Veritabanı Adı: `u123456789_qradv`
   - Kullanıcı Adı: `u123456789_root`
   - Şifre: `QRadv_Secure2026!`
3. **phpMyAdmin**'e girin ve `schema.sql` dosyasını içe aktarın (Import).
4. `app/core/Database.php` dosyasındaki veritabanı adı, kullanıcı ve şifrenizi girin.

### Adım 3: Çalıştırma ve Sayfaları Test Etme
Artık domain adresinizden doğrudan tüm modüllere erişebilirsiniz:
- **Müşteri QR Menüsü**: `https://siteniz.com/qr/lezzet-duragi`
- **Mekan Yöneticisi Paneli**: `https://siteniz.com/panel`
- **Sistem Süper Yöneticisi**: `https://siteniz.com/manager`
- **POS / Mutfak KDS Ekranı**: `https://siteniz.com/pos`
- **Menuboard TV Yayını**: `https://siteniz.com/tv`
- **Mekan Radyo Yayını**: `https://siteniz.com/radyo`

---

## 3. Menuboard TV Yayınında Yumuşak Işık & Metin Animasyonları

TV yayını ekranında göz yormayan, restorana prestij katan zarif ve yavaş animasyonlar eklendi:
- **Aurora Light Sweeps**: Arka planda 22 saniyelik periyotta dönen ve renk tonu usulca değişen loş atmosfer ışığı.
- **Card Glow & Shimmer**: 1+1 Kampanya kartı kenarlarında 7 saniyede bir nefes alan yumuşak altın ışıma.
- **Text Drift**: Başlık ve ürün isimlerinde 9 saniyede bir hafifçe yukarı-aşağı salınan dinlendirici hareket.
- **Warm Price Pulse**: Fiyat etiketlerinde 4.5 saniyede bir sıcak kehribar parıltı.
- **Silk Marquee**: Alt kayan bant yazıları telaşsız, okunabilir ve akıcı (45 saniye).
