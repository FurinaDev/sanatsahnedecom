import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  RoleType,
  Listing,
  ListingApplication,
  Booking,
  Review,
  IndividualProfile,
  Ensemble,
  BusinessProfile,
  VerificationRequest,
  PlatformSettings,
  MusicGenre,
  EnsembleType,
  Instrument,
  BusinessType,
  EventAnnouncement,
  ArtDiscipline,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_INDIVIDUAL_PROFILES,
  INITIAL_ENSEMBLES,
  INITIAL_BUSINESS_PROFILES,
  INITIAL_LISTINGS,
  INITIAL_APPLICATIONS,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_VERIFICATIONS,
  INITIAL_SETTINGS,
  INITIAL_EVENTS,
} from '../data/seedData';
import {
  calculateCommission,
  calculateCancellationRate,
  canBusinessCreateListing,
  CommissionModel,
} from '../utils/businessLogic';

export interface FilterState {
  searchQuery: string;
  discipline: ArtDiscipline | 'Tümü';
  specialty: string;
  genre: MusicGenre | 'Tümü';
  ensembleType: EnsembleType | 'Tümü';
  instrument: Instrument | 'Tümü';
  city: string;
  minBudget: number;
  maxBudget: number;
  businessType: BusinessType | 'Tümü';
  onlyVerified: boolean;
  onlyUrgent: boolean;
  sortBy: 'newest' | 'budget_desc' | 'budget_asc' | 'date_asc';
}

export const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  discipline: 'Tümü',
  specialty: 'Tümü',
  genre: 'Tümü',
  ensembleType: 'Tümü',
  instrument: 'Tümü',
  city: 'Tümü',
  minBudget: 0,
  maxBudget: 100000,
  businessType: 'Tümü',
  onlyVerified: false,
  onlyUrgent: false,
  sortBy: 'newest',
};

export type AppView =
  | 'home'
  | 'listings'
  | 'listing_detail'
  | 'artists_directory'
  | 'artist_profile'
  | 'profile_edit'
  | 'ensembles_directory'
  | 'ensemble_profile'
  | 'businesses_directory'
  | 'business_profile'
  | 'business_dashboard'
  | 'artist_dashboard'
  | 'ensemble_dashboard'
  | 'admin_panel'
  | 'how_it_works'
  | 'events'
  | 'event_detail'
  | 'contact'
  | 'about'
  | 'team';

