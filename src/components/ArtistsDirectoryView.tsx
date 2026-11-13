import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { useAdaptivePageSize } from '../hooks/useAdaptivePageSize';
import { ArtDiscipline } from '../types';
import {
  ART_DISCIPLINES,
  DISCIPLINE_SPECIALTIES,
  MUSIC_GENRES,
  MUSIC_INSTRUMENTS,
  CITY_LIST,
  resolveDiscipline,
} from '../utils/disciplineConfig';
import { ArchitecturalPageHeader } from './ui/ArchitecturalPageHeader';
import { CustomSelect } from './ui/CustomSelect';
import { PaginationBar } from './ui/PaginationBar';
import {
  Filter,
  Star,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Search,
  RotateCcw,
  LayoutGrid,
  List,
  X,
  Music,
  Layers,
  Award,
  ArrowRight,
} from 'lucide-react';

type SortOption = 'recommended' | 'rating_desc' | 'jobs_desc' | 'experience_desc';

export const ArtistsDirectoryView: React.FC = () => {
  const { artists, navigateTo, selectedEntityId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<ArtDiscipline | 'Tümü'>('Tümü');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Tümü');
  const [selectedInstrument, setSelectedInstrument] = useState<string>('Tümü');
  const [selectedGenre, setSelectedGenre] = useState<string>('Tümü');
  const [selectedCity, setSelectedCity] = useState<string>('Tümü');
  const [minExperience, setMinExperience] = useState<number>(0);
  const [onlyRecommended, setOnlyRecommended] = useState<boolean>(selectedEntityId === 'recommended');
  const [onlyZeroCancellation, setOnlyZeroCancellation] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsTopRef = useRef<HTMLDivElement>(null);
  const pageSize = useAdaptivePageSize(viewMode);

  useEffect(() => {
    if (selectedEntityId === 'recommended') {
      setOnlyRecommended(true);
    }
  }, [selectedEntityId]);

  const handleDisciplineChange = (disc: ArtDiscipline | 'Tümü') => {
    setSelectedDiscipline(disc);
    setSelectedSpecialty('Tümü');
    if (disc !== 'Müzik') {
      setSelectedGenre('Tümü');
      setSelectedInstrument('Tümü');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDiscipline('Tümü');
    setSelectedSpecialty('Tümü');
    setSelectedInstrument('Tümü');
    setSelectedGenre('Tümü');
    setSelectedCity('Tümü');
    setMinExperience(0);
    setOnlyRecommended(false);
    setOnlyZeroCancellation(false);
    setOnlyVerified(false);
    setSortBy('recommended');
  };

  const filteredArtists = useMemo(() => {
    return artists
      .filter((a) => {
        const disc = resolveDiscipline(a.discipline);

        if (selectedDiscipline !== 'Tümü' && disc !== selectedDiscipline) {
          return false;
        }

        if (
          selectedDiscipline !== 'Tümü' &&
          selectedDiscipline !== 'Müzik' &&
          selectedSpecialty !== 'Tümü'
        ) {
          const tags = a.specialtyTags || [];
          const hasSpec =
            tags.includes(selectedSpecialty) ||
            a.title.toLowerCase().includes(selectedSpecialty.toLowerCase()) ||
            a.bioShort.toLowerCase().includes(selectedSpecialty.toLowerCase());
          if (!hasSpec) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = a.fullName.toLowerCase().includes(q);
          const matchTitle = a.title.toLowerCase().includes(q);
          const matchInst = a.primaryInstrument.toLowerCase().includes(q);
          const matchBio = a.bioShort.toLowerCase().includes(q);
          const matchDisc = disc.toLowerCase().includes(q);
          const matchTags = (a.specialtyTags || []).some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchTitle && !matchInst && !matchBio && !matchDisc && !matchTags) {
            return false;
          }
        }

        if (
          selectedInstrument !== 'Tümü' &&
          a.primaryInstrument !== selectedInstrument &&
          !a.instruments.includes(selectedInstrument as any)
        ) {
          return false;
        }

        if (selectedGenre !== 'Tümü' && !a.genres.includes(selectedGenre as any)) {
          return false;
        }

        if (selectedCity !== 'Tümü' && a.city !== selectedCity) {
          return false;
        }

        if (a.experienceYears < minExperience) {
          return false;
        }

        if (onlyRecommended && !a.isRecommended && a.ratingAvg < 4.9) {
          return false;
        }

        if (onlyZeroCancellation && a.cancellationRate > 0) {
          return false;
        }

        if (onlyVerified && !a.isVerified) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating_desc') return b.ratingAvg - a.ratingAvg;
        if (sortBy === 'jobs_desc') return b.completedJobsCount - a.completedJobsCount;
        if (sortBy === 'experience_desc') return b.experienceYears - a.experienceYears;
        return Number(Boolean(b.isRecommended)) - Number(Boolean(a.isRecommended)) || b.ratingAvg - a.ratingAvg;
      });
  }, [
    artists,
    searchQuery,
    selectedDiscipline,
    selectedSpecialty,
    selectedInstrument,
    selectedGenre,
    selectedCity,
    minExperience,
    onlyRecommended,
    onlyZeroCancellation,
    onlyVerified,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredArtists.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedArtists = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredArtists.slice(start, start + pageSize);
  }, [filteredArtists, safePage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedDiscipline,
    selectedSpecialty,
    selectedInstrument,
    selectedGenre,
    selectedCity,
    minExperience,
    onlyRecommended,
    onlyZeroCancellation,
    onlyVerified,
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
        clear: () => handleDisciplineChange('Tümü'),
      });
    }
    if (selectedSpecialty !== 'Tümü') {
      chips.push({
        key: 'spec',
        label: selectedSpecialty,
        clear: () => setSelectedSpecialty('Tümü'),
      });
    }
    if (selectedGenre !== 'Tümü') {
      chips.push({ key: 'genre', label: selectedGenre, clear: () => setSelectedGenre('Tümü') });
    }
    if (selectedInstrument !== 'Tümü') {
      chips.push({
        key: 'inst',
        label: selectedInstrument,
        clear: () => setSelectedInstrument('Tümü'),
      });
    }
    if (selectedCity !== 'Tümü') {
      chips.push({ key: 'city', label: selectedCity, clear: () => setSelectedCity('Tümü') });
    }
    if (minExperience > 0) {
      chips.push({
        key: 'exp',
        label: `${minExperience}+ Yıl Deneyim`,
        clear: () => setMinExperience(0),
      });
    }
    if (onlyRecommended) {
      chips.push({
        key: 'rec',
        label: 'Tavsiye Edilenler',
        clear: () => setOnlyRecommended(false),
      });
    }
    if (onlyZeroCancellation) {
      chips.push({
        key: 'cancel',
        label: '%0 İptal Sicili',
        clear: () => setOnlyZeroCancellation(false),
      });
    }
    if (onlyVerified) {
      chips.push({
        key: 'ver',
        label: 'Onaylı Sanatçı',
        clear: () => setOnlyVerified(false),
      });
    }
    return chips;
  }, [
    searchQuery,
    selectedDiscipline,
    selectedSpecialty,
    selectedGenre,
    selectedInstrument,
    selectedCity,
    minExperience,
    onlyRecommended,
    onlyZeroCancellation,
    onlyVerified,
  ]);

  const renderSidebarContent = () => {
    const isMusicSelected = selectedDiscipline === 'Müzik';
    const isOtherDiscipline =
      selectedDiscipline !== 'Tümü' && selectedDiscipline !== 'Müzik';
    const subSpecialties = isOtherDiscipline
      ? DISCIPLINE_SPECIALTIES[selectedDiscipline as Exclude<ArtDiscipline, 'Müzik'>] || []
      : [];

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] dark:border-[#1e335a]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#16274e] dark:text-white">
            <Filter className="w-3.5 h-3.5 text-[#f25922]" />
            <span>Sanatçı Filtreleri</span>
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
            value={selectedDiscipline}
            onChange={(val) => handleDisciplineChange(val as ArtDiscipline | 'Tümü')}
            options={ART_DISCIPLINES.map((d) => ({
              value: d,
              label: d === 'Tümü' ? 'Tüm Sanat Dalları' : d,
            }))}
            ariaLabel="Ana Sanat Dalı"
          />
        </div>

        {/* Step 2: Cascading Sub-filters */}
        {isMusicSelected && (
          <div className="space-y-3.5 p-3 rounded-xl bg-orange-50/70 dark:bg-[#0f1c38]/90 border border-[#f25922]/25">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#f25922] flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              <span>Müzik Uzmanlığı</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0f172a] dark:text-slate-200 block">
                Ana Enstrüman
              </label>
              <CustomSelect
                value={selectedInstrument}
                onChange={setSelectedInstrument}
                options={MUSIC_INSTRUMENTS.map((i) => ({
                  value: i,
                  label: i === 'Tümü' ? 'Tüm Enstrümanlar' : i,
                }))}
                variant="compact"
                ariaLabel="Enstrüman"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0f172a] dark:text-slate-200 block">
                Müzik Türü
              </label>
              <CustomSelect
                value={selectedGenre}
                onChange={setSelectedGenre}
                options={MUSIC_GENRES.map((g) => ({
                  value: g,
                  label: g === 'Tümü' ? 'Tüm Müzik Türleri' : g,
                }))}
                variant="compact"
                ariaLabel="Müzik Türü"
              />
            </div>
          </div>
        )}

        {isOtherDiscipline && subSpecialties.length > 0 && (
          <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-[#0f1c38]/90 border border-[#16274e]/15 dark:border-[#1e335a]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#16274e] dark:text-[#ffb59e]">
              {selectedDiscipline} Uzmanlığı
            </div>
            <CustomSelect
              value={selectedSpecialty}
              onChange={setSelectedSpecialty}
              options={['Tümü', ...subSpecialties].map((s) => ({
                value: s,
                label: s === 'Tümü' ? 'Tüm Alt Alanlar' : s,
              }))}
              variant="compact"
              ariaLabel="Alt Uzmanlık"
            />
          </div>
        )}

        {selectedDiscipline === 'Tümü' && (
          <p className="text-[11px] text-[#64748b] dark:text-slate-400 bg-[#f8fafc] dark:bg-[#0f1c38]/60 px-3 py-2 rounded-xl border border-dashed border-[#cbd5e1] dark:border-[#1e335a] leading-relaxed">
            Enstrüman, müzik türü veya diğer sanat alt uzmanlıklarını filtrelemek için ana sanat dalı seçin.
          </p>
        )}

        {/* Trust & Reliability Toggles */}
        <div className="space-y-2">
          <label
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              onlyRecommended
                ? 'bg-orange-50/70 dark:bg-[#f25922]/15 border-[#f25922]/50'
                : 'bg-[#f8fafc] dark:bg-[#0f1c38]/60 border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#f25922]/40'
            }`}
          >
            <input
              type="checkbox"
              checked={onlyRecommended}
              onChange={(e) => setOnlyRecommended(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#f25922] rounded cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[#f25922]" />
                <span>Tavsiye Edilenler</span>
              </span>
              <span className="text-[11px] text-[#64748b] dark:text-slate-400 block mt-0.5">
                Yüksek puanlı seçkin sanatçılar
              </span>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              onlyZeroCancellation
                ? 'bg-emerald-50/70 dark:bg-emerald-500/10 border-emerald-500/40'
                : 'bg-[#f8fafc] dark:bg-[#0f1c38]/60 border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#16274e]/40'
            }`}
          >
            <input
              type="checkbox"
              checked={onlyZeroCancellation}
              onChange={(e) => setOnlyZeroCancellation(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>%0 İptal Sicili</span>
              </span>
              <span className="text-[11px] text-[#64748b] dark:text-slate-400 block mt-0.5">
                Tüm taahhütlerini tam gerçekleştiren
              </span>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              onlyVerified
                ? 'bg-blue-50/70 dark:bg-blue-500/10 border-blue-500/40'
                : 'bg-[#f8fafc] dark:bg-[#0f1c38]/60 border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#16274e]/40'
            }`}
          >
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#16274e] rounded cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Onaylı Dosya</span>
              </span>
              <span className="text-[11px] text-[#64748b] dark:text-slate-400 block mt-0.5">
                Kimlik ve portfolyo doğrulamalı
              </span>
            </div>
          </label>
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

        {/* Experience Slider */}
        <div className="space-y-2 pt-3 border-t border-[#e2e8f0] dark:border-[#1e335a]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#0f172a] dark:text-slate-200">Minimum Deneyim</span>
            <span className="font-bold text-[#f25922] tabular-nums">
              {minExperience === 0 ? 'Fark Etmez' : `${minExperience}+ Yıl`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            step="3"
            value={minExperience}
            onChange={(e) => setMinExperience(Number(e.target.value))}
            className="w-full accent-[#f25922] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#64748b] dark:text-slate-400 tabular-nums">
            <span>Tümü</span>
            <span>6+ Yıl</span>
            <span>15+ Yıl</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="text-left w-full">
      <ArchitecturalPageHeader
        eyebrow="Kültür & Sanat Kataloğu · Doğrulanmış İcracılar & Sanatçılar"
        title="Sanatçılar Dizini"
        subtitle="Konservatuvar mezunu icracılar, görsel sanatçılar, heykeltıraşlar, yazarlar ve bileşik sanat küratörlerinin doğrulanmış portfolyolarını inceleyin."
        stats={[
          { label: 'Kayıtlı Sanatçı', value: `${artists.length} Doğrulanmış Profil` },
          { label: 'Güven Standartı', value: '%0 İptal Sicil Takibi', accent: 'emerald' },
        ]}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Sanatçı adı, piyano, heykeltıraş, şair, enstrüman veya şehir ara..."
        searchButtonLabel="Sanatçı Ara"
        onOpenMobileFilter={() => setMobileFilterOpen(true)}
      />

      {/* Summary, Chips, Sort & View Toggle Bar */}
      <div className="bg-white dark:bg-[#13213e] border-b border-[#e2e8f0] dark:border-[#1e335a] transition-colors">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#16274e]/8 dark:bg-white/10 text-[#16274e] dark:text-white text-xs font-bold tabular-nums">
              <span>{filteredArtists.length} Doğrulanmış Sanatçı</span>
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
                { value: 'recommended', label: 'Tavsiye Edilenler' },
                { value: 'rating_desc', label: 'En Yüksek Puan' },
                { value: 'jobs_desc', label: 'En Çok Sahne & İş' },
                { value: 'experience_desc', label: 'Deneyim: Yüksekten' },
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

      {/* Architectural Grid Workspace */}
      <div className="architectural-grid bg-[#f8fafc] dark:bg-[#0c1527] min-h-[60vh] transition-colors">
        <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Sticky Sidebar */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0 bg-white dark:bg-[#13213e] rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] p-5 sticky top-24 shadow-xs">
            {renderSidebarContent()}
          </aside>

          {/* Right Cards Workspace */}
          <div className="flex-1 min-w-0 w-full space-y-5">
            {/* Quick Discipline Filter Bar + Top Pagination */}
            <div ref={resultsTopRef} className="scroll-mt-24 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {ART_DISCIPLINES.map((disc) => {
                  const active = selectedDiscipline === disc;
                  return (
                    <button
                      key={disc}
                      type="button"
                      onClick={() => handleDisciplineChange(disc)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#f25922] text-white border-[#f25922] shadow-sm'
                          : 'bg-white dark:bg-[#13213e] text-[#475569] dark:text-slate-300 border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#f25922]/50 hover:text-[#f25922]'
                      }`}
                    >
                      {disc === 'Tümü' ? 'Tüm Sanatçılar' : disc}
                    </button>
                  );
                })}
              </div>

              <PaginationBar
                position="top"
                currentPage={safePage}
                totalItems={filteredArtists.length}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                itemLabel="sanatçı"
              />
            </div>

            {filteredArtists.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-[#13213e] rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-[#f25922]/15 flex items-center justify-center mx-auto text-[#f25922]">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0f172a] dark:text-white">
                  Seçilen kriterlere uygun sanatçı bulunamadı
                </h3>
                <p className="text-xs text-[#64748b] dark:text-slate-400 max-w-sm mx-auto">
                  Filtreleri sıfırlayarak tüm disiplinlerden sanatçıları inceleyebilirsiniz.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#16274e] dark:bg-[#f25922] hover:opacity-90 rounded-xl transition-opacity cursor-pointer"
                >
                  Tüm Sanatçıları Göster
                </button>
              </div>
            ) : (
              <motion.div
                key={`artists-page-${safePage}-${viewMode}`}
                initial={{ opacity: 0.78, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 480, damping: 34 }}
              >
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5">
                    {paginatedArtists.map((artist) => {
                      const disc = resolveDiscipline(artist.discipline);
                      const primarySpecialty =
                        disc === 'Müzik'
                          ? artist.primaryInstrument
                          : artist.specialtyTags?.[0] || disc;

                      return (
                        <article
                          key={artist.id}
                          onClick={() => navigateTo('artist_profile', artist.id)}
                          className="group bg-white dark:bg-[#13213e] rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#f25922]/60 shadow-xs hover:shadow-lg transition-transform transition-colors duration-200 hover:-translate-y-0.5 cursor-pointer overflow-hidden flex flex-col justify-between"
                        >
                          <div>
                            {/* Cover Photo & Badges */}
                            <div className="relative h-28 w-full bg-[#12161b] overflow-hidden">
                              <img
                                src={artist.coverUrl || artist.avatarUrl}
                                alt={artist.fullName}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/20 to-transparent" />

                              <div className="absolute top-2 inset-x-2 flex items-center justify-between gap-1 z-10">
                                <span className="px-2 py-0.5 rounded-md bg-[#16274e]/95 text-white text-[9px] font-bold truncate max-w-[115px]">
                                  {disc}
                                </span>

                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-200 text-emerald-950 text-[9px] font-bold tabular-nums">
                                  %{artist.cancellationRate} İptal
                                </span>
                              </div>

                              {/* Experience + Mini Avatar */}
                              <div className="absolute bottom-2 inset-x-2 z-10 flex items-center justify-between gap-1.5">
                                <span className="px-2 py-0.5 rounded-md bg-white/95 text-[#0f172a] text-[9px] font-bold truncate max-w-[120px]">
                                  {artist.experienceYears} Yıl Deneyim
                                </span>

                                <img
                                  src={artist.avatarUrl}
                                  alt={artist.fullName}
                                  className="w-8 h-8 rounded-lg object-cover border-2 border-white shadow-sm shrink-0 bg-white"
                                />
                              </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-3.5 space-y-1.5">
                              <div className="flex items-center justify-between gap-1.5">
                                <div className="flex items-center gap-1 min-w-0">
                                  <h3 className="font-bold text-[13px] text-[#0f172a] dark:text-white group-hover:text-[#f25922] transition-colors truncate">
                                    {artist.fullName}
                                  </h3>
                                  {artist.isVerified && (
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  )}
                                </div>
                                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#0f172a] dark:text-white tabular-nums shrink-0">
                                  <Star className="w-3 h-3 text-[#f25922] fill-[#f25922]" />
                                  {artist.ratingAvg.toFixed(1)}
                                </span>
                              </div>

                              <div className="text-[11px] font-semibold text-[#f25922] truncate">
                                {primarySpecialty}
                              </div>

                              <div className="text-[11px] text-[#64748b] dark:text-slate-400 line-clamp-1">
                                {artist.title}
                              </div>

                              <div className="flex items-center gap-1 text-[10px] text-[#64748b] dark:text-slate-400 pt-0.5 truncate">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {artist.city}, {artist.district}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="px-3.5 py-2.5 bg-[#f8fafc] dark:bg-[#0f1c38]/80 border-t border-[#e2e8f0] dark:border-[#1e335a] flex items-center justify-between text-[11px] tabular-nums">
                            <span className="text-[#475569] dark:text-slate-300 font-semibold">
                              {artist.completedJobsCount} Proje
                            </span>
                            <span className="inline-flex items-center gap-0.5 font-bold text-[#16274e] dark:text-[#ffb59e] group-hover:text-[#f25922]">
                              <span>Profili Gör</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  /* List View */
                  <div className="space-y-3.5">
                    {paginatedArtists.map((artist) => {
                      const disc = resolveDiscipline(artist.discipline);
                      return (
                        <article
                          key={artist.id}
                          onClick={() => navigateTo('artist_profile', artist.id)}
                          className="group bg-white dark:bg-[#13213e] p-5 rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#f25922]/60 shadow-xs hover:shadow-md transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-4 min-w-0">
                            <img
                              src={artist.avatarUrl}
                              alt={artist.fullName}
                              className="w-14 h-14 rounded-xl object-cover border border-[#e2e8f0] dark:border-[#1e335a] shrink-0"
                            />
                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="font-bold text-base text-[#0f172a] dark:text-white group-hover:text-[#f25922] transition-colors">
                                  {artist.fullName}
                                </span>
                                {artist.isVerified && (
                                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                )}
                                <span className="px-2 py-0.5 rounded-md bg-orange-50 dark:bg-[#f25922]/15 text-[#f25922] text-[10px] font-bold">
                                  {disc}
                                </span>
                              </div>
                              <div className="text-xs font-medium text-[#475569] dark:text-slate-300">
                                {artist.title} · {artist.city}
                              </div>
                              <p className="text-xs text-[#64748b] dark:text-slate-400 line-clamp-1">
                                {artist.bioShort}
                              </p>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#e2e8f0] dark:border-[#1e335a]">
                            <div className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#0f172a] dark:text-white tabular-nums">
                              <Star className="w-4 h-4 text-[#f25922] fill-[#f25922]" />
                              <span>{artist.ratingAvg.toFixed(2)}</span>
                              <span className="text-xs font-normal text-[#64748b]">({artist.ratingCount})</span>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#16274e] dark:text-[#ffb59e] group-hover:text-[#f25922]">
                              <span>Dosyayı İncele</span>
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
              totalItems={filteredArtists.length}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              itemLabel="sanatçı"
            />

            {/* Bottom Callout Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-[#16274e] to-[#203666] border border-[#1e335a] p-6 sm:p-7 text-white flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Doğrulanmış Sanatçı Portfolyonuzu Oluşturun
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  Müzik, görsel sanatlar, heykel, edebiyat veya bileşik sanatlar alanındaki uzmanlığınızı ekleyin; prestijli kültür kurumlarının tekliflerini alın.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('profile_edit')}
                className="px-5 py-2.5 rounded-xl bg-[#f25922] hover:bg-[#d94b18] text-white text-xs font-bold shadow-md inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer transition-colors"
              >
                <span>Profilimi Düzenle</span>
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
                  <span className="font-bold text-sm text-[#0f172a] dark:text-white">Sanatçı Filtreleri</span>
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
                  Uygula ({filteredArtists.length})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
