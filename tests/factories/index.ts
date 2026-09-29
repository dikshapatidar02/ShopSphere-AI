import type {
  Address,
  Cart,
  Order,
  Product,
  RecommendationContext,
  User,
} from '@/types';

export function createTestUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-test-01',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    phone: '+1 555-0199',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

export function createAdminUser(overrides: Partial<User> = {}): User {
  return {
    id: 'admin-test-01',
    email: 'admin@shopsphere.ai',
    name: 'Admin User',
    role: 'administrator',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    phone: '+1 555-0100',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

export function createTestProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-test-01',
    title: 'Wireless Noise-Canceling Headphones',
    description: 'High-fidelity audio with active noise cancellation and 30-hour battery life.',
    price: 199.99,
    discountedPrice: 179.99,
    discountPercentage: 10,
    rating: 4.8,
    reviewCount: 15,
    stock: 25,
    brand: 'AudioTech',
    category: 'electronics',
    categoryName: 'Electronics',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e'],
    tags: ['audio', 'wireless', 'headphones'],
    availability: 'in_stock',
    specifications: [
      { name: 'Category', value: 'Electronics' },
      { name: 'Brand', value: 'AudioTech' },
    ],
    variants: [],
    ...overrides,
  };
}

export function createOutOfStockProduct(overrides: Partial<Product> = {}): Product {
  return createTestProduct({
    id: 'prod-test-oos',
    title: 'Out of Stock Premium Smartwatch',
    stock: 0,
    availability: 'out_of_stock',
    ...overrides,
  });
}

export function createTestAddress(overrides: Partial<Address> = {}): Address {
  return {
    id: 'addr-01',
    recipientName: 'John Doe',
    line1: '123 Tech Lane',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'USA',
    isDefault: true,
    ...overrides,
  };
}

export function createTestCart(overrides: Partial<Cart> = {}): Cart {
  const itemProduct = createTestProduct();
  return {
    id: 'cart-test-01',
    userId: 'user-test-01',
    items: [
      {
        id: 'cart-item-01',
        productId: itemProduct.id,
        productTitle: itemProduct.title,
        productThumbnail: itemProduct.thumbnail,
        productCategory: itemProduct.category,
        productBrand: itemProduct.brand,
        unitPrice: itemProduct.discountedPrice ?? itemProduct.price,
        originalUnitPrice: itemProduct.price,
        priceChanged: false,
        quantity: 2,
        maxAvailableStock: itemProduct.stock,
        availability: 'available',
        addedAt: '2026-01-01T00:00:00Z',
      },
    ],
    savedItems: [],
    summary: {
      subtotal: 359.98,
      discountTotal: 0,
      couponDiscount: 0,
      shippingTotal: 0,
      taxTotal: 28.80,
      grandTotal: 388.78,
      itemCount: 2,
    },
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

export function createTestOrder(overrides: Partial<Order> = {}): Order {
  const product = createTestProduct();
  const address = createTestAddress();
  return {
    id: 'ord-test-001',
    orderNumber: 'ORD-10001',
    userId: 'user-test-01',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    items: [
      {
        id: 'ord-item-01',
        productId: product.id,
        productTitle: product.title,
        productThumbnail: product.thumbnail,
        unitPrice: product.discountedPrice ?? product.price,
        quantity: 1,
        totalPrice: product.discountedPrice ?? product.price,
      },
    ],
    shippingAddress: address,
    billingAddress: address,
    deliveryOption: {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Standard ground delivery',
      price: 0,
      estimatedDays: '3-5 business days',
    },
    subtotal: 179.99,
    discountTotal: 0,
    shippingTotal: 0,
    taxTotal: 14.40,
    grandTotal: 194.39,
    paymentDetails: {
      method: 'mock_credit_card',
      status: 'successful',
      transactionId: 'tx-12345',
      paidAt: '2026-01-01T00:00:00Z',
    },
    status: 'confirmed',
    tracking: {
      orderId: 'ord-test-001',
      carrierName: 'Express Shipping',
      trackingNumber: 'TRK123456789',
      currentStatus: 'confirmed',
      estimatedDeliveryDate: '2026-01-05T00:00:00Z',
      events: [],
    },
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

export function createTestRecommendationContext(
  overrides: Partial<RecommendationContext> = {}
): RecommendationContext {
  return {
    userId: 'user-test-01',
    productId: 'prod-test-01',
    currentCartProductIds: [],
    currentWishlistProductIds: [],
    ...overrides,
  };
}
