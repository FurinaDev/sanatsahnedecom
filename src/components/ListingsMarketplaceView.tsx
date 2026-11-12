import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, MusicGenre, EnsembleType, Instrument, BusinessType } from '../types';
import { formatCurrencyTRY } from '../utils/businessLogic';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  ArrowUpDown,
  RotateCcw,
  Users,
  CheckCircle2,
  ChevronRight,
  Music,
  SlidersHorizontal,
  X,
} from 'lucide-react';

const GENRE_OPTIONS: (MusicGenre | 'Tümü')[] = [
  'Tümü',
  'Klasik Müzik',
  'Caz Müzik',
  'Oda Müziği',
  'Pop',
  'Rock',
  'Türk Sanat Müziği',
  'Türk Halk Müziği',
];

const ENSEMBLE_OPTIONS: (EnsembleType | 'Tümü')[] = [
  'Tümü',
  'Solo',
  'Duo',
  'Trio',
  'Quartet',
  'Quintet',
  'Chamber Ensemble',
  'Orkestra',
  'Koro',
];

const INSTRUMENT_OPTIONS: (Instrument | 'Tümü')[] = [
  'Tümü',
  'Piyano',
  'Keman',
  'Viyolonsel (Çello)',
  'Viyola',
  'Kontrbas',
  'Klarnet',
  'Flüt',
  'Trompet',
  'Trombon',
  'Saksafon',
  'Akustik Gitar',
  'Davul',
  'Vokal',
];

const BUSINESS_TYPE_OPTIONS: (BusinessType | 'Tümü')[] = [
  'Tümü',
  'Otel ve Konaklama',
  'Kültür Merkezi',
  'Festival ve Fuar Organizatörü',
  'Organizasyon Şirketi',
  'Restoran ve Kafe',
  'Belediye ve Kamu Kurumu',
  'Konser Salonu',
];

interface Props {
  onSelectListing: (listing: Listing) => void;
}

