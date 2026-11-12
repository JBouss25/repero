'use client';

import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  current: number;
  longest: number;
}

export function StreakBadge({ current, longest }: StreakBadgeProps) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div className="bg-orange-100 p-3 rounded-full text-orange-600">
        <Flame className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">Série actuelle</p>
        <p className="text-2xl font-bold text-gray-900">
          {current} jour{current > 1 ? 's' : ''}
        </p>
        <p className="text-xs text-gray-400">Record : {longest} jours</p>
      </div>
    </div>
  );
}