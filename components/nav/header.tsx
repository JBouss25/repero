'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import type { SessionUser } from '@/lib/types';

interface HeaderProps {
  user: SessionUser;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="md:hidden flex items-center justify-between h-16 px-4 bg-[#0A192F] text-white z-50">
      <Link href="/dashboard" className="flex items-center">
        <img 
          src="/logo-dark.jpg" 
          alt="Repero" 
          style={{ height: '36px', width: 'auto', objectFit: 'contain' }} 
        />
      </Link>
      <form method="POST" action="/api/auth/logout">
        <button type="submit" className="p-2 text-white hover:bg-white/10 rounded-full">
          <LogOut className="h-5 w-5" />
        </button>
      </form>
    </header>
  );
}