<?php
declare(strict_types=1);

use App\Core\Helpers;

$station = $_GET['station'] ?? 'kitchen';
$pageTitle = "POS & Mutfak KDS İstasyonu | QR Adv";
require_once dirname(__DIR__, 2) . '/views/layouts/header.php';
?>

<div class="flex-1 flex flex-col bg-neutral-950 text-white select-none">
    <!-- Top Station Switcher Bar -->
    <header class="p-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <span class="text-xl p-1 bg-amber-500/10 rounded-lg text-amber-400 font-mono font-bold">POS</span>
            <div>
                <h1 class="text-xs font-black uppercase tracking-wider text-white">QR Adv Dokunmatik İstasyon</h1>
                <p class="text-[10px] text-neutral-400">Lezzet Durağı Steakhouse</p>
            </div>
        </div>

        <!-- Station Selector Tabs -->
        <div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
            <a href="?station=kitchen" class="px-3 py-1 rounded-lg font-bold transition <?= $station === 'kitchen' ? 'bg-amber-500 text-black shadow' : 'text-neutral-400 hover:text-white' ?>">
                <i class="fa-solid fa-fire mr-1"></i>Mutfak (KDS)
            </a>
            <a href="?station=grill" class="px-3 py-1 rounded-lg font-bold transition <?= $station === 'grill' ? 'bg-amber-500 text-black shadow' : 'text-neutral-400 hover:text-white' ?>">
                <i class="fa-solid fa-drumstick-bite mr-1"></i>Izgara
            </a>
            <a href="?station=waiter" class="px-3 py-1 rounded-lg font-bold transition <?= $station === 'waiter' ? 'bg-amber-500 text-black shadow' : 'text-neutral-400 hover:text-white' ?>">
                <i class="fa-solid fa-bell mr-1"></i>Garson Masalar
            </a>
            <a href="?station=cashier" class="px-3 py-1 rounded-lg font-bold transition <?= $station === 'cashier' ? 'bg-amber-500 text-black shadow' : 'text-neutral-400 hover:text-white' ?>">
                <i class="fa-solid fa-receipt mr-1"></i>Kasa & Adisyon
            </a>
        </div>

        <div class="flex items-center gap-3">
            <span class="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Sesli Uyarı Açık</span>
            </span>
            <button onclick="playBuzzerSound()" class="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs" title="Ses Testi">
                <i class="fa-solid fa-volume-high"></i>
            </button>
        </div>
    </header>

    <!-- Orders Board -->
    <main class="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
        <!-- Order Card 1: Masa 3 (Active Cooking) -->
        <div class="rounded-2xl bg-neutral-900 border-2 border-amber-500 shadow-xl overflow-hidden flex flex-col justify-between" id="order-card-101">
            <div class="p-4 border-b border-neutral-800 flex items-center justify-between bg-amber-500/10">
                <div>
                    <span class="text-xs font-black text-amber-400 uppercase tracking-wider block">MASA 3 (Salon)</span>
                    <span class="text-[10px] text-neutral-400 font-mono">Sipariş #101 • 4 dk önce</span>
                </div>
                <button onclick="printTicket('101')" class="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs" title="Mutfak Adisyonu Yazdır">
                    <i class="fa-solid fa-print"></i>
                </button>
            </div>

            <div class="p-4 space-y-3 text-xs flex-1">
                <div class="flex items-start justify-between">
                    <div>
                        <strong class="text-white text-sm">1x Truffle & Mantar Burger</strong>
                        <p class="text-[11px] text-amber-300 italic">Not: İyi pişmiş, ekstra karamelize soğan</p>
                    </div>
                    <span class="font-mono text-neutral-400 font-bold">380 ₺</span>
                </div>
                <div class="flex items-start justify-between">
                    <div>
                        <strong class="text-emerald-400 text-sm">1x Dallas Smash Burger (1+1 Bedava)</strong>
                        <p class="text-[11px] text-neutral-400">Not: Turşu olmasın</p>
                    </div>
                    <span class="font-mono text-emerald-400 font-bold">0 ₺</span>
                </div>
                <div class="flex items-start justify-between">
                    <div>
                        <strong class="text-white text-sm">2x Çilekli Ev Yapımı Limonata</strong>
                    </div>
                    <span class="font-mono text-neutral-400 font-bold">180 ₺</span>
                </div>

                <div class="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    <span class="text-neutral-400">Toplam:</span>
                    <span class="font-mono font-black text-amber-400 text-sm">560,00 ₺</span>
                </div>
            </div>

            <div class="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2">
                <button onclick="completeOrder('order-card-101')" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-lg shadow-emerald-600/30">
                    <i class="fa-solid fa-check-double"></i>
                    <span>Siparişi Tamamla / Hazır</span>
                </button>
            </div>
        </div>

        <!-- Order Card 2: Adrese Paket Sipariş -->
        <div class="rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl overflow-hidden flex flex-col justify-between" id="order-card-102">
            <div class="p-4 border-b border-neutral-800 flex items-center justify-between bg-blue-500/10">
                <div>
                    <span class="text-xs font-black text-blue-400 uppercase tracking-wider block">🛵 ADRESE TESLİMAT</span>
                    <span class="text-[10px] text-neutral-400 font-mono">Paket #102 • Mehmet Y. • Kadıköy</span>
                </div>
                <button onclick="printTicket('102')" class="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs">
                    <i class="fa-solid fa-print"></i>
                </button>
            </div>

            <div class="p-4 space-y-3 text-xs flex-1">
                <div class="flex items-start justify-between">
                    <div>
                        <strong class="text-white text-sm">1x Dry Aged Dallas Steak (450g)</strong>
                        <p class="text-[11px] text-amber-300 italic">Not: Orta-İyi pişmiş, sıcak paketleme</p>
                    </div>
                    <span class="font-mono text-neutral-400 font-bold">790 ₺</span>
                </div>

                <div class="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] space-y-1">
                    <div class="text-neutral-400"><i class="fa-solid fa-location-dot text-amber-400 mr-1"></i>Adres: Moda Cad. No: 18 Kat: 3 D: 6</div>
                    <div class="text-neutral-400"><i class="fa-solid fa-phone text-emerald-400 mr-1"></i>Tel: +90 532 999 8877</div>
                </div>

                <div class="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    <span class="text-neutral-400">Toplam (Kurye Ücretsiz):</span>
                    <span class="font-mono font-black text-amber-400 text-sm">790,00 ₺</span>
                </div>
            </div>

            <div class="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2">
                <button onclick="completeOrder('order-card-102')" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-lg shadow-emerald-600/30">
                    <i class="fa-solid fa-motorcycle"></i>
                    <span>Kuryeye Teslim Et</span>
                </button>
            </div>
        </div>
    </main>
</div>

<script>
function playBuzzerSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
    } catch(e) {}
}

function completeOrder(cardId) {
    playBuzzerSound();
    const card = document.getElementById(cardId);
    if (card) {
        card.style.opacity = '0.35';
        card.style.pointerEvents = 'none';
        alert("🎉 Sipariş hazır olarak işaretlendi ve garsona/kuryeye bildirim gönderildi!");
    }
}

function printTicket(orderId) {
    window.print();
}
</script>

<?php require_once dirname(__DIR__, 2) . '/views/layouts/footer.php'; ?>
