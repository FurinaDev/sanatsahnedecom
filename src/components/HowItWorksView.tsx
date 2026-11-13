import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Music2,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  Star,
  FileCheck2,
  ArrowRight,
} from 'lucide-react';

export const HowItWorksView: React.FC = () => {
  const { navigateTo, switchRole } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left space-y-12">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="label-caps text-[#f25922]">
          Uçtan Uca Organizasyon Mimarisi
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0f172a] dark:text-white">
          sanatsahnede.com Nasıl Çalışır?
        </h1>
        <p className="text-sm text-[#475569] dark:text-slate-300 leading-relaxed">
          Klasik teklif panolarının aksine, sanatçıları fiyat kırma yarışına sokmayan;
          sabit bütçeli, sözleşmeli ve korumalı ödeme güvenceli iki taraflı dijital hizmet pazaryeri.
        </p>
      </div>

      {/* Two Sides Comparison: İşveren vs Sanatçı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: İşveren Akışı */}
        <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] elevation-card space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#e2e8f0] dark:border-[#1e335a]">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#0f1c38] text-[#16274e] dark:text-[#ffb59e] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[#0f172a] dark:text-white">Hizmet Arayan İşletmeler İçin</h2>
              <p className="text-xs text-[#64748b] dark:text-slate-400">Oteller, Kültür Kurumları, Organizatörler</p>
            </div>
          </div>

          <div className="space-y-5 text-xs text-[#475569] dark:text-slate-300">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#16274e] dark:bg-[#f25922] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 tabular-nums">
                1
              </span>
              <div>
                <strong className="text-[#0f172a] dark:text-white block text-sm">Doğrulama ve Akreditasyon</strong>
                Vergi levhası ve yetkili bilgileri yönetici tarafından onaylanır. Bu sayede sanatçılar yalnızca meşru kurumlara başvurur.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#16274e] dark:bg-[#f25922] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 tabular-nums">
                2
              </span>
              <div>
                <strong className="text-[#0f172a] dark:text-white block text-sm">Sabit Bütçeli İlan Oluşturma</strong>
                Etkinlik tarihi, aranan uzmanlık alanı, süre ve net sanatçı bütçesi belirlenerek ilan yayına alınır.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#16274e] dark:bg-[#f25922] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 tabular-nums">
                3
              </span>
              <div>
                <strong className="text-[#0f172a] dark:text-white block text-sm">Aday Karşılaştırma &amp; Seçim</strong>
                Gelen başvurular video kayıtları, portfolyo seçkisi, değerlendirme puanı ve iptal oranına göre filtrelenerek uygun sanatçı veya topluluk seçilir.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#16274e] dark:bg-[#f25922] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 tabular-nums">
                4
              </span>
              <div>
                <strong className="text-[#0f172a] dark:text-white block text-sm">Sözleşme &amp; Korumalı Ödeme</strong>
                Dijital sözleşme onaylanır. İşveren ödemeyi yapar; bütçe etkinlik tamamlanana kadar havuzda güvende tutulur.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#16274e] dark:bg-[#f25922] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 tabular-nums">
                5
              </span>
              <div>
                <strong className="text-[#0f172a] dark:text-white block text-sm">Tamamlanma Onayı &amp; Değerlendirme</strong>
                Sanatçı &quot;İşi Tamamladım&quot; der, işveren onaylar; sanatçıya hakedişi serbest bırakılır ve karşılıklı değerlendirme yapılır.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              switchRole('business_owner');
              navigateTo('business_dashboard');
            }}
            className="w-full py-3 text-xs font-bold text-white bg-[#16274e] dark:bg-[#f25922] hover:bg-[#111d38] dark:hover:bg-[#d94b18] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>İşletme Olarak Başlayın</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: Sanatçı Akışı */}
        <div className="bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] elevation-card space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#e2e8f0] dark:border-[#1e335a]">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-[#f25922]/15 text-[#ad3300] dark:text-[#ffb59e] flex items-center justify-center shrink-0">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[#0f172a] dark:text-white">Hizmet Veren Sanatçılar İçin</h2>
              <p className="text-xs text-[#64748b] dark:text-slate-400">Sanatçılar, İcracılar &amp; Kolektif Topluluklar</p>
            </div>
          </div>

          <div className="space-y-5 text-xs text-[#475569] dark:text-slate-300">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#f25922] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 tabular-nums">
                1
              </span>
              <div>
                <strong className="text-[#0f172a] dark:text-white block text-sm">Bağımsız Web Profili &amp; Portfolyo</strong>
                Eğitim, performans kayıtları ve repertuvarınızı içeren URL tabanlı herkese açık prestijli profil sayfası oluşturun.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#f25922] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 tabular-nums">
                2
              </span>
              <div>
                <strong className="text-[#0f172a] dark:text-white block text-sm">Sabit Bütçeli İlanlara Başvuru</strong>
                Fiyat düşürme teklifi yok! İlandaki net hakediş tutarını görerek tek tıkla ve portfolyo notunuzla başvurun.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#f25922] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 tabular-nums">
                3
              </span>
              <div>
                <strong className="text-[#0f172a] dark:text-white block text-sm">Bireysel veya Topluluk Adına Başvuru</strong>
                Tek başınıza solo performans için veya üyesi olduğunuz kolektif ve oda topluluğunun kadrosunu belirterek başvuru yapın.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#f25922] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 tabular-nums">
                4
              </span>
              <div>
                <strong className="text-[#0f172a] dark:text-white block text-sm">Ödeme Garantisi ile Sahne Alın</strong>
                İşveren ödemeyi yapmadan rezervasyon kesinleşmez; sahneye çıkmadan önce paranızın havuzda olduğunu bilirsiniz.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#f25922] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 tabular-nums">
                5
              </span>
              <div>
                <strong className="text-[#0f172a] dark:text-white block text-sm">Zamanında Kesintisiz Hakediş</strong>
                Performans bitiminde &quot;İşi Tamamladım&quot; bildiriminiz ve işveren onayıyla hakediş hesabınıza aktarılır.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              switchRole('artist');
              navigateTo('listings');
            }}
            className="w-full py-3 text-xs font-bold text-[#16274e] dark:text-white bg-[#f1f3ff] dark:bg-[#0f1c38] hover:bg-[#e1e8fd] dark:hover:bg-[#1e335a] border border-transparent dark:border-[#1e335a] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>İlanları Keşfedin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Unique Pillar: Acil İkame Sanatçı Sistemi */}
      <div className="bg-gradient-to-br from-[#16274e] via-[#12161b] to-[#0c0e12] text-white p-8 sm:p-10 rounded-3xl space-y-4 shadow-xl border border-white/10">
        <div className="flex items-center gap-2 text-[#ff8a65] label-caps">
          <AlertTriangle className="w-4 h-4" />
          <span>Sektörel Çözüm: Acil İkame Sanatçı Güvencesi</span>
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight">Bir Sanatçı Son Dakika Gelemezse Ne Olur?</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Kültür-sanat sektöründeki en büyük risk, sanatçının etkinlikten 1 gün önce sağlık veya mücbir sebeple gelemeyeceğini bildirmesidir.
          Sistemimiz bu anı otomatik yönetir: İptal kaydı işlenir, sanatçının iptal oranı güncellenir, işveren için aynı etkinlik detaylarıyla <strong>1-Tıkla Acil İkame İlanı</strong> açılır ve platformdaki uygun sanatçılara anında öncelikli bildirim gönderilir. Mekân hiçbir zaman sanatsız ve müziksiz kalmaz.
        </p>
      </div>
    </div>
  );
};
