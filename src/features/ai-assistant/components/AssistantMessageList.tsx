'use client';

import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/types/assistant';
import { AssistantMessage } from './AssistantMessage';
import { AssistantTypingState } from './AssistantTypingState';

interface AssistantMessageListProps {
  readonly messages: readonly ChatMessage[];
  readonly isLoading: boolean;
  readonly onSelectPrompt: (prompt: string) => void;
}

export function AssistantMessageList({
  messages,
  isLoading,
  onSelectPrompt,
}: AssistantMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div
      className="flex-1 overflow-y-auto p-4 space-y-4"
      role="region"
      aria-label="Chat Message History"
      aria-live="polite"
    >
      {messages.map((msg) => (
        <AssistantMessage
          key={msg.id}
          message={msg}
          onSelectPrompt={onSelectPrompt}
        />
      ))}

      {isLoading && <AssistantTypingState />}

      <div ref={bottomRef} />
    </div>
  );
}
