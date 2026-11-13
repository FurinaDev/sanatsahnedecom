/**
 * Core type definitions for Kültür-Sanat Pazaryeri Platform
 */

export type RoleType = 'artist' | 'ensemble_leader' | 'business_owner' | 'admin';

export type ArtDiscipline =
  | 'Müzik'
  | 'Görsel Sanatlar & Sergi'
  | 'Heykel & Enstalasyon'
  | 'Sahne & Tiyatro'
  | 'Edebiyat & Söyleşi'
  | 'Bileşik Sanatlar';

export type MusicGenre =
  | 'Klasik Müzik'
  | 'Caz Müzik'
  | 'Pop'
  | 'Rock'
  | 'Türk Sanat Müziği'
  | 'Türk Halk Müziği'
  | 'Oda Müziği'
  | 'Dünya Müziği';

export type EnsembleType =
  | 'Solo'
  | 'Duo'
  | 'Trio'
  | 'Quartet'
  | 'Quintet'
  | 'Sextet'
  | 'Chamber Ensemble'
  | 'Orkestra'
  | 'Koro'
  | 'Büyük Topluluk'
  | 'Sanat Kolektifi'
  | 'Tiyatro & Performans Ekibi'
  | 'Diğer';

export type Instrument =
  | 'Piyano'
  | 'Keman'
  | 'Viyola'
  | 'Viyolonsel (Çello)'
  | 'Kontrbas'
  | 'Flüt'
  | 'Klarnet'
  | 'Obua'
  | 'Fagot'
  | 'Trompet'
  | 'Trombon'
  | 'Saksafon'
  | 'Akustik Gitar'
  | 'Klasik Gitar'
  | 'Bas Gitar'
  | 'Davul'
  | 'Perküsyon'
  | 'Vokal'
  | 'Arp'
  | 'Kanun'
  | 'Ud'
  | 'Ney';

export type BusinessType =
  | 'Otel ve Konaklama'
  | 'Düğün ve Davet Mekânı'
  | 'Organizasyon Şirketi'
  | 'Festival ve Fuar Organizatörü'
  | 'Restoran ve Kafe'
  | 'Eğlence ve Etkinlik Mekânı'
  | 'Belediye ve Kamu Kurumu'
  | 'Üniversite ve Eğitim Kurumu'
  | 'Kültür Merkezi'
  | 'Konser Salonu'
  | 'Sanat Galerisi & Müze'
  | 'Edebiyat & Sahne Evi'
  | 'Özel Şirket / Kurumsal'
  | 'Bireysel İşveren';

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'revision_needed';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
  roles: RoleType[];
  activeRole: RoleType;
  isVerified: boolean;
  createdAt: string;
}

export interface IndividualProfile {
  id: string;
  userId: string;
  slug: string;
  fullName: string;
  stageName?: string;
  title: string;
  discipline?: ArtDiscipline;
  specialtyTags?: string[];
  bioShort: string;
  bioLong: string;
  city: string;
  district: string;
  primaryInstrument: Instrument;
  instruments: Instrument[];
  genres: MusicGenre[];
  education: string;
  experienceYears: number;
  repertoire: string[];
  videoUrls: string[];
  audioSamples: { title: string; duration: string; url: string }[];
  cvUrl?: string;
  avatarUrl: string;
  coverUrl?: string;
  website?: string;
  socialLinks?: { instagram?: string; youtube?: string; linkedin?: string };
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  verificationDocUrl?: string;
  ratingAvg: number;
  ratingCount: number;
  completedJobsCount: number;
  cancellationRate: number; // percentage
  isRecommended?: boolean;
  recommendationPeriod?: 'weekly' | 'monthly';
  recommendationBadge?: string;
  educations?: EducationItem[];
  experiences?: ExperienceItem[];
  mediaItems?: MediaItem[];
  createdAt: string;
}

export interface EnsembleMember {
  id: string;
  userId?: string;
  name: string;
  instrument: Instrument;
  roleTitle: string; // e.g. "1. Keman & Topluluk Lideri"
  joinedYear: number;
  avatarUrl: string;
}

export interface Ensemble {
  id: string;
  leaderUserId: string;
  name: string;
  slug: string;
  discipline?: ArtDiscipline;
  specialtyTags?: string[];
  ensembleType: EnsembleType;
  bio: string;
  foundedYear: number;
  city: string;
  genres: MusicGenre[];
  members: EnsembleMember[];
  repertoire: string[];
  videoUrls: string[];
  avatarUrl: string;
  coverUrl?: string;
  website?: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  ratingAvg: number;
  ratingCount: number;
  completedJobsCount: number;
  cancellationRate: number;
  isRecommended?: boolean;
  recommendationPeriod?: 'weekly' | 'monthly';
  recommendationBadge?: string;
  createdAt: string;
}

