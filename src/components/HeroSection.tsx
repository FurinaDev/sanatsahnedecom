import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Music, Building2, Search, ArrowRight, Star } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { navigateTo, switchRole, setFilters, listings, artists, events } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setFilters((prev) => ({ ...prev, searchQuery: searchTerm }));
    }
    navigateTo('listings');
  };

  const quickPills = [
    { label: 'Yaylı Trio', genre: 'Oda Müziği' },
    { label: 'Piyano Resitali', genre: 'Klasik Müzik' },
    { label: 'Akustik Caz', genre: 'Caz Müzik' },
    { label: 'Nefesli Topluluğu', genre: 'Klasik Müzik' },
  ];

  return (
    <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 text-stone-900 shadow-xs">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        {/* Crisp Headline */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 leading-tight">
          Sanatçı, Topluluk ve Mekân Buluşması
        </h1>

        {/* Short Subtitle */}
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-lg mx-auto">
          Mekânlar ve etkinlikler için canlı müzik ilanları; sanatçılar için şeffaf hakediş ve güvenli organizasyon.
        </p>

        {/* Search Bar - Button says strictly "Ara" */}
        <div className="pt-1 max-w-lg mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Enstrüman, tür veya topluluk ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 focus:bg-white text-stone-900 placeholder-stone-400 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-stone-900 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1 px-4 py-1.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
            >
              Ara
            </button>
          </form>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-[11px] text-stone-500">
            <span className="font-medium text-stone-400">Hızlı Arama:</span>
            {quickPills.map((pill) => (
              <button
                key={pill.label}
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, searchQuery: pill.label }));
                  navigateTo('listings');
                }}
                className="px-2.5 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors font-medium"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            onClick={() => {
              switchRole('business_owner');
              navigateTo('business_dashboard');
            }}
            className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hizmet Arıyorum</span>
            <span className="text-[11px] text-stone-300 font-normal">(Mekânlar)</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>

          <button
            onClick={() => {
              switchRole('artist');
              navigateTo('listings');
            }}
            className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors border border-stone-200 flex items-center justify-center gap-1.5"
          >
            <Music className="w-3.5 h-3.5 text-stone-700" />
            <span>Hizmet Veriyorum</span>
            <span className="text-[11px] text-stone-500 font-normal">(Sanatçılar)</span>
          </button>
        </div>

        {/* Compact Metrics Row */}
        <div className="pt-4 mt-2 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
            <div className="text-[10px] text-stone-500 font-medium">Aktif İlan</div>
            <div className="text-base font-bold text-stone-900">{listings.length} Açık Çağrı</div>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
            <div className="text-[10px] text-stone-500 font-medium">Kayıtlı Sanatçı</div>
            <div className="text-base font-bold text-stone-900">{artists.length}+ İcracı</div>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
            <div className="text-[10px] text-stone-500 font-medium">Yaklaşan Etkinlik</div>
            <div className="text-base font-bold text-stone-900">{events.length} Konser</div>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
            <div className="text-[10px] text-stone-500 font-medium">Memnuniyet</div>
            <div className="text-base font-bold text-stone-900 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>4.95</span>
              <span className="text-[10px] text-stone-400 font-normal">/ 5.0</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
