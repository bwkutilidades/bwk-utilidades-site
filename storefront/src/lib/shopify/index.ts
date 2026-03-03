/**
 * Shopify module barrel export
 */

export { shopifyFetch, isShopifyConfigured } from './client';
export { PRODUCTS_QUERY, PRODUCT_BY_HANDLE_QUERY, SEARCH_PRODUCTS_QUERY, COLLECTION_BY_HANDLE_QUERY, COLLECTIONS_METADATA_QUERY } from './queries';
export {
    listProducts,
    getProductByHandle,
    getFeaturedProducts,
    getRelatedProducts,
    getProductsByCollectionHandle,
    getCategoryCollections,
    validateCatalogCoverage,
    type ListProductsOptions,
    type ListProductsResult,
    type CategoryCollectionData,
} from './service';
export { CATEGORY_MAP, getCategoryLabel, getCategoryFallbackImage, CATEGORY_IMAGE_FALLBACK, type CategoryHandle } from './categories';
export {
    createCart,
    getCart,
    getCurrentCart,
    addLinesToCart,
    updateCartLines,
    removeCartLines,
    createOrUpdateCart,
    getCheckoutUrl,
    getStoredCartId,
    storeCartId,
    clearStoredCartId,
    type CartLineInput,
} from './cart';
export type * from './types';
