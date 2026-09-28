'use client';

import { Bot } from 'lucide-react';

interface AssistantEmptyStateProps {
  readonly onSelectPrompt: (prompt: string) => void;
}

const DEFAULT_PROMPTS = [
  'Show me smartphones under $500',
  'Top rated wireless headphones',
  'Laptops for gaming',
  'Recommend products for me',
];

export function AssistantEmptyState({ onSelectPrompt }: AssistantEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 my-auto">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
        <Bot className="h-6 w-6" />
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-semibold text-foreground">How can I help your shopping today?</h4>
        <p className="text-xs text-muted-foreground max-w-xs">
          Ask me to search, filter by price or rating, compare items, or add products directly to your cart.
        </p>
      </div>

      <div className="w-full space-y-2 pt-2">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Suggested Queries
        </span>
        <div className="flex flex-wrap justify-center gap-1.5">
          {DEFAULT_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSelectPrompt(prompt)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground shadow-xs hover:border-primary/50 hover:bg-accent transition-all focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
