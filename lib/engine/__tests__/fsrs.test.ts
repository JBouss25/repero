import { describe, it, expect } from 'vitest';
import {
  DEFAULT_FSRS_CONFIG,
  needsReview,
  retrievability,
  scheduleNextReview,
} from '../fsrs';
import type { Response, ReviewState } from '../types';

const NOW = Date.UTC(2026, 0, 1);
const DAY = 24 * 60 * 60 * 1000;

function makeReview(overrides: Partial<ReviewState> = {}): ReviewState {
  return {
    itemId: 'item-1',
    lastReviewAt: NOW,
    dueAt: NOW + DAY,
    stabilityDays: 10,
    reps: 5,
    lapses: 0,
    ...overrides,
  };
}

function makeResponse(overrides: Partial<Response> = {}): Response {
  return {
    itemId: 'item-1',
    correct: true,
    timeMs: 5000,
    targetTimeMs: 30000,
    hintsUsed: 0,
    confidence: 'sure',
    at: NOW,
    ...overrides,
  };
}

describe('FSRS', () => {
  it('retrievability décroît avec le temps', () => {
    const state = makeReview({ lastReviewAt: NOW - DAY, stabilityDays: 5 });
    const r1 = retrievability(state, NOW);
    const r2 = retrievability(state, NOW + 10 * DAY);
    expect(r1).toBeGreaterThan(r2);
    expect(r1).toBeGreaterThan(0);
    expect(r1).toBeLessThanOrEqual(1);
  });

  it('§7 : needsReview vrai sous le seuil 0.85', () => {
    const state = makeReview({ lastReviewAt: NOW - 5 * DAY, stabilityDays: 1 });
    expect(needsReview(state, NOW)).toBe(true);
  });

  it('§7 : needsReview faux au-dessus du seuil', () => {
    const state = makeReview({ lastReviewAt: NOW, stabilityDays: 10 });
    expect(needsReview(state, NOW)).toBe(false);
  });

  it('§7 : réponse fausse raccourcit l’intervalle', () => {
    const prev = makeReview({ stabilityDays: 10 });
    const next = scheduleNextReview(prev, makeResponse({ correct: false }), NOW);
    expect(next.stabilityDays).toBeLessThan(prev.stabilityDays);
    expect(next.lapses).toBe(prev.lapses + 1);
  });

  it('§7 : "juste mais au hasard" raccourcit l’intervalle aussi', () => {
    const prev = makeReview({ stabilityDays: 10 });
    const sure = scheduleNextReview(prev, makeResponse({ confidence: 'sure' }), NOW);
    const random = scheduleNextReview(prev, makeResponse({ confidence: 'random' }), NOW);
    expect(random.stabilityDays).toBeLessThan(sure.stabilityDays);
  });

  it('juste + sûr → intervalle augmente', () => {
    const prev = makeReview({ stabilityDays: 5 });
    const next = scheduleNextReview(prev, makeResponse({ confidence: 'sure' }), NOW);
    expect(next.stabilityDays).toBeGreaterThan(prev.stabilityDays);
  });

  it('respecte minStabilityDays et maxStabilityDays', () => {
    const prev = makeReview({ stabilityDays: DEFAULT_FSRS_CONFIG.minStabilityDays });
    const next = scheduleNextReview(prev, makeResponse({ correct: false }), NOW);
    expect(next.stabilityDays).toBeGreaterThanOrEqual(DEFAULT_FSRS_CONFIG.minStabilityDays);

    const prev2 = makeReview({ stabilityDays: DEFAULT_FSRS_CONFIG.maxStabilityDays });
    const next2 = scheduleNextReview(prev2, makeResponse({ confidence: 'sure' }), NOW);
    expect(next2.stabilityDays).toBeLessThanOrEqual(DEFAULT_FSRS_CONFIG.maxStabilityDays);
  });

  it('première exposition : correct → stability initiale, faux → min', () => {
    const r1 = scheduleNextReview(null, makeResponse({ correct: true }), NOW);
    const r2 = scheduleNextReview(null, makeResponse({ correct: false }), NOW);
    expect(r1.stabilityDays).toBe(DEFAULT_FSRS_CONFIG.initialStabilityDays);
    expect(r2.stabilityDays).toBe(DEFAULT_FSRS_CONFIG.minStabilityDays);
    expect(r2.lapses).toBe(1);
  });
});