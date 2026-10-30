import type { Mastery, Response } from './types';

export const DEFAULT_BKT_PARAMS = {
  slip: 0.1,
  guess: 0.25,
  transit: 0.2,
  masteredThreshold: 0.90,
} as const;

const EPSILON = 1e-9;

export function initialMastery(competenceId: string, p0 = 0.1): Mastery {
  return {
    competenceId,
    pMastery: clamp(p0, 0, 1),
    slip: DEFAULT_BKT_PARAMS.slip,
    guess: DEFAULT_BKT_PARAMS.guess,
    transit: DEFAULT_BKT_PARAMS.transit,
    mastered: p0 + EPSILON >= DEFAULT_BKT_PARAMS.masteredThreshold,
  };
}

export function updateMastery(prev: Mastery, response: Response): Mastery {
  const p = prev.pMastery;
  const { slip, guess, transit } = prev;
  // Le seuil de maîtrise est un paramètre GLOBAL du moteur (CDC §7),
  // pas une propriété par compétence. On le lit donc à chaque appel.
  const masteredThreshold = DEFAULT_BKT_PARAMS.masteredThreshold;

  const effectiveCorrect = response.correct && response.confidence !== 'random';

  const pCorrectIfMastered = 1 - slip;
  const pCorrectIfNotMastered = guess;

  const pObservation = effectiveCorrect
    ? p * pCorrectIfMastered + (1 - p) * pCorrectIfNotMastered
    : p * slip + (1 - p) * (1 - guess);

  const pMasteredGivenObs = effectiveCorrect
    ? (p * pCorrectIfMastered) / pObservation
    : (p * slip) / pObservation;

  const pLearn = pMasteredGivenObs + (1 - pMasteredGivenObs) * transit;

  const hintWeight = Math.max(0, 1 - 0.15 * response.hintsUsed);

  const timeRatio = response.targetTimeMs > 0 ? response.timeMs / response.targetTimeMs : 1;
  const timeWeight = timeRatio < 0.3 ? 0.5 : 1;

  const effectiveGain = (pLearn - p) * hintWeight * timeWeight;
  const next = clamp(p + effectiveGain, 0, 1);

  return {
    ...prev,
    pMastery: next,
    mastered: next + EPSILON >= masteredThreshold,
  };
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}