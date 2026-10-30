import { NextResponse } from 'next/server';
import { readSession } from '@/lib/oidc/session';
import { getStreak } from '@/lib/services/streak-service';

export const runtime = 'nodejs';

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const streak = await getStreak(session.user.tenantId, session.user.sub);
  return NextResponse.json({ current: streak?.current ?? 0, longest: streak?.longest ?? 0 });
}