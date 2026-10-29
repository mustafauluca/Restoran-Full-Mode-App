<?php
/**
 * QRAdv Omni OS - Ana Router & İstek Yönlendirici (Hostinger Apache)
 */
session_start();

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($requestUri, PHP_URL_PATH);

// Statik Dosyalar (assets/ vs)
if (preg_match('/\.(?:png|jpg|jpeg|gif|css|js|ico|svg|pdf|zip)$/', $path)) {
    return false; // Apache statik dosyayı doğrudan sunsun
}

// 1. API İstekleri
if (strpos($path, '/api/exchange-rates') === 0) {
    require __DIR__ . '/api/exchange-rates.php';
    exit;
}

// 2. Site Süper Yöneticisi (/manager)
if (strpos($path, '/manager') === 0) {
    if (empty($_SESSION['super_admin_logged'])) {
        require __DIR__ . '/admin/login.php';
        exit;
    }
    // Giriş yapılmışsa React/Frontend SPA konsolunu sun
    readfile(__DIR__ . '/index.html');
    exit;
}

// 3. Firma / Restoran Yöneticisi (/panel)
if (strpos($path, '/panel') === 0) {
    if (empty($_SESSION['venue_manager_logged'])) {
        require __DIR__ . '/panel/login.php';
        exit;
    }
    readfile(__DIR__ . '/index.html');
    exit;
}

// 4. Mekan Çalışanları & POS (/pos)
if (strpos($path, '/pos') === 0) {
    if (empty($_SESSION['staff_logged'])) {
        require __DIR__ . '/pos/login.php';
        exit;
    }
    readfile(__DIR__ . '/index.html');
    exit;
}

// 5. Müşteri QR Menü (/qr/...) & TV (/tv/...) & Radyo (/radyo/...)
// Her zaman temiz, izole SPA arayüzü sunulur
if (file_exists(__DIR__ . '/index.html')) {
    readfile(__DIR__ . '/index.html');
    exit;
}

echo "QRAdv Omni Restoran Sistemi Kuruldu. Lütfen schema.sql dosyasını phpMyAdmin ile içe aktarın.";
