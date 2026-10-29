<?php
declare(strict_types=1);

use App\Core\Helpers;

$slug = $_ROUTE_PARAMS['slug'] ?? 'lezzet-duragi';
$screenId = $_GET['screen'] ?? ($_ROUTE_PARAMS['screenId'] ?? 'screen-1');

$venue = Helpers::getVenue($slug);
$rates = Helpers::getExchangeRates();

$menuFile = dirname(__DIR__, 2) . "/venues/{$slug}/menu.json";
$menuData = file_exists($menuFile) ? json_decode((string)file_get_contents($menuFile), true) : [];
$categories = $menuData['categories'] ?? [];
$campaigns = $menuData['campaigns'] ?? [];
$products = $menuData['products'] ?? [];
$camp = $campaigns[0] ?? null;

// Determine current screen config
$tvScreens = $venue['tvScreens'] ?? [];
$currentScreen = null;
foreach ($tvScreens as $s) {
    if ($s['id'] === $screenId) {
        $currentScreen = $s;
        break;
    }
}
if (!$currentScreen && !empty($tvScreens)) {
    $currentScreen = $tvScreens[0];
}

$isPureMenu = ($currentScreen && ($currentScreen['screenType'] ?? '') === 'pure_menu');
$pageTitle = htmlspecialchars($venue['name']) . ($isPureMenu ? " | Saf Menü Board" : " | Dijital Menuboard TV");
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $pageTitle ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800;900&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes tv-aurora {
            0% { transform: translate(-10%, -10%) scale(1) rotate(0deg); opacity: 0.25; }
            50% { transform: translate(15%, 12%) scale(1.15) rotate(180deg); opacity: 0.42; }
            100% { transform: translate(-10%, -10%) scale(1) rotate(360deg); opacity: 0.25; }
        }

        @keyframes tv-text-drift {
            0% { transform: translateY(0px); opacity: 0.95; }
            50% { transform: translateY(-4px); opacity: 1; }
            100% { transform: translateY(0px); opacity: 0.95; }
        }

        @keyframes tv-price-glow {
            0%, 100% { text-shadow: 0 0 10px rgba(245, 158, 11, 0.3); transform: scale(1); }
            50% { text-shadow: 0 0 24px rgba(245, 158, 11, 0.8), 0 0 35px rgba(239, 68, 68, 0.4); transform: scale(1.03); }
        }

        @keyframes tv-border-shimmer {
            0% { border-color: rgba(245, 158, 11, 0.25); box-shadow: 0 0 25px rgba(245, 158, 11, 0.05); }
            50% { border-color: rgba(245, 158, 11, 0.65); box-shadow: 0 0 40px rgba(245, 158, 11, 0.2); }
            100% { border-color: rgba(245, 158, 11, 0.25); box-shadow: 0 0 25px rgba(245, 158, 11, 0.05); }
        }

        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }

        .animate-aurora { animation: tv-aurora 22s ease-in-out infinite; }
        .animate-drift { animation: tv-text-drift 9s ease-in-out infinite; }
        .animate-glow { animation: tv-price-glow 4.5s ease-in-out infinite; }
        .animate-border-shimmer { animation: tv-border-shimmer 7s ease-in-out infinite; }
        .animate-marquee-slow { display: inline-block; white-space: nowrap; animation: marquee 45s linear infinite; }
    </style>
