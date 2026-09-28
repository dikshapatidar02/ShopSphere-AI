'use client';

import { useCartStore } from '@/store/cart.store';
import { productService } from '@/services/products/product.service';
import type { Product } from '@/types';
import { useEffect, useState } from 'react';

export function useCartRevalidation() {
  const items = useCartStore((s) => s.items);
  const revalidateItems = useCartStore((s) => s.revalidateItems);
  const [isRevalidating, setIsRevalidating] = useState(false);

  const productIdsKey = items.map((i) => i.productId).join(',');

  useEffect(() => {
    if (!productIdsKey) return;

    let isMounted = true;
    const productIds = Array.from(new Set(productIdsKey.split(',').filter(Boolean)));

    const revalidate = async () => {
      setIsRevalidating(true);
      try {
        const productsMap = new Map<string, Product>();
        await Promise.all(
          productIds.map(async (id) => {
            const res = await productService.getProductById(id);
            if (res.success && res.data) {
              productsMap.set(id, res.data);
            }
          })
        );

        if (isMounted && productsMap.size > 0) {
          revalidateItems(productsMap);
        }
      } catch {
        // Ignore silent revalidation network failures
      } finally {
        if (isMounted) {
          setIsRevalidating(false);
        }
      }
    };

    revalidate();

    return () => {
      isMounted = false;
    };
  }, [productIdsKey, revalidateItems]);

  return { isRevalidating };
}
