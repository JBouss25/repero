const rawEnv = {
  NODE_ENV: process.env.NODE_ENV,
  REPERO_BASE_URL: process.env.REPERO_BASE_URL,
  REPERO_SESSION_SECRET: process.env.REPERO_SESSION_SECRET,
  REPERO_OIDC_CLIENT_ID: process.env.REPERO_OIDC_CLIENT_ID,
  REPERO_OIDC_CLIENT_SECRET: process.env.REPERO_OIDC_CLIENT_SECRET || '',
  REPERO_OIDC_REDIRECT_URI: process.env.REPERO_OIDC_REDIRECT_URI,
  REPERO_POST_LOGOUT_URI: process.env.REPERO_POST_LOGOUT_URI,
  OOSTUDY_OIDC_ISSUER: process.env.OOSTUDY_OIDC_ISSUER,
};

// Affiche les variables DANS LES LOGS VERCEL
console.log('🔍 CHECK ENV:', JSON.stringify(rawEnv, null, 2));

export const env = rawEnv as any; // Plus de validation Zod