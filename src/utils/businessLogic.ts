/**
 * Business logic and pure calculations for Kültür-Sanat Pazaryeri Platform
 * Includes commission models (Model A & Model B), cancellation rate algorithms,
 * and booking state transitions.
 */

export type CommissionModel = 'A_EMPLOYER_PAYS' | 'B_ARTIST_DEDUCTS';

export interface CommissionCalculation {
  grossAmount: number;
  commissionRate: number;
  commissionAmount: number;
  performerPayout: number;
  employerTotal: number;
  model: CommissionModel;
}

/**
 * Calculates commission and net payouts based on platform commission model.
 * Model A: Employer pays commission on top of performer's net quote.
 * Model B: Commission is deducted from the total paid by the employer.
 */
export function calculateCommission(
  baseAmount: number,
  commissionRatePct: number = 10,
  model: CommissionModel = 'A_EMPLOYER_PAYS'
): CommissionCalculation {
  if (baseAmount < 0) {
    throw new Error('Amount cannot be negative');
  }
  const rate = Math.max(0, Math.min(100, commissionRatePct));
  const commissionAmount = Math.round((baseAmount * rate) / 100);

  if (model === 'A_EMPLOYER_PAYS') {
    return {
      grossAmount: baseAmount + commissionAmount,
      commissionRate: rate,
      commissionAmount,
      performerPayout: baseAmount,
      employerTotal: baseAmount + commissionAmount,
      model: 'A_EMPLOYER_PAYS',
    };
  } else {
    return {
      grossAmount: baseAmount,
      commissionRate: rate,
      commissionAmount,
      performerPayout: baseAmount - commissionAmount,
      employerTotal: baseAmount,
      model: 'B_ARTIST_DEDUCTS',
    };
  }
}

/**
 * Calculates performer's cancellation rate as a percentage.
 * Only performer-initiated cancellations for confirmed bookings count.
 */
export function calculateCancellationRate(
  performerCancelledCount: number,
  totalConfirmedBookings: number
): number {
  if (totalConfirmedBookings <= 0) return 0;
  if (performerCancelledCount <= 0) return 0;
  const rate = (performerCancelledCount / totalConfirmedBookings) * 100;
  return Math.min(100, Math.round(rate * 10) / 10);
}

export type BookingStatus =
  | 'application_received'
  | 'shortlisted'
  | 'selected'
  | 'agreement_pending'
  | 'payment_pending'
  | 'confirmed'
  | 'performer_completed'
  | 'employer_completed'
  | 'payout_processing'
  | 'completed'
  | 'cancelled'
  | 'in_dispute'
  | 'refund_in_progress';

export type UserRole = 'artist' | 'ensemble_leader' | 'business_owner' | 'admin';

/**
 * Validates whether a state transition is allowed in the booking state machine.
 */
export function canTransitionBookingStatus(
  current: BookingStatus,
  target: BookingStatus,
  role: UserRole
): boolean {
  if (role === 'admin') return true;

  switch (current) {
    case 'selected':
      return target === 'agreement_pending';

    case 'agreement_pending':
      // Both sides can accept agreement to advance to payment
      return target === 'payment_pending' || target === 'cancelled';

    case 'payment_pending':
      // Employer pays to confirm booking
      if (role === 'business_owner') {
        return target === 'confirmed' || target === 'cancelled';
      }
      return false;

    case 'confirmed':
      // Either side can report completion, or report cancellation / dispute
      if (role === 'artist' || role === 'ensemble_leader') {
        return target === 'performer_completed' || target === 'cancelled' || target === 'in_dispute';
      }
      if (role === 'business_owner') {
        return target === 'employer_completed' || target === 'cancelled' || target === 'in_dispute';
      }
      return false;

    case 'performer_completed':
      // Waiting for employer to confirm, which finishes the service
      if (role === 'business_owner') {
        return target === 'completed' || target === 'in_dispute';
      }
      return false;

    case 'employer_completed':
      // Waiting for performer to confirm
      if (role === 'artist' || role === 'ensemble_leader') {
        return target === 'completed' || target === 'in_dispute';
      }
      return false;

    default:
      return false;
  }
}

/**
 * Checks if a business profile is verified and authorized to publish listings.
 */
export function canBusinessCreateListing(profile: { isVerified: boolean; verificationStatus: string }): boolean {
  return profile.isVerified === true && profile.verificationStatus === 'approved';
}

/**
 * Currency formatter for Turkish Lira
 */
export function formatCurrencyTRY(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);
}
