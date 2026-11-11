'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Target, Calendar, ShieldAlert } from 'lucide-react';
import type { SessionUser } from '@/lib/types';

interface MobileNavProps {
  user: SessionUser;
}

const navigation = [
  { name: 'Accueil', href: '/dashboard', icon: Home, roles: ['student', 'parent', 'tutor', 'school_admin'] },
  { name: 'Session', href: '/session', icon: Target, roles: ['student'] },
  { name: 'Contrôles', href: '/onboarding', icon: Calendar, roles: ['student'] },
  { name: 'Alertes', href: '/tutor', icon: ShieldAlert, roles: ['tutor', 'school_admin'] },
];

export function MobileNav({ user }: MobileNavProps) {
  const pathname = usePathname();

  const filteredNav = navigation.filter((item) =>
    item.roles.some((role) => user.roles.includes(role as any))
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-[#0066FF]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'text-[#0066FF]' : 'text-gray-500'}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}