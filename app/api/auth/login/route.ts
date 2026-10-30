import * as client from 'openid-client';
import { NextResponse } from 'next/server';
import { getOidcConfig } from '@/lib/oidc/config';
import { savePending } from '@/lib/oidc/pkce-store';
import { env } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<Response> {
  const cfg = await getOidcConfig();

  const codeVerifier = client.randomPKCECodeVerifier();
  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
  const state = client.randomState();
  const nonce = client.randomNonce();

  const url = new URL(request.url);
  const returnTo = url.searchParams.get('returnTo') ?? '/dashboard';

  await savePending({ codeVerifier, state, nonce, returnTo });

  const authUrl = client.buildAuthorizationUrl(cfg, {
    redirect_uri: env.REPERO_OIDC_REDIRECT_URI,
    scope: 'openid profile email',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
    nonce,
  });

  return NextResponse.redirect(authUrl.href);
}