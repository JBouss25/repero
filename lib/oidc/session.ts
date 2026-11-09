import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';
import type { Session, SessionUser, SessionTokens } from '@/lib/types';

const COOKIE_NAME = 'repero_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

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
    tokens: {
      accessToken: 'dev-token',
      expiresAt: now + 24 * 60 * 60 * 1000,
    },
    createdAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000,
  };
}

export async function createSession(user: SessionUser, tokens: SessionTokens): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  const payload: Session = {
    user,
    tokens,
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
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function readSession(): Promise<Session | null> {
  // BYPASS : session de test en production
  const devSession = getDevSession();
  if (devSession) return devSession;

  // Sinon : lecture normale du cookie JWT
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