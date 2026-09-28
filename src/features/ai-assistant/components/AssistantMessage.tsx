'use client';

import type { ChatMessage } from '@/types/assistant';
import { Bot, User } from 'lucide-react';
import { AssistantProductResults } from './AssistantProductResults';
import { AssistantSuggestionChips } from './AssistantSuggestionChips';

interface AssistantMessageProps {
  readonly message: ChatMessage;
  readonly onSelectPrompt: (prompt: string) => void;
}

export function AssistantMessage({ message, onSelectPrompt }: AssistantMessageProps) {
  const isUser = message.sender === 'user';
  const payload = message.payload;

  return (
    <div
      className={`flex items-start gap-2 text-xs ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
      role="article"
      aria-label={`${isUser ? 'User' : 'Assistant'} message`}
    >
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Bubble Content */}
      <div className="flex max-w-[85%] flex-col space-y-2">
        <div
          className={`rounded-2xl px-3.5 py-2.5 shadow-xs leading-relaxed ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-none'
              : 'bg-card border border-border text-foreground rounded-tl-none'
          }`}
        >
          <p className="whitespace-pre-wrap">
            {message.content.split('**').map((part, idx) =>
              idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
            )}
          </p>

          {!isUser && payload && (
            <AssistantProductResults
              products={payload.suggestedProducts}
              comparisonProducts={payload.comparisonProducts}
            />
          )}
        </div>

        {!isUser && payload?.suggestedPrompts && (
          <AssistantSuggestionChips
            suggestions={payload.suggestedPrompts}
            onSelect={onSelectPrompt}
          />
        )}

        <span
          className={`text-[10px] text-muted-foreground ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
