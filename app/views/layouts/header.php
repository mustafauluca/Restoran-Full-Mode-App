<!DOCTYPE html>
<html lang="<?= htmlspecialchars(\App\Core\Helpers::getLang()) ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title><?= htmlspecialchars($pageTitle ?? 'QR Adv Enterprise') ?></title>
    <meta name="description" content="QR Adv Akıllı QR Menü, POS & TV Menuboard Sistemi">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee-slow { display: inline-block; white-space: nowrap; animation: marquee 45s linear infinite; }
    </style>
</head>
<body class="bg-neutral-950 text-neutral-100 min-h-screen flex flex-col selection:bg-amber-500 selection:text-black">
