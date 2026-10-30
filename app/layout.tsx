import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Repero — 15 min par jour',
  description: 'Routine quotidienne de consolidation cognitive — un produit OoStudy.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={cn("font-sans", inter.variable)}>
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}