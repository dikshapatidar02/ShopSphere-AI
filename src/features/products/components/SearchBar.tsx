'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  readonly initialQuery?: string;
  readonly onSearchChange: (value: string) => void;
  readonly placeholder?: string;
}

export function SearchBar({
  initialQuery = '',
  onSearchChange,
  placeholder = 'Search products, brands, or categories...',
}: SearchBarProps) {
  const [value, setValue] = useState(initialQuery);
  const [prevInitialQuery, setPrevInitialQuery] = useState(initialQuery);

  // Sync state if initialQuery prop changes externally during render
  if (initialQuery !== prevInitialQuery) {
    setPrevInitialQuery(initialQuery);
    setValue(initialQuery);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    onSearchChange(val);
  };

  const handleClear = () => {
    setValue('');
    onSearchChange('');
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="relative w-full">
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label="Search products"
          className="w-full rounded-xl border border-input bg-background pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring transition-colors shadow-xs"
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search query"
            className="absolute right-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}
