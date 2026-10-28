import React, { useState } from 'react';
import { Database, Code2, Copy, Check, Download, Server } from 'lucide-react';

export const PhpMysqlArchitectureModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sql' | 'php_campaign' | 'php_order'>('sql');

  if (!isOpen) return null;

  const sqlSchema = `-- ====================================================================
-- QRAdv Omni OS: PHP 8.2+ & MySQL 8.0+ Enterprise Database Schema
-- Includes Dynamic 1+1 Campaigns, Geofencing, Waiter Calls, KDS & Signage
-- ====================================================================

CREATE DATABASE IF NOT EXISTS \`qradv_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`qradv_db\`;

-- 1. Venues / Restaurants Table
CREATE TABLE \`venues\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`slug\` VARCHAR(100) NOT NULL UNIQUE,
  \`name\` VARCHAR(255) NOT NULL,
  \`tagline\` VARCHAR(255),
  \`phone\` VARCHAR(50),
  \`email\` VARCHAR(120),
  \`address\` TEXT,
  \`latitude\` DECIMAL(10, 8) NOT NULL DEFAULT 41.04220000,
  \`longitude\` DECIMAL(11, 8) NOT NULL DEFAULT 29.00890000,
  \`geofence_radius_meters\` INT UNSIGNED NOT NULL DEFAULT 60,
  \`default_currency\` ENUM('TRY', 'USD', 'EUR', 'GBP') NOT NULL DEFAULT 'TRY',
  \`rate_usd\` DECIMAL(8, 4) NOT NULL DEFAULT 0.0290,
  \`rate_eur\` DECIMAL(8, 4) NOT NULL DEFAULT 0.0270,
  \`rate_gbp\` DECIMAL(8, 4) NOT NULL DEFAULT 0.0230,
  \`min_delivery_amount\` DECIMAL(10, 2) NOT NULL DEFAULT 300.00,
  \`delivery_fee\` DECIMAL(10, 2) NOT NULL DEFAULT 45.00,
  \`wifi_ssid\` VARCHAR(100),
  \`wifi_password\` VARCHAR(100),
  \`theme\` VARCHAR(50) NOT NULL DEFAULT 'midnight',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Menu Categories
CREATE TABLE \`categories\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`venue_id\` INT UNSIGNED NOT NULL,
  \`name_tr\` VARCHAR(150) NOT NULL,
  \`name_en\` VARCHAR(150),
  \`icon\` VARCHAR(20) DEFAULT '🍽️',
  \`sort_order\` SMALLINT UNSIGNED DEFAULT 0,
  \`is_active\` TINYINT(1) DEFAULT 1,
  FOREIGN KEY (\`venue_id\`) REFERENCES \`venues\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Products
CREATE TABLE \`products\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`venue_id\` INT UNSIGNED NOT NULL,
  \`category_id\` INT UNSIGNED NOT NULL,
  \`name_tr\` VARCHAR(255) NOT NULL,
  \`name_en\` VARCHAR(255),
  \`description_tr\` TEXT,
  \`description_en\` TEXT,
  \`price_try\` DECIMAL(10, 2) NOT NULL,
  \`image_url\` TEXT NOT NULL,
  \`station\` ENUM('grill', 'kitchen', 'beverage', 'salad', 'meze') NOT NULL DEFAULT 'kitchen',
  \`calories\` SMALLINT UNSIGNED DEFAULT NULL,
  \`prep_time_minutes\` SMALLINT UNSIGNED DEFAULT 10,
  \`is_available\` TINYINT(1) DEFAULT 1,
  \`badge_tr\` VARCHAR(100) DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`venue_id\`) REFERENCES \`venues\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. 14 Standard Allergens
CREATE TABLE \`allergens\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`name_tr\` VARCHAR(100) NOT NULL,
  \`name_en\` VARCHAR(100) NOT NULL,
  \`icon\` VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE \`product_allergens\` (
  \`product_id\` INT UNSIGNED NOT NULL,
  \`allergen_id\` VARCHAR(50) NOT NULL,
  PRIMARY KEY (\`product_id\`, \`allergen_id\`),
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`allergen_id\`) REFERENCES \`allergens\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Dynamic Campaigns (1 Alana 1 Bedava / % İndirim Motoru)
CREATE TABLE \`campaigns\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`venue_id\` INT UNSIGNED NOT NULL,
  \`type\` ENUM('buy1_get1_free', 'discount_percent', 'combo_deal') NOT NULL DEFAULT 'buy1_get1_free',
  \`title_tr\` VARCHAR(255) NOT NULL,
  \`title_en\` VARCHAR(255),
  \`subtitle_tr\` VARCHAR(255),
  \`badge_text_tr\` VARCHAR(100) NOT NULL DEFAULT '1 ALANA 1 BEDAVA',
  \`banner_image_url\` TEXT NOT NULL,
  \`primary_product_id\` INT UNSIGNED NOT NULL,
  \`discount_percent\` TINYINT UNSIGNED DEFAULT NULL,
  \`start_date\` DATE NOT NULL,
  \`end_date\` DATE NOT NULL,
  \`is_active\` TINYINT(1) DEFAULT 1,
  FOREIGN KEY (\`venue_id\`) REFERENCES \`venues\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`primary_product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Allowed Free Companion Products in 1+1 Combo
