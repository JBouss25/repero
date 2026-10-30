import { NextResponse } from 'next/server';
import { readSession } from '@/lib/oidc/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user: session.user,
    expiresAt: session.expiresAt,
  });
}