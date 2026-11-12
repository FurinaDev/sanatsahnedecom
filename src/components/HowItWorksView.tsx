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
        <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
          Uçtan Uca Organizasyon Mimarisi
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
          SahneSanat Nasıl Çalışır?
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Klasik teklif panolarının aksine, sanatçıları fiyat kırma yarışına sokmayan;
          sabit bütçeli, sözleşmeli ve korumalı ödeme güvenceli iki taraflı dijital hizmet pazaryeri.
        </p>
      </div>

      {/* Two Sides Comparison: İşveren vs Sanatçı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: İşveren Akışı */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Hizmet Arayan İşletmeler İçin</h2>
              <p className="text-xs text-stone-500">Oteller, Kültür Kurumları, Organizatörler</p>
            </div>
          </div>

          <div className="space-y-5 text-xs text-stone-700">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-stone-900 block text-sm">Doğrulama ve Akreditasyon</strong>
                Vergi levhası ve yetkili bilgileri yönetici tarafından onaylanır. Bu sayede sanatçılar yalnızca meşru kurumlara başvurur.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-stone-900 block text-sm">Sabit Bütçeli İlan Oluşturma</strong>
                Etkinlik tarihi, aranan enstrümanlar, süre ve net sanatçı bütçesi belirlenerek ilan yayına alınır.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-stone-900 block text-sm">Aday Karşılaştırma & Seçim</strong>
                Gelen başvurular video kayıtları, repertuvar matrisi, değerlendirme puanı ve iptal oranına göre filtrelenerek uygun sanatçı/ensemble seçilir.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                4
              </span>
              <div>
                <strong className="text-stone-900 block text-sm">Sözleşme & Korumalı Ödeme</strong>
                Dijital sözleşme onaylanır. İşveren ödemeyi yapar; bütçe etkinlik tamamlanana kadar havuzda güvende tutulur.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                5
              </span>
              <div>
                <strong className="text-stone-900 block text-sm">Tamamlanma Onayı & Değerlendirme</strong>
                Sanatçı "İşi Tamamladım" der, işveren onaylar; sanatçıya hakedişi serbest bırakılır ve karşılıklı değerlendirme yapılır.
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              switchRole('business_owner');
              navigateTo('business_dashboard');
            }}
            className="w-full py-3 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span>İşletme Olarak Başlayın</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: Sanatçı Akışı */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Hizmet Veren Sanatçılar İçin</h2>
              <p className="text-xs text-stone-500">Müzisyenler, Oda Müziği & Ensemble Toplulukları</p>
            </div>
          </div>

          <div className="space-y-5 text-xs text-stone-700">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-stone-900 block text-sm">Bağımsız Web Profili & Audition</strong>
                Eğitim, video performansları ve repertuvarınızı içeren URL tabanlı herkese açık prestijli profil sayfası oluşturun.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-stone-900 block text-sm">Sabit Bütçeli İlanlara Başvuru</strong>
                Fiyat düşürme teklifi yok! İlandaki net hakediş tutarını görerek tek tıkla ve repertuvar notunuzla başvurun.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-stone-900 block text-sm">Bireysel veya Ensemble Adına Başvuru</strong>
                Tek başınıza solo dinleti için veya üyesi olduğunuz yaylı/nefesli topluluğunun kadrosunu belirterek başvuru yapın.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                4
              </span>
              <div>
                <strong className="text-stone-900 block text-sm">Ödeme Garantisi ile Sahne Alın</strong>
                İşveren ödemeyi yapmadan rezervasyon kesinleşmez; sahneye çıkmadan önce paranızın havuzda olduğunu bilirsiniz.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                5
              </span>
              <div>
                <strong className="text-stone-900 block text-sm">Zamanında Kesintisiz Hakediş</strong>
                Performans bitiminde "İşi Tamamladım" bildiriminiz ve işveren onayıyla hakediş hesabınıza aktarılır.
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              switchRole('artist');
              navigateTo('listings');
            }}
            className="w-full py-3 text-xs font-bold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span>İlanları Keşfedin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Unique Pillar: Acil İkame Sanatçı Sistemi (Section 14) */}
      <div className="bg-stone-900 text-white p-8 sm:p-10 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>Sektörel Çözüm: Acil İkame Sanatçı Güvencesi</span>
        </div>
        <h2 className="text-2xl font-bold">Bir Sanatçı Son Dakika Gelemezse Ne Olur?</h2>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
          Kültür-sanat sektöründeki en büyük risk, sanatçının etkinlikten 1 gün önce sağlık veya mücbir sebeple gelemeyeceğini bildirmesidir.
          Sistemimiz bu anı otomatik yönetir: İptal kaydı işlenir, sanatçının iptal oranı güncellenir, işveren için aynı etkinlik detaylarıyla <strong>1-Tıkla Acil İkame İlanı</strong> açılır ve platformdaki uygun sanatçılara anında öncelikli bildirim gönderilir. Mekân hiçbir zaman müziksiz kalmaz.
        </p>
      </div>
    </div>
  );
};
