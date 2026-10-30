import * as client from 'openid-client';
import { NextResponse } from 'next/server';
import { getOidcConfig } from '@/lib/oidc/config';
import { readSession, destroySession } from '@/lib/oidc/session';
import { env } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(): Promise<Response> {
  const session = await readSession();
  await destroySession();

  if (!session?.tokens.idToken) {
    return NextResponse.redirect(new URL('/', env.REPERO_BASE_URL).href);
  }

  const cfg = await getOidcConfig();
  const endSession = cfg.serverMetadata().end_session_endpoint;
  if (!endSession) {
    return NextResponse.redirect(new URL('/', env.REPERO_BASE_URL).href);
  }

  const url = new URL(endSession);
  url.searchParams.set('id_token_hint', session.tokens.idToken);
  url.searchParams.set('post_logout_redirect_uri', env.REPERO_POST_LOGOUT_URI);

  return NextResponse.redirect(url.href);
}