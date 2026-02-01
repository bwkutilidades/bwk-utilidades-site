/**
 * Hook for fetching products from Shopify
 * 
 * Provides loading states and caching via React Query.
 * Reusable across Home and Catalog pages.
 */

import { useQuery } from '@tanstack/react-query';
import { listProducts, getFeaturedProducts, isShopifyConfigured } from '@/lib/shopify';
import type { Product } from '@/lib/types';

interface UseShopifyProductsOptions {
    limit?: number;
    search?: string;
    enabled?: boolean;
}

interface UseShopifyProductsResult {
    products: Product[];
    loading: boolean;
    error: Error | null;
    hasNextPage: boolean;
    refetch: () => void;
}

/**
 * Hook to fetch products from Shopify
 * 
 * @param options - Query options
 * @returns Products, loading state, and error
 */
export function useShopifyProducts(options: UseShopifyProductsOptions = {}): UseShopifyProductsResult {
    const { limit = 12, search, enabled = true } = options;

    const query = useQuery({
        queryKey: ['shopify-products', limit, search],
        queryFn: async () => {
            const result = await listProducts({ limit, search });
            return result;
        },
        enabled: enabled && isShopifyConfigured(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });

    return {
        products: query.data?.products || [],
        loading: query.isLoading,
        error: query.error as Error | null,
        hasNextPage: query.data?.hasNextPage || false,
        refetch: query.refetch,
    };
}

/**
 * Hook to fetch featured products from Shopify
 * 
 * @param limit - Number of featured products to fetch
 * @returns Featured products, loading state, and error
 */
export function useShopifyFeaturedProducts(limit = 8): UseShopifyProductsResult {
    const query = useQuery({
        queryKey: ['shopify-featured-products', limit],
        queryFn: () => getFeaturedProducts(limit),
        enabled: isShopifyConfigured(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });

    return {
        products: query.data || [],
        loading: query.isLoading,
        error: query.error as Error | null,
        hasNextPage: false,
        refetch: query.refetch,
    };
}
