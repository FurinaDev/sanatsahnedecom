import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  Music2,
  CalendarPlus,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, navigateTo, switchRole, events } = useApp();

  return (
    <footer className="mt-16 text-left">
      {/* Bespoke Curved Stage Container */}
      <div className="bg-gradient-to-b from-[#181d24] via-[#12161b] to-[#0c0e12] text-stone-300 rounded-3xl border border-stone-800/90 shadow-2xl p-8 sm:p-12 space-y-12 relative overflow-hidden">
        {/* Subtle ambient lighting effects */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Feature Strip: Calendar Quick Add & Stage Dispatch */}
        <div className="relative pb-8 border-b border-stone-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Canlı Sahne Koordinasyon Masası Aktif
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Kültür & Sanat Ajandasını Takviminize Ekleyin
            </h3>
            <p className="text-xs text-stone-400 max-w-xl">
              Platformdaki doğrulanmış konserleri, salon dinletilerini ve festival sahnelerini tek tıkla Google Takvim veya Apple iCal ajandanıza senkronize edin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigateTo('events')}
              className="px-4 py-2.5 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <CalendarPlus className="w-4 h-4 text-stone-900" />
              <span>Etkinlik Ajandasını Aç</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="px-4 py-2.5 text-xs font-semibold text-stone-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
            >
              İletişim & Destek
            </button>
          </div>
        </div>

        {/* 4-Column Structured Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs relative">
          <div className="space-y-3.5">
            <div>
              <span className="text-lg font-black text-white tracking-tight">
                sanatsahnede.com
              </span>
              <div className="text-[11px] text-stone-400 mt-0.5">Kültür ve Canlı Sahne Platformu</div>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Müzisyenleri, oda müziği topluluklarını ve işletmeleri doğrudan buluşturan profesyonel canlı sahne pazaryeri ve organizasyon ağı.
            </p>
            <div className="text-[11px] text-stone-500 flex items-center gap-2 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Sabit hakediş & mesafeli sözleşme standartları</span>
            </div>
          </div>

          {/* Col 2: Sahne & Keşif */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Sahne & Keşif
            </div>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={() => navigateTo('listings')} className="hover:text-amber-400 transition-colors">
                  Aktif Sahne İlanları
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('artists_directory')} className="hover:text-amber-400 transition-colors">
                  Sanatçılar Dizini
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('ensembles_directory')} className="hover:text-amber-400 transition-colors">
                  Topluluklar & Gruplar
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('businesses_directory')} className="hover:text-amber-400 transition-colors">
                  İşletmeler & Salonlar
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Ajanda & Duyuru */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Ajanda & Duyuru
            </div>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={() => navigateTo('events')} className="hover:text-amber-400 transition-colors">
                  Güncel Konser Takvimi
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('events')} className="hover:text-amber-400 transition-colors">
                  Etkinlik Duyurusu Paylaş
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('how_it_works')} className="hover:text-amber-400 transition-colors">
                  Acil İkame Sanatçı Sistemi
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    switchRole('admin');
                    navigateTo('admin_panel');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Platform Yönetici Paneli
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: İletişim & Lokasyon */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Koordinasyon Masası
            </div>
            <div className="space-y-2 text-stone-400 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span>İstiklal Cad. No: 142, Beyoğlu, İstanbul</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>+90 (212) 244 88 00</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>destek@sanatsahnede.com</span>
              </div>
              <div className="text-[11px] text-stone-500 pt-1">
                KVKK & Mesafeli Hizmet Sözleşmesi standartlarına tam uyumludur.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            Copyright &copy; 2026 {settings.brandName || 'SanatSahnede'} (sanatsahnede.com). Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-1.5 text-stone-400 font-medium">
            <span>Çağdaş Müzik Platformu tarafından güçlendirildi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
