/**
 * Shopify Cart Service
 * 
 * Handles cart operations using Shopify Storefront Cart API.
 * Cart ID is persisted in localStorage for session continuity.
 */

import { shopifyFetch, isShopifyConfigured } from './client';
import {
    CART_CREATE_MUTATION,
    CART_LINES_ADD_MUTATION,
    CART_LINES_UPDATE_MUTATION,
    CART_LINES_REMOVE_MUTATION,
    CART_QUERY,
} from './queries';
import type {
    ShopifyCart,
    CartCreateResponse,
    CartLinesAddResponse,
    CartLinesUpdateResponse,
    CartLinesRemoveResponse,
    CartQueryResponse,
} from './types';

// ========================================
// Constants
// ========================================

const CART_ID_STORAGE_KEY = 'bwk_shopify_cart_id';

// ========================================
// Cart ID Management
// ========================================

/**
 * Get stored cart ID from localStorage
 */
export function getStoredCartId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(CART_ID_STORAGE_KEY);
}

/**
 * Store cart ID in localStorage
 */
export function storeCartId(cartId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_ID_STORAGE_KEY, cartId);
}

/**
 * Clear stored cart ID
 */
export function clearStoredCartId(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CART_ID_STORAGE_KEY);
}

// ========================================
// Cart Line Input Types
// ========================================

export interface CartLineInput {
    merchandiseId: string; // Shopify variant ID (gid://shopify/ProductVariant/xxx)
    quantity: number;
}

// ========================================
// Cart Service Functions
// ========================================

/**
 * Create a new Shopify cart with line items
 * 
 * @param lines - Array of line items to add
 * @returns Created cart or null on error
 */
export async function createCart(lines: CartLineInput[]): Promise<ShopifyCart | null> {
    if (!isShopifyConfigured()) {
        console.warn('[Shopify Cart] Shopify not configured');
        return null;
    }

    try {
        const response = await shopifyFetch<CartCreateResponse>(CART_CREATE_MUTATION, {
            input: {
                lines: lines.map(line => ({
                    merchandiseId: line.merchandiseId,
                    quantity: line.quantity,
                })),
            },
        });

        if (response.cartCreate.userErrors.length > 0) {
            console.error('[Shopify Cart] Create errors:', response.cartCreate.userErrors);
            return null;
        }

        const cart = response.cartCreate.cart;
        if (cart) {
            storeCartId(cart.id);
        }

        return cart;
    } catch (error) {
        console.error('[Shopify Cart] Error creating cart:', error);
        return null;
    }
}

/**
 * Get an existing cart by ID
 * 
 * @param cartId - Shopify cart ID
 * @returns Cart or null if not found
 */
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
    if (!isShopifyConfigured()) {
        console.warn('[Shopify Cart] Shopify not configured');
        return null;
    }

    try {
        const response = await shopifyFetch<CartQueryResponse>(CART_QUERY, {
            cartId,
        });

        return response.cart;
    } catch (error) {
        console.error('[Shopify Cart] Error getting cart:', error);
        // Clear stored cart ID if cart not found
        clearStoredCartId();
        return null;
    }
}

/**
 * Get the current cart from localStorage, or null if none exists
 */
export async function getCurrentCart(): Promise<ShopifyCart | null> {
    const cartId = getStoredCartId();
    if (!cartId) return null;

    const cart = await getCart(cartId);

    // If cart not found (expired, completed, etc.), clear storage
    if (!cart) {
        clearStoredCartId();
        return null;
    }

    return cart;
}

/**
 * Add lines to an existing cart
 * 
 * @param cartId - Shopify cart ID
 * @param lines - Array of line items to add
 * @returns Updated cart or null on error
 */
