import type { Role, SessionUser } from '@/lib/types';

const ALLOWED_ROLES: readonly Role[] = ['student', 'parent', 'tutor', 'school_admin'];

function readTenantId(claims: Record<string, unknown>): string | null {
  const v = claims['oostudy/tenant_id'] ?? claims['tenant_id'];
  return typeof v === 'string' && v.length > 0 ? v : null;
}

function readRoles(claims: Record<string, unknown>): Role[] {
  const raw = claims['oostudy/roles'] ?? claims['roles'];
  if (!Array.isArray(raw)) return [];
  return raw.filter((r): r is Role => typeof r === 'string' && (ALLOWED_ROLES as readonly string[]).includes(r));
}

export class OidcClaimError extends Error {
  constructor(public readonly code: 'TENANT_MISSING' | 'SUB_MISSING', message: string) {
    super(message);
    this.name = 'OidcClaimError';
  }
}

export function extractSessionUser(claims: Record<string, unknown>): SessionUser {
  let tenantId = readTenantId(claims);

  // MODE DEV : fallback si l'IdP ne fournit pas le claim (ex: Duende démo)
  if (!tenantId && process.env.NODE_ENV === 'development') {
    console.warn('[OIDC] Tenant missing, using mock tenant for development');
    tenantId = '11111111-1111-1111-1111-111111111111';
  }

  if (!tenantId) {
    throw new OidcClaimError('TENANT_MISSING', 'Claim oostudy/tenant_id absent du token OoStudy');
  }

  const sub = claims.sub;
  if (typeof sub !== 'string' || sub.length === 0) {
    throw new OidcClaimError('SUB_MISSING', 'Claim sub absent du token OoStudy');
  }

  const email = typeof claims.email === 'string' ? claims.email : '';
  return { sub, tenantId, email, roles: readRoles(claims) };
}