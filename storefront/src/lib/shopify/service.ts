/**
 * Shopify Storefront API Service
 * 
 * High-level service functions that fetch and transform Shopify data
 * to the existing Product interface used in the BWK site.
 */

import { shopifyFetch, isShopifyConfigured } from './client';
import { PRODUCTS_QUERY, PRODUCT_BY_HANDLE_QUERY, SEARCH_PRODUCTS_QUERY, COLLECTION_BY_HANDLE_QUERY, COLLECTIONS_METADATA_QUERY } from './queries';
import type {
    ProductsQueryResponse,
    ProductByHandleQueryResponse,
    CollectionByHandleQueryResponse,
    CollectionsMetadataQueryResponse,
    CollectionMetadata,
    ShopifyProduct,
    ShopifyVariant,
} from './types';
import { getCategoryFallbackImage, CATEGORY_MAP, type CategoryHandle } from './categories';
import type { Product, ProductVariant, CategorySlug } from '@/lib/types';

// ========================================
// Transformers
// ========================================

/**
 * Map Shopify product type / tags to existing category slugs
 */
function mapToCategory(product: ShopifyProduct): CategorySlug {
    const productType = product.productType?.toLowerCase() || '';
    const tags = product.tags.map(t => t.toLowerCase());

    // Match based on product type or tags
    if (
        productType.includes('limpeza') ||
        productType.includes('higiene') ||
        tags.includes('limpeza') ||
        tags.includes('higiene')
    ) {
        return 'limpeza-e-higiene';
    }

    if (
        productType.includes('cozinha') ||
        productType.includes('bar') ||
        tags.includes('cozinha') ||
        tags.includes('bar')
    ) {
        return 'cozinha-e-bar';
    }

    // Default category
    return 'organizacao-e-utilidades';
}

/**
 * Transform Shopify variant to local ProductVariant
 */
function transformVariant(variant: ShopifyVariant): ProductVariant {
    return {
        id: variant.id,
        name: variant.title,
        price: parseFloat(variant.price.amount),
        inStock: variant.availableForSale,
    };
}

/**
 * Transform Shopify product to local Product interface
 */
function transformProduct(shopifyProduct: ShopifyProduct): Product {
    const variants = shopifyProduct.variants.edges.map(e => transformVariant(e.node));
    const firstVariant = variants[0];
    const price = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount);

    // Get images from the images connection
    const images = shopifyProduct.images.edges.map(e => e.node.url);

    // Fallback to featuredImage if no images in connection
    if (images.length === 0 && shopifyProduct.featuredImage?.url) {
        images.push(shopifyProduct.featuredImage.url);
    }

    // Fallback to placeholder if no images at all
    if (images.length === 0) {
        images.push('/placeholder.svg');
    }

    // Check for compare at price (original price)
    const firstShopifyVariant = shopifyProduct.variants.edges[0]?.node;
    const originalPrice = firstShopifyVariant?.compareAtPrice
        ? parseFloat(firstShopifyVariant.compareAtPrice.amount)
        : undefined;

    return {
        id: shopifyProduct.id,
        slug: shopifyProduct.handle,
        name: shopifyProduct.title,
        description: shopifyProduct.description || shopifyProduct.descriptionHtml || '',
        price,
        originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
        category: mapToCategory(shopifyProduct),
        images,
        specs: [], // Shopify doesn't have specs by default, could use metafields
        featured: shopifyProduct.tags.includes('featured') || shopifyProduct.tags.includes('destaque'),
        inStock: shopifyProduct.availableForSale,
        variants: variants.length > 1 ? variants : undefined,
        // Store the first variant ID for cart operations
        defaultVariantId: firstVariant?.id,
    };
}

// ========================================
// Service Functions
// ========================================

export interface ListProductsOptions {
    limit?: number;
    after?: string;
    search?: string;
}

export interface ListProductsResult {
    products: Product[];
    hasNextPage: boolean;
    endCursor: string | null;
}

/**
 * List products from Shopify
 * 
 * @param options - Query options
 * @returns List of transformed products with pagination info
 */
export async function listProducts(options: ListProductsOptions = {}): Promise<ListProductsResult> {
    const { limit = 12, after, search } = options;

    if (!isShopifyConfigured()) {
        console.warn('[Shopify Service] Shopify not configured, returning empty results');
        return { products: [], hasNextPage: false, endCursor: null };
    }

    try {
        let response: ProductsQueryResponse;

        if (search) {
            // Use search query for text searches
            response = await shopifyFetch<ProductsQueryResponse>(SEARCH_PRODUCTS_QUERY, {
                query: search,
                first: limit,
            });
        } else {
            // Regular listing
            response = await shopifyFetch<ProductsQueryResponse>(PRODUCTS_QUERY, {
                first: limit,
                after: after || null,
            });
        }

        const products = response.products.edges.map(edge => transformProduct(edge.node));

        return {
            products,
            hasNextPage: response.products.pageInfo.hasNextPage,
            endCursor: response.products.pageInfo.endCursor,
        };
    } catch (error) {
        console.error('[Shopify Service] Error listing products:', error);
        return { products: [], hasNextPage: false, endCursor: null };
    }
}

