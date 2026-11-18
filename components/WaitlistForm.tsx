'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

type Variant = 'light' | 'dark';

// Formulaire d'inscription à la liste d'attente (accueil + CTA final)
export function WaitlistForm({ variant = 'light' }: { variant?: Variant }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [count, setCount] = useState(0);
  const dark = variant === 'dark';

  useEffect(() => {
    fetch('/api/waitlist')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setCount(d?.count || 0))
      .catch(() => setCount(0));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('waitlist');
      setStatus('ok');
      setCount((c) => c + 1);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'ok') {
    return (
      <div
        role="status"
        className={`flex items-center gap-3 rounded-2xl px-5 py-4 ${
          dark ? 'bg-white/10 text-white ring-1 ring-white/20' : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
        }`}
      >
        <CheckCircle2 className="h-6 w-6 shrink-0" />
        <span className="font-semibold">C&apos;est noté ! On vous prévient dès l&apos;ouverture.</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-lg">
      <div
        className={`flex flex-col gap-2 rounded-2xl p-2 sm:flex-row sm:rounded-full ${
          dark ? 'bg-white/10 ring-1 ring-white/15' : 'bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-200'
        }`}
      >
        <label htmlFor={`waitlist-${variant}`} className="sr-only">
          Adresse email
        </label>
        <input
          id={`waitlist-${variant}`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder="votre@email.com"
          className={`min-w-0 flex-1 rounded-full bg-transparent px-5 py-3 text-base focus:outline-none ${
            dark ? 'text-white placeholder:text-slate-400' : 'text-slate-900 placeholder:text-slate-400'
          }`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 ${
            dark
              ? 'bg-white text-[#0A192F] hover:bg-blue-50 focus-visible:outline-white'
              : 'bg-[#0066FF] text-white hover:bg-[#0052CC] focus-visible:outline-[#0066FF]'
          }`}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Envoi…
            </>
          ) : (
            <>
              Rejoindre la liste <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
      <p aria-live="polite" className={`mt-3 px-2 text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
        {status === 'error' ? (
          <span className={dark ? 'text-red-300' : 'text-red-600'}>
            Oups, l&apos;inscription a échoué. Vérifiez l&apos;adresse et réessayez.
          </span>
        ) : count > 0 ? (
          <>
            Déjà <strong className={dark ? 'text-white' : 'text-slate-900'}>{count}</strong> personnes inscrites. Pas de spam, promis.
          </>
        ) : (
          'Accès anticipé gratuit. Pas de spam, promis.'
        )}
      </p>
    </form>
  );
}
