'use client';

import { Sparkles } from 'lucide-react';

interface RecommendationReasonProps {
  readonly explanation: string;
  readonly className?: string;
}

export function RecommendationReason({
  explanation,
  className = '',
}: RecommendationReasonProps) {
  if (!explanation) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ${className}`}
      aria-label={`Recommendation reason: ${explanation}`}
    >
      <Sparkles className="h-3 w-3 shrink-0" />
      <span className="line-clamp-1">{explanation}</span>
    </div>
  );
}
