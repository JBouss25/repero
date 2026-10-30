'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionCard } from '@/components/session/QuestionCard';
import { Progress } from '@/components/ui/progress';
import type { Session, Confidence } from '@/lib/engine/types';

export default function SessionPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/session/compose', { method: 'POST' })
      .then((r) => r.json())
      .then((data) => setSession(data))
      .catch(() => setError('Erreur de composition de session'));
  }, []);

  const handleAnswer = useCallback(
    async (answer: string, confidence: Confidence) => {
      if (!session) return;
      const current = session.items[currentIdx];
      setLoading(true);

      try {
        await fetch('/api/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemId: current.item.id,
            correct: answer === 'A',
            timeMs: 15000,
            targetTimeMs: current.item.targetTimeS * 1000,
            hintsUsed: 0,
            confidence,
          }),
        });

        const next = currentIdx + 1;
        if (next >= session.items.length) {
          setCurrentIdx(next);
        } else {
          setCurrentIdx(next);
        }
      } catch {
        setError('Erreur d\u2019enregistrement');
      } finally {
        setLoading(false);
      }
    },
    [session, currentIdx],
  );

  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!session) return <div className="p-8 text-center">Chargement de la session…</div>;

  const total = session.items.length;
  const done = currentIdx >= total;
  const progress = total > 0 ? Math.round((currentIdx / total) * 100) : 0;

  if (done) {
    return (
      <div className="p-8 text-center space-y-4">
        <h1 className="text-3xl font-bold">Session terminée 🎉</h1>
        <p className="text-muted-foreground">{total} items traités</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-blue-600 hover:underline"
        >
          Retour au dashboard
        </button>
      </div>
    );
  }

  const current = session.items[currentIdx];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">
            Phase : {current.reason} — {currentIdx + 1} / {total}
          </span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <QuestionCard item={current} onAnswer={handleAnswer} disabled={loading} />
    </div>
  );
}