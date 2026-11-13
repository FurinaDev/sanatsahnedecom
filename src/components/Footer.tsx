import React from 'react';
import { useApp } from '../context/AppContext';
import { BrandSymbol } from './ui/BrandSymbol';
import { Radio, Video, Share2, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-white dark:bg-[#070B14] border-t border-slate-200 dark:border-slate-800/80 pt-14 sm:pt-16 pb-10 text-slate-600 dark:text-slate-400 text-sm text-left transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 items-start">
          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 mb-5 text-left group cursor-pointer"
            >
              <div className="w-11 h-9 bg-[#E45424] rounded-xl flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-105 px-1.5 shadow-sm">
                <BrandSymbol className="w-full h-full text-white" strokeWidth={3.6} />
              </div>
              <span className="font-sans font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white leading-none whitespace-nowrap">
                SANAT<span className="text-[#E45424]">SAHNEDE</span>.COM
              </span>
            </button>

            <div className="mb-6 max-w-md space-y-3 text-xs sm:text-sm leading-relaxed">
              <p className="text-slate-800 dark:text-slate-200 font-normal text-sm sm:text-[15px]">
                Her <strong className="font-bold text-slate-900 dark:text-white">sanat</strong> bir{' '}
                <strong className="font-bold text-slate-900 dark:text-white">sahneyi</strong> hak eder.
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Farklı sanat disiplinlerinden sanatçıları, toplulukları, organizatörleri ve sahneleri bir araya getiriyor; sanatsal üretimin, iş birliklerinin ve yeni buluşmaların önünü açıyoruz.
              </p>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 pt-0.5">
                Bir{' '}
                <a
                  href="https://cagdasmuzik.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#E45424] hover:text-[#c94317] underline-offset-4 hover:underline transition-colors"
                >
                  Çağdaş Müzik Platformu
                </a>{' '}
                girişimidir.
              </p>
            </div>

            <div className="flex items-center gap-2.5 text-slate-400">
              <button
                type="button"
                aria-label="Etkinlik Takvimi"
                onClick={() => navigateTo('events')}
                className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:text-[#E45424] transition-colors cursor-pointer"
              >
                <Radio className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Sanatçılar ve Kayıtlar"
                onClick={() => navigateTo('artists_directory')}
                className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:text-[#E45424] transition-colors cursor-pointer"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="İletişim"
                onClick={() => navigateTo('contact')}
                className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:text-[#E45424] transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Link Columns — Symmetric 3-Column Alignment */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10 lg:pt-2">
            {/* Column 2: Keşfet */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                Keşfet
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button onClick={() => navigateTo('listings')} className="text-left hover:text-[#E45424] transition-colors cursor-pointer">
                    Açık İlanlar
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('artists_directory')} className="text-left hover:text-[#E45424] transition-colors cursor-pointer">
                    Sanatçılar Dizini
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('ensembles_directory')} className="text-left hover:text-[#E45424] transition-colors cursor-pointer">
                    Topluluklar &amp; Kolektifler
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('businesses_directory')} className="text-left hover:text-[#E45424] transition-colors cursor-pointer">
                    İşletmeler &amp; Mekânlar
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('events')} className="text-left hover:text-[#E45424] transition-colors cursor-pointer">
                    Etkinlik Ajandası
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Kurumsal */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                Kurumsal
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button onClick={() => navigateTo('about')} className="text-left hover:text-[#E45424] transition-colors cursor-pointer">
                    Hakkımızda
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('team')} className="text-left hover:text-[#E45424] transition-colors cursor-pointer">
                    Ekibimiz
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('how_it_works')} className="text-left hover:text-[#E45424] transition-colors cursor-pointer">
                    Nasıl Çalışır?
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('how_it_works')} className="text-left hover:text-[#E45424] transition-colors cursor-pointer">
                    Güvenli Ödeme &amp; Sözleşme
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('contact')} className="text-left hover:text-[#E45424] transition-colors cursor-pointer">
                    İletişim &amp; Destek
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Yasal & Destek */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                Yasal &amp; Destek
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button onClick={() => navigateTo('how_it_works')} className="text-left hover:text-[#E45424] transition-colors cursor-pointer">
                    Kullanım Koşulları
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('contact')} className="text-left hover:text-[#E45424] transition-colors cursor-pointer">
                    KVKK Aydınlatma Metni
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('contact')} className="text-left hover:text-[#E45424] transition-colors cursor-pointer">
                    Mesafeli Hizmet Sözleşmesi
                  </button>
                </li>
                <li className="text-slate-500 dark:text-slate-400 pt-1">
                  destek@sanatsahnede.com
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-7 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center justify-center w-8 h-6 rounded-md bg-slate-100 dark:bg-slate-800/80 text-[#E45424] px-1 shrink-0">
              <BrandSymbol className="w-full h-full" strokeWidth={4} />
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-0.5 lg:gap-2.5 text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200 inline-flex flex-wrap items-center gap-1">
                <span>&copy; 2026 Sanat Sahnede</span>
                <span className="font-normal text-slate-400 dark:text-slate-500">
                  (
                  <a
                    href="https://sanatsahnede.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#E45424] hover:text-[#c94317] transition-colors"
                  >
                    <span>sanatsahnede.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  )
                </span>
              </span>
              <span className="hidden lg:inline text-slate-300 dark:text-slate-700" aria-hidden="true">
                &middot;
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Çağdaş Müzik Platformu güvencesiyle &mdash; Tüm hakları saklıdır.
              </span>
            </div>
          </div>

          <a
            href="https://cagdasmuzik.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E45424] hover:text-[#c94317] transition-colors shrink-0 self-start sm:self-auto"
          >
            <span>cagdasmuzik.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
