import { describe, it, expect } from 'vitest';
import { composeDailySession } from '../selector';
import type { Item, ItemRepository, SessionContext } from '../types';

function makeItem(overrides: Partial<Item> = {}): Item {
  return {
    id: 'item-1',
    competenceId: 'C1',
    chapter: 'Chapitre A',
    level: '3e',
    bloom: 'apply',
    difficulty: 3,
    curriculum: 'marocain',
    targetTimeS: 60,
    format: 'qcm',
    phases: ['warmup', 'core', 'self_eval', 'challenge'],
    ...overrides,
  };
}

function makeRepo(overrides: Partial<ItemRepository> = {}): ItemRepository {
  return {
    dueItems: async () => [
      makeItem({ id: 'w1', chapter: 'Chapitre A' }),
      makeItem({ id: 'w2', chapter: 'Chapitre A' }),
      makeItem({ id: 'w3', chapter: 'Chapitre A' }),
    ],
    weakestUnmastered: async () => ({ competenceId: 'C1', pMastery: 0.2 }),
    itemsForCompetence: async () => [makeItem({ id: 'core1', chapter: 'Chapitre B' })],
    itemsByPredictedSuccess: async () => [
      makeItem({ id: 's1', chapter: 'Chapitre B' }),
      makeItem({ id: 's2', chapter: 'Chapitre A' }),
      makeItem({ id: 's3', chapter: 'Chapitre B' }),
    ],
    adjacentBloom: async () => [makeItem({ id: 'chal1', chapter: 'Chapitre B', bloom: 'analyze' })],
    examItems: async () => [],
    ...overrides,
  };
}

describe('Sélecteur Daily 15', () => {
  it('§4 : 4 phases présentes dans l’ordre', async () => {
    const session = await composeDailySession({
      tenantId: 't1',
      studentId: 's1',
      now: Date.now(),
      exams: [],
      repo: makeRepo(),
    } as SessionContext);

    expect(session.phases.warmup.length).toBeGreaterThan(0);
    expect(session.phases.core.length).toBeGreaterThan(0);
    expect(session.phases.self_eval.length).toBeGreaterThan(0);
    expect(session.phases.challenge.length).toBeGreaterThan(0);
  });

  it('§4 : volume total entre 8 et 10 items', async () => {
    const session = await composeDailySession({
      tenantId: 't1',
      studentId: 's1',
      now: Date.now(),
      exams: [],
      repo: makeRepo(),
    } as SessionContext);

    expect(session.items.length).toBeGreaterThanOrEqual(8);
    expect(session.items.length).toBeLessThanOrEqual(10);
  });

  it('§7 R5 : au moins 2 chapitres distincts', async () => {
    const session = await composeDailySession({
      tenantId: 't1',
      studentId: 's1',
      now: Date.now(),
      exams: [],
      repo: makeRepo(),
    } as SessionContext);

    const chapters = new Set(session.items.map((s) => s.item.chapter));
    expect(chapters.size).toBeGreaterThanOrEqual(2);
  });

  it('§7 R6 : contrôle à J-9 → ≥ 60 % des items du programme', async () => {
    const now = Date.UTC(2026, 5, 1);
    const jMinus9 = now + 9 * 24 * 60 * 60 * 1000;

    const session = await composeDailySession({
      tenantId: 't1',
      studentId: 's1',
      now,
      exams: [{ chapter: 'Chapitre A', at: jMinus9 }],
      repo: makeRepo({
        examItems: async () => [
          makeItem({ id: 'e1', chapter: 'Chapitre A' }),
          makeItem({ id: 'e2', chapter: 'Chapitre A' }),
        ],
      }),
    } as SessionContext);

    const examCount = session.items.filter((s) => s.item.chapter === 'Chapitre A').length;
    const ratio = examCount / session.items.length;
    expect(ratio).toBeGreaterThanOrEqual(0.6);
  });

  it('§7 : chaque item a une raison journalisée', async () => {
    const session = await composeDailySession({
      tenantId: 't1',
      studentId: 's1',
      now: Date.now(),
      exams: [],
      repo: makeRepo(),
    } as SessionContext);

    expect(session.reasons.length).toBeGreaterThanOrEqual(session.items.length);
    for (const s of session.items) {
      const log = session.reasons.find((r) => r.itemId === s.item.id);
      expect(log).toBeDefined();
    }
  });
});