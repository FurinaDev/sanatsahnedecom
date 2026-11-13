import React from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, ArrowRight, X } from 'lucide-react';

interface StatPill {
  label: string;
  value: string;
  accent?: 'white' | 'emerald' | 'orange';
}

interface ArchitecturalPageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  stats?: StatPill[];
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  searchButtonLabel?: string;
  onOpenMobileFilter?: () => void;
  actionSlot?: React.ReactNode;
}

export const ArchitecturalPageHeader: React.FC<ArchitecturalPageHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  stats = [],
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Anahtar kelime, tür, şehir ara...',
  searchButtonLabel = 'Ara',
  onOpenMobileFilter,
  actionSlot,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#16274e] via-[#13213e] to-[#0f1c38] border-b border-[#1e335a] py-7 sm:py-9 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <motion.div
        initial={{ opacity: 0.75, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 460, damping: 34 }}
        className="relative max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-5"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="label-caps text-[#ffb59e]">
              {eyebrow}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {stats.map((st, idx) => (
              <div
                key={idx}
                className="px-3.5 py-2 rounded-xl bg-[#1a2e5a] border border-white/15"
              >
                <span className="text-slate-300 block text-[10px] uppercase font-bold tracking-wider">
                  {st.label}
                </span>
                <span
                  className={`text-sm sm:text-base font-extrabold tabular-nums ${
                    st.accent === 'emerald'
                      ? 'text-emerald-300'
                      : st.accent === 'orange'
                      ? 'text-[#ffb59e]'
                      : 'text-white'
                  }`}
                >
                  {st.value}
                </span>
              </div>
            ))}
            {actionSlot}
          </div>
        </div>

        {onSearchChange !== undefined && (
          <form
            onSubmit={(e) => e.preventDefault()}
            className="bg-white dark:bg-[#13213e] border border-white/15 dark:border-[#1e335a] rounded-xl shadow-lg p-1.5 sm:p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm bg-transparent text-[#0f172a] dark:text-white placeholder-slate-400 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 text-slate-400 hover:text-[#f25922] p-1 cursor-pointer"
                  aria-label="Aramayı temizle"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onOpenMobileFilter && (
                <button
                  type="button"
                  onClick={onOpenMobileFilter}
                  className="lg:hidden flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#f8fafc] dark:bg-[#0f1c38] text-[#16274e] dark:text-white border border-[#e2e8f0] dark:border-[#1e335a] text-xs font-bold cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#f25922]" />
                  <span>Filtrele</span>
                </button>
              )}

              <button
                type="submit"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#f25922] hover:bg-[#d94b18] text-white text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{searchButtonLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </section>
  );
};
