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
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Geri Dön</span>
        </button>

        <div className="text-xs font-mono text-stone-400 bg-stone-100 px-2.5 py-1 rounded-md">
          /ensemble/{ensemble.slug}
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="h-48 sm:h-64 bg-stone-900 relative">
          {ensemble.coverUrl && (
            <img
              src={ensemble.coverUrl}
              alt={ensemble.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-70"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
        </div>

        <div className="px-6 sm:px-8 pb-8 pt-4 relative bg-white">
          <div className="flex items-end justify-between -mt-16 sm:-mt-20 mb-4">
            <div className="relative shrink-0">
              <img
                src={ensemble.avatarUrl}
                alt={ensemble.name}
                referrerPolicy="no-referrer"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-xl bg-stone-100"
              />
              {ensemble.isVerified && (
                <div className="absolute bottom-1 right-1 bg-emerald-600 text-white p-1.5 rounded-lg shadow-md border-2 border-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">{ensemble.name}</h1>
                {ensemble.isRecommended && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    Tavsiye Edilen Topluluk
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-amber-800">
                {ensemble.ensembleType} · Kuruluş: {ensemble.foundedYear}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{ensemble.city} Merkezli</span>
                <span aria-hidden="true">·</span>
                <span>{ensemble.members.length} Aktif Üye</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 text-center sm:text-right bg-stone-50 p-4 rounded-xl border border-stone-200/80 shadow-2xs self-start lg:self-auto">
              <div className="space-y-0.5">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Puan</div>
                <div className="flex items-center justify-center sm:justify-end gap-1 font-bold text-stone-900 text-lg">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{ensemble.ratingAvg.toFixed(2)}</span>
                </div>
                <div className="text-[10px] text-stone-400">{ensemble.ratingCount} Değerlendirme</div>
              </div>

              <div className="space-y-0.5 border-x border-stone-200/60 px-3">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">İş Sayısı</div>
                <div className="font-bold text-stone-900 text-lg tabular-nums">{ensemble.completedJobsCount}</div>
                <div className="text-[10px] text-stone-400">Konser</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">İptal Oranı</div>
                <div className="font-bold text-lg text-emerald-700 tabular-nums">%{ensemble.cancellationRate}</div>
                <div className="text-[10px] text-stone-400">Güvenilir</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Members & Repertoire */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Topluluk Biyografisi */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-stone-900">Topluluk Hakkında</h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{ensemble.bio}</p>
          </div>

          {/* Kadro & Üyeler (Section 5 Requirement) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-900 flex items-center justify-between">
              <span>Topluluk Üyeleri ve Kadro</span>
              <span className="text-xs text-stone-400 font-normal">({ensemble.members.length} Sanatçı)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ensemble.members.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-3"
                >
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-900">{member.name}</div>
                    <div className="text-[11px] font-medium text-amber-800">{member.instrument}</div>
                    <div className="text-[10px] text-stone-400">{member.roleTitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Repertoire */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-900">Öne Çıkan Repertuvar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {ensemble.repertoire.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-stone-700 flex items-center gap-2">
                  <Music2 className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Reviews & Bookings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Kurumsal Değerlendirmeler</h3>
            {ensembleReviews.length === 0 ? (
              <p className="text-xs text-stone-500">Henüz değerlendirme bulunmuyor.</p>
            ) : (
              <div className="space-y-3">
                {ensembleReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-stone-50 text-xs space-y-1.5 border border-stone-100">
                    <div className="flex items-center justify-between font-semibold text-stone-800">
                      <span>{rev.reviewerName}</span>
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500 mr-1" />
                        <span>{rev.scoreOverall}.0</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-600 italic">"{rev.comment}"</p>
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
