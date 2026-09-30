'use client';

import { Bot, RefreshCw, X } from 'lucide-react';

interface AssistantHeaderProps {
  readonly onClose: () => void;
  readonly onReset: () => void;
}

export function AssistantHeader({ onClose, onReset }: AssistantHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 bg-slate-50 rounded-t-xl">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            ShopSphere AI Assistant
            <span className="inline-flex items-center rounded-md bg-blue-100/80 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
              Rule Engine
            </span>
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">Smart Shopping Companion</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset conversation"
          title="Reset conversation"
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close assistant"
          title="Close assistant"
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
