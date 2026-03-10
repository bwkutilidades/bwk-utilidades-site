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
import { CATEGORY_MAP, CATEGORY_DESCRIPTIONS, type CategoryHandle } from './categories';
import {
    resolveCategoryImageWithSource,
    slugifyCategoryKey,
    type CategoryImageSource,
} from '@/lib/category-images';
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
        description: shopifyProduct.description || '',
        descriptionHtml: shopifyProduct.descriptionHtml || undefined,
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

const CATEGORY_ALIASES: Record<CategoryHandle, string[]> = {
    'limpeza-e-higiene': ['limpeza-e-higiene', 'limpeza-higiene', 'limpeza', 'higiene', 'produtos-de-limpeza'],
    'organizacao-e-utilidades': ['organizacao-e-utilidades', 'organizacao-utilidades', 'organizacao', 'utilidades'],
    'cozinha-e-bar': ['cozinha-e-bar', 'cozinha-bar', 'cozinha', 'bar', 'utensilios'],
};

function normalizeCategoryCandidates(handle: string, title: string): string[] {
    const normalizedHandle = slugifyCategoryKey(handle);
    const normalizedTitle = slugifyCategoryKey(title);

    return [normalizedHandle, normalizedTitle].filter(Boolean);
}

function matchPrimaryCategory(handle: string, title: string): CategoryHandle | null {
    const candidates = new Set(normalizeCategoryCandidates(handle, title));

    for (const category of CATEGORY_MAP) {
        if (
            candidates.has(slugifyCategoryKey(category.label))
            || CATEGORY_ALIASES[category.handle].some((alias) => candidates.has(alias))
        ) {
            return category.handle;
        }
    }

    return null;
}

function shouldLogCategoryDebug(): boolean {
    return import.meta.env.DEV
        && typeof window !== 'undefined'
        && window.location.pathname === '/solucoes';
}

