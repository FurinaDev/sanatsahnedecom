import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { IndividualProfile, Instrument, MusicGenre } from '../types';
import {
  Search,
  Star,
  ShieldCheck,
  MapPin,
  Music2,
  GraduationCap,
  ChevronRight,
  Filter,
  Play,
  Pause,
  Sparkles,
  Volume2,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

export const ArtistsDirectoryView: React.FC = () => {
  const { artists, navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState<string>('Tümü');
  const [selectedCity, setSelectedCity] = useState<string>('Tümü');
  const [selectedGenre, setSelectedGenre] = useState<string>('Tümü');
  const [onlyRecommended, setOnlyRecommended] = useState<boolean>(false);
  const [onlyZeroCancellation, setOnlyZeroCancellation] = useState<boolean>(false);
  const [playingArtistId, setPlayingArtistId] = useState<string | null>(null);

  const ALL_INSTRUMENTS = [
    'Tümü',
    'Piyano',
    'Keman',
    'Viyola',
    'Viyolonsel (Çello)',
    'Kontrbas',
    'Flüt',
    'Klarnet',
    'Saksafon',
    'Akustik Gitar',
    'Klasik Gitar',
    'Bas Gitar',
    'Davul',
    'Vokal',
  ];

  const ALL_GENRES = [
    'Tümü',
    'Klasik Müzik',
    'Caz Müzik',
    'Oda Müziği',
    'Pop',
    'Rock',
    'Türk Sanat Müziği',
    'Dünya Müziği',
  ];

  const ALL_CITIES = ['Tümü', 'İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Eskişehir'];

  const filteredArtists = useMemo(() => {
    return artists.filter((a) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = a.fullName.toLowerCase().includes(q);
        const matchTitle = a.title.toLowerCase().includes(q);
        const matchInst = a.primaryInstrument.toLowerCase().includes(q);
        const matchBio = a.bioShort.toLowerCase().includes(q);
        if (!matchName && !matchTitle && !matchInst && !matchBio) return false;
      }

      if (
        selectedInstrument !== 'Tümü' &&
        a.primaryInstrument !== selectedInstrument &&
        !a.instruments.includes(selectedInstrument as any)
      ) {
        return false;
      }

      if (selectedCity !== 'Tümü' && a.city !== selectedCity) {
        return false;
      }

      if (selectedGenre !== 'Tümü' && !a.genres.includes(selectedGenre as any)) {
        return false;
      }

      if (onlyRecommended && !a.isRecommended && a.ratingAvg < 4.9) {
        return false;
      }

      if (onlyZeroCancellation && a.cancellationRate > 0) {
        return false;
      }

      return true;
    });
  }, [
    artists,
    searchQuery,
    selectedInstrument,
    selectedCity,
    selectedGenre,
    onlyRecommended,
    onlyZeroCancellation,
  ]);

  const toggleAudio = (e: React.MouseEvent, artistId: string) => {
    e.stopPropagation();
    setPlayingArtistId((prev) => (prev === artistId ? null : artistId));
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedInstrument('Tümü');
    setSelectedCity('Tümü');
    setSelectedGenre('Tümü');
    setOnlyRecommended(false);
    setOnlyZeroCancellation(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Title & Context Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
          <span>Kültür & Sanat Kataloğu</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="text-stone-600 font-normal">Doğrulanmış Bireysel İcracılar</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
          Sanatçılar Dizini
        </h1>
        <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
          Konservatuvar mezunları, oda müziği icracıları ve solo virtüözleri keşfedin. Büyük görsel
          kartlar, örnek ses kayıtları, doğrulanmış mezuniyetler ve şeffaf %0 iptal sicillerini
          inceleyin.
        </p>

        {/* Search & Main Filter Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Sanatçı adı, piyano, keman, klasik, caz ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 focus:bg-white transition-all"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedInstrument}
                onChange={(e) => setSelectedInstrument(e.target.value)}
                className="w-full py-2.5 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-stone-900 cursor-pointer"
              >
                {ALL_INSTRUMENTS.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst === 'Tümü' ? 'Tüm Enstrümanlar' : inst}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full py-2.5 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-stone-900 cursor-pointer"
              >
                {ALL_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'Tümü' ? 'Tüm Şehirler' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Secondary Filter Toggles and Genre Chips */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setOnlyRecommended(!onlyRecommended)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  onlyRecommended
                    ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tavsiye Edilenler</span>
              </button>

              <button
                onClick={() => setOnlyZeroCancellation(!onlyZeroCancellation)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  onlyZeroCancellation
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>%0 İptal Sicili</span>
              </button>

              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="py-1.5 px-3 text-xs bg-white border border-stone-200 rounded-xl text-stone-700 cursor-pointer"
              >
                {ALL_GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g === 'Tümü' ? 'Tüm Müzik Türleri' : g}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">
                Toplam <strong className="text-stone-900">{filteredArtists.length}</strong> sanatçı listeleniyor
              </span>
              {(searchQuery ||
                selectedInstrument !== 'Tümü' ||
                selectedCity !== 'Tümü' ||
                selectedGenre !== 'Tümü' ||
                onlyRecommended ||
                onlyZeroCancellation) && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-[11px] font-semibold text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Sıfırla</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Large Visual Artist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.map((artist) => {
          const isPlaying = playingArtistId === artist.id;

          return (
            <div
              key={artist.id}
              onClick={() => navigateTo('artist_profile', artist.id)}
              className="group bg-white rounded-3xl border border-stone-200/90 hover:border-stone-400 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Large Visual Photography Header */}
                <div className="relative aspect-4/3 w-full bg-stone-900 overflow-hidden">
                  <img
                    src={artist.coverUrl || artist.avatarUrl}
                    alt={artist.fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                  {/* Badges on Top */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {artist.isRecommended && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-900 bg-amber-400/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                          <Sparkles className="w-3 h-3 text-stone-950" />
                          <span>Tavsiye Edilen</span>
                        </span>
                      )}
                      {artist.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-stone-900/80 backdrop-blur-md px-2 py-1 rounded-full shadow-sm">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Doğrulanmış</span>
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-950 bg-emerald-300/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                      %{artist.cancellationRate} İptal
                    </span>
                  </div>

                  {/* Audio Preview Snippet Player on Image Bottom */}
                  <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between">
                    <button
                      onClick={(e) => toggleAudio(e, artist.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-md ${
                        isPlaying
                          ? 'bg-amber-400 text-stone-950 scale-102'
                          : 'bg-white/90 hover:bg-white text-stone-900'
                      }`}
                      title="Örnek Kayıt Dinle"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Çalıyor (Resital)</span>
                          <span className="flex items-center gap-0.5 ml-1">
                            <span className="w-1 h-3 bg-stone-950 rounded-full animate-bounce" />
                            <span className="w-1 h-4 bg-stone-950 rounded-full animate-bounce delay-75" />
                            <span className="w-1 h-2 bg-stone-950 rounded-full animate-bounce delay-150" />
                          </span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Örnek Dinle</span>
                          <Volume2 className="w-3.5 h-3.5 text-stone-500" />
                        </>
                      )}
                    </button>

                    <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white shrink-0">
                      <img
                        src={artist.avatarUrl}
                        alt={artist.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Card Body Info */}
                <div className="p-5 space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-lg text-stone-900 group-hover:text-amber-800 transition-colors">
                        {artist.fullName}
                      </h3>
                      <div className="flex items-center gap-1 font-bold text-stone-900 text-sm">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>{artist.ratingAvg.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-amber-700 mt-0.5">
                      {artist.title}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{artist.city}, {artist.district}</span>
                      <span>·</span>
                      <span>{artist.experienceYears} Yıllık Deneyim</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {artist.bioShort}
                  </p>

                  {/* Instrument & Genre Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-bold bg-stone-900 text-white px-2 py-0.5 rounded-md">
                      {artist.primaryInstrument}
                    </span>
                    {artist.genres.slice(0, 2).map((g) => (
                      <span
                        key={g}
                        className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200/60"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Scoreboard & Link */}
              <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-stone-600">
                  <span>
                    <strong className="text-stone-900">{artist.completedJobsCount}</strong> Konser
                  </span>
                  <span>·</span>
                  <span>
                    <strong className="text-stone-900">{artist.ratingCount}</strong> Yorum
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-stone-900 group-hover:translate-x-1 transition-transform">
                  <span>Profili İncele</span>
                  <ChevronRight className="w-4 h-4 text-amber-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
