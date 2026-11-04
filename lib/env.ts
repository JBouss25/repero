import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  REPERO_BASE_URL: z.string().url(),
  REPERO_SESSION_SECRET: z.string().min(32, 'REPERO_SESSION_SECRET doit faire >= 32 caracteres'),
  REPERO_OIDC_CLIENT_ID: z.string().min(1),
  REPERO_OIDC_CLIENT_SECRET: z.string().default(''),
  REPERO_OIDC_REDIRECT_URI: z.string().url(),
  REPERO_POST_LOGOUT_URI: z.string().url(),
  OOSTUDY_OIDC_ISSUER: z.string().url(),
});

const parsed = EnvSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  REPERO_BASE_URL: process.env.REPERO_BASE_URL,
  REPERO_SESSION_SECRET: process.env.REPERO_SESSION_SECRET,
  REPERO_OIDC_CLIENT_ID: process.env.REPERO_OIDC_CLIENT_ID,
  REPERO_OIDC_CLIENT_SECRET: process.env.REPERO_OIDC_CLIENT_SECRET,
  REPERO_OIDC_REDIRECT_URI: process.env.REPERO_OIDC_REDIRECT_URI,
  REPERO_POST_LOGOUT_URI: process.env.REPERO_POST_LOGOUT_URI,
  OOSTUDY_OIDC_ISSUER: process.env.OOSTUDY_OIDC_ISSUER,
});

if (!parsed.success) {
  console.error('❌ ZOD ENV ERROR:', JSON.stringify(parsed.error.format(), null, 2));
  throw new Error("Validation des variables d'environnement échouée");
}

export const env = parsed.data;
export type Env = z.infer<typeof EnvSchema>;