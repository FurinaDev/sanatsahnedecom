import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { useAdaptivePageSize } from '../hooks/useAdaptivePageSize';
import { ArtDiscipline, BusinessType, Listing } from '../types';
import { formatCurrencyTRY } from '../utils/businessLogic';
import {
  ART_DISCIPLINES,
  DISCIPLINE_SPECIALTIES,
  MUSIC_GENRES,
  MUSIC_INSTRUMENTS,
  LISTING_ENSEMBLES,
  CITY_LIST,
  resolveDiscipline,
} from '../utils/disciplineConfig';
import { ArchitecturalPageHeader } from './ui/ArchitecturalPageHeader';
import { CustomSelect } from './ui/CustomSelect';
import { PaginationBar } from './ui/PaginationBar';
import {
  Filter,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  Music,
  X,
  Bookmark,
  LayoutGrid,
  List,
  Building2,
  Users,
  ArrowRight,
  Search,
  Layers,
} from 'lucide-react';

const BUSINESS_TYPE_OPTIONS: (BusinessType | 'Tümü')[] = [
  'Tümü',
  'Otel ve Konaklama',
  'Kültür Merkezi',
  'Konser Salonu',
  'Sanat Galerisi & Müze',
  'Edebiyat & Sahne Evi',
  'Festival ve Fuar Organizatörü',
  'Organizasyon Şirketi',
  'Restoran ve Kafe',
  'Belediye ve Kamu Kurumu',
];

interface Props {
  onSelectListing: (listing: Listing) => void;
}

