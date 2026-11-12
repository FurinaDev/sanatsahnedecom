import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Star,
  Calendar,
  MapPin,
  Music2,
  Award,
  AlertCircle,
  Play,
  FileText,
  ExternalLink,
  ChevronLeft,
  Volume2,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

interface Props {
  artistId?: string;
  onBack: () => void;
}

export const ArtistProfileView: React.FC<Props> = ({ artistId = 'artist_efe_ozkan', onBack }) => {
  const { artists, reviews, navigateTo } = useApp();
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'audio'>('video');
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  const artist = artists.find((a) => a.id === artistId) || artists[0];
  const artistReviews = reviews.filter((r) => r.targetId === artist.id || r.targetId === artist.userId);

  return (
    <div className="space-y-6 text-left">
      {/* Breadcrumb / Back button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Geri Dön</span>
        </button>

        {/* Canonical URL Tag (Section 4 Requirement) */}
        <div className="text-xs font-mono text-stone-400 bg-stone-100 px-2.5 py-1 rounded-md">
          /sanatci/{artist.slug}
        </div>
      </div>

      {/* Profile Cover & Header */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        {/* Cover Photo */}
        <div className="h-48 sm:h-64 bg-stone-900 relative overflow-hidden">
          {artist.coverUrl && (
            <img
              src={artist.coverUrl}
              alt={artist.fullName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-70"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
        </div>

        {/* Profile Card Header Info */}
        <div className="px-6 sm:px-8 pb-8 pt-4 relative bg-white">
          {/* Top row: Avatar on left, Action buttons on right */}
          <div className="flex items-end justify-between -mt-16 sm:-mt-20 mb-4">
            <div className="relative shrink-0">
              <img
                src={artist.avatarUrl}
                alt={artist.fullName}
                referrerPolicy="no-referrer"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-xl bg-stone-100"
              />
              {artist.isVerified && (
                <div
                  className="absolute bottom-1 right-1 bg-emerald-600 text-white p-1.5 rounded-lg shadow-md border-2 border-white"
                  title="Doğrulanmış Sanatçı"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Quick Actions (e.g. Edit Profile if owner) */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => navigateTo('profile_edit')}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <span>Profili Düzenle</span>
              </button>
            </div>
          </div>

          {/* Details Row: Name, Title & Location on Left, Metrics Scoreboard on Right */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">{artist.fullName}</h1>
                {artist.stageName && artist.stageName !== artist.fullName && (
                  <span className="text-sm text-stone-400 font-serif italic">({artist.stageName})</span>
                )}
                {artist.isRecommended && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    Tavsiye Edilen Sanatçı
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-amber-800">{artist.title}</div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{artist.city}, {artist.district}</span>
                <span aria-hidden="true">·</span>
                <span>{artist.experienceYears} Yıllık Sahne Deneyimi</span>
              </div>
            </div>

            {/* Performance & Cancellation Scoreboard (Strictly inside white container) */}
            <div className="grid grid-cols-3 gap-4 text-center sm:text-right bg-stone-50 p-4 rounded-xl border border-stone-200/80 shadow-2xs self-start lg:self-auto">
              {/* Rating */}
              <div className="space-y-0.5">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">
                  Değerlendirme
                </div>
                <div className="flex items-center justify-center sm:justify-end gap-1 font-bold text-stone-900 text-lg tabular-nums">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{artist.ratingAvg.toFixed(2)}</span>
                </div>
                <div className="text-[10px] text-stone-400">{artist.ratingCount} Yorum</div>
              </div>

              {/* Completed Jobs */}
              <div className="space-y-0.5 border-x border-stone-200/60 px-3">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">
                  Tamamlanan İş
                </div>
                <div className="font-bold text-stone-900 text-lg tabular-nums">
                  {artist.completedJobsCount}
                </div>
                <div className="text-[10px] text-stone-400">Konser / Dinleti</div>
              </div>

              {/* Cancellation Rate */}
              <div className="space-y-0.5">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">
                  İptal Oranı
                </div>
                <div
                  className={`font-bold text-lg tabular-nums ${
                    artist.cancellationRate === 0
                      ? 'text-emerald-700'
                      : artist.cancellationRate < 10
                      ? 'text-amber-700'
                      : 'text-rose-700'
                  }`}
                >
                  %{artist.cancellationRate}
                </div>
                <div className="text-[10px] text-stone-400">Şeffaf Sicil</div>
              </div>
            </div>
          </div>

          {/* Quick Instruments & Genres Tags */}
          <div className="mt-6 pt-6 border-t border-stone-100 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <span className="font-bold text-stone-800">Enstrümanlar:</span>
            {artist.instruments.map((inst) => (
              <span key={inst} className="text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md font-medium">
                {inst}
              </span>
            ))}
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="font-bold text-stone-800">Müzik Türleri:</span>
            {artist.genres.map((g) => (
              <span key={g} className="text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md font-medium">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Column: Biography, Media Recordings, Repertoire */}
        <div className="lg:col-span-8 space-y-8">
          {/* Biographies */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-900">Sanatçı Hakkında</h2>
            <p className="text-sm text-stone-700 font-medium leading-relaxed">{artist.bioShort}</p>
            <p className="text-xs text-stone-600 leading-relaxed pt-2">{artist.bioLong}</p>
          </div>

          {/* Media & Performance Recordings */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900">Ses ve Video Kayıtları</h2>
              <div className="flex gap-1 p-1 bg-stone-100 rounded-lg text-xs">
                <button
                  onClick={() => setActiveMediaTab('video')}
                  className={`px-3 py-1 font-medium rounded-md transition-colors ${
                    activeMediaTab === 'video' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
                  }`}
                >
                  Video Performans
                </button>
                <button
                  onClick={() => setActiveMediaTab('audio')}
                  className={`px-3 py-1 font-medium rounded-md transition-colors ${
                    activeMediaTab === 'audio' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
                  }`}
                >
                  Ses Kayıtları
                </button>
              </div>
            </div>

            {activeMediaTab === 'video' ? (
              <div className="space-y-4">
                {/* Embedded Video Mockup with Realistic Cultural Player */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-950 border border-stone-200 shadow-inner group">
                  <img
                    src="/src/assets/images/hero_culture_music_1794440056664.jpg"
                    alt="Piyano Canlı Performans"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-stone-950/40 flex items-center justify-center">
                    <button
                      onClick={() => alert('Doğrulanmış YouTube video akışı simülasyonu başlatıldı.')}
                      className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-stone-950 flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
                      aria-label="Videoyu Oynat"
                    >
                      <Play className="w-7 h-7 fill-stone-950 ml-1" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs bg-stone-900/80 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Chopin Nocturne Op. 9 No. 2 — Canlı Konser Kaydı</div>
                      <div className="text-[11px] text-stone-300">Borusan Müzik Evi Resitali (Steinway D-274)</div>
                    </div>
                    <span className="text-[11px] text-stone-400">4:20</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {artist.audioSamples.map((audio, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-stone-50 hover:bg-stone-100/80 rounded-xl border border-stone-100 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlayingAudio(isPlayingAudio === audio.title ? null : audio.title)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isPlayingAudio === audio.title ? 'bg-amber-800 text-white' : 'bg-white text-stone-800 shadow-sm'
                        }`}
                      >
                        {isPlayingAudio === audio.title ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                      </button>
                      <span className="font-medium text-stone-800">{audio.title}</span>
                    </div>
                    <span className="text-stone-400 tabular-nums">{audio.duration}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Repertoire Matrix */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-900">Repertuvar Seçkisi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {artist.repertoire.map((piece, i) => (
                <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-stone-700 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-800 shrink-0" />
                  <span>{piece}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Education, Verified Documents, Reviews */}
        <div className="lg:col-span-4 space-y-6">
          {/* Education & Experience Details */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Eğitim ve Akreditasyon</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-800">Eğitim Bilgisi</div>
                  <div className="text-stone-600 mt-0.5">{artist.education}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-stone-100">
                <Briefcase className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-800">Profesyonel Deneyim</div>
                  <div className="text-stone-600 mt-0.5">{artist.experienceYears} Yıl Aktif Sahne / Senfoni</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-stone-100">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-800">Doğrulama Durumu</div>
                  <div className="text-emerald-700 font-medium mt-0.5">Yönetici Tarafından Onaylandı</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('Sanatçının portfolyo CV dosyası güvenli olarak indirildi.')}
              className="w-full py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-stone-500" />
              <span>Sanatçı CV’sini İndir (PDF)</span>
            </button>
          </div>

          {/* Real Reviews from Completed Bookings */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">İşveren Değerlendirmeleri</h3>
              <span className="text-xs text-stone-400">({artistReviews.length})</span>
            </div>

            {artistReviews.length === 0 ? (
              <div className="text-xs text-stone-500 text-center py-4">
                Bu sanatçı için henüz yayınlanmış değerlendirme bulunmuyor.
              </div>
            ) : (
              <div className="space-y-3">
                {artistReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-800">{rev.reviewerName}</span>
                      <div className="flex items-center text-amber-500 text-[11px] font-bold">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span className="ml-1">{rev.scoreOverall}.0</span>
                      </div>
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed italic">"{rev.comment}"</p>
                    <div className="text-[10px] text-stone-400">{rev.createdAt.split('T')[0]}</div>
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
