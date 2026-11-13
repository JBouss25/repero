'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('/api/waitlist').then(r => r.json()).then(d => setCount(d.count || 0));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStatus('ok');
      setCount(c => c + 1);
    } else {
      setStatus('error');
    }
  };

  if (status === 'ok') {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-full">
        <CheckCircle2 className="h-6 w-6" />
        <span className="font-semibold">Vous êtes sur la liste ! On vous prévient dès l'ouverture.</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-lg">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email"
          className="flex-1 px-5 py-4 rounded-full border-2 border-gray-200 focus:border-[#0066FF] focus:outline-none text-gray-900"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex items-center justify-center gap-2 bg-[#0066FF] text-white px-8 py-4 rounded-full font-bold hover:bg-[#0052CC] transition-all disabled:opacity-50"
        >
          {status === 'loading' ? 'Envoi…' : 'Rejoindre'}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      {count > 0 && (
        <p className="mt-3 text-sm text-gray-500">
          🎉 Déjà <strong>{count}</strong> personnes inscrites sur la liste d'attente.
        </p>
      )}
    </form>
  );
}