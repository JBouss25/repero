import type { Response, Mastery } from '@prisma/client';

export type AlertType = 'MISCONCEPTION' | 'BLOCKAGE' | 'STAGNATION' | 'DROPOUT' | 'RANDOM';

export interface AlertCandidate {
  type: AlertType;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  detail: string;
}

export async function evaluateAlerts(
  responses: Response[],
  mastery: Mastery[],
  lastSessionAt: Date | null,
): Promise<AlertCandidate[]> {
  const alerts: AlertCandidate[] = [];
  const now = Date.now();

  const wrongSure = responses.filter((r) => !r.correct && r.confidence === 'sure');
  const byItem = new Map<string, number>();
  wrongSure.forEach((r) => byItem.set(r.itemId, (byItem.get(r.itemId) ?? 0) + 1));
  if ([...byItem.values()].some((v) => v >= 2)) {
    alerts.push({ type: 'MISCONCEPTION', priority: 'HIGH', detail: '2 rÃ©ponses fausses dÃ©clarÃ©es sÃ»r' });
  }

  const last3 = responses.slice(0, 3);
  if (last3.length === 3 && last3.every((r) => !r.correct)) {
    alerts.push({ type: 'BLOCKAGE', priority: 'HIGH', detail: '3 rÃ©ponses fausses consÃ©cutives' });
  }

  const stagnant = mastery.filter((m) => !m.mastered && m.pMastery < 0.5);
  if (stagnant.length >= 2) {
    alerts.push({ type: 'STAGNATION', priority: 'MEDIUM', detail: '2 compÃ©tences stagnantes' });
  }

  if (lastSessionAt && now - lastSessionAt.getTime() > 2 * 24 * 60 * 60 * 1000) {
    alerts.push({ type: 'DROPOUT', priority: 'MEDIUM', detail: 'Aucune session depuis 2 jours' });
  }

  const fast = responses.filter((r) => r.timeMs < r.targetTimeMs * 0.3);
  if (fast.length >= 5) {
    alerts.push({ type: 'RANDOM', priority: 'LOW', detail: '5 rÃ©ponses trop rapides' });
  }

  return alerts;
}