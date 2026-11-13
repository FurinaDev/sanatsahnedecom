import React, { useState } from 'react';
import { CustomSelect } from './ui/CustomSelect';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'genel',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="space-y-10 text-left pb-16">
      {/* Header */}
      <div className="pb-6 border-b border-[#e2e8f0] dark:border-[#1e335a]">
        <div className="label-caps text-[#f25922]">
          İletişim &amp; Koordinasyon Masası
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white mt-1">
          Kültür-Sanat Ekibimizle İletişime Geçin
        </h1>
        <p className="text-sm text-[#475569] dark:text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
          Sanatçı başvuruları, mekân akreditasyonu, son dakika acil ikame operasyonları ve kurumsal festival iş birlikleri için doğrudan koordinasyon masamıza ulaşabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-white dark:bg-[#13213e] rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] elevation-card space-y-5">
            <h3 className="font-display text-base font-bold text-[#0f172a] dark:text-white">
              Doğrudan İletişim Kanalları
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-[#f25922]/15 text-[#ad3300] dark:text-[#ffb59e] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#0f172a] dark:text-white">Sahne Destek Hattı</div>
                  <div className="text-[#475569] dark:text-slate-300 mt-0.5 tabular-nums">+90 (212) 244 88 00</div>
                  <div className="text-[11px] text-[#64748b] dark:text-slate-400">Pazartesi – Pazar: 09:00 – 23:00</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#0f1c38] text-[#16274e] dark:text-slate-200 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#0f172a] dark:text-white">Koordinasyon &amp; Acil İkame</div>
                  <div className="text-[#475569] dark:text-slate-300 mt-0.5">destek@sanatsahnede.com</div>
                  <div className="text-[11px] text-[#64748b] dark:text-slate-400">Acil durumlarda 15 dk yanıt süresi</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#0f172a] dark:text-white">Merkez Ofis &amp; Koordinasyon</div>
                  <div className="text-[#475569] dark:text-slate-300 mt-0.5">
                    İstiklal Caddesi No: 142, Beyoğlu, İstanbul
                  </div>
                  <div className="text-[11px] text-[#64748b] dark:text-slate-400">Kültür ve Sanat İnisiyatifi Yerleşkesi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage Nocturne SLA Guarantee Card */}
          <div className="p-6 bg-gradient-to-br from-[#16274e] via-[#12161b] to-[#0c0e12] text-white rounded-2xl border border-white/10 shadow-lg space-y-2.5">
            <div className="flex items-center gap-2 label-caps text-[#ffb59e]">
              <ShieldCheck className="w-4 h-4 text-[#f25922]" />
              <span>Güvenli Sahne Garantisi</span>
            </div>
            <p className="text-xs text-[#dce2f7]/85 leading-relaxed">
              Platformumuzda gerçekleşen tüm anlaşmalar, sabit hakediş garantisi ve acil ikame sanatçı desteği kapsamındadır. Etkinlik günü sanatçı veya işletmeyle ilgili herhangi bir aksaklıkta operasyon ekibimiz doğrudan devreye girer.
            </p>
          </div>
        </div>

        {/* Right Col: Contact Message Form */}
        <div className="lg:col-span-7 bg-white dark:bg-[#13213e] p-6 sm:p-8 rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] elevation-card">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#0f172a] dark:text-white">Mesajınız Alındı</h3>
              <p className="text-xs text-[#475569] dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                Talebiniz sahne koordinasyon ekibimize iletilmiştir. En kısa sürede belirttiğiniz iletişim adresi üzerinden dönüş yapılacaktır.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 text-xs font-bold text-[#16274e] dark:text-white bg-[#f8fafc] dark:bg-[#0f1c38] hover:bg-[#f1f5f9] dark:hover:bg-[#1e335a] border border-[#e2e8f0] dark:border-[#1e335a] rounded-xl transition-colors cursor-pointer"
              >
                Yeni Mesaj Gönder
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-display text-base font-bold text-[#0f172a] dark:text-white">Bize Mesaj Gönderin</h3>
                <p className="text-xs text-[#475569] dark:text-slate-300">
                  Aşağıdaki formu doldurarak ilgili operasyon birimimize doğrudan yazabilirsiniz.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0f172a] dark:text-slate-200 block mb-1">
                    Adınız Soyadınız *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Adınız Soyadınız"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] text-[#0f172a] dark:text-white rounded-xl focus:outline-hidden focus:border-[#f25922]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0f172a] dark:text-slate-200 block mb-1">
                    E-Posta Adresiniz *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ornek@sanatsahnede.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] text-[#0f172a] dark:text-white rounded-xl focus:outline-hidden focus:border-[#f25922]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0f172a] dark:text-slate-200 block mb-1">
                    Telefon Numaranız
                  </label>
                  <input
                    type="tel"
                    placeholder="+90 5xx xxx xx xx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] text-[#0f172a] dark:text-white rounded-xl focus:outline-hidden focus:border-[#f25922]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0f172a] dark:text-slate-200 block mb-1">
                    İletişim Konusu
                  </label>
                  <CustomSelect
                    value={formData.subject}
                    onChange={(val) => setFormData({ ...formData, subject: val })}
                    options={[
                      { value: 'genel', label: 'Genel Bilgi & Destek' },
                      { value: 'ikame', label: 'Acil İkame Sanatçı İhtiyacı' },
                      { value: 'mekan', label: 'Mekân & Kurum Doğrulaması' },
                      { value: 'sanatci', label: 'Sanatçı Kayıt & Portfolyo' },
                      { value: 'isbirligi', label: 'Festival & Kurumsal İş Birliği' },
                    ]}
                    ariaLabel="İletişim Konusu"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0f172a] dark:text-slate-200 block mb-1">
                  Mesajınız *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Sahne tarihi, bütçe, talep edilen sanatçı formatı veya sorunuzu detaylandırınız..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] text-[#0f172a] dark:text-white rounded-xl focus:outline-hidden focus:border-[#f25922]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] text-[#64748b] dark:text-slate-400">
                  Mesajınız doğrudan nöbetçi koordinatöre iletilir.
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-display font-bold text-white bg-[#f25922] hover:bg-[#d94b18] rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Mesajı İlet</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
