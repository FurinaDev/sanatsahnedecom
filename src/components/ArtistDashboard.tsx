import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrencyTRY } from '../utils/businessLogic';
import {
  Music2,
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  ShieldCheck,
  AlertTriangle,
  FileText,
  DollarSign,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const ArtistDashboard: React.FC = () => {
  const {
    currentUser,
    artists,
    applications,
    bookings,
    completePerformerService,
    submitVerificationRequest,
    cancelBooking,
    navigateTo,
  } = useApp();

  const artist = artists.find((a) => a.userId === currentUser.id) || artists[0];
  const myApplications = applications.filter(
    (a) => a.applicantUserId === currentUser.id || a.applicantId === artist.id
  );
  const myBookings = bookings.filter(
    (b) => b.performerId === artist.id || b.performerName.includes(artist.fullName)
  );

  const [activeTab, setActiveTab] = useState<'applications' | 'bookings' | 'payouts' | 'profile'>('bookings');
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Calculate total earnings
  const totalCompletedEarnings = myBookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + b.netPayoutAmount, 0);

  const handleArtistCancel = () => {
    if (!cancellingBookingId) return;
    cancelBooking(cancellingBookingId, cancelReason || 'Sanatçı mazereti', 'performer');
    setCancellingBookingId(null);
    setCancelReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      {/* Top Banner: Artist Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={artist.avatarUrl}
              alt={artist.fullName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{artist.fullName}</h1>
                {artist.isVerified ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Doğrulanmış Sanatçı
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                    İncelemede
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {artist.title} · {artist.primaryInstrument} · {artist.city}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 text-center sm:text-right bg-stone-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl">
            <div>
              <div className="text-[10px] text-stone-400 uppercase font-semibold">Puan</div>
              <div className="text-sm font-bold text-stone-900 flex items-center justify-center sm:justify-end gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{artist.ratingAvg.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-stone-400 uppercase font-semibold">Tamamlanan İş</div>
              <div className="text-sm font-bold text-stone-900 tabular-nums">
                {artist.completedJobsCount}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-stone-400 uppercase font-semibold">İptal Oranı</div>
              <div className="text-sm font-bold text-emerald-700 tabular-nums">
                %{artist.cancellationRate}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-stone-100 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'bookings' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Rezervasyonlarım & Sahne ({myBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'applications' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Başvurularım ({myApplications.length})
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'payouts' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Hakediş & Kazanç Geçmişi
          </button>
        </div>
      </div>

      {/* TAB: BOOKINGS & COMPLETE ACTION */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">Aktif Sahne Rezervasyonlarım</h2>
            <span className="text-xs text-stone-500">Kesinleşmiş sahne takviminiz</span>
          </div>

          {myBookings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
              <p className="text-sm text-stone-600">Henüz onaylanmış bir sahne rezervasyonunuz yok.</p>
              <button
                onClick={() => navigateTo('listings')}
                className="px-4 py-2 text-xs font-semibold text-stone-900 bg-stone-100 rounded-xl"
              >
                İlanları Keşfet ve Başvur
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 text-left"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-amber-800">Rezervasyon: {b.id}</div>
                      <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-0.5">{b.listingTitle}</h3>
                      <div className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-2">
                        <span>İşveren: <strong>{b.businessName}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Tarih: {b.eventDate}</span>
                        <span aria-hidden="true">·</span>
                        <span>Mekân: {b.venueName}</span>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <div className="text-xs text-stone-400">Net Sanatçı Hakedişi</div>
                      <div className="text-xl font-bold text-stone-900 tabular-nums">
                        {formatCurrencyTRY(b.netPayoutAmount)}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium">
                        {b.paymentStatus === 'held_sandbox' ? 'Korumalı Havuzda Bekliyor' : 'Aktarıldı'}
                      </div>
                    </div>
                  </div>

                  {/* Actions for Artist: "İşi Tamamladım" button (Section 2, 13) */}
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-xs text-stone-400 mr-2">Durum:</span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900">
                        {b.status === 'confirmed'
                          ? 'Rezervasyon Kesinleşti (Sahne Bekleniyor)'
                          : b.status === 'performer_completed'
                          ? 'İş Tamamlandı Bildirildi (İşveren Onayı Bekliyor)'
                          : b.status === 'completed'
                          ? 'Tamamlandı (Hakediş Hesaba Aktarıldı)'
                          : b.status === 'cancelled'
                          ? 'İptal Edildi'
                          : b.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => completePerformerService(b.id)}
                          className="px-5 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Hizmeti Tamamladım Olarak Bildir</span>
                        </button>
                      )}

                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => setCancellingBookingId(b.id)}
                          className="px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          Son Dakika İptal Bildir
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

      {/* TAB: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">Yaptığım İş Başvuruları</h2>
            <span className="text-xs text-stone-500">{myApplications.length} Başvuru</span>
          </div>

          {myApplications.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
              <p className="text-sm text-stone-600">Henüz bir ilana başvurmadınız.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="text-xs text-stone-400">Başvuru Kodu: {app.id}</div>
                    <div className="text-sm font-bold text-stone-900">
                      {app.applicantType === 'ensemble' ? 'Ensemble Topluluğu Başvurusu' : 'Bireysel Başvuru'}
                    </div>
                    <div className="text-xs text-stone-600 italic">"{app.message}"</div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        app.status === 'shortlisted'
                          ? 'bg-amber-100 text-amber-900'
                          : app.status === 'selected'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {app.status === 'shortlisted'
                        ? 'Kısa Listeye Alındınız'
                        : app.status === 'selected'
                        ? 'Seçildiniz'
                        : app.status === 'rejected'
                        ? 'Reddedildi'
                        : 'İnceleniyor'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: PAYOUTS & EARNINGS */}
      {activeTab === 'payouts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm">
              <div className="text-xs text-stone-400 uppercase font-semibold">Toplam Tamamlanan Hakediş</div>
              <div className="text-3xl font-bold text-stone-900 mt-2 tabular-nums">
                {formatCurrencyTRY(totalCompletedEarnings)}
              </div>
              <div className="text-xs text-emerald-700 mt-1 font-medium">Net Hesaba Aktarılan Kazanç</div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm">
              <div className="text-xs text-stone-400 uppercase font-semibold">Şeffaf Komisyon Modeli</div>
              <div className="text-sm font-semibold text-stone-800 mt-2">
                Model A: Komisyon İşverenden Tahsil Edilir
              </div>
              <p className="text-xs text-stone-500 mt-1">
                İlanda gördüğünüz net tutarın tamamı hesabınıza geçer, sizden kesinti yapılmaz.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CANCELLATION MODAL FOR ARTIST */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-left shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-stone-900">Son Dakika İptal Bildirimi</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Önemli: Kesinleşmiş rezervasyon iptalleri sanatçı güvenilirlik sicilindeki <strong>İptal Oranınızı</strong> doğrudan etkiler. İşveren derhal bilgilendirilecek ve acil ikame sanatçı süreci başlatılacaktır.
            </p>
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1">Mazeret / İptal Gerekçesi</label>
              <textarea
                rows={3}
                required
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Sağlık mazereti, doktor raporu, mücbir sebep..."
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
                onClick={handleArtistCancel}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl"
              >
                İptali Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
