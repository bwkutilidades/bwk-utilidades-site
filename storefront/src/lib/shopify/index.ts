/**
 * Shopify module barrel export
 */

export { shopifyFetch, isShopifyConfigured } from './client';
export { PRODUCTS_QUERY, PRODUCT_BY_HANDLE_QUERY, SEARCH_PRODUCTS_QUERY, COLLECTION_BY_HANDLE_QUERY } from './queries';
export {
    listProducts,
    getProductByHandle,
    getFeaturedProducts,
    getRelatedProducts,
    getProductsByCollectionHandle,
    type ListProductsOptions,
    type ListProductsResult,
} from './service';
export { CATEGORY_MAP, getCategoryLabel, type CategoryHandle } from './categories';
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

