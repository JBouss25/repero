'use client';

import type { MouseEvent } from 'react';
import { ArrowRight } from 'lucide-react';

// Bouton « Accès anticipé » : amène au formulaire de la liste d'attente
// et place directement le curseur dans le champ email
export function EarlyAccessButton({ className }: { className?: string }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const input = document.getElementById('waitlist-light') as HTMLInputElement | null;
    if (!input) return; // formulaire absent (déjà inscrit) : comportement d'ancre classique
    e.preventDefault();
    input.focus({ preventScroll: true });
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Filet de sécurité : si le défilement fluide n'a pas abouti, on saute directement au champ
    window.setTimeout(() => {
      const { top, bottom } = input.getBoundingClientRect();
      if (top < 0 || bottom > window.innerHeight) input.scrollIntoView({ block: 'center', behavior: 'instant' });
    }, 700);
  };

  return (
    <a href="#acces" onClick={onClick} className={className}>
      Accès anticipé
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}
