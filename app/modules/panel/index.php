<?php
declare(strict_types=1);

use App\Core\Helpers;

$slug = 'lezzet-duragi';
$venue = Helpers::getVenue($slug);
$rates = Helpers::getExchangeRates();

// Handle form submission for order quotas & general settings
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_settings'])) {
    $minOrder = (float)($_POST['min_order'] ?? 150.0);
    $deliveryFee = (float)($_POST['delivery_fee'] ?? 35.0);
    $freeThreshold = (float)($_POST['free_threshold'] ?? 500.0);
    $maxCap = (float)($_POST['max_cap'] ?? 5000.0);

    $venue['orderQuota'] = [
        'enabled' => isset($_POST['quota_enabled']),
        'minOrderAmount' => $minOrder,
        'deliveryFee' => $deliveryFee,
        'freeDeliveryThreshold' => $freeThreshold,
        'maxOrderCap' => $maxCap
    ];

    $venueFile = dirname(__DIR__, 2) . "/venues/{$slug}/config.json";
    @file_put_contents($venueFile, json_encode($venue, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    $message = "Ayarlar başarıyla kaydedildi!";
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['sync_currency'])) {
    $rates = Helpers::getExchangeRates(true);
    $message = "TCMB döviz kurları başarıyla anlık güncellendi!";
}

$pageTitle = "Mekan Yönetici Paneli | " . htmlspecialchars($venue['name']);
require_once dirname(__DIR__, 2) . '/views/layouts/header.php';
?>