export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  businessType: BusinessType;
  disciplines?: ArtDiscipline[];
  facilities?: string[];
  description: string;
  city: string;
  district: string;
  address: string;
  website?: string;
  phone: string;
  email: string;
  taxNumber?: string;
  taxOffice?: string;
  officialTitle?: string;
  logoUrl: string;
  coverUrl?: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  verificationDocUrl?: string;
  ratingAvg: number;
  ratingCount: number;
  completedBookingsCount: number;
  isRecommended?: boolean;
  recommendationPeriod?: 'weekly' | 'monthly';
  recommendationBadge?: string;
  activeListingsCount?: number;
  createdAt: string;
}

export type ListingStatus = 'active' | 'assigned' | 'completed' | 'cancelled';

export interface Listing {
  id: string;
  businessId: string;
  businessName: string;
  businessType: BusinessType;
  businessLogo: string;
  businessVerified: boolean;
  title: string;
  slug: string;
  description: string;
  discipline?: ArtDiscipline;
  specialtyTags?: string[];
  eventType: string; // e.g. "Lobi Konseri", "Gala Gecesi", "Sergi Açılışı"
  genres: MusicGenre[];
  targetEnsembleType: EnsembleType;
  requiredInstruments: Instrument[];
  performerCount: number;
  durationMins: number;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  applicationDeadline: string; // YYYY-MM-DD
  city: string;
  district: string;
  venueName: string;
  isOutdoor: boolean;
  repertoireExpectation: string;
  dressCode: string;
  soundSystemProvided: boolean;
  transportationProvided: boolean;
  accommodationProvided: boolean;
  budgetAmount: number; // TRY
  currency: 'TRY';
  status: ListingStatus;
  isReplacement: boolean;
  originalListingId?: string;
  urgentReason?: string;
  applicationsCount: number;
  createdAt: string;
}

export type ApplicationStatus = 'submitted' | 'shortlisted' | 'selected' | 'rejected' | 'withdrawn';

export interface ListingApplication {
  id: string;
  listingId: string;
  applicantType: 'individual' | 'ensemble';
  applicantId: string; // individualProfile.id or ensemble.id
  applicantUserId: string;
  applicantName: string;
  applicantAvatar: string;
  applicantRating: number;
  applicantCompletedJobs: number;
  applicantCancellationRate: number;
  applicantIsVerified: boolean;
  instrumentsOrType: string;
  genres: MusicGenre[];
  message: string;
  participatingMembers?: string[]; // for ensembles
  status: ApplicationStatus;
  createdAt: string;
}

export type BookingStatus =
  | 'agreement_pending'
  | 'payment_pending'
  | 'confirmed'
  | 'performer_completed'
  | 'employer_completed'
  | 'completed'
  | 'cancelled'
  | 'in_dispute';

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  businessId: string;
  businessName: string;
  applicationId: string;
  performerType: 'individual' | 'ensemble';
  performerId: string;
  performerName: string;
  performerAvatar: string;
  eventDate: string;
  venueName: string;
  city: string;
  netPayoutAmount: number; // What artist gets
  commissionAmount: number; // Platform fee
  grossAmount: number; // Total paid by business
  commissionModel: 'A_EMPLOYER_PAYS' | 'B_ARTIST_DEDUCTS';
  commissionRate: number; // e.g. 10
  status: BookingStatus;
  contractTermsAcceptedByPerformer: boolean;
  contractTermsAcceptedByEmployer: boolean;
  paymentStatus: 'unpaid' | 'held_sandbox' | 'released' | 'refunded';
  cancellationReason?: string;
  cancelledByRole?: 'performer' | 'employer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'employer' | 'performer';
  targetId: string;
  targetName: string;
  scoreOverall: number;
  scoreCommunication: number;
  scoreProfessionalism: number;
  scoreQuality: number;
  comment: string;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  entityName: string;
  accountType: 'artist' | 'ensemble' | 'business';
  documents: { title: string; url: string; type: string }[];
  portfolioUrl?: string;
  videoUrl?: string;
  status: VerificationStatus;
  submittedAt: string;
  adminNote?: string;
}

export type EventCategory =
  | 'Müzik & Konser'
  | 'Sergi & Galeri'
  | 'Atölye & Masterclass'
  | 'Tiyatro & Sahne'
  | 'Festival'
  | 'Diğer';

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  yearStart: string;
  yearEnd: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  year: string;
  description: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'audio';
}

export type AuthModalMode = 'login' | 'register' | 'forgot_password' | null;

export interface PlatformSettings {
  brandName: string;
  tagline: string;
  commissionRate: number; // Default 10%
  commissionModel: 'A_EMPLOYER_PAYS' | 'B_ARTIST_DEDUCTS';
  requireVerificationForListing: boolean;
  autoApproveArtistThreshold: number;
}

export interface EventAnnouncement {
  id: string;
  title: string;
  discipline?: ArtDiscipline;
  category: EventCategory;
  organizerName: string;
  organizerContact?: string;
  venueName: string;
  city: string;
  district?: string;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime?: string;
  genres: MusicGenre[];
  performers: string;
  ticketPrice: number; // 0 for free
  isFree: boolean;
  ticketUrl?: string;
  description: string;
  posterUrl?: string;
  status: 'published' | 'pending_moderation' | 'rejected';
  createdAt: string;
}


