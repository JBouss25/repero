import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { readSession } from '@/lib/oidc/session';

const PUBLIC_PATHS = [
  '/login',
  '/api/auth/login',
  '/api/auth/callback',
  '/api/auth/logout',
  '/api/cron',  // ← crons Vercel : pas de session, protégés par header secret
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  const session = await readSession();

  if (!session) {
    const loginUrl = new URL('/api/auth/login', request.url);
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set('x-tenant-id', session.user.tenantId);
  response.headers.set('x-user-id', session.user.sub);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json).*)'],
};