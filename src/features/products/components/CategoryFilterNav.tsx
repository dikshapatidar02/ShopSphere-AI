'use client';

import { useCategoriesQuery } from '../hooks/use-categories-query';

interface CategoryFilterNavProps {
  readonly selectedCategory?: string;
  readonly onSelectCategory: (categorySlug: string | undefined) => void;
}

export function CategoryFilterNav({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterNavProps) {
  const { data: categories = [], isLoading } = useCategoriesQuery();

  const isAllSelected = !selectedCategory || selectedCategory === 'all';

  return (
    <div className="w-full overflow-x-auto pb-2 pt-1 no-scrollbar">
      <div className="inline-flex items-center gap-2 min-w-max">
        {/* All Products Pill */}
        <button
          onClick={() => onSelectCategory(undefined)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
            isAllSelected
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          All Products
        </button>

        {/* Dynamic Categories */}
        {isLoading ? (
          <div className="flex gap-2 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`cat-skel-${i}`} className="h-7 w-20 rounded-full bg-muted" />
            ))}
          </div>
        ) : (
          categories.map((category) => {
            const isSelected = selectedCategory?.toLowerCase() === category.slug.toLowerCase();
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(isSelected ? undefined : category.slug)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {category.name}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
