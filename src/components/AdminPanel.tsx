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
  const [confirmReset, setConfirmReset] = useState(false);

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
      <div className="bg-gradient-to-br from-[#16274e] via-[#12161b] to-[#0c0e12] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="label-caps text-[#ff8a65]">
              Yönetici Kontrol Merkezi
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold mt-1 tracking-tight">Platform Yönetim & Denetim Paneli</h1>
            <p className="text-xs text-slate-300 mt-1">
              Akreditasyon onayları, komisyon modelleri ve işlem denetim kayıtları.
            </p>
          </div>

          {confirmReset ? (
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3 py-2 self-start sm:self-auto">
              <span className="text-xs text-slate-200">Tüm veriler sıfırlansın mı?</span>
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setConfirmReset(false);
                }}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#f25922] hover:bg-[#ad3300] rounded-lg transition-colors"
              >
                Evet, Sıfırla
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg transition-colors"
              >
                Vazgeç
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="px-4 py-2 text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Demo Verileri Sıfırla</span>
            </button>
          )}
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-white/10 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('kpis')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'kpis' ? 'bg-[#f25922] text-white font-bold shadow-sm' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            Platform Metrikleri & Hacim
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verifications')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'verifications' ? 'bg-[#f25922] text-white font-bold shadow-sm' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            Doğrulama & Akreditasyon Onayları ({pendingVerificationsCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('commission')}
            className={`px-4 py-2 font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'commission' ? 'bg-[#f25922] text-white font-bold shadow-sm' : 'text-slate-300 hover:bg-white/10'
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
            <div className="bg-white dark:bg-[#13213e] p-6 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] dark:text-slate-400">Toplam Rezervasyon Hacmi</div>
              <div className="font-display text-2xl font-bold text-[#0f172a] dark:text-white tabular-nums">{formatCurrencyTRY(totalVolume)}</div>
              <div className="text-[11px] text-[#475569] dark:text-slate-300">Platform üzerinden gerçekleşen işlemler</div>
            </div>

            <div className="bg-white dark:bg-[#13213e] p-6 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] dark:text-slate-400">Platform Komisyon Geliri</div>
              <div className="font-display text-2xl font-bold text-[#f25922] tabular-nums">{formatCurrencyTRY(totalCommissionEarned)}</div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">%{settings.commissionRate} Ortalama Komisyon</div>
            </div>

            <div className="bg-white dark:bg-[#13213e] p-6 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] dark:text-slate-400">Aktif Yayındaki İlanlar</div>
              <div className="font-display text-2xl font-bold text-[#0f172a] dark:text-white tabular-nums">{activeListingsCount}</div>
              <div className="text-[11px] text-[#475569] dark:text-slate-300">Doğrulanmış işveren ilanları</div>
            </div>

            <div className="bg-white dark:bg-[#13213e] p-6 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] dark:text-slate-400">Onay Bekleyen Belgeler</div>
              <div className="font-display text-2xl font-bold text-[#16274e] dark:text-white tabular-nums">{pendingVerificationsCount}</div>
              <div className="text-[11px] text-[#475569] dark:text-slate-300">İncelenmeyi bekleyen sicil evrakları</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFICATION & ACCREDITATION QUEUE */}
      {activeTab === 'verifications' && (
        <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-[#0f172a] dark:text-white">Akreditasyon & Belge İnceleme Havuzu</h2>
            <span className="text-xs text-[#64748b] dark:text-slate-400">İlan yayınlama ve profil yetkileri bu onaya bağlıdır</span>
          </div>

          {verifications.length === 0 ? (
            <p className="text-xs text-[#64748b] dark:text-slate-400">Onay bekleyen başvuru bulunmamaktadır.</p>
          ) : (
            <div className="space-y-4">
              {verifications.map((v) => (
                <div
                  key={v.id}
                  className="p-5 rounded-2xl bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-[#0f172a] dark:text-white text-sm">{v.entityName}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#e9edff] dark:bg-[#1e335a] text-[#16274e] dark:text-slate-200 uppercase">
                        {v.accountType === 'business'
                          ? 'İşletme'
                          : v.accountType === 'artist'
                          ? 'Bireysel Sanatçı'
                          : 'Sanat Topluluğu'}
                      </span>
                    </div>

                    <div className="text-xs text-[#475569] dark:text-slate-300 flex flex-wrap gap-2">
                      {v.documents.map((doc, i) => (
                        <a
                          key={i}
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#16274e] dark:text-slate-200 underline hover:text-[#f25922] flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{doc.title}</span>
                        </a>
                      ))}
                    </div>

                    <div className="text-[11px] text-[#64748b] dark:text-slate-400">Başvuru Zamanı: {v.submittedAt}</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {v.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => adminApproveVerification(v.id)}
                          className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Onayla</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectingId(v.id)}
                          className="px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                        >
                          Reddet / Düzeltme İste
                        </button>
                      </>
                    ) : (
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                          v.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300'
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

      {/* TAB 3: COMMISSION ENGINE CONFIGURATION */}
      {activeTab === 'commission' && (
        <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] shadow-xs max-w-2xl space-y-6">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0f172a] dark:text-white">Komisyon Modeli ve Oran Yönetimi</h2>
            <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1">
              Finansal hesaplamalar sunucu tarafında mutlak kurallarla işletilir.
            </p>
          </div>

          {savedSettingsNotice && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-900 dark:text-emerald-300 rounded-xl">
              Komisyon ayarları başarıyla güncellendi!
            </div>
          )}

          <form onSubmit={handleSaveCommission} className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#0f172a] dark:text-white block">Varsayılan Komisyon Modeli</label>

              {/* Model A Selection */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                  commissionModel === 'A_EMPLOYER_PAYS'
                    ? 'border-[#16274e] dark:border-[#f25922] bg-[#f1f3ff] dark:bg-[#0f1c38]'
                    : 'border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38]'
                }`}
              >
                <input
                  type="radio"
                  name="commModel"
                  value="A_EMPLOYER_PAYS"
                  checked={commissionModel === 'A_EMPLOYER_PAYS'}
                  onChange={() => setCommissionModel('A_EMPLOYER_PAYS')}
                  className="w-4 h-4 text-[#16274e] mt-1"
                />
                <div>
                  <div className="text-xs font-bold text-[#0f172a] dark:text-white">
                    Model A — Komisyon İşverenin Ödemesine Eklenir (Önerilen)
                  </div>
                  <p className="text-xs text-[#475569] dark:text-slate-300 mt-0.5">
                    Sanatçı ilanda gördüğü net hakediş tutarını alır (örn. 20.000 TL). Platform komisyonu işverenin toplam ödeme adımında üzerine eklenir (örn. 22.000 TL).
                  </p>
                </div>
              </label>

              {/* Model B Selection */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                  commissionModel === 'B_ARTIST_DEDUCTS'
                    ? 'border-[#16274e] dark:border-[#f25922] bg-[#f1f3ff] dark:bg-[#0f1c38]'
                    : 'border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38]'
                }`}
              >
                <input
                  type="radio"
                  name="commModel"
                  value="B_ARTIST_DEDUCTS"
                  checked={commissionModel === 'B_ARTIST_DEDUCTS'}
                  onChange={() => setCommissionModel('B_ARTIST_DEDUCTS')}
                  className="w-4 h-4 text-[#16274e] mt-1"
                />
                <div>
                  <div className="text-xs font-bold text-[#0f172a] dark:text-white">
                    Model B — Komisyon Sanatçı Hakedişinden Kesilir
                  </div>
                  <p className="text-xs text-[#475569] dark:text-slate-300 mt-0.5">
                    İşverenin ödediği toplam bedelden platform komisyonu kesilir ve kalanı sanatçıya aktarılır (örn. 20.000 TL toplam - 2.000 TL komisyon = 18.000 TL net).
                  </p>
                </div>
              </label>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0f172a] dark:text-white block mb-1">
                Platform Komisyon Oranı (%)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-32 text-sm font-bold p-3 border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] rounded-xl text-[#0f172a] dark:text-white tabular-nums"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#16274e] dark:bg-[#f25922] hover:opacity-90 rounded-xl transition-colors shadow-sm"
            >
              Ayarları Kaydet
            </button>
          </form>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-slate-950/65 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#13213e] rounded-3xl max-w-md w-full p-6 text-left shadow-2xl border border-[#e2e8f0] dark:border-[#1e335a] space-y-4">
            <h3 className="text-base font-bold text-[#0f172a] dark:text-white">Başvuruyu Reddet / Düzeltme İste</h3>
            <div>
              <label className="text-xs font-semibold text-[#475569] dark:text-slate-300 block mb-1">Gerekçe / Eksik Belge Notu</label>
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Vergi levhası yılı güncel değil, imza sirküsü eksik vb..."
                className="w-full text-xs p-3 border border-[#e2e8f0] dark:border-[#1e335a] bg-[#f8fafc] dark:bg-[#0f1c38] text-[#0f172a] dark:text-white rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 text-xs font-semibold text-[#475569] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e335a] rounded-xl"
              >
                Vazgeç
              </button>
              <button
                type="button"
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
