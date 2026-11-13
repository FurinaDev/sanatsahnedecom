import React, { useState, useEffect } from 'react';
import { MotionConfig, motion } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ListingsMarketplaceView } from './components/ListingsMarketplaceView';
import { ListingDetailPage } from './components/ListingDetailPage';
import { ArtistsDirectoryView } from './components/ArtistsDirectoryView';
import { EnsemblesDirectoryView } from './components/EnsemblesDirectoryView';
import { BusinessesDirectoryView } from './components/BusinessesDirectoryView';
import { EventsView } from './components/EventsView';
import { ContactView } from './components/ContactView';
import { AboutView } from './components/AboutView';
import { TeamView } from './components/TeamView';
import { ArtistProfileView } from './components/ArtistProfileView';
import { EnsembleProfileView } from './components/EnsembleProfileView';
import { BusinessProfileView } from './components/BusinessProfileView';
import { BusinessDashboard } from './components/BusinessDashboard';
import { ArtistDashboard } from './components/ArtistDashboard';
import { EnsembleDashboard } from './components/EnsembleDashboard';
import { AdminPanel } from './components/AdminPanel';
import { HowItWorksView } from './components/HowItWorksView';
import { ProfileEditView } from './components/ProfileEditView';
import { AuthModal } from './components/AuthModal';
import { RecommendationsStrip } from './components/RecommendationsStrip';
import { Footer } from './components/Footer';
import {
  ArrowRight,
  Building2,
  MapPin,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { formatCurrencyTRY } from './utils/businessLogic';

const AppContent: React.FC = () => {
  const {
    activeView,
    selectedEntityId,
    navigateTo,
    listings,
    setAuthModalMode,
    switchRole,
    isAuthenticated,
  } = useApp();

  const [audienceTab, setAudienceTab] = useState<'artist' | 'venue'>('artist');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeView, selectedEntityId]);

  const journeySteps =
    audienceTab === 'artist'
      ? [
          {
            num: '01',
            title: 'Profil & Repertuvar Oluştur',
            desc: 'Eğitim geçmişinizi, uzmanlık alanınızı, sahne kayıtlarınızı ve repertuvarınızı doğrulamalı sanatçı dosyanızda sergileyin.',
          },
          {
            num: '02',
            title: 'Sabit Bütçeli İlanlara Başvur',
            desc: 'Otellerin, kültür vakıflarının ve etkinlik salonlarının açık bütçeli sahne ilanlarını inceleyip doğrudan teklifinizi gönderin.',
          },
          {
            num: '03',
            title: 'Güvenli Sözleşme ve Garanti Ödeme',
            desc: 'Seçildiğinizde karşılıklı sözleşmeyi onaylayın; performans sonrası hakedişiniz platform güvencesiyle doğrudan hesabınıza geçsin.',
          },
        ]
      : [
          {
            num: '01',
            title: 'Doğrulanmış İlan Yayınla',
            desc: 'Etkinlik tarihi, kadro formatı, teknik donanım ve sabit bütçeyi tanımlayarak seçkin sanatçı ağına çağrı açın.',
          },
          {
            num: '02',
            title: 'Ses Örneklerini ve Sicili İncele',
            desc: 'Başvuran sanatçı ve toplulukların canlı kayıtlarını dinleyin, iptal oranlarını ve mekân değerlendirmelerini kıyaslayın.',
          },
          {
            num: '03',
            title: 'Tek Tıkla Anlaş & Sahneye Çıkar',
            desc: 'Dijital sözleşme ve acil ikame ağı güvencesiyle etkinliğinizin eksiksiz ve tam saatinde gerçekleşmesini garanti altına alın.',
          },
        ];

  const handleJoinAsArtist = () => {
    if (isAuthenticated) {
      switchRole('artist');
      navigateTo('profile_edit');
    } else {
      setAuthModalMode('register');
    }
  };

  const handleJoinAsVenue = () => {
    if (isAuthenticated) {
      switchRole('business_owner');
      navigateTo('business_dashboard');
    } else {
      setAuthModalMode('register');
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'listings':
        return (
          <ListingsMarketplaceView
            onSelectListing={(listing) => navigateTo('listing_detail', listing.id)}
          />
        );

      case 'listing_detail':
        return (
          <ListingDetailPage
            listingId={selectedEntityId || undefined}
            onBack={() => navigateTo('listings')}
          />
        );

      case 'artists_directory':
        return <ArtistsDirectoryView />;

      case 'ensembles_directory':
        return <EnsemblesDirectoryView />;

      case 'businesses_directory':
        return <BusinessesDirectoryView />;

      case 'events':
      case 'event_detail':
        return <EventsView />;

      case 'contact':
        return <ContactView />;

      case 'artist_profile':
        return (
          <ArtistProfileView
            artistId={selectedEntityId || 'artist_efe_ozkan'}
            onBack={() => navigateTo('artists_directory')}
          />
        );

      case 'profile_edit':
        return <ProfileEditView />;

      case 'ensemble_profile':
        return (
          <EnsembleProfileView
            ensembleId={selectedEntityId || 'ensemble_istanbul_string_trio'}
            onBack={() => navigateTo('ensembles_directory')}
          />
        );

      case 'business_profile':
        return (
          <BusinessProfileView
            businessId={selectedEntityId || 'biz_grand_bosphorus'}
            onBack={() => navigateTo('businesses_directory')}
            onSelectListing={(id) => navigateTo('listing_detail', id)}
          />
        );

      case 'business_dashboard':
        return <BusinessDashboard />;

      case 'artist_dashboard':
        return <ArtistDashboard />;

      case 'ensemble_dashboard':
        return <EnsembleDashboard />;

      case 'admin_panel':
        return <AdminPanel />;

      case 'how_it_works':
        return <HowItWorksView />;

      case 'about':
        return <AboutView />;

      case 'team':
        return <TeamView />;

      case 'home':
      default:
        return (
          <div className="text-left">
            {/* Section 1: Architectural Hero with Interactive Search & Stats */}
            <HeroSection />

            {/* Section 2: #ilanlar — Live Performance & Stage Listings */}
            <section
              id="ilanlar"
              className="py-14 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 transition-colors"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                    <span className="label-caps text-[#E45424]">
                      Öne Çıkan Fırsatlar
                    </span>
                    <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                      Güncel Sahne &amp; Performans İlanları
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Müzikten görsel sanatlara, sahne performanslarından edebiyata tüm kültür-sanat disiplinleri ve etkinlik alanları için güncel açık çağrılar ve proje fırsatları.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo('listings')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E45424] hover:text-[#c94317] transition-colors self-start sm:self-auto cursor-pointer whitespace-nowrap"
                  >
                    <span>Tüm İlanları Gör ({listings.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {listings.slice(0, 3).map((l) => {
                    const isUrgent = Boolean(l.isReplacement);
                    return (
                      <article
                        key={l.id}
                        onClick={() => navigateTo('listing_detail', l.id)}
                        className={`group rounded-2xl p-5 border transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md ${
                          isUrgent
                            ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60 hover:border-[#E45424]'
                            : 'bg-white dark:bg-[#111A2E] border-slate-200 dark:border-slate-800 hover:border-[#E45424]/70'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Top Venue Info & Status */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200/70 dark:border-orange-500/20 flex items-center justify-center text-[#E45424] shrink-0">
                                <Building2 className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {l.businessName}
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                  <MapPin className="w-3 h-3 shrink-0" />
                                  <span>{l.city}, {l.district}</span>
                                </div>
                              </div>
                            </div>

                            {isUrgent ? (
                              <span className="inline-flex items-center gap-1 text-amber-800 dark:text-amber-300 text-[11px] font-bold shrink-0">
                                <AlertTriangle className="w-3.5 h-3.5 text-[#E45424]" />
                                <span>Acil Çağrı</span>
                              </span>
                            ) : (
                              <span className="text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold shrink-0">
                                Aktif İlan
                              </span>
                            )}
                          </div>

                          {/* Title & Excerpt */}
                          <div>
                            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-[#E45424] transition-colors line-clamp-2">
                              {l.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                              {l.description}
                            </p>
                          </div>

                          {/* Unboxed Editorial Metadata */}
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-600 dark:text-slate-300 tabular-nums">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {l.targetEnsembleType}
                            </span>
                            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#E45424]" />
                              <span>{l.eventDate}</span>
                            </span>
                            {l.genres[0] && (
                              <>
                                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                                <span className="text-[#E45424] font-medium">{l.genres[0]}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Bottom Budget & CTA */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                              Net Hakediş
                            </div>
                            <div className="font-sans text-lg font-extrabold text-slate-900 dark:text-white tabular-nums">
                              {formatCurrencyTRY(l.budgetAmount)}
                            </div>
                          </div>

                          <span className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1E2B4F] dark:bg-[#E45424] group-hover:bg-[#E45424] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap">
                            <span>Başvur</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Section 3: #sanatcilar — 4-Column Talent & Ensemble Grid */}
            <RecommendationsStrip />

            {/* Section 4: #nasil-calisir — How It Works + Bottom CTA Banner */}
            <section
              id="nasil-calisir"
              className="py-14 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 transition-colors"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Header + Audience Tab Switcher */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
                  <div>
                    <span className="label-caps text-[#E45424]">
                      Şeffaf ve Güvenilir Süreç
                    </span>
                    <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                      Sahne Yolculuğu Nasıl İşler?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Hem icracılar hem de etkinlik düzenleyen işletmeler için üç adımda güvenli iş akışı.
                    </p>
                  </div>

                  {/* Segmented Audience Tabs */}
                  <div className="inline-flex p-1 rounded-xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 shadow-xs self-start md:self-auto">
                    <button
                      type="button"
                      onClick={() => setAudienceTab('artist')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        audienceTab === 'artist'
                          ? 'bg-[#E45424] text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Sanatçılar İçin
                    </button>
                    <button
                      type="button"
                      onClick={() => setAudienceTab('venue')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        audienceTab === 'venue'
                          ? 'bg-[#E45424] text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      İşletmeler İçin
                    </button>
                  </div>
                </div>

                {/* 3 Numbered Journey Step Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {journeySteps.map((step) => (
                    <div
                      key={step.num}
                      className="bg-white dark:bg-[#111A2E] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#E45424]/50 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[#E45424]/10 dark:bg-[#E45424]/20 text-[#E45424] font-display font-extrabold text-base flex items-center justify-center mb-4 tabular-nums">
                        {step.num}
                      </div>
                      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bottom Navy CTA Banner */}
                <div className="rounded-3xl bg-gradient-to-br from-[#1E2B4F] via-[#151F3B] to-[#0B1120] border border-slate-800 p-7 sm:p-10 lg:p-12 text-white shadow-lg">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2.5 max-w-2xl">
                      <div className="label-caps text-orange-300">
                        Türkiye Geneli Seçkin Kültür Ağı
                      </div>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                        Sanatınızı Doğru Sahnelerle Buluşturmaya Hazır mısınız?
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        Doğrulanmış profilinizle Türkiye genelindeki prestijli otel, galeri, kültür merkezi ve kurumsal etkinlik ağının parçası olun.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={handleJoinAsArtist}
                        className="px-5 py-3 rounded-xl bg-[#E45424] hover:bg-[#c94317] text-white font-bold text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                      >
                        <span>Sanatçı Olarak Katıl</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleJoinAsVenue}
                        className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Mekan Hesabı Aç</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
    }
  };

  const isFullBleedView =
    activeView === 'home' ||
    activeView === 'listings' ||
    activeView === 'artists_directory' ||
    activeView === 'ensembles_directory' ||
    activeView === 'businesses_directory' ||
    activeView === 'events' ||
    activeView === 'about' ||
    activeView === 'team';

  return (
    <div className="min-h-screen bg-[#F9FAFC] dark:bg-[#0B1120] text-slate-800 dark:text-slate-100 font-body antialiased flex flex-col justify-between transition-colors">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Content with Zero-Delay Instant Spring Entry */}
      <main className="flex-1 w-full">
        <motion.div
          key={`${activeView}-${selectedEntityId || ''}`}
          initial={{ opacity: 0.72, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 520, damping: 36, mass: 0.65 }}
          className="w-full"
        >
          {isFullBleedView ? (
            renderView()
          ) : (
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {renderView()}
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <AppContent />
      </AppProvider>
    </MotionConfig>
  );
}
