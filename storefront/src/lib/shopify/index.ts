/**
 * Shopify module barrel export
 */

export { shopifyFetch, isShopifyConfigured } from './client';
export { PRODUCTS_QUERY, PRODUCT_BY_HANDLE_QUERY, SEARCH_PRODUCTS_QUERY } from './queries';
export {
    listProducts,
    getProductByHandle,
    getFeaturedProducts,
    getRelatedProducts,
    type ListProductsOptions,
    type ListProductsResult,
} from './service';
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

