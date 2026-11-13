import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Star,
  Users,
  MapPin,
  Calendar,
  Award,
  ChevronLeft,
  Music2,
  Play,
  HeartHandshake,
} from 'lucide-react';

interface Props {
  ensembleId?: string;
  onBack: () => void;
}

export const EnsembleProfileView: React.FC<Props> = ({
  ensembleId = 'ensemble_istanbul_string_trio',
  onBack,
}) => {
  const { ensembles, reviews } = useApp();
  const ensemble = ensembles.find((e) => e.id === ensembleId) || ensembles[0];
  const ensembleReviews = reviews.filter((r) => r.targetId === ensemble.id);

  return (
    <div className="space-y-6 text-left">
      {/* Navigation header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#16274e] dark:text-slate-200 hover:text-[#f25922] dark:hover:text-[#f25922] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Geri Dön</span>
        </button>

        <div className="text-xs font-sans tabular-nums text-[#475569] dark:text-slate-300 bg-white dark:bg-[#13213e] border border-[#e2e8f0] dark:border-[#1e335a] px-3 py-1 rounded-lg shadow-xs">
          /ensemble/{ensemble.slug}
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white dark:bg-[#13213e] rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] overflow-hidden shadow-xs">
        <div className="h-48 sm:h-64 bg-[#0f1c38] relative">
          {ensemble.coverUrl && (
            <img
              src={ensemble.coverUrl}
              alt={ensemble.name}
              className="w-full h-full object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/85 via-[#0f172a]/25 to-transparent" />
        </div>

        <div className="px-5 sm:px-8 pb-8 pt-4 relative bg-white dark:bg-[#13213e]">
          <div className="flex items-end justify-between -mt-16 sm:-mt-20 mb-4">
            <div className="relative shrink-0">
              <img
                src={ensemble.avatarUrl}
                alt={ensemble.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white dark:border-[#13213e] shadow-xl bg-[#f8fafc] dark:bg-[#0f1c38]"
              />
              {ensemble.isVerified && (
                <div className="absolute bottom-1 right-1 bg-emerald-600 text-white p-1.5 rounded-lg shadow-md border-2 border-white dark:border-[#13213e]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white tracking-[-0.02em]">
                  {ensemble.name}
                </h1>
                {ensemble.isRecommended && (
                  <span className="text-[11px] font-bold text-white bg-[#f25922] px-2.5 py-0.5 rounded-md">
                    Öne Çıkan Topluluk
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-[#f25922]">
                {ensemble.ensembleType} · Kuruluş: {ensemble.foundedYear}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569] dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-[#64748b] dark:text-slate-400" />
                <span>{ensemble.city} Merkezli</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{ensemble.members.length} Aktif Üye</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 text-center sm:text-right bg-[#f8fafc] dark:bg-[#0f1c38] p-4 rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] self-stretch sm:self-start lg:self-auto tabular-nums">
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] dark:text-slate-400">Puan</div>
                <div className="flex items-center justify-center sm:justify-end gap-1 font-display font-extrabold text-[#0f172a] dark:text-white text-lg">
                  <Star className="w-4 h-4 text-[#f25922] fill-[#f25922]" />
                  <span>{ensemble.ratingAvg.toFixed(2)}</span>
                </div>
                <div className="text-[10px] text-[#64748b] dark:text-slate-400">{ensemble.ratingCount} Değerlendirme</div>
              </div>

              <div className="space-y-0.5 border-x border-[#e2e8f0] dark:border-[#1e335a] px-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] dark:text-slate-400">İş Sayısı</div>
                <div className="font-display font-extrabold text-[#0f172a] dark:text-white text-lg">{ensemble.completedJobsCount}</div>
                <div className="text-[10px] text-[#64748b] dark:text-slate-400">Konser</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] dark:text-slate-400">İptal Oranı</div>
                <div className="font-display font-extrabold text-lg text-emerald-600 dark:text-emerald-400">%{ensemble.cancellationRate}</div>
                <div className="text-[10px] text-[#64748b] dark:text-slate-400">Güvenilir</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Members & Repertoire */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-3">
            <h2 className="font-display text-base font-bold text-[#0f172a] dark:text-white">Topluluk Hakkında</h2>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 leading-relaxed">{ensemble.bio}</p>
          </div>

          <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-4">
            <h2 className="font-display text-base font-bold text-[#0f172a] dark:text-white flex items-center justify-between gap-2">
              <span>Topluluk Üyeleri ve Kadro</span>
              <span className="text-xs text-[#64748b] dark:text-slate-400 font-normal tabular-nums">({ensemble.members.length} Sanatçı)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ensemble.members.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] flex items-center gap-3"
                >
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#e2e8f0] dark:border-[#1e335a]"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-bold text-[#0f172a] dark:text-white truncate">{member.name}</div>
                    <div className="text-[11px] font-semibold text-[#f25922] truncate">{member.instrument}</div>
                    <div className="text-[10px] text-[#64748b] dark:text-slate-400 truncate">{member.roleTitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-4">
            <h2 className="font-display text-base font-bold text-[#0f172a] dark:text-white">Öne Çıkan Repertuvar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {ensemble.repertoire.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] text-[#0f172a] dark:text-slate-200 flex items-center gap-2">
                  <Music2 className="w-3.5 h-3.5 text-[#f25922] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#13213e] p-6 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-4">
            <h3 className="font-display text-sm font-bold text-[#0f172a] dark:text-white">Kurumsal Değerlendirmeler</h3>
            {ensembleReviews.length === 0 ? (
              <p className="text-xs text-[#475569] dark:text-slate-300">Henüz değerlendirme bulunmuyor.</p>
            ) : (
              <div className="space-y-3">
                {ensembleReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-[#0f1c38] text-xs space-y-1.5 border border-[#e2e8f0] dark:border-[#1e335a]">
                    <div className="flex items-center justify-between font-bold text-[#0f172a] dark:text-white">
                      <span>{rev.reviewerName}</span>
                      <div className="flex items-center text-[#f25922] tabular-nums">
                        <Star className="w-3 h-3 fill-[#f25922] mr-1" />
                        <span>{rev.scoreOverall}.0</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#475569] dark:text-slate-300 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
