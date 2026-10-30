import { describe, it, expect } from 'vitest';
import { fromHeaders, requireTenant, TenantError } from '../tenant';

describe('Tenant isolation', () => {
  it('requireTenant rejette tenantId vide', () => {
    expect(() => requireTenant('')).toThrow(TenantError);
    expect(() => requireTenant(null)).toThrow(TenantError);
    expect(() => requireTenant(undefined)).toThrow(TenantError);
  });

  it('requireTenant accepte un tenantId valide', () => {
    expect(requireTenant('t1')).toBe('t1');
  });

  it('fromHeaders extrait tenantId et studentId', () => {
    const headers = new Headers();
    headers.set('x-tenant-id', 'tenant-A');
    headers.set('x-user-id', 'student-42');
    const ctx = fromHeaders(headers);
    expect(ctx.tenantId).toBe('tenant-A');
    expect(ctx.studentId).toBe('student-42');
  });

  it('§14 : acces refuse sans x-tenant-id', () => {
    const headers = new Headers();
    headers.set('x-user-id', 'student-42');
    expect(() => fromHeaders(headers)).toThrow(TenantError);
  });
});