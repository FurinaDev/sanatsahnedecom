import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ArtDiscipline } from '../types';
import { ART_DISCIPLINES, CITY_LIST } from '../utils/disciplineConfig';
import { CustomSelect } from './ui/CustomSelect';
import { AnimatedCounter } from './ui/AnimatedCounter';
import { computePlatformStats } from '../utils/platformStats';
import {
  Compass,
  MapPin,
  Palette,
  Search,
} from 'lucide-react';

interface QuickTopic {
  label: string;
  discipline: ArtDiscipline | 'Tümü';
  query: string;
}

const QUICK_TOPICS: QuickTopic[] = [
  { label: 'Klasik & Oda Müziği', discipline: 'Müzik', query: '' },
  { label: 'Heykel & Enstalasyon', discipline: 'Heykel & Enstalasyon', query: '' },
  { label: 'Görsel Sanatlar & Sergi', discipline: 'Görsel Sanatlar & Sergi', query: '' },
  { label: 'Edebiyat & Söyleşi', discipline: 'Edebiyat & Söyleşi', query: '' },
  { label: 'Bileşik Sanatlar', discipline: 'Bileşik Sanatlar', query: '' },
  { label: 'Caz & Akustik', discipline: 'Müzik', query: 'Caz' },
];

export const HeroSection: React.FC = () => {
  const { navigateTo, setFilters, listings, artists, ensembles, businesses, events, reviews } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('Tümü');
  const [selectedDiscipline, setSelectedDiscipline] = useState<ArtDiscipline | 'Tümü'>('Tümü');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      searchQuery: searchTerm.trim(),
      city: selectedCity,
      discipline: selectedDiscipline,
      specialty: 'Tümü',
      genre: 'Tümü',
      ensembleType: 'Tümü',
      instrument: 'Tümü',
    }));
    navigateTo('listings');
  };

  const handleQuickSearch = (topic: QuickTopic) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: topic.query,
      city: 'Tümü',
      discipline: topic.discipline,
      specialty: 'Tümü',
      genre: 'Tümü',
      ensembleType: 'Tümü',
      instrument: 'Tümü',
    }));
    navigateTo('listings');
  };

  const CITY_OPTIONS = CITY_LIST.map((city) => ({
    value: city,
    label: city === 'Tümü' ? 'Tüm Şehirler' : city,
  }));

  const DISCIPLINE_OPTIONS = ART_DISCIPLINES.map((discipline) => ({
    value: discipline,
    label: discipline === 'Tümü' ? 'Tüm Sanat Türleri' : discipline,
  }));

  const stats = useMemo(
    () =>
      computePlatformStats({
        artists,
        ensembles,
        businesses,
        listings,
        events,
        reviews,
      }),
    [artists, ensembles, businesses, listings, events, reviews]
  );

  return (
    <section className="relative pt-12 pb-14 lg:pt-16 lg:pb-18 overflow-hidden geo-grid border-b border-slate-200 dark:border-slate-800 bg-[#F9FAFC] dark:bg-[#0B1120] transition-colors">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Display Headline */}
        <motion.h1
          initial={{ opacity: 0.7, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          className="font-hero text-[1.7rem] sm:text-5xl lg:text-[3.35rem] font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-8 text-balance"
        >
          Her <span className="text-[#E45424] font-bold">Sanat</span>
          <br />
          Bir <span className="text-[#E45424] font-bold">Sahneyi</span> Hak Eder.
        </motion.h1>

        {/* Multidisciplinary Search Console */}
        <motion.div
          initial={{ opacity: 0.75, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          className="max-w-4xl mx-auto bg-white dark:bg-[#111A2E] p-3 sm:p-4 rounded-2xl shadow-lg shadow-slate-900/6 dark:shadow-black/40 border border-slate-200 dark:border-slate-800"
        >
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 text-left">
            <div className="sm:col-span-2 lg:col-span-4 p-2.5 sm:px-3 bg-slate-50 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-[#E45424] transition-colors">
              <label className="block text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-0.5">
                Ne Arıyorsunuz?
              </label>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#E45424] shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Heykel, Caz Trio, Sergi, Tiyatro..."
                  aria-label="Ne Arıyorsunuz?"
                  className="w-full bg-transparent border-0 p-0 text-xs font-medium text-slate-800 dark:text-white focus:outline-hidden placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="lg:col-span-3 p-2.5 sm:px-3 bg-slate-50 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-[#E45424] transition-colors">
              <label className="block text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-0.5">
                Şehir / Lokasyon
              </label>
              <CustomSelect
                variant="ghost"
                ariaLabel="Şehir / Lokasyon"
                value={selectedCity}
                onChange={setSelectedCity}
                options={CITY_OPTIONS}
                icon={<MapPin className="w-4 h-4 text-[#E45424]" />}
              />
            </div>

            <div className="lg:col-span-3 p-2.5 sm:px-3 bg-slate-50 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-[#E45424] transition-colors">
              <label className="block text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-0.5">
                Tür
              </label>
              <CustomSelect
                variant="ghost"
                ariaLabel="Sanat Türü"
                value={selectedDiscipline}
                onChange={(val) => setSelectedDiscipline(val as ArtDiscipline | 'Tümü')}
                options={DISCIPLINE_OPTIONS}
                icon={<Palette className="w-4 h-4 text-[#E45424]" />}
              />
            </div>

            <button
              type="submit"
              className="sm:col-span-2 lg:col-span-2 bg-[#E45424] hover:bg-[#c94317] text-white font-bold p-3 sm:p-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 text-sm cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Ara</span>
            </button>
          </form>

          {/* Editorial Quick Search Links (Multidisciplinary, Zero-Pill) */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 gap-y-1.5 text-xs">
            <span className="text-slate-400 dark:text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              Hızlı arama:
            </span>
            {QUICK_TOPICS.map((topic, idx) => (
              <React.Fragment key={topic.label}>
                {idx > 0 && (
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700 select-none">
                    ·
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleQuickSearch(topic)}
                  className="text-slate-600 dark:text-slate-300 hover:text-[#E45424] dark:hover:text-[#E45424] transition-colors text-[11px] font-medium cursor-pointer underline-offset-4 hover:underline"
                >
                  {topic.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* 5-Column Live Counter Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-10 max-w-4xl mx-auto pt-6 border-t border-slate-200/80 dark:border-slate-800/80 tabular-nums">
          <button
            type="button"
            onClick={() => navigateTo('artists_directory')}
            className="text-center group cursor-pointer rounded-xl py-1 transition-colors"
          >
            <div className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-[#E45424] transition-colors">
              <AnimatedCounter value={stats.artistCount} />
              <span className="text-[#E45424]">+</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Sanatçı
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('businesses_directory')}
            className="text-center group cursor-pointer rounded-xl py-1 transition-colors"
          >
            <div className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-[#E45424] transition-colors">
              <AnimatedCounter value={stats.businessCount} />
              <span className="text-[#E45424]">+</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              İşletme
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('listings')}
            className="text-center group cursor-pointer rounded-xl py-1 transition-colors"
          >
            <div className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-[#E45424] transition-colors">
              <AnimatedCounter value={stats.listingCount} />
              <span className="text-[#E45424]">+</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              İlan
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('events')}
            className="text-center group cursor-pointer rounded-xl py-1 transition-colors"
          >
            <div className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-[#E45424] transition-colors">
              <AnimatedCounter value={stats.eventCount} />
              <span className="text-[#E45424]">+</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Etkinlik
            </div>
          </button>

          <div className="col-span-2 sm:col-span-1 text-center py-1">
            <div
              className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-[#E45424]"
              title={`Ortalama ${stats.averageRating.toFixed(2)} / 5`}
            >
              <AnimatedCounter value={stats.satisfactionPercent} prefix="%" />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Memnuniyet
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
