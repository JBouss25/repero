'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Target, Calendar, ShieldAlert, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SessionUser } from '@/lib/types';

interface SidebarProps {
  user: SessionUser;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['student', 'parent', 'tutor', 'school_admin'] },
  { name: 'Session', href: '/session', icon: Target, roles: ['student'] },
  { name: 'Contrôles', href: '/onboarding', icon: Calendar, roles: ['student'] },
  { name: 'Alertes', href: '/tutor', icon: ShieldAlert, roles: ['tutor', 'school_admin'] },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const filteredNav = navigation.filter((item) =>
    item.roles.some((role) => user.roles.includes(role as any))
  );

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-[#0A192F] text-white">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-center h-20 px-4 border-b border-white/10">
          <Link href="/dashboard">
            <Image 
              src="/logo-dark.png" 
              alt="Repero" 
              width={140} 
              height={40} 
              className="w-auto h-10 object-contain"
              priority
            />
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#0066FF] text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <form method="POST" action="/api/auth/logout">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
              <LogOut className="mr-3 h-5 w-5" />
              Déconnexion
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}