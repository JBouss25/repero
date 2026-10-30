import * as client from 'openid-client';
import { env } from '@/lib/env';

let cached: client.Configuration | null = null;

export async function getOidcConfig(): Promise<client.Configuration> {
  if (cached) return cached;
  cached = await client.discovery(
    new URL(env.OOSTUDY_OIDC_ISSUER),
    env.REPERO_OIDC_CLIENT_ID,
    env.REPERO_OIDC_CLIENT_SECRET || undefined,
  );
  return cached;
}