export const ListingsMarketplaceView: React.FC<Props> = ({ onSelectListing }) => {
  const { listings, filters, setFilters, resetFilters, navigateTo } = useApp();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsTopRef = useRef<HTMLDivElement>(null);
  const pageSize = useAdaptivePageSize(viewMode);

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDisciplineChange = (newDiscipline: ArtDiscipline | 'Tümü') => {
    setFilters((p) => ({
      ...p,
      discipline: newDiscipline,
      specialty: 'Tümü',
      genre: newDiscipline === 'Müzik' ? p.genre : 'Tümü',
      instrument: newDiscipline === 'Müzik' ? p.instrument : 'Tümü',
    }));
  };

  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        const itemDiscipline = resolveDiscipline(item.discipline);

        if (filters.discipline !== 'Tümü' && itemDiscipline !== filters.discipline) {
          return false;
        }

        if (
          filters.discipline !== 'Tümü' &&
          filters.discipline !== 'Müzik' &&
          filters.specialty !== 'Tümü'
        ) {
          const tags = item.specialtyTags || [];
          const textMatch =
            tags.includes(filters.specialty) ||
            item.eventType.toLowerCase().includes(filters.specialty.toLowerCase()) ||
            item.description.toLowerCase().includes(filters.specialty.toLowerCase());
          if (!textMatch) return false;
        }

        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchDesc = item.description.toLowerCase().includes(query);
          const matchBiz = item.businessName.toLowerCase().includes(query);
          const matchCity = item.city.toLowerCase().includes(query);
          const matchDisc = itemDiscipline.toLowerCase().includes(query);
          const matchTags = (item.specialtyTags || []).some((t) => t.toLowerCase().includes(query));
          const matchGenre = item.genres.some((g) => g.toLowerCase().includes(query));
          const matchInst = item.requiredInstruments.some((i) => i.toLowerCase().includes(query));
          if (
            !matchTitle &&
            !matchDesc &&
            !matchBiz &&
            !matchCity &&
            !matchDisc &&
            !matchTags &&
            !matchGenre &&
            !matchInst
          ) {
            return false;
          }
        }

        if (filters.genre !== 'Tümü' && !item.genres.includes(filters.genre)) {
          return false;
        }

        if (filters.ensembleType !== 'Tümü' && item.targetEnsembleType !== filters.ensembleType) {
          return false;
        }

        if (filters.instrument !== 'Tümü' && !item.requiredInstruments.includes(filters.instrument)) {
          return false;
        }

        if (filters.businessType !== 'Tümü' && item.businessType !== filters.businessType) {
          return false;
        }

        if (filters.city !== 'Tümü' && item.city !== filters.city) {
          return false;
        }

        if (item.budgetAmount < filters.minBudget || item.budgetAmount > filters.maxBudget) {
          return false;
        }

        if (filters.onlyVerified && !item.businessVerified) {
          return false;
        }

        if (filters.onlyUrgent && !item.isReplacement) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'budget_desc') return b.budgetAmount - a.budgetAmount;
        if (filters.sortBy === 'budget_asc') return a.budgetAmount - b.budgetAmount;
        if (filters.sortBy === 'date_asc')
          return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [listings, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedListings = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredListings.slice(start, start + pageSize);
  }, [filteredListings, safePage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.discipline,
    filters.specialty,
    filters.searchQuery,
    filters.genre,
    filters.ensembleType,
    filters.instrument,
    filters.businessType,
    filters.city,
    filters.minBudget,
    filters.maxBudget,
    filters.onlyVerified,
    filters.onlyUrgent,
    filters.sortBy,
    viewMode,
  ]);

  const handlePageChange = (page: number) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(next);
    resultsTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (filters.searchQuery.trim()) {
      chips.push({
        key: 'q',
        label: `"${filters.searchQuery.trim()}"`,
        clear: () => setFilters((p) => ({ ...p, searchQuery: '' })),
      });
    }
    if (filters.discipline !== 'Tümü') {
      chips.push({
        key: 'discipline',
        label: filters.discipline,
        clear: () => handleDisciplineChange('Tümü'),
      });
    }
    if (filters.specialty !== 'Tümü') {
      chips.push({
        key: 'specialty',
        label: filters.specialty,
        clear: () => setFilters((p) => ({ ...p, specialty: 'Tümü' })),
      });
    }
    if (filters.genre !== 'Tümü') {
      chips.push({
        key: 'genre',
        label: filters.genre,
        clear: () => setFilters((p) => ({ ...p, genre: 'Tümü' })),
      });
    }
    if (filters.ensembleType !== 'Tümü') {
      chips.push({
        key: 'ensemble',
        label: filters.ensembleType,
        clear: () => setFilters((p) => ({ ...p, ensembleType: 'Tümü' })),
      });
    }
    if (filters.instrument !== 'Tümü') {
      chips.push({
        key: 'instrument',
        label: filters.instrument,
        clear: () => setFilters((p) => ({ ...p, instrument: 'Tümü' })),
      });
    }
    if (filters.businessType !== 'Tümü') {
      chips.push({
        key: 'biz',
        label: filters.businessType,
        clear: () => setFilters((p) => ({ ...p, businessType: 'Tümü' })),
      });
    }
    if (filters.city !== 'Tümü') {
      chips.push({
        key: 'city',
        label: filters.city,
        clear: () => setFilters((p) => ({ ...p, city: 'Tümü' })),
      });
    }
    if (filters.onlyUrgent) {
      chips.push({
        key: 'urgent',
        label: 'Acil İkame',
        clear: () => setFilters((p) => ({ ...p, onlyUrgent: false })),
      });
    }
    if (filters.onlyVerified) {
      chips.push({
        key: 'verified',
        label: 'Onaylı Mekân',
        clear: () => setFilters((p) => ({ ...p, onlyVerified: false })),
      });
    }
    if (filters.maxBudget < 100000) {
      chips.push({
        key: 'budget',
        label: `Maks. ${formatCurrencyTRY(filters.maxBudget)}`,
        clear: () => setFilters((p) => ({ ...p, maxBudget: 100000 })),
      });
    }
    return chips;
  }, [filters, setFilters]);

  const activeQuickTab = useMemo(() => {
    if (filters.onlyUrgent && filters.discipline === 'Tümü' && filters.genre === 'Tümü') return 'urgent';
    if (filters.discipline === 'Müzik' && filters.genre === 'Tümü') return 'music';
    if (filters.discipline === 'Heykel & Enstalasyon' || filters.discipline === 'Görsel Sanatlar & Sergi')
      return 'visual';
    if (filters.discipline === 'Edebiyat & Söyleşi') return 'lit';
    if (filters.discipline === 'Bileşik Sanatlar') return 'combined';
    if (activeFilterChips.length === 0) return 'all';
    return 'custom';
  }, [filters, activeFilterChips.length]);

  const applyQuickTab = (tab: string) => {
    resetFilters();
    if (tab === 'music') setFilters((p) => ({ ...p, discipline: 'Müzik' }));
    else if (tab === 'visual') setFilters((p) => ({ ...p, discipline: 'Heykel & Enstalasyon' }));
    else if (tab === 'lit') setFilters((p) => ({ ...p, discipline: 'Edebiyat & Söyleşi' }));
    else if (tab === 'combined') setFilters((p) => ({ ...p, discipline: 'Bileşik Sanatlar' }));
    else if (tab === 'urgent') setFilters((p) => ({ ...p, onlyUrgent: true }));
  };

  const renderSidebarContent = () => {
    const isMusicSelected = filters.discipline === 'Müzik';
    const isOtherDiscipline =
      filters.discipline !== 'Tümü' && filters.discipline !== 'Müzik';
    const subSpecialties = isOtherDiscipline
      ? DISCIPLINE_SPECIALTIES[filters.discipline as Exclude<ArtDiscipline, 'Müzik'>] || []
      : [];

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] dark:border-[#1e335a]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#16274e] dark:text-white">
            <Filter className="w-3.5 h-3.5 text-[#f25922]" />
            <span>Gelişmiş Filtreler</span>
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

        {/* Step 1: Primary Art Discipline */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0f172a] dark:text-slate-200 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#f25922]" />
            <span>Ana Sanat Dalı</span>
          </label>
          <CustomSelect
            value={filters.discipline}
            onChange={(val) => handleDisciplineChange(val as ArtDiscipline | 'Tümü')}
            options={ART_DISCIPLINES.map((d) => ({
              value: d,
              label: d === 'Tümü' ? 'Tüm Sanat Dalları' : d,
            }))}
            ariaLabel="Ana Sanat Dalı"
          />
        </div>

        {/* Step 2: Cascading Sub-Filters based on Discipline */}
        {isMusicSelected && (
          <div className="space-y-3.5 p-3 rounded-xl bg-orange-50/70 dark:bg-[#0f1c38]/90 border border-[#f25922]/25">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#f25922] flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              <span>Müzik Alt Filtreleri</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0f172a] dark:text-slate-200 block">
                Müzik Türü
              </label>
              <CustomSelect
                value={filters.genre}
                onChange={(val) => setFilters((p) => ({ ...p, genre: val as any }))}
                options={MUSIC_GENRES.map((g) => ({
                  value: g,
                  label: g === 'Tümü' ? 'Tüm Müzik Türleri' : g,
                }))}
                variant="compact"
                ariaLabel="Müzik Türü"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0f172a] dark:text-slate-200 block">
                Aranan Enstrüman
              </label>
              <CustomSelect
                value={filters.instrument}
                onChange={(val) => setFilters((p) => ({ ...p, instrument: val as any }))}
                options={MUSIC_INSTRUMENTS.map((i) => ({
                  value: i,
                  label: i === 'Tümü' ? 'Tüm Enstrümanlar' : i,
                }))}
                variant="compact"
                ariaLabel="Aranan Enstrüman"
              />
            </div>
          </div>
        )}

        {isOtherDiscipline && subSpecialties.length > 0 && (
          <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-[#0f1c38]/90 border border-[#16274e]/15 dark:border-[#1e335a]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#16274e] dark:text-[#ffb59e]">
              {filters.discipline} Uzmanlığı
            </div>
            <CustomSelect
              value={filters.specialty}
              onChange={(val) => setFilters((p) => ({ ...p, specialty: val }))}
              options={['Tümü', ...subSpecialties].map((s) => ({
                value: s,
                label: s === 'Tümü' ? 'Tüm Alt Uzmanlıklar' : s,
              }))}
              variant="compact"
              ariaLabel="Alt Uzmanlık Alanı"
            />
          </div>
        )}

        {filters.discipline === 'Tümü' && (
          <p className="text-[11px] text-[#64748b] dark:text-slate-400 bg-[#f8fafc] dark:bg-[#0f1c38]/60 px-3 py-2 rounded-xl border border-dashed border-[#cbd5e1] dark:border-[#1e335a] leading-relaxed">
            Tür, enstrüman veya alt disiplin filtrelerini açmak için yukarıdan ana sanat dalı seçin.
          </p>
        )}

        {/* Priority Switches */}
        <div className="space-y-2.5">
          <label
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              filters.onlyUrgent
                ? 'bg-amber-50 dark:bg-amber-500/10 border-[#f25922]/50'
                : 'bg-[#f8fafc] dark:bg-[#0f1c38]/60 border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#f25922]/40'
            }`}
          >
            <input
              type="checkbox"
              checked={filters.onlyUrgent}
              onChange={(e) => setFilters((p) => ({ ...p, onlyUrgent: e.target.checked }))}
              className="mt-0.5 w-4 h-4 accent-[#f25922] rounded cursor-pointer"
            />
            <div className="text-left">
              <span className="text-xs font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#f25922]" />
                <span>Acil Sahne &amp; İkame</span>
              </span>
              <span className="text-[11px] text-[#64748b] dark:text-slate-400 block mt-0.5 leading-snug">
                Yakın tarihli ve öncelikli çağrılar
              </span>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              filters.onlyVerified
                ? 'bg-emerald-50/70 dark:bg-emerald-500/10 border-emerald-500/40'
                : 'bg-[#f8fafc] dark:bg-[#0f1c38]/60 border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#16274e]/40'
            }`}
          >
            <input
              type="checkbox"
              checked={filters.onlyVerified}
              onChange={(e) => setFilters((p) => ({ ...p, onlyVerified: e.target.checked }))}
              className="mt-0.5 w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
            <div className="text-left">
              <span className="text-xs font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Onaylı Kurumlar</span>
              </span>
              <span className="text-[11px] text-[#64748b] dark:text-slate-400 block mt-0.5 leading-snug">
                Resmi vergi ve kurumsal doğrulamalı
              </span>
            </div>
          </label>
        </div>

        {/* Format & Kadro */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#0f172a] dark:text-slate-200 block">
            Format &amp; Ekip Yapısı
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {LISTING_ENSEMBLES.slice(0, 6).map((fmt) => {
              const active = filters.ensembleType === fmt;
              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFilters((p) => ({ ...p, ensembleType: fmt }))}
                  className={`px-2.5 py-2 rounded-lg text-[11px] font-semibold border text-left truncate transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#16274e] dark:bg-[#f25922] text-white border-[#16274e] dark:border-[#f25922] shadow-xs'
                      : 'bg-[#f8fafc] dark:bg-[#0f1c38] text-[#475569] dark:text-slate-300 border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#16274e]/40'
                  }`}
                >
                  {fmt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Venue / Business Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0f172a] dark:text-slate-200 block">
            Mekân &amp; Kurum Türü
          </label>
          <CustomSelect
            value={filters.businessType}
            onChange={(val) => setFilters((p) => ({ ...p, businessType: val as any }))}
            options={BUSINESS_TYPE_OPTIONS.map((b) => ({
              value: b,
              label: b === 'Tümü' ? 'Tüm Mekân Türleri' : b,
            }))}
            ariaLabel="Mekân Türü"
          />
        </div>

        {/* City Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0f172a] dark:text-slate-200 block">
            Şehir
          </label>
          <CustomSelect
            value={filters.city}
            onChange={(val) => setFilters((p) => ({ ...p, city: val }))}
            options={CITY_LIST.map((c) => ({
              value: c,
              label: c === 'Tümü' ? 'Tüm Şehirler' : c,
            }))}
            ariaLabel="Şehir"
          />
        </div>

        {/* Budget Range Slider */}
        <div className="space-y-2 pt-3 border-t border-[#e2e8f0] dark:border-[#1e335a]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#0f172a] dark:text-slate-200">Maksimum Hakediş</span>
            <span className="font-bold text-[#f25922] tabular-nums">
              {filters.maxBudget >= 100000 ? '₺100.000+' : formatCurrencyTRY(filters.maxBudget)}
            </span>
          </div>
          <input
            type="range"
            min="5000"
            max="100000"
            step="5000"
            value={filters.maxBudget}
            onChange={(e) => setFilters((p) => ({ ...p, maxBudget: Number(e.target.value) }))}
            className="w-full accent-[#f25922] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#64748b] dark:text-slate-400 tabular-nums">
            <span>₺5.000</span>
            <span>₺50.000</span>
            <span>₺100.000+</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="text-left w-full">
      {/* 1. Navy Architectural Banner Header */}
      <ArchitecturalPageHeader
        eyebrow="Escrow Güvenceli Sahne & Sanat Çağrıları"
        title="Sahne & Sanat Fırsatları"
        subtitle="Doğrulanmış oteller, müzeler, galeriler, kültür merkezleri ve organizasyonlar için sabit bütçeli performans ve kürasyon ilanlarını keşfedin."
        stats={[
          { label: 'Açık İlanlar', value: `${listings.length} Aktif Çağrı` },
          { label: 'Komisyon Politikası', value: 'Net Sanatçı Hakedişi', accent: 'emerald' },
        ]}
        searchQuery={filters.searchQuery}
        onSearchChange={(val) => setFilters((p) => ({ ...p, searchQuery: val }))}
        searchPlaceholder="İlan başlığı, sanat dalı, mekân, enstrüman veya şehir ara (Örn: Piyano, Heykel, Galeri)..."
        searchButtonLabel="İlan Ara"
        onOpenMobileFilter={() => setMobileFilterOpen(true)}
      />

      {/* 2. Summary, Removable Chips, Sort & View Mode Control Strip */}
      <div className="bg-white dark:bg-[#13213e] border-b border-[#e2e8f0] dark:border-[#1e335a] transition-colors">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#16274e]/8 dark:bg-white/10 text-[#16274e] dark:text-white text-xs font-bold tabular-nums">
              <span>{filteredListings.length} Aktif Sahne &amp; Sanat İlanı</span>
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
              value={filters.sortBy}
              onChange={(val) => setFilters((p) => ({ ...p, sortBy: val as any }))}
              variant="compact"
              className="w-52"
              options={[
                { value: 'newest', label: 'En Yeni İlanlar' },
                { value: 'budget_desc', label: 'Hakediş: Yüksekten Düşüğe' },
                { value: 'budget_asc', label: 'Hakediş: Düşükten Yükseğe' },
                { value: 'date_asc', label: 'Etkinlik Tarihi Yaklaşan' },
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

      {/* 3. Architectural Grid Main Workspace */}
      <div className="architectural-grid bg-[#f8fafc] dark:bg-[#0c1527] min-h-[60vh] transition-colors">
        <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Sticky Filter Sidebar */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0 bg-white dark:bg-[#13213e] rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] p-5 sticky top-24 shadow-xs">
            {renderSidebarContent()}
          </aside>

          {/* Right Workspace */}
          <div className="flex-1 min-w-0 w-full space-y-5">
            {/* Quick Discipline Tabs */}
            <div ref={resultsTopRef} className="scroll-mt-24 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'Tüm Çağrılar' },
                  { id: 'music', label: 'Müzik' },
                  { id: 'visual', label: 'Heykel & Sergi' },
                  { id: 'lit', label: 'Edebiyat & Söyleşi' },
                  { id: 'combined', label: 'Bileşik Sanatlar' },
                  { id: 'urgent', label: 'Acil Çağrılar' },
                ].map((pill) => {
                  const active = activeQuickTab === pill.id;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => applyQuickTab(pill.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#f25922] text-white border-[#f25922] shadow-sm'
                          : 'bg-white dark:bg-[#13213e] text-[#475569] dark:text-slate-300 border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#f25922]/50 hover:text-[#f25922]'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>

              {/* Top Pagination */}
              <PaginationBar
                position="top"
                currentPage={safePage}
                totalItems={filteredListings.length}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                itemLabel="ilan"
              />
            </div>

            {/* Empty State or Cards */}
            {filteredListings.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-[#13213e] rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-[#f25922]/15 flex items-center justify-center mx-auto text-[#f25922]">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0f172a] dark:text-white">
                  Seçilen kriterlere uygun ilan bulunamadı
                </h3>
                <p className="text-xs text-[#64748b] dark:text-slate-400 max-w-sm mx-auto">
                  Filtreleri sıfırlayarak veya farklı sanat dallarını seçerek diğer sahne fırsatlarını inceleyebilirsiniz.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#16274e] dark:bg-[#f25922] hover:opacity-90 rounded-xl transition-opacity cursor-pointer"
                >
                  Tüm İlanları Göster
                </button>
              </div>
            ) : (
              <motion.div
                key={`listings-page-${safePage}-${viewMode}`}
                initial={{ opacity: 0.78, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 480, damping: 34 }}
              >
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5">
                    {paginatedListings.map((listing) => {
                      const isSaved = savedIds.includes(listing.id);
                      const disc = resolveDiscipline(listing.discipline);
                      const badgeTags =
                        listing.specialtyTags && listing.specialtyTags.length > 0
                          ? listing.specialtyTags
                          : listing.requiredInstruments;

                      return (
                        <article
                          key={listing.id}
                          onClick={() => onSelectListing(listing)}
                          className={`group rounded-2xl border transition-transform transition-colors duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer flex flex-col justify-between overflow-hidden shadow-xs ${
                            listing.isReplacement
                              ? 'bg-amber-50/75 dark:bg-amber-950/20 border-[#f25922]/60 hover:border-[#f25922]'
                              : 'bg-white dark:bg-[#13213e] border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#f25922]/60'
                          }`}
                        >
                          <div className="p-3.5 space-y-2.5">
                            {/* Top Status & Bookmark */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1 flex-wrap min-w-0">
                                {listing.isReplacement ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f25922] text-white text-[10px] font-bold uppercase">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Acil Çağrı</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold truncate max-w-[140px]">
                                    <span>{disc === 'Müzik' ? listing.genres[0] || disc : disc}</span>
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={(e) => toggleSave(e, listing.id)}
                                aria-label="İlanı Kaydet"
                                className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                                  isSaved
                                    ? 'bg-[#f25922]/10 border-[#f25922]/40 text-[#f25922]'
                                    : 'bg-transparent border-transparent text-[#94a3b8] hover:text-[#f25922]'
                                }`}
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                              </button>
                            </div>

                            {/* Business Identity */}
                            <div className="flex items-center gap-2">
                              <img
                                src={listing.businessLogo}
                                alt={listing.businessName}
                                className="w-8 h-8 rounded-lg object-cover border border-[#e2e8f0] dark:border-[#1e335a] shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1 text-[11px] font-bold text-[#0f172a] dark:text-white truncate">
                                  <span className="truncate">{listing.businessName}</span>
                                  {listing.businessVerified && (
                                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-[#64748b] dark:text-slate-400 truncate">
                                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                                  <span className="truncate">
                                    {listing.city}, {listing.district}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-[13px] font-bold text-[#0f172a] dark:text-white group-hover:text-[#f25922] transition-colors line-clamp-2 min-h-[2.25rem] leading-snug">
                              {listing.title}
                            </h3>

                            {/* Format & Specialty Metadata */}
                            <div className="flex items-center gap-1.5 text-[11px] text-[#475569] dark:text-slate-300 truncate">
                              <Users className="w-3 h-3 text-[#f25922] shrink-0" />
                              <span className="font-semibold text-[#16274e] dark:text-slate-200 truncate">
                                {listing.targetEnsembleType} ({listing.performerCount})
                              </span>
                              {badgeTags[0] && (
                                <>
                                  <span className="text-[#cbd5e1] dark:text-slate-600">·</span>
                                  <span className="truncate">{badgeTags[0]}</span>
                                </>
                              )}
                            </div>

                            {/* Event Date & Duration */}
                            <div className="flex items-center justify-between text-[10px] text-[#64748b] dark:text-slate-400 pt-0.5 tabular-nums">
                              <span className="inline-flex items-center gap-1 font-semibold text-[#0f172a] dark:text-slate-200">
                                <Calendar className="w-3 h-3 text-[#f25922]" />
                                <span>{listing.eventDate}</span>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{listing.durationMins} dk</span>
                              </span>
                            </div>
                          </div>

                          {/* Card Footer Budget & CTA */}
                          <div className="px-3.5 py-2.5 bg-[#f8fafc] dark:bg-[#0f1c38]/80 border-t border-[#e2e8f0] dark:border-[#1e335a] flex items-center justify-between gap-2">
                            <div>
                              <div className="text-[9px] font-semibold uppercase tracking-wider text-[#64748b] dark:text-slate-400">
                                Net Hakediş
                              </div>
                              <div className="text-sm font-extrabold text-[#0f172a] dark:text-white tabular-nums">
                                {formatCurrencyTRY(listing.budgetAmount)}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectListing(listing);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#16274e] dark:bg-[#f25922] group-hover:bg-[#f25922] text-white text-[11px] font-bold transition-colors inline-flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              <span>Başvur</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  /* Detailed Horizontal List View */
                  <div className="space-y-3.5">
                    {paginatedListings.map((listing) => (
                      <article
                        key={listing.id}
                        onClick={() => onSelectListing(listing)}
                        className={`group p-5 rounded-2xl border transition-colors hover:-translate-y-0.5 hover:shadow-md cursor-pointer relative overflow-hidden shadow-xs ${
                          listing.isReplacement
                            ? 'bg-amber-50/75 dark:bg-amber-950/20 border-[#f25922]/60 hover:border-[#f25922]'
                            : 'bg-white dark:bg-[#13213e] border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#f25922]/60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-4 min-w-0">
                            <img
                              src={listing.businessLogo}
                              alt={listing.businessName}
                              className="w-12 h-12 rounded-xl object-cover border border-[#e2e8f0] dark:border-[#1e335a] shrink-0"
                            />

                            <div className="space-y-1.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748b] dark:text-slate-400">
                                <span className="font-bold text-[#0f172a] dark:text-white">
                                  {listing.businessName}
                                </span>
                                {listing.businessVerified && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                )}
                                <span>·</span>
                                <span>{resolveDiscipline(listing.discipline)}</span>
                                <span>·</span>
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {listing.city}, {listing.district}
                                </span>
                              </div>

                              <h3 className="text-base sm:text-lg font-extrabold text-[#0f172a] dark:text-white group-hover:text-[#f25922] transition-colors">
                                {listing.title}
                              </h3>

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#475569] dark:text-slate-300">
                                <span className="font-semibold text-[#16274e] dark:text-[#ffb59e]">
                                  {listing.targetEnsembleType} ({listing.performerCount} Kişi)
                                </span>
                                <span>·</span>
                                <span>
                                  {(listing.specialtyTags && listing.specialtyTags.length > 0
                                    ? listing.specialtyTags
                                    : listing.requiredInstruments
                                  ).join(' · ')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#e2e8f0] dark:border-[#1e335a] flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-1">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] dark:text-slate-400">
                              Sabit Hakediş
                            </div>
                            <div className="text-xl font-extrabold text-[#0f172a] dark:text-white tabular-nums">
                              {formatCurrencyTRY(listing.budgetAmount)}
                            </div>
                            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              Escrow Korumalı
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#e2e8f0] dark:border-[#1e335a] flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748b] dark:text-slate-400 tabular-nums">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="inline-flex items-center gap-1.5 text-[#0f172a] dark:text-slate-200 font-semibold">
                              <Calendar className="w-3.5 h-3.5 text-[#f25922]" />
                              {listing.eventDate} ({listing.startTime} - {listing.endTime})
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {listing.durationMins} dk
                            </span>
                          </div>

                          <span className="inline-flex items-center gap-1 font-bold text-[#16274e] dark:text-[#f25922] group-hover:translate-x-0.5 transition-transform">
                            <span>İlan Detayı &amp; Başvur</span>
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Bottom Pagination */}
            <PaginationBar
              position="bottom"
              currentPage={safePage}
              totalItems={filteredListings.length}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              itemLabel="ilan"
            />

            {/* Bottom Escrow Guarantee Info Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-[#16274e] to-[#203666] border border-[#1e335a] p-6 sm:p-7 text-white flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#f25922]/20 border border-[#f25922]/40 flex items-center justify-center shrink-0 text-[#f25922]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    Escrow Güvenceli Sanatçı &amp; Mekân Ödemesi
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    Sahne anlaşması onaylandığında bütçe platform güvence hesabına alınır ve performans tamamlandığında kesintisiz şekilde icracıya aktarılır.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigateTo('how_it_works')}
                className="px-5 py-2.5 rounded-xl bg-[#f25922] hover:bg-[#d94b18] text-white text-xs font-bold shadow-md inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer transition-colors"
              >
                <span>Nasıl Çalışır?</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
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
                  <span className="font-bold text-sm text-[#0f172a] dark:text-white">İlan Filtreleri</span>
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
                  Uygula ({filteredListings.length})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
