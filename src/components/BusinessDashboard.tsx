import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, ListingApplication, Booking, MusicGenre, EnsembleType, Instrument } from '../types';
import { formatCurrencyTRY, calculateCommission, canBusinessCreateListing } from '../utils/businessLogic';
import {
  Building2,
  PlusCircle,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Users,
  Star,
  Clock,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Filter,
  DollarSign,
  Send,
  X,
} from 'lucide-react';

export const BusinessDashboard: React.FC = () => {
  const {
    currentUser,
    businesses,
    listings,
    applications,
    bookings,
    settings,
    createListing,
    shortlistApplication,
    rejectApplication,
    selectApplicantAndCreateBooking,
    acceptContract,
    payBookingSandbox,
    completeEmployerService,
    cancelBooking,
    createEmergencyReplacement,
    submitVerificationRequest,
    navigateTo,
  } = useApp();

  const business = businesses.find((b) => b.userId === currentUser.id) || businesses[0];
  const businessListings = listings.filter((l) => l.businessId === business.id);
  const businessBookings = bookings.filter((b) => b.businessId === business.id);

  const [activeTab, setActiveTab] = useState<'listings' | 'applications' | 'bookings' | 'verification'>('listings');
  const [selectedListingForApps, setSelectedListingForApps] = useState<string>(
    businessListings[0]?.id || ''
  );

  // New Listing Form Modal state
  const [isCreatingListing, setIsCreatingListing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newEventType, setNewEventType] = useState('Lobi & Salon Konseri');
  const [newEnsembleType, setNewEnsembleType] = useState<EnsembleType>('Trio');
  const [newGenres, setNewGenres] = useState<MusicGenre[]>(['Klasik Müzik', 'Oda Müziği']);
  const [newInstruments, setNewInstruments] = useState<Instrument[]>(['Keman', 'Viyolonsel (Çello)']);
  const [newBudget, setNewBudget] = useState(20000);
  const [newDate, setNewDate] = useState('2026-12-05');
  const [newDuration, setNewDuration] = useState(60);
  const [newStartTime, setNewStartTime] = useState('20:00');
  const [newEndTime, setNewEndTime] = useState('21:00');
  const [newDeadline, setNewDeadline] = useState('2026-11-30');
  const [newDesc, setNewDesc] = useState('');
  const [newVenue, setNewVenue] = useState(`${business.businessName} Ana Salon`);
  const [newSoundSystem, setNewSoundSystem] = useState(true);
  const [createError, setCreateError] = useState<string | null>(null);

  // Verification request form state
  const [verifDocUrl, setVerifDocUrl] = useState('');
  const [verifSubmitted, setVerifSubmitted] = useState(false);

  // Cancellation Modal state
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');

  // Emergency Replacement alert state
  const [replacementNotice, setReplacementNotice] = useState<string | null>(null);

  // Applications for the selected listing
  const currentListingApps = applications.filter((a) => a.listingId === selectedListingForApps);

  const handleCreateListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    // Enforce Rule 7 & 8: Check if business is verified!
    if (!canBusinessCreateListing(business)) {
      setCreateError(
        'Yetkisiz İşlem: Yalnızca platform yöneticisi tarafından onaylanmış işletmeler ilan yayınlayabilir. Lütfen önce "Doğrulama & Akreditasyon" sekmesinden resmî belgelerinizi iletiniz.'
      );
      return;
    }

    if (!newTitle.trim() || !newDesc.trim()) {
      setCreateError('Lütfen ilan başlığı ve açıklamasını eksiksiz doldurunuz.');
      return;
    }

    const res = createListing({
      title: newTitle,
      eventType: newEventType,
      targetEnsembleType: newEnsembleType,
      genres: newGenres,
      requiredInstruments: newInstruments,
      budgetAmount: Number(newBudget),
      eventDate: newDate,
      durationMins: Number(newDuration),
      startTime: newStartTime,
      endTime: newEndTime,
      applicationDeadline: newDeadline,
      description: newDesc,
      venueName: newVenue,
      soundSystemProvided: newSoundSystem,
    });

    if (res.success) {
      setIsCreatingListing(false);
      setNewTitle('');
      setNewDesc('');
      if (res.listingId) {
        setSelectedListingForApps(res.listingId);
      }
    } else {
      setCreateError(res.error || 'İlan oluşturulamadı.');
    }
  };

  const handleSelectCandidate = (appId: string) => {
    const res = selectApplicantAndCreateBooking(appId);
    if (res.success) {
      setActiveTab('bookings');
    }
  };

  const handleConfirmCancellation = () => {
    if (!cancellingBookingId) return;
    cancelBooking(cancellingBookingId, cancellationReason || 'İşletme organizasyon değişikliği', 'employer');
    setCancellingBookingId(null);
    setCancellationReason('');
  };

  const handleTriggerEmergencyReplacement = (bookingId: string) => {
    const res = createEmergencyReplacement(bookingId);
    if (res.success) {
      setReplacementNotice(
        'Acil İkame İlanı başarıyla oluşturuldu ve sanatçılara öncelikli olarak gösterilmek üzere yayına alındı!'
      );
      setActiveTab('listings');
    }
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifDocUrl) return;
    submitVerificationRequest('business', business.businessName, verifDocUrl);
    setVerifSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      {/* Top Banner: Employer Header & Actions */}
      <div className="bg-white dark:bg-[#13213e] rounded-3xl p-6 sm:p-8 border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={business.logoUrl}
              alt={business.businessName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border border-[#e2e8f0] dark:border-[#1e335a] shadow-sm shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-white">{business.businessName}</h1>
                {business.isVerified ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Doğrulanmış İşveren
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#ad3300] dark:text-[#ff8a65] bg-[#ffdbd0] dark:bg-[#f25922]/20 px-2 py-0.5 rounded-md">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Onay Bekliyor
                  </span>
                )}
              </div>
              <p className="text-xs text-[#475569] dark:text-slate-300 mt-1">
                İşletme Yönetim Paneli · {business.businessType} · {business.city}
              </p>
            </div>
          </div>

          {/* Primary Action: Yeni İlan Aç */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCreatingListing(true)}
              className="w-full sm:w-auto justify-center px-5 py-2.5 text-xs font-bold text-white bg-[#f25922] hover:bg-[#ad3300] rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Yeni İlan Oluştur</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-[#e2e8f0] dark:border-[#1e335a] overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'listings' ? 'bg-[#16274e] dark:bg-[#f25922] text-white' : 'text-[#475569] dark:text-slate-300 hover:bg-[#f1f3ff] dark:hover:bg-[#0f1c38]'
            }`}
          >
            İlanlarım ({businessListings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'applications' ? 'bg-[#16274e] dark:bg-[#f25922] text-white' : 'text-[#475569] dark:text-slate-300 hover:bg-[#f1f3ff] dark:hover:bg-[#0f1c38]'
            }`}
          >
            Gelen Başvurular & Aday Karşılaştırma ({applications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'bookings' ? 'bg-[#16274e] dark:bg-[#f25922] text-white' : 'text-[#475569] dark:text-slate-300 hover:bg-[#f1f3ff] dark:hover:bg-[#0f1c38]'
            }`}
          >
            Rezervasyon & Ödeme ({businessBookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'verification' ? 'bg-[#16274e] dark:bg-[#f25922] text-white' : 'text-[#475569] dark:text-slate-300 hover:bg-[#f1f3ff] dark:hover:bg-[#0f1c38]'
            }`}
          >
            Doğrulama & Akreditasyon
          </button>
        </div>
      </div>

      {/* Replacement Notice Alert */}
      {replacementNotice && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-medium text-emerald-900 dark:text-emerald-300 flex items-center justify-between gap-3">
          <span>{replacementNotice}</span>
          <button type="button" onClick={() => setReplacementNotice(null)} className="text-emerald-700 dark:text-emerald-400 hover:underline shrink-0">
            Kapat
          </button>
        </div>
      )}

      {/* TAB 1: LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-base font-bold text-[#0f172a] dark:text-white">Yayınlanan Etkinlik İlanları</h2>
            <span className="text-xs text-[#64748b] dark:text-slate-400">Sabit bütçeli doğrulanmış ilanlarınız</span>
          </div>

          {businessListings.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#13213e] rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] space-y-3">
              <p className="text-sm text-[#475569] dark:text-slate-300">Henüz yayınlanmış bir ilanınız bulunmamaktadır.</p>
              <button
                type="button"
                onClick={() => setIsCreatingListing(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#16274e] dark:bg-[#f25922] rounded-xl"
              >
                İlk İlanınızı Açın
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businessListings.map((l) => (
                <div
                  key={l.id}
                  className="p-5 bg-white dark:bg-[#13213e] rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#16274e]/40 dark:hover:border-[#f25922]/50 transition-colors space-y-3 relative overflow-hidden shadow-xs"
                >
                  {l.isReplacement && (
                    <div className="bg-[#f25922] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md inline-block">
                      Acil İkame
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-[#0f172a] dark:text-white">{l.title}</h3>
                      <div className="text-xs text-[#475569] dark:text-slate-300 mt-0.5">
                        {l.targetEnsembleType} · {l.genres.join(', ')}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base font-bold text-[#0f172a] dark:text-white tabular-nums">
                        {formatCurrencyTRY(l.budgetAmount)}
                      </div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Net Sanatçı Hakedişi</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#475569] dark:text-slate-300 pt-2 border-t border-[#e2e8f0] dark:border-[#1e335a]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#64748b] dark:text-slate-400" />
                      {l.eventDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#64748b] dark:text-slate-400" />
                      {l.durationMins} dk
                    </span>
                    <span className="flex items-center gap-1 text-[#f25922] font-semibold">
                      <Users className="w-3.5 h-3.5" />
                      {l.applicationsCount} Başvuru
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        l.status === 'active'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                          : l.status === 'assigned'
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300'
                          : 'bg-[#f8fafc] dark:bg-[#0f1c38] text-[#475569] dark:text-slate-300'
                      }`}
                    >
                      {l.status === 'active'
                        ? 'Başvuru Alınıyor'
                        : l.status === 'assigned'
                        ? 'Sanatçı Seçildi / Anlaşmada'
                        : l.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedListingForApps(l.id);
                        setActiveTab('applications');
                      }}
                      className="text-xs font-semibold text-[#f25922] hover:underline flex items-center gap-1"
                    >
                      <span>Başvuruları İncele</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPLICATIONS & CANDIDATE COMPARISON MATRIX */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-base font-bold text-[#0f172a] dark:text-white">Aday Karşılaştırma ve Başvuru Yönetimi</h2>
              <p className="text-xs text-[#64748b] dark:text-slate-400">
                Puanlama, tamamlanan iş, doğrulama rozeti ve iptal oranına göre şeffaf karşılaştırma.
              </p>
            </div>

            {/* Listing Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#475569] dark:text-slate-300">İlan:</span>
              <select
                value={selectedListingForApps}
                onChange={(e) => setSelectedListingForApps(e.target.value)}
                className="text-xs font-medium p-2 bg-white dark:bg-[#13213e] text-[#0f172a] dark:text-white border border-[#e2e8f0] dark:border-[#1e335a] rounded-xl max-w-full"
              >
                {businessListings.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title} ({l.budgetAmount} TL)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {currentListingApps.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#13213e] rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] space-y-2">
              <p className="text-sm text-[#475569] dark:text-slate-300">Bu ilan için henüz bir başvuru bulunmamaktadır.</p>
              <p className="text-xs text-[#64748b] dark:text-slate-400">Sanatçılar ve topluluklar başvurdukça karşılaştırma tablosunda listelenecektir.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentListingApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white dark:bg-[#13213e] p-6 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-4 text-left"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={app.applicantAvatar}
                        alt={app.applicantName}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover border border-[#e2e8f0] dark:border-[#1e335a] shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-[#0f172a] dark:text-white">{app.applicantName}</h3>
                          {app.applicantIsVerified && (
                            <span title="Doğrulanmış Hesap">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </span>
                          )}
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#f8fafc] dark:bg-[#0f1c38] text-[#475569] dark:text-slate-300 border border-[#e2e8f0] dark:border-[#1e335a]">
                            {app.applicantType === 'ensemble' ? 'Sanat Topluluğu' : 'Bireysel Sanatçı'}
                          </span>
                        </div>

                        <div className="text-xs text-[#475569] dark:text-slate-300 font-medium">
                          {app.instrumentsOrType} · {app.genres.join(', ')}
                        </div>

                        {app.participatingMembers && app.participatingMembers.length > 0 && (
                          <div className="text-[11px] text-[#64748b] dark:text-slate-400">
                            <strong>Katılacak Kadro:</strong> {app.participatingMembers.join(' · ')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Candidate Trust Metrics Scorecard */}
                    <div className="grid grid-cols-3 gap-3 text-center sm:text-right bg-[#f8fafc] dark:bg-[#0f1c38] p-2.5 rounded-xl border border-[#e2e8f0] dark:border-[#1e335a] shrink-0">
                      <div>
                        <div className="text-[10px] text-[#64748b] dark:text-slate-400 uppercase font-semibold">Puan</div>
                        <div className="text-sm font-bold text-[#0f172a] dark:text-white flex items-center justify-center sm:justify-end gap-1">
                          <Star className="w-3.5 h-3.5 text-[#f25922] fill-[#f25922]" />
                          <span>{app.applicantRating.toFixed(2)}</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-[#64748b] dark:text-slate-400 uppercase font-semibold">İş Sayısı</div>
                        <div className="text-sm font-bold text-[#0f172a] dark:text-white tabular-nums">
                          {app.applicantCompletedJobs}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-[#64748b] dark:text-slate-400 uppercase font-semibold">İptal Oranı</div>
                        <div
                          className={`text-sm font-bold tabular-nums ${
                            app.applicantCancellationRate === 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : app.applicantCancellationRate < 10
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          %{app.applicantCancellationRate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Application Message */}
                  <div className="p-4 bg-[#f8fafc] dark:bg-[#0f1c38] rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] text-xs text-[#475569] dark:text-slate-300 leading-relaxed italic">
                    "{app.message}"
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#e2e8f0] dark:border-[#1e335a]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#64748b] dark:text-slate-400">Durum:</span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          app.status === 'shortlisted'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
                            : app.status === 'selected'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300'
                            : app.status === 'rejected'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300'
                            : 'bg-[#f8fafc] dark:bg-[#0f1c38] text-[#475569] dark:text-slate-300'
                        }`}
                      >
                        {app.status === 'shortlisted'
                          ? 'Kısa Listede'
                          : app.status === 'selected'
                          ? 'Seçildi'
                          : app.status === 'rejected'
                          ? 'Reddedildi'
                          : 'Değerlendirme Bekliyor'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {app.status !== 'shortlisted' && app.status !== 'selected' && (
                        <button
                          type="button"
                          onClick={() => shortlistApplication(app.id)}
                          className="px-3.5 py-2 text-xs font-semibold text-[#475569] dark:text-slate-200 bg-[#f8fafc] dark:bg-[#0f1c38] hover:bg-slate-200 dark:hover:bg-[#1e335a] border border-[#e2e8f0] dark:border-[#1e335a] rounded-xl transition-colors"
                        >
                          Kısa Listeye Al
                        </button>
                      )}

                      {app.status !== 'rejected' && app.status !== 'selected' && (
                        <button
                          type="button"
                          onClick={() => rejectApplication(app.id)}
                          className="px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                        >
                          Reddet
                        </button>
                      )}

                      {app.status !== 'selected' && (
                        <button
                          type="button"
                          onClick={() => handleSelectCandidate(app.id)}
                          className="px-5 py-2 text-xs font-bold text-white bg-[#16274e] dark:bg-[#f25922] hover:opacity-90 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#f25922] dark:text-white" />
                          <span>Bu Sanatçıyı Seç & Rezervasyon Başlat</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BOOKINGS, CONTRACTS & SANDBOX PAYMENT */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-base font-bold text-[#0f172a] dark:text-white">Rezervasyonlar, Dijital Sözleşmeler ve Ödemeler</h2>
            <span className="text-xs text-[#64748b] dark:text-slate-400">Kontrollü rezervasyon ve hakediş akışı</span>
          </div>

          {businessBookings.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#13213e] rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] space-y-2">
              <p className="text-sm text-[#475569] dark:text-slate-300">Henüz kesinleşmiş veya süreçte olan bir rezervasyonunuz yok.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {businessBookings.map((b) => {
                calculateCommission(
                  b.netPayoutAmount,
                  b.commissionRate,
                  b.commissionModel
                );

                return (
                  <div
                    key={b.id}
                    className="bg-white dark:bg-[#13213e] p-6 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-5 text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#e2e8f0] dark:border-[#1e335a]">
                      <div>
                        <div className="text-xs font-semibold text-[#f25922]">Rezervasyon Kodu: {b.id}</div>
                        <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mt-0.5">{b.listingTitle}</h3>
                        <div className="text-xs text-[#475569] dark:text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                          <span>Sanatçı: <strong className="text-[#0f172a] dark:text-white">{b.performerName}</strong></span>
                          <span aria-hidden="true">·</span>
                          <span>Tarih: {b.eventDate}</span>
                          <span aria-hidden="true">·</span>
                          <span>Mekân: {b.venueName}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0">
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider inline-block ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300'
                              : b.status === 'completed'
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300'
                              : b.status === 'cancelled'
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
                          }`}
                        >
                          {b.status === 'agreement_pending'
                            ? 'Sözleşme Onayı Bekleniyor'
                            : b.status === 'payment_pending'
                            ? 'Ödeme Bekleniyor'
                            : b.status === 'confirmed'
                            ? 'Rezervasyon Kesinleşti'
                            : b.status === 'performer_completed'
                            ? 'Sanatçı Tamamladı (İşveren Onayı Bekliyor)'
                            : b.status === 'completed'
                            ? 'Hizmet Tamamlandı (Hakediş Aktarıldı)'
                            : b.status === 'cancelled'
                            ? 'İptal Edildi'
                            : b.status}
                        </span>
                      </div>
                    </div>

                    {/* Financial Breakdown (Model A / Model B Transparency) */}
                    <div className="p-4 bg-[#f8fafc] dark:bg-[#0f1c38] rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a]">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-slate-400 mb-2">
                        Finansal ve Komisyon Hesaplama Detayı ({settings.commissionModel})
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <div className="text-[#475569] dark:text-slate-300">Sanatçı Net Hakedişi:</div>
                          <div className="text-base font-bold text-[#0f172a] dark:text-white tabular-nums">
                            {formatCurrencyTRY(b.netPayoutAmount)}
                          </div>
                        </div>

                        <div>
                          <div className="text-[#475569] dark:text-slate-300">Platform Komisyonu (%{b.commissionRate}):</div>
                          <div className="text-base font-bold text-[#f25922] tabular-nums">
                            {formatCurrencyTRY(b.commissionAmount)}
                          </div>
                        </div>

                        <div>
                          <div className="text-[#475569] dark:text-slate-300 font-semibold">İşverenin Toplam Ödemesi:</div>
                          <div className="text-base font-bold text-[#0f172a] dark:text-white tabular-nums">
                            {formatCurrencyTRY(b.grossAmount)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div className="text-xs text-[#64748b] dark:text-slate-400">
                        Ödeme Durumu:{' '}
                        <strong className="text-[#0f172a] dark:text-white">
                          {b.paymentStatus === 'held_sandbox'
                            ? 'Korumalı Havuzda (Sandbox)'
                            : b.paymentStatus === 'released'
                            ? 'Sanatçıya Aktarıldı'
                            : b.paymentStatus === 'refunded'
                            ? 'İade Edildi'
                            : 'Ödenmedi'}
                        </strong>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Step: Pay Sandbox */}
                        {b.status === 'payment_pending' && (
                          <button
                            type="button"
                            onClick={() => payBookingSandbox(b.id)}
                            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-md flex items-center gap-2"
                          >
                            <CreditCard className="w-4 h-4 text-emerald-300" />
                            <span>Korumalı Sandbox Ödeme Yap ({formatCurrencyTRY(b.grossAmount)})</span>
                          </button>
                        )}

                        {/* Step: Employer Confirms Completion */}
                        {(b.status === 'confirmed' || b.status === 'performer_completed') && (
                          <button
                            type="button"
                            onClick={() => completeEmployerService(b.id)}
                            className="px-5 py-2 text-xs font-bold text-white bg-[#16274e] dark:bg-[#f25922] hover:opacity-90 rounded-xl transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-white" />
                            <span>Hizmetin Gerçekleştiğini Onayla & Hakedişi Serbest Bırak</span>
                          </button>
                        )}

                        {/* Step: Cancellation & Emergency Replacement */}
                        {b.status !== 'completed' && b.status !== 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => setCancellingBookingId(b.id)}
                            className="px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                          >
                            Rezervasyonu İptal Et
                          </button>
                        )}

                        {/* If Cancelled: 1-Click Acil İkame İlanı */}
                        {b.status === 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => handleTriggerEmergencyReplacement(b.id)}
                            className="px-4 py-2 text-xs font-bold text-amber-950 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <AlertTriangle className="w-4 h-4 text-amber-800 dark:text-amber-300" />
                            <span>1-Tıkla Acil İkame İlanı Oluştur</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: VERIFICATION DOCUMENTS SUBMISSION */}
      {activeTab === 'verification' && (
        <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-6 max-w-2xl text-left">
          <div>
            <h2 className="font-display text-base font-bold text-[#0f172a] dark:text-white">İşletme Doğrulama ve Akreditasyon</h2>
            <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1">
              İlan açabilmek için işletme vergi levhası ve ticaret sicil belgelerinin platform yöneticisi tarafından onaylanması gerekir.
            </p>
          </div>

          {business.isVerified ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Hesabınız Doğrulanmıştır</h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                  Tüm ilan yayınlama, rezervasyon ve ödeme süreçleriniz tam yetkiyle aktiftir.
                </p>
              </div>
            </div>
          ) : verifSubmitted ? (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-800 dark:text-amber-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200">Belgeleriniz İnceleniyor</h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                  Yönetici ekibi belgelerinizi incelemektedir. Onaylandığında e-posta ve sistem bildirimi alacaksınız.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#0f172a] dark:text-slate-200 block mb-1">
                  Resmî Vergi Levhası / Ticaret Sicil Gazetesi (Belge URL veya PDF)
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com/docs/vergi_levhasi.pdf"
                  value={verifDocUrl}
                  onChange={(e) => setVerifDocUrl(e.target.value)}
                  className="w-full text-xs p-3 border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white rounded-xl focus:outline-none focus:border-[#f25922]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#16274e] dark:bg-[#f25922] hover:opacity-90 rounded-xl transition-colors shadow-sm"
              >
                İncelemeye Gönder
              </button>
            </form>
          )}
        </div>
      )}

      {/* CREATE LISTING MODAL */}
      {isCreatingListing && (
        <div className="fixed inset-0 z-50 bg-slate-950/65 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#13213e] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 text-left shadow-2xl border border-[#e2e8f0] dark:border-[#1e335a]">
            <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0] dark:border-[#1e335a]">
              <h2 className="font-display text-base font-bold text-[#0f172a] dark:text-white">Yeni Etkinlik İlanı Oluştur</h2>
              <button type="button" onClick={() => setIsCreatingListing(false)}>
                <X className="w-5 h-5 text-[#64748b] hover:text-[#0f172a] dark:hover:text-white" />
              </button>
            </div>

            {createError && (
              <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-900 dark:text-rose-200 font-medium">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateListingSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-[#0f172a] dark:text-slate-200 block mb-1">İlan Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Hafta Sonu Salon Konseri — Yaylı Trio"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-3 border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white rounded-xl focus:outline-none focus:border-[#f25922]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#0f172a] dark:text-slate-200 block mb-1">Etkinlik Türü</label>
                  <input
                    type="text"
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value)}
                    className="w-full text-xs p-3 border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#0f172a] dark:text-slate-200 block mb-1">Kadro / Topluluk Formatı</label>
                  <select
                    value={newEnsembleType}
                    onChange={(e) => setNewEnsembleType(e.target.value as any)}
                    className="w-full text-xs p-3 border border-[#e2e8f0] dark:border-[#1e335a] rounded-xl bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white"
                  >
                    <option value="Solo">Solo</option>
                    <option value="Duo">Duo</option>
                    <option value="Trio">Trio</option>
                    <option value="Quartet">Quartet</option>
                    <option value="Quintet">Quintet</option>
                    <option value="Chamber Ensemble">Chamber Ensemble</option>
                    <option value="Orkestra">Orkestra</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#0f172a] dark:text-slate-200 block mb-1">Sabit Bütçe (TRY)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full text-xs p-3 border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#0f172a] dark:text-slate-200 block mb-1">Etkinlik Tarihi</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs p-3 border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#0f172a] dark:text-slate-200 block mb-1">Performans Süresi (Dk)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full text-xs p-3 border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0f172a] dark:text-slate-200 block mb-1">Mekân ve Salon Bilgisi</label>
                <input
                  type="text"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  className="w-full text-xs p-3 border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0f172a] dark:text-slate-200 block mb-1">Detaylı Açıklama & Repertuvar Talebi</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Etkinliğin konsepti, aranan müzik tarzı ve sahne beklentileri..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs p-3 border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="soundCheck"
                  checked={newSoundSystem}
                  onChange={(e) => setNewSoundSystem(e.target.checked)}
                  className="w-4 h-4 text-[#f25922] rounded"
                />
                <label htmlFor="soundCheck" className="text-xs text-[#475569] dark:text-slate-300 cursor-pointer">
                  Ses sistemi mekân tarafından temin edilmektedir.
                </label>
              </div>

              <div className="pt-4 border-t border-[#e2e8f0] dark:border-[#1e335a] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingListing(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#475569] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e335a] rounded-xl"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-[#16274e] dark:bg-[#f25922] hover:opacity-90 rounded-xl shadow-sm"
                >
                  İlanı Yayına Al
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCELLATION MODAL */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 bg-slate-950/65 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#13213e] rounded-3xl max-w-md w-full p-6 text-left shadow-2xl border border-[#e2e8f0] dark:border-[#1e335a] space-y-4">
            <h3 className="text-base font-bold text-[#0f172a] dark:text-white">Rezervasyonu İptal Et</h3>
            <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed">
              İptal durumunda sanatçı ve platform yönetimi bilgilendirilecek ve ödeme havuzu iade sürecine alınacaktır.
            </p>
            <div>
              <label className="text-xs font-semibold text-[#0f172a] dark:text-slate-200 block mb-1">İptal Gerekçesi</label>
              <textarea
                rows={3}
                required
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Etkinlik erteleme, teknik arıza, organizasyon değişikliği..."
                className="w-full text-xs p-3 border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingBookingId(null)}
                className="px-4 py-2 text-xs font-semibold text-[#475569] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e335a] rounded-xl"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmCancellation}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl"
              >
                İptali Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
