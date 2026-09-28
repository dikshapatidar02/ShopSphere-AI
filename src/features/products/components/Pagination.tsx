'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers
  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className="flex items-center justify-center gap-2 py-6 border-t border-border mt-8"
    >
      <button
        onClick={handlePrev}
        disabled={currentPage <= 1}
        aria-label="Go to previous page"
        className="inline-flex items-center gap-1 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, idx) =>
          typeof p === 'number' ? (
            <button
              key={`page-${p}`}
              onClick={() => {
                onPageChange(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
              className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                p === currentPage
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={`ellipsis-${idx}`} className="px-1 text-xs text-muted-foreground">
              {p}
            </span>
          )
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        aria-label="Go to next page"
        className="inline-flex items-center gap-1 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
