import type {
  Item as EngineItem,
  ItemRepository,
  Phase as EnginePhase,
} from '@/lib/engine/types';
import type { Item as PrismaItem, Phase as PrismaPhase } from '@prisma/client';
import { prisma } from './client';

function toEngineItem(row: PrismaItem): EngineItem {
  return {
    id: row.id,
    competenceId: row.competenceId,
    chapter: row.chapter,
    level: row.level,
    bloom: row.bloom,
    difficulty: row.difficulty as EngineItem['difficulty'],
    curriculum: row.curriculum,
    targetTimeS: row.targetTimeS,
    format: row.format,
    phases: row.phases as EnginePhase[],
  };
}

export class PrismaItemRepository implements ItemRepository {
  async dueItems(tenantId: string, studentId: string, limit: number): Promise<EngineItem[]> {
    const states = await prisma.reviewState.findMany({
      where: { tenantId, studentId, dueAt: { lte: new Date() } },
      orderBy: { dueAt: 'asc' },
      take: limit,
      include: { item: true },
    });
    return states.map((s) => toEngineItem(s.item));
  }

  async weakestUnmastered(
    tenantId: string,
    studentId: string,
  ): Promise<{ competenceId: string; pMastery: number } | null> {
    const row = await prisma.mastery.findFirst({
      where: { tenantId, studentId, mastered: false },
      orderBy: { pMastery: 'asc' },
    });
    return row ? { competenceId: row.competenceId, pMastery: row.pMastery } : null;
  }

  async itemsForCompetence(
    tenantId: string,
    competenceId: string,
    phase: EnginePhase,
    limit: number,
  ): Promise<EngineItem[]> {
    const rows = await prisma.item.findMany({
      where: {
        tenantId,
        competenceId,
        phases: { has: phase as PrismaPhase },
      },
      take: limit,
    });
    return rows.map(toEngineItem);
  }

  async itemsByPredictedSuccess(
    tenantId: string,
    _studentId: string,
    _target: number,
    limit: number,
  ): Promise<EngineItem[]> {
    const rows = await prisma.item.findMany({
      where: { tenantId, difficulty: 3 },
      take: limit,
    });
    return rows.map(toEngineItem);
  }

  async adjacentBloom(
    tenantId: string,
    competenceId: string,
    limit: number,
  ): Promise<EngineItem[]> {
    const current = await prisma.item.findFirst({
      where: { tenantId, competenceId },
      select: { bloom: true },
    });
    if (!current) return [];
    const order = ['remember', 'understand', 'apply', 'analyze', 'evaluate'] as const;
    const idx = order.indexOf(current.bloom as (typeof order)[number]);
    const next = idx >= 0 && idx + 1 < order.length ? order[idx + 1] : current.bloom;
    const rows = await prisma.item.findMany({
      where: { tenantId, competenceId, bloom: next },
      take: limit,
    });
    return rows.map(toEngineItem);
  }

  async examItems(
    tenantId: string,
    _studentId: string,
    chapters: string[],
    limit: number,
  ): Promise<EngineItem[]> {
    const rows = await prisma.item.findMany({
      where: { tenantId, chapter: { in: chapters } },
      take: limit,
    });
    return rows.map(toEngineItem);
  }
}