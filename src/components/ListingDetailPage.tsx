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
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-950 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>İlanlar Listesine Dön</span>
        </button>

        <div className="text-xs font-mono text-[#5e5e5e] bg-white border border-[#e0dfdc] px-3 py-1 rounded-md shadow-sm">
          /ilanlar/{listing.slug}
        </div>
      </div>

      {/* Urgent Replacement Banner */}
      {listing.isReplacement && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Acil İkame Sanatçı İlanı (Öncelikli Başvuru)
            </h4>
            <p className="text-xs text-amber-800 mt-0.5">
              {listing.urgentReason || 'Önceki sanatçının son dakika mazereti nedeniyle ilan yeniden açılmıştır. Başvurular doğrudan değerlendirilmektedir.'}
            </p>
          </div>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Event Specifications & Description */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e0dfdc] shadow-sm space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#5e5e5e]">
                <span className="font-semibold text-[#191919]">{listing.businessName}</span>
                {listing.businessVerified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                <span aria-hidden="true">·</span>
                <span>{listing.businessType}</span>
                <span aria-hidden="true">·</span>
                <span>{listing.city}, {listing.district}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#191919]">
                {listing.title}
              </h1>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-[#e0dfdc]">
              <div className="p-3 rounded-xl bg-[#f4f2ee] space-y-1">
                <div className="text-[#5e5e5e] flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" /> Tarih
                </div>
                <div className="font-bold text-[#191919]">{listing.eventDate}</div>
                <div className="text-[11px] text-[#5e5e5e]">{listing.startTime} - {listing.endTime}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#f4f2ee] space-y-1">
                <div className="text-[#5e5e5e] flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" /> Süre
                </div>
                <div className="font-bold text-[#191919]">{listing.durationMins} Dakika</div>
                <div className="text-[11px] text-[#5e5e5e]">Akustik Performans</div>
              </div>

              <div className="p-3 rounded-xl bg-[#f4f2ee] space-y-1">
                <div className="text-[#5e5e5e] flex items-center gap-1 font-medium">
                  <Users className="w-3.5 h-3.5" /> Kadro
                </div>
                <div className="font-bold text-[#191919]">{listing.targetEnsembleType}</div>
                <div className="text-[11px] text-[#5e5e5e]">{listing.performerCount} Sanatçı</div>
              </div>

              <div className="p-3 rounded-xl bg-[#f4f2ee] space-y-1">
                <div className="text-[#5e5e5e] flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" /> Son Başvuru
                </div>
                <div className="font-bold text-[#0a66c2]">{listing.applicationDeadline}</div>
                <div className="text-[11px] text-[#5e5e5e]">Kapanış: 23:59</div>
              </div>
            </div>

            {/* Description & Requirements */}
            <div className="space-y-4 text-xs leading-relaxed text-[#191919]">
              <div>
                <h3 className="font-bold text-sm text-[#191919] mb-1">Etkinlik Açıklaması</h3>
                <p className="text-[#5e5e5e] leading-relaxed text-sm">{listing.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#f4f2ee] rounded-xl space-y-1">
                  <span className="font-bold text-[#191919] block">Repertuvar Talebi:</span>
                  <p className="text-[#5e5e5e]">{listing.repertoireExpectation}</p>
                </div>

                <div className="p-4 bg-[#f4f2ee] rounded-xl space-y-1">
                  <span className="font-bold text-[#191919] block">Sahne & Kıyafet Kuralları:</span>
                  <p className="text-[#5e5e5e]">{listing.dressCode}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e0dfdc] flex flex-wrap gap-4 text-xs text-[#5e5e5e]">
                <div className="flex items-center gap-1.5 font-medium text-[#191919]">
                  <CheckCircle2 className={`w-4 h-4 ${listing.soundSystemProvided ? 'text-emerald-600' : 'text-stone-300'}`} />
                  <span>Ses Sistemi Mekânda Mevcut</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-[#191919]">
                  <CheckCircle2 className={`w-4 h-4 ${listing.transportationProvided ? 'text-emerald-600' : 'text-stone-300'}`} />
                  <span>Ulaşım Sağlanıyor</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-[#191919]">
                  <CheckCircle2 className={`w-4 h-4 ${listing.accommodationProvided ? 'text-emerald-600' : 'text-stone-300'}`} />
                  <span>Konaklama Sağlanıyor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dedicated Application Box (Directly on page, no popup) */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e0dfdc] shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0dfdc]">
              <div>
                <h2 className="text-base font-bold text-[#191919]">Bu İlana Başvur</h2>
                <p className="text-xs text-[#5e5e5e]">Sabit bütçe ve belirtilen repertuvar şartlarıyla başvuru yapın</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                Sabit Hakediş: {formatCurrencyTRY(listing.budgetAmount)}
              </span>
            </div>

            {existingApplication ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">Başvurunuz Başarıyla İletildi</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
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
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-50 text-rose-900 border border-rose-200'
                    }`}
                  >
                    {statusFeedback.message}
                  </div>
                )}

                {/* Applicant type selector */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setApplicantType('individual')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      applicantType === 'individual'
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5 text-amber-700" />
                    <span>Bireysel Sanatçı Olarak</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setApplicantType('ensemble')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      applicantType === 'ensemble'
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-amber-700" />
                    <span>Ensemble Topluluğu Adına</span>
                  </button>
                </div>

                {applicantType === 'individual' ? (
                  <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 flex items-center gap-3 border border-stone-200">
                    <img
                      src={currentArtist.avatarUrl}
                      alt={currentArtist.fullName}
                      className="w-9 h-9 rounded-lg object-cover"
                    />
                    <div>
                      <span className="font-bold text-stone-900">{currentArtist.fullName}</span> ({currentArtist.primaryInstrument}) profiliyle başvurulacaktır.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1 border border-stone-200">
                    <div className="font-bold text-stone-900">{currentEnsemble.name} ({currentEnsemble.ensembleType})</div>
                    <div className="text-[11px] text-stone-500">
                      Topluluk Kadrosu: {currentEnsemble.members.map((m) => m.name).join(', ')}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-stone-900 block mb-1">
                    İşverene Notunuz & Repertuvar Uyumu
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={coverMessage}
                    onChange={(e) => setCoverMessage(e.target.value)}
                    placeholder="İlan koşullarını ve sahne saatini inceledim. Belirtilen repertuvar talebine tam uyumlu programımızla yer alabiliriz..."
                    className="w-full text-xs p-3.5 bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-stone-500">
                    İşveren profilinizi, video kayıtlarınızı ve iptal oranınızı inceleyecektir.
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-sm flex items-center gap-2"
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
          {/* Fixed Payout Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="text-xs text-stone-500 font-medium uppercase tracking-wider">
              Sabit Sanatçı Hakedişi
            </div>
            <div className="text-3xl font-bold text-stone-900 tabular-nums">
              {formatCurrencyTRY(listing.budgetAmount)}
            </div>
            <p className="text-xs text-emerald-700 font-semibold">
              Net Tutar · İcracıdan Komisyon Kesintisi Yok
            </p>
            <div className="pt-3 border-t border-stone-200 text-xs text-stone-600 leading-relaxed">
              Ödeme etkinlik öncesinde işveren tarafından korumalı havuzda güvenceye alınır. Hizmet tamamlandığında hesabınıza aktarılır.
            </div>
          </div>

          {/* Employer Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">İşveren Bilgileri</h3>
            <div className="flex items-center gap-3">
              <img
                src={listing.businessLogo}
                alt={listing.businessName}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-stone-200"
              />
              <div>
                <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <span>{listing.businessName}</span>
                  {listing.businessVerified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                </div>
                <div className="text-xs text-amber-800 font-semibold">{listing.businessType}</div>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {listing.venueName}, {listing.city}
            </p>

            <button
              onClick={() => navigateTo('business_profile', listing.businessId)}
              className="w-full py-2.5 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            >
              İşletme Profilini Görüntüle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
