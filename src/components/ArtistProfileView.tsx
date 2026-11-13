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
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [cvFeedback, setCvFeedback] = useState(false);

  const artist = artists.find((a) => a.id === artistId) || artists[0];
  const artistReviews = reviews.filter((r) => r.targetId === artist.id || r.targetId === artist.userId);

  return (
    <div className="space-y-6 text-left">
      {/* Breadcrumb / Back button */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#16274e] dark:text-[#ffb59e] hover:text-[#f25922] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Geri Dön</span>
        </button>

        <div className="text-xs font-sans tabular-nums text-[#475569] dark:text-slate-300 bg-white dark:bg-[#13213e] border border-[#e2e8f0] dark:border-[#1e335a] px-3 py-1 rounded-lg elevation-card">
          /sanatci/{artist.slug}
        </div>
      </div>

      {/* Profile Cover & Header */}
      <div className="bg-white dark:bg-[#13213e] rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] overflow-hidden elevation-card">
        <div className="h-48 sm:h-64 bg-[#12161b] relative overflow-hidden">
          {artist.coverUrl && (
            <img
              src={artist.coverUrl}
              alt={artist.fullName}
              className="w-full h-full object-cover object-center opacity-75"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141b2b]/85 via-[#141b2b]/25 to-transparent" />
        </div>

        <div className="px-6 sm:px-8 pb-8 pt-4 relative bg-white dark:bg-[#13213e]">
          <div className="flex items-end justify-between -mt-16 sm:-mt-20 mb-4">
            <div className="relative shrink-0">
              <img
                src={artist.avatarUrl}
                alt={artist.fullName}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white dark:border-[#13213e] shadow-xl bg-[#f8fafc]"
              />
              {artist.isVerified && (
                <div
                  className="absolute bottom-1 right-1 bg-emerald-600 text-white p-1.5 rounded-lg shadow-md border-2 border-white dark:border-[#13213e]"
                  title="Doğrulanmış Sanatçı"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigateTo('profile_edit')}
                className="px-4 py-2 bg-[#16274e] dark:bg-[#f25922] hover:bg-[#111d38] dark:hover:bg-[#d94b18] text-white rounded-xl text-xs font-display font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Profili Düzenle</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white tracking-[-0.02em]">
                  {artist.fullName}
                </h1>
                {artist.stageName && artist.stageName !== artist.fullName && (
                  <span className="text-sm text-[#64748b] dark:text-slate-400 italic">({artist.stageName})</span>
                )}
                {artist.isRecommended && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#f25922] px-2.5 py-0.5 rounded-md">
                    Tavsiye Edilen
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-[#ad3300] dark:text-[#ffb59e]">{artist.title}</div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569] dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-[#64748b] dark:text-slate-400" />
                <span>{artist.city}, {artist.district}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{artist.experienceYears} Yıllık Sahne Deneyimi</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center sm:text-right bg-[#f8fafc] dark:bg-[#0f1c38] p-4 rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] self-stretch sm:self-start lg:self-auto">
              <div className="space-y-0.5">
                <div className="label-caps text-[#64748b] dark:text-slate-400">
                  Değerlendirme
                </div>
                <div className="flex items-center justify-center sm:justify-end gap-1 font-display font-extrabold text-[#0f172a] dark:text-white text-lg tabular-nums">
                  <Star className="w-4 h-4 text-[#f25922] fill-[#f25922]" />
                  <span>{artist.ratingAvg.toFixed(2)}</span>
                </div>
                <div className="text-[10px] text-[#64748b] dark:text-slate-400 tabular-nums">{artist.ratingCount} Yorum</div>
              </div>

              <div className="space-y-0.5 border-x border-[#e2e8f0] dark:border-[#1e335a] px-2 sm:px-3">
                <div className="label-caps text-[#64748b] dark:text-slate-400">
                  Tamamlanan
                </div>
                <div className="font-display font-extrabold text-[#0f172a] dark:text-white text-lg tabular-nums">
                  {artist.completedJobsCount}
                </div>
                <div className="text-[10px] text-[#64748b] dark:text-slate-400">Proje</div>
              </div>

              <div className="space-y-0.5">
                <div className="label-caps text-[#64748b] dark:text-slate-400">
                  İptal Oranı
                </div>
                <div
                  className={`font-display font-extrabold text-lg tabular-nums ${
                    artist.cancellationRate === 0
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : artist.cancellationRate < 10
                      ? 'text-[#f25922]'
                      : 'text-[#ba1a1a]'
                  }`}
                >
                  %{artist.cancellationRate}
                </div>
                <div className="text-[10px] text-[#64748b] dark:text-slate-400">Şeffaf Sicil</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#e2e8f0] dark:border-[#1e335a] flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
            <span className="font-bold text-[#0f172a] dark:text-white">Uzmanlık / Enstrüman:</span>
            {artist.instruments.map((inst) => (
              <span key={inst} className="font-semibold text-[#16274e] dark:text-slate-200 bg-[#f1f3ff] dark:bg-[#0f1c38] px-2.5 py-1 rounded-md border border-[#e2e8f0] dark:border-[#1e335a]">
                {inst}
              </span>
            ))}
            <span aria-hidden="true" className="text-[#cbd5e1] dark:text-slate-600">·</span>
            <span className="font-bold text-[#0f172a] dark:text-white">Türler:</span>
            {artist.genres.map((g) => (
              <span key={g} className="font-semibold text-[#ad3300] dark:text-[#ffb59e] bg-orange-50 dark:bg-[#f25922]/15 px-2.5 py-1 rounded-md">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] elevation-card space-y-3">
            <h2 className="font-display text-base font-bold text-[#0f172a] dark:text-white">Sanatçı Hakkında</h2>
            <p className="text-sm text-[#0f172a] dark:text-slate-200 font-medium leading-relaxed">{artist.bioShort}</p>
            <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed pt-1">{artist.bioLong}</p>
          </div>

          <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] elevation-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#e2e8f0] dark:border-[#1e335a]">
              <h2 className="font-display text-base font-bold text-[#0f172a] dark:text-white">Ses ve Video Kayıtları</h2>
              <div className="flex gap-1 p-1 bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('video')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeMediaTab === 'video' ? 'bg-[#16274e] dark:bg-[#f25922] text-white' : 'text-[#475569] dark:text-slate-300'
                  }`}
                >
                  Video Performans
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('audio')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeMediaTab === 'audio' ? 'bg-[#16274e] dark:bg-[#f25922] text-white' : 'text-[#475569] dark:text-slate-300'
                  }`}
                >
                  Ses Kayıtları
                </button>
              </div>
            </div>

            {activeMediaTab === 'video' ? (
              <div className="space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#12161b] border border-[#e2e8f0] dark:border-[#1e335a] shadow-inner group">
                  <img
                    src="/src/assets/images/hero_culture_music_1794440056664.jpg"
                    alt="Canlı Performans"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-[#141b2b]/40 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setVideoPlaying(!videoPlaying)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 cursor-pointer ${
                        videoPlaying ? 'bg-[#f25922] text-white' : 'bg-white hover:bg-slate-50 text-[#141b2b]'
                      }`}
                      aria-label="Videoyu Oynat"
                    >
                      <Play className="w-7 h-7 fill-current ml-1" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs bg-[#141b2b]/95 p-3.5 rounded-xl border border-white/15 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-display font-bold truncate">
                        {videoPlaying ? 'Oynatılıyor: ' : ''}Chopin Nocturne Op. 9 No. 2 — Canlı Konser Kaydı
                      </div>
                      <div className="text-[11px] text-[#b6c5f6] truncate">Borusan Müzik Evi Resitali (Steinway D-274)</div>
                    </div>
                    <span className="text-[11px] text-[#ffb59e] font-bold tabular-nums shrink-0">4:20</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {artist.audioSamples.map((audio, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#f8fafc] dark:bg-[#0f1c38] hover:bg-[#f1f3ff] dark:hover:bg-[#1e335a]/60 rounded-xl border border-[#e2e8f0] dark:border-[#1e335a] flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => setIsPlayingAudio(isPlayingAudio === audio.title ? null : audio.title)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                          isPlayingAudio === audio.title ? 'bg-[#fbbf24] text-[#141b2b]' : 'bg-white dark:bg-[#13213e] text-[#16274e] dark:text-white shadow-sm'
                        }`}
                      >
                        {isPlayingAudio === audio.title ? (
                          <span className="inline-flex items-end gap-[2px] h-3.5" aria-hidden="true">
                            <span className="w-[2.5px] h-full bg-[#141b2b] rounded-full eq-bar-1" />
                            <span className="w-[2.5px] h-full bg-[#141b2b] rounded-full eq-bar-2" />
                            <span className="w-[2.5px] h-full bg-[#141b2b] rounded-full eq-bar-3" />
                          </span>
                        ) : (
                          <Play className="w-3.5 h-3.5 ml-0.5 text-[#f25922] fill-[#f25922]" />
                        )}
                      </button>
                      <span className="font-semibold text-[#0f172a] dark:text-white truncate">{audio.title}</span>
                    </div>
                    <span className="text-[#64748b] dark:text-slate-400 tabular-nums shrink-0">{audio.duration}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] elevation-card space-y-4">
            <h2 className="font-display text-base font-bold text-[#0f172a] dark:text-white">Repertuvar &amp; Seçki</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {artist.repertoire.map((piece, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] text-[#0f172a] dark:text-slate-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f25922] shrink-0" />
                  <span>{piece}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#13213e] p-6 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] elevation-card space-y-4">
            <h3 className="font-display text-sm font-bold text-[#0f172a] dark:text-white">Eğitim ve Akreditasyon</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-[#16274e] dark:text-[#ffb59e] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#0f172a] dark:text-white">Eğitim Bilgisi</div>
                  <div className="text-[#475569] dark:text-slate-300 mt-0.5">{artist.education}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-[#e2e8f0] dark:border-[#1e335a]">
                <Briefcase className="w-4 h-4 text-[#f25922] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#0f172a] dark:text-white">Profesyonel Deneyim</div>
                  <div className="text-[#475569] dark:text-slate-300 mt-0.5 tabular-nums">{artist.experienceYears} Yıl Aktif Sahne &amp; Kültür Üretimi</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-[#e2e8f0] dark:border-[#1e335a]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#0f172a] dark:text-white">Doğrulama Durumu</div>
                  <div className="text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">Yönetici Tarafından Onaylandı</div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setCvFeedback(true);
                setTimeout(() => setCvFeedback(false), 3000);
              }}
              className="w-full py-2.5 text-xs font-display font-bold text-[#16274e] dark:text-white bg-[#f1f3ff] dark:bg-[#0f1c38] hover:bg-[#e1e8fd] dark:hover:bg-[#1e335a] border border-transparent dark:border-[#1e335a] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#16274e] dark:text-[#ffb59e]" />
              <span>{cvFeedback ? 'Portfolyo CV Hazırlandı' : 'Sanatçı CV’sini İndir (PDF)'}</span>
            </button>
          </div>

          <div className="bg-white dark:bg-[#13213e] p-6 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] elevation-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-[#0f172a] dark:text-white">İşveren Değerlendirmeleri</h3>
              <span className="text-xs text-[#64748b] dark:text-slate-400 tabular-nums">({artistReviews.length})</span>
            </div>

            {artistReviews.length === 0 ? (
              <div className="text-xs text-[#475569] dark:text-slate-300 text-center py-4">
                Bu sanatçı için henüz yayınlanmış değerlendirme bulunmuyor.
              </div>
            ) : (
              <div className="space-y-3">
                {artistReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0f172a] dark:text-white">{rev.reviewerName}</span>
                      <div className="flex items-center text-[#f25922] text-[11px] font-bold tabular-nums">
                        <Star className="w-3 h-3 fill-[#f25922]" />
                        <span className="ml-1">{rev.scoreOverall}.0</span>
                      </div>
                    </div>
                    <p className="text-[#475569] dark:text-slate-300 text-[11px] leading-relaxed italic">&quot;{rev.comment}&quot;</p>
                    <div className="text-[10px] text-[#64748b] dark:text-slate-400 tabular-nums">{rev.createdAt.split('T')[0]}</div>
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