</head>
<body class="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between overflow-hidden select-none relative">
    <!-- Slow Ambient Background Aurora Light Sweeps -->
    <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-amber-500/15 blur-[130px] pointer-events-none animate-aurora"></div>
    <div class="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-rose-600/12 blur-[150px] pointer-events-none animate-aurora" style="animation-delay: -11s"></div>
    <div class="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-emerald-500/8 blur-[110px] pointer-events-none animate-aurora" style="animation-delay: -6s"></div>

    <!-- Floating Top-Right TV Screen Switcher Pill (Discreet on real TV) -->
    <div class="fixed top-3 right-4 z-50 flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-1.5 rounded-2xl shadow-2xl opacity-40 hover:opacity-100 transition-opacity">
        <span class="text-[10px] text-neutral-400 font-mono px-1 font-bold">EKRAN:</span>
        <?php foreach ($tvScreens as $s): ?>
        <a href="?screen=<?= $s['id'] ?>" class="px-2.5 py-1 rounded-xl text-xs font-bold transition-all <?= ($s['id'] === ($currentScreen['id'] ?? '')) ? 'bg-amber-500 text-neutral-950 shadow-md font-black' : 'text-neutral-400 hover:text-white' ?>">
            <?= htmlspecialchars(explode('/', $s['name'])[0]) ?>
            <?php if (($s['screenType'] ?? '') === 'pure_menu'): ?>
            <span class="ml-1 text-[9px] px-1 rounded bg-neutral-800 text-cyan-400">SAF MENÜ</span>
            <?php endif; ?>
        </a>
        <?php endforeach; ?>
        <button onclick="document.documentElement.requestFullscreen().catch(()=>{})" class="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition" title="Tam Ekran">
            <i class="fa-solid fa-expand text-xs"></i>
        </button>
    </div>

    <?php if ($isPureMenu): ?>
    <!-- ========================================================================= -->
    <!-- SAF MENÜ EKRANI: SIFIR BANNER, SIFIR HEADER, SIFIR ALT BANT              -->
    <!-- SADECE KATEGORİLER & EN ÇOK SİPARİŞ EDİLEN ÜRÜN VİTRİNİ                   -->
    <!-- ========================================================================= -->
    <main class="flex-1 p-8 flex flex-col justify-between overflow-y-auto z-10">
        <!-- Minimal High-End Title Bar -->
        <div class="flex items-center justify-between pb-4 border-b border-neutral-800/80 mb-6">
            <div class="flex items-center gap-3">
                <span class="text-3xl p-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-inner"><?= $venue['logo'] ?? '🥩' ?></span>
                <div>
                    <h1 class="text-2xl font-black uppercase tracking-wider text-white"><?= htmlspecialchars($venue['name']) ?></h1>
                    <p class="text-xs text-amber-400 font-bold tracking-wider uppercase">GURME MENÜ & SPESİYALLER</p>
                </div>
            </div>
            <div class="font-mono text-base font-bold text-neutral-300 bg-neutral-900 px-4 py-1.5 rounded-xl border border-neutral-800">
                <i class="fa-regular fa-clock text-amber-400 mr-1.5"></i>
                <span id="tv-clock-pure"><?= date('H:i:s') ?></span>
            </div>
        </div>

        <!-- Responsive Category Columns Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch flex-1">
            <?php foreach ($categories as $cat): 
                $catProds = array_filter($products, fn($p) => ($p['categoryId'] ?? '') === $cat['id']);
                if (empty($catProds)) continue;
                $popularProd = reset($catProds); // En çok sipariş edilen / ilk ürün
                $otherProds = array_slice($catProds, 1);
            ?>
            <div class="rounded-3xl bg-neutral-900/90 border border-neutral-800/90 p-5 flex flex-col justify-between shadow-2xl relative animate-border-shimmer backdrop-blur-sm">
                <div>
                    <!-- Category Header -->
                    <div class="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl"><?= $cat['icon'] ?></span>
                            <h2 class="text-base font-black tracking-wider text-amber-400 uppercase"><?= htmlspecialchars($cat['name']['tr'] ?? '') ?></h2>
                        </div>
                        <span class="text-[11px] font-mono font-bold text-neutral-400"><?= count($catProds) ?> Çeşit</span>
                    </div>

                    <!-- ⭐ POPÜLER ÜRÜN BÜYÜK RESİMLİ SPOTLIGHT KARTI -->
                    <?php if ($popularProd): ?>
                    <div class="mb-4 rounded-2xl bg-neutral-950/90 border border-amber-500/40 p-3.5 space-y-3 relative overflow-hidden shadow-xl">
                        <div class="relative h-44 w-full rounded-xl overflow-hidden bg-neutral-900">
                            <img src="<?= htmlspecialchars($popularProd['image']) ?>" alt="" class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80"></div>
                            
                            <div class="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-neutral-950 font-black text-[11px] shadow-lg">
                                <i class="fa-solid fa-star text-[10px]"></i>
                                <span>EN ÇOK SİPARİŞ EDİLEN</span>
                            </div>

                            <div class="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-xl bg-neutral-950/90 border border-amber-500/50 backdrop-blur font-mono font-black text-amber-400 text-base shadow-2xl animate-glow">
                                <?= Helpers::formatPrice((float)$popularProd['price'], 'TRY') ?>
                            </div>
                        </div>

                        <div>
                            <h3 class="font-extrabold text-sm text-white"><?= htmlspecialchars($popularProd['name']['tr'] ?? '') ?></h3>
                            <p class="text-[11px] text-neutral-300 mt-1 line-clamp-2 leading-relaxed"><?= htmlspecialchars($popularProd['description']['tr'] ?? '') ?></p>
                        </div>

                        <!-- Allergenler & Hazırlık Süresi -->
                        <div class="pt-2 border-t border-neutral-800/80 flex items-center justify-between flex-wrap gap-2 text-[10px]">
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <span class="text-neutral-400 font-semibold">Alerjenler:</span>
                                <?php foreach ($popularProd['allergens'] ?? [] as $alg): ?>
                                <span class="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium"><?= htmlspecialchars($alg) ?></span>
                                <?php endforeach; ?>
                            </div>
                            <div class="flex items-center gap-2 font-mono text-neutral-400">
                                <?php if (!empty($popularProd['preparationTime'])): ?>
                                <span class="text-cyan-400">~<?= $popularProd['preparationTime'] ?> dk</span>
                                <?php endif; ?>
                                <?php if (!empty($popularProd['calories'])): ?>
                                <span><?= $popularProd['calories'] ?> kcal</span>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                    <?php endif; ?>

                    <!-- Diğer Ürünler Satır Listesi -->
                    <div class="space-y-2">
                        <?php foreach ($otherProds as $op): ?>
                        <div class="p-2.5 rounded-xl bg-neutral-950/60 hover:bg-neutral-950 border border-neutral-800/70 flex items-center justify-between gap-3 transition-colors">
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-xs text-white truncate"><?= htmlspecialchars($op['name']['tr'] ?? '') ?></h4>
                                <p class="text-[10px] text-neutral-400 line-clamp-1"><?= htmlspecialchars($op['description']['tr'] ?? '') ?></p>
                            </div>
                            <div class="font-mono font-black text-xs text-amber-400 shrink-0">
                                <?= Helpers::formatPrice((float)$op['price'], 'TRY') ?>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </main>

    <?php else: ?>
    <!-- ========================================================================= -->
    <!-- HİBRİT KAMPANYALI MENÜBOARD TV (BANNER, VİTRİN, QR KOD & ALT BANT)        -->
    <!-- ========================================================================= -->
    <header class="relative z-10 px-8 py-4 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 flex items-center justify-between">
        <div class="flex items-center gap-4">
            <span class="text-4xl p-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-inner"><?= $venue['logo'] ?? '🥩' ?></span>
            <div>
                <div class="flex items-center gap-3">
                    <h1 class="text-2xl font-black tracking-wider uppercase text-white animate-drift"><?= htmlspecialchars($venue['name']) ?></h1>
                    <span class="px-3 py-1 rounded text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 tracking-wider shadow">
                        DIGITAL MENUBOARD TV
                    </span>
                </div>
                <p class="text-xs text-neutral-400 font-medium"><?= htmlspecialchars($venue['tagline']) ?></p>
            </div>
        </div>

        <div class="flex items-center gap-5">
            <div class="flex items-center gap-2 font-mono text-lg font-black text-amber-400 bg-neutral-900/90 px-4 py-2 rounded-2xl border border-neutral-800/80 shadow-inner">
                <i class="fa-regular fa-clock text-amber-400 mr-1"></i>
                <span id="tv-clock"><?= date('H:i:s') ?></span>
            </div>
        </div>
    </header>

    <main class="relative z-10 flex-1 p-8 grid grid-cols-12 gap-8 items-stretch">
        <div class="col-span-12 lg:col-span-7 flex flex-col justify-between rounded-3xl overflow-hidden border bg-neutral-900/90 shadow-2xl relative animate-border-shimmer backdrop-blur-sm">
            <?php if ($camp): ?>
            <div class="relative h-72 sm:h-96 w-full overflow-hidden bg-neutral-950">
                <img src="<?= htmlspecialchars($camp['bannerImage']) ?>" alt="" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent"></div>
                <div class="absolute top-6 left-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 text-white font-black text-sm tracking-widest shadow-2xl animate-glow">
                    <i class="fa-solid fa-gift"></i>
                    <span><?= htmlspecialchars($camp['badgeText']['tr'] ?? '1 ALANA 1 BEDAVA') ?></span>
                </div>
                <div class="absolute bottom-6 left-8 right-8">
                    <h2 class="text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow-xl animate-drift">
                        <?= htmlspecialchars($camp['title']['tr'] ?? 'GURME BURGER') ?>
                    </h2>
                    <p class="text-base text-amber-300 font-bold mt-1.5 drop-shadow">
                        <?= htmlspecialchars($camp['subtitle']['tr'] ?? '') ?>
                    </p>
                </div>
            </div>
            <div class="p-8 space-y-4 flex-1 flex flex-col justify-between bg-neutral-900/95">
                <p class="text-base text-neutral-300 leading-relaxed font-normal">
                    <?= htmlspecialchars($camp['description']['tr'] ?? '') ?>
                </p>
                <div class="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800/90 flex items-center justify-between shadow-inner">
                    <div>
                        <span class="text-xs text-neutral-400 block font-semibold">Masanızdaki QR Kodu Okutun:</span>
                        <span class="text-sm text-emerald-400 font-bold flex items-center gap-2 mt-0.5">
                            <i class="fa-solid fa-wand-magic-sparkles"></i> İkinci Ürünü 0 ₺ Ücretsiz Seçin!
                        </span>
                    </div>
                    <div class="flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-800">
                        <span class="text-sm font-mono font-bold text-amber-400">qradv.com/qr/<?= $venue['slug'] ?></span>
                        <i class="fa-solid fa-arrow-right text-amber-400"></i>
                    </div>
                </div>
            </div>
            <?php endif; ?>
        </div>

        <div class="col-span-12 lg:col-span-5 flex flex-col justify-between gap-6">
            <div class="rounded-3xl bg-neutral-900/90 border border-neutral-800/90 p-6 space-y-4 flex-1 backdrop-blur-sm">
                <div class="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <span class="text-sm font-black tracking-widest uppercase text-amber-400 flex items-center gap-2 animate-drift">
                        <i class="fa-solid fa-fire-flame-curved text-orange-400"></i>
                        ŞEFİN TAVSİYELERİ & GÜNÜN MENÜSÜ
                    </span>
                    <span class="text-xs text-neutral-400 font-mono">Canlı Fiyatlar</span>
                </div>
                <div class="space-y-3">
                    <?php foreach (array_slice($products, 0, 3) as $p): ?>
                    <div class="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 flex items-center justify-between gap-4">
                        <img src="<?= htmlspecialchars($p['image']) ?>" alt="" class="w-16 h-16 rounded-xl object-cover shrink-0 shadow">
                        <div class="flex-1 min-w-0">
                            <h4 class="font-bold text-sm text-white truncate"><?= htmlspecialchars($p['name']['tr'] ?? '') ?></h4>
                            <p class="text-xs text-neutral-400 line-clamp-1"><?= htmlspecialchars($p['description']['tr'] ?? '') ?></p>
                            <div class="flex items-center gap-3 mt-1 text-[11px]">
                                <span class="text-neutral-400"><?= $p['calories'] ?? '' ?> kcal</span>
                                <span class="text-cyan-400 font-mono">~<?= $p['preparationTime'] ?? '' ?> dk</span>
                            </div>
                        </div>
                        <div class="font-black text-base text-amber-400 shrink-0 font-mono animate-glow">
                            <?= Helpers::formatPrice((float)$p['price'], 'TRY') ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="rounded-3xl bg-gradient-to-r from-neutral-900/90 to-neutral-950 border border-amber-500/30 p-6 flex items-center justify-between gap-6 shadow-2xl">
                <div class="space-y-1.5">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span class="text-xs font-black text-amber-400 uppercase tracking-wider animate-drift">TELEFONLA SİPARİŞ VERİN</span>
                    </div>
                    <h3 class="font-bold text-base text-white">QR Kodu Kameranızla Okutun</h3>
                    <p class="text-xs text-neutral-400">Garson beklemeden sipariş verin veya masanıza hesap isteyin</p>
                    <p class="text-xs text-neutral-400 font-mono pt-1">
                        Wi-Fi: <strong class="text-white"><?= htmlspecialchars($venue['wifiName']) ?></strong> (Şifre: <strong class="text-amber-400"><?= htmlspecialchars($venue['wifiPassword']) ?></strong>)
                    </p>
                </div>
                <div class="p-4 rounded-2xl bg-white text-black shrink-0 text-center shadow-2xl">
                    <i class="fa-solid fa-qrcode text-6xl text-neutral-950"></i>
                    <span class="text-[10px] font-mono font-black block mt-1 tracking-wider">SCAN ME</span>
                </div>
            </div>
        </div>
    </main>

    <footer class="relative z-10 bg-amber-500 text-neutral-950 font-black text-sm py-2.5 px-6 overflow-hidden shadow-2xl">
        <div class="flex items-center gap-12 whitespace-nowrap animate-marquee-slow">
            <span><?= htmlspecialchars($currentScreen['tickerMessage'] ?? '1 ALANA 1 BEDAVA GURME BURGER!') ?></span>
            <span>•</span>
            <span>🥩 1 ALANA 1 BEDAVA GURME BURGER FIRSATINI KAÇIRMAYIN!</span>
            <span>•</span>
            <span>🍹 HAPPY HOUR: 15:00 - 19:00 ARASI TÜM İÇECEKLERDE %50 İNDİRİM!</span>
            <span>•</span>
            <span>📱 AKILLI MENÜ: qradv.com/qr/<?= $venue['slug'] ?></span>
            <span>•</span>
            <span>⚡ GARSON ÇAĞIR / HESAP İSTE / MASAYA SİPARİŞ VER</span>
        </div>
    </footer>
    <?php endif; ?>

    <script>
        setInterval(() => {
            const now = new Date();
            const clockEl = document.getElementById('tv-clock') || document.getElementById('tv-clock-pure');
            if (clockEl) {
                clockEl.textContent = now.toLocaleTimeString('tr-TR');
            }
        }, 1000);
    </script>
</body>
</html>
