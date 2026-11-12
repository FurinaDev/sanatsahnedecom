import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrencyTRY } from '../utils/businessLogic';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  Settings,
  Users,
  Building,
  Music,
  RotateCcw,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    settings,
    adminUpdateCommission,
    verifications,
    adminApproveVerification,
    adminRejectVerification,
    listings,
    bookings,
    artists,
    businesses,
    resetAllData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'kpis' | 'verifications' | 'commission' | 'moderation'>('kpis');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  // Commission settings inputs
  const [commissionRate, setCommissionRate] = useState(settings.commissionRate);
  const [commissionModel, setCommissionModel] = useState(settings.commissionModel);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Stats calculation
  const totalVolume = bookings.reduce((sum, b) => sum + b.grossAmount, 0);
  const totalCommissionEarned = bookings.reduce((sum, b) => sum + b.commissionAmount, 0);
  const activeListingsCount = listings.filter((l) => l.status === 'active').length;
  const pendingVerificationsCount = verifications.filter((v) => v.status === 'pending').length;

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateCommission(commissionRate, commissionModel);
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  const handleConfirmReject = () => {
    if (!rejectingId) return;
    adminRejectVerification(rejectingId, rejectReason || 'Belgeler KVKK veya oda sicil şartlarına uygun görülmedi.');
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-8">
      {/* Top Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">
              Yönetici Kontrol Merkezi
            </div>
            <h1 className="text-2xl font-bold mt-1">Platform Yönetim & Denetim Paneli</h1>
            <p className="text-xs text-stone-400 mt-1">
              Akreditasyon onayları, komisyon modelleri ve işlem denetim kayıtları.
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Tüm platform verilerini fabrika ayarlarına sıfırlamak istiyor musunuz?')) {
                resetAllData();
              }
            }}
            className="px-4 py-2 text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Demo Verileri Sıfırla</span>
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-stone-800 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('kpis')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'kpis' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            Platform Metrikleri & Hacim
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'verifications' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            Doğrulama & Akreditasyon Onayları ({pendingVerificationsCount})
          </button>
          <button
            onClick={() => setActiveTab('commission')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'commission' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            Komisyon Modeli & Oranları
          </button>
        </div>
      </div>

      {/* TAB 1: KPIS & METRICS */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-1">
              <div className="text-xs text-stone-400 uppercase font-semibold">Toplam Rezervasyon Hacmi</div>
              <div className="text-2xl font-bold text-stone-900 tabular-nums">{formatCurrencyTRY(totalVolume)}</div>
              <div className="text-[11px] text-stone-500">Platform üzerinden gerçekleşen işlemler</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-1">
              <div className="text-xs text-stone-400 uppercase font-semibold">Platform Komisyon Geliri</div>
              <div className="text-2xl font-bold text-amber-800 tabular-nums">{formatCurrencyTRY(totalCommissionEarned)}</div>
              <div className="text-[11px] text-emerald-700 font-medium">%{settings.commissionRate} Ortalama Komisyon</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-1">
              <div className="text-xs text-stone-400 uppercase font-semibold">Aktif Yayındaki İlanlar</div>
              <div className="text-2xl font-bold text-stone-900 tabular-nums">{activeListingsCount}</div>
              <div className="text-[11px] text-stone-500">Doğrulanmış işveren ilanları</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-1">
              <div className="text-xs text-stone-400 uppercase font-semibold">Onay Bekleyen Belgeler</div>
              <div className="text-2xl font-bold text-amber-900 tabular-nums">{pendingVerificationsCount}</div>
              <div className="text-[11px] text-stone-500">İncelenmeyi bekleyen sicil evrakları</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFICATION & ACCREDITATION QUEUE (Section 7.4 Requirement) */}
      {activeTab === 'verifications' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">Akreditasyon & Belge İnceleme Havuzu</h2>
            <span className="text-xs text-stone-500">İlan yayınlama ve profil yetkileri bu onaya bağlıdır</span>
          </div>

          {verifications.length === 0 ? (
            <p className="text-xs text-stone-500">Onay bekleyen başvuru bulunmamaktadır.</p>
          ) : (
            <div className="space-y-4">
              {verifications.map((v) => (
                <div
                  key={v.id}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{v.entityName}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 uppercase">
                        {v.accountType === 'business'
                          ? 'İşletme'
                          : v.accountType === 'artist'
                          ? 'Bireysel Sanatçı'
                          : 'Ensemble Topluluğu'}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 flex flex-wrap gap-2">
                      {v.documents.map((doc, i) => (
                        <a
                          key={i}
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-800 underline hover:text-amber-950 flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{doc.title}</span>
                        </a>
                      ))}
                    </div>

                    <div className="text-[11px] text-stone-400">Başvuru Zamanı: {v.submittedAt}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {v.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => adminApproveVerification(v.id)}
                          className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Onayla</span>
                        </button>
                        <button
                          onClick={() => setRejectingId(v.id)}
                          className="px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 rounded-xl transition-colors"
                        >
                          Reddet / Düzeltme İste
                        </button>
                      </>
                    ) : (
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                          v.status === 'approved' ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {v.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMMISSION ENGINE CONFIGURATION (Section 13.2 Requirement) */}
      {activeTab === 'commission' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm max-w-2xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-stone-900">Komisyon Modeli ve Oran Yönetimi</h2>
            <p className="text-xs text-stone-500 mt-1">
              Finansal hesaplamalar sunucu tarafında mutlak kurallarla işletilir.
            </p>
          </div>

          {savedSettingsNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900 rounded-xl">
              Komisyon ayarları başarıyla güncellendi!
            </div>
          )}

          <form onSubmit={handleSaveCommission} className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-900 block">Varsayılan Komisyon Modeli</label>

              {/* Model A Selection */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                  commissionModel === 'A_EMPLOYER_PAYS'
                    ? 'border-amber-800 bg-amber-50/50'
                    : 'border-stone-200 bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="commModel"
                  value="A_EMPLOYER_PAYS"
                  checked={commissionModel === 'A_EMPLOYER_PAYS'}
                  onChange={() => setCommissionModel('A_EMPLOYER_PAYS')}
                  className="w-4 h-4 text-amber-800 mt-1"
                />
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    Model A — Komisyon İşverenin Ödemesine Eklenir (Önerilen)
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Sanatçı ilanda gördüğü net hakediş tutarını alır (örn. 20.000 TL). Platform komisyonu işverenin toplam ödeme adımında üzerine eklenir (örn. 22.000 TL).
                  </p>
                </div>
              </label>

              {/* Model B Selection */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                  commissionModel === 'B_ARTIST_DEDUCTS'
                    ? 'border-amber-800 bg-amber-50/50'
                    : 'border-stone-200 bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="commModel"
                  value="B_ARTIST_DEDUCTS"
                  checked={commissionModel === 'B_ARTIST_DEDUCTS'}
                  onChange={() => setCommissionModel('B_ARTIST_DEDUCTS')}
                  className="w-4 h-4 text-amber-800 mt-1"
                />
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    Model B — Komisyon Sanatçı Hakedişinden Kesilir
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    İşverenin ödediği toplam bedelden platform komisyonu kesilir ve kalanı sanatçıya aktarılır (örn. 20.000 TL toplam - 2.000 TL komisyon = 18.000 TL net).
                  </p>
                </div>
              </label>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-900 block mb-1">
                Platform Komisyon Oranı (%)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-32 text-sm font-bold p-3 border border-stone-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-sm"
            >
              Ayarları Kaydet
            </button>
          </form>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-left shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-stone-900">Başvuruyu Reddet / Düzeltme İste</h3>
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1">Gerekçe / Eksik Belge Notu</label>
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Vergi levhası yılı güncel değil, imza sirküsü eksik vb..."
                className="w-full text-xs p-3 border border-stone-200 rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Vazgeç
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl"
              >
                Kararı Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
