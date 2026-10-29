<?php
declare(strict_types=1);

use App\Core\Helpers;

$slug = $_ROUTE_PARAMS['slug'] ?? 'lezzet-duragi';
$venue = Helpers::getVenue($slug);
$rates = Helpers::getExchangeRates();
$currency = $_GET['cur'] ?? ($venue['currency'] ?? 'TRY');
$lang = $_GET['lang'] ?? Helpers::getLang();
Helpers::setLang($lang);

$menuFile = dirname(__DIR__, 2) . "/venues/{$slug}/menu.json";
$menuData = file_exists($menuFile) ? json_decode((string)file_get_contents($menuFile), true) : [];
$categories = $menuData['categories'] ?? [];
$campaigns = $menuData['campaigns'] ?? [];
$products = $menuData['products'] ?? [];

$pageTitle = htmlspecialchars($venue['name']) . " | Akıllı QR Menü";
require_once dirname(__DIR__, 2) . '/views/layouts/header.php';
?>

<div class="max-w-md mx-auto w-full min-h-screen bg-neutral-950 pb-28 text-white flex flex-col relative shadow-2xl">
    <!-- Top Bar: Venue Logo, Language, Currency & Location Pin -->
    <header class="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
            <span class="text-2xl p-1 rounded-xl bg-amber-500/10 border border-amber-500/20"><?= $venue['logo'] ?? '🥩' ?></span>
            <div>
                <h1 class="text-sm font-extrabold tracking-tight text-white"><?= htmlspecialchars($venue['name']) ?></h1>
                <p class="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span id="location-badge">Restorandasınız (Masa Modu)</span>
                </p>
            </div>
        </div>

        <div class="flex items-center gap-1.5">
            <!-- Currency selector -->
            <select onchange="location.href='?cur=' + this.value + '&lang=<?= $lang ?>'" class="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs font-mono font-bold text-amber-400">
                <option value="TRY" <?= $currency === 'TRY' ? 'selected' : '' ?>>₺ TRY</option>
                <option value="USD" <?= $currency === 'USD' ? 'selected' : '' ?>>$ USD</option>
                <option value="EUR" <?= $currency === 'EUR' ? 'selected' : '' ?>>€ EUR</option>
                <option value="GBP" <?= $currency === 'GBP' ? 'selected' : '' ?>>£ GBP</option>
            </select>

            <!-- Language selector -->
            <select onchange="location.href='?cur=<?= $currency ?>&lang=' + this.value" class="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs font-bold text-neutral-300">
                <option value="tr" <?= $lang === 'tr' ? 'selected' : '' ?>>🇹🇷 TR</option>
                <option value="en" <?= $lang === 'en' ? 'selected' : '' ?>>🇬🇧 EN</option>
                <option value="de" <?= $lang === 'de' ? 'selected' : '' ?>>🇩🇪 DE</option>
                <option value="ru" <?= $lang === 'ru' ? 'selected' : '' ?>>🇷🇺 RU</option>
                <option value="ar" <?= $lang === 'ar' ? 'selected' : '' ?>>🇸🇦 AR</option>
            </select>
        </div>
    </header>

    <!-- Quick Call Waiter & Regular Customer Profile Buttons -->
    <div class="px-4 pt-3 flex items-center gap-2">
        <button onclick="callWaiterAction()" class="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20 active:scale-95">
            <i class="fa-solid fa-bell"></i>
            <span><?= Helpers::t('call_waiter') ?></span>
        </button>
        <button onclick="requestBillAction()" class="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-bold text-xs flex items-center gap-1.5 transition active:scale-95">
            <i class="fa-solid fa-receipt text-amber-400"></i>
            <span><?= Helpers::t('request_bill') ?></span>
        </button>
        <button onclick="toggleRegularCustomerModal()" class="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition" title="Müdavim Müşteri Bilgileri">
            <i class="fa-solid fa-user-check"></i>
            <span>Müdavim</span>
        </button>
    </div>

    <!-- Massive 1+1 Campaign Hero Banner -->
    <?php if (!empty($campaigns)): $camp = $campaigns[0]; ?>
    <div class="p-4">
        <div class="rounded-3xl overflow-hidden border border-amber-500/30 bg-neutral-900/90 shadow-2xl relative">
            <div class="relative h-48 w-full overflow-hidden bg-neutral-950">
                <img src="<?= htmlspecialchars($camp['bannerImage']) ?>" alt="" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent"></div>
                <div class="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[11px] shadow-lg animate-pulse">
                    <i class="fa-solid fa-gift"></i>
                    <span><?= htmlspecialchars($camp['badgeText'][$lang] ?? $camp['badgeText']['tr']) ?></span>
                </div>
                <div class="absolute bottom-3 left-3 right-3">
                    <h2 class="text-lg font-black text-white leading-tight drop-shadow-md">
                        <?= htmlspecialchars($camp['title'][$lang] ?? $camp['title']['tr']) ?>
                    </h2>
                    <p class="text-xs text-amber-300 font-semibold mt-0.5">
                        <?= htmlspecialchars($camp['subtitle'][$lang] ?? $camp['subtitle']['tr']) ?>
                    </p>
                </div>
            </div>
            <div class="p-3.5 space-y-2 text-xs text-neutral-300">
                <p><?= htmlspecialchars($camp['description'][$lang] ?? $camp['description']['tr']) ?></p>
                <div class="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
                    <span class="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                        <i class="fa-solid fa-check-circle"></i> Sepette 2. Gurme Burger 0 ₺!
                    </span>
                    <button onclick="addBogoToCart()" class="px-3 py-1 rounded-lg bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition">
                        Fırsatı Seç
                    </button>
                </div>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- Category Filter Tabs -->
    <div class="px-4 overflow-x-auto no-scrollbar flex items-center gap-2 pb-2">
        <button class="px-3.5 py-1.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs shrink-0">
            Tüm Menü
        </button>
        <?php foreach ($categories as $cat): ?>
        <button class="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-semibold text-xs shrink-0">
            <?= $cat['icon'] ?> <?= htmlspecialchars($cat['name'][$lang] ?? $cat['name']['tr']) ?>
        </button>
        <?php endforeach; ?>
    </div>

    <!-- Products List with Allergen Badges, Preparation Time & Add Button -->
    <div class="p-4 space-y-3">
        <?php foreach ($products as $prod): 
            $priceTRY = (float)$prod['price'];
            $priceCalculated = $priceTRY;
            if ($currency !== 'TRY' && isset($rates['rates'][$currency])) {
                $priceCalculated = $priceTRY * $rates['rates'][$currency];
            }
        ?>
        <div class="p-3 rounded-2xl bg-neutral-900 border border-neutral-800/80 flex items-center gap-3 hover:border-neutral-700 transition">
            <img src="<?= htmlspecialchars($prod['image']) ?>" alt="" class="w-20 h-20 rounded-xl object-cover shrink-0 shadow-md">
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-1">
                    <h3 class="font-extrabold text-xs text-white truncate"><?= htmlspecialchars($prod['name'][$lang] ?? $prod['name']['tr']) ?></h3>
                    <span class="font-mono font-black text-xs text-amber-400 shrink-0">
                        <?= Helpers::formatPrice($priceCalculated, $currency) ?>
                    </span>
                </div>
                <p class="text-[11px] text-neutral-400 line-clamp-2 mt-0.5"><?= htmlspecialchars($prod['description'][$lang] ?? $prod['description']['tr']) ?></p>
                
                <!-- Allergen and prep tags -->
                <div class="flex items-center gap-1.5 mt-2 flex-wrap text-[10px]">
                    <?php if (!empty($prod['preparationTime'])): ?>
                    <span class="text-cyan-400 font-mono">~<?= $prod['preparationTime'] ?> dk</span>
                    <?php endif; ?>
                    <?php foreach ($prod['allergens'] ?? [] as $alg): ?>
                    <span class="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300"><?= htmlspecialchars($alg) ?></span>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Add to Cart with Note -->
            <button onclick="addToCart('<?= $prod['id'] ?>', '<?= addslashes($prod['name']['tr']) ?>', <?= $priceCalculated ?>)" class="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition active:scale-95 shrink-0" title="<?= Helpers::t('add_to_cart') ?>">
                <i class="fa-solid fa-plus"></i>
            </button>
        </div>
        <?php endforeach; ?>
    </div>

    <!-- Sticky Cart Summary Bar at Bottom -->
    <div class="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 p-3 max-w-md mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <i class="fa-solid fa-basket-shopping text-base"></i>
            </div>
            <div>
                <span class="text-[11px] text-neutral-400 block font-medium">Sepet Toplamı</span>
                <span class="font-mono font-black text-sm text-amber-400" id="cart-total-display">0,00 <?= $currency ?></span>
            </div>
        </div>

        <button onclick="openCheckoutModal()" class="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs transition active:scale-95 shadow-lg shadow-amber-500/25">
            <span>Siparişi Ver</span>
            <i class="fa-solid fa-arrow-right ml-1"></i>
        </button>
    </div>
</div>

<script>
let cart = [];
let currentCurrency = '<?= $currency ?>';

function addToCart(id, name, price) {
    cart.push({ id, name, price, note: '' });
    updateCartDisplay();
    // Acoustic tactile click feedback
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
    } catch(e) {}
}

function updateCartDisplay() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-total-display').textContent = total.toFixed(2) + ' ' + currentCurrency;
}

function callWaiterAction() {
    alert("🔔 Masanıza garson çağrıldı! Ekibimiz birazdan yanınızda olacaktır.");
}

function requestBillAction() {
    alert("🧾 Masanız için hesap talebi kasaya iletildi.");
}

function toggleRegularCustomerModal() {
    alert("👤 Müdavim Müşteri Paneli: Kayıtlı teslimat adresleriniz ve sadakat puanlarınız profilinizde tanımlıdır.");
}

function openCheckoutModal() {
    if (cart.length === 0) {
        alert("Sepetiniz boş. Lütfen önce menüden ürün ekleyin.");
        return;
    }
    alert("✅ Siparişiniz mutfağa iletildi! Afiyet olsun.");
    cart = [];
    updateCartDisplay();
}
</script>

<?php require_once dirname(__DIR__, 2) . '/views/layouts/footer.php'; ?>
