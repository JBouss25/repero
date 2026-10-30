import { NextResponse } from 'next/server';
import { readSession } from '@/lib/oidc/session';
import { composeSessionForStudent } from '@/lib/services/session-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(): Promise<Response> {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  const composed = await composeSessionForStudent(session.user.tenantId, session.user.sub);
  return NextResponse.json(composed);
}