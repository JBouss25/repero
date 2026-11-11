'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import type { SessionUser } from '@/lib/types';

interface HeaderProps {
  user: SessionUser;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="md:hidden flex items-center justify-between h-16 px-4 bg-[#0A192F] text-white">
      <Link href="/dashboard" className="flex items-center gap-2">
        <Image 
          src="/logo-dark.png" 
          alt="Repero" 
          width={100} 
          height={28} 
          className="h-7 w-auto object-contain"
        />
      </Link>
      <form method="POST" action="/api/auth/logout">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <LogOut className="h-5 w-5" />
        </Button>
      </form>
    </header>
  );
}