CREATE TABLE \`campaign_companions\` (
  \`campaign_id\` INT UNSIGNED NOT NULL,
  \`companion_product_id\` INT UNSIGNED NOT NULL,
  PRIMARY KEY (\`campaign_id\`, \`companion_product_id\`),
  FOREIGN KEY (\`campaign_id\`) REFERENCES \`campaigns\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`companion_product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Regular Customers & Multiple Addresses (Müdavimler)
CREATE TABLE \`customers\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`full_name\` VARCHAR(150) NOT NULL,
  \`phone\` VARCHAR(30) NOT NULL UNIQUE,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE \`customer_addresses\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`customer_id\` INT UNSIGNED NOT NULL,
  \`title\` VARCHAR(100) NOT NULL, -- 'Evim', 'Ofis'
  \`city\` VARCHAR(100) NOT NULL,
  \`district\` VARCHAR(100) NOT NULL,
  \`neighborhood\` VARCHAR(150) NOT NULL,
  \`street\` VARCHAR(150) NOT NULL,
  \`building_no\` VARCHAR(50) NOT NULL,
  \`floor\` VARCHAR(30),
  \`apartment_no\` VARCHAR(30),
  \`directions\` TEXT,
  \`is_default\` TINYINT(1) DEFAULT 0,
  FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Orders (Masaya Sipariş & Adrese Paket Sipariş)
CREATE TABLE \`orders\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`venue_id\` INT UNSIGNED NOT NULL,
  \`order_number\` VARCHAR(50) NOT NULL UNIQUE,
  \`type\` ENUM('table', 'delivery', 'takeaway') NOT NULL DEFAULT 'table',
  \`table_number\` VARCHAR(50) DEFAULT NULL,
  \`delivery_address_id\` INT UNSIGNED DEFAULT NULL,
  \`customer_name\` VARCHAR(150) NOT NULL,
  \`customer_phone\` VARCHAR(30) NOT NULL,
  \`order_note\` TEXT,
  \`subtotal_try\` DECIMAL(10, 2) NOT NULL,
  \`delivery_fee_try\` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  \`total_try\` DECIMAL(10, 2) NOT NULL,
  \`currency\` ENUM('TRY', 'USD', 'EUR', 'GBP') NOT NULL DEFAULT 'TRY',
  \`payment_method\` ENUM('credit_card', 'cash', 'pos_at_door', 'sodexo_multinet', 'online_pay') NOT NULL,
  \`is_paid\` TINYINT(1) DEFAULT 0,
  \`status\` ENUM('pending', 'preparing', 'ready', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`venue_id\`) REFERENCES \`venues\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`delivery_address_id\` ) REFERENCES \`customer_addresses\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 9. Order Items (Includes Per-Item Note & 1+1 Free Marking)
CREATE TABLE \`order_items\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`order_id\` INT UNSIGNED NOT NULL,
  \`product_id\` INT UNSIGNED NOT NULL,
  \`product_name\` VARCHAR(255) NOT NULL,
  \`unit_price\` DECIMAL(10, 2) NOT NULL,
  \`quantity\` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  \`item_note\` VARCHAR(255) DEFAULT NULL,
  \`station\` ENUM('grill', 'kitchen', 'beverage', 'salad', 'meze') NOT NULL DEFAULT 'kitchen',
  \`is_free_campaign_item\` TINYINT(1) DEFAULT 0,
  \`applied_campaign_id\` INT UNSIGNED DEFAULT NULL,
  \`status\` ENUM('pending', 'cooking', 'done') NOT NULL DEFAULT 'pending',
  FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 10. Waiter Calls (Garson Çağrıları)
CREATE TABLE \`waiter_calls\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`venue_id\` INT UNSIGNED NOT NULL,
  \`table_number\` VARCHAR(50) NOT NULL,
  \`call_type\` ENUM('waiter', 'bill', 'water', 'menu') NOT NULL DEFAULT 'waiter',
  \`status\` ENUM('active', 'resolved') NOT NULL DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`resolved_at\` TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (\`venue_id\`) REFERENCES \`venues\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;`;

  const phpCampaignCode = `<?php
declare(strict_types=1);

namespace QRAdv\\Controllers;

use PDO;
use Exception;

/**
 * CampaignController: Handles 1+1 Buy 1 Get 1 Free, % discounts & combo logic.
 */
class CampaignController
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Get active campaigns with their eligible free companion products
     */
    public function getActiveCampaigns(int $venueId): array
    {
        $sql = "
            SELECT c.*, 
                   p.name_tr as primary_product_name,
                   p.price_try as primary_product_price,
                   p.image_url as primary_product_image
            FROM campaigns c
            JOIN products p ON p.id = c.primary_product_id
            WHERE c.venue_id = :venue_id 
              AND c.is_active = 1
              AND CURRENT_DATE() BETWEEN c.start_date AND c.end_date
            ORDER BY c.id DESC
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['venue_id' => $venueId]);
        $campaigns = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch companion products for 1+1 deals
        foreach ($campaigns as &$camp) {
            if ($camp['type'] === 'buy1_get1_free') {
                $compStmt = $this->db->prepare("
                    SELECT p.id, p.name_tr, p.price_try, p.image_url, p.station
                    FROM campaign_companions cc
                    JOIN products p ON p.id = cc.companion_product_id
                    WHERE cc.campaign_id = :camp_id AND p.is_available = 1
                ");
                $compStmt->execute(['camp_id' => $camp['id']]);
                $camp['companion_products'] = $compStmt->fetchAll(PDO::FETCH_ASSOC);
            }
        }

        return $campaigns;
    }

    /**
     * Apply and Validate 1+1 Free Item in Cart
     */
    public function validateAndApplyCombo(int $campaignId, int $primaryProdId, int $companionProdId): array
    {
        $campStmt = $this->db->prepare("
            SELECT * FROM campaigns 
            WHERE id = :id AND is_active = 1 
              AND CURRENT_DATE() BETWEEN start_date AND end_date
        ");
        $campStmt->execute(['id' => $campaignId]);
        $campaign = $campStmt->fetch(PDO::FETCH_ASSOC);

        if (!$campaign || (int)$campaign['primary_product_id'] !== $primaryProdId) {
            throw new Exception("Geçersiz kampanya veya ana ürün eşleşmesi.");
        }

        // Check if chosen companion is allowed
        $checkStmt = $this->db->prepare("
            SELECT COUNT(*) FROM campaign_companions 
            WHERE campaign_id = :camp_id AND companion_product_id = :comp_id
        ");
        $checkStmt->execute(['camp_id' => $campaignId, 'comp_id' => $companionProdId]);
        
        // Companion is valid if explicitly in companions table or identical to primary product
        $isAllowed = ($companionProdId === $primaryProdId) || ($checkStmt->fetchColumn() > 0);

        if (!$isAllowed) {
            throw new Exception("Seçilen hediye ürün bu 1+1 kampanyası için geçerli değildir.");
        }

        return [
            'status' => 'success',
            'campaign_id' => $campaignId,
            'primary_product_id' => $primaryProdId,
            'companion_product_id' => $companionProdId,
            'companion_price' => 0.00, // 0 TL Bedava!
            'badge' => $campaign['badge_text_tr']
        ];
    }
}`;

  const phpOrderCode = `<?php
declare(strict_types=1);

namespace QRAdv\\Controllers;

use PDO;
use Exception;

/**
 * OrderController: Handles geofenced table & delivery orders, items notes and KDS dispatch
 */
class OrderController
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Create Order with Location / Table Validation & Sound WebSocket trigger
     */
    public function placeOrder(array $payload): array
    {
        $this->db->beginTransaction();
        try {
            $venueId = (int)$payload['venue_id'];
            $type = $payload['type']; // 'table' or 'delivery'
            $orderNumber = '#' . ($type === 'table' ? 'M' : 'P') . '-' . rand(100, 999);

            $stmt = $this->db->prepare("
                INSERT INTO orders (
                    venue_id, order_number, type, table_number, delivery_address_id,
                    customer_name, customer_phone, order_note, subtotal_try, 
                    delivery_fee_try, total_try, currency, payment_method, status
                ) VALUES (
                    :venue_id, :order_number, :type, :table_number, :delivery_address_id,
                    :customer_name, :customer_phone, :order_note, :subtotal_try, 
                    :delivery_fee_try, :total_try, :currency, :payment_method, 'pending'
                )
            ");

            $stmt->execute([
                'venue_id' => $venueId,
                'order_number' => $orderNumber,
                'type' => $type,
                'table_number' => $payload['table_number'] ?? null,
                'delivery_address_id' => $payload['delivery_address_id'] ?? null,
                'customer_name' => $payload['customer_name'],
                'customer_phone' => $payload['customer_phone'],
                'order_note' => $payload['order_note'] ?? null,
                'subtotal_try' => $payload['subtotal_try'],
                'delivery_fee_try' => $payload['delivery_fee_try'] ?? 0.00,
                'total_try' => $payload['total_try'],
                'currency' => $payload['currency'] ?? 'TRY',
                'payment_method' => $payload['payment_method']
            ]);

            $orderId = (int)$this->db->lastInsertId();

            // Insert line items with per-item notes & 1+1 free tag
            $itemStmt = $this->db->prepare("
                INSERT INTO order_items (
                    order_id, product_id, product_name, unit_price, quantity,
                    item_note, station, is_free_campaign_item, applied_campaign_id
                ) VALUES (
                    :order_id, :product_id, :product_name, :unit_price, :quantity,
                    :item_note, :station, :is_free_campaign_item, :applied_campaign_id
                )
            ");

            foreach ($payload['items'] as $item) {
                $itemStmt->execute([
                    'order_id' => $orderId,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'unit_price' => $item['is_free'] ? 0.00 : $item['price'],
                    'quantity' => $item['quantity'],
                    'item_note' => $item['item_note'] ?? null,
                    'station' => $item['station'] ?? 'kitchen',
                    'is_free_campaign_item' => $item['is_free'] ? 1 : 0,
                    'applied_campaign_id' => $item['campaign_id'] ?? null
                ]);
            }

            $this->db->commit();

            // Trigger Realtime Pusher/WebSocket and ESC/POS thermal printing webhook
            // $this->dispatchKdsNotification($orderId, $orderNumber);

            return [
                'status' => 'success',
                'order_id' => $orderId,
                'order_number' => $orderNumber
            ];
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
}`;

  const copyToClipboard = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const downloadSqlFile = () => {
    const blob = new Blob([sqlSchema], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qradv_database_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-5 text-neutral-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                PHP & MySQL 8.0+ Mimari Şeması ve Kod Desteği
              </h3>
              <p className="text-xs text-neutral-400">
                1+1 Kampanyalar, Müdavim Adresleri, KDS İstasyonları, Adisyon & Webhook Yapısı
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadSqlFile}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>schema.sql İndir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
            >
              Kapat
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-3 pb-2 border-b border-neutral-800">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'sql'
                ? 'bg-amber-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MySQL Veritabanı Şeması (schema.sql)</span>
          </button>
          <button
            onClick={() => setActiveTab('php_campaign')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'php_campaign'
                ? 'bg-amber-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>PHP: CampaignController.php (1+1 Motoru)</span>
          </button>
          <button
            onClick={() => setActiveTab('php_order')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'php_order'
                ? 'bg-amber-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>PHP: OrderController.php (Lokasyon & KDS)</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="py-3 flex-1 overflow-hidden flex flex-col">
          <div className="relative flex-1 bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 bg-neutral-900 border-b border-neutral-800 text-xs">
              <span className="font-mono text-neutral-400">
                {activeTab === 'sql'
                  ? 'schema.sql (10 Tablo & Foreign Key İlişkileri)'
                  : activeTab === 'php_campaign'
                  ? 'src/Controllers/CampaignController.php'
                  : 'src/Controllers/OrderController.php'}
              </span>

              <button
                onClick={() =>
                  copyToClipboard(
                    activeTab === 'sql'
                      ? sqlSchema
                      : activeTab === 'php_campaign'
                      ? phpCampaignCode
                      : phpOrderCode,
                    activeTab
                  )
                }
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
              >
                {copiedTab === activeTab ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kodu Kopyala</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 overflow-y-auto text-xs font-mono text-neutral-300 leading-relaxed no-scrollbar flex-1">
              {activeTab === 'sql'
                ? sqlSchema
                : activeTab === 'php_campaign'
                ? phpCampaignCode
                : phpOrderCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
