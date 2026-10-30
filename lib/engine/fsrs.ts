import type { FsrsConfig, Response, ReviewState } from './types';

export const DEFAULT_FSRS_CONFIG: FsrsConfig = {
  targetRetention: 0.85,
  initialStabilityDays: 1,
  minStabilityDays: 0.5,
  maxStabilityDays: 365,
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function retrievability(state: ReviewState, now: number): number {
  const elapsedDays = Math.max(0, (now - state.lastReviewAt) / DAY_MS);
  return Math.exp(-elapsedDays / Math.max(0.01, state.stabilityDays));
}

export function needsReview(state: ReviewState, now: number, cfg = DEFAULT_FSRS_CONFIG): boolean {
  return retrievability(state, now) < cfg.targetRetention;
}

export function scheduleNextReview(
  prev: ReviewState | null,
  response: Response,
  now: number,
  cfg = DEFAULT_FSRS_CONFIG,
): ReviewState {
  if (!prev) {
    const initial = response.correct ? cfg.initialStabilityDays : cfg.minStabilityDays;
    return {
      itemId: response.itemId,
      lastReviewAt: now,
      dueAt: now + initial * DAY_MS,
      stabilityDays: initial,
      reps: 1,
      lapses: response.correct ? 0 : 1,
    };
  }

  let factor: number;
  if (!response.correct) {
    factor = 0.3;
  } else if (response.confidence === 'random') {
    factor = 0.7;
  } else if (response.confidence === 'hesitant') {
    factor = 1.6;
  } else {
    factor = 2.5;
  }

  const nextStability = clamp(
    prev.stabilityDays * factor,
    cfg.minStabilityDays,
    cfg.maxStabilityDays,
  );

  return {
    itemId: prev.itemId,
    lastReviewAt: now,
    dueAt: now + nextStability * DAY_MS,
    stabilityDays: nextStability,
    reps: prev.reps + 1,
    lapses: prev.lapses + (response.correct ? 0 : 1),
  };
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}