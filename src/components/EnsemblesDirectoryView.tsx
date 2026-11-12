import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Ensemble, EnsembleType } from '../types';
import {
  Search,
  Star,
  ShieldCheck,
  MapPin,
  Users,
  ChevronRight,
  Music2,
  Calendar,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const EnsemblesDirectoryView: React.FC = () => {
  const { ensembles, navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('Tümü');
  const [selectedCity, setSelectedCity] = useState<string>('Tümü');

  const ALL_TYPES = [
    'Tümü',
    'Trio',
    'Quartet',
    'Quintet',
    'Chamber Ensemble',
    'Orkestra',
  ];

  const ALL_CITIES = ['Tümü', 'İstanbul', 'Ankara', 'İzmir'];

  const filteredEnsembles = useMemo(() => {
    return ensembles.filter((e) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = e.name.toLowerCase().includes(q);
        const matchBio = e.bio.toLowerCase().includes(q);
        const matchMembers = e.members.some((m) =>
          m.name.toLowerCase().includes(q) || m.instrument.toLowerCase().includes(q)
        );
        if (!matchName && !matchBio && !matchMembers) return false;
      }

      if (selectedType !== 'Tümü' && e.ensembleType !== selectedType) {
        return false;
      }

      if (selectedCity !== 'Tümü' && e.city !== selectedCity) {
        return false;
      }

      return true;
    });
  }, [ensembles, searchQuery, selectedType, selectedCity]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('Tümü');
    setSelectedCity('Tümü');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Title & Filter Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
          <span>Kültür & Sanat Toplulukları</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="text-stone-600 font-normal">Kolektif İcra Grupları</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
          Ensemble ve Topluluklar Dizini
        </h1>
        <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
          Yaylı kuartetler, oda müziği trioları, brass quintetler ve senfonik kadrolar.
          Müzisyen dağılımlarını, repertuvarlarını ve konser sicillerini inceleyin.
        </p>

        {/* Filter Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Topluluk adı, üye müzisyen, yaylı trio, quartet ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 focus:bg-white transition-all"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full py-2.5 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-stone-900 cursor-pointer"
              >
                {ALL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t === 'Tümü' ? 'Tüm Topluluk Formatları' : t}
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

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>
              Toplam <strong className="text-stone-900">{filteredEnsembles.length}</strong> topluluk listeleniyor
            </span>
            {(searchQuery || selectedType !== 'Tümü' || selectedCity !== 'Tümü') && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] font-semibold text-stone-500 hover:text-stone-900 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Filtreleri Temizle</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Large Visual Ensembles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEnsembles.map((ensemble) => (
          <div
            key={ensemble.id}
            onClick={() => navigateTo('ensemble_profile', ensemble.id)}
            className="group bg-white rounded-3xl border border-stone-200/90 hover:border-stone-400 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Large Group Stage Photo Header */}
              <div className="relative aspect-16/9 w-full bg-stone-900 overflow-hidden">
                <img
                  src={ensemble.avatarUrl}
                  alt={ensemble.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                {/* Floating Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-1.5">
                    {ensemble.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Doğrulanmış Topluluk</span>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-900 bg-amber-400/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                      {ensemble.ensembleType}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-950 bg-emerald-300/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                    %{ensemble.cancellationRate} İptal
                  </span>
                </div>

                {/* Title Overlay on Bottom Left */}
                <div className="absolute bottom-3 inset-x-4 z-10 flex items-end justify-between">
                  <div>
                    <h3 className="font-extrabold text-xl text-white drop-shadow-md group-hover:text-amber-300 transition-colors">
                      {ensemble.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-300 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {ensemble.city}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        Kuruluş {ensemble.foundedYear}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        {ensemble.members.length} Müzisyen
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-sm">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{ensemble.ratingAvg.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Bio & Member Lineup */}
              <div className="p-5 space-y-3">
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                  {ensemble.bio}
                </p>

                {/* Structured Members Chips */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1.5">
                  <div className="text-[11px] font-bold text-stone-900 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-700" />
                    <span>Kadro ve Enstrüman Dağılımı:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ensemble.members.map((member) => (
                      <span
                        key={member.id}
                        className="inline-flex items-center gap-1 text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded-lg text-stone-800"
                      >
                        <span className="font-semibold">{member.name}</span>
                        <span className="text-stone-400">({member.instrument})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-stone-600">
                <span>
                  <strong className="text-stone-900">{ensemble.completedJobsCount}</strong> Konser
                </span>
                <span>·</span>
                <span>
                  <strong className="text-stone-900">{ensemble.ratingCount}</strong> Değerlendirme
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-stone-900 group-hover:translate-x-1 transition-transform">
                <span>Topluluğu ve Kadroyu İncele</span>
                <ChevronRight className="w-4 h-4 text-amber-600" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
