import type { Category, DummyJsonCategoryDTO } from '@/types';

export function normalizeCategory(
  input: string | Partial<DummyJsonCategoryDTO>
): Category {
  if (typeof input === 'string') {
    const slug = input.trim().toLowerCase().replace(/\s+/g, '-');
    const name = input
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      id: `cat-${slug}`,
      name,
      slug,
      description: `Explore products in ${name}`,
    };
  }

  const slug = (input.slug || input.name || 'uncategorized').trim().toLowerCase().replace(/\s+/g, '-');
  const name =
    input.name ||
    slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return {
    id: `cat-${slug}`,
    name,
    slug,
    description: `Explore products in ${name}`,
  };
}

export function normalizeCategories(
  inputs: readonly (string | Partial<DummyJsonCategoryDTO>)[]
): Category[] {
  if (!Array.isArray(inputs)) return [];
  return inputs.map((item) => normalizeCategory(item));
}
