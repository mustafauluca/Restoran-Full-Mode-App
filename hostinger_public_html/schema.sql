-- ====================================================================
-- QRAdv Omni OS: PHP 8.2+ & MySQL 8.0+ Enterprise Database Schema
-- Hostinger phpMyAdmin İçe Aktarma (Import) Dosyası
-- ====================================================================

-- 1. Venues / Restoranlar
CREATE TABLE IF NOT EXISTS `venues` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `tagline` VARCHAR(255),
  `phone` VARCHAR(50),
  `email` VARCHAR(120),
  `address` TEXT,
  `latitude` DECIMAL(10, 8) NOT NULL DEFAULT 41.04220000,
  `longitude` DECIMAL(11, 8) NOT NULL DEFAULT 29.00890000,
  `geofence_radius_meters` INT UNSIGNED NOT NULL DEFAULT 60,
  `default_currency` ENUM('TRY', 'USD', 'EUR', 'GBP') NOT NULL DEFAULT 'TRY',
  `rate_usd` DECIMAL(8, 4) NOT NULL DEFAULT 0.0290,
  `rate_eur` DECIMAL(8, 4) NOT NULL DEFAULT 0.0270,
  `rate_gbp` DECIMAL(8, 4) NOT NULL DEFAULT 0.0230,
  `min_delivery_amount` DECIMAL(10, 2) NOT NULL DEFAULT 300.00,
  `delivery_fee` DECIMAL(10, 2) NOT NULL DEFAULT 45.00,
  `wifi_ssid` VARCHAR(100),
  `wifi_password` VARCHAR(100),
  `theme` VARCHAR(50) NOT NULL DEFAULT 'midnight',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Menü Kategorileri
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `venue_id` INT UNSIGNED NOT NULL,
  `name_tr` VARCHAR(150) NOT NULL,
  `name_en` VARCHAR(150),
  `icon` VARCHAR(20) DEFAULT '🍽️',
  `sort_order` SMALLINT UNSIGNED DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Ürünler
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `venue_id` INT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `name_tr` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255),
  `description_tr` TEXT,
  `description_en` TEXT,
  `price_try` DECIMAL(10, 2) NOT NULL,
  `image_url` TEXT NOT NULL,
  `station` ENUM('grill', 'kitchen', 'beverage', 'salad', 'meze') NOT NULL DEFAULT 'kitchen',
  `calories` SMALLINT UNSIGNED DEFAULT NULL,
  `prep_time_minutes` SMALLINT UNSIGNED DEFAULT 10,
  `is_available` TINYINT(1) DEFAULT 1,
  `badge_tr` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Alerjenler
CREATE TABLE IF NOT EXISTS `allergens` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name_tr` VARCHAR(100) NOT NULL,
  `name_en` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_allergens` (
  `product_id` INT UNSIGNED NOT NULL,
  `allergen_id` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`product_id`, `allergen_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`allergen_id`) REFERENCES `allergens`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Dinamik Kampanyalar (1 Alana 1 Bedava & İndirimler)
CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `venue_id` INT UNSIGNED NOT NULL,
  `type` ENUM('buy1_get1_free', 'discount_percent', 'combo_deal') NOT NULL DEFAULT 'buy1_get1_free',
  `title_tr` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255),
  `subtitle_tr` VARCHAR(255),
  `badge_text_tr` VARCHAR(100) NOT NULL DEFAULT '1 ALANA 1 BEDAVA',
  `banner_image_url` TEXT NOT NULL,
  `primary_product_id` INT UNSIGNED NOT NULL,
  `discount_percent` TINYINT UNSIGNED DEFAULT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`primary_product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. 1+1 Hediye Edilebilir Seçmeli Ürünler
CREATE TABLE IF NOT EXISTS `campaign_companions` (
  `campaign_id` INT UNSIGNED NOT NULL,
  `companion_product_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`campaign_id`, `companion_product_id`),
  FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`companion_product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Müdavim Müşteriler & Kayıtlı Çoklu Adresler
CREATE TABLE IF NOT EXISTS `customers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `customer_addresses` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `neighborhood` VARCHAR(150) NOT NULL,
  `street` VARCHAR(150) NOT NULL,
  `building_no` VARCHAR(50) NOT NULL,
  `floor` VARCHAR(30),
  `apartment_no` VARCHAR(30),
  `directions` TEXT,
  `is_default` TINYINT(1) DEFAULT 0,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Masalar
CREATE TABLE IF NOT EXISTS `tables` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `venue_id` INT UNSIGNED NOT NULL,
  `table_name` VARCHAR(50) NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Siparişler (Masa ve Adrese Teslimat)
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `venue_id` INT UNSIGNED NOT NULL,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `type` ENUM('table', 'delivery', 'takeaway') NOT NULL DEFAULT 'table',
  `table_number` VARCHAR(50) DEFAULT NULL,
  `delivery_address_id` INT UNSIGNED DEFAULT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(30) NOT NULL,
  `order_note` TEXT,
  `subtotal_try` DECIMAL(10, 2) NOT NULL,
  `delivery_fee_try` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `total_try` DECIMAL(10, 2) NOT NULL,
  `currency` ENUM('TRY', 'USD', 'EUR', 'GBP') NOT NULL DEFAULT 'TRY',
  `payment_method` ENUM('credit_card', 'cash', 'pos_at_door', 'sodexo_multinet', 'online_pay') NOT NULL,
  `is_paid` TINYINT(1) DEFAULT 0,
  `status` ENUM('pending', 'preparing', 'ready', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`delivery_address_id`) REFERENCES `customer_addresses`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Sipariş Kalemleri
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `unit_price` DECIMAL(10, 2) NOT NULL,
  `quantity` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `item_note` VARCHAR(255) DEFAULT NULL,
  `station` ENUM('grill', 'kitchen', 'beverage', 'salad', 'meze') NOT NULL DEFAULT 'kitchen',
  `is_free_campaign_item` TINYINT(1) DEFAULT 0,
  `applied_campaign_id` INT UNSIGNED DEFAULT NULL,
  `status` ENUM('pending', 'cooking', 'done') NOT NULL DEFAULT 'pending',
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Garson Çağrıları
CREATE TABLE IF NOT EXISTS `waiter_calls` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `venue_id` INT UNSIGNED NOT NULL,
  `table_number` VARCHAR(50) NOT NULL,
  `call_type` ENUM('waiter', 'bill', 'water', 'menu') NOT NULL DEFAULT 'waiter',
  `status` ENUM('active', 'resolved') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
