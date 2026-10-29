<?php
/**
 * QRAdv - Firma & Restoran Yöneticisi Girişi (qradv.com/panel)
 */
session_start();
require_once __DIR__ . '/../config/db.php';

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($email === 'yonetici@lezzetduragi.com' && ($password === 'lezzet2026' || $password === 'manager123')) {
        $_SESSION['venue_manager_logged'] = true;
        $_SESSION['venue_manager_email'] = $email;
        $_SESSION['venue_id'] = 1;
        header('Location: /panel');
        exit;
    } else {
        $error = 'Hatalı mekan yöneticisi e-posta veya şifresi!';
    }
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mekan Sahibi & Restoran Yöneticisi Girişi | QRAdv</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-neutral-950 text-neutral-100 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div class="text-center space-y-2">
            <span class="inline-block px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-400 text-xs font-mono font-bold uppercase">
                qradv.com/panel • Restoran Müdürü
            </span>
            <h1 class="text-2xl font-black text-white">Mekan Yönetim Paneli Girişi</h1>
            <p class="text-xs text-neutral-400">Lezzet Durağı — Menü, Masa Ekleme, Sepet Kotaları ve 6s Kur Yönetimi</p>
        </div>

        <?php if ($error): ?>
            <div class="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl font-bold">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" class="space-y-4">
            <div>
                <label class="text-xs font-bold text-neutral-300 block mb-1">Müdür E-Posta</label>
                <input type="email" name="email" value="yonetici@lezzetduragi.com" required
                       class="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-sm focus:outline-none focus:border-amber-500">
            </div>

            <div>
                <label class="text-xs font-bold text-neutral-300 block mb-1">Şifre</label>
                <input type="password" name="password" value="lezzet2026" required
                       class="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-sm focus:outline-none focus:border-amber-500">
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-sm shadow-lg transition-all cursor-pointer">
                Mekan Paneline Giriş Yap
            </button>
        </form>

        <div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1 text-neutral-400">
            <span class="text-neutral-300 font-bold block">Hazır Demo Girişi:</span>
            <p class="font-mono text-[11px]">E-posta: <strong class="text-white">yonetici@lezzetduragi.com</strong></p>
            <p class="font-mono text-[11px]">Şifre: <strong class="text-white">lezzet2026</strong></p>
        </div>
    </div>
</body>
</html>