/**
 * Get a single product by handle (slug)
 * 
 * @param handle - Product handle/slug
 * @returns Transformed product or null if not found
 */
export async function getProductByHandle(handle: string): Promise<Product | null> {
    if (!isShopifyConfigured()) {
        console.warn('[Shopify Service] Shopify not configured');
        return null;
    }

    try {
        const response = await shopifyFetch<ProductByHandleQueryResponse>(PRODUCT_BY_HANDLE_QUERY, {
            handle,
        });

        if (!response.product) {
            return null;
        }

        return transformProduct(response.product);
    } catch (error) {
        console.error('[Shopify Service] Error getting product by handle:', error);
        return null;
    }
}

/**
 * Get featured products from Shopify
 * Products tagged with "featured" or "destaque" will be prioritized
 * 
 * @param limit - Number of products to return
 * @returns List of featured products
 */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
    const result = await listProducts({ limit: limit * 2 }); // Fetch more to filter

    // First, get products marked as featured
    const featured = result.products.filter(p => p.featured);

    // If not enough featured products, fill with regular products
    if (featured.length >= limit) {
        return featured.slice(0, limit);
    }

    const nonFeatured = result.products.filter(p => !p.featured);
    return [...featured, ...nonFeatured].slice(0, limit);
}

/**
 * Get related products (products in the same category)
 * 
 * @param productId - Current product ID to exclude
 * @param category - Category to filter by  
 * @param limit - Number of products to return
 * @returns List of related products
 */
export async function getRelatedProducts(
    productId: string,
    category?: CategorySlug,
    limit = 4
): Promise<Product[]> {
    const result = await listProducts({ limit: 12 });

    return result.products
        .filter(p => p.id !== productId)
        .filter(p => !category || p.category === category)
        .slice(0, limit);
}

/**
 * Get products from a Shopify collection by handle
 * 
 * @param handle - Collection handle/slug (e.g., "limpeza-e-higiene")
 * @param limit - Number of products to fetch
 * @returns List of products in the collection
 */
export async function getProductsByCollectionHandle(
    handle: string,
    limit = 24
): Promise<ListProductsResult> {
    if (!isShopifyConfigured()) {
        console.warn('[Shopify Service] Shopify not configured, returning empty results');
        return { products: [], hasNextPage: false, endCursor: null };
    }

    try {
        const response = await shopifyFetch<CollectionByHandleQueryResponse>(COLLECTION_BY_HANDLE_QUERY, {
            handle,
            first: limit,
        });

        if (!response.collection) {
            console.warn(`[Shopify Service] Collection '${handle}' not found`);
            return { products: [], hasNextPage: false, endCursor: null };
        }

        const products = response.collection.products.edges.map(edge => transformProduct(edge.node));

        return {
            products,
            hasNextPage: response.collection.products.pageInfo.hasNextPage,
            endCursor: response.collection.products.pageInfo.endCursor,
        };
    } catch (error) {
        console.error('[Shopify Service] Error getting products by collection:', error);
        return { products: [], hasNextPage: false, endCursor: null };
    }
}

// ========================================
// Category Collections (for Home page)
// ========================================

export interface CategoryCollectionData {
    handle: CategoryHandle;
    title: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
}

/**
 * Fetch metadata for all category collections
 * Used by the "Nossas Categorias" section on the Home page
 * 
 * Returns Shopify collection images when available, with local fallbacks
 */
export async function getCategoryCollections(): Promise<CategoryCollectionData[]> {
    if (!isShopifyConfigured()) {
        console.warn('[Shopify Service] Shopify not configured, using fallback images');
        return CATEGORY_MAP.map(cat => ({
            handle: cat.handle,
            title: cat.label,
            description: '',
            imageUrl: getCategoryFallbackImage(cat.handle),
            imageAlt: cat.label,
        }));
    }

    try {
        const response = await shopifyFetch<CollectionsMetadataQueryResponse>(COLLECTIONS_METADATA_QUERY, {});

        // Map aliases to handles
        const aliasToHandle: Record<string, CategoryHandle> = {
            limpezaEHigiene: 'limpeza-e-higiene',
            organizacaoEUtilidades: 'organizacao-e-utilidades',
            cozinhaEBar: 'cozinha-e-bar',
        };

        return CATEGORY_MAP.map(cat => {
            // Find the matching collection data from response
            const alias = Object.keys(aliasToHandle).find(key => aliasToHandle[key] === cat.handle);
            const collectionData = alias ? response[alias as keyof CollectionsMetadataQueryResponse] : null;

            // Use Shopify image if available, otherwise fallback
            const hasShopifyImage = collectionData?.image?.url;

            return {
                handle: cat.handle,
                title: collectionData?.title || cat.label,
                description: collectionData?.description || '',
                imageUrl: hasShopifyImage ? collectionData.image!.url : getCategoryFallbackImage(cat.handle),
                imageAlt: collectionData?.image?.altText || cat.label,
            };
        });
    } catch (error) {
        console.error('[Shopify Service] Error fetching category collections:', error);
        // Return fallback on error
        return CATEGORY_MAP.map(cat => ({
            handle: cat.handle,
            title: cat.label,
            description: '',
            imageUrl: getCategoryFallbackImage(cat.handle),
            imageAlt: cat.label,
        }));
    }
}
