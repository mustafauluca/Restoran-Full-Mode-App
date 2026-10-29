<?php
/**
 * QRAdv - Site Süper Yöneticisi Girişi (qradv.com/manager)
 */
session_start();
require_once __DIR__ . '/../config/db.php';

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($email === 'superadmin@qradv.com' && ($password === 'admin2026' || $password === 'admin123')) {
        $_SESSION['super_admin_logged'] = true;
        $_SESSION['super_admin_email'] = $email;
        header('Location: /manager');
        exit;
    } else {
        $error = 'Geçersiz Süper Admin e-posta veya güvenlik anahtarı!';
    }
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Site Süper Yöneticisi Girişi | QRAdv Platform</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-neutral-950 text-neutral-100 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div class="text-center space-y-2">
            <span class="inline-block px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-mono font-bold uppercase">
                qradv.com/manager • Platform Root Level
            </span>
            <h1 class="text-2xl font-black text-white">Site Süper Yöneticisi Girişi</h1>
            <p class="text-xs text-neutral-400">Tüm restoran firmaları, lisanslar ve küresel 6 saatlik kur servisi</p>
        </div>

        <?php if ($error): ?>
            <div class="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl font-bold">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" class="space-y-4">
            <div>
                <label class="text-xs font-bold text-neutral-300 block mb-1">Süper Admin E-Posta</label>
                <input type="email" name="email" value="superadmin@qradv.com" required
                       class="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-sm focus:outline-none focus:border-red-500">
            </div>

            <div>
                <label class="text-xs font-bold text-neutral-300 block mb-1">Güvenlik Parolası</label>
                <input type="password" name="password" value="admin2026" required
                       class="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-sm focus:outline-none focus:border-red-500">
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg transition-all cursor-pointer">
                Platform Konsoluna Giriş Yap
            </button>
        </form>

        <div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1 text-neutral-400">
            <span class="text-neutral-300 font-bold block">Hazır Demo Girişi:</span>
            <p class="font-mono text-[11px]">E-posta: <strong class="text-white">superadmin@qradv.com</strong></p>
            <p class="font-mono text-[11px]">Şifre: <strong class="text-white">admin2026</strong></p>
        </div>
    </div>
</body>
</html>
