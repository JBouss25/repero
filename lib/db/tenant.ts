export interface TenantContext {
  tenantId: string;
  studentId?: string;
}

export class TenantError extends Error {
  constructor(public readonly code: 'TENANT_MISSING', message: string) {
    super(message);
    this.name = 'TenantError';
  }
}

export function requireTenant(tenantId: string | null | undefined): string {
  if (!tenantId || tenantId.trim().length === 0) {
    throw new TenantError('TENANT_MISSING', 'tenant_id manquant — acces refuse');
  }
  return tenantId;
}

export function fromHeaders(headers: Headers): TenantContext {
  const tenantId = requireTenant(headers.get('x-tenant-id'));
  const studentId = headers.get('x-user-id') ?? undefined;
  return { tenantId, studentId };
}