import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';
import type { Session, SessionUser, SessionTokens } from '@/lib/types';

const COOKIE_NAME = 'repero_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 heures

function secretKey(): Uint8Array {
  return new TextEncoder().encode(env.REPERO_SESSION_SECRET);
}

function getDevSession(): Session | null {
  if (process.env.DEV_AUTH_BYPASS !== 'true') return null;
  
  const now = Date.now();
  return {
    user: {
      sub: 'dev-user-001',
      tenantId: '11111111-1111-1111-1111-111111111111',
      email: 'dev@repero.local',
      roles: ['student'],
    },
    createdAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000,
  };
}

export async function createSession(user: SessionUser, tokens: SessionTokens): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  
  // On ne met PAS les tokens dans le cookie pour éviter l'erreur "Too Many Redirects"
  // (dépassement de la limite de 4Ko par le navigateur)
  const payload: Session = {
    user,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
  };

  const jwt = await new SignJWT({ session: payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_TTL_SECONDS)
    .sign(secretKey());

  const jar = await cookies();
  jar.set(COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    // 'lax' suffit car repero.oostudy.ma et auth.oostudy.ma partagent le même domaine racine
    sameSite: 'lax', 
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function readSession(): Promise<Session | null> {
  const devSession = getDevSession();
  if (devSession) return devSession;

  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  try {
    const { payload } = await jwtVerify(raw, secretKey(), { algorithms: ['HS256'] });
    return (payload.session as Session) ?? null;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;