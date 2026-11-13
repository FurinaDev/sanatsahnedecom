import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { selectRecommendedTalents } from '../utils/platformStats';
import {
  Star,
  ShieldCheck,
  MapPin,
  ChevronRight,
  ArrowRight,
  Users,
} from 'lucide-react';

export const RecommendationsStrip: React.FC = () => {
  const {
    artists,
    ensembles,
    navigateTo,
  } = useApp();

  const { items: recommendedTalents, totalRecommended } = useMemo(
    () => selectRecommendedTalents(artists, ensembles, 4),
    [artists, ensembles]
  );

  return (
    <section
      id="sanatcilar"
      className="py-14 bg-white dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 transition-colors text-left"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + See All Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="min-w-0">
            <span className="label-caps text-[#E45424]">
              Tavsiye Edilenler
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Sahneye Hazır Sanatçılar &amp; Topluluklar
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Değerlendirme puanı yüksek ve iptal sicili temiz doğrulanmış isimleri inceleyin.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('artists_directory', 'recommended')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E45424] hover:text-[#c94317] transition-colors self-start sm:self-auto cursor-pointer whitespace-nowrap"
          >
            <span>Tüm Tavsiye Edilenleri Gör ({totalRecommended})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4-Column Photographic Talent Grid */}
        {recommendedTalents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendedTalents.map((item) => (
              <article
                key={item.id}
                onClick={() =>
                  navigateTo(
                    item.kind === 'ensemble' ? 'ensemble_profile' : 'artist_profile',
                    item.id
                  )
                }
                className="group bg-white dark:bg-[#111A2E] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#E45424]/70 overflow-hidden shadow-xs hover:shadow-md transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Stage Visual Viewport */}
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img
                      src={item.coverUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />

                    {/* Top Labels (Opaque fast paint layers, zero blur lag) */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                      <span className="inline-flex items-center gap-1 bg-[#16274e] text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                        {item.kind === 'ensemble' && <Users className="w-3 h-3 text-orange-400" />}
                        <span>{item.badgeLabel}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 bg-slate-950/90 text-white text-xs font-bold px-2 py-0.5 rounded-md tabular-nums">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{item.ratingAvg.toFixed(2)}</span>
                      </span>
                    </div>

                    {/* Bottom Mini Avatar */}
                    <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-end">
                      <div className="w-9 h-9 rounded-lg overflow-hidden border-2 border-white shadow-sm bg-slate-800 shrink-0">
                        <img
                          src={item.avatarUrl}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Details with clean Zero-Pill metadata */}
                  <div className="p-4 space-y-1.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white truncate group-hover:text-[#E45424] transition-colors">
                          {item.name}
                        </h3>
                        {item.isVerified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs font-medium text-[#E45424] truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {item.city}
                        {item.district ? `, ${item.district}` : ''}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate pt-1">
                      {item.genres.slice(0, 2).join(' · ')}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs tabular-nums">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                    %{item.cancellationRate} İptal · {item.completedJobsCount} sahne
                  </span>
                  <span className="font-bold text-[#E45424] inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Profil</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-sm text-slate-500 dark:text-slate-400">
            Henüz tavsiye edilen sanatçı veya topluluk bulunamadı.
          </div>
        )}
      </div>
    </section>
  );
};
