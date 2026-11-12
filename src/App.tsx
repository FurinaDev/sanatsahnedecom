import React from 'react';
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
  ShieldCheck,
  ArrowRight,
  Star,
  Users,
  Building2,
  Calendar,
  AlertTriangle,
  CalendarPlus,
  Clock,
  MapPin,
} from 'lucide-react';
import { formatCurrencyTRY } from './utils/businessLogic';

const AppContent: React.FC = () => {
  const {
    activeView,
    selectedEntityId,
    navigateTo,
    listings,
    artists,
    ensembles,
    events,
  } = useApp();

  // Render subviews
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

      case 'home':
      default:
        return (
          <div className="space-y-8 text-left">
            {/* Clean Boxed Culture Hero */}
            <HeroSection />

            {/* Weekly & Monthly Recommendations */}
            <RecommendationsStrip />

            {/* Featured Active Listings Section */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Öne Çıkan Fırsatlar
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
                    Güncel Sahne ve Etkinlik İlanları
                  </h2>
                </div>
                <button
                  onClick={() => navigateTo('listings')}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                >
                  <span>Tüm İlanları Keşfet ({listings.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.slice(0, 3).map((l) => (
                  <div
                    key={l.id}
                    onClick={() => navigateTo('listing_detail', l.id)}
                    className="p-5 bg-white rounded-2xl border border-stone-200/90 hover:border-amber-600/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-xs"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-stone-500">{l.businessName}</span>
                        {l.isReplacement && (
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md uppercase">
                            Acil İkame
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-stone-900 line-clamp-2 hover:text-amber-700 transition-colors">
                        {l.title}
                      </h3>

                      <div className="text-xs text-stone-500">
                        {l.targetEnsembleType} · {l.city}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-stone-400">Net Hakediş</div>
                        <div className="text-base font-bold text-stone-900 tabular-nums">
                          {formatCurrencyTRY(l.budgetAmount)}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                        İlanı Aç <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Artists & Ensembles Section */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Kültür & Sanat Topluluğu
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
                    Doğrulanmış Sanatçılar ve Müzik Grupları
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <button
                    onClick={() => navigateTo('artists_directory')}
                    className="text-amber-700 hover:text-amber-900 flex items-center gap-1"
                  >
                    Tüm Sanatçılar <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-stone-300">·</span>
                  <button
                    onClick={() => navigateTo('ensembles_directory')}
                    className="text-amber-700 hover:text-amber-900 flex items-center gap-1"
                  >
                    Tüm Topluluklar <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Artist Card 1 */}
                <div
                  onClick={() => navigateTo('artist_profile', 'artist_efe_ozkan')}
                  className="p-5 bg-white rounded-2xl border border-stone-200/90 hover:border-amber-600/50 hover:shadow-md transition-all cursor-pointer space-y-3.5 shadow-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={artists[0]?.avatarUrl}
                      alt={artists[0]?.fullName}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200"
                    />
                    <div>
                      <div className="flex items-center gap-1 font-bold text-stone-900 text-sm">
                        <span>{artists[0]?.fullName}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-xs text-amber-700 font-medium">{artists[0]?.title}</div>
                      <div className="text-[11px] text-stone-400">{artists[0]?.city}</div>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2">{artists[0]?.bioShort}</p>
                  <div className="flex items-center justify-between text-xs pt-2.5 border-t border-stone-100 text-stone-500">
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {artists[0]?.ratingAvg.toFixed(2)}
                    </span>
                    <span>%{artists[0]?.cancellationRate} İptal Oranı</span>
                  </div>
                </div>

                {/* Ensemble Card */}
                <div
                  onClick={() => navigateTo('ensemble_profile', 'ensemble_istanbul_string_trio')}
                  className="p-5 bg-white rounded-2xl border border-stone-200/90 hover:border-amber-600/50 hover:shadow-md transition-all cursor-pointer space-y-3.5 shadow-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={ensembles[0]?.avatarUrl}
                      alt={ensembles[0]?.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200"
                    />
                    <div>
                      <div className="flex items-center gap-1 font-bold text-stone-900 text-sm">
                        <span>{ensembles[0]?.name}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-xs text-amber-700 font-medium">
                        {ensembles[0]?.ensembleType} (3 Müzisyen)
                      </div>
                      <div className="text-[11px] text-stone-400">{ensembles[0]?.city}</div>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2">{ensembles[0]?.bio}</p>
                  <div className="flex items-center justify-between text-xs pt-2.5 border-t border-stone-100 text-stone-500">
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {ensembles[0]?.ratingAvg.toFixed(2)}
                    </span>
                    <span>%{ensembles[0]?.cancellationRate} İptal Oranı</span>
                  </div>
                </div>

                {/* Artist Card 2 */}
                <div
                  onClick={() => navigateTo('artist_profile', 'artist_selin_arslan')}
                  className="p-5 bg-white rounded-2xl border border-stone-200/90 hover:border-amber-600/50 hover:shadow-md transition-all cursor-pointer space-y-3.5 shadow-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={artists[1]?.avatarUrl}
                      alt={artists[1]?.fullName}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200"
                    />
                    <div>
                      <div className="flex items-center gap-1 font-bold text-stone-900 text-sm">
                        <span>{artists[1]?.fullName}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-xs text-amber-700 font-medium">{artists[1]?.title}</div>
                      <div className="text-[11px] text-stone-400">{artists[1]?.city}</div>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2">{artists[1]?.bioShort}</p>
                  <div className="flex items-center justify-between text-xs pt-2.5 border-t border-stone-100 text-stone-500">
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {artists[1]?.ratingAvg.toFixed(2)}
                    </span>
                    <span>%{artists[1]?.cancellationRate} İptal Oranı</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Upcoming Cultural Agenda Preview Strip */}
            <section className="p-6 sm:p-8 bg-white rounded-2xl border border-stone-200/90 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Ajanda
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-0.5">
                    Yaklaşan Konser ve Dinletiler
                  </h3>
                </div>
                <button
                  onClick={() => navigateTo('events')}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Tüm Etkinlik Ajandası ({events.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.slice(0, 2).map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-4"
                  >
                    <div className="w-16 h-16 rounded-xl bg-stone-900 overflow-hidden shrink-0">
                      <img
                        src={evt.posterUrl}
                        alt={evt.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-amber-800 font-semibold">
                        <Calendar className="w-3 h-3" />
                        <span>{evt.eventDate} ({evt.startTime})</span>
                        <span className="text-stone-300">·</span>
                        <span className="text-stone-500">{evt.city}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {evt.title}
                      </h4>
                      <div className="text-xs text-stone-500 truncate">
                        {evt.venueName} · <span className="text-stone-700">{evt.performers}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-acoustic-pattern text-[#191919] font-sans antialiased flex flex-col justify-between">
      {/* Centered Navigation Container (Exact same width & padding as main content) */}
      <header className="sticky top-0 z-40 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1">
        <Navbar />
      </header>

      {/* Boxed Centered Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {renderView()}
      </main>

      {/* Centered Boxed Footer Container */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Footer />
      </div>

      {/* Real Auth Modal for Login, Register & Forgot Password */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
