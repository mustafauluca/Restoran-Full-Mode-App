import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Radio,
  Play,
  Pause,
  Volume2,
  Sparkles,
  Music,
  Plus,
  Check,
  X,
  ListMusic,
  Trash2,
  Sliders,
  Disc3,
  Layers,
} from 'lucide-react';
import { VenuePlaylist } from '../../types';

export const VenueRadioApp: React.FC = () => {
  const {
    venue,
    radioGenres,
    venuePlaylists,
    addVenuePlaylist,
    deleteVenuePlaylist,
    activePlaylistId,
    setActivePlaylistId,
    isPlayingRadio,
    setIsPlayingRadio,
    radioVolume,
    setRadioVolume,
  } = useApp();

  const [isAddPlaylistModalOpen, setIsAddPlaylistModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([
    'genre-lounge',
    'genre-jazz',
  ]);

  const [announcementText, setAnnouncementText] = useState(
    'Değerli misafirlerimiz, şefimizin hazırladığı 1 Alana 1 Bedava Burger Festivali masanızda sizi bekliyor! Masadaki QR kodu okutarak 0 TL hediye burgerinizi hemen seçebilirsiniz.'
  );
  const [isAnnouncing, setIsAnnouncing] = useState(false);

  const activePlaylist =
    venuePlaylists.find((p) => p.id === activePlaylistId) || venuePlaylists[0];

  const toggleGenreSelection = (genreId: string) => {
    setSelectedGenreIds((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    addVenuePlaylist({
      name: newPlaylistName.trim(),
      description: newPlaylistDesc.trim() || 'Mekan içi arka plan çalma listesi',
      selectedGenreIds: selectedGenreIds.length > 0 ? selectedGenreIds : ['genre-lounge'],
      trackCount: Math.floor(Math.random() * 20) + 25,
      isDefault: false,
    });

    setIsAddPlaylistModalOpen(false);
    setNewPlaylistName('');
    setNewPlaylistDesc('');
  };

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

  // Resolve genre names for active playlist
  const activePlaylistGenres = radioGenres.filter((g) =>
    activePlaylist?.selectedGenreIds.includes(g.id)
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400">
            <Radio className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white">
                Mekan Radyo & Playlist Yönetim Sistemi
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                qradv.com/radyo/{venue.slug.replace('_ana-menu', '')}_radio
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Firma tarafından oluşturulan çalma listeleri, çoklu tür seçimi ve canlı anons sistemi
            </p>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            CANLI AKIŞ AKTİF
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Radio Deck & Sound Synthesizer (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
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
                        ? 'bg-gradient-to-t from-amber-500 to-rose-500'
                        : 'bg-neutral-800'
                    }`}
                  />
                )
              )}
            </div>

            {/* Now Playing Banner */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Disc3 className={`w-6 h-6 ${isPlayingRadio ? 'animate-spin' : ''}`} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono font-bold text-amber-400 tracking-wider uppercase block">
                    ÇALMA LİSTESİ: {activePlaylist?.name || 'Varsayılan Liste'}
                  </span>
                  <h3 className="text-sm font-bold text-white truncate">
                    Lounge Sunset Melodies & Guitar Chillout
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {activePlaylistGenres.map((g) => (
                      <span
                        key={g.id}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800"
                      >
                        {g.icon} {g.name.split('&')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Play / Pause Toggle */}
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-neutral-950 flex items-center justify-center shadow-xl shadow-amber-500/30 transition-transform active:scale-95 shrink-0"
              >
                {isPlayingRadio ? (
                  <Pause className="w-6 h-6 fill-neutral-950" />
                ) : (
                  <Play className="w-6 h-6 fill-neutral-950 ml-1" />
                )}
              </button>
            </div>

            {/* Volume Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
                <span className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  Mekan İçi Ses Düzeyi (Master Volume)
                </span>
                <span className="font-mono font-bold text-amber-400">%{radioVolume}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={radioVolume}
                onChange={(e) => setRadioVolume(Number(e.target.value))}
                className="w-full accent-amber-500 bg-neutral-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Instant Announcement Tool */}
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Canlı Sesli Kampanya Anonsu
                </span>
                <span className="text-[11px] text-neutral-400">Masa Hoparlörlerine Yayın</span>
              </div>
              <textarea
                rows={2}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 outline-none focus:border-amber-500 resize-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handlePlayAnnouncement}
                  disabled={isAnnouncing}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-xs flex items-center gap-2 transition disabled:opacity-50"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>{isAnnouncing ? 'Anons Yapılıyor...' : 'Anonsu Canlı Oku'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Firm Playlists & Multi-Genre Selection (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-black text-sm text-white flex items-center gap-2">
                  <ListMusic className="w-4 h-4 text-amber-400" />
                  <span>Mekan Çalma Listeleri (Playlists)</span>
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Firma tarafından oluşturulan ve türleri seçilen listeler
                </p>
              </div>
              <button
                onClick={() => setIsAddPlaylistModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yeni Liste</span>
              </button>
            </div>

            {/* Playlists List */}
            <div className="space-y-2.5">
              {venuePlaylists.map((pl) => {
                const isActive = pl.id === activePlaylistId;
                const matchedGenres = radioGenres.filter((g) => pl.selectedGenreIds.includes(g.id));

                return (
                  <div
                    key={pl.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500/60 shadow-lg'
                        : 'bg-neutral-950 border-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-white truncate">{pl.name}</h4>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-neutral-950">
                              ÇALIYOR
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                          {pl.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {matchedGenres.map((g) => (
                            <span
                              key={g.id}
                              className="text-[9px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium"
                            >
                              {g.icon} {g.name.split('&')[0]}
                            </span>
                          ))}
                          <span className="text-[9px] text-neutral-500 font-mono">
                            • {pl.trackCount} Parça
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {!isActive ? (
                          <button
                            onClick={() => {
                              setActivePlaylistId(pl.id);
                              setIsPlayingRadio(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition"
                          >
                            Seç & Çal
                          </button>
                        ) : (
                          <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </span>
                        )}
                        {venuePlaylists.length > 1 && (
                          <button
                            onClick={() => deleteVenuePlaylist(pl.id)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 transition"
                            title="Listeyi Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Admin Managed Genres Overview Box */}
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-xs space-y-2">
            <span className="font-bold text-neutral-300 block flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Sistem Müzik Türleri (Site Yöneticisi Tarafından Belirlenir):
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {radioGenres.map((g) => (
                <span
                  key={g.id}
                  className="px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 text-[10px]"
                >
                  {g.icon} {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: YENİ PLAYLIST OLUŞTURMA */}
      {isAddPlaylistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <ListMusic className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base text-white">Yeni Çalma Listesi Oluştur</h3>
              </div>
              <button
                onClick={() => setIsAddPlaylistModalOpen(false)}
                className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Çalma Listesi Adı
                </label>
                <input
                  type="text"
                  placeholder="Örn: Akşam Yemeği & Lounge Ritimleri"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Açıklama</label>
                <input
                  type="text"
                  placeholder="Örn: Masalara özel huzurlu yemek atmosferi"
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-amber-500 outline-none"
                />
              </div>

              {/* Multi-Genre Selection */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Çalma Listesine Dahil Edilecek Türleri Seçin (Çoklu Seçim):
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1 bg-neutral-950 rounded-xl border border-neutral-800">
                  {radioGenres.map((genre) => {
                    const isSelected = selectedGenreIds.includes(genre.id);
                    return (
                      <button
                        type="button"
                        key={genre.id}
                        onClick={() => toggleGenreSelection(genre.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold text-left flex items-center justify-between border transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                        }`}
                      >
                        <span className="truncate">
                          {genre.icon} {genre.name.split('&')[0]}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddPlaylistModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-lg shadow-amber-500/20"
                >
                  Listeyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
