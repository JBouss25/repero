'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function OnboardingPage() {
  const [chapter, setChapter] = useState('');
  const [date, setDate] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/exam-dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapter, at: date }),
    });
    setSaved(true);
    setChapter('');
    setDate('');
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Declarer un controle</h1>
      {saved && <p className="text-green-600 mb-4">Controle enregistre</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="chapter">Chapitre</Label>
          <Input id="chapter" value={chapter} onChange={(e) => setChapter(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="date">Date du controle</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <Button type="submit">Enregistrer</Button>
      </form>
    </div>
  );
}