export const ListingsMarketplaceView: React.FC<Props> = ({ onSelectListing }) => {
  const { listings, filters, setFilters, resetFilters, navigateTo } = useApp();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter & Sort Logic
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Search term
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchBiz = item.businessName.toLowerCase().includes(query);
        const matchCity = item.city.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchBiz && !matchCity) return false;
      }

      // Genre
      if (filters.genre !== 'Tümü' && !item.genres.includes(filters.genre)) {
        return false;
      }

      // Ensemble Type
      if (filters.ensembleType !== 'Tümü' && item.targetEnsembleType !== filters.ensembleType) {
        return false;
      }

      // Instrument
      if (filters.instrument !== 'Tümü' && !item.requiredInstruments.includes(filters.instrument)) {
        return false;
      }

      // Business Type
      if (filters.businessType !== 'Tümü' && item.businessType !== filters.businessType) {
        return false;
      }

      // City
      if (filters.city !== 'Tümü' && item.city !== filters.city) {
        return false;
      }

      // Budget Range
      if (item.budgetAmount < filters.minBudget || item.budgetAmount > filters.maxBudget) {
        return false;
      }

      // Verified Employer
      if (filters.onlyVerified && !item.businessVerified) {
        return false;
      }

      // Urgent Replacement Only
      if (filters.onlyUrgent && !item.isReplacement) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'budget_desc') return b.budgetAmount - a.budgetAmount;
      if (filters.sortBy === 'budget_asc') return a.budgetAmount - b.budgetAmount;
      if (filters.sortBy === 'date_asc') return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [listings, filters]);

  return (
    <div className="space-y-6 text-left">
      {/* Page Title & Search Bar Ribbon */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold tracking-wider uppercase text-amber-700">
              Kültür & Sanat Pazaryeri
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#191919] mt-1">
              Aktif Etkinlik İlanları
            </h1>
            <p className="text-sm text-[#5e5e5e] mt-1">
              Sabit bütçeli, sözleşmeli ve korumalı ödeme güvenceli doğrulanmış etkinlikler.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-800 bg-white border border-stone-200 rounded-lg shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-stone-600" />
              <span>Filtreler</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-3 py-1.5 shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className="text-xs font-medium text-stone-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="newest">En Yeni İlanlar</option>
                <option value="budget_desc">Bütçe: Yüksekten Düşüğe</option>
                <option value="budget_asc">Bütçe: Düşükten Yükseğe</option>
                <option value="date_asc">Etkinlik Tarihi Yaklaşanlar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="İlan başlığı, otel, orkestra, keman, caz, şehir ara..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all shadow-2xs"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
            >
              Temizle
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Filter Column (Desktop) + Right Listings List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Filter Panel (Desktop) */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-6 bg-white p-5 rounded-xl border border-stone-200/90 shadow-sm sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900">
              <Filter className="w-3.5 h-3.5 text-amber-700" />
              <span>Gelişmiş Filtreler</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 transition-colors font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Sıfırla</span>
            </button>
          </div>

          {/* Quick Toggle: Acil İkame İlanları */}
          <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onlyUrgent}
                onChange={(e) => setFilters((prev) => ({ ...prev, onlyUrgent: e.target.checked }))}
                className="w-4 h-4 text-amber-800 rounded border-stone-300 focus:ring-amber-800"
              />
              <div className="text-left">
                <span className="text-xs font-semibold text-amber-950 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />
                  Acil İkame İlanları
                </span>
                <span className="text-[11px] text-amber-800/80 block mt-0.5">
                  Son dakika iptali yerine aranan sanatçılar
                </span>
              </div>
            </label>
          </div>

          {/* Music Genre Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-900 block">Müzik Türü</label>
            <select
              value={filters.genre}
              onChange={(e) => setFilters((prev) => ({ ...prev, genre: e.target.value as any }))}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-none focus:border-amber-800"
            >
              {GENRE_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Ensemble Format */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-900 block">Topluluk Formatı (Ensemble)</label>
            <select
              value={filters.ensembleType}
              onChange={(e) => setFilters((prev) => ({ ...prev, ensembleType: e.target.value as any }))}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-none focus:border-amber-800"
            >
              {ENSEMBLE_OPTIONS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          {/* Instrument */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-900 block">Enstrüman</label>
            <select
              value={filters.instrument}
              onChange={(e) => setFilters((prev) => ({ ...prev, instrument: e.target.value as any }))}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-none focus:border-amber-800"
            >
              {INSTRUMENT_OPTIONS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          {/* Business Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-900 block">İşletme / Kurum Türü</label>
            <select
              value={filters.businessType}
              onChange={(e) => setFilters((prev) => ({ ...prev, businessType: e.target.value as any }))}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-none focus:border-amber-800"
            >
              {BUSINESS_TYPE_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Range */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-900">Maksimum Bütçe</span>
              <span className="font-bold text-amber-900 tabular-nums">
                {formatCurrencyTRY(filters.maxBudget)}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="5000"
              value={filters.maxBudget}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxBudget: Number(e.target.value) }))}
              className="w-full accent-amber-800 cursor-pointer"
            />
          </div>

          {/* Only Verified Employers Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onlyVerified}
                onChange={(e) => setFilters((prev) => ({ ...prev, onlyVerified: e.target.checked }))}
                className="w-4 h-4 text-amber-800 rounded border-stone-300 focus:ring-amber-800"
              />
              <span className="text-xs text-stone-700">Yalnızca Doğrulanmış İşletmeler</span>
            </label>
          </div>
        </div>

        {/* Right Listings List */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 pb-2">
            <div>
              Toplam <span className="font-semibold text-stone-800">{filteredListings.length}</span> ilan bulundu
            </div>
            {(filters.genre !== 'Tümü' || filters.ensembleType !== 'Tümü' || filters.onlyUrgent) && (
              <button onClick={resetFilters} className="text-amber-800 hover:underline">
                Filtreleri Temizle
              </button>
            )}
          </div>

          {filteredListings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-stone-800">Seçilen kriterlere uygun ilan bulunamadı</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Filtreleri sıfırlayarak veya bütçe aralığını genişleterek diğer sahne ve etkinlik fırsatlarını inceleyebilirsiniz.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Tüm İlanları Göster
              </button>
            </div>
          ) : (
            filteredListings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => onSelectListing(listing)}
                className="group p-5 bg-white rounded-2xl border border-stone-200/90 hover:border-stone-400 hover:shadow-md transition-all cursor-pointer text-left relative overflow-hidden"
              >
                {/* Urgent Replacement Banner */}
                {listing.isReplacement && (
                  <div className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg flex items-center gap-1 shadow-sm">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Acil İkame İlanı</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Employer Logo & Details */}
                  <div className="flex items-start gap-4">
                    <img
                      src={listing.businessLogo}
                      alt={listing.businessName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                    />

                    <div className="space-y-1.5">
                      {/* Employer & Category (Unboxed metadata) */}
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="font-semibold text-stone-800 hover:text-amber-800 transition-colors">
                          {listing.businessName}
                        </span>
                        {listing.businessVerified && (
                          <span title="Doğrulanmış İşletme">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          </span>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>{listing.businessType}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {listing.city}, {listing.district}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                        {listing.title}
                      </h3>

                      {/* Brief requirements & format */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600">
                        <span className="font-semibold text-stone-800">
                          {listing.targetEnsembleType} ({listing.performerCount} Kişi)
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{listing.genres.join(', ')}</span>
                        <span aria-hidden="true">·</span>
                        <span>{listing.requiredInstruments.join(' + ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fixed Budget & Key Meta Strip */}
                  <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-1">
                    <div className="text-[11px] text-stone-400 uppercase tracking-wider font-medium">
                      Sabit Sanatçı Hakedişi
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">
                      {formatCurrencyTRY(listing.budgetAmount)}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium">
                      Net Tutar (Komisyonsuz)
                    </div>
                  </div>
                </div>

                {/* Card Bottom Operational Ribbon */}
                <div className="mt-4 pt-3.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1.5 text-stone-700 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      {listing.eventDate} ({listing.startTime} - {listing.endTime})
                    </span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {listing.durationMins} dk Performans
                    </span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="text-stone-500">
                      Son Başvuru: <strong className="text-stone-700 font-semibold">{listing.applicationDeadline}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-bold text-stone-900 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all">
                    <span>İlan Detayı & Başvur</span>
                    <ChevronRight className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <span className="font-bold text-stone-900">Filtreler</span>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            {/* Mobile filters inside drawer */}
            <div className="space-y-4 text-left">
              <div>
                <label className="text-xs font-semibold text-stone-900 block mb-1">Müzik Türü</label>
                <select
                  value={filters.genre}
                  onChange={(e) => setFilters((prev) => ({ ...prev, genre: e.target.value as any }))}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2"
                >
                  {GENRE_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-900 block mb-1">Topluluk Formatı</label>
                <select
                  value={filters.ensembleType}
                  onChange={(e) => setFilters((prev) => ({ ...prev, ensembleType: e.target.value as any }))}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2"
                >
                  {ENSEMBLE_OPTIONS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-900 block mb-1">Enstrüman</label>
                <select
                  value={filters.instrument}
                  onChange={(e) => setFilters((prev) => ({ ...prev, instrument: e.target.value as any }))}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2"
                >
                  {INSTRUMENT_OPTIONS.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={filters.onlyUrgent}
                    onChange={(e) => setFilters((prev) => ({ ...prev, onlyUrgent: e.target.checked }))}
                    className="w-4 h-4 text-amber-800 rounded"
                  />
                  <span className="text-xs font-semibold text-amber-900">Acil İkame İlanları</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex gap-2">
              <button
                onClick={resetFilters}
                className="w-1/2 py-2 text-xs font-medium text-stone-700 bg-stone-100 rounded-lg"
              >
                Sıfırla
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg"
              >
                Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
