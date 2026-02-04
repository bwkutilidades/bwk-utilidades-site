import { useState, useEffect } from 'react';
import { getCategoryCollections, type CategoryCollectionData } from '@/lib/shopify/service';

interface UseCategoryCollectionsResult {
    collections: CategoryCollectionData[];
    loading: boolean;
    error: Error | null;
}

/**
 * Hook to fetch category collections with Shopify images
 * Uses local fallback images if Shopify collection has no image
 */
export function useCategoryCollections(): UseCategoryCollectionsResult {
    const [collections, setCollections] = useState<CategoryCollectionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;

        async function fetchCollections() {
            try {
                const data = await getCategoryCollections();
                if (mounted) {
                    setCollections(data);
                    setLoading(false);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err : new Error('Failed to fetch collections'));
                    setLoading(false);
                }
            }
        }

        fetchCollections();

        return () => {
            mounted = false;
        };
    }, []);

    return { collections, loading, error };
}
