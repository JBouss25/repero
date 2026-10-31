import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const { readSession } = await import('@/lib/oidc/session');
  const { getStreak } = await import('@/lib/services/streak-service');

  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  const streak = await getStreak(session.user.tenantId, session.user.sub);
  return NextResponse.json({ current: streak?.current ?? 0, longest: streak?.longest ?? 0 });
}