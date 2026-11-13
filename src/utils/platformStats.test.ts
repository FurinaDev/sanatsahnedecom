import test from 'node:test';
import assert from 'node:assert/strict';
import { computePlatformStats, selectRecommendedTalents } from './platformStats';
import { INITIAL_INDIVIDUAL_PROFILES, INITIAL_ENSEMBLES } from '../data/seedData';

test('computePlatformStats counts active listings, published events, artists, businesses, and satisfaction', () => {
  const result = computePlatformStats({
    artists: [
      { ratingAvg: 5.0, ratingCount: 10 },
      { ratingAvg: 4.5, ratingCount: 10 },
    ],
    ensembles: [{ ratingAvg: 5.0, ratingCount: 5 }],
    businesses: [{ ratingAvg: 4.8, ratingCount: 5 }],
    listings: [
      { status: 'active' },
      { status: 'active' },
      { status: 'completed' },
      { status: 'cancelled' },
    ],
    events: [
      { status: 'published' },
      { status: 'pending_moderation' },
      { status: 'rejected' },
    ],
    reviews: [{ scoreOverall: 5 }],
  });

  assert.equal(result.artistCount, 2);
  assert.equal(result.businessCount, 1);
  assert.equal(result.listingCount, 2);
  assert.equal(result.eventCount, 1);
  assert.equal(result.averageRating, 4.81);
  assert.equal(result.satisfactionPercent, 96);
});

test('computePlatformStats updates immediately when entities or reviews change', () => {
  const initial = computePlatformStats({
    artists: [{ ratingAvg: 4.0, ratingCount: 1 }],
    ensembles: [],
    businesses: [],
    listings: [{ status: 'active' }],
    events: [{ status: 'published' }],
    reviews: [],
  });

  const updated = computePlatformStats({
    artists: [
      { ratingAvg: 4.0, ratingCount: 1 },
      { ratingAvg: 5.0, ratingCount: 9 },
    ],
    ensembles: [],
    businesses: [{ ratingAvg: 5.0, ratingCount: 2 }],
    listings: [{ status: 'active' }, { status: 'active' }],
    events: [{ status: 'published' }, { status: 'published' }],
    reviews: [{ scoreOverall: 5 }],
  });

  assert.equal(initial.artistCount, 1);
  assert.equal(updated.artistCount, 2);
  assert.equal(updated.businessCount, 1);
  assert.equal(updated.listingCount, 2);
  assert.equal(updated.eventCount, 2);
  assert.ok(updated.satisfactionPercent > initial.satisfactionPercent);
});

test('selectRecommendedTalents returns capped top-rated recommendations and accurate total count', () => {
  const result = selectRecommendedTalents(INITIAL_INDIVIDUAL_PROFILES, INITIAL_ENSEMBLES, 4);
  assert.equal(result.items.length, 4);
  assert.ok(result.totalRecommended >= 4);
  assert.ok(result.items.every((item) => item.ratingAvg >= 4.9 || item.isRecommended));
});
