'use client';

import { AlertCircle } from 'lucide-react';

interface AssistantErrorStateProps {
  readonly message: string;
}

export function AssistantErrorState({ message }: AssistantErrorStateProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
