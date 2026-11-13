import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ArchitecturalPageHeader } from './ui/ArchitecturalPageHeader';
import {
  ShieldCheck,
  Award,
  Users,
  Building2,
  Compass,
  ArrowRight,
  Layers,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { navigateTo, artists, ensembles, businesses, listings } = useApp();

  const pillars = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#f25922]" />,
      title: 'Şeffaf & Sabit Bütçe Garantisi',
      desc: 'Sanatçıların emeğini koruyan fiyat kırmasız, açık bütçeli ilan sistemi ve dijital escrow ödeme güvencesi.',
    },
    {
      icon: <Layers className="w-5 h-5 text-[#f25922]" />,
      title: 'Çok Disiplinli Sanat Ekosistemi',
      desc: 'Müzik, görsel sanatlar, heykel, edebiyat, sahne sanatları ve bileşik disiplinleri tek bir nitelikli çatı altında buluşturuyoruz.',
    },
    {
      icon: <Award className="w-5 h-5 text-[#f25922]" />,
      title: 'Doğrulanmış Sicil & İtibar',
      desc: 'Diploma, portfolyo, vergi levhası ve resmi kurum belgeleriyle onaylanmış profiller ve şeffaf %0 iptal sicili.',
    },
    {
      icon: <Compass className="w-5 h-5 text-[#f25922]" />,
      title: 'Acil İkame & Süreklilik Ağı',
      desc: 'Etkinliklerin son dakika aksamaması için doğrulanmış sanatçılardan oluşan hızlı ikame ve sahne destek mekanizması.',
    },
  ];

  const disciplines = [
    'Müzik & Oda Toplulukları',
    'Görsel Sanatlar & Sergi',
    'Heykel & Mekân Enstalasyonu',
    'Sahne & Çağdaş Tiyatro',
    'Edebiyat & Yazar Söyleşileri',
    'Bileşik & Disiplinlerarası Sanatlar',
  ];

  return (
    <div className="text-left w-full">
      <ArchitecturalPageHeader
        eyebrow="Çağdaş Müzik Platformu Ekosistemi"
        title="Hakkımızda — SanatSahnede"
        subtitle="Sanatçıların, kolektiflerin ve kültür mekânlarının aracısız, güvenli ve sürdürülebilir bir sahne ekonomisinde buluşması için kurulduk."
        stats={[
          { label: 'Kayıtlı Yetenek', value: `${artists.length + ensembles.length}+` },
          { label: 'Onaylı Mekân', value: `${businesses.length}+`, accent: 'emerald' },
          { label: 'Açık Çağrı', value: `${listings.length} İlan`, accent: 'orange' },
        ]}
      />

      <div className="architectural-grid bg-[#f8fafc] dark:bg-[#0c1527] py-10 sm:py-14 transition-colors">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Editorial Vision Story Card */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-[#13213e] rounded-3xl border border-[#e2e8f0] dark:border-[#1e335a] p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f25922]">
                <Compass className="w-4 h-4" />
                <span>Vizyonumuz &amp; Misyonumuz</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white leading-tight">
                Kültür ve Sanat Üretimini Güvenilir Dijital Altyapıyla Buluşturuyoruz
              </h2>
              <p className="text-sm text-[#475569] dark:text-slate-300 leading-relaxed">
                <strong>SanatSahnede (sanatsahnede.com)</strong>, Çağdaş Müzik Platformu girişimi olarak yalnızca müzisyenleri değil; ressamları, heykeltıraşları, edebiyatçıları, tiyatro ekiplerini ve bileşik sanat kolektiflerini oteller, galeriler, vakıflar ve kurumsal etkinliklerle aynı masada buluşturur.
              </p>
              <p className="text-sm text-[#475569] dark:text-slate-300 leading-relaxed">
                Sözlü anlaşmaların belirsizliğini, son dakika iptallerini ve ödeme gecikmelerini ortadan kaldırarak her performans ve sergi projesine standart dijital sözleşme ve sabit hakediş güvencesi getiriyoruz.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <span className="font-handwriting text-3xl text-[#f25922]">
                  Çağdaş Müzik Platformu güvencesiyle
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div className="rounded-2xl overflow-hidden border border-[#e2e8f0] dark:border-[#1e335a] h-56">
                <img
                  src="/src/assets/images/hero_culture_music_1794440056664.jpg"
                  alt="SanatSahnede Kültür ve Sahne Ekosistemi"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {disciplines.map((d) => (
                  <div
                    key={d}
                    className="px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] text-[11px] font-semibold text-[#16274e] dark:text-slate-200"
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* 4 Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((item) => (
              <article
                key={item.title}
                className="bg-white dark:bg-[#13213e] rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] p-5 shadow-xs hover:border-[#f25922]/50 transition-colors space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#f25922]/10 border border-[#f25922]/25 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-[#0f172a] dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748b] dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>

          {/* Bottom Cross-Navigation Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[#16274e] to-[#203666] border border-[#1e335a] p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg">
            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-extrabold">
                Ekibimizle Tanışın veya Açık Sahne Çağrılarını İnceleyin
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Platformun kürasyon, hukuk ve teknoloji mimarisini yöneten kadromuzu inceleyebilir ya da aktif ilanlara göz atabilirsiniz.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigateTo('team')}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Ekibimizi Gör</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('listings')}
                className="px-5 py-2.5 rounded-xl bg-[#f25922] hover:bg-[#d94b18] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>İlanları Keşfet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
