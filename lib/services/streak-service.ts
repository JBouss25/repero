import { prisma } from '@/lib/db/client';

const DAY_MS = 24 * 60 * 60 * 1000;

export async function updateStreak(tenantId: string, studentId: string) {
  const now = new Date();
  const existing = await prisma.streak.findUnique({
    where: { tenantId_studentId: { tenantId, studentId } },
  });

  if (!existing) {
    return prisma.streak.create({
      data: { tenantId, studentId, current: 1, longest: 1, lastActiveAt: now },
    });
  }

  const lastActive = existing.lastActiveAt;
  const daysSince = lastActive
    ? Math.floor((now.getTime() - lastActive.getTime()) / DAY_MS)
    : 999;

  const canUseJoker =
    daysSince === 2 &&
    (!existing.jokerUsedAt ||
      now.getTime() - existing.jokerUsedAt.getTime() > 7 * DAY_MS);

  const nextCurrent =
    daysSince === 0 ? existing.current
    : daysSince === 1 ? existing.current + 1
    : canUseJoker ? existing.current + 1
    : 1;

  return prisma.streak.update({
    where: { tenantId_studentId: { tenantId, studentId } },
    data: {
      current: nextCurrent,
      longest: Math.max(existing.longest, nextCurrent),
      lastActiveAt: now,
      ...(canUseJoker && { jokerUsedAt: now }),
    },
  });
}

export async function getStreak(tenantId: string, studentId: string) {
  return prisma.streak.findUnique({
    where: { tenantId_studentId: { tenantId, studentId } },
  });
}