import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BusinessProfile } from '../types';
import {
  Search,
  Building2,
  ShieldCheck,
  MapPin,
  Star,
  ChevronRight,
  Calendar,
  Sparkles,
  Music,
  RotateCcw,
} from 'lucide-react';

export const BusinessesDirectoryView: React.FC = () => {
  const { businesses, listings, navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('Tümü');
  const [selectedCity, setSelectedCity] = useState<string>('Tümü');

  const ALL_TYPES = [
    'Tümü',
    'Otel ve Konaklama',
    'Kültür & Sanat Merkezi',
    'Festival ve Organizasyon',
    'Caz Kulübü & Sahne',
  ];

  const ALL_CITIES = ['Tümü', 'İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa'];

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = b.businessName.toLowerCase().includes(q);
        const matchType = b.businessType.toLowerCase().includes(q);
        const matchCity = b.city.toLowerCase().includes(q);
        const matchDesc = b.description.toLowerCase().includes(q);
        if (!matchName && !matchType && !matchCity && !matchDesc) return false;
      }

      if (selectedType !== 'Tümü' && b.businessType !== selectedType) {
        return false;
      }

      if (selectedCity !== 'Tümü' && b.city !== selectedCity) {
        return false;
      }

      return true;
    });
  }, [businesses, searchQuery, selectedType, selectedCity]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('Tümü');
    setSelectedCity('Tümü');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
          <span>Kültür & Sanat İşbirlikleri</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="text-stone-600 font-normal">Doğrulanmış Mekânlar ve Kurumlar</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
          İşletmeler ve Etkinlik Mekânları
        </h1>
        <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
          Konser salonları, 5 yıldızlı oteller, caz kulüpleri ve festival sahneleri.
          Mekânların teknik akustik donanımını, açık çağrılarını ve güvenilirlik puanlarını inceleyin.
        </p>

        {/* Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Mekân veya işletme adı, otel, konser salonu ara..."
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
                    {t === 'Tümü' ? 'Tüm Mekân Türleri' : t}
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
              Toplam <strong className="text-stone-900">{filteredBusinesses.length}</strong> işletme listeleniyor
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

      {/* Large Visual Businesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map((biz) => {
          const activeListingCount = listings.filter(
            (l) => l.businessId === biz.id && l.status === 'active'
          ).length;

          return (
            <div
              key={biz.id}
              onClick={() => navigateTo('business_profile', biz.id)}
              className="group bg-white rounded-3xl border border-stone-200/90 hover:border-stone-400 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Large Venue Photography */}
                <div className="relative aspect-16/10 w-full bg-stone-900 overflow-hidden">
                  <img
                    src={biz.coverUrl || biz.logoUrl}
                    alt={biz.businessName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                    <div className="flex items-center gap-1.5">
                      {biz.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Doğrulanmış İşletme</span>
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-950 bg-amber-400/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                      {activeListingCount > 0 ? `${activeListingCount} Aktif İlan` : 'Etkinlik Mekânı'}
                    </span>
                  </div>

                  {/* Logo overlay on bottom left */}
                  <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white shrink-0">
                      <img
                        src={biz.logoUrl}
                        alt={biz.businessName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                        {biz.businessType}
                      </div>
                      <div className="text-white text-xs font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-300" />
                        <span>{biz.city}, {biz.district}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-3">
                  <h3 className="font-extrabold text-lg text-stone-900 group-hover:text-amber-800 transition-colors">
                    {biz.businessName}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {biz.description}
                  </p>

                  {/* Technical Amenities Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200/60">
                      Steinway Kuyruklu Piyano
                    </span>
                    <span className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200/60">
                      Akustik Sahne
                    </span>
                    <span className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200/60">
                      Sanatçı Kulisi
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-stone-700 font-semibold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>4.95 Memnuniyet</span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-stone-900 group-hover:translate-x-1 transition-transform">
                  <span>Mekânı ve İlanları Gör</span>
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
