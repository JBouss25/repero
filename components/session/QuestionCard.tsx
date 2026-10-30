'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { SelectedItem, Confidence } from '@/lib/engine/types';

interface Props {
  item: SelectedItem;
  onAnswer: (answer: string, confidence: Confidence) => void;
  disabled?: boolean;
}

export function QuestionCard({ item, onAnswer, disabled }: Props) {
  const handleAnswer = (value: string, confidence: Confidence) => {
    if (disabled) return;
    onAnswer(value, confidence);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">
          Question {item.reason} — {item.item.bloom}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Chapitre : <strong>{item.item.chapter}</strong> · Niveau : {item.item.level}
        </p>
        <p className="text-base">{item.item.id} — (label à venir)</p>

        <div className="grid gap-2">
          {(['A', 'B', 'C', 'D'] as const).map((opt) => (
            <Button
              key={opt}
              variant="outline"
              disabled={disabled}
              onClick={() => handleAnswer(opt, 'sure')}
            >
              Option {opt}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <span className="text-xs text-muted-foreground mr-auto">Confiance :</span>
          <Button size="sm" variant="secondary" disabled={disabled} onClick={() => handleAnswer('A', 'sure')}>Sûr</Button>
          <Button size="sm" variant="secondary" disabled={disabled} onClick={() => handleAnswer('A', 'hesitant')}>Hésitant</Button>
          <Button size="sm" variant="secondary" disabled={disabled} onClick={() => handleAnswer('A', 'random')}>Au hasard</Button>
        </div>
      </CardContent>
    </Card>
  );
}