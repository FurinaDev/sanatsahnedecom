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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={business.logoUrl}
              alt={business.businessName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{business.businessName}</h1>
                {business.isVerified ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Doğrulanmış İşveren
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                    Onay Bekliyor
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-1">
                İşletme Yönetim Paneli · {business.businessType} · {business.city}
              </p>
            </div>
          </div>

          {/* Primary Action: Yeni İlan Aç */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreatingListing(true)}
              className="px-5 py-2.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Yeni İlan Oluştur</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-stone-100 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'listings' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            İlanlarım ({businessListings.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'applications' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Gelen Başvurular & Aday Karşılaştırma ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'bookings' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Rezervasyon & Ödeme ({businessBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'verification' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Doğrulama & Akreditasyon
          </button>
        </div>
      </div>

      {/* Replacement Notice Alert */}
      {replacementNotice && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-medium text-emerald-900 flex items-center justify-between">
          <span>{replacementNotice}</span>
          <button onClick={() => setReplacementNotice(null)} className="text-emerald-700 hover:underline">
            Kapat
          </button>
        </div>
      )}

      {/* TAB 1: LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">Yayınlanan Etkinlik İlanları</h2>
            <span className="text-xs text-stone-500">Sabit bütçeli doğrulanmış ilanlarınız</span>
          </div>

          {businessListings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
              <p className="text-sm text-stone-600">Henüz yayınlanmış bir ilanınız bulunmamaktadır.</p>
              <button
                onClick={() => setIsCreatingListing(true)}
                className="px-4 py-2 text-xs font-bold text-stone-900 bg-stone-100 rounded-xl"
              >
                İlk İlanınızı Açın
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businessListings.map((l) => (
                <div
                  key={l.id}
                  className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-amber-800/40 transition-all space-y-3 relative overflow-hidden"
                >
                  {l.isReplacement && (
                    <div className="bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md inline-block">
                      Acil İkame
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-stone-900">{l.title}</h3>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {l.targetEnsembleType} · {l.genres.join(', ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-stone-900 tabular-nums">
                        {formatCurrencyTRY(l.budgetAmount)}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium">Net Sanatçı Hakedişi</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 pt-2 border-t border-stone-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      {l.eventDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {l.durationMins} dk
                    </span>
                    <span className="flex items-center gap-1 text-amber-900 font-semibold">
                      <Users className="w-3.5 h-3.5" />
                      {l.applicationsCount} Başvuru
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        l.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800'
                          : l.status === 'assigned'
                          ? 'bg-blue-50 text-blue-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {l.status === 'active'
                        ? 'Başvuru Alınıyor'
                        : l.status === 'assigned'
                        ? 'Sanatçı Seçildi / Anlaşmada'
                        : l.status}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedListingForApps(l.id);
                        setActiveTab('applications');
                      }}
                      className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
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

      {/* TAB 2: APPLICATIONS & CANDIDATE COMPARISON MATRIX (Section 10.2 Requirement) */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">Aday Karşılaştırma ve Başvuru Yönetimi</h2>
              <p className="text-xs text-stone-500">
                Puanlama, tamamlanan iş, doğrulama rozeti ve iptal oranına göre şeffaf karşılaştırma.
              </p>
            </div>

            {/* Listing Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-700">İlan:</span>
              <select
                value={selectedListingForApps}
                onChange={(e) => setSelectedListingForApps(e.target.value)}
                className="text-xs font-medium p-2 bg-white border border-stone-200 rounded-xl"
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
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
              <p className="text-sm text-stone-600">Bu ilan için henüz bir başvuru bulunmamaktadır.</p>
              <p className="text-xs text-stone-400">Sanatçılar ve topluluklar başvurdukça karşılaştırma tablosunda listelenecektir.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentListingApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 text-left"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={app.applicantAvatar}
                        alt={app.applicantName}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-stone-900">{app.applicantName}</h3>
                          {app.applicantIsVerified && (
                            <span title="Doğrulanmış Hesap">
                              <ShieldCheck className="w-4 h-4 text-emerald-700" />
                            </span>
                          )}
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                            {app.applicantType === 'ensemble' ? 'Ensemble Topluluğu' : 'Bireysel Sanatçı'}
                          </span>
                        </div>

                        <div className="text-xs text-stone-500 font-medium">
                          {app.instrumentsOrType} · {app.genres.join(', ')}
                        </div>

                        {app.participatingMembers && app.participatingMembers.length > 0 && (
                          <div className="text-[11px] text-stone-500">
                            <strong>Katılacak Kadro:</strong> {app.participatingMembers.join(' · ')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Candidate Trust Metrics Scorecard */}
                    <div className="grid grid-cols-3 gap-3 text-center sm:text-right bg-stone-50 p-2.5 rounded-xl border border-stone-100 shrink-0">
                      <div>
                        <div className="text-[10px] text-stone-400 uppercase font-semibold">Puan</div>
                        <div className="text-sm font-bold text-stone-900 flex items-center justify-center sm:justify-end gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{app.applicantRating.toFixed(2)}</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-stone-400 uppercase font-semibold">İş Sayısı</div>
                        <div className="text-sm font-bold text-stone-900 tabular-nums">
                          {app.applicantCompletedJobs}
                        </div>
                      </div>

                      {/* Section 14 Cancellation Rate Enforcement */}
                      <div>
                        <div className="text-[10px] text-stone-400 uppercase font-semibold">İptal Oranı</div>
                        <div
                          className={`text-sm font-bold tabular-nums ${
                            app.applicantCancellationRate === 0
                              ? 'text-emerald-700'
                              : app.applicantCancellationRate < 10
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          %{app.applicantCancellationRate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Application Message */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-700 leading-relaxed italic">
                    "{app.message}"
                  </div>

                  {/* Action Buttons: Shortlist, Reject, Select */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400">Durum:</span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          app.status === 'shortlisted'
                            ? 'bg-amber-100 text-amber-900'
                            : app.status === 'selected'
                            ? 'bg-emerald-100 text-emerald-900'
                            : app.status === 'rejected'
                            ? 'bg-rose-100 text-rose-900'
                            : 'bg-stone-100 text-stone-700'
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

                    <div className="flex items-center gap-2">
                      {app.status !== 'shortlisted' && app.status !== 'selected' && (
                        <button
                          onClick={() => shortlistApplication(app.id)}
                          className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                        >
                          Kısa Listeye Al
                        </button>
                      )}

                      {app.status !== 'rejected' && app.status !== 'selected' && (
                        <button
                          onClick={() => rejectApplication(app.id)}
                          className="px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          Reddet
                        </button>
                      )}

                      {app.status !== 'selected' && (
                        <button
                          onClick={() => handleSelectCandidate(app.id)}
                          className="px-5 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
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

      {/* TAB 3: BOOKINGS, CONTRACTS & SANDBOX PAYMENT (Section 12, 13, 14) */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">Rezervasyonlar, Dijital Sözleşmeler ve Ödemeler</h2>
            <span className="text-xs text-stone-500">17 aşamalı kontrollü rezervasyon ve hakediş akışı</span>
          </div>

          {businessBookings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
              <p className="text-sm text-stone-600">Henüz kesinleşmiş veya süreçte olan bir rezervasyonunuz yok.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {businessBookings.map((b) => {
                const commissionCalc = calculateCommission(
                  b.netPayoutAmount,
                  b.commissionRate,
                  b.commissionModel
                );

                return (
                  <div
                    key={b.id}
                    className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-5 text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-stone-100">
                      <div>
                        <div className="text-xs font-semibold text-amber-800">Rezervasyon Kodu: {b.id}</div>
                        <h3 className="text-lg font-bold text-stone-900 mt-0.5">{b.listingTitle}</h3>
                        <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                          <span>Sanatçı: <strong>{b.performerName}</strong></span>
                          <span aria-hidden="true">·</span>
                          <span>Tarih: {b.eventDate}</span>
                          <span aria-hidden="true">·</span>
                          <span>Mekân: {b.venueName}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0">
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-900'
                              : b.status === 'completed'
                              ? 'bg-blue-100 text-blue-900'
                              : b.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-900'
                              : 'bg-amber-100 text-amber-900'
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
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                      <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                        Finansal ve Komisyon Hesaplama Detayı ({settings.commissionModel})
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <div className="text-stone-500">Sanatçı Net Hakedişi:</div>
                          <div className="text-base font-bold text-stone-900 tabular-nums">
                            {formatCurrencyTRY(b.netPayoutAmount)}
                          </div>
                        </div>

                        <div>
                          <div className="text-stone-500">Platform Komisyonu (%{b.commissionRate}):</div>
                          <div className="text-base font-bold text-amber-800 tabular-nums">
                            {formatCurrencyTRY(b.commissionAmount)}
                          </div>
                        </div>

                        <div>
                          <div className="text-stone-500 font-semibold">İşverenin Toplam Ödemesi:</div>
                          <div className="text-base font-bold text-stone-900 tabular-nums">
                            {formatCurrencyTRY(b.grossAmount)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div className="text-xs text-stone-500">
                        Ödeme Durumu:{' '}
                        <strong className="text-stone-800">
                          {b.paymentStatus === 'held_sandbox'
                            ? 'Korumalı Havuzda (Sandbox)'
                            : b.paymentStatus === 'released'
                            ? 'Sanatçıya Aktarıldı'
                            : b.paymentStatus === 'refunded'
                            ? 'İade Edildi'
                            : 'Ödenmedi'}
                        </strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Step: Pay Sandbox */}
                        {b.status === 'payment_pending' && (
                          <button
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
                            onClick={() => completeEmployerService(b.id)}
                            className="px-5 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Hizmetin Gerçekleştiğini Onayla & Hakedişi Serbest Bırak</span>
                          </button>
                        )}

                        {/* Step: Cancellation & Emergency Replacement */}
                        {b.status !== 'completed' && b.status !== 'cancelled' && (
                          <button
                            onClick={() => setCancellingBookingId(b.id)}
                            className="px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            Rezervasyonu İptal Et
                          </button>
                        )}

                        {/* If Cancelled: 1-Click Acil İkame İlanı */}
                        {b.status === 'cancelled' && (
                          <button
                            onClick={() => handleTriggerEmergencyReplacement(b.id)}
                            className="px-4 py-2 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <AlertTriangle className="w-4 h-4 text-amber-800" />
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

      {/* TAB 4: VERIFICATION DOCUMENTS SUBMISSION (Section 7.3) */}
      {activeTab === 'verification' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6 max-w-2xl text-left">
          <div>
            <h2 className="text-base font-bold text-stone-900">İşletme Doğrulama ve Akreditasyon</h2>
            <p className="text-xs text-stone-500 mt-1">
              İlan açabilmek için işletme vergi levhası ve ticaret sicil belgelerinin platform yöneticisi tarafından onaylanması gerekir.
            </p>
          </div>

          {business.isVerified ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-emerald-950">Hesabınız Doğrulanmıştır</h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Tüm ilan yayınlama, rezervasyon ve ödeme süreçleriniz tam yetkiyle aktiftir.
                </p>
              </div>
            </div>
          ) : verifSubmitted ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-800 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-950">Belgeleriniz İnceleniyor</h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Yönetici ekibi belgelerinizi incelemektedir. Onaylandığında e-posta ve sistem bildirimi alacaksınız.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">
                  Resmî Vergi Levhası / Ticaret Sicil Gazetesi (Belge URL veya PDF)
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com/docs/vergi_levhasi.pdf"
                  value={verifDocUrl}
                  onChange={(e) => setVerifDocUrl(e.target.value)}
                  className="w-full text-xs p-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-800"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-sm"
              >
                İncelemeye Gönder
              </button>
            </form>
          )}
        </div>
      )}

      {/* CREATE LISTING MODAL */}
      {isCreatingListing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 text-left shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900">Yeni Etkinlik İlanı Oluştur</h2>
              <button onClick={() => setIsCreatingListing(false)}>
                <X className="w-5 h-5 text-stone-400 hover:text-stone-700" />
              </button>
            </div>

            {createError && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 font-medium">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateListingSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">İlan Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Hafta Sonu Salon Konseri — Yaylı Trio"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Etkinlik Türü</label>
                  <input
                    type="text"
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Kadro / Ensemble Formatı</label>
                  <select
                    value={newEnsembleType}
                    onChange={(e) => setNewEnsembleType(e.target.value as any)}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-white"
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
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Sabit Bütçe (TRY)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Etkinlik Tarihi</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Performans Süresi (Dk)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Mekân ve Salon Bilgisi</label>
                <input
                  type="text"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  className="w-full text-xs p-3 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Detaylı Açıklama & Repertuvar Talebi</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Etkinliğin konsepti, aranan müzik tarzı ve sahne beklentileri..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs p-3 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="soundCheck"
                  checked={newSoundSystem}
                  onChange={(e) => setNewSoundSystem(e.target.checked)}
                  className="w-4 h-4 text-amber-800 rounded"
                />
                <label htmlFor="soundCheck" className="text-xs text-stone-700 cursor-pointer">
                  Ses sistemi mekân tarafından temin edilmektedir.
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingListing(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-sm"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-left shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-stone-900">Rezervasyonu İptal Et</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              İptal durumunda sanatçı ve platform yönetimi bilgilendirilecek ve ödeme havuzu iade sürecine alınacaktır.
            </p>
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1">İptal Gerekçesi</label>
              <textarea
                rows={3}
                required
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Etkinlik erteleme, teknik arıza, organizasyon değişikliği..."
                className="w-full text-xs p-3 border border-stone-200 rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancellingBookingId(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Vazgeç
              </button>
              <button
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
