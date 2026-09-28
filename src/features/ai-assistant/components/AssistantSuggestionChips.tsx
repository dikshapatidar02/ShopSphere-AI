'use client';

interface AssistantSuggestionChipsProps {
  readonly suggestions?: readonly string[];
  readonly onSelect: (suggestion: string) => void;
}

export function AssistantSuggestionChips({
  suggestions,
  onSelect,
}: AssistantSuggestionChipsProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {suggestions.map((s, idx) => (
        <button
          key={`chip_${s}_${idx}`}
          type="button"
          onClick={() => onSelect(s)}
          className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
