<?php
/**
 * QRAdv Omni OS - Hostinger MySQL Veritabanı Bağlantı Yapılandırması
 * PDO (PHP Data Objects) ile Yüksek Güvenlikli Veritabanı Motoru
 */

define('DB_HOST', 'localhost');
define('DB_USER', 'u123456789_qradv'); // Hostinger cPanel / hPanel veritabanı kullanıcısı
define('DB_PASS', 'QradvPassword2026!'); // Hostinger veritabanı şifresi
define('DB_NAME', 'u123456789_qradv_db'); // Hostinger veritabanı adı
define('DB_PORT', '3306');
define('DB_CHARSET', 'utf8mb4');

function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET . ";port=" . DB_PORT;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Hostinger veritabanı henüz oluşturulmamışsa veya test ortamıysa demo fallback döndür
        return null;
    }
}
