import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Music,
  Megaphone,
  Check,
} from 'lucide-react';

export const VenueRadioApp: React.FC = () => {
  const {
    venue,
    radioChannels,
    activeRadio,
    setActiveRadio,
    isPlayingRadio,
    setIsPlayingRadio,
    radioVolume,
    setRadioVolume,
  } = useApp();

  const [announcementText, setAnnouncementText] = useState(
    'Değerli misafirlerimiz, şefimizin hazırladığı 1 Alana 1 Bedava Burger Festivali masanızda sizi bekliyor! Masadaki QR kodu okutarak 0 TL hediye burgerinizi hemen seçebilirsiniz. Afiyet olsun!'
  );
  const [isAnnouncing, setIsAnnouncing] = useState(false);

  // Play audio stream (synthesized lounge ambient chord or text-to-speech)
  const togglePlay = () => {
    setIsPlayingRadio(!isPlayingRadio);
  };

  const handlePlayAnnouncement = () => {
    if (!announcementText.trim()) return;
    setIsAnnouncing(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(announcementText);
      utterance.lang = 'tr-TR';
      utterance.rate = 0.95;
      utterance.onend = () => setIsAnnouncing(false);
      utterance.onerror = () => setIsAnnouncing(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsAnnouncing(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-6 space-y-6">
      {/* Radio Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400">
            <Radio className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white">
                Mekan Radyo Yayını & Anons Sistemi
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                qradv.com/radyo/{venue.slug.replace('_ana-menu', '')}_radio
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Restoran içi telifli arka plan müziği, ses düzey kontrolü ve masalara otomatik kampanya anonsları
            </p>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            CANLI YAYIN AKTİF
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Player Box (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-6">
            {/* Visual Equalizer */}
            <div className="h-28 rounded-2xl bg-neutral-950 border border-neutral-800/80 p-4 flex items-end justify-center gap-1.5 overflow-hidden">
              {[45, 65, 80, 55, 90, 75, 40, 85, 95, 60, 70, 50, 85, 65, 75, 90, 45, 80, 60, 70].map(
                (h, i) => (
                  <div
                    key={i}
                    style={{
                      height: isPlayingRadio ? `${h}%` : '8%',
                      transition: 'height 0.25s ease',
                    }}
                    className={`w-2 rounded-t-full transition-all ${
                      isPlayingRadio
                        ? 'bg-gradient-to-t from-amber-600 via-amber-400 to-amber-300'
                        : 'bg-neutral-800'
                    }`}
                  />
                )
              )}
            </div>

            {/* Now Playing Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5" />
                  Şu Anda Çalıyor ({activeRadio.name})
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">{activeRadio.currentTrack}</h3>
                <p className="text-sm text-neutral-400 font-medium">{activeRadio.currentArtist}</p>
                <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 mt-1">
                  Tür: {activeRadio.genre}
                </span>
              </div>

              {/* Play / Pause Big Button */}
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-neutral-950 flex items-center justify-center shadow-xl transition-all self-center sm:self-auto shrink-0"
              >
                {isPlayingRadio ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                )}
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
              <button
                onClick={() => setRadioVolume(radioVolume === 0 ? 70 : 0)}
                className="text-neutral-400 hover:text-white"
              >
                {radioVolume === 0 ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : (
                  <Volume2 className="w-5 h-5 text-amber-400" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={radioVolume}
                onChange={(e) => setRadioVolume(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-xs font-mono text-neutral-400 w-10 text-right">
                %{radioVolume}
              </span>
            </div>
          </div>

          {/* Voice Announcement Generator (Anons Sistemi) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Mekan İçi Sesli Promosyon & Kampanya Anonsu
              </h3>
            </div>
            <p className="text-xs text-neutral-400">
              Müziği otomatik olarak kısıp salondaki hoparlörlerden seçtiğiniz kampanya anonsunu seslendirir.
            </p>

            <textarea
              rows={3}
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-200 focus:outline-none focus:border-amber-500 leading-relaxed"
            />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setAnnouncementText(
                      'Değerli misafirlerimiz, 1 Alana 1 Bedava Gurme Burger Festivali başladı! Masanızdaki QR kodu okutarak anında sipariş verebilirsiniz.'
                    )
                  }
                  className="text-[11px] text-amber-400 underline hover:text-amber-300"
                >
                  Burger Şablonu
                </button>
                <span className="text-neutral-600">|</span>
                <button
                  type="button"
                  onClick={() =>
                    setAnnouncementText(
                      'Mutlu saatler başladı! Barımızda tüm taze kokteyl ve mocktaillerde ikinci içecek yüzde 50 indirimli!'
                    )
                  }
                  className="text-[11px] text-amber-400 underline hover:text-amber-300"
                >
                  Happy Hour Şablonu
                </button>
              </div>

              <button
                onClick={handlePlayAnnouncement}
                disabled={isAnnouncing}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                  isAnnouncing
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black'
                }`}
              >
                <Megaphone className="w-4 h-4" />
                <span>{isAnnouncing ? 'Anons Yapılıyor...' : 'Hoparlörden Anons Yap'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Radio Channels List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Mekan Müzik Kanalları ({radioChannels.length})
            </h3>

            <div className="space-y-2.5">
              {radioChannels.map((channel) => {
                const isSelected = activeRadio.id === channel.id;
                return (
                  <div
                    key={channel.id}
                    onClick={() => {
                      setActiveRadio(channel);
                      setIsPlayingRadio(true);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-white">{channel.name}</h4>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{channel.description}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/60 text-[10px]">
                      <span className="text-amber-300 font-mono">{channel.genre}</span>
                      <span className="text-emerald-400 font-semibold">Telif Lisanslı</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
