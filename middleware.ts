import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { readSession } from '@/lib/oidc/session';

const PUBLIC_PATHS = [
  '/login',
  '/api/auth/login',
  '/api/auth/callback',
  '/api/auth/logout',
  '/api/cron',  // ← crons Vercel : pas de session, protégés par header secret
  '/api/waitlist', // ← inscription liste d'attente depuis la page d'accueil
];

function isPublic(pathname: string): boolean {
  // La page d'accueil (landing) est publique — correspondance exacte uniquement
  if (pathname === '/') return true;
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
  // Les fichiers statiques de /public (images, icônes) ne passent pas par l'authentification
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:png|jpe?g|svg|webp|gif|ico)$).*)'],
};