import type {
  DummyJsonProductDTO,
  Product,
  ProductAvailability,
} from '@/types';

export function mapStockToAvailability(stock: number): ProductAvailability {
  if (typeof stock !== 'number' || stock <= 0 || isNaN(stock)) {
    return 'out_of_stock';
  }
  if (stock <= 5) {
    return 'low_stock';
  }
  return 'in_stock';
}

export function normalizeProduct(dto: Partial<DummyJsonProductDTO>): Product {
  const id = String(dto.id ?? `fallback-${Math.random().toString(36).substring(2, 9)}`);
  const title = dto.title?.trim() || 'Untitled Product';
  const description = dto.description?.trim() || 'No description available.';
  const category = dto.category?.trim() || 'uncategorized';
  const categoryName = category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const brand = dto.brand?.trim() || 'Generic';

  const rawPrice = Number(dto.price);
  const price = !isNaN(rawPrice) && rawPrice >= 0 ? rawPrice : 0;

  const rawDiscount = Number(dto.discountPercentage);
  const discountPercentage =
    !isNaN(rawDiscount) && rawDiscount >= 0 && rawDiscount <= 100
      ? Math.round(rawDiscount * 100) / 100
      : 0;

  const discountedPrice =
    discountPercentage > 0
      ? Math.round(price * (1 - discountPercentage / 100) * 100) / 100
      : price;

  const rawRating = Number(dto.rating);
  const rating =
    !isNaN(rawRating) && rawRating >= 1 ? Math.min(5, Math.round(rawRating * 10) / 10) : 4.0;

  const rawStock = Number(dto.stock);
  const stock = !isNaN(rawStock) && rawStock >= 0 ? Math.floor(rawStock) : 0;
  const availability = mapStockToAvailability(stock);

  const images = Array.isArray(dto.images) && dto.images.length > 0
    ? dto.images.filter((img): img is string => typeof img === 'string' && img.length > 0)
    : [];

  const thumbnail =
    typeof dto.thumbnail === 'string' && dto.thumbnail.length > 0
      ? dto.thumbnail
      : images[0] || 'https://via.placeholder.com/300?text=No+Image';

  const tags = Array.isArray(dto.tags)
    ? dto.tags.filter((tag): tag is string => typeof tag === 'string')
    : [category];

  return {
    id,
    title,
    description,
    category,
    categoryName,
    brand,
    price,
    discountPercentage,
    discountedPrice,
    rating,
    reviewCount: Array.isArray(dto.reviews) ? dto.reviews.length : 12,
    stock,
    availability,
    images: images.length > 0 ? images : [thumbnail],
    thumbnail,
    tags,
    specifications: [
      { name: 'Category', value: categoryName },
      { name: 'Brand', value: brand },
      { name: 'Warranty', value: dto.warrantyInformation || 'Standard 1 Year Warranty' },
      { name: 'Shipping', value: dto.shippingInformation || 'Standard Shipping' },
    ],
    variants: [],
  };
}

export function normalizeProducts(dtos: readonly Partial<DummyJsonProductDTO>[]): Product[] {
  if (!Array.isArray(dtos)) return [];
  return dtos.map((dto) => normalizeProduct(dto));
}
