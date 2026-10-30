import { describe, it, expect } from 'vitest';
import { DEFAULT_BKT_PARAMS, initialMastery, updateMastery } from '../bkt';
import type { Response } from '../types';

function makeResponse(overrides: Partial<Response> = {}): Response {
  return {
    itemId: 'item-1',
    correct: true,
    timeMs: 20000,
    targetTimeMs: 30000,
    hintsUsed: 0,
    confidence: 'sure',
    at: Date.now(),
    ...overrides,
  };
}

describe('BKT', () => {
  it('initialMastery : p0 et mastered cohérents', () => {
    const m = initialMastery('PC-1B-MEC-03', 0.1);
    expect(m.pMastery).toBe(0.1);
    expect(m.mastered).toBe(false);

    const high = initialMastery('PC-1B-MEC-03', 0.95);
    expect(high.mastered).toBe(true);
  });

  it('§7 : réponse juste fait progresser la maîtrise', () => {
    const before = initialMastery('C1', 0.1);
    const after = updateMastery(before, makeResponse({ correct: true, confidence: 'sure' }));
    expect(after.pMastery).toBeGreaterThan(before.pMastery);
  });

  it('§7 : réponse fausse fait baisser la maîtrise', () => {
    const before = initialMastery('C1', 0.7);
    const after = updateMastery(before, makeResponse({ correct: false, confidence: 'sure' }));
    expect(after.pMastery).toBeLessThan(before.pMastery);
  });

  it('§7 : 3 indices → gain quasi nul', () => {
    const before = initialMastery('C1', 0.1);
    const noHint = updateMastery(before, makeResponse({ hintsUsed: 0 }));
    const threeHints = updateMastery(before, makeResponse({ hintsUsed: 3 }));
    const gainNoHint = noHint.pMastery - before.pMastery;
    const gainThreeHints = threeHints.pMastery - before.pMastery;
    expect(gainThreeHints).toBeLessThan(gainNoHint * 0.6);
  });

  it('§8 : temps < 30 % du temps cible → gain réduit', () => {
    const before = initialMastery('C1', 0.1);
    const normal = updateMastery(
      before,
      makeResponse({ timeMs: 20000, targetTimeMs: 30000 }),
    );
    const tooFast = updateMastery(
      before,
      makeResponse({ timeMs: 5000, targetTimeMs: 30000 }),
    );
    expect(tooFast.pMastery - before.pMastery).toBeLessThan(
      normal.pMastery - before.pMastery,
    );
  });

  it('§7 : "juste mais au hasard" ne fait pas progresser la maîtrise', () => {
    const before = initialMastery('C1', 0.5);
    const after = updateMastery(
      before,
      makeResponse({ correct: true, confidence: 'random' }),
    );
    expect(after.pMastery).toBeLessThanOrEqual(before.pMastery + 0.05);
  });

  it('§7 : seuil de maîtrise 0.90', () => {
    const before = initialMastery('C1', 0.89);
    let m = before;
    for (let i = 0; i < 10; i++) {
      m = updateMastery(m, makeResponse({ correct: true }));
    }
    expect(m.pMastery).toBeGreaterThanOrEqual(DEFAULT_BKT_PARAMS.masteredThreshold);
    expect(m.mastered).toBe(true);
  });

  it('pMastery reste borné entre 0 et 1', () => {
    let m = initialMastery('C1', 0.99);
    for (let i = 0; i < 20; i++) {
      m = updateMastery(m, makeResponse({ correct: true }));
      expect(m.pMastery).toBeLessThanOrEqual(1);
    }
    m = initialMastery('C1', 0.01);
    for (let i = 0; i < 20; i++) {
      m = updateMastery(m, makeResponse({ correct: false }));
      expect(m.pMastery).toBeGreaterThanOrEqual(0);
    }
  });
});