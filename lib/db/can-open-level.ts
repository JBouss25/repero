import type { Curriculum } from '@prisma/client';
import { prisma } from './client';

export const MIN_VALIDATED_ITEMS = 400;

export async function canOpenLevel(
  tenantId: string,
  level: string,
  discipline: string,
  curriculum: Curriculum,
): Promise<{ allowed: boolean; count: number; required: number }> {
  const count = await prisma.item.count({
    where: {
      tenantId,
      level,
      curriculum,
      validations: { some: { passedAt: { not: null } } },
    },
  });

  return { allowed: count >= MIN_VALIDATED_ITEMS, count, required: MIN_VALIDATED_ITEMS };
}