import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Building2,
  Sparkles,
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
    <div className="space-y-12 text-left pb-16">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          İletişim & Koordinasyon Masası
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 mt-1">
          Kültür-Sanat Ekibimizle İletişime Geçin
        </h1>
        <p className="text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
          Sanatçı başvuruları, mekan akreditasyonu, son dakika acil ikame operasyonları ve kurumsal festival iş birlikleri için doğrudan koordinasyon masamıza ulaşabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-white rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              Doğrudan İletişim Kanalları
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-stone-800">Sahne Destek Hattı</div>
                  <div className="text-stone-600 mt-0.5">+90 (212) 244 88 00</div>
                  <div className="text-[11px] text-stone-400">Pazartesi – Pazar: 09:00 – 23:00</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0a66c2] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-stone-800">Koordinasyon & Acil İkame</div>
                  <div className="text-stone-600 mt-0.5">destek@sahnealani.com</div>
                  <div className="text-[11px] text-stone-400">Acil durumlarda 15 dk yanıt süresi</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-stone-800">Merkez Ofis & Koordinasyon</div>
                  <div className="text-stone-600 mt-0.5">
                    İstiklal Caddesi No: 142, Beyoğlu, İstanbul
                  </div>
                  <div className="text-[11px] text-stone-400">Kültür ve Sanat İnisiyatifi Yerleşkesi</div>
                </div>
              </div>
            </div>
          </div>

          {/* SLA / Güvence Kutusu */}
          <div className="p-5 bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-2xl border border-stone-800 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Güvenli Sahne Garantisi</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Platformumuzda gerçekleşen tüm anlaşmalar, sabit hakediş garantisi ve acil ikame sanatçı desteği kapsamındadır. Etkinlik günü sanatçı veya işletmeyle ilgili herhangi bir aksaklıkta operasyon ekibimiz doğrudan devreye girer.
            </p>
          </div>
        </div>

        {/* Right Col: Contact Message Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Mesajınız Alındı</h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                Talebiniz sahne koordinasyon ekibimize iletilmiştir. En kısa sürede belirttiğiniz iletişim adresi üzerinden dönüş yapılacaktır.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Yeni Mesaj Gönder
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">Bize Mesaj Gönderin</h3>
                <p className="text-xs text-stone-500">
                  Aşağıdaki formu doldurarak ilgili operasyon birimimize doğrudan yazabilirsiniz.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">
                    Adınız Soyadınız *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Adınız Soyadınız"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">
                    E-Posta Adresiniz *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ornek@alan.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">
                    Telefon Numaranız
                  </label>
                  <input
                    type="tel"
                    placeholder="+90 5xx xxx xx xx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">
                    İletişim Konusu
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none cursor-pointer"
                  >
                    <option value="genel">Genel Bilgi & Destek</option>
                    <option value="ikame">Acil İkame Sanatçı İhtiyacı</option>
                    <option value="mekan">Mekân & Kurum Doğrulaması</option>
                    <option value="sanatci">Sanatçı Kayıt & Portfolyo</option>
                    <option value="isbirligi">Festival & Kurumsal İş Birliği</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">
                  Mesajınız *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Sahne tarihi, bütçe, talep edilen müzisyen formatı veya sorunuzu detaylandırınız..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  Mesajınız doğrudan nöbetçi koordinatöre iletilir.
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
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
