<?php
declare(strict_types=1);

use App\Core\Helpers;

$slug = $_ROUTE_PARAMS['slug'] ?? 'lezzet-duragi';
$venue = Helpers::getVenue($slug);
$pageTitle = htmlspecialchars($venue['name']) . " | Canlı Mekan Radyo Yayını";
require_once dirname(__DIR__, 2) . '/views/layouts/header.php';
?>

<div class="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6">
    <header class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
            <span class="text-3xl p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <i class="fa-solid fa-radio"></i>
            </span>
            <div>
                <h1 class="text-lg font-black text-white"><?= htmlspecialchars($venue['name']) ?> - Canlı Mekan Radyosu</h1>
                <p class="text-xs text-neutral-400">Lounge Müzikleri, Kurumsal Jingle'lar, Kampanya Reklamları & Mutfak Anonsları</p>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>YAYINDA (Canlı Stream)</span>
            </span>
        </div>
    </header>

    <!-- Main Radio Deck Player -->
    <div class="p-6 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-amber-500/30 shadow-2xl space-y-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-4">
                <div class="w-20 h-20 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-amber-400 shadow-inner">
                    <i class="fa-solid fa-music text-3xl animate-bounce"></i>
                </div>
                <div>
                    <span class="text-[10px] font-mono font-bold text-amber-400 tracking-wider uppercase block">ŞU AN ÇALIYOR:</span>
                    <h3 class="text-lg font-extrabold text-white" id="now-playing-title">Sunset Lounge & Coffee Beats Vol. 4</h3>
                    <p class="text-xs text-neutral-400" id="now-playing-category">Kategori: /radio/sarkilar/ • 128 kbps Stereo</p>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <button onclick="toggleRadioPlay()" id="radio-play-btn" class="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center text-xl font-bold shadow-lg shadow-amber-500/30 transition active:scale-95">
                    <i class="fa-solid fa-play" id="play-icon"></i>
                </button>
            </div>
        </div>

        <!-- Audio Channels and Categories -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                <i class="fa-solid fa-headphones text-amber-400 text-base mb-1"></i>
                <div class="text-xs font-bold text-white">/radio/sarkilar/</div>
                <div class="text-[10px] text-neutral-400">42 Parça (Lounge & Bossa)</div>
            </div>
            <div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                <i class="fa-solid fa-bell text-rose-400 text-base mb-1"></i>
                <div class="text-xs font-bold text-white">/radio/jingle/</div>
                <div class="text-[10px] text-neutral-400">3 Jingle (Mekan Giriş)</div>
            </div>
            <div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                <i class="fa-solid fa-bullhorn text-cyan-400 text-base mb-1"></i>
                <div class="text-xs font-bold text-white">/radio/reklam/</div>
                <div class="text-[10px] text-neutral-400">1+1 Burger & Happy Hour</div>
            </div>
            <div class="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                <i class="fa-solid fa-microphone text-emerald-400 text-base mb-1"></i>
                <div class="text-xs font-bold text-white">/radio/anonslar/</div>
                <div class="text-[10px] text-neutral-400">Mutfak & Kurye Çağrı</div>
            </div>
        </div>

        <!-- Playlists (Firma Özel Çalma Listeleri & Çoklu Tür Seçimi) -->
        <div class="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-xs font-bold text-white flex items-center gap-2">
                        <i class="fa-solid fa-list-check text-amber-400"></i>
                        <span>Firma Çalma Listeleri & Çoklu Tür Seçimi</span>
                    </h3>
                    <p class="text-[10px] text-neutral-400">Mekanın kendi oluşturduğu listeler (Türler site yöneticisi tarafından belirlenir)</p>
                </div>
                <span class="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">2 Özel Liste</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="p-3 rounded-xl bg-neutral-900 border border-amber-500/50 flex items-center justify-between">
                    <div>
                        <h4 class="font-bold text-xs text-white">Akşam Yemeği & Lounge</h4>
                        <div class="flex items-center gap-1.5 mt-1">
                            <span class="text-[9px] px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-300">Lounge</span>
                            <span class="text-[9px] px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-300">Nu-Jazz</span>
                            <span class="text-[9px] px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-300">Akustik</span>
                        </div>
                    </div>
                    <span class="px-2 py-1 rounded bg-amber-500 text-neutral-950 font-black text-[10px]">Aktif</span>
                </div>

                <div class="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <div>
                        <h4 class="font-bold text-xs text-white">Hafta Sonu Dinamik Ritim</h4>
                        <div class="flex items-center gap-1.5 mt-1">
                            <span class="text-[9px] px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-300">Deep House</span>
                            <span class="text-[9px] px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-300">Bossa Nova</span>
                        </div>
                    </div>
                    <button onclick="alert('Playlist değiştirildi!')" class="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] font-bold">Seç</button>
                </div>
            </div>
        </div>

        <!-- Quick Instant Trigger Buttons -->
        <div class="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-wrap items-center justify-between gap-3">
            <span class="text-xs font-bold text-neutral-300">Anlık Ses Tetikleyici:</span>
            <div class="flex items-center gap-2">
                <button onclick="triggerSound('1+1 Kampanya Reklamı')" class="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-bold transition">
                    <i class="fa-solid fa-tag mr-1"></i>1+1 Reklamı Çal
                </button>
                <button onclick="triggerSound('Mutfak Hazır Anonsu')" class="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400 text-xs font-bold transition">
                    <i class="fa-solid fa-utensils mr-1"></i>Mutfak Anonsu Ver
                </button>
            </div>
        </div>
    </div>
</div>

<script>
let isPlaying = false;
let audioContext = null;
let currentOsc = null;

function toggleRadioPlay() {
    isPlaying = !isPlaying;
    const icon = document.getElementById('play-icon');
    if (isPlaying) {
        icon.className = 'fa-solid fa-pause';
        playAmbientChords();
    } else {
        icon.className = 'fa-solid fa-play';
        stopAmbientChords();
    }
}

function playAmbientChords() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(261.63, audioContext.currentTime); // C4
        gain.gain.setValueAtTime(0.05, audioContext.currentTime);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        currentOsc = osc;
    } catch(e) {}
}

function stopAmbientChords() {
    if (currentOsc) {
        try { currentOsc.stop(); currentOsc.disconnect(); } catch(e) {}
        currentOsc = null;
    }
}

function triggerSound(type) {
    alert("📢 " + type + " mekana canlı anons olarak yayınlandı!");
}
</script>

<?php require_once dirname(__DIR__, 2) . '/views/layouts/footer.php'; ?>
