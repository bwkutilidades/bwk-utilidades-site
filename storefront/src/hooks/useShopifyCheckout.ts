/**
 * Hook for direct Shopify checkout
 * 
 * Handles creating a Shopify cart and redirecting to checkout
 * without intermediate pages.
 */

import { useState, useCallback } from 'react';
import { useCart } from '@/contexts/CartContext';
import { createCart, type CartLineInput } from '@/lib/shopify';

export interface UseShopifyCheckoutResult {
    /** Whether checkout is in progress */
    isCheckingOut: boolean;
    /** Error message if checkout failed */
    error: string | null;
    /** Initiate checkout - creates cart and redirects to Shopify */
    startCheckout: () => Promise<void>;
    /** Clear any error state */
    clearError: () => void;
}

/**
 * Hook to handle direct Shopify checkout redirect
 * 
 * Usage:
 * ```tsx
 * const { isCheckingOut, error, startCheckout } = useShopifyCheckout();
 * 
 * <Button onClick={startCheckout} disabled={isCheckingOut}>
 *   {isCheckingOut ? 'Processando...' : 'Finalizar Compra'}
 * </Button>
 * ```
 */
export function useShopifyCheckout(): UseShopifyCheckoutResult {
    const { items } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startCheckout = useCallback(async () => {
        // Validate cart has items
        if (items.length === 0) {
            setError('O carrinho está vazio.');
            return;
        }

        setIsCheckingOut(true);
        setError(null);

        try {
            // Build cart lines using variant IDs
            const lines: CartLineInput[] = items.map((item) => {
                // Priority: variantId (if user selected) > defaultVariantId > first variant
                let merchandiseId = item.variantId;

                if (!merchandiseId && item.product.defaultVariantId) {
                    merchandiseId = item.product.defaultVariantId;
                }

                if (!merchandiseId && item.product.variants?.[0]?.id) {
                    merchandiseId = item.product.variants[0].id;
                }

                if (!merchandiseId) {
                    // Log warning in development
                    if (import.meta.env.DEV) {
                        console.warn(
                            '[useShopifyCheckout] No variant ID found for product:',
                            item.product.name,
                            'Using product ID as fallback (may not work with Shopify Cart API)'
                        );
                    }
                    merchandiseId = item.product.id;
                }

                return {
                    merchandiseId,
                    quantity: item.quantity,
                };
            });

            // Create Shopify cart with lines
            const cart = await createCart(lines);

            if (!cart) {
                setError('Não foi possível criar o carrinho. Tente novamente.');
                setIsCheckingOut(false);
                return;
            }

            if (!cart.checkoutUrl) {
                setError('URL de checkout não disponível. Tente novamente.');
                setIsCheckingOut(false);
                return;
            }

            // Redirect to Shopify checkout
            // NOTE: We intentionally do NOT clear the local cart here.
            // The cart will be cleared when the user returns after completing the order,
            // or it can be cleared manually. This prevents the "empty cart" flash.
            window.location.assign(cart.checkoutUrl);

            // Keep isCheckingOut true to maintain loading state during redirect
            // The page will navigate away, so this state won't matter
        } catch (err) {
            console.error('[useShopifyCheckout] Error:', err);
            setError('Ocorreu um erro ao processar o checkout. Tente novamente.');
            setIsCheckingOut(false);
        }
    }, [items]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        isCheckingOut,
        error,
        startCheckout,
        clearError,
    };
}
