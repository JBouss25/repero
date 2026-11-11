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

  // Redirection locale : utilise 303 pour forcer un GET
  if (!session?.tokens?.idToken) {
    return NextResponse.redirect(new URL('/', env.REPERO_BASE_URL).href, 303);
  }

  const cfg = await getOidcConfig();
  const endSession = cfg.serverMetadata().end_session_endpoint;
  if (!endSession) {
    return NextResponse.redirect(new URL('/', env.REPERO_BASE_URL).href, 303);
  }

  // Redirection vers Keycloak : 303 aussi pour être sûr
  const url = new URL(endSession);
  url.searchParams.set('id_token_hint', session.tokens.idToken);
  url.searchParams.set('post_logout_redirect_uri', env.REPERO_POST_LOGOUT_URI);

  return NextResponse.redirect(url.href, 303);
}