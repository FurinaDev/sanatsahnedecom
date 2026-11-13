import type {
  BusinessProfile,
  Ensemble,
  EventAnnouncement,
  IndividualProfile,
  Listing,
  Review,
} from '../types';

export interface PlatformStatsInput {
  artists: Pick<IndividualProfile, 'ratingAvg' | 'ratingCount'>[];
  ensembles: Pick<Ensemble, 'ratingAvg' | 'ratingCount'>[];
  businesses: Pick<BusinessProfile, 'ratingAvg' | 'ratingCount'>[];
  listings: Pick<Listing, 'status'>[];
  events: Pick<EventAnnouncement, 'status'>[];
  reviews?: Pick<Review, 'scoreOverall'>[];
}

export interface PlatformStats {
  artistCount: number;
  businessCount: number;
  listingCount: number;
  eventCount: number;
  averageRating: number;
  satisfactionPercent: number;
}

export interface RecommendedTalentItem {
  id: string;
  kind: 'artist' | 'ensemble';
  name: string;
  subtitle: string;
  badgeLabel: string;
  city: string;
  district?: string;
  genres: string[];
  coverUrl: string;
  avatarUrl: string;
  isVerified: boolean;
  isRecommended: boolean;
  ratingAvg: number;
  completedJobsCount: number;
  cancellationRate: number;
}

/**
 * Computes real-time platform counters from active application state.
 * Keeps Hero counters synchronized whenever artists, businesses,
 * listings, events, or reviews are added or updated.
 */
export function computePlatformStats({
  artists,
  ensembles,
  businesses,
  listings,
  events,
  reviews = [],
}: PlatformStatsInput): PlatformStats {
  const artistCount = artists.length;
  const businessCount = businesses.length;
  const listingCount = listings.filter((l) => l.status === 'active').length;
  const eventCount = events.filter((e) => e.status === 'published').length;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const entity of [...artists, ...ensembles, ...businesses]) {
    const rating = Number(entity.ratingAvg);
    if (!Number.isFinite(rating) || rating <= 0) continue;
    const weight = entity.ratingCount > 0 ? entity.ratingCount : 1;
    weightedSum += rating * weight;
    totalWeight += weight;
  }

  for (const review of reviews) {
    const rating = Number(review.scoreOverall);
    if (!Number.isFinite(rating) || rating <= 0) continue;
    weightedSum += rating;
    totalWeight += 1;
  }

  const averageRating = totalWeight > 0 ? weightedSum / totalWeight : 4.9;
  const satisfactionPercent = Math.min(
    100,
    Math.max(0, Math.round((averageRating / 5) * 100))
  );

  return {
    artistCount,
    businessCount,
    listingCount,
    eventCount,
    averageRating: Math.round(averageRating * 100) / 100,
    satisfactionPercent,
  };
}

/**
 * Selects and ranks recommended artists and ensembles for the homepage strip.
 */
export function selectRecommendedTalents(
  artists: IndividualProfile[],
  ensembles: Ensemble[],
  limit = 4
): { items: RecommendedTalentItem[]; totalRecommended: number } {
  const artistItems: RecommendedTalentItem[] = artists.map((a) => ({
    id: a.id,
    kind: 'artist',
    name: a.fullName,
    subtitle: a.title,
    badgeLabel: a.primaryInstrument,
    city: a.city,
    district: a.district,
    genres: a.genres,
    coverUrl: a.coverUrl || a.avatarUrl,
    avatarUrl: a.avatarUrl,
    isVerified: a.isVerified,
    isRecommended: Boolean(a.isRecommended),
    ratingAvg: a.ratingAvg,
    completedJobsCount: a.completedJobsCount,
    cancellationRate: a.cancellationRate,
  }));

  const ensembleItems: RecommendedTalentItem[] = ensembles.map((e) => ({
    id: e.id,
    kind: 'ensemble',
    name: e.name,
    subtitle: `${e.ensembleType} · ${e.members.length} Müzisyen`,
    badgeLabel: 'Topluluk',
    city: e.city,
    genres: e.genres,
    coverUrl: e.coverUrl || e.avatarUrl,
    avatarUrl: e.avatarUrl,
    isVerified: e.isVerified,
    isRecommended: Boolean(e.isRecommended),
    ratingAvg: e.ratingAvg,
    completedJobsCount: e.completedJobsCount,
    cancellationRate: e.cancellationRate,
  }));

  const sorted = [...artistItems, ...ensembleItems].sort(
    (a, b) =>
      Number(b.isRecommended) - Number(a.isRecommended) ||
      b.ratingAvg - a.ratingAvg ||
      b.completedJobsCount - a.completedJobsCount
  );

  const recommended = sorted.filter((item) => item.isRecommended || item.ratingAvg >= 4.9);
  const pool = recommended.length > 0 ? recommended : sorted;

  return {
    items: pool.slice(0, limit),
    totalRecommended: pool.length,
  };
}
