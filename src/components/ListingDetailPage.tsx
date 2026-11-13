import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing } from '../types';
import { formatCurrencyTRY } from '../utils/businessLogic';
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Building,
  Music,
  Users,
  AlertTriangle,
  Send,
  Share2,
} from 'lucide-react';

interface Props {
  listingId?: string;
  onBack: () => void;
}

export const ListingDetailPage: React.FC<Props> = ({ listingId, onBack }) => {
  const {
    listings,
    currentUser,
    applyToListing,
    applications,
    artists,
    ensembles,
    navigateTo,
  } = useApp();

  const listing = listings.find((l) => l.id === listingId) || listings[0];

  const [applicantType, setApplicantType] = useState<'individual' | 'ensemble'>('individual');
  const [coverMessage, setCoverMessage] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [statusFeedback, setStatusFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const existingApplication = applications.find(
    (a) => a.listingId === listing.id && a.applicantUserId === currentUser.id
  );

  const currentEnsemble = ensembles.find((e) => e.leaderUserId === currentUser.id) || ensembles[0];
  const currentArtist = artists.find((a) => a.userId === currentUser.id) || artists[0];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverMessage.trim()) {
      setStatusFeedback({ type: 'error', message: 'Lütfen başvuru mesajınızı veya repertuvar notunuzu belirtiniz.' });
      return;
    }

    const membersToSubmit =
      applicantType === 'ensemble'
        ? selectedMembers.length > 0
          ? selectedMembers
          : currentEnsemble.members.map((m) => `${m.name} (${m.instrument})`)
        : undefined;

    const result = applyToListing(listing.id, coverMessage, applicantType, membersToSubmit);
    if (result.success) {
      setStatusFeedback({
        type: 'success',
        message: 'Başvurunuz başarıyla işletmeye iletildi. İlan sahibi başvurunuzu değerlendirerek dönüş yapacaktır.',
      });
    } else {
      setStatusFeedback({ type: 'error', message: result.error || 'Başvuru yapılamadı.' });
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Breadcrumb & Canonical URL Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#16274e] dark:text-[#ffb59e] hover:text-[#f25922] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>İlanlar Listesine Dön</span>
        </button>

        <div className="text-xs font-sans tabular-nums text-[#475569] dark:text-slate-300 bg-white dark:bg-[#13213e] border border-[#e2e8f0] dark:border-[#1e335a] px-3 py-1 rounded-lg elevation-card truncate max-w-full">
          /ilanlar/{listing.slug}
        </div>
      </div>

      {/* Urgent Replacement Banner */}
      {listing.isReplacement && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-[#f25922]/50 rounded-2xl flex items-start gap-3 elevation-card">
          <AlertTriangle className="w-5 h-5 text-[#f25922] shrink-0 mt-0.5" />
          <div>
            <h4 className="label-caps text-[#ad3300] dark:text-[#ffb59e]">
              Acil İkame Sanatçı İlanı (Öncelikli Başvuru)
            </h4>
            <p className="text-xs text-[#475569] dark:text-slate-300 mt-1">
              {listing.urgentReason || 'Önceki sanatçının son dakika mazereti nedeniyle ilan yeniden açılmıştır. Başvurular doğrudan değerlendirilmektedir.'}
            </p>
          </div>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Event Specifications & Description */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] elevation-card space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569] dark:text-slate-300">
                <span className="font-bold text-[#16274e] dark:text-white">{listing.businessName}</span>
                {listing.businessVerified && <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />}
                <span aria-hidden="true">·</span>
                <span>{listing.businessType}</span>
                <span aria-hidden="true">·</span>
                <span>{listing.city}, {listing.district}</span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white">
                {listing.title}
              </h1>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-[#e2e8f0] dark:border-[#1e335a] tabular-nums">
              <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] space-y-1">
                <div className="label-caps text-[#64748b] dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#f25922]" /> Tarih
                </div>
                <div className="font-display font-bold text-[#0f172a] dark:text-white">{listing.eventDate}</div>
                <div className="text-[11px] text-[#475569] dark:text-slate-300">{listing.startTime} - {listing.endTime}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] space-y-1">
                <div className="label-caps text-[#64748b] dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#16274e] dark:text-[#ffb59e]" /> Süre
                </div>
                <div className="font-display font-bold text-[#0f172a] dark:text-white">{listing.durationMins} Dakika</div>
                <div className="text-[11px] text-[#475569] dark:text-slate-300">Akustik Performans</div>
              </div>

              <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] space-y-1">
                <div className="label-caps text-[#64748b] dark:text-slate-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#4f46e5] dark:text-indigo-400" /> Kadro
                </div>
                <div className="font-display font-bold text-[#0f172a] dark:text-white">{listing.targetEnsembleType}</div>
                <div className="text-[11px] text-[#475569] dark:text-slate-300">{listing.performerCount} Sanatçı</div>
              </div>

              <div className="p-3 rounded-xl bg-[#f1f3ff] dark:bg-[#1e335a]/60 border border-[#dae2ff] dark:border-[#2a457a] space-y-1">
                <div className="label-caps text-[#16274e] dark:text-[#ffb59e] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#f25922]" /> Son Başvuru
                </div>
                <div className="font-display font-bold text-[#16274e] dark:text-white">{listing.applicationDeadline}</div>
                <div className="text-[11px] text-[#475569] dark:text-slate-300">Kapanış: 23:59</div>
              </div>
            </div>

            {/* Description & Requirements */}
            <div className="space-y-4 text-xs leading-relaxed text-[#0f172a] dark:text-slate-200">
              <div>
                <h3 className="font-display font-bold text-sm text-[#0f172a] dark:text-white mb-1">Etkinlik Açıklaması</h3>
                <p className="text-[#475569] dark:text-slate-300 leading-relaxed text-sm">{listing.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] rounded-xl space-y-1">
                  <span className="font-bold text-[#16274e] dark:text-[#ffb59e] block">Repertuvar Talebi:</span>
                  <p className="text-[#475569] dark:text-slate-300">{listing.repertoireExpectation}</p>
                </div>

                <div className="p-4 bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] rounded-xl space-y-1">
                  <span className="font-bold text-[#16274e] dark:text-[#ffb59e] block">Sahne &amp; Kıyafet Kuralları:</span>
                  <p className="text-[#475569] dark:text-slate-300">{listing.dressCode}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e2e8f0] dark:border-[#1e335a] flex flex-wrap gap-4 text-xs text-[#475569] dark:text-slate-300">
                <div className="flex items-center gap-1.5 font-medium text-[#0f172a] dark:text-slate-200">
                  <CheckCircle2 className={`w-4 h-4 ${listing.soundSystemProvided ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'}`} />
                  <span>Ses Sistemi Mekânda Mevcut</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-[#0f172a] dark:text-slate-200">
                  <CheckCircle2 className={`w-4 h-4 ${listing.transportationProvided ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'}`} />
                  <span>Ulaşım Sağlanıyor</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-[#0f172a] dark:text-slate-200">
                  <CheckCircle2 className={`w-4 h-4 ${listing.accommodationProvided ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'}`} />
                  <span>Konaklama Sağlanıyor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dedicated Application Box */}
          <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] elevation-card space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#e2e8f0] dark:border-[#1e335a]">
              <div>
                <h2 className="font-display text-base font-bold text-[#0f172a] dark:text-white">Bu İlana Başvur</h2>
                <p className="text-xs text-[#475569] dark:text-slate-300">Sabit bütçe ve belirtilen repertuvar şartlarıyla başvuru yapın</p>
              </div>
              <span className="px-3 py-1 rounded-md bg-orange-50 dark:bg-[#f25922]/15 text-[#ad3300] dark:text-[#ffb59e] text-xs font-bold tabular-nums">
                Sabit Hakediş: {formatCurrencyTRY(listing.budgetAmount)}
              </span>
            </div>

            {existingApplication ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-300">Başvurunuz Başarıyla İletildi</h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 mt-0.5">
                    Bu ilana başvurunuz işveren paneline aktarılmıştır. Durumunuzu yönetim panelinizden takip edebilirsiniz.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                {statusFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium ${
                      statusFeedback.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {statusFeedback.message}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1 bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] rounded-xl">
                  <button
                    type="button"
                    onClick={() => setApplicantType('individual')}
                    className={`py-2.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      applicantType === 'individual'
                        ? 'bg-[#16274e] dark:bg-[#f25922] text-white shadow-xs'
                        : 'text-[#475569] dark:text-slate-300 hover:text-[#0f172a] dark:hover:text-white'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>Bireysel Sanatçı Olarak</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setApplicantType('ensemble')}
                    className={`py-2.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      applicantType === 'ensemble'
                        ? 'bg-[#16274e] dark:bg-[#f25922] text-white shadow-xs'
                        : 'text-[#475569] dark:text-slate-300 hover:text-[#0f172a] dark:hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Topluluk / Kolektif Adına</span>
                  </button>
                </div>

                {applicantType === 'individual' ? (
                  <div className="p-3 bg-[#f8fafc] dark:bg-[#0f1c38] rounded-xl text-xs text-[#475569] dark:text-slate-300 flex items-center gap-3 border border-[#e2e8f0] dark:border-[#1e335a]">
                    <img
                      src={currentArtist.avatarUrl}
                      alt={currentArtist.fullName}
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <span className="font-bold text-[#0f172a] dark:text-white">{currentArtist.fullName}</span> ({currentArtist.primaryInstrument}) profiliyle başvurulacaktır.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-[#f8fafc] dark:bg-[#0f1c38] rounded-xl text-xs space-y-1 border border-[#e2e8f0] dark:border-[#1e335a]">
                    <div className="font-bold text-[#0f172a] dark:text-white">{currentEnsemble.name} ({currentEnsemble.ensembleType})</div>
                    <div className="text-[11px] text-[#475569] dark:text-slate-300">
                      Topluluk Kadrosu: {currentEnsemble.members.map((m) => m.name).join(', ')}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-[#0f172a] dark:text-slate-200 block mb-1">
                    İşverene Notunuz &amp; Repertuvar Uyumu
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={coverMessage}
                    onChange={(e) => setCoverMessage(e.target.value)}
                    placeholder="İlan koşullarını ve sahne saatini inceledim. Belirtilen repertuvar talebine tam uyumlu programımızla yer alabiliriz..."
                    className="w-full text-xs p-3.5 bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] text-[#0f172a] dark:text-white rounded-xl focus:outline-hidden focus:border-[#f25922]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-[#475569] dark:text-slate-300">
                    İşveren profilinizi, video kayıtlarınızı ve iptal oranınızı inceleyecektir.
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-display font-bold text-white bg-[#f25922] hover:bg-[#d94b18] rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span>Başvuruyu Tamamla</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Sidebar: Fixed Budget & Business Profile */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#13213e] p-6 rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] elevation-card space-y-3">
            <div className="label-caps text-[#64748b] dark:text-slate-400">
              Sabit Sanatçı Hakedişi
            </div>
            <div className="font-display text-3xl font-extrabold text-[#0f172a] dark:text-white tabular-nums">
              {formatCurrencyTRY(listing.budgetAmount)}
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
              Net Tutar · İcracıdan Komisyon Kesintisi Yok
            </p>
            <div className="pt-3 border-t border-[#e2e8f0] dark:border-[#1e335a] text-xs text-[#475569] dark:text-slate-300 leading-relaxed">
              Ödeme etkinlik öncesinde işveren tarafından korumalı havuzda güvenceye alınır. Hizmet tamamlandığında hesabınıza aktarılır.
            </div>
          </div>

          <div className="bg-white dark:bg-[#13213e] p-6 rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] elevation-card space-y-4">
            <h3 className="label-caps text-[#64748b] dark:text-slate-400">İşveren Bilgileri</h3>
            <div className="flex items-center gap-3">
              <img
                src={listing.businessLogo}
                alt={listing.businessName}
                className="w-12 h-12 rounded-xl object-cover border border-[#e2e8f0] dark:border-[#1e335a] shrink-0"
              />
              <div>
                <div className="text-sm font-display font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
                  <span>{listing.businessName}</span>
                  {listing.businessVerified && <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                </div>
                <div className="text-xs text-[#ad3300] dark:text-[#ffb59e] font-semibold">{listing.businessType}</div>
              </div>
            </div>

            <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed">
              {listing.venueName}, {listing.city}
            </p>

            <button
              type="button"
              onClick={() => navigateTo('business_profile', listing.businessId)}
              className="w-full py-2.5 text-xs font-display font-bold text-[#16274e] dark:text-white bg-[#f1f3ff] dark:bg-[#0f1c38] hover:bg-[#e1e8fd] dark:hover:bg-[#1e335a] border border-transparent dark:border-[#1e335a] rounded-xl transition-colors cursor-pointer"
            >
              İşletme Profilini Görüntüle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
