'use client';

import { Bot, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { useAssistant } from '../hooks/use-assistant';
import { AssistantEmptyState } from './AssistantEmptyState';
import { AssistantErrorState } from './AssistantErrorState';
import { AssistantHeader } from './AssistantHeader';
import { AssistantInput } from './AssistantInput';
import { AssistantMessageList } from './AssistantMessageList';

export function AssistantPanel() {
  const {
    isOpen,
    toggleOpen,
    setIsOpen,
    messages,
    isLoading,
    error,
    sendMessage,
    resetConversation,
  } = useAssistant();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  return (
    <>
      {/* Floating Trigger Button with AI Sparkle Badge */}
      <button
        type="button"
        id="ai-assistant-trigger"
        onClick={toggleOpen}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Shopping Assistant'}
        aria-expanded={isOpen}
        className="fixed bottom-6 right-6 z-50 flex h-13 px-4.5 items-center justify-center gap-2 rounded-full bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-xl hover:bg-blue-700 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 group"
      >
        <Bot className="h-5 w-5 group-hover:rotate-12 transition-transform" />
        <span className="font-bold">AI Assistant</span>
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white">
          <Sparkles className="h-2.5 w-2.5" />
        </span>
      </button>

      {/* Side Panel / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs sm:p-4 animate-in fade-in duration-200">
          <div
            className="flex h-full w-full sm:max-w-md flex-col rounded-none sm:rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="AI Shopping Assistant"
          >
            <AssistantHeader
              onClose={() => setIsOpen(false)}
              onReset={resetConversation}
            />

            {error && (
              <div className="px-3 pt-2">
                <AssistantErrorState message={error} />
              </div>
            )}

            {messages.length === 0 ? (
              <AssistantEmptyState onSelectPrompt={(p) => sendMessage(p)} />
            ) : (
              <AssistantMessageList
                messages={messages}
                isLoading={isLoading}
                onSelectPrompt={(p) => sendMessage(p)}
              />
            )}

            <AssistantInput
              onSend={(text) => sendMessage(text)}
              disabled={isLoading}
            />
          </div>
        </div>
      )}
    </>
  );
}
