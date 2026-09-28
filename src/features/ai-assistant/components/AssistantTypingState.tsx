'use client';

import { Bot } from 'lucide-react';

export function AssistantTypingState() {
  return (
    <div className="flex items-end gap-2 text-xs">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Bot className="h-4 w-4" />
      </div>

      <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3 text-muted-foreground shadow-xs">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
      </div>
    </div>
  );
}
