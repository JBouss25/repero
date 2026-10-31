import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { readSession } = await import('@/lib/oidc/session');
  const session = await readSession();
  if (!session) redirect('/login');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 220, borderRight: '1px solid #e5e7eb', padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Repero</h2>
        <p style={{ fontSize: 12, color: '#666' }}>{session.user.email}</p>
        <p style={{ fontSize: 11, color: '#999' }}>tenant : {session.user.tenantId}</p>
        <form method="POST" action="/api/auth/logout" style={{ marginTop: 24 }}>
          <button
            type="submit"
            style={{ width: '100%', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}
          >
            Se deconnecter
          </button>
        </form>
      </aside>
      <section style={{ flex: 1, padding: 24 }}>{children}</section>
    </div>
  );
}