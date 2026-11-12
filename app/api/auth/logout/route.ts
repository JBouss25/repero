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

  // Si pas de session, on redirige vers la page d'accueil
  if (!session) {
    return NextResponse.redirect(new URL('/', env.REPERO_BASE_URL).href, 303);
  }

  const cfg = await getOidcConfig();
  const endSession = cfg.serverMetadata().end_session_endpoint;
  
  if (!endSession) {
    return NextResponse.redirect(new URL('/', env.REPERO_BASE_URL).href, 303);
  }

  const url = new URL(endSession);
  // Auth0 exige le client_id pour le logout
  url.searchParams.set('client_id', env.REPERO_OIDC_CLIENT_ID);
  url.searchParams.set('post_logout_redirect_uri', env.REPERO_POST_LOGOUT_URI);
  
  // Si on a un id_token, on peut le passer (optionnel avec Auth0)
  if (session.tokens?.idToken) {
    url.searchParams.set('id_token_hint', session.tokens.idToken);
  }

  return NextResponse.redirect(url.href, 303);
}