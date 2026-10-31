import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request): Promise<Response> {
  // Import dynamique : évite l'évaluation du module au build
  const { readSession } = await import('@/lib/oidc/session');
  const { processAnswer } = await import('@/lib/services/answer-service');

  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  try {
    const body = await req.json();
    const result = await processAnswer(session.user.tenantId, session.user.sub, body);
    return NextResponse.json({
      ok: true,
      nextReview: { dueAt: result.nextReview.dueAt, stabilityDays: result.nextReview.stabilityDays },
      nextMastery: { pMastery: result.nextMastery.pMastery, mastered: result.nextMastery.mastered },
    });
  } catch (err) {
    console.error('[API /answer]', (err as Error).message);
    return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 });
  }
}