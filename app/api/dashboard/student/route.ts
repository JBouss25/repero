import { NextResponse } from 'next/server';
import { readSession } from '@/lib/oidc/session';
import { prisma } from '@/lib/db/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  const [mastery, dueCount] = await Promise.all([
    prisma.mastery.findMany({
      where: { tenantId: session.user.tenantId, studentId: session.user.sub },
      orderBy: { pMastery: 'asc' },
      take: 5,
    }),
    prisma.reviewState.count({
      where: {
        tenantId: session.user.tenantId,
        studentId: session.user.sub,
        dueAt: { lte: new Date() },
      },
    }),
  ]);

  return NextResponse.json({
    mastery: mastery.map((m) => ({
      competenceId: m.competenceId,
      pMastery: m.pMastery,
      mastered: m.mastered,
    })),
    dueCount,
  });
}