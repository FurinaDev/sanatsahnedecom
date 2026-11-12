import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Star,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  MapPin,
  Building2,
  Users,
  Play,
  Pause,
  Volume2,
} from 'lucide-react';

export const RecommendationsStrip: React.FC = () => {
  const {
    artists,
    ensembles,
    businesses,
    recommendationPeriod,
    setRecommendationPeriod,
    navigateTo,
  } = useApp();
  const [playingArtistId, setPlayingArtistId] = useState<string | null>(null);

  // Filter recommendations based on period, rating >= 4.85 and low cancellation
  const recommendedArtists = artists.filter(
    (a) => a.isRecommended || (a.ratingAvg >= 4.9 && a.cancellationRate <= 2)
  );

  const recommendedBusinesses = businesses.filter((b) => b.isRecommended || b.isVerified);

  const toggleAudio = (e: React.MouseEvent, artistId: string) => {
    e.stopPropagation();
    setPlayingArtistId((prev) => (prev === artistId ? null : artistId));
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs text-left mb-8">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center border border-amber-200/60 shrink-0">
            <Award className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Öne Çıkan ve Tavsiye Edilenler
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Yüksek Güvenilirlik</span>
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              En yüksek değerlendirme puanına ve %0 iptal oranına sahip seçkin sanatçılar ve mekânlar.
            </p>
          </div>
        </div>

        {/* Weekly / Monthly Toggle */}
        <div className="flex items-center p-1 bg-stone-100 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setRecommendationPeriod('weekly')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              recommendationPeriod === 'weekly'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Haftalık Tavsiyeler
          </button>
          <button
            onClick={() => setRecommendationPeriod('monthly')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              recommendationPeriod === 'monthly'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Ayın Öne Çıkanları
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-6">
        {/* Recommended Artists */}
        {recommendedArtists.slice(0, 2).map((artist) => {
          const isPlaying = playingArtistId === artist.id;

          return (
            <div
              key={artist.id}
              onClick={() => navigateTo('artist_profile', artist.id)}
              className="group relative bg-stone-50/70 hover:bg-white rounded-2xl border border-stone-200/90 overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col justify-between"
            >
              {/* Card Photo Header */}
              <div className="relative aspect-16/10 w-full bg-stone-900 overflow-hidden">
                <img
                  src={artist.coverUrl || artist.avatarUrl}
                  alt={artist.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-2 z-10">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-950 bg-amber-400/95 backdrop-blur-md px-2 py-0.5 rounded-md shadow-xs">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{recommendationPeriod === 'weekly' ? 'Haftanın Tavsiyesi' : 'Ayın Sanatçısı'}</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-950 bg-emerald-300/95 backdrop-blur-md px-2 py-0.5 rounded-md shadow-xs">
                    %0 İptal Sicili
                  </span>
                </div>

                {/* Audio snippet play button */}
                <div className="absolute bottom-2.5 left-2.5 z-10">
                  <button
                    onClick={(e) => toggleAudio(e, artist.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md transition-all shadow-md ${
                      isPlaying
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-white/90 hover:bg-white text-stone-900'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3 h-3 fill-current" />
                        <span>Resital Dinleniyor</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>Örnek Dinle</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-start gap-3">
                  <img
                    src={artist.avatarUrl}
                    alt={artist.fullName}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-stone-900 text-sm truncate group-hover:text-amber-800 transition-colors">
                        {artist.fullName}
                      </h3>
                      {artist.isVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-amber-700 font-medium truncate">
                      {artist.title}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{artist.city}</span>
                      <span>·</span>
                      <span className="font-semibold text-stone-700">{artist.primaryInstrument}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {artist.bioShort}
                </p>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 bg-white/70 border-t border-stone-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-bold text-stone-900">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{artist.ratingAvg.toFixed(2)}</span>
                  <span className="text-[10px] text-stone-400 font-normal">
                    ({artist.completedJobsCount} konser)
                  </span>
                </div>
                <div className="text-xs font-semibold text-stone-800 group-hover:text-amber-800 flex items-center gap-1">
                  <span>Profili İncele</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-amber-600" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Recommended Venue / Business */}
        {recommendedBusinesses.slice(0, 1).map((biz) => (
          <div
            key={biz.id}
            onClick={() => navigateTo('business_profile', biz.id)}
            className="group relative bg-stone-50/70 hover:bg-white rounded-2xl border border-stone-200/90 overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col justify-between"
          >
            {/* Venue Photo Header */}
            <div className="relative aspect-16/10 w-full bg-stone-900 overflow-hidden">
              <img
                src={biz.coverUrl || biz.logoUrl}
                alt={biz.businessName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

              <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-2 z-10">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-900 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md shadow-xs">
                  <Building2 className="w-3 h-3 text-stone-700" />
                  <span>{recommendationPeriod === 'weekly' ? 'Haftanın Mekânı' : 'Seçkin İşveren'}</span>
                </span>
                <span className="text-[10px] font-semibold text-emerald-950 bg-emerald-300/95 backdrop-blur-md px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>Resmi Onaylı</span>
                </span>
              </div>
            </div>

            {/* Venue Body */}
            <div className="p-4 space-y-2.5">
              <div className="flex items-start gap-3">
                <img
                  src={biz.logoUrl}
                  alt={biz.businessName}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-stone-900 text-sm truncate group-hover:text-amber-800 transition-colors">
                    {biz.businessName}
                  </h3>
                  <div className="text-xs text-amber-700 font-medium truncate">
                    {biz.businessType}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{biz.city}, {biz.district}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {biz.description}
              </p>
            </div>

            {/* Venue Footer */}
            <div className="px-4 py-3 bg-white/70 border-t border-stone-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 font-bold text-stone-900">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{biz.ratingAvg.toFixed(2)}</span>
                <span className="text-[10px] text-stone-400 font-normal">
                  ({biz.completedBookingsCount} organizasyon)
                </span>
              </div>
              <div className="text-xs font-semibold text-stone-800 group-hover:text-amber-800 flex items-center gap-1">
                <span>İlanları ve Mekânı Gör</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-amber-600" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
