# QRAdv Omni Restoran & Menü Sistemi - Hostinger Kurulum Kılavuzu

Bu kılavuz, projenin Hostinger Paylaşımlı Hosting (cPanel / hPanel) veya Hostinger VPS / Cloud üzerinde sorunsuz şekilde yayınlanması için adım adım hazırlanmıştır.

---

## 1. Hazırlık ve Sistem Gereksinimleri

Hostinger hPanel panelinizde aşağıdaki ayarları kontrol edin:
- **PHP Sürümü**: PHP 8.1, 8.2 veya 8.3 (hPanel -> Gelişmiş -> PHP Yapılandırması)
- **PHP Eklentileri**: `pdo_mysql`, `mbstring`, `openssl`, `json`, `curl` (Varsayılan olarak açıktır)
- **SSL Sertifikası (HTTPS)**: Kesinlikle aktif olmalıdır. (*Tarayıcıların GPS konum ve Web Audio sesli bildirim izinleri yalnızca HTTPS protokolünde çalışır.*)
- **Web Sunucusu**: LiteSpeed / Apache (.htaccess desteği)

---

## 2. Adım: MySQL Veritabanı Kurulumu

1. Hostinger **hPanel**'e giriş yapın.
2. Sol menüden **Veritabanları (Databases) -> MySQL Veritabanları** bölümüne gidin.
3. Yeni bir veritabanı oluşturun:
   - **MySQL Veritabanı Adı**: `u123456789_qradv`
   - **MySQL Kullanıcı Adı**: `u123456789_admin`
   - **Şifre**: Güçlü bir şifre belirleyin (örn: `QrAdv_2026!Secured`)
4. Veritabanı oluştuktan sonra yanındaki **phpMyAdmin'e Gir** butonuna tıklayın.
5. phpMyAdmin üst menüsünden **İçe Aktar (Import)** sekmesine tıklayın.
6. Projemizdeki `schema.sql` dosyasını seçip **Git (Go)** butonuna basın. (10 adet ilişkisel tablo; `venues`, `products`, `campaigns`, `orders`, `waiter_calls` vb. otomatik oluşturulacaktır).

---

## 3. Adım: PHP Veritabanı Bağlantı Dosyası (`db.php`)

Hostinger `public_html/api/` veya `public_html/config/` klasörüne aşağıdaki `db.php` dosyasını yerleştirin:

```php
<?php
// public_html/api/config.php
declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$db_host = 'localhost';
$db_name = 'u123456789_qradv'; // Hostinger veritabanı adınız
$db_user = 'u123456789_admin'; // Hostinger veritabanı kullanıcınız
$db_pass = 'QrAdv_2026!Secured'; // Belirlediğiniz şifre

try {
    $pdo = new PDO("mysql:host={$db_host};dbname={$db_name};charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Veritabanı bağlantı hatası: ' . $e->getMessage()]);
    exit;
}
```

---

## 4. Adım: Frontend (Arayüz) Dosyalarını Hostinger'a Yükleme

1. Bilgisayarınızda veya sunucuda proje dizininde derleme komutunu çalıştırın:
   ```bash
   npm run build
   ```
2. Bu işlem `dist/` klasörü içinde optimize edilmiş statik dosyaları (`index.html`, `assets/` klasörü) üretecektir.
3. Hostinger hPanel -> **Dosyalar -> Dosya Yöneticisi (File Manager)**'ı açın.
4. **`public_html`** klasörünün içine girin.
5. `dist/` klasörü içerisindeki tüm dosyaları (`index.html`, `assets/`, favicon vb.) doğrudan **`public_html/`** ana dizinine yükleyin.

---

## 5. Adım: `.htaccess` Dosyası (SPA ve URL Rotaları İçin Zorunlu)

React SPA (Single Page Application) yapısında `qradv.com/qr/lezzet-duragi_ana-menu`, `qradv.com/pos`, `qradv.com/panel` gibi sayfalara tıklandığında veya sayfa yenilendiğinde 404 Not Found hatası almamak için `public_html/` dizininde bir `.htaccess` dosyası olmalıdır.

`public_html/.htaccess` dosyasının içeriği:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # 1. Otomatik HTTPS yönlendirmesi (GPS ve Ses izinleri için zorunludur)
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # 2. PHP API isteklerini doğrudan işleme
  RewriteCond %{REQUEST_URI} ^/api/ [NC]
  RewriteRule ^api/(.*)$ api/$1 [L]

  # 3. Gerçek dosya veya klasör varsa doğrudan servis et (resimler, js, css)
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # 4. Tüm diğer rotaları React index.html'e yönlendir (qradv.com/qr, /pos, /panel vb.)
  RewriteRule ^ index.html [L]
</IfModule>

# Gzip ve LiteSpeed Sıkıştırma (Hızlı Yükleme)
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Tarayıcı Önbellekleme
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## 6. Adım: Canlı Test ve Doğrulama

Kurulum bittikten sonra aşağıdaki URL'leri tarayıcınızda açıp test edin:

1. **Müşteri QR Menü**: `https://qradv.com/qr/lezzet-duragi_ana-menu`
   - Sayfa açıldığında GPS konum iznini onaylayın.
   - 1+1 Kampanya bannerına tıklayıp ücretsiz hediye ürünü seçin ve sepete atın.
   - Masaya sipariş ver butonunu test edin.
2. **Mutfak KDS & POS**: `https://qradv.com/pos`
   - Yeni sipariş geldiğinde çift tonlu sesli alarmın (ding-dong) çaldığını test edin.
   - Adisyon yazdır simgesine basıp termal fiş önizlemesini görün.
3. **Mekan Sahibi Paneli**: `https://qradv.com/panel`
   - **Masa & QR Kodları**: Masa ekleyin, masa tent kartını yazdırın.
   - **PDF Flyer**: Farklı temalar seçip "A4 Flyer PDF İndir" butonuna basarak broşürün indiğini doğrulayın.
   - **XLS Aktarımı**: "Kataloğu Excel Olarak İndir" diyerek `.xlsx` dosyasını alın.
4. **Menuboard TV**: `https://qradv.com/tv/lezzet-duragi_tv`
   - Büyük ekranda veya TV tarayıcısında tam ekran moduna alarak canlı kampanya slaytlarını izleyin.
5. **Mekan Radyosu**: `https://qradv.com/radyo/lezzet-duragi_radio`
   - Arka plan müzik akışını başlatın ve sesli promosyon anonsunu hoparlörden test edin.

---

## 7. Sık Karşılaşılan Sorunlar ve Çözümleri

| Sorun | Neden | Çözüm |
| :--- | :--- | :--- |
| **Sayfa yenilenince 404 Not Found veriyor** | `.htaccess` dosyası eksik veya gizli dosya olarak yüklenmemiş | hPanel Dosya Yöneticisi ayarlarından "Gizli Dosyaları Göster"i açın ve `.htaccess` kodunu kaydedin. |
| **GPS konumu "İzin Verilmedi" hatası veriyor** | Site HTTP üzerinden açılıyor | Hostinger hPanel -> SSL bölümünden Ücretsiz SSL'i etkinleştirin ve HTTPS'e zorlayın. |
| **POS'ta yeni sipariş sesi çalmıyor** | Tarayıcı otomatik ses çalma (autoplay) politikası | Çalışanlar vardiya başında POS ekranında herhangi bir yere bir defa tıkladığında veya "Sesi Test Et" butonuna bastığında ses motoru aktifleşir. |