function logCategoryCollectionDebug(
    receivedHandles: string[],
    collections: CategoryCollectionData[],
): void {
    if (!shouldLogCategoryDebug()) {
        return;
    }

    console.info('[Solucoes] Collections handles recebidos:', receivedHandles);
    console.table(
        collections.map((collection) => ({
            handle: collection.handle,
            title: collection.title,
            imageSource: collection.imageSource,
            imageUrl: collection.imageUrl,
        })),
    );
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
    const { limit = 24, after, search } = options;

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
                after: after || null,
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
 * Get featured products from Shopify.
 *
 * Strategy:
 *  1. Query products tagged "destaque" (Portuguese — preferred)
 *  2. If none found, query products tagged "featured" (English fallback)
 *  3. If still none found, fall back to the most recent products
 *
 * To control which products appear here, tag them with "destaque" in
 * Shopify Admin → Products → Tags.
 *
 * @param limit - Number of products to return
 * @returns List of featured products
 */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
    if (!isShopifyConfigured()) {
        return [];
    }

    for (const tag of ['destaque', 'featured']) {
        const result = await listProducts({ limit, search: `tag:${tag}` });
        if (result.products.length > 0) {
            return result.products.slice(0, limit);
        }
    }

    // Fallback: return most recently created products
    const fallback = await listProducts({ limit });
    return fallback.products.slice(0, limit);
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
    limit = 24,
    after?: string,
): Promise<ListProductsResult> {
    if (!isShopifyConfigured()) {
        console.warn('[Shopify Service] Shopify not configured, returning empty results');
        return { products: [], hasNextPage: false, endCursor: null };
    }

    // DIAGNÓSTICO: loga o handle enviado à API para facilitar depuração.
    // Se a collection retornar vazia, compare este valor com os handles reais
    // em: Shopify Admin → Products → Collections → (abrir collection) → URL.
    console.log(`[Shopify] getProductsByCollectionHandle → handle="${handle}"`);

    try {
        const response = await shopifyFetch<CollectionByHandleQueryResponse>(COLLECTION_BY_HANDLE_QUERY, {
            handle,
            first: limit,
            after: after || null,
        });

        if (!response.collection) {
            console.warn(
                `[Shopify] Collection "${handle}" não encontrada na API.\n` +
                `→ Verifique se o handle da collection no Shopify Admin corresponde a "${handle}".\n` +
                `→ Caminho no Shopify: Admin → Products → Collections → (abrir) → campo "Handle" em "SEO".`,
            );
            return { products: [], hasNextPage: false, endCursor: null };
        }

        console.log(
            `[Shopify] Collection "${handle}" encontrada: "${response.collection.title}" ` +
            `(${response.collection.products.edges.length} produtos nesta página)`,
        );

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
    handle: string;
    title: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    imageSource: CategoryImageSource;
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
        const fallbackCollections = CATEGORY_MAP.map((cat) => {
            const resolvedImage = resolveCategoryImageWithSource(null, cat.handle, cat.label);

            return {
                handle: cat.handle,
                title: cat.label,
                description: CATEGORY_DESCRIPTIONS[cat.handle] || '',
                imageUrl: resolvedImage.url,
                imageAlt: cat.label,
                imageSource: resolvedImage.source,
            };
        });

        logCategoryCollectionDebug(
            fallbackCollections.map((collection) => collection.handle),
            fallbackCollections,
        );

        return fallbackCollections;
    }

    try {
        const response = await shopifyFetch<CollectionsMetadataQueryResponse>(COLLECTIONS_METADATA_QUERY, {
            first: 100,
        });

        const receivedCollections = response.collections.edges.map((edge) => edge.node);

        // DIAGNÓSTICO: exibe todos os handles de collections retornados pelo Shopify.
        // Se as categorias aparecerem sem produtos, compare estes handles com os
        // slugs usados na URL (/catalogo?collection=<handle>).
        console.log(
            '[Shopify] Collections encontradas no Shopify:',
            receivedCollections.map((c) => `${c.handle} ("${c.title}")`),
        );

        const matchedCollections = new Map<CategoryHandle, CollectionMetadata>();

        for (const collection of receivedCollections) {
            const categoryHandle = matchPrimaryCategory(collection.handle, collection.title);

            if (categoryHandle && !matchedCollections.has(categoryHandle)) {
                matchedCollections.set(categoryHandle, collection);
            }
        }

        const normalizedCollections = CATEGORY_MAP.map((cat) => {
            const collectionData = matchedCollections.get(cat.handle);
            const resolvedHandle = collectionData?.handle || cat.handle;
            const resolvedTitle = collectionData?.title || cat.label;
            const resolvedImage = resolveCategoryImageWithSource(
                collectionData?.image?.url || null,
                resolvedHandle,
                resolvedTitle,
            );

            // Use the curated local description as primary to avoid Shopify
            // placeholder values (e.g. "Teste"). Falls back to Shopify description
            // if no local description is defined for the handle.
            const localDescription = CATEGORY_DESCRIPTIONS[cat.handle] || '';
            const shopifyDescription = collectionData?.description?.trim() || '';
            const description = localDescription || shopifyDescription;

            return {
                handle: resolvedHandle,
                title: resolvedTitle,
                description,
                imageUrl: resolvedImage.url,
                imageAlt: collectionData?.image?.altText || resolvedTitle,
                imageSource: resolvedImage.source,
            };
        });

        logCategoryCollectionDebug(
            receivedCollections.map((collection) => collection.handle),
            normalizedCollections,
        );

        return normalizedCollections;
    } catch (error) {
        console.error('[Shopify Service] Error fetching category collections:', error);
        const fallbackCollections = CATEGORY_MAP.map((cat) => {
            const resolvedImage = resolveCategoryImageWithSource(null, cat.handle, cat.label);

            return {
                handle: cat.handle,
                title: cat.label,
                description: CATEGORY_DESCRIPTIONS[cat.handle] || '',
                imageUrl: resolvedImage.url,
                imageAlt: cat.label,
                imageSource: resolvedImage.source,
            };
        });

        logCategoryCollectionDebug(
            fallbackCollections.map((collection) => collection.handle),
            fallbackCollections,
        );

        return fallbackCollections;
    }
}

export async function validateCatalogCoverage(): Promise<void> {
    if (!import.meta.env.DEV || !isShopifyConfigured()) {
        return;
    }

    try {
        const categoryCollections = await getCategoryCollections();
        const collectionHandles = Array.from(
            new Set(categoryCollections.map((collection) => collection.handle)),
        );

        const collectionIds = new Set<string>();

        for (const handle of collectionHandles) {
            let after: string | undefined;
            let hasNextPage = true;

            while (hasNextPage) {
                const result = await getProductsByCollectionHandle(handle, 100, after);

                for (const product of result.products) {
                    collectionIds.add(product.id);
                }

                hasNextPage = result.hasNextPage;
                after = result.endCursor || undefined;
            }
        }

        const catalogIds = new Set<string>();
        let after: string | undefined;
        let hasNextPage = true;

        while (hasNextPage) {
            const result = await listProducts({ limit: 100, after });

            for (const product of result.products) {
                catalogIds.add(product.id);
            }

            hasNextPage = result.hasNextPage;
            after = result.endCursor || undefined;
        }

        const missingInCatalog = Array.from(collectionIds).filter((id) => !catalogIds.has(id));
        const payload = {
            collectionHandles,
            collectionCount: collectionIds.size,
            catalogCount: catalogIds.size,
            missingInCatalog,
        };

        if (missingInCatalog.length > 0) {
            console.warn('[Catalogo][DEV] missingInCatalog detectado', payload);
            return;
        }

        console.info('[Catalogo][DEV] Cobertura validada', payload);
    } catch (error) {
        console.error('[Catalogo][DEV] Falha ao validar cobertura do catálogo:', error);
    }
}