<div class="max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-6">
    <!-- Top Bar with Venue Identity & Portal Switcher -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div class="flex items-center gap-3">
            <span class="text-3xl p-2 rounded-xl bg-amber-500/10 border border-amber-500/20"><?= $venue['logo'] ?? '🥩' ?></span>
            <div>
                <h1 class="text-lg font-black text-white"><?= htmlspecialchars($venue['name']) ?> - Restoran Yönetim Paneli</h1>
                <p class="text-xs text-neutral-400">Genel Ayarlar, Sepet Kotaları, Canlı Döviz Kurları ve Masa Yönetimi</p>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <a href="/qr/<?= $slug ?>" target="_blank" class="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 transition">
                <i class="fa-solid fa-arrow-up-right-from-square mr-1 text-amber-400"></i>Canlı Menüyü Gör
            </a>
            <a href="/pos" class="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black transition">
                <i class="fa-solid fa-cash-register mr-1"></i>POS / KDS Ekranı
            </a>
        </div>
    </header>

    <?php if (!empty($message)): ?>
    <div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
        <i class="fa-solid fa-circle-check"></i>
        <span><?= htmlspecialchars($message) ?></span>
    </div>
    <?php endif; ?>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Order Quotas & Currency Sync Form (7 cols) -->
        <div class="lg:col-span-7 space-y-6">
            <!-- Order Quota Card -->
            <form method="POST" class="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                <div class="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-sliders text-amber-400"></i>
                        <h2 class="text-sm font-bold text-white">Sepet, Minimum Sipariş & Ücret Kotaları</h2>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="quota_enabled" class="sr-only peer" <?= ($venue['orderQuota']['enabled'] ?? true) ? 'checked' : '' ?>>
                        <div class="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                        <span class="ml-2 text-xs font-semibold text-neutral-300">Aktif</span>
                    </label>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-medium text-neutral-400 mb-1">Minimum Sipariş Tutarı (₺)</label>
                        <input type="number" step="0.5" name="min_order" value="<?= $venue['orderQuota']['minOrderAmount'] ?? 150 ?>" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-neutral-400 mb-1">Kurye Teslimat Ücreti (₺)</label>
                        <input type="number" step="0.5" name="delivery_fee" value="<?= $venue['orderQuota']['deliveryFee'] ?? 35 ?>" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-neutral-400 mb-1">Ücretsiz Teslimat Eşiği (₺)</label>
                        <input type="number" step="0.5" name="free_threshold" value="<?= $venue['orderQuota']['freeDeliveryThreshold'] ?? 500 ?>" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-neutral-400 mb-1">Maksimum Sipariş Kotası (₺)</label>
                        <input type="number" step="0.5" name="max_cap" value="<?= $venue['orderQuota']['maxOrderCap'] ?? 5000 ?>" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-500 outline-none">
                    </div>
                </div>

                <div class="pt-2 flex justify-end">
                    <button type="submit" name="save_settings" value="1" class="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs transition shadow-lg shadow-amber-500/20">
                        <i class="fa-solid fa-floppy-disk mr-1.5"></i>Ayarları Kaydet
                    </button>
                </div>
            </form>

            <!-- 6-Hour Automatic Currency Sync Card -->
            <div class="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                <div class="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-coins text-amber-400"></i>
                        <h2 class="text-sm font-bold text-white">6 Saatte Bir Otomatik Döviz Kuru Senkronizasyonu</h2>
                    </div>
                    <form method="POST">
                        <button type="submit" name="sync_currency" value="1" class="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition">
                            <i class="fa-solid fa-rotate mr-1 text-cyan-400"></i>Şimdi Güncelle
                        </button>
                    </form>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
                    <div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                        <span class="text-[10px] text-neutral-400 block">1 USD ($)</span>
                        <span class="text-sm font-bold text-amber-400"><?= number_format($rates['rates_to_try']['USD'] ?? 36.36, 2) ?> ₺</span>
                    </div>
                    <div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                        <span class="text-[10px] text-neutral-400 block">1 EUR (€)</span>
                        <span class="text-sm font-bold text-emerald-400"><?= number_format($rates['rates_to_try']['EUR'] ?? 37.88, 2) ?> ₺</span>
                    </div>
                    <div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                        <span class="text-[10px] text-neutral-400 block">1 GBP (£)</span>
                        <span class="text-sm font-bold text-indigo-400"><?= number_format($rates['rates_to_try']['GBP'] ?? 45.45, 2) ?> ₺</span>
                    </div>
                    <div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                        <span class="text-[10px] text-neutral-400 block">Kaynak</span>
                        <span class="text-xs font-bold text-neutral-300">TCMB API</span>
                    </div>
                </div>

                <p class="text-[11px] text-neutral-500">
                    Son Senkronizasyon: <strong class="text-neutral-400"><?= $rates['last_sync'] ?? date('Y-m-d H:i:s') ?></strong> | Sonraki Kontrol: <strong class="text-neutral-400"><?= $rates['next_sync'] ?? '6 saat sonra' ?></strong>
                </p>
            </div>
        </div>

        <!-- Right Column: Table Management & Flyer PDF Generator (5 cols) -->
        <div class="lg:col-span-5 space-y-6">
            <!-- Table Setup -->
            <div class="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div class="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <h2 class="text-sm font-bold text-white flex items-center gap-2">
                        <i class="fa-solid fa-chair text-amber-400"></i>
                        <span>Masa & Bölge Yönetimi</span>
                    </h2>
                    <span class="text-xs text-neutral-400"><?= count($venue['tables'] ?? []) ?> Masa</span>
                </div>
                <div class="space-y-2">
                    <?php foreach ($venue['tables'] ?? [] as $t): ?>
                    <div class="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between text-xs">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full <?= ($t['status'] ?? 'empty') === 'occupied' ? 'bg-amber-400' : 'bg-emerald-400' ?>"></span>
                            <span class="font-bold text-white"><?= htmlspecialchars($t['name']) ?></span>
                            <span class="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300"><?= htmlspecialchars($t['zone']) ?></span>
                        </div>
                        <span class="font-mono text-[11px] text-neutral-500"><?= htmlspecialchars($t['id']) ?></span>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Flyer PDF Download & Template -->
            <div class="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-amber-500/30 space-y-3">
                <h2 class="text-sm font-bold text-white flex items-center gap-2">
                    <i class="fa-solid fa-file-pdf text-rose-500"></i>
                    <span>Kampanya Broşür & Flyer PDF Çıktısı</span>
                </h2>
                <p class="text-xs text-neutral-400">1 Alana 1 Bedava kampanyasını A4 / A5 broşür veya masa üstü ayaklık olarak tek tıkla yazdırın.</p>
                <button onclick="window.print()" class="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold text-xs flex items-center justify-center gap-2 transition border border-neutral-700">
                    <i class="fa-solid fa-print text-amber-400"></i>
                    <span>Masa Üstü Broşürünü Yazdır / PDF İndir</span>
                </button>
            </div>
        </div>
    </div>
</div>

<?php require_once dirname(__DIR__, 2) . '/views/layouts/footer.php'; ?>
