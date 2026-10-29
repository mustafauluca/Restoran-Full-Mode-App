<?php
$pageTitle = "404 - Sayfa Bulunamadı | QR Adv";
require_once __DIR__ . '/header.php';
?>
<main class="flex-1 flex items-center justify-center p-6">
    <div class="max-w-md w-full text-center space-y-4 p-8 rounded-3xl bg-neutral-900 border border-neutral-800">
        <div class="text-6xl font-black text-amber-500 font-mono">404</div>
        <h1 class="text-2xl font-bold text-white">Sayfa Bulunamadı</h1>
        <p class="text-sm text-neutral-400">Aradığınız menü veya panel sayfası taşınmış ya da mevcut olmayabilir.</p>
        <div class="pt-4 flex flex-col gap-2">
            <a href="/qr/lezzet-duragi" class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition">
                <i class="fa-solid fa-qrcode mr-2"></i>QR Menüye Git
            </a>
            <a href="/panel" class="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium transition">
                <i class="fa-solid fa-shield mr-2"></i>Yönetici Paneli
            </a>
        </div>
    </div>
</main>
<?php require_once __DIR__ . '/footer.php'; ?>
