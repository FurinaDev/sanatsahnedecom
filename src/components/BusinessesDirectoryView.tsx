import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { useAdaptivePageSize } from '../hooks/useAdaptivePageSize';
import { ArtDiscipline, BusinessType } from '../types';
import { ART_DISCIPLINES, CITY_LIST } from '../utils/disciplineConfig';
import { ArchitecturalPageHeader } from './ui/ArchitecturalPageHeader';
import { CustomSelect } from './ui/CustomSelect';
import { PaginationBar } from './ui/PaginationBar';
import {
  Filter,
  ShieldCheck,
  MapPin,
  Star,
  ChevronRight,
  RotateCcw,
  LayoutGrid,
  List,
  X,
  Building2,
  Layers,
  Megaphone,
  ArrowRight,
} from 'lucide-react';

const VENUE_TYPES: (BusinessType | 'Tümü')[] = [
  'Tümü',
  'Otel ve Konaklama',
  'Kültür Merkezi',
  'Konser Salonu',
  'Sanat Galerisi & Müze',
  'Edebiyat & Sahne Evi',
  'Festival ve Fuar Organizatörü',
  'Organizasyon Şirketi',
  'Restoran ve Kafe',
];

const FACILITY_FILTERS = [
  'Tümü',
  'Akustik Piyano',
  'Konser Aydınlatma',
  'Müze Aydınlatma Sistemi',
  'Avlu Heykel Alanı',
  'Söyleşi Salonu',
];

type SortOption = 'rating_desc' | 'bookings_desc' | 'listings_desc';