export async function addLinesToCart(
    cartId: string,
    lines: CartLineInput[]
): Promise<ShopifyCart | null> {
    if (!isShopifyConfigured()) {
        console.warn('[Shopify Cart] Shopify not configured');
        return null;
    }

    try {
        const response = await shopifyFetch<CartLinesAddResponse>(CART_LINES_ADD_MUTATION, {
            cartId,
            lines: lines.map(line => ({
                merchandiseId: line.merchandiseId,
                quantity: line.quantity,
            })),
        });

        if (response.cartLinesAdd.userErrors.length > 0) {
            console.error('[Shopify Cart] Add lines errors:', response.cartLinesAdd.userErrors);
            return null;
        }

        return response.cartLinesAdd.cart;
    } catch (error) {
        console.error('[Shopify Cart] Error adding lines:', error);
        return null;
    }
}

/**
 * Update line quantities in cart
 * 
 * @param cartId - Shopify cart ID
 * @param lines - Array of line updates { id, quantity }
 * @returns Updated cart or null on error
 */
export async function updateCartLines(
    cartId: string,
    lines: Array<{ id: string; quantity: number }>
): Promise<ShopifyCart | null> {
    if (!isShopifyConfigured()) {
        console.warn('[Shopify Cart] Shopify not configured');
        return null;
    }

    try {
        const response = await shopifyFetch<CartLinesUpdateResponse>(CART_LINES_UPDATE_MUTATION, {
            cartId,
            lines,
        });

        if (response.cartLinesUpdate.userErrors.length > 0) {
            console.error('[Shopify Cart] Update lines errors:', response.cartLinesUpdate.userErrors);
            return null;
        }

        return response.cartLinesUpdate.cart;
    } catch (error) {
        console.error('[Shopify Cart] Error updating lines:', error);
        return null;
    }
}

/**
 * Remove lines from cart
 * 
 * @param cartId - Shopify cart ID
 * @param lineIds - Array of line IDs to remove
 * @returns Updated cart or null on error
 */
export async function removeCartLines(
    cartId: string,
    lineIds: string[]
): Promise<ShopifyCart | null> {
    if (!isShopifyConfigured()) {
        console.warn('[Shopify Cart] Shopify not configured');
        return null;
    }

    try {
        const response = await shopifyFetch<CartLinesRemoveResponse>(CART_LINES_REMOVE_MUTATION, {
            cartId,
            lineIds,
        });

        if (response.cartLinesRemove.userErrors.length > 0) {
            console.error('[Shopify Cart] Remove lines errors:', response.cartLinesRemove.userErrors);
            return null;
        }

        return response.cartLinesRemove.cart;
    } catch (error) {
        console.error('[Shopify Cart] Error removing lines:', error);
        return null;
    }
}

/**
 * Create a cart or add to existing cart
 * 
 * @param lines - Array of line items
 * @returns Cart with checkoutUrl or null on error
 */
export async function createOrUpdateCart(lines: CartLineInput[]): Promise<ShopifyCart | null> {
    const existingCartId = getStoredCartId();

    if (existingCartId) {
        // Try to add to existing cart
        const existingCart = await getCart(existingCartId);

        if (existingCart) {
            // Add lines to existing cart
            const updatedCart = await addLinesToCart(existingCartId, lines);
            if (updatedCart) return updatedCart;
        }

        // If existing cart failed, clear and create new
        clearStoredCartId();
    }

    // Create new cart
    return createCart(lines);
}

/**
 * Get checkout URL for current cart
 * Creates cart if needed with provided lines
 * 
 * @param lines - Cart lines if cart needs to be created
 * @returns Checkout URL or null
 */
export async function getCheckoutUrl(lines?: CartLineInput[]): Promise<string | null> {
    // First, try to get existing cart
    const cartId = getStoredCartId();

    if (cartId) {
        const cart = await getCart(cartId);
        if (cart?.checkoutUrl) {
            return cart.checkoutUrl;
        }
        // Cart expired or completed
        clearStoredCartId();
    }

    // If lines provided, create new cart
    if (lines && lines.length > 0) {
        const cart = await createCart(lines);
        return cart?.checkoutUrl || null;
    }

    return null;
}
