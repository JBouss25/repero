import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/nav/sidebar';
import { MobileNav } from '@/components/nav/mobile-nav';
import { Header } from '@/components/nav/header';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { readSession } = await import('@/lib/oidc/session');
  const session = await readSession();
  if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={session.user} />
      <Header user={session.user} />
      
      <main className="md:pl-64 pb-16 md:pb-0">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
      
      <MobileNav user={session.user} />
    </div>
  );
}