<?php
/**
 * QRAdv - Mekan Çalışanları & POS PIN Girişi (qradv.com/pos)
 */
session_start();
require_once __DIR__ . '/../config/db.php';

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pin = trim($_POST['pin'] ?? '');
    $station = $_POST['station'] ?? 'kitchen';

    $validPins = [
        'all' => '1234',
        'kitchen' => '2222',
        'grill' => '3333',
        'beverage' => '4444',
        'salad' => '5555',
        'meze' => '6666'
    ];

    if (isset($validPins[$station]) && ($validPins[$station] === $pin || $pin === '1234')) {
        $_SESSION['staff_logged'] = true;
        $_SESSION['staff_station'] = $station;
        header('Location: /pos');
        exit;
    } else {
        $error = 'Hatalı Personel PIN Kodu!';
    }
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Personel POS & Mutfak PIN Girişi | QRAdv</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-neutral-950 text-neutral-100 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div class="text-center space-y-1">
            <span class="inline-block px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-mono font-bold uppercase">
                qradv.com/pos • Mutfak KDS & Kasa
            </span>
            <h1 class="text-xl font-black text-white">Personel Hızlı PIN Girişi</h1>
            <p class="text-xs text-neutral-400">İstasyonunuzu seçin ve 4 haneli PIN kodunuzu girin</p>
        </div>

        <?php if ($error): ?>
            <div class="p-2.5 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl font-bold text-center">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" class="space-y-4">
            <div>
                <label class="text-xs font-bold text-neutral-300 block mb-1">Çalışma İstasyonu</label>
                <select name="station" class="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-bold text-xs focus:outline-none">
                    <option value="all">Kasa & Şef Garson (PIN: 1234)</option>
                    <option value="kitchen" selected>Ana Mutfak / Sıcak (PIN: 2222)</option>
                    <option value="grill">Izgara & Steak Ustası (PIN: 3333)</option>
                    <option value="beverage">Bar & İçecek Reyonu (PIN: 4444)</option>
                    <option value="salad">Salata Reyonu (PIN: 5555)</option>
                    <option value="meze">Meze & Soğuk Başlangıç (PIN: 6666)</option>
                </select>
            </div>

            <div>
                <label class="text-xs font-bold text-neutral-300 block mb-1">4 Haneli Personel PIN Kodu</label>
                <input type="password" maxlength="4" name="pin" value="2222" required
                       class="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-amber-400 font-mono text-center text-xl font-bold tracking-widest focus:outline-none focus:border-amber-500">
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-sm shadow-lg transition-all cursor-pointer">
                İstasyonu Başlat
            </button>
        </form>
    </div>
</body>
</html>
