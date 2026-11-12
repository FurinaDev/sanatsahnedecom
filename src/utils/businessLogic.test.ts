import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCommission,
  calculateCancellationRate,
  canTransitionBookingStatus,
  canBusinessCreateListing,
} from './businessLogic';

test('calculateCommission Model A (Employer pays on top)', () => {
  const result = calculateCommission(20000, 10, 'A_EMPLOYER_PAYS');
  assert.equal(result.performerPayout, 20000);
  assert.equal(result.commissionAmount, 2000);
  assert.equal(result.employerTotal, 22000);
  assert.equal(result.model, 'A_EMPLOYER_PAYS');
});

test('calculateCommission Model B (Artist deducts commission)', () => {
  const result = calculateCommission(20000, 10, 'B_ARTIST_DEDUCTS');
  assert.equal(result.employerTotal, 20000);
  assert.equal(result.commissionAmount, 2000);
  assert.equal(result.performerPayout, 18000);
  assert.equal(result.model, 'B_ARTIST_DEDUCTS');
});

test('calculateCancellationRate calculates correctly', () => {
  assert.equal(calculateCancellationRate(1, 10), 10);
  assert.equal(calculateCancellationRate(0, 15), 0);
  assert.equal(calculateCancellationRate(2, 20), 10);
  assert.equal(calculateCancellationRate(0, 0), 0);
  assert.equal(calculateCancellationRate(3, 7), 42.9);
});

test('canTransitionBookingStatus protects states', () => {
  // Employer cannot report performer completion
  assert.equal(
    canTransitionBookingStatus('confirmed', 'performer_completed', 'business_owner'),
    false
  );
  // Performer can report completion
  assert.equal(
    canTransitionBookingStatus('confirmed', 'performer_completed', 'artist'),
    true
  );
  // Employer completes when performer completed -> completed
  assert.equal(
    canTransitionBookingStatus('performer_completed', 'completed', 'business_owner'),
    true
  );
});

test('canBusinessCreateListing requires verified status', () => {
  assert.equal(canBusinessCreateListing({ isVerified: true, verificationStatus: 'approved' }), true);
  assert.equal(canBusinessCreateListing({ isVerified: false, verificationStatus: 'pending' }), false);
  assert.equal(canBusinessCreateListing({ isVerified: false, verificationStatus: 'rejected' }), false);
});