export const BusinessesDirectoryView: React.FC = () => {
  const { businesses, listings, navigateTo } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<ArtDiscipline | 'Tümü'>('Tümü');
  const [selectedType, setSelectedType] = useState<string>('Tümü');
  const [selectedFacility, setSelectedFacility] = useState<string>('Tümü');
  const [selectedCity, setSelectedCity] = useState<string>('Tümü');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyWithActiveListings, setOnlyWithActiveListings] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('rating_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsTopRef = useRef<HTMLDivElement>(null);
  const pageSize = useAdaptivePageSize(viewMode);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDiscipline('Tümü');
    setSelectedType('Tümü');
    setSelectedFacility('Tümü');
    setSelectedCity('Tümü');
    setOnlyVerified(false);
    setOnlyWithActiveListings(false);
    setSortBy('rating_desc');
  };

  const filteredBusinesses = useMemo(() => {
    return businesses
      .filter((b) => {
        const bizDisciplines: ArtDiscipline[] =
          b.disciplines && b.disciplines.length > 0 ? b.disciplines : ['Müzik'];

        if (selectedDiscipline !== 'Tümü' && !bizDisciplines.includes(selectedDiscipline)) {
          return false;
        }

        if (selectedFacility !== 'Tümü') {
          const facs = b.facilities || [];
          const hasFac =
            facs.some((f) => f.toLowerCase().includes(selectedFacility.toLowerCase())) ||
            b.description.toLowerCase().includes(selectedFacility.toLowerCase());
          if (!hasFac) return false;
        }

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

        if (onlyVerified && !b.isVerified) {
          return false;
        }

        if (onlyWithActiveListings) {
          const activeCount = listings.filter(
            (l) => l.businessId === b.id && l.status === 'active'
          ).length;
          if (activeCount === 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'bookings_desc') return b.completedBookingsCount - a.completedBookingsCount;
        if (sortBy === 'listings_desc') {
          const countA = listings.filter((l) => l.businessId === a.id && l.status === 'active').length;
          const countB = listings.filter((l) => l.businessId === b.id && l.status === 'active').length;
          return countB - countA;
        }
        return b.ratingAvg - a.ratingAvg;
      });
  }, [
    businesses,
    listings,
    searchQuery,
    selectedDiscipline,
    selectedType,
    selectedFacility,
    selectedCity,
    onlyVerified,
    onlyWithActiveListings,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredBusinesses.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedBusinesses = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredBusinesses.slice(start, start + pageSize);
  }, [filteredBusinesses, safePage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedDiscipline,
    selectedType,
    selectedFacility,
    selectedCity,
    onlyVerified,
    onlyWithActiveListings,
    sortBy,
    viewMode,
  ]);

  const handlePageChange = (page: number) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(next);
    resultsTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (searchQuery.trim()) {
      chips.push({ key: 'q', label: `"${searchQuery.trim()}"`, clear: () => setSearchQuery('') });
    }
    if (selectedDiscipline !== 'Tümü') {
      chips.push({
        key: 'disc',
        label: selectedDiscipline,
        clear: () => setSelectedDiscipline('Tümü'),
      });
    }
    if (selectedType !== 'Tümü') {
      chips.push({ key: 'type', label: selectedType, clear: () => setSelectedType('Tümü') });
    }
    if (selectedFacility !== 'Tümü') {
      chips.push({ key: 'fac', label: selectedFacility, clear: () => setSelectedFacility('Tümü') });
    }
    if (selectedCity !== 'Tümü') {
      chips.push({ key: 'city', label: selectedCity, clear: () => setSelectedCity('Tümü') });
    }
    if (onlyVerified) {
      chips.push({ key: 'ver', label: 'Onaylı Mekân', clear: () => setOnlyVerified(false) });
    }
    if (onlyWithActiveListings) {
      chips.push({
        key: 'act',
        label: 'Açık İlanı Var',
        clear: () => setOnlyWithActiveListings(false),
      });
    }
    return chips;
  }, [
    searchQuery,
    selectedDiscipline,
    selectedType,
    selectedFacility,
    selectedCity,
    onlyVerified,
    onlyWithActiveListings,
  ]);

  const renderSidebarContent = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] dark:border-[#1e335a]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#16274e] dark:text-white">
          <Filter className="w-3.5 h-3.5 text-[#f25922]" />
          <span>Mekân &amp; Kurum Filtreleri</span>
        </div>
        {activeFilterChips.length > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-semibold text-[#64748b] hover:text-[#f25922] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Sıfırla</span>
          </button>
        )}
      </div>

      {/* Discipline Focus */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#0f172a] dark:text-slate-200 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#f25922]" />
          <span>Desteklenen Sanat Dalı</span>
        </label>
        <CustomSelect
          value={selectedDiscipline}
          onChange={(val) => setSelectedDiscipline(val as ArtDiscipline | 'Tümü')}
          options={ART_DISCIPLINES.map((d) => ({
            value: d,
            label: d === 'Tümü' ? 'Tüm Sanat Dalları' : d,
          }))}
          ariaLabel="Desteklenen Sanat Dalı"
        />
      </div>

      {/* Venue Type */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#0f172a] dark:text-slate-200 block">
          Mekân / Kurum Türü
        </label>
        <CustomSelect
          value={selectedType}
          onChange={setSelectedType}
          options={VENUE_TYPES.map((t) => ({
            value: t,
            label: t === 'Tümü' ? 'Tüm Mekân Türleri' : t,
          }))}
          ariaLabel="Mekân Türü"
        />
      </div>

      {/* Venue Technical Facilities */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#0f172a] dark:text-slate-200 block">
          Mekân Donanımı &amp; Olanaklar
        </label>
        <CustomSelect
          value={selectedFacility}
          onChange={setSelectedFacility}
          options={FACILITY_FILTERS.map((f) => ({
            value: f,
            label: f === 'Tümü' ? 'Tüm Teknik Donanımlar' : f,
          }))}
          ariaLabel="Mekân Donanımı"
        />
      </div>

      {/* City */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#0f172a] dark:text-slate-200 block">
          Şehir
        </label>
        <CustomSelect
          value={selectedCity}
          onChange={setSelectedCity}
          options={CITY_LIST.map((c) => ({
            value: c,
            label: c === 'Tümü' ? 'Tüm Şehirler' : c,
          }))}
          ariaLabel="Şehir"
        />
      </div>

      {/* Toggles */}
      <div className="space-y-2 pt-2 border-t border-[#e2e8f0] dark:border-[#1e335a]">
        <label
          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
            onlyVerified
              ? 'bg-emerald-50/70 dark:bg-emerald-500/10 border-emerald-500/40'
              : 'bg-[#f8fafc] dark:bg-[#0f1c38]/60 border-[#e2e8f0] dark:border-[#1e335a]'
          }`}
        >
          <input
            type="checkbox"
            checked={onlyVerified}
            onChange={(e) => setOnlyVerified(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-emerald-600 rounded cursor-pointer"
          />
          <div>
            <span className="text-xs font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Resmi Onaylı Mekânlar</span>
            </span>
            <span className="text-[11px] text-[#64748b] dark:text-slate-400 block mt-0.5">
              Vergi levhası ve yetki belgesi doğrulamalı
            </span>
          </div>
        </label>

        <label
          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
            onlyWithActiveListings
              ? 'bg-orange-50/70 dark:bg-[#f25922]/15 border-[#f25922]/40'
              : 'bg-[#f8fafc] dark:bg-[#0f1c38]/60 border-[#e2e8f0] dark:border-[#1e335a]'
          }`}
        >
          <input
            type="checkbox"
            checked={onlyWithActiveListings}
            onChange={(e) => setOnlyWithActiveListings(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#f25922] rounded cursor-pointer"
          />
          <div>
            <span className="text-xs font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5 text-[#f25922]" />
              <span>Şu An İlanı Açık Olanlar</span>
            </span>
            <span className="text-[11px] text-[#64748b] dark:text-slate-400 block mt-0.5">
              Aktif sanatçı çağrısı yayınlayan kurumlar
            </span>
          </div>
        </label>
      </div>
    </div>
  );

  return (
    <div className="text-left w-full">
      <ArchitecturalPageHeader
        eyebrow="Kültür & Sanat İşbirlikleri · Doğrulanmış Mekânlar & Kurumlar"
        title="İşletmeler & Kültür Mekânları"
        subtitle="Oteller, kültür vakıfları, konser salonları, sanat galerileri, müzeler ve edebiyat sahnelerinin onaylı kurum profillerini inceleyin."
        stats={[
          { label: 'Onaylı İşletme', value: `${businesses.length} Kurumsal Mekân` },
          { label: 'Açık Çağrı', value: `${listings.length} Aktif İlan`, accent: 'orange' },
        ]}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Mekân veya işletme adı, galeri, müze, kültür merkezi, otel ara..."
        searchButtonLabel="Mekân Ara"
        onOpenMobileFilter={() => setMobileFilterOpen(true)}
      />

      {/* Summary & Controls */}
      <div className="bg-white dark:bg-[#13213e] border-b border-[#e2e8f0] dark:border-[#1e335a] transition-colors">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#16274e]/8 dark:bg-white/10 text-[#16274e] dark:text-white text-xs font-bold tabular-nums">
              <span>{filteredBusinesses.length} Onaylı Mekân &amp; Kurum</span>
            </span>

            {activeFilterChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.clear}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-[#f25922]/15 text-[#d94b18] dark:text-[#ffb59e] border border-[#f25922]/30 text-xs font-semibold hover:bg-[#f25922] hover:text-white transition-colors cursor-pointer"
              >
                <span>{chip.label}</span>
                <X className="w-3 h-3" />
              </button>
            ))}

            {activeFilterChips.length > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-[#64748b] dark:text-slate-400 hover:text-[#f25922] underline underline-offset-2 ml-1 cursor-pointer"
              >
                Filtreleri Sıfırla
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <CustomSelect
              value={sortBy}
              onChange={(val) => setSortBy(val as SortOption)}
              variant="compact"
              className="w-48"
              options={[
                { value: 'rating_desc', label: 'En Yüksek Puan' },
                { value: 'bookings_desc', label: 'En Çok Organizasyon' },
                { value: 'listings_desc', label: 'Açık İlan Sayısı' },
              ]}
              ariaLabel="Sıralama"
            />

            <div className="inline-flex rounded-lg border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Izgara Görünümü"
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-[#13213e] text-[#f25922] shadow-xs'
                    : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="Liste Görünümü"
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-[#13213e] text-[#f25922] shadow-xs'
                    : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Architectural Grid Workspace */}
      <div className="architectural-grid bg-[#f8fafc] dark:bg-[#0c1527] min-h-[60vh] transition-colors">
        <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Sticky Sidebar */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0 bg-white dark:bg-[#13213e] rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] p-5 sticky top-24 shadow-xs">
            {renderSidebarContent()}
          </aside>

          {/* Right Workspace */}
          <div className="flex-1 min-w-0 w-full space-y-5">
            {/* Quick Venue Category Chips + Top Pagination */}
            <div ref={resultsTopRef} className="scroll-mt-24 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  'Tümü',
                  'Otel ve Konaklama',
                  'Kültür Merkezi',
                  'Konser Salonu',
                  'Sanat Galerisi & Müze',
                  'Edebiyat & Sahne Evi',
                ].map((type) => {
                  const active = selectedType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#f25922] text-white border-[#f25922] shadow-sm'
                          : 'bg-white dark:bg-[#13213e] text-[#475569] dark:text-slate-300 border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#f25922]/50 hover:text-[#f25922]'
                      }`}
                    >
                      {type === 'Tümü' ? 'Tüm Mekânlar' : type}
                    </button>
                  );
                })}
              </div>

              <PaginationBar
                position="top"
                currentPage={safePage}
                totalItems={filteredBusinesses.length}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                itemLabel="kurum"
              />
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-[#13213e] rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-[#f25922]/15 flex items-center justify-center mx-auto text-[#f25922]">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#0f172a] dark:text-white">
                  Seçilen kriterlere uygun mekân bulunamadı
                </h3>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#16274e] dark:bg-[#f25922] hover:opacity-90 rounded-xl transition-opacity cursor-pointer"
                >
                  Tüm İşletmeleri Göster
                </button>
              </div>
            ) : (
              <motion.div
                key={`businesses-page-${safePage}-${viewMode}`}
                initial={{ opacity: 0.78, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 480, damping: 34 }}
              >
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5">
                    {paginatedBusinesses.map((biz) => {
                      const activeListingCount = listings.filter(
                        (l) => l.businessId === biz.id && l.status === 'active'
                      ).length;
                      const bizDisciplines =
                        biz.disciplines && biz.disciplines.length > 0 ? biz.disciplines : ['Müzik'];

                      return (
                        <article
                          key={biz.id}
                          onClick={() => navigateTo('business_profile', biz.id)}
                          className="group bg-white dark:bg-[#13213e] rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#f25922]/60 shadow-xs hover:shadow-lg transition-transform transition-colors duration-200 hover:-translate-y-0.5 cursor-pointer overflow-hidden flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative h-28 w-full bg-[#12161b] overflow-hidden">
                              <img
                                src={biz.coverUrl || biz.logoUrl}
                                alt={biz.businessName}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/20 to-transparent" />

                              <div className="absolute top-2 inset-x-2 flex items-center justify-between gap-1 z-10">
                                {biz.isVerified ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#16274e]/95 text-emerald-300 text-[9px] font-bold">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>Onaylı</span>
                                  </span>
                                ) : (
                                  <span />
                                )}

                                <span className="px-2 py-0.5 rounded-md bg-[#f25922] text-white text-[9px] font-bold tabular-nums">
                                  {activeListingCount > 0 ? `${activeListingCount} Aktif İlan` : 'Mekân'}
                                </span>
                              </div>

                              <div className="absolute bottom-2 inset-x-2 z-10 flex items-center gap-2">
                                <img
                                  src={biz.logoUrl}
                                  alt={biz.businessName}
                                  className="w-7 h-7 rounded-lg object-cover border-2 border-white shadow-sm shrink-0 bg-white"
                                />
                                <span className="text-[10px] text-white font-semibold truncate flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#ffb59e] shrink-0" />
                                  <span className="truncate">
                                    {biz.city}, {biz.district}
                                  </span>
                                </span>
                              </div>
                            </div>

                            <div className="p-3.5 space-y-2">
                              <h3 className="font-bold text-[13px] text-[#0f172a] dark:text-white group-hover:text-[#f25922] transition-colors line-clamp-2 min-h-[2.25rem] leading-snug">
                                {biz.businessName}
                              </h3>
                              <div className="text-[11px] font-medium text-[#64748b] dark:text-slate-400 truncate">
                                {biz.businessType}
                              </div>
                              <div className="text-[11px] font-medium text-[#475569] dark:text-slate-300 truncate pt-0.5">
                                {bizDisciplines.slice(0, 2).join(' · ')}
                              </div>
                            </div>
                          </div>

                          <div className="px-3.5 py-2.5 bg-[#f8fafc] dark:bg-[#0f1c38]/80 border-t border-[#e2e8f0] dark:border-[#1e335a] flex items-center justify-between text-[11px] tabular-nums">
                            <span className="inline-flex items-center gap-1 font-bold text-[#0f172a] dark:text-white">
                              <Star className="w-3.5 h-3.5 text-[#f25922] fill-[#f25922]" />
                              <span>{biz.ratingAvg.toFixed(1)}</span>
                              <span className="text-[10px] font-normal text-[#64748b]">
                                ({biz.completedBookingsCount} iş)
                              </span>
                            </span>

                            <span className="inline-flex items-center gap-0.5 font-bold text-[#16274e] dark:text-[#ffb59e] group-hover:text-[#f25922]">
                              <span>Mekân</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {paginatedBusinesses.map((biz) => {
                      const activeListingCount = listings.filter(
                        (l) => l.businessId === biz.id && l.status === 'active'
                      ).length;

                      return (
                        <article
                          key={biz.id}
                          onClick={() => navigateTo('business_profile', biz.id)}
                          className="group bg-white dark:bg-[#13213e] p-5 rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#f25922]/60 shadow-xs hover:shadow-md transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-4 min-w-0">
                            <img
                              src={biz.logoUrl}
                              alt={biz.businessName}
                              className="w-14 h-14 rounded-xl object-cover border border-[#e2e8f0] dark:border-[#1e335a] shrink-0"
                            />
                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="font-bold text-base text-[#0f172a] dark:text-white group-hover:text-[#f25922] transition-colors">
                                  {biz.businessName}
                                </span>
                                {biz.isVerified && (
                                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                )}
                                <span className="px-2 py-0.5 rounded-md bg-orange-50 dark:bg-[#f25922]/15 text-[#f25922] text-[10px] font-bold">
                                  {biz.businessType}
                                </span>
                              </div>
                              <div className="text-xs text-[#475569] dark:text-slate-300">
                                {biz.city}, {biz.district} · {activeListingCount} Açık İlan
                              </div>
                              <p className="text-xs text-[#64748b] dark:text-slate-400 line-clamp-1">
                                {biz.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#e2e8f0] dark:border-[#1e335a]">
                            <div className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#0f172a] dark:text-white tabular-nums">
                              <Star className="w-4 h-4 text-[#f25922] fill-[#f25922]" />
                              <span>{biz.ratingAvg.toFixed(2)}</span>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#16274e] dark:text-[#ffb59e] group-hover:text-[#f25922]">
                              <span>Mekân Sayfası</span>
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            <PaginationBar
              position="bottom"
              currentPage={safePage}
              totalItems={filteredBusinesses.length}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              itemLabel="kurum"
            />

            <div className="rounded-2xl bg-gradient-to-r from-[#16274e] to-[#203666] border border-[#1e335a] p-6 sm:p-7 text-white flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Mekânınız veya Kültür Kurumunuz İçin Sanatçı Çağrısı Başlatın
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  Oteller, sanat galerileri, kültür vakıfları ve belediyeler için tek tıkla sabit bütçeli sahne ve sergi ilanı yayınlayın.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('business_dashboard')}
                className="px-5 py-2.5 rounded-xl bg-[#f25922] hover:bg-[#d94b18] text-white text-xs font-bold shadow-md inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer transition-colors"
              >
                <span>İşletme Paneli</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 z-50 bg-slate-950/65 flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xs bg-white dark:bg-[#13213e] h-full p-5 overflow-y-auto flex flex-col justify-between gap-6"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e2e8f0] dark:border-[#1e335a]">
                  <span className="font-bold text-sm text-[#0f172a] dark:text-white">Mekân Filtreleri</span>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    aria-label="Kapat"
                    className="p-2 text-[#64748b] dark:text-slate-300 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {renderSidebarContent()}
              </div>
              <div className="pt-4 border-t border-[#e2e8f0] dark:border-[#1e335a] flex gap-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-1/2 min-h-[44px] py-2.5 text-xs font-semibold text-[#0f172a] dark:text-white bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] rounded-xl cursor-pointer"
                >
                  Sıfırla
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-1/2 min-h-[44px] py-2.5 text-xs font-bold text-white bg-[#f25922] rounded-xl cursor-pointer"
                >
                  Uygula ({filteredBusinesses.length})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
