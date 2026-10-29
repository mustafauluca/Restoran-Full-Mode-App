<?php
declare(strict_types=1);

use App\Core\Helpers;

$rates = Helpers::getExchangeRates();
$pageTitle = "Sistem Süper Yönetici Paneli | QR Adv Master";
require_once dirname(__DIR__, 2) . '/views/layouts/header.php';
?>

<div class="max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-6">
    <header class="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono text-[10px] font-bold">SUPER ADMIN</span>
                <h1 class="text-lg font-black text-white">QR Adv Enterprise - Platform Genel Yöneticisi</h1>
            </div>
            <p class="text-xs text-neutral-400 mt-0.5">Tüm mekanlar, lisanslar, abonelikler, radyo frekansları ve menuboard TV ekranları</p>
        </div>
        <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span class="text-xs font-mono text-emerald-400 font-bold">Sistem Çevrimiçi</span>
        </div>
    </header>

    <!-- Global Key Metrics -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
            <span class="text-xs text-neutral-400">Kayıtlı Mekanlar</span>
            <div class="text-2xl font-black text-white font-mono mt-1">42</div>
            <span class="text-[10px] text-emerald-400">+4 bu hafta</span>
        </div>
        <div class="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
            <span class="text-xs text-neutral-400">Aktif TV Ekranları</span>
            <div class="text-2xl font-black text-amber-400 font-mono mt-1">118</div>
            <span class="text-[10px] text-neutral-500">Canlı Yayın</span>
        </div>
        <div class="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
            <span class="text-xs text-neutral-400">Aylık QR Okutma</span>
            <div class="text-2xl font-black text-cyan-400 font-mono mt-1">184.250</div>
            <span class="text-[10px] text-emerald-400">%99.98 uptime</span>
        </div>
        <div class="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
            <span class="text-xs text-neutral-400">İşlem Hacmi (TRY)</span>
            <div class="text-2xl font-black text-emerald-400 font-mono mt-1">₺ 4.82M</div>
            <span class="text-[10px] text-neutral-500">Bu ay</span>
        </div>
    </div>

    <!-- Tenant Venues List -->
    <div class="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div class="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-store text-amber-400"></i>
                <span>Aktif Mekanlar & Lisans Durumu</span>
            </h2>
            <button onclick="alert('Yeni mekan lisansı oluşturma penceresi açıldı.')" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition">
                <i class="fa-solid fa-plus mr-1"></i>Yeni Mekan Ekle
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-neutral-300">
                <thead class="bg-neutral-950 text-neutral-400 font-bold border-b border-neutral-800">
                    <tr>
                        <th class="p-3">Mekan Adı</th>
                        <th class="p-3">Slug / Domain</th>
                        <th class="p-3">Paket</th>
                        <th class="p-3">TV / Radyo</th>
                        <th class="p-3">Durum</th>
                        <th class="p-3 text-right">İşlemler</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-neutral-800/60">
                    <tr class="hover:bg-neutral-800/40">
                        <td class="p-3 font-bold text-white flex items-center gap-2">
                            <span>🥩</span>
                            <span>Lezzet Durağı Steakhouse</span>
                        </td>
                        <td class="p-3 font-mono text-amber-400">qradv.com/qr/lezzet-duragi</td>
                        <td class="p-3"><span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">Enterprise Pro</span></td>
                        <td class="p-3">2 Ekran + Radyo</td>
                        <td class="p-3"><span class="text-emerald-400 font-bold">● Aktif</span></td>
                        <td class="p-3 text-right">
                            <a href="/panel" class="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition">Yönet</a>
                        </td>
                    </tr>
                    <tr class="hover:bg-neutral-800/40">
                        <td class="p-3 font-bold text-white flex items-center gap-2">
                            <span>☕</span>
                            <span>Boğaziçi Cafe & Bistro</span>
                        </td>
                        <td class="p-3 font-mono text-neutral-400">qradv.com/qr/bogazici-cafe</td>
                        <td class="p-3"><span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">Standart</span></td>
                        <td class="p-3">1 Ekran</td>
                        <td class="p-3"><span class="text-emerald-400 font-bold">● Aktif</span></td>
                        <td class="p-3 text-right">
                            <button class="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition">Yönet</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Global Müzik Türleri Yönetimi (Site Yöneticisi) -->
    <div class="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div class="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
                <h2 class="text-sm font-bold text-white flex items-center gap-2">
                    <i class="fa-solid fa-music text-amber-400"></i>
                    <span>Sistem Müzik Türleri (Site Yöneticisi Tarafından Belirlenir)</span>
                </h2>
                <p class="text-xs text-neutral-400">Restoran firmaları çalma listelerini bu türler arasından çoklu seçim yaparak oluşturur.</p>
            </div>
            <button onclick="alert('Yeni müzik türü ekleme penceresi açıldı.')" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition">
                <i class="fa-solid fa-plus mr-1"></i>Yeni Tür Ekle
            </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                <div>
                    <span class="font-bold text-white">☕ Lounge & Chillout</span>
                    <p class="text-[10px] text-neutral-400 mt-0.5">Sıcak, telifsiz yemek fon ritimleri</p>
                </div>
                <span class="text-emerald-400 font-bold text-[10px]">Aktif</span>
            </div>
            <div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                <div>
                    <span class="font-bold text-white">🎷 Acoustic & Nu-Jazz</span>
                    <p class="text-[10px] text-neutral-400 mt-0.5">Saksafon ve kontrbas tınıları</p>
                </div>
                <span class="text-emerald-400 font-bold text-[10px]">Aktif</span>
            </div>
            <div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                <div>
                    <span class="font-bold text-white">🎧 Deep House & Warm Grooves</span>
                    <p class="text-[10px] text-neutral-400 mt-0.5">Gece saatleri ve bar bölümü</p>
                </div>
                <span class="text-emerald-400 font-bold text-[10px]">Aktif</span>
            </div>
        </div>
    </div>
</div>

<?php require_once dirname(__DIR__, 2) . '/views/layouts/footer.php'; ?>
