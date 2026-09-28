'use client';

import { useCallback, useState } from 'react';
import type { ConversationContext } from '@/types/assistant';
import { useAssistantSession } from './use-assistant-session';
import { assistantService } from '@/services/ai-assistant';

export function useAssistant() {
  const { sessionId, userId } = useAssistantSession();

  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<ConversationContext>(() =>
    assistantService.loadSession(sessionId, userId)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        const { updatedContext } = await assistantService.sendMessage(trimmed, context);
        setContext(updatedContext);
      } catch {
        setError('Failed to process message. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [context, isLoading]
  );

  const resetConversation = useCallback(() => {
    const fresh = assistantService.resetSession(sessionId, userId);
    setContext(fresh);
    setError(null);
  }, [sessionId, userId]);

  return {
    isOpen,
    toggleOpen,
    setIsOpen,
    messages: context.messages,
    isLoading,
    error,
    sendMessage,
    resetConversation,
  };
}