interface AppContextType {
  // Settings & Navigation
  settings: PlatformSettings;
  activeView: AppView;
  selectedEntityId: string | null;
  navigateTo: (view: AppView, entityId?: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Auth & Roles
  currentUser: User;
  isAuthenticated: boolean;
  activeRole: RoleType;
  switchRole: (role: RoleType) => void;
  authModalMode: 'login' | 'register' | 'forgot_password' | null;
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot_password' | null) => void;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  register: (data: { email: string; name: string; role: RoleType; phone?: string }) => { success: boolean };
  logout: () => void;
  resetPassword: (email: string) => { success: boolean; message: string };

  // Recommendations
  recommendationPeriod: 'weekly' | 'monthly';
  setRecommendationPeriod: (period: 'weekly' | 'monthly') => void;

  // Data
  listings: Listing[];
  applications: ListingApplication[];
  bookings: Booking[];
  reviews: Review[];
  artists: IndividualProfile[];
  ensembles: Ensemble[];
  businesses: BusinessProfile[];
  verifications: VerificationRequest[];
  events: EventAnnouncement[];

  // Actions
  updateArtistProfile: (profileData: Partial<IndividualProfile>) => void;
  createListing: (data: Partial<Listing>) => { success: boolean; error?: string; listingId?: string };
  applyToListing: (listingId: string, message: string, applicantType: 'individual' | 'ensemble', participatingMembers?: string[]) => { success: boolean; error?: string };
  shortlistApplication: (applicationId: string) => void;
  rejectApplication: (applicationId: string) => void;
  selectApplicantAndCreateBooking: (applicationId: string) => { success: boolean; bookingId?: string };
  acceptContract: (bookingId: string) => void;
  payBookingSandbox: (bookingId: string) => { success: boolean };
  completePerformerService: (bookingId: string) => void;
  completeEmployerService: (bookingId: string) => void;
  cancelBooking: (bookingId: string, reason: string, cancelledByRole: 'performer' | 'employer') => { success: boolean };
  createEmergencyReplacement: (bookingId: string) => { success: boolean; newListingId?: string };
  submitReview: (bookingId: string, scores: { overall: number; quality: number; comm: number; prof: number }, comment: string) => void;
  submitVerificationRequest: (accountType: 'artist' | 'ensemble' | 'business', entityName: string, docUrl: string) => void;
  adminApproveVerification: (requestId: string) => void;
  adminRejectVerification: (requestId: string, reason: string) => void;
  adminUpdateCommission: (rate: number, model: CommissionModel) => void;
  addEventAnnouncement: (data: Omit<EventAnnouncement, 'id' | 'createdAt' | 'status'>) => { success: boolean; eventId: string };
  moderateEventAnnouncement: (eventId: string, status: 'published' | 'rejected') => void;
  resetAllData: () => void;
}

const STORAGE_KEY = 'sahnesanat_db_state_v3';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or seed
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.brandName !== 'SanatSahnede') {
          parsed.brandName = 'SanatSahnede';
          parsed.tagline = 'sanatsahnede.com — Canlı Sahne, Sanatçılar ve Mekânlar';
        }
        return parsed;
      } catch (e) {
        return INITIAL_SETTINGS;
      }
    }
    return INITIAL_SETTINGS;
  });

  const [activeRole, setActiveRole] = useState<RoleType>('business_owner');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot_password' | null>(null);
  const [recommendationPeriod, setRecommendationPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_listings`);
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [applications, setApplications] = useState<ListingApplication[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_applications`);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_bookings`);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_reviews`);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [artists, setArtists] = useState<IndividualProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_artists`);
    return saved ? JSON.parse(saved) : INITIAL_INDIVIDUAL_PROFILES;
  });

  const [ensembles, setEnsembles] = useState<Ensemble[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ensembles`);
    return saved ? JSON.parse(saved) : INITIAL_ENSEMBLES;
  });

  const [businesses, setBusinesses] = useState<BusinessProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_businesses`);
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_PROFILES;
  });

  const [verifications, setVerifications] = useState<VerificationRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_verifications`);
    return saved ? JSON.parse(saved) : INITIAL_VERIFICATIONS;
  });

  const [events, setEvents] = useState<EventAnnouncement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_events`);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  // Resolve clean pathname <-> (AppView, entityId)
  const resolveRouteFromPath = (
    pathname: string
  ): { view: AppView; entityId: string | null } => {
    const clean = pathname.replace(/\/+$/, '') || '/';
    if (clean === '/') return { view: 'home', entityId: null };
    if (clean === '/ilanlar') return { view: 'listings', entityId: null };
    if (clean.startsWith('/ilanlar/')) {
      const param = decodeURIComponent(clean.slice('/ilanlar/'.length));
      const matched = listings.find((l) => l.slug === param || l.id === param);
      return { view: 'listing_detail', entityId: matched ? matched.id : param };
    }
    if (clean === '/sanatcilar') return { view: 'artists_directory', entityId: null };
    if (clean.startsWith('/sanatcilar/')) {
      const param = decodeURIComponent(clean.slice('/sanatcilar/'.length));
      const matched = artists.find((a) => a.slug === param || a.id === param);
      return { view: 'artist_profile', entityId: matched ? matched.id : param };
    }
    if (clean === '/topluluklar') return { view: 'ensembles_directory', entityId: null };
    if (clean.startsWith('/topluluklar/')) {
      const param = decodeURIComponent(clean.slice('/topluluklar/'.length));
      const matched = ensembles.find((e) => e.slug === param || e.id === param);
      return { view: 'ensemble_profile', entityId: matched ? matched.id : param };
    }
    if (clean === '/isletmeler') return { view: 'businesses_directory', entityId: null };
    if (clean.startsWith('/isletmeler/')) {
      const param = decodeURIComponent(clean.slice('/isletmeler/'.length));
      const matched = businesses.find((b) => b.slug === param || b.id === param);
      return { view: 'business_profile', entityId: matched ? matched.id : param };
    }
    if (clean === '/etkinlikler') return { view: 'events', entityId: null };
    if (clean === '/iletisim') return { view: 'contact', entityId: null };
    if (clean === '/hakkimizda') return { view: 'about', entityId: null };
    if (clean === '/ekibimiz') return { view: 'team', entityId: null };
    if (clean === '/nasil-calisir') return { view: 'how_it_works', entityId: null };
    if (clean === '/profil-duzenle') return { view: 'profile_edit', entityId: null };
    if (clean === '/panel/isletme') return { view: 'business_dashboard', entityId: null };
    if (clean === '/panel/sanatci') return { view: 'artist_dashboard', entityId: null };
    if (clean === '/panel/topluluk') return { view: 'ensemble_dashboard', entityId: null };
    if (clean === '/panel/yonetim') return { view: 'admin_panel', entityId: null };
    return { view: 'home', entityId: null };
  };

  const buildPathForRoute = (view: AppView, entityId?: string | null): string => {
    switch (view) {
      case 'home':
        return '/';
      case 'listings':
        return '/ilanlar';
      case 'listing_detail': {
        const found = listings.find((l) => l.id === entityId || l.slug === entityId);
        return `/ilanlar/${found?.slug || entityId || ''}`;
      }
      case 'artists_directory':
        return '/sanatcilar';
      case 'artist_profile': {
        const found = artists.find((a) => a.id === entityId || a.slug === entityId);
        return `/sanatcilar/${found?.slug || entityId || 'artist_efe_ozkan'}`;
      }
      case 'ensembles_directory':
        return '/topluluklar';
      case 'ensemble_profile': {
        const found = ensembles.find((e) => e.id === entityId || e.slug === entityId);
        return `/topluluklar/${found?.slug || entityId || 'ensemble_istanbul_string_trio'}`;
      }
      case 'businesses_directory':
        return '/isletmeler';
      case 'business_profile': {
        const found = businesses.find((b) => b.id === entityId || b.slug === entityId);
        return `/isletmeler/${found?.slug || entityId || 'biz_grand_bosphorus'}`;
      }
      case 'events':
      case 'event_detail':
        return '/etkinlikler';
      case 'contact':
        return '/iletisim';
      case 'about':
        return '/hakkimizda';
      case 'team':
        return '/ekibimiz';
      case 'how_it_works':
        return '/nasil-calisir';
      case 'profile_edit':
        return '/profil-duzenle';
      case 'business_dashboard':
        return '/panel/isletme';
      case 'artist_dashboard':
        return '/panel/sanatci';
      case 'ensemble_dashboard':
        return '/panel/topluluk';
      case 'admin_panel':
        return '/panel/yonetim';
      default:
        return '/';
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const initial = resolveRouteFromPath(window.location.pathname);
    if (initial.view !== 'home') {
      setActiveView(initial.view);
      setSelectedEntityId(initial.entityId);
    }

    const handlePopState = () => {
      const next = resolveRouteFromPath(window.location.pathname);
      setActiveView(next.view);
      setSelectedEntityId(next.entityId);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
    localStorage.setItem(`${STORAGE_KEY}_listings`, JSON.stringify(listings));
    localStorage.setItem(`${STORAGE_KEY}_applications`, JSON.stringify(applications));
    localStorage.setItem(`${STORAGE_KEY}_bookings`, JSON.stringify(bookings));
    localStorage.setItem(`${STORAGE_KEY}_reviews`, JSON.stringify(reviews));
    localStorage.setItem(`${STORAGE_KEY}_artists`, JSON.stringify(artists));
    localStorage.setItem(`${STORAGE_KEY}_ensembles`, JSON.stringify(ensembles));
    localStorage.setItem(`${STORAGE_KEY}_businesses`, JSON.stringify(businesses));
    localStorage.setItem(`${STORAGE_KEY}_verifications`, JSON.stringify(verifications));
    localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
  }, [settings, listings, applications, bookings, reviews, artists, ensembles, businesses, verifications, events]);

  // Handle Role Switching
  const switchRole = (role: RoleType) => {
    setActiveRole(role);
    if (role === 'business_owner') {
      setCurrentUser(INITIAL_USERS[0]);
    } else if (role === 'artist') {
      setCurrentUser(INITIAL_USERS[1]);
    } else if (role === 'ensemble_leader') {
      setCurrentUser(INITIAL_USERS[2]);
    } else if (role === 'admin') {
      setCurrentUser(INITIAL_USERS[3]);
    }
  };

  const navigateTo = (view: AppView, entityId?: string) => {
    setActiveView(view);
    if (entityId) {
      setSelectedEntityId(entityId);
    } else if (!['listing_detail', 'artist_profile', 'ensemble_profile', 'business_profile'].includes(view)) {
      setSelectedEntityId(null);
    }
    if (typeof window !== 'undefined') {
      const nextPath = buildPathForRoute(view, entityId ?? null);
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, '', nextPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Action: Create Listing (Only verified businesses allowed)
  const createListing = (data: Partial<Listing>) => {
    const currentBiz = businesses.find((b) => b.userId === currentUser.id) || businesses[0];

    if (settings.requireVerificationForListing && !canBusinessCreateListing(currentBiz)) {
      return {
        success: false,
        error: 'Yalnızca platform yöneticisi tarafından doğrulanmış işletmeler ilan yayınlayabilir. Lütfen önce işletme belgelerinizi yükleyiniz.',
      };
    }

    const newId = `list_${Date.now()}`;
    const newListing: Listing = {
      id: newId,
      businessId: currentBiz.id,
      businessName: currentBiz.businessName,
      businessType: currentBiz.businessType,
      businessLogo: currentBiz.logoUrl,
      businessVerified: currentBiz.isVerified,
      title: data.title || 'Yeni Müzik Etkinliği İlanı',
      slug: (data.title || 'yeni-ilan')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, ''),
      description: data.description || '',
      eventType: data.eventType || 'Konser',
      genres: data.genres || ['Klasik Müzik'],
      targetEnsembleType: data.targetEnsembleType || 'Trio',
      requiredInstruments: data.requiredInstruments || ['Keman', 'Piyano'],
      performerCount: data.performerCount || 3,
      durationMins: data.durationMins || 60,
      eventDate: data.eventDate || '2026-12-01',
      startTime: data.startTime || '20:00',
      endTime: data.endTime || '21:00',
      applicationDeadline: data.applicationDeadline || '2026-11-25',
      city: data.city || currentBiz.city,
      district: data.district || currentBiz.district,
      venueName: data.venueName || `${currentBiz.businessName} Salonu`,
      isOutdoor: data.isOutdoor || false,
      repertoireExpectation: data.repertoireExpectation || 'Klasik dönem seçkileri',
      dressCode: data.dressCode || 'Koyu Renk Konser Kıyafeti',
      soundSystemProvided: data.soundSystemProvided ?? true,
      transportationProvided: data.transportationProvided ?? false,
      accommodationProvided: data.accommodationProvided ?? false,
      budgetAmount: data.budgetAmount || 20000,
      currency: 'TRY',
      status: 'active',
      isReplacement: data.isReplacement || false,
      originalListingId: data.originalListingId,
      urgentReason: data.urgentReason,
      applicationsCount: 0,
      createdAt: new Date().toISOString(),
    };

    setListings((prev) => [newListing, ...prev]);
    return { success: true, listingId: newId };
  };

  // Action: Apply to Listing
  const applyToListing = (
    listingId: string,
    message: string,
    applicantType: 'individual' | 'ensemble',
    participatingMembers?: string[]
  ) => {
    const existing = applications.find(
      (a) => a.listingId === listingId && a.applicantUserId === currentUser.id
    );
    if (existing) {
      return { success: false, error: 'Bu ilana zaten bir başvurunuz bulunmaktadır.' };
    }

    let applicantName = '';
    let applicantAvatar = '';
    let applicantRating = 5.0;
    let applicantCompleted = 0;
    let applicantCancelRate = 0;
    let applicantIsVerified = false;
    let applicantId = '';
    let instrumentsOrType = '';
    let genres: MusicGenre[] = [];

    if (applicantType === 'individual') {
      const profile = artists.find((a) => a.userId === currentUser.id) || artists[0];
      applicantId = profile.id;
      applicantName = profile.fullName;
      applicantAvatar = profile.avatarUrl;
      applicantRating = profile.ratingAvg;
      applicantCompleted = profile.completedJobsCount;
      applicantCancelRate = profile.cancellationRate;
      applicantIsVerified = profile.isVerified;
      instrumentsOrType = profile.primaryInstrument;
      genres = profile.genres;
    } else {
      const ensemble = ensembles.find((e) => e.leaderUserId === currentUser.id) || ensembles[0];
      applicantId = ensemble.id;
      applicantName = ensemble.name;
      applicantAvatar = ensemble.avatarUrl;
      applicantRating = ensemble.ratingAvg;
      applicantCompleted = ensemble.completedJobsCount;
      applicantCancelRate = ensemble.cancellationRate;
      applicantIsVerified = ensemble.isVerified;
      instrumentsOrType = `${ensemble.ensembleType} (${ensemble.members.map((m) => m.instrument).join(', ')})`;
      genres = ensemble.genres;
    }

    const newApp: ListingApplication = {
      id: `app_${Date.now()}`,
      listingId,
      applicantType,
      applicantId,
      applicantUserId: currentUser.id,
      applicantName,
      applicantAvatar,
      applicantRating,
      applicantCompletedJobs: applicantCompleted,
      applicantCancellationRate: applicantCancelRate,
      applicantIsVerified,
      instrumentsOrType,
      genres,
      message,
      participatingMembers: participatingMembers || [],
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, applicationsCount: l.applicationsCount + 1 } : l))
    );
    return { success: true };
  };

  // Action: Shortlist application
  const shortlistApplication = (applicationId: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'shortlisted' } : a))
    );
  };

  // Action: Reject application
  const rejectApplication = (applicationId: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'rejected' } : a))
    );
  };

  // Action: Select Applicant and create Booking
  const selectApplicantAndCreateBooking = (applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return { success: false };

    const listing = listings.find((l) => l.id === app.listingId);
    if (!listing) return { success: false };

    // Calculate commission
    const calc = calculateCommission(
      listing.budgetAmount,
      settings.commissionRate,
      settings.commissionModel
    );

    const bookingId = `booking_${Date.now()}`;
    const newBooking: Booking = {
      id: bookingId,
      listingId: listing.id,
      listingTitle: listing.title,
      businessId: listing.businessId,
      businessName: listing.businessName,
      applicationId: app.id,
      performerType: app.applicantType,
      performerId: app.applicantId,
      performerName: app.applicantName,
      performerAvatar: app.applicantAvatar,
      eventDate: listing.eventDate,
      venueName: listing.venueName,
      city: listing.city,
      netPayoutAmount: calc.performerPayout,
      commissionAmount: calc.commissionAmount,
      grossAmount: calc.employerTotal,
      commissionModel: settings.commissionModel,
      commissionRate: settings.commissionRate,
      status: 'agreement_pending',
      contractTermsAcceptedByPerformer: false,
      contractTermsAcceptedByEmployer: true, // Business automatically approves by selecting
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update application status to selected, others to rejected
    setApplications((prev) =>
      prev.map((a) =>
        a.listingId === listing.id
          ? a.id === applicationId
            ? { ...a, status: 'selected' }
            : { ...a, status: 'rejected' }
          : a
      )
    );

    // Update listing status to assigned
    setListings((prev) =>
      prev.map((l) => (l.id === listing.id ? { ...l, status: 'assigned' } : l))
    );

    setBookings((prev) => [newBooking, ...prev]);
    return { success: true, bookingId };
  };

  // Action: Accept contract terms
  const acceptContract = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const isPerformer = activeRole === 'artist' || activeRole === 'ensemble_leader';
        const isEmployer = activeRole === 'business_owner';

        const updatedPerformerAccept = isPerformer ? true : b.contractTermsAcceptedByPerformer;
        const updatedEmployerAccept = isEmployer ? true : b.contractTermsAcceptedByEmployer;

        // When both accept, advance to payment_pending
        const nextStatus =
          updatedPerformerAccept && updatedEmployerAccept ? 'payment_pending' : b.status;

        return {
          ...b,
          contractTermsAcceptedByPerformer: updatedPerformerAccept,
          contractTermsAcceptedByEmployer: updatedEmployerAccept,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Action: Sandbox Payment
  const payBookingSandbox = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'confirmed',
              paymentStatus: 'held_sandbox',
              updatedAt: new Date().toISOString(),
            }
          : b
      )
    );
    return { success: true };
  };

  // Action: Complete service by performer
  const completePerformerService = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: b.status === 'employer_completed' ? 'completed' : 'performer_completed',
              paymentStatus: b.status === 'employer_completed' ? 'released' : b.paymentStatus,
              updatedAt: new Date().toISOString(),
            }
          : b
      )
    );
  };

  // Action: Complete service by employer
  const completeEmployerService = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const finalStatus = 'completed';
        return {
          ...b,
          status: finalStatus,
          paymentStatus: 'released', // releases payout to artist!
          updatedAt: new Date().toISOString(),
        };
      })
    );

    // Increment completed jobs count for artist/ensemble
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      if (booking.performerType === 'individual') {
        setArtists((prev) =>
          prev.map((a) =>
            a.id === booking.performerId
              ? { ...a, completedJobsCount: a.completedJobsCount + 1 }
              : a
          )
        );
      } else {
        setEnsembles((prev) =>
          prev.map((e) =>
            e.id === booking.performerId
              ? { ...e, completedJobsCount: e.completedJobsCount + 1 }
              : e
          )
        );
      }
    }
  };

  // Action: Cancel Booking (Recalculates Cancellation Rate if performer cancels)
  const cancelBooking = (
    bookingId: string,
    reason: string,
    cancelledByRole: 'performer' | 'employer'
  ) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false };

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'cancelled',
              cancellationReason: reason,
              cancelledByRole,
              paymentStatus: b.paymentStatus === 'held_sandbox' ? 'refunded' : b.paymentStatus,
              updatedAt: new Date().toISOString(),
            }
          : b
      )
    );

    // If performer cancelled confirmed booking, update their cancellation rate
    if (cancelledByRole === 'performer' && booking.status === 'confirmed') {
      if (booking.performerType === 'individual') {
        setArtists((prev) =>
          prev.map((a) => {
            if (a.id === booking.performerId) {
              const newTotal = a.completedJobsCount + 1;
              const newRate = calculateCancellationRate(1, newTotal);
              return { ...a, cancellationRate: Math.max(a.cancellationRate, newRate) };
            }
            return a;
          })
        );
      } else {
        setEnsembles((prev) =>
          prev.map((e) => {
            if (e.id === booking.performerId) {
              const newTotal = e.completedJobsCount + 1;
              const newRate = calculateCancellationRate(1, newTotal);
              return { ...e, cancellationRate: Math.max(e.cancellationRate, newRate) };
            }
            return e;
          })
        );
      }
    }

    return { success: true };
  };

  // Action: 1-Click Create Emergency Replacement Listing
  const createEmergencyReplacement = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false };

    const originalListing = listings.find((l) => l.id === booking.listingId);
    if (!originalListing) return { success: false };

    const replacementId = `list_urgent_${Date.now()}`;
    const urgentListing: Listing = {
      ...originalListing,
      id: replacementId,
      title: `ACİL İKAME — ${originalListing.title}`,
      slug: `acil-ikame-${originalListing.slug}-${Date.now().toString().slice(-4)}`,
      status: 'active',
      isReplacement: true,
      originalListingId: originalListing.id,
      urgentReason: booking.cancellationReason || 'Önceki sanatçı son dakika gelemeyeceğini bildirdi.',
      applicationsCount: 0,
      createdAt: new Date().toISOString(),
    };

    setListings((prev) => [urgentListing, ...prev]);
    return { success: true, newListingId: replacementId };
  };

  // Action: Submit Review
  const submitReview = (
    bookingId: string,
    scores: { overall: number; quality: number; comm: number; prof: number },
    comment: string
  ) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const isEmployer = activeRole === 'business_owner';
    const reviewerId = isEmployer ? booking.businessId : booking.performerId;
    const reviewerName = isEmployer ? booking.businessName : booking.performerName;
    const targetId = isEmployer ? booking.performerId : booking.businessId;
    const targetName = isEmployer ? booking.performerName : booking.businessName;

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      bookingId,
      reviewerId,
      reviewerName,
      reviewerRole: isEmployer ? 'employer' : 'performer',
      targetId,
      targetName,
      scoreOverall: scores.overall,
      scoreQuality: scores.quality,
      scoreCommunication: scores.comm,
      scoreProfessionalism: scores.prof,
      comment,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
  };

  // Action: Verification Request
  const submitVerificationRequest = (
    accountType: 'artist' | 'ensemble' | 'business',
    entityName: string,
    docUrl: string
  ) => {
    const newReq: VerificationRequest = {
      id: `verif_${Date.now()}`,
      userId: currentUser.id,
      entityName,
      accountType,
      documents: [{ title: 'Resmî Belge / Portfolyo', url: docUrl, type: 'pdf' }],
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    setVerifications((prev) => [newReq, ...prev]);
  };

  // Admin Actions
  const adminApproveVerification = (requestId: string) => {
    const req = verifications.find((v) => v.id === requestId);
    if (!req) return;

    setVerifications((prev) =>
      prev.map((v) => (v.id === requestId ? { ...v, status: 'approved' } : v))
    );

    if (req.accountType === 'business') {
      setBusinesses((prev) =>
        prev.map((b) => (b.userId === req.userId ? { ...b, isVerified: true, verificationStatus: 'approved' } : b))
      );
    } else if (req.accountType === 'artist') {
      setArtists((prev) =>
        prev.map((a) => (a.userId === req.userId ? { ...a, isVerified: true, verificationStatus: 'approved' } : a))
      );
    } else if (req.accountType === 'ensemble') {
      setEnsembles((prev) =>
        prev.map((e) => (e.leaderUserId === req.userId ? { ...e, isVerified: true, verificationStatus: 'approved' } : e))
      );
    }
  };

  const adminRejectVerification = (requestId: string, reason: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === requestId ? { ...v, status: 'rejected', adminNote: reason } : v))
    );
  };

  const adminUpdateCommission = (rate: number, model: CommissionModel) => {
    setSettings((prev) => ({
      ...prev,
      commissionRate: rate,
      commissionModel: model,
    }));
  };

  const addEventAnnouncement = (data: Omit<EventAnnouncement, 'id' | 'createdAt' | 'status'>) => {
    const newId = `evt_${Date.now()}`;
    const newEvent: EventAnnouncement = {
      ...data,
      id: newId,
      status: 'pending_moderation', // Moderator approval queue
      createdAt: new Date().toISOString(),
    };
    setEvents((prev) => [newEvent, ...prev]);
    return { success: true, eventId: newId };
  };

  const moderateEventAnnouncement = (eventId: string, status: 'published' | 'rejected') => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status } : e))
    );
  };

  const updateArtistProfile = (profileData: Partial<IndividualProfile>) => {
    setArtists((prev) =>
      prev.map((a) => {
        if (a.userId === currentUser.id || a.id === (selectedEntityId || 'artist_efe_ozkan')) {
          return { ...a, ...profileData };
        }
        return a;
      })
    );
  };

  const login = (email: string, _pass: string) => {
    const existing = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      setActiveRole(existing.activeRole);
      setIsAuthenticated(true);
      setAuthModalMode(null);
      return { success: true };
    }
    // Allow demo login with entered email
    const newUser: User = {
      id: `usr_${Date.now()}`,
      email,
      firstName: email.split('@')[0],
      lastName: '',
      phone: '+90 532 000 00 00',
      avatarUrl: '/src/assets/images/artist_guitar_vocalist_1794582675464.jpg',
      roles: ['artist'],
      activeRole: 'artist',
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    setActiveRole('artist');
    setIsAuthenticated(true);
    setAuthModalMode(null);
    return { success: true };
  };

  const register = (data: { email: string; name: string; role: RoleType; phone?: string }) => {
    const parts = data.name.trim().split(' ');
    const firstName = parts[0] || 'Kullanıcı';
    const lastName = parts.slice(1).join(' ') || '';

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email: data.email,
      firstName,
      lastName,
      phone: data.phone || '+90 532 000 00 00',
      avatarUrl: '/src/assets/images/artist_guitar_vocalist_1794582675464.jpg',
      roles: [data.role],
      activeRole: data.role,
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(newUser);
    setActiveRole(data.role);
    setIsAuthenticated(true);
    setAuthModalMode(null);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const resetPassword = (email: string) => {
    return {
      success: true,
      message: `${email} adresine şifre sıfırlama bağlantısı gönderildi. Lütfen e-postanızı kontrol ediniz.`,
    };
  };

  const resetAllData = () => {
    localStorage.clear();
    setSettings(INITIAL_SETTINGS);
    setListings(INITIAL_LISTINGS);
    setApplications(INITIAL_APPLICATIONS);
    setBookings(INITIAL_BOOKINGS);
    setReviews(INITIAL_REVIEWS);
    setArtists(INITIAL_INDIVIDUAL_PROFILES);
    setEnsembles(INITIAL_ENSEMBLES);
    setBusinesses(INITIAL_BUSINESS_PROFILES);
    setVerifications(INITIAL_VERIFICATIONS);
    setEvents(INITIAL_EVENTS);
    setActiveView('home');
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        activeView,
        selectedEntityId,
        navigateTo,
        filters,
        setFilters,
        resetFilters,
        currentUser,
        isAuthenticated,
        activeRole,
        switchRole,
        authModalMode,
        setAuthModalMode,
        login,
        register,
        logout,
        resetPassword,
        recommendationPeriod,
        setRecommendationPeriod,
        listings,
        applications,
        bookings,
        reviews,
        artists,
        ensembles,
        businesses,
        verifications,
        events,
        updateArtistProfile,
        createListing,
        applyToListing,
        shortlistApplication,
        rejectApplication,
        selectApplicantAndCreateBooking,
        acceptContract,
        payBookingSandbox,
        completePerformerService,
        completeEmployerService,
        cancelBooking,
        createEmergencyReplacement,
        submitReview,
        submitVerificationRequest,
        adminApproveVerification,
        adminRejectVerification,
        adminUpdateCommission,
        addEventAnnouncement,
        moderateEventAnnouncement,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
