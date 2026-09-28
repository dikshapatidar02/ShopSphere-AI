'use client';

import { RecommendationReason } from '@/features/recommendations';

interface RecommendationExplanationProps {
  readonly explanation: string;
}

export function RecommendationExplanation({ explanation }: RecommendationExplanationProps) {
  return <RecommendationReason explanation={explanation} />;
}
