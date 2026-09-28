'use client';

import { SendHorizontal } from 'lucide-react';
import { useState, type FormEvent, type KeyboardEvent } from 'react';

interface AssistantInputProps {
  readonly onSend: (text: string) => void;
  readonly disabled?: boolean;
}

export function AssistantInput({ onSend, disabled = false }: AssistantInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-border p-3 bg-card rounded-b-xl"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask ShopSphere AI assistant..."
        disabled={disabled}
        aria-label="Ask assistant input"
        className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
      />

      <button
        type="submit"
        disabled={disabled || !input.trim()}
        aria-label="Send message"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <SendHorizontal className="h-4 w-4" />
      </button>
    </form>
  );
}
