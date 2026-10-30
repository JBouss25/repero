import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

const PENDING_COOKIE = 'repero_oidc_pending';
const PENDING_TTL_SECONDS = 600;

export interface PendingAuth {
  codeVerifier: string;
  state: string;
  nonce: string;
  returnTo?: string;
}

function secretKey(): Uint8Array {
  return new TextEncoder().encode(env.REPERO_SESSION_SECRET);
}

export async function savePending(payload: PendingAuth): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  const jwt = await new SignJWT({ p: payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(now)
    .setExpirationTime(now + PENDING_TTL_SECONDS)
    .sign(secretKey());

  const jar = await cookies();
  jar.set(PENDING_COOKIE, jwt, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: PENDING_TTL_SECONDS,
  });
}

export async function readPending(): Promise<PendingAuth | null> {
  const jar = await cookies();
  const raw = jar.get(PENDING_COOKIE)?.value;
  if (!raw) return null;
  try {
    const { payload } = await jwtVerify(raw, secretKey(), { algorithms: ['HS256'] });
    return (payload.p as PendingAuth) ?? null;
  } catch {
    return null;
  }
}

export async function clearPending(): Promise<void> {
  const jar = await cookies();
  jar.delete(PENDING_COOKIE);
}