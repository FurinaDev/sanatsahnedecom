import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ArchitecturalPageHeader } from './ui/ArchitecturalPageHeader';
import { ShieldCheck, Mail, ArrowRight, Layers } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  disciplineFocus: string;
  avatarUrl: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm_efe',
    name: 'Efe Özkan',
    role: 'Kurucu & Sanat Yönetmeni',
    department: 'Sanat & Ekosistem Stratejisi',
    bio: 'Konser piyanisti ve müzik teknolojileri girişimcisi. Türkiye genelinde icracılar için şeffaf sözleşme ve sabit hakediş standartlarını tasarlar.',
    disciplineFocus: 'Müzik & Bileşik Sanatlar',
    avatarUrl: '/src/assets/images/artist_jazz_pianist_1794440057025.jpg',
  },
  {
    id: 'tm_selin',
    name: 'Selin Arslan',
    role: 'Kürasyon & Topluluklar Direktörü',
    department: 'Sanatçı İlişkileri',
    bio: 'Devlet senfoni ve oda müziği deneyimiyle topluluk doğrulama süreçlerini ve sahne kalite standartlarını yönetir.',
    disciplineFocus: 'Oda Müziği & Sahne',
    avatarUrl: '/src/assets/images/artist_cellist_portrait_1794582676514.jpg',
  },
  {
    id: 'tm_aylin',
    name: 'Dr. Aylin Koç',
    role: 'Çok Disiplinli Sanatlar Küratörü',
    department: 'Sergi, Heykel & Edebiyat',
    bio: 'Görsel sanatlar, heykel enstalasyonları, edebiyat söyleşileri ve galeriler arası iş birliklerinin programatik kürasyonunu yürütür.',
    disciplineFocus: 'Görsel Sanatlar & Kürasyon',
    avatarUrl: '/src/assets/images/venue_cultural_foundation_1794582678466.jpg',
  },
  {
    id: 'tm_bora',
    name: 'Bora Soydan',
    role: 'Platform Operasyon & Güvenlik Lideri',
    department: 'Hukuk, Sözleşme & Escrow',
    bio: 'Vergi levhası doğrulama, dijital sözleşme akışları ve acil ikame operasyonlarının kesintisiz işlemesini sağlar.',
    disciplineFocus: 'İşletme & Doğrulama',
    avatarUrl: '/src/assets/images/artist_guitar_vocalist_1794582675464.jpg',
  },
];

export const TeamView: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="text-left w-full">
      <ArchitecturalPageHeader
        eyebrow="Çağdaş Müzik Platformu Kadrosu"
        title="Ekibimiz"
        subtitle="Sanatın her disiplinini anlayan icracılar, küratörler ve teknoloji uzmanlarından oluşan çekirdek ekibimizle tanışın."
        stats={[
          { label: 'Çekirdek Kadro', value: `${TEAM_MEMBERS.length} Uzman` },
          { label: 'Yönetim Yaklaşımı', value: 'Sanatçı Odaklı', accent: 'orange' },
        ]}
      />

      <div className="architectural-grid bg-[#f8fafc] dark:bg-[#0c1527] py-10 sm:py-14 transition-colors">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Team Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM_MEMBERS.map((member, index) => (
              <motion.article
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 460, damping: 32, delay: index * 0.03 }}
                className="group bg-white dark:bg-[#13213e] rounded-2xl border border-[#e2e8f0] dark:border-[#1e335a] hover:border-[#f25922]/60 shadow-xs hover:shadow-lg transition-transform transition-colors duration-200 hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 bg-[#12161b] overflow-hidden">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/20 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#16274e]/95 text-white text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>{member.department}</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 inset-x-3 text-white">
                      <h3 className="text-base font-extrabold">{member.name}</h3>
                      <p className="text-xs font-semibold text-[#ffb59e]">{member.role}</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed">
                      {member.bio}
                    </p>
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f8fafc] dark:bg-[#0f1c38] border border-[#e2e8f0] dark:border-[#1e335a] text-[10px] font-semibold text-[#16274e] dark:text-slate-200">
                      <Layers className="w-3 h-3 text-[#f25922]" />
                      <span>{member.disciplineFocus}</span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-[#f8fafc] dark:bg-[#0f1c38]/80 border-t border-[#e2e8f0] dark:border-[#1e335a] flex items-center justify-between text-[11px]">
                  <span className="font-handwriting text-xl text-[#f25922] leading-none">
                    {member.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateTo('contact')}
                    className="inline-flex items-center gap-1 font-bold text-[#16274e] dark:text-slate-200 hover:text-[#f25922] cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>İletişim</span>
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Join / Advisory Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[#16274e] to-[#203666] border border-[#1e335a] p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg">
            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-extrabold">
                Kürasyon veya Bölge Temsilciliği İçin Bizimle Çalışın
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Türkiye&apos;nin farklı şehirlerindeki kültür vakıfları, konservatuvar mezunları ve sanat inisiyatifleriyle iş birliği ağımızı genişletiyoruz.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigateTo('about')}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Hakkımızda
              </button>
              <button
                type="button"
                onClick={() => navigateTo('contact')}
                className="px-5 py-2.5 rounded-xl bg-[#f25922] hover:bg-[#d94b18] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Bize Ulaşın</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
