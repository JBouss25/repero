import { composeDailySession } from '@/lib/engine/selector';
import { PrismaItemRepository } from '@/lib/db/repository';
import { prisma } from '@/lib/db/client';
import type { Session } from '@/lib/engine/types';

const repo = new PrismaItemRepository();

export async function composeSessionForStudent(
  tenantId: string,
  studentId: string,
): Promise<Session> {
  const now = Date.now();

  const exams = await prisma.examDate.findMany({
    where: { tenantId, studentId, at: { gte: new Date() } },
    select: { chapter: true, at: true },
  });

  return composeDailySession({
    tenantId,
    studentId,
    now,
    exams: exams.map((e) => ({ chapter: e.chapter, at: e.at.getTime() })),
    repo,
  });
}