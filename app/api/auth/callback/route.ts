import * as client from 'openid-client';
import { NextResponse } from 'next/server';
import { getOidcConfig } from '@/lib/oidc/config';
import { readPending, clearPending } from '@/lib/oidc/pkce-store';
import { extractSessionUser, OidcClaimError } from '@/lib/oidc/claims';
import { createSession } from '@/lib/oidc/session';
import { env } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<Response> {
  const pending = await readPending();
  if (!pending) {
    return NextResponse.json({ error: 'OIDC_STATE_EXPIRED' }, { status: 400 });
  }

  const cfg = await getOidcConfig();
  const currentUrl = new URL(request.url);

  let tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers;
  try {
    tokens = await client.authorizationCodeGrant(cfg, currentUrl, {
      pkceCodeVerifier: pending.codeVerifier,
      expectedState: pending.state,
      expectedNonce: pending.nonce,
      idTokenExpected: true,
    });
  } catch (err) {
    await clearPending();
    console.error('[OIDC] authorizationCodeGrant failed', (err as Error).message);
    return NextResponse.json({ error: 'OIDC_TOKEN_EXCHANGE_FAILED' }, { status: 400 });
  }

  const claims = tokens.claims();
  if (!claims) {
    await clearPending();
    return NextResponse.json({ error: 'OIDC_NO_CLAIMS' }, { status: 400 });
  }

  let user;
  try {
    user = extractSessionUser(claims as unknown as Record<string, unknown>);
  } catch (err) {
    await clearPending();
    if (err instanceof OidcClaimError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: 403 });
    }
    throw err;
  }

  await createSession(user, {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    idToken: tokens.id_token,
    expiresAt: Date.now() + (tokens.expires_in ?? 3600) * 1000,
  });

  await clearPending();

  const target = pending.returnTo && pending.returnTo.startsWith('/')
    ? pending.returnTo
    : '/dashboard';

  return NextResponse.redirect(new URL(target, env.REPERO_BASE_URL).href);
}