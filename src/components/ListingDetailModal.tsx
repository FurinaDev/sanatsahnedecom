import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing } from '../types';
import { formatCurrencyTRY } from '../utils/businessLogic';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Building,
  Music,
  Users,
  AlertTriangle,
  Info,
  Send,
} from 'lucide-react';

interface Props {
  listing: Listing;
  onClose: () => void;
}

export const ListingDetailModal: React.FC<Props> = ({ listing, onClose }) => {
  const {
    currentUser,
    activeRole,
    applyToListing,
    applications,
    artists,
    ensembles,
    navigateTo,
  } = useApp();

  const [applicantType, setApplicantType] = useState<'individual' | 'ensemble'>('individual');
  const [coverMessage, setCoverMessage] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [statusFeedback, setStatusFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Check if current user already applied
  const existingApplication = applications.find(
    (a) => a.listingId === listing.id && a.applicantUserId === currentUser.id
  );

  // Active ensemble if applicable
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
        message: 'Başvurunuz başarıyla işletmeye iletildi. İlan sahibi değerlendirmesini yönetim panelinden yapacaktır.',
      });
    } else {
      setStatusFeedback({ type: 'error', message: result.error || 'Başvuru yapılamadı.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>İlan Detayı</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-stone-800">{listing.businessName}</span>
            {listing.businessVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Urgent Replacement Banner */}
          {listing.isReplacement && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Acil İkame Sanatçı İlanı
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  {listing.urgentReason || 'Önceki sanatçının son dakika mazereti nedeniyle ilan yeniden açılmıştır. Başvurular öncelikli olarak değerlendirilir.'}
                </p>
              </div>
            </div>
          )}

          {/* Main Title & Budget Strip */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-stone-100">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900">{listing.title}</h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                <span className="font-medium text-stone-700">{listing.eventType}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {listing.venueName}, {listing.city}
                </span>
              </div>
            </div>

            {/* Fixed Budget Card */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 text-right shrink-0">
              <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                Sabit Sanatçı Hakedişi
              </div>
              <div className="text-2xl font-bold text-stone-900 tabular-nums">
                {formatCurrencyTRY(listing.budgetAmount)}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">Net Ödenecek Bedel</div>
            </div>
          </div>

          {/* Operational Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
              <div className="text-stone-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Etkinlik Tarihi
              </div>
              <div className="font-semibold text-stone-900">{listing.eventDate}</div>
              <div className="text-[11px] text-stone-500">{listing.startTime} - {listing.endTime}</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
              <div className="text-stone-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Süre
              </div>
              <div className="font-semibold text-stone-900">{listing.durationMins} Dakika</div>
              <div className="text-[11px] text-stone-500">Akustik Dinleti</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
              <div className="text-stone-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Kadro Formatı
              </div>
              <div className="font-semibold text-stone-900">{listing.targetEnsembleType}</div>
              <div className="text-[11px] text-stone-500">{listing.performerCount} Kişilik Topluluk</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
              <div className="text-stone-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Son Başvuru
              </div>
              <div className="font-semibold text-amber-900">{listing.applicationDeadline}</div>
              <div className="text-[11px] text-stone-500">Kapanış Saati: 23:59</div>
            </div>
          </div>

          {/* Detailed Descriptions */}
          <div className="space-y-4 text-xs leading-relaxed text-stone-600">
            <div>
              <h4 className="font-bold text-stone-900 mb-1 text-sm">Etkinlik Açıklaması</h4>
              <p>{listing.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
                <span className="font-semibold text-stone-800 block text-xs">Repertuvar Beklentisi:</span>
                <p className="text-stone-600">{listing.repertoireExpectation}</p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
                <span className="font-semibold text-stone-800 block text-xs">Sahne & Kıyafet Kuralı:</span>
                <p className="text-stone-600">{listing.dressCode}</p>
              </div>
            </div>

            {/* Technical & Hospitality Requirements */}
            <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-4 h-4 ${listing.soundSystemProvided ? 'text-emerald-700' : 'text-stone-300'}`}
                />
                <span>Ses Sistemi Mekânda Mevcut</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-4 h-4 ${listing.transportationProvided ? 'text-emerald-700' : 'text-stone-300'}`}
                />
                <span>Ulaşım Sağlanıyor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-4 h-4 ${listing.accommodationProvided ? 'text-emerald-700' : 'text-stone-300'}`}
                />
                <span>Konaklama Sağlanıyor</span>
              </div>
            </div>
          </div>

          {/* Employer Card Reference */}
          <div className="p-4 rounded-xl bg-stone-100/70 border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={listing.businessLogo}
                alt={listing.businessName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-lg object-cover border border-stone-300"
              />
              <div>
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <span>{listing.businessName}</span>
                  {listing.businessVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />}
                </div>
                <div className="text-[11px] text-stone-500">
                  {listing.businessType} · {listing.city}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                navigateTo('business_profile', listing.businessId);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
            >
              İşletme Profilini İncele
            </button>
          </div>

          {/* Application Form Section */}
          <div className="pt-4 border-t border-stone-200">
            {existingApplication ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">Başvurunuz Kayıtlı</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Bu ilana daha önce başvurdunuz. İşveren incelemesini panel üzerinden takip edebilirsiniz.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900">İlana Başvuru Yap</h3>
                  <span className="text-xs text-stone-400">Sabit Bütçeli Doğrudan Başvuru</span>
                </div>

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

                {/* Applicant Type Selection Tabs */}
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
                    <Music className="w-3.5 h-3.5 text-amber-800" />
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
                    <Users className="w-3.5 h-3.5 text-amber-800" />
                    <span>Ensemble Topluluğu Adına</span>
                  </button>
                </div>

                {applicantType === 'individual' ? (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs text-stone-600 flex items-center gap-3">
                    <img
                      src={currentArtist.avatarUrl}
                      alt={currentArtist.fullName}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <span className="font-semibold text-stone-900">{currentArtist.fullName}</span> ({currentArtist.primaryInstrument}) profiliyle başvuruyorsunuz.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-stone-900">
                      <Users className="w-4 h-4 text-amber-800" />
                      <span>{currentEnsemble.name} ({currentEnsemble.ensembleType})</span>
                    </div>
                    <div className="text-stone-500 text-[11px]">
                      Etkinliğe katılacak kadro: {currentEnsemble.members.map((m) => m.name).join(', ')}
                    </div>
                  </div>
                )}

                {/* Message & Repertoire note input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-800 block">
                    İşverene Mesajınız & Repertuvar Notu
                  </label>
                  <textarea
                    rows={3}
                    value={coverMessage}
                    onChange={(e) => setCoverMessage(e.target.value)}
                    placeholder="İlan koşullarını inceledim. Belirtilen saat aralığında programa uygun repertuvarımızla yer alabiliriz..."
                    className="w-full text-xs p-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-stone-400">
                    Başvuru sonrasında işveren profilinizi, videolarınızı ve iptal oranınızı inceleyecektir.
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-sm flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Başvuruyu Gönder</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
