import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(): Promise<Response> {
  const { readSession } = await import('@/lib/oidc/session');
  const { composeSessionForStudent } = await import('@/lib/services/session-service');

  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  const composed = await composeSessionForStudent(session.user.tenantId, session.user.sub);
  return NextResponse.json(composed);
}