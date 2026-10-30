import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db/client', () => ({
  prisma: {
    response: { create: vi.fn() },
    item: { findUniqueOrThrow: vi.fn().mockResolvedValue({ competenceId: 'C1' }) },
    reviewState: { findUnique: vi.fn().mockResolvedValue(null), upsert: vi.fn() },
    mastery: { findUnique: vi.fn().mockResolvedValue(null), upsert: vi.fn() },
  },
}));

vi.mock('@/lib/oostudy/client', () => ({
  pushMasteryUpdate: vi.fn(),
}));

import { processAnswer } from '../answer-service';

describe('answer-service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('met à jour la maîtrise après une réponse juste', async () => {
    const res = {
      itemId: 'i1',
      correct: true,
      timeMs: 10000,
      targetTimeMs: 30000,
      hintsUsed: 0,
      confidence: 'sure' as const,
      at: Date.now(),
    };
    const result = await processAnswer('t1', 's1', res);
    expect(result.nextMastery.pMastery).toBeGreaterThan(0.1);
  });
});