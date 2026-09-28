'use client';

import type { ProductSpecification } from '@/types';

interface ProductSpecificationsProps {
  readonly specifications?: readonly ProductSpecification[];
  readonly brand: string;
  readonly categoryName?: string;
  readonly category: string;
}

export function ProductSpecifications({
  specifications = [],
  brand,
  categoryName,
  category,
}: ProductSpecificationsProps) {
  const allSpecs = [
    { name: 'Brand', value: brand },
    { name: 'Category', value: categoryName || category },
    ...specifications,
  ].filter((s) => s.value && s.value.trim().length > 0);

  if (allSpecs.length === 0) return null;

  return (
    <section aria-labelledby="specs-heading" className="space-y-4 pt-6 border-t border-border">
      <h2 id="specs-heading" className="text-lg font-bold tracking-tight text-foreground">
        Technical Specifications
      </h2>
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <dl className="divide-y divide-border">
          {allSpecs.map((spec, idx) => (
            <div
              key={`spec-${idx}-${spec.name}`}
              className="grid grid-cols-3 gap-4 px-4 py-3 text-xs sm:text-sm odd:bg-muted/30"
            >
              <dt className="font-semibold text-muted-foreground">{spec.name}</dt>
              <dd className="col-span-2 text-foreground font-medium">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
