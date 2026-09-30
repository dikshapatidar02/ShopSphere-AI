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
      className="flex items-center gap-2 border-t border-slate-200 p-3 bg-white rounded-b-xl"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask ShopSphere AI assistant..."
        disabled={disabled}
        aria-label="Ask assistant input"
        className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:opacity-50"
      />

      <button
        type="submit"
        disabled={disabled || !input.trim()}
        aria-label="Send message"
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <SendHorizontal className="h-4 w-4" />
      </button>
    </form>
  );
}
